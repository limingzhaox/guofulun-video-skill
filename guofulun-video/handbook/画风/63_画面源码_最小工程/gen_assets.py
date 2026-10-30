# -*- coding: utf-8 -*-
"""根据某一集的剧本生成：逐句配音(public/epXX/audio)、配乐(public/epXX)、共用音效(public/sfx)、时间轴(src/epXX/timeline.json，含逐字时间戳)。

配音引擎：
  volc（默认）：火山引擎 豆包语音合成 2.0，V3 HTTP 单向流式接口。密钥从 studio/.env 读取：
      VOLC_TTS_API_KEY=...                       （新版控制台）
    或 VOLC_APP_ID=... 与 VOLC_ACCESS_KEY=...     （旧版控制台）
  edge：微软 edge-tts（免费备用），加 `--engine edge`

用法：python gen_assets.py ep02        （读 episodes/ep02/script.json）
"""
import asyncio, base64, hashlib, json, os, re, subprocess, sys, uuid, wave
import urllib.request, urllib.error

import numpy as np
import imageio_ffmpeg

ROOT = os.path.dirname(os.path.abspath(__file__))
ENGINE_OVERRIDE = sys.argv[sys.argv.index("--engine") + 1] if "--engine" in sys.argv else None
ARGS = [a for a in sys.argv[1:] if not a.startswith("--") and a != ENGINE_OVERRIDE]
EP = (ARGS[0] if ARGS else "ep01").lower()  # 例如 ep02
SCRIPT = os.path.join(ROOT, "episodes", EP, "script.json")
EP_PUBLIC = os.path.join(ROOT, "public", EP)
AUD = os.path.join(EP_PUBLIC, "audio")
SFX = os.path.join(ROOT, "public", "sfx")
TIMELINE = os.path.join(ROOT, "src", EP, "timeline.json")
FF = imageio_ffmpeg.get_ffmpeg_exe()
SR = 44100
FPS = 30
GAP_LINE, GAP_SCENE, LEAD_IN, TAIL = 0.10, 0.32, 0.25, 1.6
VOLC_URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional"
os.makedirs(AUD, exist_ok=True)
os.makedirs(SFX, exist_ok=True)


def plain(s):
    return re.sub(r"[【】]", "", s)


def load_env():
    env = dict(os.environ)
    path = os.path.join(ROOT, ".env")
    if os.path.exists(path):
        for raw in open(path, encoding="utf-8-sig"):
            line = raw.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                env.setdefault(key.strip(), val.strip().strip('"').strip("'"))
    return env


def volc_headers(env, cfg=None):
    # 自制（声音复刻）音色 S_ 开头，要走 seed-icl-2.0 资源；剧本 tts 里写 "resource_id" 即可
    rid = (cfg or {}).get("resource_id") or env.get("VOLC_RESOURCE_ID", "seed-tts-2.0")
    h = {"Content-Type": "application/json", "X-Api-Resource-Id": rid, "X-Api-Request-Id": str(uuid.uuid4())}
    if env.get("VOLC_TTS_API_KEY"):
        h["X-Api-Key"] = env["VOLC_TTS_API_KEY"]
    elif env.get("VOLC_APP_ID") and env.get("VOLC_ACCESS_KEY"):
        h["X-Api-App-Id"] = env["VOLC_APP_ID"]
        h["X-Api-Access-Key"] = env["VOLC_ACCESS_KEY"]
    else:
        sys.exit("没有找到火山引擎密钥：请在 studio/.env 里填写 VOLC_TTS_API_KEY（或 VOLC_APP_ID + VOLC_ACCESS_KEY）。\n"
                 "临时改用 edge-tts：python gen_assets.py ep01 --engine edge")
    return h


def volc_tts(text, cfg, context, section, env):
    """返回 (mp3 字节, 逐字时间戳 [{w,s,e}])"""
    additions = {"section_id": section}
    if context:
        additions["context_texts"] = [context]
    body = {
        "user": {"uid": "guofulun-studio"},
        "req_params": {
            "text": text,
            "speaker": cfg["voice"],
            "audio_params": {"format": "mp3", "sample_rate": 24000, "speech_rate": cfg.get("speech_rate", 0), "enable_subtitle": True},
            "additions": json.dumps(additions, ensure_ascii=False),
        },
    }
    req = urllib.request.Request(VOLC_URL, data=json.dumps(body, ensure_ascii=False).encode(), headers=volc_headers(env, cfg), method="POST")
    audio, words = bytearray(), []
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            for raw in resp:
                raw = raw.strip()
                if not raw:
                    continue
                msg = json.loads(raw)
                code = msg.get("code", 0)
                if code not in (0, 20000000):
                    raise RuntimeError(f"火山引擎返回错误 {code}: {msg.get('message')}")
                if msg.get("data"):
                    audio += base64.b64decode(msg["data"])
                sent = msg.get("sentence") or {}
                for w in sent.get("words") or []:
                    words.append({"w": w["word"], "s": float(w["startTime"]), "e": float(w["endTime"])})
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"火山引擎 HTTP {e.code}: {e.read().decode(errors='ignore')[:300]}")
    if not audio:
        raise RuntimeError("火山引擎没有返回音频")
    return bytes(audio), words


