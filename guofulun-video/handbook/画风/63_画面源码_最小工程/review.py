# -*- coding: utf-8 -*-
"""抽帧检查：python review.py ep02

渲染半尺寸无声预览，在每句台词 75% 处抽一帧，拼成总览图，保存到 studio/_review/epXX_总览.png
"""
import json, os, subprocess, sys

import imageio_ffmpeg
from PIL import Image

STUDIO = os.path.dirname(os.path.abspath(__file__))
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FF = imageio_ffmpeg.get_ffmpeg_exe()
NPX = "npx.cmd" if os.name == "nt" else "npx"

ep = (sys.argv[1] if len(sys.argv) > 1 else "").lower()
out_dir = os.path.join(STUDIO, "_review")
os.makedirs(out_dir, exist_ok=True)
preview = os.path.join(out_dir, f"{ep}_预览.mp4")
subprocess.run([NPX, "remotion", "render", "src/index.ts", ep.upper(), preview, "--scale=0.5", "--muted", f"--browser-executable={EDGE}", "--log=error"], check=True, cwd=STUDIO)
tl = json.load(open(os.path.join(STUDIO, "src", ep, "timeline.json"), encoding="utf-8"))
frames = []
for i, line in enumerate(tl["lines"]):
    png = os.path.join(out_dir, f"_f{i:02d}.png")
    t = (line["from"] + line["dur"] * 0.75) / tl["fps"]
    subprocess.run([FF, "-y", "-loglevel", "error", "-ss", f"{t:.2f}", "-i", preview, "-frames:v", "1", png], check=True)
    frames.append(Image.open(png).resize((270, 480)))
    os.remove(png)
cols = 7
rows = (len(frames) + cols - 1) // cols
sheet = Image.new("RGB", (270 * cols, 480 * rows), "white")
for i, im in enumerate(frames):
    sheet.paste(im, ((i % cols) * 270, (i // cols) * 480))
path = os.path.join(out_dir, f"{ep}_总览.png")
sheet.save(path)
print("总览图：", path)
