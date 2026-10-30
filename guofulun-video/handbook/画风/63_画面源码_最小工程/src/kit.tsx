import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { SANS, SERIF } from "./fonts";

// ---------------------------------------------------------------- 配色：编辑部纸本风（米白纸 + 墨色 + 朱砂红）
// v4 调色：纸张更亮更干净，朱红略压暗偏砖红，人物用色降低饱和、彼此更协调
export const C = {
  paper: "#F1EADB",
  paper2: "#E5DAC4",
  ink: "#1B1E24",
  ink2: "#474C55",
  mute: "#8E877B",
  red: "#B9412C",
  navy: "#26374F",
  ochre: "#C3923F",
  sage: "#78866A",
  wood: "#86593A",
  wood2: "#A8764C",
  steel: "#6C7380",
  skin: "#F0CBA5",
  skin2: "#D9A47E",
  night: "#141619",
};
export { SANS, SERIF };

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 缓出 */
export const fin = (f: number, start: number, dur = 12) =>
  interpolate(f, [start, start + dur], [0, 1], { ...CL, easing: ease });
/** 0→1 线性 */
export const lin = (f: number, start: number, dur: number) => interpolate(f, [start, start + dur], [0, 1], CL);
/** 带回弹的弹簧 */
export const pop = (f: number, fps: number, start: number, damping = 11) =>
  spring({ frame: f - start, fps, config: { damping, stiffness: 170, mass: 0.7 } });

// ---------------------------------------------------------------- 时间轴（每集一份，由 gen_assets.py 生成，经 Context 传给各场景）
export type Line = { scene: string; i: number; text: string; file: string; from: number; dur: number; words?: { w: string; s: number; e: number }[]; who?: string };
export type Timeline = {
  fps: number;
  total: number;
  meta: { ep: number; chapter: string; title: string; folder: string };
  bgm: { main: string; dark: string };
  scenes: { id: string; from: number; dur: number; dark?: boolean; tone?: "dusk"; hush?: boolean }[];
  lines: Line[];
};
const TLContext = createContext<Timeline | null>(null);
export const TimelineProvider = TLContext.Provider;
export const useTL = () => {
  const tl = useContext(TLContext);
  if (!tl) throw new Error("场景必须放在 <Episode> 里使用");
  return tl;
};

/** 场景内第 i 句的起止（场景局部帧） */
export const useLines = (id: string) => {
  const TL = useTL();
  const sc = TL.scenes.find((s) => s.id === id)!;
  const ls = TL.lines.filter((l) => l.scene === id);
  return {
    dur: sc.dur,
    s: (i: number) => ls[i].from - sc.from,
    e: (i: number) => ls[i].from - sc.from + ls[i].dur,
  };
};

/**
 * 语音对齐：返回第 i 句里某个词开始被念出来的帧（场景局部帧）。
 * 用它把画面动作卡在重音字上，让画面、文案、字幕一起起伏。找不到就返回句首。
 */
export const useWordAt = (id: string) => {
  const TL = useTL();
  const sc = TL.scenes.find((s) => s.id === id)!;
  const ls = TL.lines.filter((l) => l.scene === id);
  return (i: number, word: string) => {
    const l = ls[i];
    const plainText = l.text.replace(/[【】]/g, "");
    const at = plainText.indexOf(word);
    if (at < 0 || !l.words?.length) return l.from - sc.from;
    let n = 0;
    for (const w of l.words) {
      const len = [...w.w].length;
      if (n + len > at) return l.from - sc.from + Math.round(w.s * TL.fps);
      n += len;
    }
    return l.from - sc.from;
  };
};

// ---------------------------------------------------------------- 纸张背景 + 颗粒（dark 暗场 / dusk 冷调黄昏，用来做明暗节拍）
export const Paper: React.FC<{ dark?: number; dusk?: number }> = ({ dark = 0, dusk = 0 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 3) % 6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 38%, ${C.paper} 0%, ${C.paper2} 100%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 30%, #4A5872 0%, #232B3B 70%, #1B2130 100%)", opacity: dusk }} />
      <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 38%, #23262E 0%, ${C.night} 100%)`, opacity: dark }} />
      <svg width="100%" height="100%" style={{ position: "absolute", mixBlendMode: "multiply", opacity: 0.42 }}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.40  0 0 0 0 0.33  0 0 0 0.22 0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(95% 75% at 50% 45%, transparent 60%, rgba(40,28,10,0.15) 100%)" }} />
    </AbsoluteFill>
  );
};