async def edge_mp3(text, cfg):
    import edge_tts
    comm = edge_tts.Communicate(text, cfg.get("edge_voice", "zh-CN-YunxiNeural"), rate=cfg.get("edge_rate", "+15%"))
    buf = bytearray()
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            buf += chunk["data"]
    return bytes(buf), []


def tighten_pauses(x, max_pause):
    """句内停顿超过 max_pause 秒的，从中间剪到 max_pause（剪口两边各 10ms 淡入淡出）。
    返回 (新音频, 剪口列表 [(原起点秒, 剪掉秒数)])，用来平移逐字时间戳。EP51 起：自制音色句内停顿偏长，听着发闷"""
    hop, win = int(0.01 * SR), int(0.02 * SR)
    n = max(0, (len(x) - win) // hop)
    rms = np.array([np.sqrt((x[i * hop:i * hop + win] ** 2).mean()) for i in range(n)])
    quiet = rms < 10 ** (-40 / 20)
    keep, cuts, i = np.ones(len(x), bool), [], 0
    while i < n:
        if not quiet[i]:
            i += 1
            continue
        j = i
        while j < n and quiet[j]:
            j += 1
        s, e = i * hop + win // 2, j * hop + win // 2
        if (e - s) / SR > max_pause:
            c0, c1 = s + int(max_pause / 2 * SR), e - int(max_pause / 2 * SR)
            keep[c0:c1] = False
            cuts.append((c0 / SR, (c1 - c0) / SR))
        i = j
    if not cuts:
        return x, []
    y = x.copy()
    f = int(0.01 * SR)
    for c0s, cl in cuts:  # 剪口两边做短淡出淡入，避免咔哒声
        c0, c1 = int(c0s * SR), int((c0s + cl) * SR)
        y[max(0, c0 - f):c0] *= np.linspace(1, 0, c0 - max(0, c0 - f))
        y[c1:c1 + f] *= np.linspace(0, 1, len(y[c1:c1 + f]))
    return y[keep], cuts


def shift_time(t, cuts):
    """原时间 → 剪掉停顿后的时间"""
    out = t
    for c0, cl in cuts:
        if t >= c0 + cl:
            out -= cl
        elif t > c0:
            out -= t - c0
    return out


def finish_audio(mp3, words, out_wav, max_pause=None):
    """解码 → 精确裁掉首尾静音 →（可选）压短句内长停顿 → 写 wav；逐字时间戳同步平移"""
    tmp = out_wav + ".mp3"
    open(tmp, "wb").write(mp3)
    raw = subprocess.run([FF, "-loglevel", "error", "-i", tmp, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    os.remove(tmp)
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    loud = np.where(np.abs(x) > 10 ** (-42 / 20))[0]
    a = max(0, int(loud[0] - 0.03 * SR)) if len(loud) else 0
    b = min(len(x), int(loud[-1] + 0.08 * SR)) if len(loud) else len(x)
    x = x[a:b]
    lead = a / SR
    words = [{"w": w["w"], "s": max(0, w["s"] - lead), "e": max(0, w["e"] - lead)} for w in words]
    if max_pause:
        x, cuts = tighten_pauses(x, max_pause)
        words = [{"w": w["w"], "s": shift_time(w["s"], cuts), "e": shift_time(w["e"], cuts)} for w in words]
    with wave.open(out_wav, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
    return [{"w": w["w"], "s": round(w["s"], 3), "e": round(w["e"], 3)} for w in words]


VOICE_DB = -19.0  # 每句配音统一到的响度（有声部分的 RMS，dBFS）


def level_voice(path, gentle=False):
    """逐句音量统一：原始配音存为 .raw.wav，每次从原始文件重新处理，可重复执行。
    先用压缩器压平句内起伏，再把整句有声部分的响度拉到 VOICE_DB，最后软限幅防止爆音。
    gentle（剧本顶层 "level": "gentle"，EP51 起）：1.6:1 轻压缩、只拉平一半的响度差，留住句内重音和句与句的轻重（10-29 用户嫌自制音色“没有抑扬顿挫”）"""
    raw = path[:-4] + ".raw.wav"
    if not os.path.exists(raw):
        os.replace(path, raw)
    comp = "acompressor=threshold=-30dB:ratio=1.6:attack=8:release=120:knee=8" if gentle else "acompressor=threshold=-26dB:ratio=3:attack=4:release=90:knee=6"
    pcm = subprocess.run([FF, "-loglevel", "error", "-i", raw, "-af", comp,
                          "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, np.int16).astype(np.float64) / 32768
    win = int(0.05 * SR)
    n = len(x) // win
    rms = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1)) if n else np.array([1e-3])
    active = rms[rms > np.percentile(rms, 30)]
    db = 20 * np.log10(max(1e-9, np.sqrt((active ** 2).mean())))
    y = x * 10 ** ((VOICE_DB - db) * (0.5 if gentle else 1.0) / 20)
    y = 0.92 * np.tanh(y / 0.92)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((y * 32767).astype(np.int16).tobytes())


def even_words(text, dur):
    """没有时间戳时（edge），按字数均分"""
    chars = [c for c in text]
    n = max(1, len(chars))
    return [{"w": c, "s": round(i / n * dur, 3), "e": round((i + 1) / n * dur, 3)} for i, c in enumerate(chars)]


def wav_seconds(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


def save(name, x, folder=SFX):
    x = np.asarray(x, np.float64)
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    with wave.open(os.path.join(folder, name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t_(sec):
    return np.arange(int(SR * sec)) / SR


def env(n, d):
    return np.exp(-np.arange(n) / SR / d)


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, "same")


def make_sfx():
    rng = np.random.default_rng(0)
    t = t_(1.4)
    save("ding.wav", (np.sin(2 * np.pi * 1760 * t) + 0.4 * np.sin(2 * np.pi * 2637 * t) + 0.2 * np.sin(2 * np.pi * 3520 * t)) * env(len(t), 0.35))
    t = t_(0.9)
    f = 110 * np.exp(-t * 5) + 38
    save("boom.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.3))
    n = int(SR * 0.55)
    w = lowpass(rng.standard_normal(n), 6) * np.sin(np.linspace(0, np.pi, n)) ** 3
    save("whoosh.wav", w)
    t = t_(0.12)
    f = 900 * np.exp(-t * 25) + 300
    save("pop.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.04))
    n = int(SR * 0.04)
    save("tick.wav", rng.standard_normal(n) * env(n, 0.004))
    n = int(SR * 0.09)
    save("type.wav", (rng.standard_normal(n) * env(n, 0.006) + 0.6 * np.sin(2 * np.pi * 180 * t_(0.09)) * env(n, 0.02)))
    n = int(SR * 0.3)
    save("paper.wav", (rng.standard_normal(n) - lowpass(rng.standard_normal(n), 3)) * np.sin(np.linspace(0, np.pi, n)) ** 2)
    t = t_(0.5)
    save("hammer.wav", (np.sin(2 * np.pi * 2200 * t) * 0.5 + np.sin(2 * np.pi * 3300 * t) * 0.3) * env(len(t), 0.08) + rng.standard_normal(len(t)) * env(len(t), 0.01))
    t = t_(0.35)
    save("steam.wav", lowpass(rng.standard_normal(len(t)), 2) * np.sin(np.linspace(0, np.pi, len(t))))
    t = t_(0.8)
    save("buzz.wav", np.sign(np.sin(2 * np.pi * 240 * t)) * 0.3 * ((t * 8) % 1 < 0.5) * env(len(t), 0.5))


def pluck(freq, dur, decay=0.996):
    n = int(SR * dur)
    p = max(2, int(SR / freq))
    buf = np.random.default_rng(int(freq)).uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = decay * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


def make_bgm(total):
    """温和的钢琴感拨弦 + 柔和铺底，C-G-Am-F，88bpm。"""
    n = int(SR * (total + 2))
    out = np.zeros(n)
    beat = 60 / 88
    prog = [[48, 55, 60, 64, 67], [43, 55, 59, 62, 67], [45, 57, 60, 64, 69], [41, 53, 57, 60, 65]]
    cache = {}
    bar = 0
    t = 0.0
    while t < total + 1:
        ch = prog[bar % 4]
        tt = np.arange(int(SR * beat * 4)) / SR
        pad = sum(np.sin(2 * np.pi * note(m + 12) * tt) * 0.06 + np.sin(2 * np.pi * note(m + 12) * 1.003 * tt) * 0.06 for m in ch[1:4])
        pad *= np.minimum(1, tt / 0.6) * np.minimum(1, (tt[-1] - tt + 1e-3) / 0.6)
        s = int(t * SR)
        e = min(n, s + len(pad))
        out[s:e] += pad[: e - s]
        bass = pluck(note(ch[0]), beat * 2, 0.998) * 0.5
        e = min(n, s + len(bass))
        out[s:e] += bass[: e - s]
        for k, m in enumerate([ch[2], ch[3], ch[4], ch[3], ch[2] + 12, ch[4], ch[3], ch[4]]):
            key = m + 12
            if key not in cache:
                cache[key] = pluck(note(key), 1.2)
            ps = int((t + k * beat / 2) * SR)
            pe = min(n, ps + len(cache[key]))
            if ps < n:
                out[ps:pe] += cache[key][: pe - ps] * 0.32
        t += beat * 4
        bar += 1
    save("bgm_main.wav", lowpass(out, 3), EP_PUBLIC)
    tt = np.arange(n) / SR
    drone = (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 82.4 * tt) + 0.3 * np.sin(2 * np.pi * 110.5 * tt)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.15 * tt))
    save("bgm_dark.wav", drone, EP_PUBLIC)


def harpsichord(freq, dur):
    """拨弦古钢琴感：Karplus–Strong 拨弦 + 高八度的副弦（羽管键琴的双弦），衰减偏快、音色偏亮"""
    a = pluck(freq, dur, 0.9925)
    b = pluck(freq * 2, dur, 0.988) * 0.35
    n = min(len(a), len(b))
    return (a[:n] + b[:n]) * np.exp(-np.arange(n) / SR / 0.9)


def make_bgm_baroque(total, scenes):
    """按场景编排的配乐（v3）：亮色段落用十六分音符分解和弦，冷调段落只留稀疏的低音和八分音符，暗场静音（交给低沉铺底）。
    和声走卡农式进行 D–A–Bm–F#m–G–D–G–A，84bpm；低频（<120Hz）压低，避免合成配乐发闷"""
    n = int(SR * (total + 2))
    out = np.zeros(n)
    beat = 60 / 84
    prog = [[50, 57, 62, 66], [45, 57, 61, 64], [47, 54, 59, 62], [42, 54, 57, 61], [43, 55, 59, 62], [38, 54, 57, 62], [43, 55, 59, 62], [45, 57, 61, 64]]
    cache = {}

    def note_at(m, dur):
        key = (m, round(dur, 2))
        if key not in cache:
            cache[key] = harpsichord(note(m), dur)
        return cache[key]

    def mood_at(t):
        for sc in scenes:
            if sc["from"] / FPS <= t < (sc["from"] + sc["dur"]) / FPS:
                return "dark" if sc.get("dark") else "dusk" if sc.get("tone") == "dusk" else "bright"
        return "bright"

    def put(clip, t, vol):
        s = int(t * SR)
        if s >= n:
            return
        e = min(n, s + len(clip))
        out[s:e] += clip[: e - s] * vol

    t, bar = 0.0, 0
    while t < total + 1:
        ch = prog[bar % len(prog)]
        mood = mood_at(t)
        if mood != "dark":
            put(note_at(ch[0], beat * 2), t, 0.55)                       # 低音
            put(note_at(ch[0], beat * 2), t + beat * 2, 0.45)
            if mood == "bright":
                pattern = [ch[1], ch[2] + 12, ch[3], ch[2] + 12] * 4         # 十六分音符分解和弦（阿尔贝蒂低音式）
                for k, m in enumerate(pattern):
                    put(note_at(m + 12, beat), t + k * beat / 4, 0.22 if k % 4 else 0.3)
            else:
                for k, m in enumerate([ch[1], ch[3], ch[2], ch[3]]):          # 冷调：八分音符，稀疏、轻
                    put(note_at(m + 12, beat * 1.5), t + k * beat, 0.16)
        t += beat * 4
        bar += 1
    # 低频压一压：减去低通后的一部分，让 120Hz 以下大约低 3dB
    low = np.convolve(out, np.ones(180) / 180, "same")
    save("bgm_main.wav", out - 0.3 * low, EP_PUBLIC)
    tt = np.arange(n) / SR
    drone = (np.sin(2 * np.pi * 73.4 * tt) + 0.6 * np.sin(2 * np.pi * 110 * tt) + 0.3 * np.sin(2 * np.pi * 146.8 * tt)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.12 * tt))
    save("bgm_dark.wav", drone, EP_PUBLIC)


def piano_tone(m, vel):
    """合成钢琴音：带轻微非谐性的泛音列 + 两根弦的微失谐（拍频）+ 先快后慢的两段衰减 + 很短的击弦噪声。高力度更亮。"""
    f0 = note(m)
    dur = 5.5 if m < 55 else 4.5
    t = np.arange(int(SR * dur)) / SR
    out = np.zeros_like(t)
    T0 = float(np.clip(5.0 * (110 / f0) ** 0.5, 0.7, 6.5))
    for n in range(1, 12):
        fn = n * f0 * np.sqrt(1 + 0.00032 * n * n)
        if fn > 8500:
            break
        amp = (1 / n ** 1.15) * vel ** (0.15 * (n - 1))
        Tn = T0 / (1 + 0.4 * (n - 1))
        e = 0.5 * np.exp(-t / (Tn * 0.16)) + 0.5 * np.exp(-t / Tn)
        out += amp * e * (np.sin(2 * np.pi * fn * t) + 0.8 * np.sin(2 * np.pi * fn * 1.0007 * t + 0.7 * n)) / 1.8
    out *= np.minimum(1, t / 0.005)
    rng = np.random.default_rng(m)
    k = int(0.03 * SR)
    hammer = np.convolve(rng.standard_normal(k), np.ones(6) / 6, "same") * np.exp(-np.arange(k) / SR / 0.004) * 0.08
    out[:k] += hammer
    return out * vel


def make_bgm_piano(total, scenes, v2=False):
    """心理号配乐（xl01 起）：安静的夜晚钢琴，66bpm，按场景的 mood 换织体。
    night 深夜：分解和弦只弹前半小节，留白多；warm 转好：八分音符分解和弦 + 低音五度；busy 赶工：八分音符的轻跳音；
    tense 紧绷：低音踏板 + 一个反复的高音，偶尔碰一下不协和音；dark 代价：两小节一个低音，几乎静下来；resolve 结尾：大调长和弦。
    带 hush 的场景前留两拍真静音。主题动机（E-D-C-G，“要是我早点开始”）在开头和“又是开头那句话”出现，结尾变成上行的 C-D-E-G。"""
    from scipy.signal import fftconvolve, butter, sosfilt
    n = int(SR * (total + 4))
    out = np.zeros(n)
    beat = 60 / (74 if v2 else 66)  # v2（心理号 EP02 起，剧本 "music_v": 2）：稍快一点，配轻打击乐和心跳
    bar = beat * 4
    CH = {
        "Am9": [45, 60, 64, 67, 71], "F": [41, 57, 60, 64, 69], "C/E": [40, 55, 60, 64, 67], "G6": [43, 59, 62, 64, 67],
        "Em7": [40, 55, 59, 62, 67], "Dm9": [38, 53, 57, 60, 64], "C": [36, 55, 60, 64, 67], "Cmaj9": [36, 59, 62, 64, 67],
    }
    PROG = {"night": ["Am9", "F", "C/E", "G6"], "busy": ["Am9", "F", "C/E", "G6"], "tense": ["Am9", "Am9", "F", "F"],
            "dark": ["Am9", "Am9", "F", "F"], "warm": ["F", "G6", "Em7", "Am9"], "resolve": ["F", "G6", "C", "Cmaj9"]}
    cache = {}

    def put(m, at, vel, length):
        key = (m, round(vel, 2))
        if key not in cache:
            cache[key] = piano_tone(m, vel)
        clip = cache[key].copy()
        L = int(length * SR)
        if L < len(clip):  # 制音器：音符时值到了以后 0.35 秒内收掉，避免和弦之间糊成一片
            clip[L:] *= np.exp(-np.arange(len(clip) - L) / SR / 0.35)
        s = int(at * SR)
        if s >= n:
            return
        e = min(n, s + len(clip))
        out[s:e] += clip[: e - s]

    def scene_at(t):
        for sc in scenes:
            if sc["from"] / FPS <= t < (sc["from"] + sc["dur"]) / FPS:
                return sc
        return scenes[-1]

    motif_at = {}
    for sc in scenes:
        if sc["id"] in ("hook", "shield"):
            motif_at[sc["id"]] = ([76, 74, 72, 67], sc["from"] / FPS)
        if sc["id"] == "ending":
            motif_at[sc["id"]] = ([72, 74, 76, 79], sc["from"] / FPS)
    hush_t = [sc["from"] / FPS for sc in scenes if sc.get("hush")]
    if v2:  # 规范 M-03：主题动机开头出现一次、最低点低八度出现一次、结尾转成上行大调
        motif_at = {scenes[0]["id"]: ([76, 74, 72, 67], scenes[0]["from"] / FPS)}
        low = next((sc for sc in scenes if sc.get("mood") == "dark"), None)
        if low:
            motif_at[low["id"]] = ([64, 62, 60, 55], low["from"] / FPS + 1.0)
        end = next((sc for sc in scenes if sc["id"] == "ending"), None)
        if end:
            motif_at[end["id"]] = ([72, 74, 76, 79], end["from"] / FPS)
    pc = np.zeros(n)  # 打击乐和心跳单独一轨，少加混响

    def hit(kind, at, vel):
        s = int(at * SR)
        if s >= n:
            return
        if kind == "kick":
            tt = np.arange(int(0.25 * SR)) / SR
            x = np.sin(2 * np.pi * np.cumsum(62 * np.exp(-tt * 9) + 44) / SR) * np.exp(-tt / 0.12)
        elif kind == "shaker":
            k = int(0.05 * SR)
            r = np.random.default_rng(s).standard_normal(k)
            x = (r - np.convolve(r, np.ones(4) / 4, "same")) * np.exp(-np.arange(k) / SR / 0.012) * 0.5
        else:  # heart：心跳“咚咚”两下
            tt = np.arange(int(0.5 * SR)) / SR
            one = lambda d: np.sin(2 * np.pi * 52 * (tt - d)) * np.exp(-np.maximum(0, tt - d) / 0.07) * (tt >= d)
            x = one(0) + 0.7 * one(0.24)
        e = min(n, s + len(x))
        pc[s:e] += x[: e - s] * vel

    def progress(sc, t):
        return min(1.0, max(0.0, (t - sc["from"] / FPS) / max(0.1, sc["dur"] / FPS)))

    t, k = 0.0, 0
    while t < total + 1:
        sc = scene_at(t + 0.01)
        mood = sc.get("mood", "night")
        if any(h - beat * 2.5 <= t + bar and t < h for h in hush_t):
            # 这一小节和 hush 场景相交：只弹到 hush 前两拍
            h = next(h for h in hush_t if h - beat * 2.5 <= t + bar and t < h)
            cut = h - beat * 2
        else:
            cut = None
        prog = PROG.get(mood, PROG["night"])
        ch = CH[prog[k % 4]]
        notes = []  # (相对拍, 音高, 力度, 时值拍)
        if mood == "night":
            notes += [(0, ch[0], 0.42, 4), (0, ch[0] + 12, 0.22, 4)]
            notes += [(0.5 * i, ch[1 + i], 0.30 - 0.03 * i, 3.5 - 0.5 * i) for i in range(4)]
            if k % 2 == 1:
                notes.append((3, ch[4] + 12, 0.18, 1))
        elif mood == "warm":
            notes += [(0, ch[0], 0.40, 2), (2, ch[0] + 7, 0.30, 2)]
            pat = [1, 2, 3, 2, 4, 3, 2, 3]
            notes += [(0.5 * i, ch[pat[i]], 0.24 if i % 2 else 0.29, 1.5) for i in range(8)]
            if k % 4 == 0:
                notes.append((0, ch[4] + 12, 0.22, 4))
        elif mood == "busy":
            notes += [(0, ch[0], 0.40, 4)]
            pat = [2, 3, 2, 4, 2, 3, 2, 4]
            notes += [(0.5 * i, ch[pat[i]] + 12, 0.22 if i % 2 else 0.27, 0.35) for i in range(8)]
        elif mood == "tense":
            notes += [(0, 33 if k % 2 == 0 else 33, 0.38, 8)] if k % 2 == 0 else []
            notes += [(i, 76, 0.18 + (0.04 if i == 0 else 0), 0.9) for i in range(4)]
            if k % 4 == 3:
                notes.append((2.5, 77, 0.16, 1.2))
            if k % 2 == 0:
                notes.append((0, ch[1], 0.2, 4))
        elif mood == "dark":
            if k % 2 == 0:
                notes += [(0, ch[0] - 12 if ch[0] > 40 else ch[0], 0.40, 8), (2, ch[2], 0.14, 6)]
            else:
                notes += [(3, 83, 0.10, 3)]
        elif mood == "resolve":
            notes += [(0, ch[0], 0.40, 4), (0, ch[0] + 12, 0.22, 4)]
            notes += [(0.25 * i, ch[1 + i], 0.26, 4 - 0.25 * i) for i in range(4)]
        elif mood == "bright":  # v2：回忆、关系好的时候，八分音符分解和弦 + 低音五度
            notes += [(0, ch[0], 0.40, 2), (2, ch[0] + 7, 0.30, 2)]
            pat = [1, 3, 2, 4, 1, 3, 2, 3]
            notes += [(0.5 * i, ch[pat[i]] + (12 if i in (3, 4) else 0), 0.25 if i % 2 else 0.30, 1.0) for i in range(8)]
        elif mood == "rise":  # v2：行动之前，织体越来越密
            p = progress(sc, t)
            step = 1.0 if p < 0.35 else 0.5 if p < 0.7 else 0.25
            notes += [(0, ch[0], 0.36 + 0.1 * p, 4)]
            i = 0
            while i * step < 4:
                notes.append((i * step, ch[1 + i % 4] + 12, 0.18 + 0.12 * p, step * 1.5))
                i += 1
        if v2:  # 打击乐：bright / busy 底鼓 + 沙锤，rise 后半段加底鼓；tense / dark 心跳
            perc = []
            if mood in ("bright", "busy"):
                perc += [(0, "kick", 0.55), (2, "kick", 0.45)] + [(0.5 * i, "shaker", 0.30 if i % 2 else 0.18) for i in range(8)]
            elif mood == "rise" and progress(sc, t) > 0.5:
                perc += [(0, "kick", 0.45), (1, "kick", 0.35), (2, "kick", 0.45), (3, "kick", 0.35)]
            elif mood == "tense":
                perc += [(0, "heart", 0.55), (2, "heart", 0.5)]
            elif mood == "dark" and k % 2 == 0:
                perc += [(0, "heart", 0.35)]
            for (b, kind, vel) in perc:
                if cut is None or t + b * beat < cut:
                    hit(kind, t + b * beat, vel)
        for (b, m, vel, L) in notes:
            at = t + b * beat
            if cut is not None and at >= cut:
                continue
            put(m, at, vel, L * beat)
        t += bar
        k += 1
    for key, (mot, t0) in motif_at.items():
        start = t0 + 0.3
        for i, m in enumerate(mot):
            put(m, start + i * beat, 0.30, 2 * beat if i == 3 else beat)
    # 混响：2.6 秒的指数衰减噪声当冲激响应，低通后湿声 28%
    ir_t = np.arange(int(SR * 2.6)) / SR
    rng = np.random.default_rng(7)
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t / 0.55)
    ir = sosfilt(butter(2, 3500, "low", fs=SR, output="sos"), ir)
    ir = np.concatenate([np.zeros(int(0.02 * SR)), ir])
    ir /= np.sqrt((ir ** 2).sum())
    wet = fftconvolve(out, ir)[:n]
    mix = 0.78 * out + 0.42 * wet + 0.5 * pc
    mix = sosfilt(butter(2, 5200, "low", fs=SR, output="sos"), mix)   # 柔一点，去掉合成感最重的高频
    mix = sosfilt(butter(1, 70, "high", fs=SR, output="sos"), mix)     # 去掉闷的超低频
    save("bgm_main.wav", mix, EP_PUBLIC)
    tt = np.arange(n) / SR
    drone = (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 82.4 * tt)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.1 * tt))
    save("bgm_dark.wav", drone, EP_PUBLIC)


async def main():
    spec = json.load(open(SCRIPT, encoding="utf-8"))
    cfg = spec["tts"]
    engine = ENGINE_OVERRIDE or cfg.get("engine", "volc")
    env = load_env()
    section = str(uuid.uuid5(uuid.NAMESPACE_URL, SCRIPT))  # 同一集共用上下文，语气连贯
    lines, scenes = [], []
    gap_line, gap_scene = spec.get("gap_line", GAP_LINE), spec.get("gap_scene", GAP_SCENE)  # 心理号这种舒缓的讲述，句间停顿要长一些
    t = LEAD_IN
    for sc in spec["scenes"]:
        s0 = t
        context = sc.get("context", cfg.get("context", ""))
        sgap = sc.get("gap", gap_line)  # 心理号：每个场景可以单独设句间停顿（fast 0.22 / slow 0.5 / talk 0.32）
        scfg = {**cfg, "speech_rate": sc["rate"]} if "rate" in sc else cfg  # 每个场景可以单独设旁白语速
        for i, text in enumerate(sc["lines"]):
            # 句末加 ⏸：这句之后停顿一下，留给画面“砸”出重点；每多一个 ⏸ 多停 0.45 秒（小测试留给观众猜答案用）
            hold = 0.45 * (len(text) - len(text.rstrip("⏸")))
            text = text.rstrip("⏸")
            # 心理号 v2.0：行首写〔slow〕的句子放慢（语速 slow_rate，前后多停），配乐在这里停一拍再重拍进入
            slow = text.startswith("〔slow〕")
            if slow:
                text = text[len("〔slow〕"):]
                t += spec.get("slow_pre", 0.5)
            # v5 角色台词：行首写“狗：”“猫：”，用剧本 tts.cast 里这个角色自己的音色、语速和语气说明
            who, vcfg, vctx, vsec = None, scfg, context, section
            m = re.match(r"^([^：:]{1,4})[：:]", text)
            if m and m.group(1) in cfg.get("cast", {}):
                who = m.group(1)
                text = text[m.end():]
                vcfg = {**cfg, **cfg["cast"][who]}
                vctx = cfg["cast"][who].get("context", "")
                vsec = str(uuid.uuid5(uuid.NAMESPACE_URL, SCRIPT + who))
            if slow and not who:
                vcfg = {**vcfg, "speech_rate": spec.get("slow_rate", 0)}
            key = f"{engine}|{vcfg['voice'] if engine == 'volc' else vcfg.get('edge_voice')}|{vcfg.get('speech_rate')}|{vctx}|{plain(text)}"
            if spec.get("max_pause"):  # EP51 起：压短句内长停顿；没设的集 key 不变，旧配音缓存照用
                key += f"|mp{spec['max_pause']}"
            h = hashlib.md5(key.encode()).hexdigest()[:10]
            fn = f"{sc['id']}_{i}_{h}.wav"
            path = os.path.join(AUD, fn)
            meta = path + ".json"
            if not (os.path.exists(path) and os.path.exists(meta)):
                for attempt in range(3):
                    try:
                        mp3, words = volc_tts(plain(text), vcfg, vctx, vsec, env) if engine == "volc" else await edge_mp3(plain(text), vcfg)
                        break
                    except RuntimeError as e:
                        if attempt == 2 or "HTTP 4" in str(e):
                            sys.exit(str(e))
                        await asyncio.sleep(2)
                if os.path.exists(path[:-4] + ".raw.wav"):
                    os.remove(path[:-4] + ".raw.wav")
                words = finish_audio(mp3, words, path, spec.get("max_pause"))
                json.dump(words, open(meta, "w", encoding="utf-8"), ensure_ascii=False)
                print(f"  配音 {sc['id']}#{i} ✓")
            level_voice(path, spec.get("level") == "gentle")
            d = wav_seconds(path)
            words = json.load(open(meta, encoding="utf-8")) or even_words(plain(text), d)
            lines.append({"scene": sc["id"], "i": i, "text": text, "file": f"{EP}/audio/{fn}",
                          "from": round(t * FPS), "dur": max(1, round(d * FPS)), "words": words, **({"who": who} if who else {}), **({"slow": True} if slow else {})})
            t += d + (spec.get("slow_gap", 0.45) if slow else sgap) + hold
        t += gap_scene - sgap
        scenes.append({"id": sc["id"], "from": round(s0 * FPS), **({"dark": True} if sc.get("dark") else {}), **({"tone": sc["tone"]} if sc.get("tone") else {}),
                       **({"hush": True} if sc.get("hush") else {}),
                       **({"mood": sc["mood"]} if sc.get("mood") else {}), **({"label": sc["label"]} if sc.get("label") else {}),
                       **({"calm": True} if sc.get("calm") else {}), **({"energy": sc["energy"]} if sc.get("energy") else {}),
                       **({"resolve": True} if sc.get("resolve") else {})})
        t += sc.get("pause", 0)  # 场景之后额外留白（秒），用来给重点“喘口气”
    total = t + TAIL
    # v4 冷开场：第一个场景从第 0 帧开始（台词仍在 LEAD_IN 处开口），否则前几帧是一张空白纸
    if scenes and spec.get("cold"):
        scenes[0]["from"] = 0
    for k, sc in enumerate(scenes):
        end = scenes[k + 1]["from"] if k + 1 < len(scenes) else round(total * FPS)
        sc["dur"] = end - sc["from"]
    out = {"fps": FPS, "total": round(total * FPS), "meta": spec["meta"],
           "bgm": {"main": f"{EP}/bgm_main.wav", "dark": f"{EP}/bgm_dark.wav"}, "scenes": scenes, "lines": lines}
    os.makedirs(os.path.dirname(TIMELINE), exist_ok=True)
    json.dump(out, open(TIMELINE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if not os.path.exists(os.path.join(SFX, "ding.wav")):
        make_sfx()
    if spec.get("music") == "baroque":
        make_bgm_baroque(total, scenes)
    elif spec.get("music") == "piano_emotive":  # 心理号 EP03 起：情绪钢琴，跟着剧本的 energy 曲线起伏，〔slow〕句落到谷底再爆发
        from pianomusic import make_piano_emotive
        spans = [(l["from"] / FPS, (l["from"] + l["dur"]) / FPS) for l in lines if l.get("slow")]
        save("bgm_main.wav", make_piano_emotive(total, scenes, spans, piano_tone, SR, FPS), EP_PUBLIC)
    elif spec.get("music") == "chip":  # 心理号 v2.0：芯片音乐，〔slow〕句处停一拍再重拍进入，calm 场景收一点
        from chipmusic import make_chip
        breaks = [l["from"] / FPS for l in lines if l.get("slow")]
        calm = [(s["from"] / FPS, (s["from"] + s["dur"]) / FPS) for s in scenes if s.get("calm")]
        save("bgm_main.wav", make_chip(total, breaks, calm, SR, key=spec.get("chip_key", "am"), horn=spec.get("chip_horn", False)), EP_PUBLIC)
    elif spec.get("music") == "piano":
        make_bgm_piano(total, scenes, v2=spec.get("music_v") == 2)
    else:
        make_bgm(total)
    if spec.get("bgm_db"):  # EP51 起：剧本顶层 "bgm_db": -4 = 这一集的配乐整体压低几 dB（轻后期的人声更有起伏，配乐要相应让一点）
        bp = os.path.join(EP_PUBLIC, "bgm_main.wav")
        with wave.open(bp) as w:
            prm, x = w.getparams(), np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64)
        with wave.open(bp, "wb") as w:
            w.setparams(prm)
            w.writeframes(np.clip(x * 10 ** (spec["bgm_db"] / 20), -32768, 32767).astype(np.int16).tobytes())
    print(f"配音引擎 {engine}，总时长 {total:.1f}s，{len(lines)} 句")
    for sc in scenes:
        print(f"  {sc['id']:8s} {sc['from'] / FPS:6.1f}s  {sc['dur'] / FPS:5.1f}s")


if __name__ == "__main__":
    asyncio.run(main())
