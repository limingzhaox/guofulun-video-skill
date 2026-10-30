# -*- coding: utf-8 -*-
"""一键出片：python produce.py ep02

依次完成：配音与时间轴 → 类型检查 → 渲染成片 → 响度标准化(-14 LUFS) → 渲染封面 → 导出字幕与剧本，
全部放进 D:\\AI\\短视频\\<该集文件夹>\\。
成片、三张封面、发布文案的文件名前带集号（10-28 用户定），例如 EP21_成片.mp4、EP21_封面_3比4.png、EP21_发布文案.md；
字幕、剧本、知识卡、审核记录照旧不带。以前没带集号的旧文件，出片时一起存进 _历史版本（发布文案直接改名，内容不动）。
可选参数：--skip-audio（剧本没改时跳过配音） --cover-only（只重出封面） --remaster（只重做响度和限幅，用 _cache 里的原始渲染）
          --rename（不出片，只把文件夹里旧的无集号文件改成带集号的名字）
          --entry=src/solo51.tsx（10-29：换一个只登记本集的渲染入口；别的会话正在做的集出错、总入口打包失败时用，不传就是 src/index.ts）
"""
import json, os, re, shutil, subprocess, sys

import imageio_ffmpeg

STUDIO = os.path.dirname(os.path.abspath(__file__))
HOME = os.path.dirname(STUDIO)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FF = imageio_ffmpeg.get_ffmpeg_exe()
NPX = "npx.cmd" if os.name == "nt" else "npx"
ENTRY = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--entry=")), "src/index.ts")


def run(cmd, **kw):
    print("›", " ".join(cmd) if isinstance(cmd, list) else cmd)
    subprocess.run(cmd, check=True, cwd=STUDIO, **kw)


def loudnorm_linear(src, dst, target=-14.0):
    """两遍响度标准化：先测量，再整体线性增益到 -14 LUFS（不做动态压缩，避免音量忽大忽小）"""
    probe = subprocess.run([FF, "-hide_banner", "-i", src, "-af", f"loudnorm=I={target}:TP=-1.5:LRA=20:print_format=json", "-f", "null", "-"],
                           capture_output=True, text=True, encoding="utf-8", errors="ignore").stderr
    m = json.loads(probe[probe.rindex("{"): probe.rindex("}") + 1])
    flt = (f"loudnorm=I={target}:TP=-1.5:LRA=20:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
           f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}"
           ",aresample=192000,alimiter=limit=0.76:level=false:attack=1:release=60,aresample=48000")  # v5：4 倍采样率上限幅，连采样点之间的真峰值一起压住（10-20 EP10 蜡笔版不升采样测到 +0.5 dBFS）  # 线性增益后用限幅兜底（约 -2 dB）：要留出采样点之间的真峰值和 AAC 编码过冲，成片真峰值才能不超过 -1 dBFS（0.89、0.86 时 EP06 故事版都测到 -0.9）
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", src, "-c:v", "copy", "-af", flt, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", dst], check=True)


def srt(tl, path):
    ts = lambda fr: (lambda ms: f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}")(round(fr / tl["fps"] * 1000))
    with open(path, "w", encoding="utf-8") as f:
        for i, l in enumerate(tl["lines"], 1):
            f.write(f"{i}\n{ts(l['from'])} --> {ts(l['from'] + l['dur'])}\n{re.sub('[【】]', '', l['text'])}\n\n")


def script_md(spec, tl, path):
    m = spec["meta"]
    out = [f"# EP{m['ep']:02d}｜{m['title']}", "", f"**原著**：{m['chapter']}　**时长**：{tl['total'] / tl['fps']:.0f} 秒　**配音**：{spec['tts']['voice']}", ""]
    for sc in spec["scenes"]:
        out.append(f"## {sc['id']}" + ("（暗场）" if sc.get("dark") else ""))
        out += [f"- {re.sub('[【】]', '', s)}" for s in sc["lines"]]
        out.append("")
    if spec.get("facts"):
        out += ["## 事实核查（原著出处）", *[f"- {x}" for x in spec["facts"]], ""]
    open(path, "w", encoding="utf-8").write("\n".join(out))


def archive(path):
    """覆盖前把旧文件存进同目录的 _历史版本，文件名带上原来的修改时间"""
    if not os.path.exists(path):
        return
    import datetime
    hist = os.path.join(os.path.dirname(path), "_历史版本")
    os.makedirs(hist, exist_ok=True)
    stamp = datetime.datetime.fromtimestamp(os.path.getmtime(path)).strftime("%m%d_%H%M")
    name, ext = os.path.splitext(os.path.basename(path))
    shutil.move(path, os.path.join(hist, f"{name}_{stamp}{ext}"))


NAMED = ["成片.mp4", "封面.png", "封面_3比4.png", "封面_横屏.png", "发布文案.md"]  # 这几样文件名前带集号


def out(folder, comp, base):
    """带集号的文件名：EP21 + 成片.mp4 → EP21_成片.mp4"""
    return os.path.join(folder, f"{comp}_{base}")


