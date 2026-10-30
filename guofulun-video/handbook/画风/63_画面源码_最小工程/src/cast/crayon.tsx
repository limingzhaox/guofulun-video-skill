// v5 蜡笔手绘风（EP10 起）：配色、手写字体、蜡笔质感滤镜、毛边形状和常用背景/道具。
// 和账号新头像、新背景图一套：淡蓝天、粉云金边、浅绿草地、深棕手绘线、珊瑚红点睛。
import React from "react";
import { useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "KuaiLe", url: staticFile("fonts/ZCOOLKuaiLe-Regular.ttf"), weight: "400", display: "block" });
/** 手写圆体（站酷快乐体，OFL 免费可商用），缺字回落到思源黑体 */
export const HAND = "KuaiLe, SansL, SansC, sans-serif";
export const ROUND = "SansL, SansC, sans-serif";

export const CR = {
  line: "#3E2A20", // 手绘深棕线
  text: "#4A3426",
  coral: "#E8604C", // 点睛珊瑚红
  apple: "#E2453C",
  gold: "#E8B84A",
  goldHi: "#F7D77A",
  sky: "#D6EBF7",
  sky2: "#EEF6FA",
  warm: "#FBF6EC",
  pink: "#F6C6CE",
  cham: "#F3E1A8",
  grass: "#D9EAA9",
  grass2: "#BFD98A",
  grassLine: "#8DB062",
  leaf: "#9CC778",
  leaf2: "#7FB062",
  trunk: "#9A6A44",
  wood: "#C99A6B",
  wood2: "#A97A50",
  cream: "#F7EBD6",
  blush: "#F4A3A6",
  skin: "#F8DFC8",
  night: "#2B3550",
  night2: "#1E2740",
  mute: "#A89C8C",
  blue: "#6FA8D6",
  purple: "#9C86C9",
  green: "#6DB38A",
  orange: "#EE9A4A",
};

// ---------------------------------------------------------------- 随机与毛边
/** 可复现的伪随机 */
export const rng = (seed: number) => {
  let s = Math.floor(seed * 9301 + 49297) % 233280 || 1;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
};

/** 线条“抖动”帧：每 4 帧换一次（12 帧/秒的手绘抖动） */
export const useBoil = (every = 4) => Math.floor(useCurrentFrame() / every) % 6;

/**
 * 毛茸茸 / 手绘感的椭圆：n 个小鼓包（扇贝边），amp 是鼓出去的比例。
 * boil 改变时形状微微变，模拟一帧一帧手画的抖动。
 */
