// 每一集通用的外壳：场景序列、顶部栏、逐字字幕、配音、配乐。各集只需提供场景组件。
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, Line, SANS, SERIF, Timeline, TimelineProvider } from "./kit";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- 字幕：按语义切成单行短句，逐字点亮
type Ch = { c: string; red: boolean; t: number };
type Chunk = { chars: Ch[]; start: number; end: number; who?: string };
const BREAK = "，。：；？！…—";
const MAXC = 14;
const LONG = 20; // 一段话超过这么多字才分两行（同屏）；15–20 字缩小字号放一行

/** 把一句话拆成「带时间的字」：时间来自 TTS 逐字时间戳（帧，绝对） */
function charsOf(line: Line, fps: number): Ch[] {
  const stream: { c: string; t: number }[] = [];
  for (const w of line.words ?? []) {
    const cs = [...w.w];
    cs.forEach((c, i) => stream.push({ c, t: line.from + (w.s + ((w.e - w.s) * i) / cs.length) * fps }));
  }
  const out: Ch[] = [];
  let red = false, p = 0, last = line.from;
  for (const c of [...line.text]) {
    if (c === "【") { red = true; continue; }
    if (c === "】") { red = false; continue; }
    const j = stream.findIndex((s, i) => i >= p && i < p + 4 && s.c === c);
    if (j >= 0) { last = stream[j].t; p = j + 1; }
    out.push({ c, red, t: last });
  }
  return out;
}

function chunksOf(line: Line, fps: number): Chunk[] {
  const chars = charsOf(line, fps);
  const pieces: Ch[][] = [];
  let cur: Ch[] = [];
  chars.forEach((ch) => {
    cur.push(ch);
    if (BREAK.includes(ch.c)) { pieces.push(cur); cur = []; }
  });
  if (cur.length) pieces.push(cur);
  const merged: Ch[][] = [];
  for (const pc of pieces) {
    const prev = merged[merged.length - 1];
    const len = (a: Ch[]) => a.filter((x) => !BREAK.includes(x.c)).length;
    if (prev && !prev.some((x) => x.c === "\n") && len(prev) + len(pc) <= MAXC && len(pc) <= 6) prev.push(...pc);
    else if (len(pc) > LONG) {
      // 2026-10-24 用户要求：标点隔开的一段话要在同一个画面里完整出现，不拆到两屏。
      // 太长的一段改成同屏两行：优先在中间附近的顿号处换行，没有就从中间换
      const mid = pc.length / 2;
      let cut = -1;
      pc.forEach((x, i) => { if (x.c === "、" && i > 3 && i < pc.length - 3 && (cut < 0 || Math.abs(i + 1 - mid) < Math.abs(cut - mid))) cut = i + 1; });
      if (cut < 0) cut = Math.ceil(mid);
      merged.push([...pc.slice(0, cut), { c: "\n", red: false, t: pc[cut].t }, ...pc.slice(cut)]);
    } else merged.push(pc);
  }
  const end = line.from + line.dur;
  return merged.map((m, i) => ({ chars: m, who: line.who, start: i === 0 ? line.from - 3 : m[0].t - 2, end: i === merged.length - 1 ? end + 8 : merged[i + 1][0].t - 2 }));
}

/** 当前帧处在暗色段落（暗场 dark 或冷调 dusk）的程度（0..1，带淡入淡出）；onlyDark 只算暗场 */
const darkness = (tl: Timeline, f: number, lead = 6, onlyDark = false) =>
  Math.max(0, ...tl.scenes.filter((s) => s.dark || (!onlyDark && s.tone === "dusk")).map((s) => interpolate(f, [s.from, s.from + lead, s.from + s.dur - 4, s.from + s.dur + 8], [0, 1, 1, 0], CL)));

// ---------------------------------------------------------------- 版式安全区（1080×1920，按抖音界面遮挡实测）
// 顶部 0–150 被“关注/推荐”标签遮挡；底部 1500 以下是标题文案区；右侧 x>960 是点赞评论按钮
export const SAFE = { headerY: 158, contentTop: 228, contentBottom: 1290, captionY: 1338, progressY: 1452, left: 110, right: 970 };

