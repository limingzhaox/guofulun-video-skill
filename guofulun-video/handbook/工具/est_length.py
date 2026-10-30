# -*- coding: utf-8 -*-
"""配音前估片长，并数“书里”“斯密”“《国富论》”出现几次。

用法：python est_length.py epXX [基准集，默认 ep23]
做法：拿一集已经配过音的（有 src/基准集/timeline.json）算出“每个字几秒”，再按本集剧本的字数、⏸ 个数、句数估算。
      角色台词（行首“名字：”）不算名字；开头场景 rate 14 会比估算慢一点。
"""
import json, os, re, sys

STUDIO = os.environ.get("GUOFULUN_STUDIO", r"D:\AI\短视频\studio")  # 工程不在这里时设环境变量 GUOFULUN_STUDIO
if len(sys.argv) < 2:
    sys.exit(__doc__)
ep = sys.argv[1].lower()
base = (sys.argv[2] if len(sys.argv) > 2 else "ep23").lower()


def stats(e):
    d = json.load(open(os.path.join(STUDIO, "episodes", e, "script.json"), encoding="utf-8"))
    cast = set(d.get("tts", {}).get("cast", {}).keys())
    chars = pauses = lines = 0
    texts = []
    for sc in d["scenes"]:
        for ln in sc["lines"]:
            lines += 1
            pauses += ln.count("⏸")
            m = re.match(r"^([^：:]{1,4})[：:]", ln)
            t = ln[m.end():] if m and m.group(1) in cast else ln
            t = t.replace("〔slow〕", "")
            texts.append(t)
            chars += len(re.sub(r"[，。：；？！、“”‘’《》（）⏸·…\s,.:;?!()\-—]", "", t))
    return chars, pauses, lines, texts


bc, bp, bl, _ = stats(base)
tl = json.load(open(os.path.join(STUDIO, "src", base, "timeline.json"), encoding="utf-8"))
total = tl["total"] / tl["fps"]
per_char = (total - bp * 0.45 - bl * 0.35 - 1.85) / bc
c, p, l, texts = stats(ep)
est = c * per_char + p * 0.45 + l * 0.35 + 1.85
print(f"基准 {base}：{bc} 字、{bp} 个⏸、{bl} 句、实测 {total:.1f} 秒 → 每字约 {per_char:.3f} 秒")
print(f"{ep}：{c} 字、{p} 个⏸、{l} 句 → 估计 {est:.0f} 秒（{int(est // 60)} 分 {est % 60:.0f} 秒）")
print("标准集 225–270 秒（3:45–4:30）；3 分钟试验 170–195 秒（2:50–3:15）")
joined = "".join(texts)
print(f"“书里” {joined.count('书里')} 次；“斯密” {joined.count('斯密')} 次（≤2）；“《国富论》” {joined.count('《国富论》')} 次")
