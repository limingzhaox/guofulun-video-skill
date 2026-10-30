# -*- coding: utf-8 -*-
r"""把 studio 里“画面长什么样”的真身复制进手册（只读 studio，不改它）：
  1. 画风\63_画面源码_最小工程\  —— 能单独跑起来的最小 Remotion 工程（只登记一集样板）
  2. 画风\61_参考画面\            —— 从样板集成片抽 24 张参考画面 + 总览图（另跑 --frames）

用法（在任意目录）：
    python "D:\\AI\\短视频\\00_交接包_国富论短视频制作手册\\工具\\刷新画风快照.py"            # 只刷源码
    python "D:\\AI\\短视频\\00_交接包_国富论短视频制作手册\\工具\\刷新画风快照.py" ep26 --frames  # 换样板集并重抽画面
样板集默认 ep25（10-31 页眉上移 + ★★★★★ 开头的第一集）。换样板集后，记得同步改 画风\61_参考画面说明.md 和 SKILL.md 里的集号。
"""
import os, re, shutil, sys

STUDIO = os.environ.get("GUOFULUN_STUDIO", r"D:\AI\短视频\studio")
HB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HB, "画风", "63_画面源码_最小工程")
ep = next((a for a in sys.argv[1:] if re.fullmatch(r"ep\d+", a)), "ep25")


def closure(starts):
    """从入口文件顺着相对 import 找全依赖"""
    seen, stack = set(), list(starts)
    while stack:
        f = stack.pop()
        if f in seen:
            continue
        seen.add(f)
        if not f.endswith((".ts", ".tsx")):
            continue
        for imp in re.findall(r'from "(\.[^"]+)"', open(os.path.join(STUDIO, f), encoding="utf-8").read()):
            p = os.path.normpath(os.path.join(os.path.dirname(f), imp))
            for ext in ("", ".tsx", ".ts", ".json", "/index.ts"):
                if os.path.isfile(os.path.join(STUDIO, p + ext)):
                    stack.append((p + ext).replace("\\", "/"))
                    break
    return sorted(seen)


def cp(rel, dst_rel=None):
    s, d = os.path.join(STUDIO, rel), os.path.join(OUT, dst_rel or rel)
    os.makedirs(os.path.dirname(d), exist_ok=True)
    shutil.copy2(s, d)


os.makedirs(OUT, exist_ok=True)
for name in os.listdir(OUT):  # 清空旧快照（只删里面的东西，目录本身可能正被资源管理器打开；手写的 README 留着）
    if name.startswith("README"):
        continue
    p = os.path.join(OUT, name)
    shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
files = closure([f"src/{ep}/index.ts", "src/Episode.tsx", "src/BookPoster.tsx"])
for f in files:
    cp(f)
for f in ["src/index.ts", "package.json", "tsconfig.json", ".env.example", "gen_assets.py", "review.py", "produce.py", f"episodes/{ep}/script.json"]:
    cp(f)
for sub in ["public/cast/v16", "public/fonts", "public/sfx"]:
    shutil.copytree(os.path.join(STUDIO, sub), os.path.join(OUT, sub), dirs_exist_ok=True)

# 最小 Root：只登记样板集（真身 src/Root.tsx 登记了全部集数）
open(os.path.join(OUT, "src", "Root.tsx"), "w", encoding="utf-8", newline="\n").write(f'''import React from "react";
import {{ AbsoluteFill, Composition, Still }} from "remotion";
import {{ episode }} from "./{ep}";

// 最小工程只登记一集样板（{ep}）。新的一集：照 src/{ep}/ 建 src/epXX/，在这里 import 进 EPISODES。
const EPISODES = [episode];

// 抖音主页按 3:4 居中裁（上下各裁 240px），封面内容都放在 y 240–1680
const crop34 = (Cover: React.FC) => () => (
  <AbsoluteFill style={{{{ overflow: "hidden" }}}}>
    <div style={{{{ position: "absolute", left: 0, top: -240, width: 1080, height: 1920 }}}}><Cover /></div>
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <>
    {{EPISODES.map((e) => <Composition key={{e.id}} id={{e.id}} component={{e.Video}} durationInFrames={{e.tl.total}} fps={{e.tl.fps}} width={{1080}} height={{1920}} />)}}
    {{EPISODES.map((e) => <Still key={{`${{e.id}}-c`}} id={{`${{e.id}}-Cover`}} component={{e.Cover}} width={{1080}} height={{1920}} />)}}
    {{EPISODES.map((e) => <Still key={{`${{e.id}}-c34`}} id={{`${{e.id}}-Cover34`}} component={{crop34(e.Cover)}} width={{1080}} height={{1440}} />)}}
    {{EPISODES.map((e) => ("CoverWide" in e && e.CoverWide ? <Still key={{`${{e.id}}-c43`}} id={{`${{e.id}}-Cover43`}} component={{e.CoverWide as React.FC}} width={{1440}} height={{1080}} /> : null))}}
  </>
);
''')

n = sum(len(fs) for _, _, fs in os.walk(OUT))
size = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(OUT) for f in fs)
print(f"源码快照：样板 {ep}，{len(files)} 个源码文件；整个最小工程 {n} 个文件、{size / 1e6:.1f} MB → {OUT}")

if "--frames" in sys.argv:
    print("重抽参考画面：照 画风\\61_参考画面说明.md 里的时间点，用 工具\\frames.py 或 ffmpeg 抽，抽完重写说明。")