/** v5 蜡笔风：角色说话时，字幕前面挂一个小头像（猫 / 狗） */
const WhoBadge: React.FC<{ who: string }> = ({ who }) => (
  <svg width={64} height={64} viewBox="-32 -34 64 64" style={{ marginRight: 14, flex: "none" }}>
    {who === "猫" ? (
      <g stroke="#3E2A20" strokeWidth={3} strokeLinejoin="round">
        <path d="M -22 -10 L -24 -30 L -8 -20 Z M 22 -10 L 24 -30 L 8 -20 Z" fill="#C4AA8A" />
        <circle r={22} fill="#C4AA8A" />
        <path d="M -6 -21 v 7 M 0 -22 v 8 M 6 -21 v 7" stroke="#7A5A42" strokeWidth={3} />
        <ellipse cx={0} cy={6} rx={11} ry={7} fill="#F6EAD6" stroke="none" />
        <circle cx={-8} cy={-3} r={3} fill="#1C1410" stroke="none" /><circle cx={8} cy={-3} r={3} fill="#1C1410" stroke="none" />
        <path d="M -3 3 L 3 3 L 0 6 Z" fill="#EF95A2" strokeWidth={1.5} />
      </g>
    ) : (
      <g stroke="#3E2A20" strokeWidth={3} strokeLinejoin="round">
        <ellipse cx={-22} cy={2} rx={8} ry={14} fill="#3B302C" /><ellipse cx={22} cy={2} rx={8} ry={14} fill="#3B302C" />
        <circle r={22} fill="#2B2523" />
        <path d="M -3 -20 Q 0 -22 3 -20 L 6 -4 L -6 -4 Z" fill="#FBF7F0" stroke="none" />
        <ellipse cx={0} cy={8} rx={12} ry={8} fill="#FBF7F0" stroke="none" />
        <circle cx={-9} cy={-4} r={4.5} fill="#FFFFFF" strokeWidth={1.5} /><circle cx={9} cy={-4} r={4.5} fill="#FFFFFF" strokeWidth={1.5} />
        <circle cx={-9} cy={-4} r={2.4} fill="#1C1410" stroke="none" /><circle cx={9} cy={-4} r={2.4} fill="#1C1410" stroke="none" />
        <ellipse cx={0} cy={4} rx={3.5} ry={2.5} fill="#1A1412" stroke="none" />
      </g>
    )}
  </svg>
);

const Captions: React.FC<{ tl: Timeline; crayon?: boolean; badge?: (who: string) => React.ReactNode }> = ({ tl, crayon, badge }) => {
  const f = useCurrentFrame();
  const chunks = useMemo(() => tl.lines.flatMap((l) => chunksOf(l, tl.fps)), [tl]);
  const dark = darkness(tl, f) > 0.5;
  const ch = chunks.find((c) => f >= c.start && f < c.end);
  const ink = dark ? (crayon ? "#FFF7E8" : C.paper) : (crayon ? "#3E2A20" : C.ink);
  const band = crayon ? (dark ? "rgba(30,39,64,.80)" : "rgba(255,253,247,.86)") : (dark ? "rgba(20,22,26,.78)" : "rgba(241,234,219,.86)");
  const keyCol = crayon ? (dark ? "#F7B26A" : "#E8604C") : (dark ? "#E8775F" : C.red);
  return (
    <>
      {/* 字幕带：与画面区分开，保证不压画面内容 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: SAFE.contentBottom + 6, height: 190, background: `linear-gradient(180deg, transparent, ${band} 22%, ${band} 78%, transparent)` }} />
      {ch && (() => {
        const k = interpolate(f, [ch.start, ch.start + 5], [0, 1], CL);
        const tail = ch.chars[ch.chars.length - 1];
        const shown = tail && "，。：；—".includes(tail.c) ? ch.chars.slice(0, -1) : ch.chars;
        const two = shown.some((x) => x.c === "\n");
        const n = two ? Math.max(...shown.map((x) => x.c).join("").split("\n").map((s) => [...s].length)) : shown.length;
        const base = crayon ? 56 : 58;
        const size = Math.min(base, Math.floor(880 / (n * 1.05)));
        return (
          <div style={{ position: "absolute", left: SAFE.left - 40, width: SAFE.right - SAFE.left + 80, top: SAFE.captionY - (crayon ? 4 : 0) - (two ? size * 0.65 : 0), display: "flex", justifyContent: "center", alignItems: "center", opacity: k, translate: `0 ${(1 - k) * 10}px` }}>
            {crayon && ch.who && (badge ? badge(ch.who) : <WhoBadge who={ch.who} />)}
            {!crayon && ch.who && <div style={{ flex: "none", marginRight: 14, background: C.red, color: C.paper, fontFamily: SERIF, fontWeight: 900, fontSize: 30, padding: "4px 12px", borderRadius: 6, boxShadow: `inset 0 0 0 2px ${C.paper}, inset 0 0 0 3.5px ${C.red}` }}>{ch.who}</div>}
            <div style={{ fontFamily: crayon ? SANS : SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.3, letterSpacing: "0.05em", textAlign: "center", whiteSpace: "nowrap", textShadow: `0 0 18px ${dark ? "rgba(20,22,26,.9)" : crayon ? "rgba(255,253,247,.95)" : "rgba(241,234,219,.95)"}` }}>
              {shown.map((x, i) => {
                if (x.c === "\n") return <br key={i} />;
                const lit = f >= x.t - 1;
                const isGap = "，。：；".includes(x.c);
                return (
                  <span key={i} style={{
                    color: x.red ? keyCol : (crayon && ch.who && !dark ? (ch.who === "猫" ? "#7A4A2E" : "#2B2523") : ink), opacity: lit ? 1 : 0.26, display: "inline-block", width: isGap ? "0.5em" : undefined,
                    // 关键词念到时跳一下、略放大，字幕跟着语气起伏
                    translate: x.red && lit ? `0 ${-Math.max(0, 4 - (f - x.t)) * 1.5}px` : undefined,
                    scale: x.red ? String(lit ? 1 + 0.12 * Math.exp(-Math.max(0, f - x.t) / 8) : 1) : undefined,
                  }}>
                    {isGap ? "" : x.c}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })()}
    </>
  );
};

/** 顶栏：书名印章 + 章节名 + 期数，下面一条细线，像书页的页眉 */
const Header: React.FC<{ tl: Timeline; from?: number; y?: number }> = ({ tl, from = 0, y = SAFE.headerY }) => {
  const f = useCurrentFrame();
  const col = darkness(tl, f, 10) > 0.5 ? C.paper : C.ink;
  const k = from > 0 ? interpolate(f, [from, from + 12], [0, 1], CL) : 1; // v4 冷开场：开头场景里不挂“教材感”的页眉
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", top: y, left: 64, right: 64, fontFamily: SERIF, color: col, opacity: k }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: C.red, color: C.paper, fontWeight: 900, fontSize: 26, padding: "4px 9px", borderRadius: 3, boxShadow: `inset 0 0 0 2px ${C.paper}, inset 0 0 0 3.5px ${C.red}` }}>国富论</div>
          <div style={{ fontWeight: 600, fontSize: 28, letterSpacing: "0.08em", opacity: 0.85 }}>{tl.meta.chapter}</div>
        </div>
        <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: "0.1em", opacity: 0.55 }}>No.{String(tl.meta.ep).padStart(2, "0")}</div>
      </div>
      <div style={{ marginTop: 14, height: 1.5, background: col, opacity: 0.18 }} />
    </div>
  );
};