export function fuzz(cx: number, cy: number, rx: number, ry: number, n = 18, amp = 0.08, seed = 1, boil = 0): string {
  const r = rng(seed * 7 + boil * 131);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 0.04;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    const a = ((i + 0.5) / n) * Math.PI * 2;
    const bump = 1 + amp * (0.7 + r() * 0.6);
    const c: [number, number] = [cx + Math.cos(a) * rx * bump, cy + Math.sin(a) * ry * bump];
    d += ` Q ${c[0].toFixed(1)} ${c[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  }
  return d + " Z";
}

/** 手绘感的光滑闭合曲线：给一组点，带轻微抖动，用 Catmull-Rom 连成平滑路径 */
export function wob(points: [number, number][], j = 1.6, seed = 1, boil = 0, closed = true): string {
  const r = rng(seed * 13 + boil * 97);
  const p = points.map(([x, y]) => [x + (r() - 0.5) * 2 * j, y + (r() - 0.5) * 2 * j] as [number, number]);
  const n = p.length;
  const get = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return closed ? d + " Z" : d;
}

/** 椭圆上取点（给 wob 用） */
export const ell = (cx: number, cy: number, rx: number, ry: number, n = 12, a0 = 0): [number, number][] =>
  Array.from({ length: n }).map((_, i) => {
    const a = a0 + (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });

// ---------------------------------------------------------------- 滤镜：蜡笔颗粒 + 手绘抖线
/** 每个 Stage 里放一次。#crayon：边缘轻微抖动 + 蜡笔颗粒（填色里透出纸色）；#grainOnly：只要颗粒。
 *  light：颗粒少一些、淡一些（v16 用，10-25 用户觉得颗粒感太重） */
export const CrayonDefs: React.FC<{ light?: boolean }> = ({ light }) => {
  const boil = useBoil();
  const speck = light ? "2.5 0 0 0 -1.65" : "3.4 0 0 0 -2.05";
  return (
    <defs>
      {/* 抖线 + 蜡笔颗粒：形状保持不透明，只在填色上撒一层很淡的纸色细点（像蜡笔没涂满的地方） */}
      <filter id="crayon" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves={2} seed={boil + 1} result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale={3} xChannelSelector="R" yChannelSelector="G" result="w" />
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={2} seed={7} result="g" />
        <feColorMatrix in="g" type="matrix" values={`0 0 0 0 1  0 0 0 0 0.99  0 0 0 0 0.95  ${speck}`} result="speck" />
        <feComposite in="speck" in2="w" operator="atop" />
      </filter>
      {/* 背景用：只撒纸色细点，不抖线 */}
      <filter id="grainOnly" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={2} seed={11} result="g" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 0.99  0 0 0 0 0.95  3.4 0 0 0 -2.05" result="speck" />
        <feComposite in="speck" in2="SourceGraphic" operator="atop" />
      </filter>
      {/* 书里的年代：七成旧书页的暖黄 */}
      <filter id="sepia" x="-5%" y="-5%" width="110%" height="110%">
        <feColorMatrix type="matrix" values="0.575 0.538 0.132 0 0.02  0.244 0.780 0.118 0 0.01  0.190 0.374 0.392 0 0  0 0 0 1 0" />
      </filter>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={CR.sky} />
        <stop offset="0.75" stopColor={CR.sky2} />
        <stop offset="1" stopColor={CR.warm} />
      </linearGradient>
      <linearGradient id="nightG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={CR.night2} />
        <stop offset="1" stopColor={CR.night} />
      </linearGradient>
      <radialGradient id="goldGlow">
        <stop offset="0" stopColor={CR.goldHi} stopOpacity="0.95" />
        <stop offset="1" stopColor={CR.goldHi} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
};

/** 全画面的纸纹和蜡笔斜线（叠在最上层，很淡），让纯色背景也有手绘质感 */
export const PaperGrain: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <g opacity={o} pointerEvents="none">
    <rect width={1080} height={1920} fill="#8A7660" opacity={0.05} filter="url(#grainOnly)" />
  </g>
);

// ---------------------------------------------------------------- 背景
/** 天空 + 两朵粉云 + 草地（y 为地平线）。night：夜空；dim：整体压暗 */
export const Meadow: React.FC<{ ground?: number; night?: boolean; clouds?: boolean; drift?: number; dim?: number }> = ({ ground = 1180, night, clouds = true, drift = 0, dim = 0 }) => {
  const boil = useBoil(6);
  return (
    <g>
      <rect width={1080} height={1920} fill={night ? "url(#nightG)" : "url(#skyG)"} />
      {night && Array.from({ length: 40 }).map((_, i) => {
        const r = rng(i + 3);
        return <circle key={i} cx={r() * 1080} cy={r() * (ground - 200)} r={1.5 + r() * 2.5} fill="#FFF4D6" opacity={0.4 + 0.5 * Math.abs(Math.sin(i + boil))} />;
      })}
      {clouds && !night && (
        <g>
          <Cloud x={230 + drift * 0.3} y={560} s={1.25} seed={2} />
          <Cloud x={830 - drift * 0.2} y={430} s={0.9} seed={5} />
        </g>
      )}
      <path d={wob([[-40, ground + 10], [260, ground - 18], [560, ground - 4], [820, ground - 22], [1120, ground - 6], [1120, 1920], [-40, 1920]], 3, 21, boil)} fill={night ? "#3A4A3E" : CR.grass} />
      {!night && Array.from({ length: 14 }).map((_, i) => {
        const r = rng(i * 5 + 1);
        const x = 40 + r() * 1000, y = ground + 30 + r() * 140;
        return <path key={i} d={`M ${x} ${y} l -6 -16 M ${x + 7} ${y} l 2 -20 M ${x + 14} ${y} l 8 -14`} stroke={CR.grassLine} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.75} />;
      })}
      {dim > 0 && <rect width={1080} height={1920} fill="#1E2740" opacity={dim} />}
    </g>
  );
};

export const Cloud: React.FC<{ x: number; y: number; s?: number; seed?: number; o?: number }> = ({ x, y, s = 1, seed = 1, o = 1 }) => {
  const boil = useBoil(8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d={fuzz(0, 0, 190, 70, 9, 0.28, seed, boil)} fill={CR.cham} opacity={0.9} />
      <path d={fuzz(0, 2, 168, 56, 9, 0.26, seed + 1, boil)} fill={CR.pink} />
    </g>
  );
};

/** 苹果树：x 为树根位置 */
export const AppleTree: React.FC<{ x: number; y?: number; s?: number; apples?: number }> = ({ x, y = 1180, s = 1, apples = 4 }) => {
  const boil = useBoil(6);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#crayon)">
      <path d={wob([[-26, 0], [-18, -150], [-46, -230], [-10, -220], [6, -260], [18, -215], [52, -240], [24, -150], [30, 0]], 2, 4, boil)} fill={CR.trunk} stroke={CR.line} strokeWidth={5} strokeLinejoin="round" />
      <path d={fuzz(-70, -300, 120, 90, 10, 0.22, 3, boil)} fill={CR.leaf2} stroke={CR.line} strokeWidth={5} />
      <path d={fuzz(60, -330, 130, 100, 10, 0.22, 6, boil)} fill={CR.leaf} stroke={CR.line} strokeWidth={5} />
      <path d={fuzz(-10, -400, 110, 80, 10, 0.22, 9, boil)} fill={CR.leaf} stroke={CR.line} strokeWidth={5} />
      {Array.from({ length: apples }).map((_, i) => {
        const pos = [[-90, -300], [70, -280], [10, -410], [120, -360], [-40, -360]][i % 5];
        return <g key={i} transform={`translate(${pos[0]} ${pos[1]})`}><Apple s={0.8} /></g>;
      })}
    </g>
  );
};

export const Apple: React.FC<{ s?: number; bite?: boolean }> = ({ s = 1, bite }) => (
  <g transform={`scale(${s})`}>
    <path d="M 0 -26 C -30 -40 -44 -6 -32 16 C -22 34 -8 30 0 26 C 8 30 22 34 32 16 C 44 -6 30 -40 0 -26 Z" fill={CR.apple} stroke={CR.line} strokeWidth={4} strokeLinejoin="round" />
    {bite && <circle cx={34} cy={-4} r={12} fill={CR.warm} />}
    <path d="M -14 -14 Q -18 -4 -14 6" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.7} />
    <path d="M 0 -26 Q 2 -40 8 -46" stroke={CR.line} strokeWidth={4} strokeLinecap="round" fill="none" />
    <path d="M 4 -38 Q 18 -50 26 -40 Q 14 -32 4 -38 Z" fill={CR.leaf} stroke={CR.line} strokeWidth={3} />
  </g>
);

export const Coin: React.FC<{ s?: number; mark?: string; spin?: number }> = ({ s = 1, mark = "¥", spin = 1 }) => (
  <g transform={`scale(${s * spin} ${s})`}>
    <circle r={28} fill={CR.gold} stroke={CR.line} strokeWidth={4} />
    <circle r={20} fill="none" stroke="#C99A2E" strokeWidth={3} />
    <text y={11} textAnchor="middle" fontFamily={ROUND} fontWeight={900} fontSize={30} fill="#8A6418">{mark}</text>
  </g>
);

/** 发光底：画在主体后面，像杰瑞那张会发光的卡 */
export const Glow: React.FC<{ r?: number; o?: number; color?: string }> = ({ r = 220, o = 1, color }) => (
  <circle r={r} fill={color ?? "url(#goldGlow)"} opacity={o} />
);

/** 一闪一闪的小星星 */
export const Sparkle: React.FC<{ x: number; y: number; s?: number; t?: number; color?: string }> = ({ x, y, s = 1, t = 0, color = CR.goldHi }) => (
  <path transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * Math.abs(Math.sin(t * 0.15)))}) rotate(${t * 2})`} d="M 0 -20 Q 3 -3 20 0 Q 3 3 0 20 Q -3 3 -20 0 Q -3 -3 0 -20 Z" fill={color} stroke={CR.line} strokeWidth={2.5} />
);

