# -*- coding: utf-8 -*-
"""检查顶部关键词 <Keyword text=… /> 有没有和同一场景的字幕一字不差（规矩：关键词不复读字幕）。

用法：python kwdup.py epXX
输出：DUP（这个关键词整个出现在这一场的某句台词里，要换成提炼词、数字或书里原话）/ ok。
做法：去掉标点后，看关键词是不是某句台词的子串；角色名前缀按剧本 tts.cast 去掉。只能查写成字符串的 text，
      写成 JSX（带 <span> 的）要自己看。
"""
import glob, json, os, re, sys

STUDIO = os.environ.get("GUOFULUN_STUDIO", r"D:\AI\短视频\studio")  # 工程不在这里时设环境变量 GUOFULUN_STUDIO
if len(sys.argv) < 2:
    sys.exit(__doc__)
ep = sys.argv[1].lower()
tl = json.load(open(os.path.join(STUDIO, "src", ep, "timeline.json"), encoding="utf-8"))
spec = json.load(open(os.path.join(STUDIO, "episodes", ep, "script.json"), encoding="utf-8"))
cast = "|".join(map(re.escape, spec.get("tts", {}).get("cast", {}).keys())) or "^$"
norm = lambda t: re.sub(r"[，。：；？！、“”‘’《》⏸·…\s→⇄=,.:;?!vs]", "", t)
lines = {}
for l in tl["lines"]:
    lines.setdefault(l["scene"], []).append(norm(re.sub(rf"^({cast})：", "", l["text"])))
dups = total = 0
for fn in sorted(glob.glob(os.path.join(STUDIO, "src", ep, "scenes*.tsx"))):
    src = open(fn, encoding="utf-8").read()
    for m in re.finditer(r'useLines\("(\w+)"\)(.*?)(?=useLines\("|\Z)', src, re.S):
        sc, body = m.group(1), m.group(2)
        for k in re.finditer(r"<Keyword\s+text=\{?([^}]*?)\}?\s+at=", body):
            for t in re.findall(r'"([^"]+)"', k.group(1)):
                total += 1
                n = norm(t)
                hit = [x for x in lines.get(sc, []) if n and n in x]
                if hit:
                    dups += 1
                print(("DUP " if hit else "ok  ") + sc + "  " + t)
print(f"结论：{total} 个关键词，{dups} 个复读字幕")