/** none：不画底部进度条（v16 起进度并进顶部三格里，见 `v16/stage.tsx` 的 PartBar） */
export type ProgressAt = "caption" | "bottom" | "none";

/** 进度条：按场景分段，看得出这一集讲到哪里。caption = 字幕正下方；bottom = 画面最底边 */
const Progress: React.FC<{ tl: Timeline; at: ProgressAt; crayon?: boolean }> = ({ tl, at, crayon }) => {
  const f = useCurrentFrame();
  const dark = darkness(tl, f) > 0.5;
  const [left, right, top] = at === "bottom" ? [24, 1056, 1920 - 18] : [SAFE.left, SAFE.right, SAFE.progressY];
  const width = right - left;
  const gap = 6;
  const usable = width - gap * (tl.scenes.length - 1);
  let x = left;
  return (
    <>
      {tl.scenes.map((s) => {
        const w = (s.dur / tl.total) * usable;
        const done = interpolate(f, [s.from, s.from + s.dur], [0, 1], CL);
        const segLeft = x;
        x += w + gap;
        return (
          <div key={s.id} style={{ position: "absolute", left: segLeft, top, width: w, height: 5, borderRadius: 3, background: dark ? "rgba(241,234,219,.22)" : "rgba(27,30,36,.14)", overflow: "hidden" }}>
            <div style={{ width: `${done * 100}%`, height: "100%", background: crayon ? "#E8604C" : C.red }} />
          </div>
        );
      })}
    </>
  );
};

/**
 * v3 混音（EP06 实测后定）：配乐原始响度约 -25 dBFS、人声约 -21 dBFS。
 * 用户三次试听后定：0.16（太小，跟不上节奏）→ 0.6（又太大）→ 0.42 → 0.34（2026-10-18 再“稍微小一点”，约 -1.8 dB）。
 * base 0.34 + 说话时压到 70%（约 -3 dB）→ 配乐在人声下面约 16–17 dB，句间空隙约 14 dB：节拍听得见，又不抢人声。
 * dusk 冷调段只再降 25%（v2 是一半），别让节奏在黄昏段断掉。
 */