/**
 * 网点（v3，封面/重点画面用）：印刷品的半调网点，从 at 处向外渐隐，增加“纸本印刷”的质感。
 * 只是一层叠加，不影响下面的内容。
 */
export const Halftone: React.FC<{ color?: string; o?: number; at?: string; size?: number; reach?: number }> = ({ color = C.red, o = 0.18, at = "85% 15%", size = 16, reach = 55 }) => (
  <AbsoluteFill style={{
    backgroundImage: `radial-gradient(circle, ${color} ${size * 0.16}px, transparent ${size * 0.2}px)`, backgroundSize: `${size}px ${size}px`, opacity: o,
    maskImage: `radial-gradient(circle at ${at}, #000 0%, transparent ${reach}%)`, WebkitMaskImage: `radial-gradient(circle at ${at}, #000 0%, transparent ${reach}%)`,
  }} />
);

/** 套印十字（印刷对位标记），封面四角点缀用 */
export const RegMark: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.ink2 }) => (
  <svg width={60 * s} height={60 * s} viewBox="0 0 60 60" style={{ position: "absolute", left: x - 30 * s, top: y - 30 * s, opacity: 0.5 }}>
    <circle cx={30} cy={30} r={13} fill="none" stroke={color} strokeWidth={2} />
    <path d="M 30 4 V 56 M 4 30 H 56" stroke={color} strokeWidth={2} />
  </svg>
);

// ---------------------------------------------------------------- 场景外壳：入场转场 + 缓慢推镜 + 重音推镜
/**
 * enter：wipe = 朱红竖线擦入（EP01/EP02）；fade = 叠化（新场景盖在旧场景上淡入，配合串场元素做无缝衔接）；
 *        { iris: [x, y] } = 从某个点圆形扩散（从上一场景的某个元素“钻进去”）
 *        { ink: [x, y] } = 墨迹从某个点晕开（不规则的墨边，纸本媒介自己的转场语法，v3 起优先用）
 *        "page" = 翻页：一张纸从右往左翻过去，边上带卷起的阴影
 * cam：镜头运动（v3）。push 推近（默认）/ pull 拉远 / panL、panR 左右摇 / rise 上升 / still 不动；zoom 为幅度
 * kicks：重音帧列表，镜头在这些帧轻轻推一下（配合 useWordAt）
 */
export type Enter = "wipe" | "fade" | "page" | "none" | { iris: [number, number] } | { ink: [number, number] }; // none：v4 冷开场，第 0 帧画面就是满的
export type Cam = "push" | "pull" | "panL" | "panR" | "rise" | "still";

/** 一圈不规则的墨边（确定性的“噪声”，每帧一致） */
function inkPolygon(cx: number, cy: number, r: number, seed = 3) {
  const pts: string[] = [];
  const n = 56;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const wob = 1 + 0.09 * Math.sin(a * 5 + seed) + 0.06 * Math.sin(a * 11 + seed * 2) + 0.04 * Math.sin(a * 17 + seed * 3);
    pts.push(`${(cx + Math.cos(a) * r * wob).toFixed(1)}px ${(cy + Math.sin(a) * r * wob).toFixed(1)}px`);
  }
  return pts;
}

