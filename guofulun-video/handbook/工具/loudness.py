# -*- coding: utf-8 -*-
"""测成片响度：整体响度（LUFS）、真峰值（dBFS）、响度范围（LRA）。

用法：python loudness.py <成片.mp4>
合格标准：整体 -14 LUFS（±0.5）、真峰值 ≤ -1 dBFS、LRA ≤ 3 LU。
依赖：pip install imageio-ffmpeg
"""
import subprocess, sys

import imageio_ffmpeg

if len(sys.argv) < 2:
    sys.exit(__doc__)
r = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-nostats", "-i", sys.argv[1], "-af", "ebur128=peak=true", "-f", "null", "-"],
                   capture_output=True, text=True, encoding="utf-8", errors="ignore")
summary = r.stderr[r.stderr.rfind("Summary:"):]
vals = {}
for line in summary.splitlines():
    s = line.strip()
    for key in ("I:", "LRA:", "Peak:"):
        if s.startswith(key):
            vals[key] = s
print("\n".join(vals.get(k, k + " 未测到") for k in ("I:", "LRA:", "Peak:")))
try:
    i = float(vals["I:"].split()[1]); lra = float(vals["LRA:"].split()[1]); pk = float(vals["Peak:"].split()[1])
    ok = abs(i + 14) <= 0.5 and pk <= -1.0 and lra <= 3
    print("结论：", "合格" if ok else "不合格（整体应为 -14±0.5 LUFS，真峰值 ≤ -1 dBFS，LRA ≤ 3）")
except Exception:
    pass
