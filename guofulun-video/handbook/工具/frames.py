# -*- coding: utf-8 -*-
"""成片按句抽帧，拼成联系表（质检用）。

用法：
  python frames.py <成片.mp4> <timeline.json> <输出目录> [比例=0.75]

  比例：每句话的第几成处抽帧（0.75 = 这句说到四分之三时）。建议抽两轮：0.8 和 0.92；看句中用 0.55。
输出：<输出目录>\\f00.png … 每句一张（432×768），以及 sheet0.png、sheet1.png …（每页 7 列 × 3 行 = 21 句）。
依赖：pip install imageio-ffmpeg pillow
"""
import json, os, subprocess, sys

import imageio_ffmpeg
from PIL import Image

if len(sys.argv) < 4:
    sys.exit(__doc__)
video, tl_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
frac = float(sys.argv[4]) if len(sys.argv) > 4 else 0.75
os.makedirs(out, exist_ok=True)
tl = json.load(open(tl_path, encoding="utf-8"))
ff = imageio_ffmpeg.get_ffmpeg_exe()

paths = []
for i, l in enumerate(tl["lines"]):
    t = (l["from"] + l["dur"] * frac) / tl["fps"]
    p = os.path.join(out, f"f{i:02d}.png")
    subprocess.run([ff, "-y", "-loglevel", "error", "-ss", f"{t:.2f}", "-i", video, "-frames:v", "1", "-vf", "scale=432:768", p], check=True)
    paths.append(p)

cols, rows_per_sheet = 7, 3
per = cols * rows_per_sheet
for s in range(0, len(paths), per):
    chunk = paths[s:s + per]
    rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new("RGB", (432 * cols, 768 * rows), "white")
    for k, p in enumerate(chunk):
        r, c = divmod(k, cols)
        sheet.paste(Image.open(p), (c * 432, r * 768))
    sheet.save(os.path.join(out, f"sheet{s // per}.png"))

# 句号对照表：方便从联系表上的位置找回是哪一句
with open(os.path.join(out, "句号对照.txt"), "w", encoding="utf-8") as fp:
    for i, l in enumerate(tl["lines"]):
        fp.write(f"f{i:02d}  页{i // per} 第{(i % per) // cols + 1}行第{i % cols + 1}列  [{l['scene']}#{l['i']}]  {l['text']}\n")
print(len(paths), "帧，输出在", out)
