# 最小工程：怎么跑起来（2026-10-31 快照，样板 EP25）

> 这是用户电脑上 `D:\AI\短视频\studio` 的**最小子集**：只含画 EP25 需要的 32 个源码文件、全部 v16 人物图、字体、音效和出片脚本，`src\Root.tsx` 只登记了 EP25。真身以 `studio` 为准；画风有更新时，用手册 `工具\刷新画风快照.py` 重新生成这一份。
> 10-31 验证：在临时目录里装好依赖后，`tsc --noEmit` 0 错误；渲染出的 EP25 封面和发布版逐像素一致，正文第 1440 帧和成片平均像素差 1.68/255。

## 一、需要装什么
- Node.js 20 以上（带 npm）；Python 3.10 以上，`pip install numpy imageio-ffmpeg pillow`
- 一个 Chromium 内核浏览器给 Remotion 渲染用（Windows 上用自带的 Edge：`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`；`produce.py` 里的 `EDGE` 改成你的路径）
- 火山引擎豆包语音 2.0 的密钥（配音用）：复制 `.env.example` 为 `.env`，**由用户自己填**，AI 不读不转发

## 二、第一次跑
```
cd 这个文件夹
npm install
npx remotion studio src/index.ts        # 打开预览（没配音时画面照常，声音会缺）
```
要完整出片，先配音：`python gen_assets.py ep25`（读 `episodes\ep25\script.json`，生成 `public\ep25\` 的逐句配音、合成巴洛克配乐、写 `src\ep25\timeline.json`）→ `python produce.py ep25 --skip-audio`（出成片和三张封面；输出到上一级目录的 `EP25_…\` 文件夹，路径在 `produce.py` 顶上）。

只想看画面对不对：
```
npx remotion still src/index.ts EP25-Cover34 cover.png --browser-executable="<浏览器路径>"
npx remotion still src/index.ts EP25 f1440.png --frame=1440 --browser-executable="<浏览器路径>"
```
和手册 `画风\61_参考画面\封面_EP25_竖屏3比4.jpg`、`版式实测_原尺寸_1080x1920_正文镜头.png` 比，应该一样。

## 三、做新的一集（照 EP25 复制改）
1. `episodes\epXX\script.json`：照 `episodes\ep25\script.json` 的格式写（格式见手册 `技术\42`）
2. `src\epXX\`：把 `src\ep25\` 整个复制过来改——
   - `world.tsx`：第一行 `export * from "../ep25/world"`（以前所有集的道具都能用），改本集三步的 `PARTS`（短标签 ≤7 字）、本集新道具、`Verdict`、`FormulaXX`
   - `scenesA/B/C.tsx`：开头 `SHook`（第 0 帧一行大字 + 念到哪个词出哪样东西）、三问 `SMenu`、三步、结尾、公式卡
   - `Video.tsx`：场景表、`Episode` 的 `headerY={TOPS.header}`、`PartBar top={TOPS.bar}`
   - `Cover.tsx`：`<BookPoster {...P} bookS={0.8} />`，改标题两行、腰封、motif
   - `index.ts`：`id: "EPXX"`
3. `src\Root.tsx`：`import { episode as epXX } from "./epXX"`，加进 `EPISODES`
4. `npx tsc --noEmit -p .` → `python gen_assets.py epXX` → `python review.py epXX`（总览图）→ `python produce.py epXX --skip-audio`

## 四、目录
```
src\Episode.tsx      书页外框：页眉、宋体卡拉 OK 字幕、人名签、配乐混音、转场
src\kit.tsx          配色 C、动画工具（fin/pop/useLines/useWordAt/Shell/Sfx）
src\fonts.ts         思源宋体 / 黑体载入
src\BookPoster.tsx   封面书海报（竖屏 + 横屏），Brand.tsx 账号名片和合集条
src\cast\crayon.tsx  彩铅滤镜 CrayonDefs、彩铅配色 CR；talk.ts 口型
src\v16\Sprite.tsx   彩铅人物纸偶（眨眼、张嘴、走路、转身、头顶符号、头像）
src\v16\town.tsx     彩铅小镇（天、山、街、铺子）、手抖矩形 wrect
src\v16\stage.tsx    PaperTown、Card、Keyword、PartBar、TOPS、Shot、Screen、通用道具
src\ep17–ep24\world  各集道具（一路 export * 下来）；ep17、ep20 的 scenesA 有 TagDiv、Head、Fly 等
src\ep25\            样板集全部场景
public\cast\v16\     人物图（每个视角一张）+ anchors.json + manifest.json
public\fonts\ sfx\   字体、音效
gen_assets.py        配音 + 配乐 + 时间轴；review.py 逐句总览图；produce.py 出片 + 封面 + 归档
```