export const Shell: React.FC<{ children: React.ReactNode; dur: number; zoom?: number; origin?: string; enter?: Enter; kicks?: number[]; cam?: Cam }> = ({
  children, dur, zoom = 0.05, origin = "50% 45%", enter = "wipe", kicks = [], cam = "push",
}) => {
  const f = useCurrentFrame();
  const kick = kicks.reduce((a, k) => a + (f >= k ? 0.028 * Math.exp(-(f - k) / 6) * Math.min(1, (f - k + 1) / 2) : 0), 0);
  const p = interpolate(f, [0, dur + 10], [0, 1], { ...CL, easing: Easing.bezier(0.45, 0, 0.55, 1) });
  const base = cam === "pull" ? 1 + zoom * (1 - p) : cam === "still" ? 1 : cam === "push" ? 1 + zoom * p : 1 + zoom * 0.6;
  const move = cam === "panL" ? `${(0.5 - p) * 70}px 0px` : cam === "panR" ? `${(p - 0.5) * 70}px 0px` : cam === "rise" ? `0px ${(0.5 - p) * 60}px` : "0px 0px";
  const inner = (
    <AbsoluteFill style={{ scale: String(base + kick), translate: move, transformOrigin: origin }}>
      {children}
    </AbsoluteFill>
  );
  if (enter === "none") return inner;
  if (enter === "fade") {
    const k = fin(f, 0, 14);
    return <AbsoluteFill style={{ opacity: k }}>{inner}</AbsoluteFill>;
  }
  if (enter === "page") {
    // 翻页：折痕从右往左扫过，折痕处画一条纸背和卷边阴影
    const k = interpolate(f, [0, 18], [0, 1], { ...CL, easing: Easing.bezier(0.6, 0, 0.3, 1) });
    const x = 1180 - k * 1500;
    const tilt = 260;
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `polygon(${x}px 0px, 1080px 0px, 1080px 1920px, ${x + tilt}px 1920px)` }}>{inner}</AbsoluteFill>
        {k < 1 && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="curl" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#000" stopOpacity="0.28" />
                <stop offset="0.5" stopColor={C.paper2} stopOpacity="1" />
                <stop offset="1" stopColor={C.paper} stopOpacity="1" />
              </linearGradient>
            </defs>
            <polygon points={`${x - 70},0 ${x},0 ${x + tilt},1920 ${x + tilt - 70},1920`} fill="url(#curl)" />
          </svg>
        )}
      </AbsoluteFill>
    );
  }
  if (typeof enter === "object" && "ink" in enter) {
    const r = interpolate(f, [0, 20], [0, 2400], { ...CL, easing: Easing.bezier(0.5, 0, 0.3, 1) });
    const [cx, cy] = enter.ink;
    const poly = inkPolygon(cx, cy, r);
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `polygon(${poly.join(",")})` }}>{inner}</AbsoluteFill>
        {r < 2300 && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <polygon points={poly.map((s) => s.replace(/px/g, "")).join(" ")} fill="none" stroke={C.ink} strokeOpacity={0.55} strokeWidth={10} strokeLinejoin="round" />
          </svg>
        )}
      </AbsoluteFill>
    );
  }
  if (typeof enter === "object") {
    const r = interpolate(f, [0, 16], [0, 2300], { ...CL, easing: Easing.bezier(0.55, 0, 0.35, 1) });
    return <AbsoluteFill style={{ clipPath: `circle(${r}px at ${enter.iris[0]}px ${enter.iris[1]}px)` }}>{inner}</AbsoluteFill>;
  }
  const wipe = fin(f, 0, 11);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
      {inner}
      {wipe < 1 && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${wipe * 100}%`, width: 10, marginLeft: -10, background: C.red }} />
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 文本
export const T: React.FC<{
  x?: number; y: number; size: number; color?: string; serif?: boolean; weight?: number;
  children: React.ReactNode; style?: React.CSSProperties; w?: number; align?: "center" | "left" | "right";
}> = ({ x = 540, y, size, color = C.ink, serif, weight, children, style, w = 1000, align = "center" }) => (
  <div
    style={{
      position: "absolute", left: align === "center" ? x - w / 2 : align === "left" ? x : x - w, top: y - size * 0.62, width: w,
      textAlign: align, fontFamily: serif ? SERIF : SANS, fontWeight: weight ?? (serif ? 900 : 700),
      fontSize: size, color, lineHeight: 1.25, letterSpacing: serif ? "0.02em" : "0.01em", ...style,
    }}
  >
    {children}
  </div>
);

/** 印章：朱红方框 + 白字 */
export const Seal: React.FC<{ x: number; y: number; text: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ x, y, text, size = 64, rot = -6, style }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, padding: `${size * 0.18}px ${size * 0.3}px`,
      background: C.red, color: C.paper, fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.1, borderRadius: 6,
      boxShadow: `inset 0 0 0 ${size * 0.06}px ${C.paper}, inset 0 0 0 ${size * 0.1}px ${C.red}`, whiteSpace: "nowrap", ...style,
    }}
  >
    {text}
  </div>
);

/** 小标签胶囊 */
export const Chip: React.FC<{ y: number; num: string; text: string; f: number; at: number }> = ({ y: y0, num, text, f, at }) => {
  const y = Math.max(y0, 250); // 留出页眉线下方的呼吸空间
  const k = fin(f, at, 14);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: k, translate: `0 ${(1 - k) * 24}px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: C.ink }}>
        <span style={{ background: C.ink, color: C.paper, borderRadius: 999, width: 84, height: 84, display: "grid", placeItems: "center", fontSize: 46 }}>{num}</span>
        {text}
      </div>
    </div>
  );
};

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// ---------------------------------------------------------------- 针
export const Pin: React.FC<{ x: number; y: number; len?: number; rot?: number; color?: string; w?: number; o?: number }> = ({ x, y, len = 90, rot = 0, color = C.steel, w = 5, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    <line x1={0} y1={0} x2={0} y2={len} stroke={color} strokeWidth={w} strokeLinecap="round" />
    <circle cx={0} cy={0} r={w * 1.5} fill={color} />
  </g>
);

// ---------------------------------------------------------------- 小人
export type Mood = "smile" | "flat" | "tired" | "wow" | "smirk" | "sad" | "happy";
export type PersonProps = {
  x: number; y: number; s?: number; flip?: boolean;
  skin?: string; shirt?: string; pants?: string; hair?: string;
  hat?: "cap" | "wig" | "none" | "kerchief" | "beanie" | "chef" | "helmet"; apron?: boolean; beard?: boolean; glasses?: boolean;
  armL?: [number, number]; armR?: [number, number]; legs?: [number, number];
  mood?: Mood; bob?: number; tilt?: number; lean?: number; seed?: number;
  holdR?: React.ReactNode; holdL?: React.ReactNode; sweat?: boolean; gray?: number; o?: number;
};

const grayify = (hex: string, k: number) => {
  if (!k) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const l = 0.3 * r + 0.59 * g + 0.11 * b;
  const m = (a: number) => Math.round(a + (l - a) * k);
  return `rgb(${m(r)},${m(g)},${m(b)})`;
};

export const Person: React.FC<PersonProps> = (p) => {
  const f = useCurrentFrame();
  const {
    x, y, s = 1, flip, skin = C.skin, shirt = C.navy, pants = "#3B3631", hair = "#3A2A20", hat = "none", apron, beard, glasses,
    armL = [12, 10], armR = [12, 10], legs = [0, 0], mood = "smile", bob = 0, tilt = 0, lean = 0, seed = 1,
    holdR, holdL, sweat, gray = 0, o = 1,
  } = p;
  const g = (c: string) => grayify(c, gray);
  // 眨眼：每个人节奏不同
  const period = 70 + Math.floor(random(`b${seed}`) * 60);
  const ph = (f + Math.floor(random(`p${seed}`) * period)) % period;
  const eyeRy = ph < 4 ? 1 : 6.5;
  const breath = Math.sin((f + seed * 13) / 14) * 1.6;
  const arm = (side: 1 | -1, [sh, el]: [number, number], hold?: React.ReactNode) => (
    <g transform={`translate(${side * 36} -203) rotate(${-side * sh})`}>
      <line x1={0} y1={0} x2={0} y2={52} stroke={g(shirt)} strokeWidth={20} strokeLinecap="round" />
      <g transform={`translate(0 52) rotate(${-side * el})`}>
        <line x1={0} y1={0} x2={0} y2={46} stroke={g(shirt)} strokeWidth={17} strokeLinecap="round" />
        <circle cx={0} cy={50} r={11} fill={g(skin)} />
        {hold && <g transform="translate(0 52)">{hold}</g>}
      </g>
    </g>
  );
  const mouth = {
    smile: <path d="M -11 -246 Q 0 -235 11 -246" stroke={g(C.ink)} strokeWidth={3.5} fill="none" strokeLinecap="round" />,
    happy: <path d="M -13 -248 Q 0 -230 13 -248 Z" fill={g("#7A2E22")} />,
    flat: <line x1={-8} y1={-244} x2={8} y2={-244} stroke={g(C.ink)} strokeWidth={3.5} strokeLinecap="round" />,
    tired: <path d="M -9 -240 Q 0 -247 9 -240" stroke={g(C.ink)} strokeWidth={3.5} fill="none" strokeLinecap="round" />,
    sad: <path d="M -10 -238 Q 0 -249 10 -238" stroke={g(C.ink)} strokeWidth={3.5} fill="none" strokeLinecap="round" />,
    wow: <ellipse cx={0} cy={-242} rx={6} ry={8} fill={g("#7A2E22")} />,
    smirk: <path d="M -9 -244 Q 3 -240 12 -250" stroke={g(C.ink)} strokeWidth={3.5} fill="none" strokeLinecap="round" />,
  }[mood];
  const brow = mood === "tired" || mood === "sad" ? 10 : mood === "wow" ? -6 : mood === "smirk" ? -4 : 0;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`} opacity={o}>
      <ellipse cx={0} cy={4} rx={58} ry={10} fill="rgba(40,28,10,0.16)" />
      {/* 腿 */}
      {[-1, 1].map((side, k) => (
        <g key={side} transform={`translate(${side * 17} -120) rotate(${legs[k]})`}>
          <line x1={0} y1={0} x2={0} y2={112} stroke={g(pants)} strokeWidth={24} strokeLinecap="round" />
          <ellipse cx={side * 6} cy={116} rx={20} ry={9} fill={g("#2A2522")} />
        </g>
      ))}
      <g transform={`rotate(${lean} 0 -120)`}>
        {arm(-1, armL, holdL)}
        {/* 身体 */}
        <path d={`M -38 ${-212 + breath} Q 0 ${-224 + breath} 38 ${-212 + breath} L 34 -116 Q 0 -108 -34 -116 Z`} fill={g(shirt)} />
        {apron && <path d="M -26 -176 L 26 -176 L 30 -106 Q 0 -100 -30 -106 Z" fill={g("#E9DFCB")} />}
        <rect x={-9} y={-226 + breath} width={18} height={14} fill={g(C.skin2)} rx={4} />
        {/* 头 */}
        <g transform={`rotate(${tilt} 0 -232)`}>
          {hat === "wig" && (
            <g fill={g("#F3F0EA")}>
              <circle cx={-38} cy={-262} r={20} /><circle cx={38} cy={-262} r={20} />
              <circle cx={-40} cy={-238} r={17} /><circle cx={40} cy={-238} r={17} />
            </g>
          )}
          <circle cx={0} cy={-262} r={41} fill={g(skin)} />
          {hat === "none" && <path d="M -41 -266 Q -36 -308 0 -305 Q 36 -308 41 -266 Q 26 -290 0 -288 Q -22 -290 -41 -266 Z" fill={g(hair)} />}
          {hat === "wig" && <path d="M -42 -262 Q -40 -312 0 -308 Q 40 -312 42 -262 Q 24 -292 0 -290 Q -24 -292 -42 -262 Z" fill={g("#F3F0EA")} />}
          {hat === "cap" && <path d="M -44 -270 Q -38 -314 0 -312 Q 40 -312 46 -276 L 66 -270 Q 50 -262 -44 -270 Z" fill={g("#5A4636")} />}
          {hat === "beanie" && <path d="M -43 -262 Q -44 -318 0 -316 Q 44 -318 43 -262 Q 0 -276 -43 -262 Z" fill={g(C.red)} />}
          {hat === "kerchief" && <path d="M -43 -268 Q -36 -310 0 -308 Q 36 -310 43 -268 Q 0 -282 -43 -268 Z" fill={g(C.red)} />}
          {hat === "chef" && (
            <g fill={g("#FBF7EF")} stroke={g(C.ink2)} strokeWidth={2}>
              <rect x={-34} y={-318} width={68} height={30} rx={6} />
              <circle cx={-22} cy={-330} r={20} /><circle cx={0} cy={-340} r={22} /><circle cx={22} cy={-330} r={20} />
            </g>
          )}
          {hat === "helmet" && (
            <g>
              <path d="M -46 -262 Q -46 -322 0 -322 Q 46 -322 46 -262 Z" fill={g("#F2C230")} />
              <rect x={-48} y={-266} width={96} height={10} rx={5} fill={g(C.ink)} />
            </g>
          )}
          {beard && <path d="M -36 -252 Q -30 -212 0 -210 Q 30 -212 36 -252 Q 18 -236 0 -238 Q -18 -236 -36 -252 Z" fill={g("#4A3426")} />}
          <ellipse cx={-14} cy={-266} rx={4.8} ry={eyeRy} fill={g(C.ink)} />
          <ellipse cx={14} cy={-266} rx={4.8} ry={eyeRy} fill={g(C.ink)} />
          {glasses && (
            <g fill="none" stroke={g(C.ink)} strokeWidth={3}>
              <circle cx={-14} cy={-266} r={11} /><circle cx={14} cy={-266} r={11} /><line x1={-3} y1={-266} x2={3} y2={-266} />
            </g>
          )}
          <line x1={-21} y1={-281 + brow * 0.3} x2={-8} y2={-283 - brow * 0.3} stroke={g(C.ink)} strokeWidth={3} strokeLinecap="round" />
          <line x1={8} y1={-283 - brow * 0.3} x2={21} y2={-281 + brow * 0.3} stroke={g(C.ink)} strokeWidth={3} strokeLinecap="round" />
          <circle cx={-25} cy={-250} r={6} fill="#E58F7A" opacity={gray ? 0 : 0.45} />
          <circle cx={25} cy={-250} r={6} fill="#E58F7A" opacity={gray ? 0 : 0.45} />
          {!beard && mouth}
          {beard && mood !== "flat" && <path d="M -8 -240 Q 0 -234 8 -240" stroke="#2A1C14" strokeWidth={3} fill="none" />}
          {sweat && (
            <path
              d="M 0 0 Q 6 10 0 16 Q -6 10 0 0 Z"
              fill="#7FB4D8"
              transform={`translate(44 ${-290 + ((f * 2) % 40)})`}
              opacity={1 - ((f * 2) % 40) / 40}
            />
          )}
        </g>
        {arm(1, armR, holdR)}
      </g>
    </g>
  );
};

/** 全屏 SVG 画布 */
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, ...style }}>
    {children}
  </svg>
);

/**
 * 姿势关键帧（v3）：[[帧, 值], ...] 之间用缓动平滑过渡，避免“if 一下就换姿势”的跳变。
 * 用于手臂角度、位置等；动作前后自带预备和收尾的减速。
 */
export const keys = (f: number, ks: [number, number][]) => {
  if (ks.length === 1 || f <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (f <= ks[i][0]) {
      const [f0, v0] = ks[i - 1], [f1, v1] = ks[i];
      return interpolate(f, [f0, f1], [v0, v1], { ...CL, easing: Easing.bezier(0.45, 0, 0.25, 1) });
    }
  }
  return ks[ks.length - 1][1];
};

/** 当前帧对应的“周期性挥动”角度 */
export const swing = (f: number, speed: number, a: number, b: number, phase = 0) => a + (b - a) * (0.5 + 0.5 * Math.sin(f * speed + phase));

export const useFps = () => useVideoConfig().fps;

/** 音效：public/sfx 下的合成音效，at 为场景内帧号 */
export const Sfx: React.FC<{ at: number; name: string; v?: number }> = ({ at, name, v = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v * 0.65} />
  </Sequence>
);

/** 锤子道具（握在手里） */
export const Hammer = () => (
  <g transform="rotate(180)">
    <rect x={-4} y={-6} width={8} height={62} rx={3} fill={C.wood} />
    <rect x={-20} y={50} width={40} height={20} rx={4} fill={C.steel} />
  </g>
);