def archive_both(folder, comp, base):
    """覆盖前把旧版存进 _历史版本：10-28 以前没带集号的旧名字和现在带集号的名字都算"""
    archive(os.path.join(folder, base))
    archive(out(folder, comp, base))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    ep = (args[0] if args else "").lower()
    if not re.fullmatch(r"ep\d{2}[a-z]?", ep):  # 末尾可带一个字母，例如 ep06s = EP06 故事版
        sys.exit("用法：python produce.py ep02（或 ep06s 这类带后缀的版本）")
    spec = json.load(open(os.path.join(STUDIO, "episodes", ep, "script.json"), encoding="utf-8"))
    comp = ep.upper()
    folder = os.path.join(HOME, spec["meta"]["folder"])
    os.makedirs(folder, exist_ok=True)

    if "--rename" in sys.argv:
        for base in NAMED:
            old, new = os.path.join(folder, base), out(folder, comp, base)
            if os.path.exists(old) and not os.path.exists(new):
                shutil.move(old, new)
                print(f"改名：{base} → {os.path.basename(new)}")
            elif os.path.exists(old):
                print(f"跳过：{base}（{os.path.basename(new)} 已经有了，两个都留着，请人工看一眼）")
        print("完成：", folder)
        return

    cache = os.path.join(STUDIO, "_cache")
    os.makedirs(cache, exist_ok=True)
    raw_keep = os.path.join(cache, f"{ep}_render.mp4")  # 无损画面的原始渲染留一份：只改混音时用 --remaster 跳过渲染
    if "--remaster" in sys.argv and os.path.exists(raw_keep):
        final = out(folder, comp, "成片.mp4")
        archive_both(folder, comp, "成片.mp4")
        loudnorm_linear(raw_keep, final)
        print("完成（只重做混音）：", final)
        return
    if "--cover-only" not in sys.argv:
        if "--skip-audio" not in sys.argv:
            run([sys.executable, "gen_assets.py", ep], env={**os.environ, "PYTHONIOENCODING": "utf-8"})
        if ENTRY == "src/index.ts":
            run([NPX, "tsc", "--noEmit", "-p", "."])
        else:  # 单集入口：别的会话正在改的集有类型错误时不拦本集，只看本集目录和入口文件报的错
            print("›", NPX, "tsc --noEmit -p .（只看", f"src/{ep}/", "和", ENTRY, "）")
            r = subprocess.run([NPX, "tsc", "--noEmit", "-p", "."], cwd=STUDIO, capture_output=True, text=True, encoding="utf-8", errors="ignore")
            mine = [l for l in r.stdout.splitlines() if l.startswith((f"src/{ep}/", ENTRY))]
            if mine:
                print("\n".join(mine))
                sys.exit("本集有类型错误，先改掉再出片")
        raw = os.path.join(folder, "_render.mp4")
        run([NPX, "remotion", "render", ENTRY, comp, raw, "--crf=18", f"--browser-executable={EDGE}", "--log=error"])
        final = out(folder, comp, "成片.mp4")
        archive_both(folder, comp, "成片.mp4")
        loudnorm_linear(raw, final)
        shutil.move(raw, raw_keep)
        tl = json.load(open(os.path.join(STUDIO, "src", ep, "timeline.json"), encoding="utf-8"))
        srt(tl, os.path.join(folder, "字幕.srt"))
        script_md(spec, tl, os.path.join(folder, "剧本.md"))
        card = os.path.join(STUDIO, "episodes", ep, "知识卡.md")
        if os.path.exists(card):
            shutil.copy(card, os.path.join(folder, "知识卡.md"))
    archive_both(folder, comp, "封面.png")
    run([NPX, "remotion", "still", ENTRY, f"{comp}-Cover", out(folder, comp, "封面.png"), f"--browser-executable={EDGE}", "--log=error"])
    # 3:4 版：抖音主页格子的裁切比例，发布时上传这张作为封面
    archive_both(folder, comp, "封面_3比4.png")
    run([NPX, "remotion", "still", ENTRY, f"{comp}-Cover34", out(folder, comp, "封面_3比4.png"), f"--browser-executable={EDGE}", "--log=error"])
    # 横屏版 4:3（1440×1080，EP06 起，index.ts 里导出了 CoverWide 的集才有）：横屏视频、合集、其他平台用
    idx = os.path.join(STUDIO, "src", ep, "index.ts")
    if os.path.exists(idx) and "CoverWide" in open(idx, encoding="utf-8").read():
        archive_both(folder, comp, "封面_横屏.png")
        run([NPX, "remotion", "still", ENTRY, f"{comp}-Cover43", out(folder, comp, "封面_横屏.png"), f"--browser-executable={EDGE}", "--log=error"])
    note = out(folder, comp, "发布文案.md")
    legacy = os.path.join(folder, "发布文案.md")
    if not os.path.exists(note) and os.path.exists(legacy):
        shutil.move(legacy, note)  # 10-28 以前的无集号发布文案：直接改名，内容不动
        print("发布文案.md 已改名为", os.path.basename(note))
    elif not os.path.exists(note):
        shutil.copy(os.path.join(HOME, "模板", "发布文案模板.md"), note)
        print(f"已从模板生成 {os.path.basename(note)}，记得填写")
    print("完成：", folder)


if __name__ == "__main__":
    main()
