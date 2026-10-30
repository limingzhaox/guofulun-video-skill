# -*- coding: utf-8 -*-
"""检查画面代码里的锚点词：W(i, "词") 的词在第 i 句里有没有、是不是唯一。

用法：python anchors_check.py epXX
输出：MISS（这句里没有这个词，帧会算错）、DUP（这句里出现不止一次，会锚到第一个）、NO LINE（句号越界）。
做法：按 useWordAt("场景") 分段，找每段里的 W(数字, "词")；需要先跑过 gen_assets（有 timeline.json）。
"""
import glob, json, os, re, sys

STUDIO = os.environ.get("GUOFULUN_STUDIO", r"D:\AI\短视频\studio")  # 工程不在这里时设环境变量 GUOFULUN_STUDIO
if len(sys.argv) < 2:
    sys.exit(__doc__)
ep = sys.argv[1].lower()
tl = json.load(open(os.path.join(STUDIO, "src", ep, "timeline.json"), encoding="utf-8"))
lines = {}
for l in tl["lines"]:
    lines.setdefault(l["scene"], []).append(l["text"].replace("【", "").replace("】", ""))
bad = ok = dup = 0
for fn in sorted(glob.glob(os.path.join(STUDIO, "src", ep, "scenes*.tsx"))):
    src = open(fn, encoding="utf-8").read()
    for m in re.finditer(r'useWordAt\("(\w+)"\)(.*?)(?=useWordAt\("|\Z)', src, re.S):
        sc, body = m.group(1), m.group(2)
        if sc not in lines:
            print("NO SCENE", sc, os.path.basename(fn)); bad += 1; continue
        for w in re.finditer(r'\bW\((\d+),\s*"([^"]+)"\)', body):
            i, word = int(w.group(1)), w.group(2)
            ls = lines[sc]
            if i >= len(ls):
                print("NO LINE", sc, i, word); bad += 1; continue
            n = ls[i].count(word)
            if n == 0:
                print("MISS   ", sc, i, word, "|", ls[i]); bad += 1
            else:
                ok += 1
                if n > 1:
                    print("DUP    ", sc, i, word, "|", ls[i]); dup += 1
print(f"结论：{ok} 个锚点正常，{bad} 个错误，{dup} 个重复")
