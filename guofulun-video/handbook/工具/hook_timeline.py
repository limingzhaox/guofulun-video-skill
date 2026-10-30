# -*- coding: utf-8 -*-
"""开头时间线核对（★★★★★ 10-30）：第一句几秒念完、角色几秒开口、书名几秒、三问多长、几秒进故事、前 30 秒有没有角色台词。

用法：python hook_timeline.py epXX [开头场景数，默认 2：hook + menu]
标准：第一句“你有没有想过，＋本集问题”约 4 秒；本集角色紧接着开口（EP23 4.2 秒、EP25 6.5 秒）；第 3 句报《国富论》；三问一句 ≤6 秒；19–20 秒进故事；前 30 秒至少一次角色反问或顶嘴；全片 4–5 分钟。
"""
import json, os, sys

STUDIO = os.environ.get("GUOFULUN_STUDIO", r"D:\AI\短视频\studio")
if len(sys.argv) < 2:
    sys.exit(__doc__)
ep = sys.argv[1].lower()
n_open = int(sys.argv[2]) if len(sys.argv) > 2 else 2
tl = json.load(open(os.path.join(STUDIO, "src", ep, "timeline.json"), encoding="utf-8"))
fps = tl["fps"]
sec = lambda fr: fr / fps
L = tl["lines"]
first = L[0]
print(f"第一句：{sec(first['from']):.1f}–{sec(first['from'] + first['dur']):.1f} 秒（时长 {sec(first['dur']):.2f} 秒，标准约 4 秒）  {first['text']}")
who = next((l for l in L if l.get("who")), None)
if who:
    print(f"角色第一次开口：{sec(who['from']):.1f} 秒（标准：第一句念完就开口）  {who['who']}：{who['text']}")
book = next((l for l in L if "国富论" in l["text"]), None)
if book:
    print(f"报书名：第 {L.index(book) + 1} 句，{sec(book['from']):.1f} 秒  {book['text'][:30]}…")
qs = [l for l in L if l["text"].count("？") >= 3]
if qs:
    q = qs[0]
    print(f"三问：{sec(q['from']):.1f} 秒起，时长 {sec(q['dur']):.1f} 秒（标准 ≤6）")
if len(tl["scenes"]) > n_open:
    story = tl["scenes"][n_open]
    print(f"进故事（第 {n_open + 1} 个场景 {story['id']}）：{sec(story['from']):.1f} 秒（标准 19–20）")
early = [l for l in L if l.get("who") and sec(l["from"]) <= 30]
print(f"前 30 秒角色台词 {len(early)} 句：" + "；".join(f"{l['who']}@{sec(l['from']):.1f}s" for l in early))
print(f"全片 {sec(tl['total']):.1f} 秒（{int(sec(tl['total']) // 60)} 分 {sec(tl['total']) % 60:.0f} 秒；标准 240–300 秒）")