/** 画面上的大字（手写圆体，白色描边保证在任何背景上都清楚） */
export const Big: React.FC<{ x?: number; y: number; size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties; w?: number; stroke?: string }> = ({ x = 540, y, size = 84, color = CR.text, children, style, w = 960, stroke = "#FFFDF7" }) => (
  <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, textAlign: "center", fontFamily: HAND, fontSize: size, lineHeight: 1.18, color, WebkitTextStroke: `${Math.max(6, size * 0.12)}px ${stroke}`, paintOrder: "stroke fill", letterSpacing: "0.02em", ...style }}>
    {children}
  </div>
);

/** 圆角蜡笔标签 */
export const Tag: React.FC<{ x: number; y: number; text: string; color?: string; fg?: string; size?: number; k?: number; rot?: number }> = ({ x, y, text, color = CR.coral, fg = "#FFFDF7", size = 40, k = 1, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(k), rotate: `${rot}deg`, background: color, color: fg, fontFamily: HAND, fontSize: size, padding: `${size * 0.14}px ${size * 0.5}px`, borderRadius: size, border: `4px solid ${CR.line}`, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(62,42,32,.18)" }}>{text}</div>
);

/** 说话气泡（角色台词，手写体） */
const textLen = (n: React.ReactNode): number => typeof n === "string" ? [...n].length : typeof n === "number" ? String(n).length : Array.isArray(n) ? n.reduce((a: number, c) => a + textLen(c), 0) : React.isValidElement(n) ? textLen((n.props as { children?: React.ReactNode }).children) : 0;
export const Say: React.FC<{ x: number; y: number; children: React.ReactNode; k?: number; size?: number; tail?: "left" | "right" | "down"; dark?: boolean }> = ({ x, y, children, k = 1, size = 46, tail = "down", dark }) => {
  // 估算气泡宽度，把中心夹在画面里，长句不会被左右边缘切掉
  const half = (textLen(children) * size + size * 1.1 + 8) / 2;
  const cx = Math.max(30 + half, Math.min(1050 - half, x));
  return (
  <div style={{ position: "absolute", left: cx, top: y, translate: "-50% -100%", scale: String(k), transformOrigin: "50% 100%" }}>
    <div style={{ position: "relative", background: dark ? "#FFF7E8" : "#FFFDF7", border: `4px solid ${CR.line}`, borderRadius: 34, padding: `${size * 0.22}px ${size * 0.5}px`, fontFamily: HAND, fontSize: size, color: CR.text, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(62,42,32,.15)" }}>
      {children}
      <div style={{ position: "absolute", width: 26, height: 26, background: dark ? "#FFF7E8" : "#FFFDF7", borderRight: `4px solid ${CR.line}`, borderBottom: `4px solid ${CR.line}`, rotate: "45deg", bottom: -15, left: tail === "left" ? 40 : tail === "right" ? "calc(100% - 66px)" : "calc(50% - 13px)" }} />
    </div>
  </div>
  );
};