const V3 = { base: 0.34, duck: 0.3, dusk: 0.25 };
/** 配音时压低音乐（v3）：有人说话的帧音乐轻压一下，前后 6 帧缓入缓出 */
const duckOf = (tl: Timeline, f: number) => {
  let d = 0;
  for (const l of tl.lines) d = Math.max(d, interpolate(f, [l.from - 6, l.from, l.from + l.dur, l.from + l.dur + 8], [0, 1, 1, 0], CL));
  return 1 - V3.duck * d;
};
/** 反转前的真静音（v3）：带 hush 的场景开始前 0.6 秒到开始后 0.2 秒，音乐完全退出 */
const hushOf = (tl: Timeline, f: number) =>
  Math.min(1, ...tl.scenes.filter((s) => s.hush).map((s) => interpolate(f, [s.from - 30, s.from - 18, s.from + 6, s.from + 30], [1, 0, 0, 1], CL)));

/**
 * cold（v4 冷开场，EP06 起）：顶栏页眉等开头场景结束后才淡入；配乐第 0 帧就满音量（淡入 15 帧 → 3 帧）。
 * 目的是前 10 秒不像“上课”，见 `模板\开头10秒方法.md`
 */
/** overlay：画在所有场景上面、和顶栏同一层的东西（例如故事版的幕标签），用的是全片的帧号 */
/** look="crayon"（v5，EP10 起）：蜡笔手绘风——不挂书页页眉（常驻导航只留幕标签一层）、字幕用黑体并给角色台词挂小头像 */
/** badge：字幕旁的角色小头像换成自己的（v16 新角色用设定图裁出来的脸），不给就用猫狗矢量头像 */
/** headerY：页眉的高度位置；EP25 起传 `TOPS.header`（10-31 用户：页眉和三格往上靠，腾出中间画面），老集不传、位置不变 */
export const Episode: React.FC<{ tl: Timeline; scenes: Record<string, React.FC>; progressAt?: ProgressAt; mix?: "v2" | "v3"; cold?: boolean; overlay?: React.ReactNode; look?: "paper" | "crayon"; badge?: (who: string) => React.ReactNode; headerY?: number }> = ({ tl, scenes, progressAt = "caption", mix = "v2", cold = false, overlay, look = "paper", badge, headerY }) => {
  const crayon = look === "crayon";
  const f = useCurrentFrame();
  const darkScenes = tl.scenes.filter((s) => s.dark);
  const v3 = mix === "v3";
  // 配乐：暗场段落切到低沉铺底；冷调段落主配乐压低一半；其余时间是轻快的主配乐
  const mainVol = interpolate(f, [0, cold ? 3 : 15, tl.total - 30, tl.total], [0, v3 ? V3.base : 0.11, v3 ? V3.base : 0.11, 0], CL)
    * (1 - darkness(tl, f, 14, true)) * (1 - (v3 ? V3.dusk : 0.5) * Math.max(0, darkness(tl, f, 14) - darkness(tl, f, 14, true)))
    * (v3 ? duckOf(tl, f) * hushOf(tl, f) : 1);
  return (
    <TimelineProvider value={tl}>
      <AbsoluteFill style={{ background: crayon ? "#FBF6EC" : C.paper }}>
        {tl.scenes.map((s) => {
          const Comp = scenes[s.id];
          if (!Comp) throw new Error(`场景 ${s.id} 还没有对应的组件`);
          return (
            <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.dur + 12}>
              <Comp />
            </Sequence>
          );
        })}
        {!crayon && <Header tl={tl} from={cold && tl.scenes[1] ? tl.scenes[1].from : 0} y={headerY} />}
        {overlay}
        <Captions tl={tl} crayon={crayon} badge={badge} />
        {progressAt !== "none" && <Progress tl={tl} at={progressAt} crayon={crayon} />}
        {tl.lines.map((l) => (
          <Sequence key={l.file} name={`vo-${l.scene}-${l.i}`} from={l.from} durationInFrames={l.dur + 2} layout="none">
            <Audio src={staticFile(l.file)} volume={1} />
          </Sequence>
        ))}
        <Audio src={staticFile(tl.bgm.main)} volume={mainVol} />
        {darkScenes.map((s) => (
          <Sequence key={`dark-${s.id}`} from={s.from} durationInFrames={s.dur + 20} layout="none">
            <Audio src={staticFile(tl.bgm.dark)} volume={(fr) => interpolate(fr, [0, 15, s.dur, s.dur + 20], [0, 0.15, 0.15, 0], CL)} />
          </Sequence>
        ))}
        {/* v3：每次转场提前 6 帧响起翻纸声（J-cut），声音先于画面把观众带进下一场 */}
        {v3 && tl.scenes.slice(1).map((s) => (
          <Sequence key={`jcut-${s.id}`} from={Math.max(0, s.from - 6)} durationInFrames={30} layout="none">
            <Audio src={staticFile("sfx/paper.wav")} volume={0.16} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </TimelineProvider>
  );
};
