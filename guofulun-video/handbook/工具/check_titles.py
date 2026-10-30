# -*- coding: utf-8 -*-
"""检查发布文案：标题 ≤20 字且无前缀、经济学概念小节 80–150 字、话题标签 15–20 个、置顶评论没有互动提问。

用法：python check_titles.py <EPXX_发布文案.md>
做法：“## 标题”到下一个“## ”之间的每个代码框当一个标题；“## 这一集讲的经济学概念”下第一个代码框数字数；
      “## 话题标签”下第一个代码框数 #；“## 置顶评论”里找“评论区”“打 1”“你是……还是”这类互动提问。
"""
import re, sys

if len(sys.argv) < 2:
    sys.exit(__doc__)
text = open(sys.argv[1], encoding="utf-8").read()


def section(name):
    m = re.search(r"^## " + name + r".*?$(.*?)(?=^## |\Z)", text, re.S | re.M)
    return m.group(1) if m else ""


def blocks(s):
    return [b.strip() for b in re.findall(r"```\n(.*?)\n```", s, re.S)]


ok = True
titles = blocks(section("标题"))
for t in titles:
    bad = len(t) > 20 or "Vibe知识大赏" in t
    ok &= not bad
    print(f"{'✗' if bad else '✓'} {len(t):2d} 字  {t}")
if not 3 <= len(titles) <= 4:
    print(f"✗ 标题 {len(titles)} 个（应为 3–4 个）"); ok = False

concept = blocks(section("这一集讲的经济学概念"))
if concept:
    n = len(re.sub(r"\s", "", concept[0]))
    good = 80 <= n <= 160
    print(f"{'✓' if good else '⚠'} 经济学概念小节 {n} 字（模板写 80–150 字、“字数少，只讲核心”；超了建议压一压，不算不合格）")
else:
    print("✗ 没有“这一集讲的经济学概念”小节（10-28 起每集都写）"); ok = False

tags = blocks(section("话题标签"))
if tags:
    cnt = len(re.findall(r"#\S+", tags[0]))
    print(f"{'✓' if 15 <= cnt <= 20 else '✗'} 话题标签 {cnt} 个（应为 15–20 个）")
    ok &= 15 <= cnt <= 20

pin = "".join(blocks(section("置顶评论")))
if pin:
    ask = re.findall(r"评论区|打\s*1|打\s*2|你是.{0,12}还是|说说你", pin)
    print(f"{'✗' if ask else '✓'} 置顶评论{'有互动提问：' + '、'.join(ask) if ask else '没有互动提问'}")
    ok &= not ask
    print(f"{'✓' if pin.startswith('这一集的经济学') else '⚠'} 置顶评论{'先讲经济学' if pin.startswith('这一集的经济学') else '建议以“这一集的经济学：”开头（10-29）'}")
print("结论：", "合格" if ok else "请修改")
