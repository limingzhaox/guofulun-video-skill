// v16 风格公共组件（2026-10-25 用户定“固定目前这个风格”）：镜头、世界图层、远景虚化、角上贴纸、小满的房间和书桌、“今天”卡片、
// 常用小图标和书里道具。从 EP16 抽出来，之后每一集都从这里拿，保证画风一致；改这里的样子要先问用户。规范见 `模板\v16风格定稿_20261025\v16风格规范.md`。
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, SERIF, useTL } from "../kit";
import { CR, CrayonDefs, fuzz, HAND, rng, wob } from "../cast/crayon";
import { Shop, ShopKind, SkyHills, Street, WORLD_W, wrect } from "./town";
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

export const fade = (f: number, a: number, b: number, d = 8) => interpolate(f, [a - d, a, b, b + d], [0, 1, 1, 0], CL);
export const popIn = (f: number, at: number) => interpolate(f, [at - 6, at + 2, at + 6], [0, 1.15, 1], CL);

// ---------------------------------------------------------------- 镜头与世界图层（和样片同一套）
export const Camera: React.FC<{ k: number; cx: number; cy: number; children: React.ReactNode }> = ({ k, cx, cy, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(540px, 960px) scale(${k}) translate(${-cx}px, ${-cy}px)` }}>{children}</div>
  </AbsoluteFill>
);
/** soft：远景虚化、淡一点（后排铺子和手艺人用），不抢前排主角 */
export const Layer: React.FC<{ children: React.ReactNode; soft?: boolean; o?: number }> = ({ children, soft, o = 1 }) => (
  <svg width={WORLD_W + 1200} height={4400} viewBox={`-600 -1300 ${WORLD_W + 1200} 4400`}
    style={{ position: "absolute", left: -600, top: -1300, overflow: "visible", opacity: o, filter: soft ? "blur(1.6px) saturate(0.78)" : undefined }}>
    <CrayonDefs light />
    {children}
  </svg>
);
/** 后排手艺人一样虚化 */
export const SoftBox: React.FC<{ children: React.ReactNode; on?: boolean }> = ({ children, on = true }) => (
  <div style={{ position: "absolute", left: 0, top: 0, filter: on ? "blur(1.6px) saturate(0.78)" : undefined, opacity: on ? 0.9 : 1 }}>{children}</div>
);
/** 画面坐标的一层 SVG（带蜡笔滤镜） */
export const Screen: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
    <CrayonDefs light />
    {children}
  </svg>
);

// ---------------------------------------------------------------- 角上的小贴纸：书里的年代 / 今天
export const Sticker: React.FC<{ text: string; k?: number; col?: string; x?: number; y?: number }> = ({ text, k = 1, col = "#B9864E", x = 54, y = 236 }) => (
  <div style={{ position: "absolute", left: x, top: y, background: col, color: "#FFF7E8", fontFamily: HAND, fontSize: 36, padding: "6px 22px", borderRadius: 30, border: `4px solid ${L}`, rotate: "-3deg", opacity: k, scale: String(0.9 + 0.1 * k), boxShadow: "0 5px 0 rgba(62,42,32,.18)", whiteSpace: "nowrap" }}>{text}</div>
);

// ---------------------------------------------------------------- 小满的房间（当代）
/** 墙只留淡淡的竖条壁纸：上面要放大字和三只箱子，不摆书架、窗户（10-25 画面减法） */
export const Room: React.FC<{ dim?: number }> = ({ dim = 0 }) => (
  <g>
    {/* 墙和地用第一篇的纸色系（淡淡一点米黄，10-25 用户：不要太黄） */}
    <rect x={-200} y={-200} width={1480} height={2400} fill="#F2EADB" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 96} y={0} width={40} height={1290} fill="#E8DECB" opacity={0.6} />)}
    <rect x={-200} y={1290} width={1480} height={900} fill="#E2D5BE" />
    {dim > 0 && <rect x={-200} y={-200} width={1480} height={2400} fill="#2B3550" opacity={dim} />}
  </g>
);
/** 书桌（画在小满前面，挡住腿：人站在桌子后面） */
export const Desk: React.FC<{ y?: number }> = ({ y = 1060 }) => (
  <g filter="url(#crayon)">
    <path d={wrect(-40, y, 1160, 46, 21)} fill="#C99A6B" stroke={L} strokeWidth={5} />
    <path d={wrect(-20, y + 46, 1120, 260, 22)} fill="#B5845A" stroke={L} strokeWidth={5} />
    <path d={wrect(80, y + 90, 360, 90, 23)} fill="#C99A6B" stroke={L} strokeWidth={4} />
    <circle cx={260} cy={y + 135} r={9} fill={CR.gold} stroke={L} strokeWidth={2.5} />
    {/* 桌角一个笔筒（不放台灯：会挡住小满的脸） */}
    <path d={wrect(960, y - 70, 56, 70, 24)} fill={CR.blue} stroke={L} strokeWidth={4} />
    <path d={`M 974 ${y - 70} L 966 ${y - 120} M 990 ${y - 70} L 994 ${y - 128} M 1004 ${y - 70} L 1016 ${y - 112}`} stroke={L} strokeWidth={5} strokeLinecap="round" />
  </g>
);

/** 圆印章（花掉了 / 存下了） */
export const Stamp: React.FC<{ text: string; col: string; k: number; rot?: number }> = ({ text, col, k, rot = -10 }) => {
  if (k <= 0) return null;
  const s = interpolate(k, [0, 0.6, 1], [2.2, 0.92, 1], CL);
  return (
    <g transform={`rotate(${rot}) scale(${s})`} opacity={Math.min(1, k * 2)}>
      <circle r={92} fill="#FFFDF7" fillOpacity={0.4} stroke={col} strokeWidth={10} />
      <circle r={76} fill="none" stroke={col} strokeWidth={4} />
      <text y={18} textAnchor="middle" fontFamily={HAND} fontSize={52} fill={col}>{text}</text>
    </g>
  );
};

// ---------------------------------------------------------------- 小图标（箱口冒出来的东西）
export const IcoLoom: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-60, -110, 14, 110, 1)} fill={CR.wood} stroke={L} strokeWidth={3.5} />
    <path d={wrect(46, -110, 14, 110, 2)} fill={CR.wood} stroke={L} strokeWidth={3.5} />
    <path d={wrect(-68, -120, 136, 14, 3)} fill={CR.wood2} stroke={L} strokeWidth={3.5} />
    {[-36, -18, 0, 18, 36].map((x) => <path key={x} d={`M ${x} -104 L ${x} -50`} stroke="#8C7458" strokeWidth={2.5} />)}
    <path d={wrect(-44, -50, 88, 30, 4)} fill="#F4EAD5" stroke={L} strokeWidth={3} />
    <path d="M -44 -38 L 44 -38" stroke={CR.blue} strokeWidth={4} />
  </g>
);
export const IcoCoins: React.FC<{ s?: number; n?: number }> = ({ s = 1, n = 3 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    {Array.from({ length: n }).map((_, i) => (
      <g key={i} transform={`translate(${(i - (n - 1) / 2) * 30} ${-20 - (i % 2) * 18})`}>
        <circle r={24} fill={CR.gold} stroke={L} strokeWidth={3.5} />
        <rect x={-6} y={-6} width={12} height={12} fill="#FFF3CF" stroke={L} strokeWidth={2.5} />
      </g>
    ))}
  </g>
);
export const IcoCloth: React.FC<{ s?: number; col?: string }> = ({ s = 1, col = "#F4EAD5" }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-60, -60, 120, 60, 7)} fill={col} stroke={L} strokeWidth={3.5} />
    <path d="M -60 -42 L 60 -42 M -60 -22 L 60 -22" stroke={CR.blue} strokeWidth={5} opacity={0.6} />
    <ellipse cx={60} cy={-30} rx={12} ry={30} fill={col} stroke={L} strokeWidth={3.5} />
  </g>
);
export const IcoBread: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d="M -48 0 Q -52 -46 0 -46 Q 52 -46 48 0 Z" fill="#D9A15A" stroke={L} strokeWidth={3.5} />
    {[-20, 0, 20].map((x) => <path key={x} d={`M ${x - 6} -32 L ${x + 6} -18`} stroke="#A9783F" strokeWidth={3} strokeLinecap="round" />)}
  </g>
);
export const IcoShirt: React.FC<{ s?: number; col?: string }> = ({ s = 1, col = CR.coral }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d="M -22 -70 L -50 -58 L -62 -34 L -42 -26 L -38 -36 L -38 0 L 38 0 L 38 -36 L 42 -26 L 62 -34 L 50 -58 L 22 -70 Q 0 -56 -22 -70 Z" fill={col} stroke={L} strokeWidth={3.5} strokeLinejoin="round" />
  </g>
);
export const IcoChair: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-30, -100, 60, 56, 9)} fill={CR.wood} stroke={L} strokeWidth={3.5} />
    <path d={wrect(-38, -46, 76, 14, 10)} fill={CR.wood2} stroke={L} strokeWidth={3.5} />
    <path d="M -30 -32 L -32 0 M 30 -32 L 32 0" stroke={L} strokeWidth={6} strokeLinecap="round" />
  </g>
);
export const IcoHouse: React.FC<{ s?: number; door?: string }> = ({ s = 1, door = "#A9784F" }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wob([[-70, -70], [0, -130], [70, -70]], 1.5, 3)} fill="#C98B67" stroke={L} strokeWidth={4} strokeLinejoin="round" />
    <path d={wrect(-58, -74, 116, 74, 12)} fill="#F6E7CF" stroke={L} strokeWidth={4} />
    <path d={wrect(-14, -44, 28, 44, 13)} fill={door} stroke={L} strokeWidth={3} />
    <path d={wrect(22, -60, 24, 22, 14)} fill="#CFE6F4" stroke={L} strokeWidth={3} />
  </g>
);
export const IcoBook: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d="M 0 -10 Q -30 -26 -62 -16 L -62 -76 Q -30 -86 0 -70 Q 30 -86 62 -76 L 62 -16 Q 30 -26 0 -10 Z" fill="#FFFDF7" stroke={L} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M 0 -70 L 0 -10" stroke={L} strokeWidth={3} />
    {[0, 1, 2].map((i) => <path key={i} d={`M -50 ${-64 + i * 14} Q -28 ${-70 + i * 14} -10 ${-62 + i * 14} M 10 ${-62 + i * 14} Q 28 ${-70 + i * 14} 50 ${-64 + i * 14}`} stroke="#C9B9A2" strokeWidth={3} fill="none" />)}
  </g>
);
/** 机器：一个齿轮 */
export const IcoGear: React.FC<{ s?: number; t?: number; col?: string }> = ({ s = 1, t = 0, col = "#9AA6B2" }) => {
  const teeth = 10;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 ? 46 : 58;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <g transform={`scale(${s})`} filter="url(#crayon)">
      <g transform={`translate(0 -60) rotate(${t * 2})`}>
        <polygon points={pts.join(" ")} fill={col} stroke={L} strokeWidth={4} strokeLinejoin="round" />
        <circle r={18} fill="#FFFDF7" stroke={L} strokeWidth={4} />
      </g>
    </g>
  );
};
/** 改良过的地：一垄一垄的田 */
export const IcoField: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wob([[-80, 0], [-60, -60], [60, -60], [80, 0]], 1.5, 5)} fill="#B98A5A" stroke={L} strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${-70 + i * 8} ${-12 - i * 14} L ${70 - i * 8} ${-12 - i * 14}`} stroke={CR.leaf2} strokeWidth={7} strokeLinecap="round" />)}
  </g>
);
/** 店铺小图标 */
export const IcoShop: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-60, -90, 120, 90, 15)} fill="#F6E7CF" stroke={L} strokeWidth={4} />
    <path d={wob([[-72, -86], [72, -86], [62, -60], [-62, -60]], 1, 16)} fill={CR.coral} stroke={L} strokeWidth={3.5} />
    <path d={wrect(-16, -46, 32, 46, 17)} fill="#A9784F" stroke={L} strokeWidth={3} />
  </g>
);
export const IcoTimber: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${(i - 1) * 34} ${-22 - (i === 1 ? 30 : 0)})`}>
        <path d={wrect(-60, -14, 120, 28, 20 + i)} fill={CR.wood} stroke={L} strokeWidth={3} />
        <ellipse cx={60} cy={0} rx={10} ry={14} fill="#E8C99A" stroke={L} strokeWidth={3} />
      </g>
    ))}
  </g>
);
export const IcoSack: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wob([[-40, 0], [-36, -54], [-18, -76], [18, -76], [36, -54], [40, 0]], 2, 61)} fill="#E9D6A6" stroke={L} strokeWidth={3.5} />
    <path d="M -14 -72 Q 0 -66 14 -72" stroke="#A9783F" strokeWidth={3.5} fill="none" />
  </g>
);
export const IcoLaptop: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-60, -96, 120, 76, 24)} fill="#4A5563" stroke={L} strokeWidth={4} />
    <rect x={-50} y={-88} width={100} height={60} fill="#9FD3F0" />
    <path d="M -80 -16 L 80 -16 L 70 0 L -70 0 Z" fill="#C9CED6" stroke={L} strokeWidth={4} strokeLinejoin="round" />
  </g>
);
export const IcoShelf: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-80, -150, 160, 150, 25)} fill="#F6F1E6" stroke={L} strokeWidth={4} />
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <path d={`M -80 ${-104 + r * 48} L 80 ${-104 + r * 48}`} stroke={L} strokeWidth={3.5} />
        {[0, 1, 2, 3].map((c) => <path key={c} d={wrect(-70 + c * 36, -138 + r * 48, 26, 32, r * 4 + c)} fill={[CR.coral, CR.gold, CR.blue, CR.green][(r + c) % 4]} stroke={L} strokeWidth={2.5} />)}
      </g>
    ))}
  </g>
);
export const IcoParcel: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    {[[-36, 0], [36, 0], [0, -60]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <path d={wrect(-34, -58, 68, 58, 30 + i)} fill="#D6A867" stroke={L} strokeWidth={3.5} />
        <path d="M -34 -38 L 34 -38 M 0 -58 L 0 -38" stroke="#A9783F" strokeWidth={3} />
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- 大一点的书里道具
/** 一头牛（plow：拉着犁；fat：圆滚滚，挂个卖的牌子） */
export const Ox: React.FC<{ s?: number; plow?: boolean; fat?: boolean; t?: number }> = ({ s = 1, plow, fat, t = 0 }) => {
  const bw = fat ? 120 : 100, bh = fat ? 70 : 56;
  const step = Math.sin(t * 0.25) * 4;
  return (
    <g transform={`scale(${s})`} filter="url(#crayon)">
      {plow && <g><path d="M -110 -60 L -180 -30 L -200 0" fill="none" stroke={CR.wood2} strokeWidth={8} strokeLinecap="round" /><path d="M -210 0 L -186 -6 L -196 14 Z" fill="#8C8C94" stroke={L} strokeWidth={3} /></g>}
      {[-70, -40, 40, 70].map((x, i) => <path key={i} d={`M ${x} -40 L ${x + (i % 2 ? step : -step)} 0`} stroke="#6E4A33" strokeWidth={14} strokeLinecap="round" />)}
      <path d={fuzz(0, -76, bw, bh, 12, 0.08, fat ? 7 : 5, 0)} fill="#B9825A" stroke={L} strokeWidth={4} />
      <path d={fuzz(20, -70, 34, 22, 8, 0.2, 9, 0)} fill="#F2E3CC" opacity={0.9} />
      <g transform={`translate(${bw + 10} -96)`}>
        <path d={fuzz(0, 0, 44, 36, 10, 0.06, 3, 0)} fill="#B9825A" stroke={L} strokeWidth={4} />
        <ellipse cx={18} cy={14} rx={24} ry={16} fill="#E8B8A0" stroke={L} strokeWidth={3} />
        <circle cx={-6} cy={-8} r={5} fill={L} />
        <path d="M -24 -30 Q -40 -50 -30 -60 M 10 -32 Q 20 -54 34 -56" stroke="#F2E3CC" strokeWidth={8} strokeLinecap="round" fill="none" />
        <path d="M -24 -30 Q -40 -50 -30 -60 M 10 -32 Q 20 -54 34 -56" stroke={L} strokeWidth={2} strokeLinecap="round" fill="none" />
      </g>
      <path d={`M ${-bw} -90 Q ${-bw - 30} -70 ${-bw - 26} -40`} stroke={L} strokeWidth={4} fill="none" />
    </g>
  );
};
/** 铁厂的熔炉（火在跳） */
export const Furnace: React.FC<{ s?: number; t?: number }> = ({ s = 1, t = 0 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wob([[-110, 0], [-90, -240], [-40, -300], [40, -300], [90, -240], [110, 0]], 2, 71)} fill="#B5654A" stroke={L} strokeWidth={5} />
    {[0, 1, 2, 3, 4].map((r) => <path key={r} d={`M ${-100 + r * 4} ${-40 - r * 50} L ${100 - r * 4} ${-40 - r * 50}`} stroke="#8E4A36" strokeWidth={3} />)}
    <path d={wrect(-46, -110, 92, 90, 72)} fill="#3B2A22" stroke={L} strokeWidth={4} />
    <path d={fuzz(0, -60, 32 + Math.sin(t * 0.5) * 4, 36 + Math.sin(t * 0.7) * 5, 9, 0.35, Math.floor(t / 3) % 5, 0)} fill="#F7A23A" />
    <path d={fuzz(0, -54, 16, 20, 8, 0.35, Math.floor(t / 3) % 4 + 7, 0)} fill="#FFE08A" />
    <path d={fuzz(0, -330 - (t % 40), 40, 22, 8, 0.3, 4, 0)} fill="#D9D3CC" opacity={0.7 - (t % 40) / 70} />
  </g>
);
/** 矿井抽水机（大木轮在转） */
export const MinePump: React.FC<{ s?: number; t?: number }> = ({ s = 1, t = 0 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d="M -110 0 L -30 -260 M 110 0 L 30 -260" stroke={CR.wood2} strokeWidth={14} strokeLinecap="round" />
    <g transform={`translate(0 -200) rotate(${t * 1.5})`}>
      <circle r={90} fill="none" stroke={CR.wood} strokeWidth={14} />
      {[0, 45, 90, 135].map((a) => <path key={a} d="M -90 0 L 90 0" transform={`rotate(${a})`} stroke={CR.wood} strokeWidth={8} />)}
      <circle r={16} fill={CR.wood2} stroke={L} strokeWidth={4} />
    </g>
    <path d={wrect(-60, -40, 120, 40, 73)} fill="#7E8C99" stroke={L} strokeWidth={4} />
    <path d={`M 60 -24 Q 110 -24 110 ${10 + (t % 12)}`} fill="none" stroke="#7FB0D8" strokeWidth={10} strokeLinecap="round" />
  </g>
);
/** 埋起来的箱子 */
export const Chest: React.FC<{ s?: number; sink?: number }> = ({ s = 1, sink = 0 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <clipPath id="chestSoil"><rect x={-200} y={-300} width={400} height={300} /></clipPath>
    <g clipPath="url(#chestSoil)">
      <g transform={`translate(0 ${sink * 110})`}>
        <path d={wrect(-80, -100, 160, 100, 81)} fill="#A9784F" stroke={L} strokeWidth={4} />
        <path d="M -80 -100 Q 0 -150 80 -100" fill="#C08A5A" stroke={L} strokeWidth={4} />
        <path d="M -80 -60 L 80 -60" stroke={CR.gold} strokeWidth={8} />
        <rect x={-10} y={-74} width={20} height={26} fill={CR.gold} stroke={L} strokeWidth={3} />
      </g>
    </g>
    <path d={wob([[-170, 0], [-100, -24 - sink * 30], [0, -30 - sink * 40], [100, -24 - sink * 30], [170, 0]], 2, 82, 0, false) + " L 170 30 L -170 30 Z"} fill="#9A7350" stroke={L} strokeWidth={4} />
  </g>
);

// ---------------------------------------------------------------- 今天的小卡片（当代例子）
export const TodayCard: React.FC<{ x: number; y: number; w?: number; h?: number; k: number; children: React.ReactNode }> = ({ x, y, w = 560, h = 340, k, children }) => {
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${interpolate(k, [0, 1], [0.85, 1])})`} opacity={k}>
      <g filter="url(#crayon)"><path d={wrect(-w / 2, -h / 2, w, h, 90, 3)} fill="#FFFDF7" stroke={L} strokeWidth={5} /></g>
      <g transform={`translate(${-w / 2 + 24} ${-h / 2 - 26})`}>
        <rect width={110} height={52} rx={26} fill={CR.blue} stroke={L} strokeWidth={4} />
        <text x={55} y={37} textAnchor="middle" fontFamily={HAND} fontSize={34} fill="#FFFDF7">今天</text>
      </g>
      {children}
    </g>
  );
};

/** 全片帧号 → 场景内帧号的换算（给 overlay 用） */
export const useSceneFrom = () => {
  const TL = useTL();
  return (id: string) => TL.scenes.find((s) => s.id === id)!.from;
};
export const useLineAbs = () => {
  const TL = useTL();
  return (scene: string, i: number) => TL.lines.filter((l) => l.scene === scene)[i].from;
};

/** 可复现的随机散点（撒小星星用） */
export const scatter = (n: number, seed: number, w: number, h: number) => {
  const r = rng(seed);
  return Array.from({ length: n }).map(() => [r() * w, r() * h] as [number, number]);
};


// ================================================================ 简洁高级版（10-25 用户：内容为主、画面为辅，要“高级一点”）
/**
 * 景深背景：小镇整个虚化、提亮，前面的人物和卡片就显得清楚、干净（像电影浅景深）。
 * 10-25 用户：先嫌太冷（蓝天、绿山发青发白），加了暖黄又嫌“黄过了”——定成第一篇的纸色：淡淡一点米黄（罩一层 #F1EADB）。
 * shops：要不要后排铺子；drift：慢慢推近的程度（0–1）
 */
export const SoftTown: React.FC<{ f: number; shops?: boolean; drift?: number; tint?: string }> = ({ f, shops = true, drift = 0.03, tint = "rgba(241,234,219,0.5)" }) => {
  const k = 1 + drift * Math.min(1, f / 300);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${k})`, transformOrigin: "50% 60%", filter: "blur(5px) sepia(0.15) saturate(0.75)" }}>
        <svg width={1080} height={1920} viewBox="300 -40 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CrayonDefs light />
          <SkyHills drift={f * 0.15} />
          <Street />
          {shops && (["tailor", "shoe", "smith", "butcher", "gold", "books", "fish"] as ShopKind[]).map((kd, i) => <Shop key={kd} x={10 + i * 326} kind={kd} seed={i + 1} />)}
        </svg>
      </div>
      <AbsoluteFill style={{ background: tint }} />
    </AbsoluteFill>
  );
};

/**
 * 纸上的虚化小镇（10-26 用户：“色调对了，但是不要去掉后面的虚化的景观”）：
 * 虚化小镇在下面，上面罩第一篇的纸色、纸张颗粒和四角压暗——景深还在，整体又是第一篇那张纸。dusk = 冷调程度（0–1）
 */
export const PaperTown: React.FC<{ f: number; shops?: boolean; dusk?: number }> = ({ f, shops = true, dusk = 0 }) => {
  const seed = Math.floor(f / 3) % 6;
  return (
    <AbsoluteFill>
      <SoftTown f={f} shops={shops} tint="rgba(241,234,219,0.58)" />
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 30%, #4A5872 0%, #232B3B 70%, #1B2130 100%)", opacity: dusk }} />
      <svg width="100%" height="100%" style={{ position: "absolute", mixBlendMode: "multiply", opacity: 0.42 }}>
        <filter id={`ptgrain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.40  0 0 0 0 0.33  0 0 0 0.22 0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#ptgrain${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(95% 75% at 50% 45%, transparent 60%, rgba(40,28,10,0.15) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 10-26 和第一篇融合（用户：第二篇画风偏离第一篇，观众有割裂感）
// 第一篇的“书页”外框搬过来：纸张底 + 颗粒（kit 的 Paper）、思源宋体粗体、墨色细边卡片、朱砂红一个强调色、页眉 + 宋体字幕（Episode look="paper"）。
// 彩铅人物和道具保留，当作书页上的插图。下面三个部件默认就是融合版；EP16（已发布）是融合前的样子。
export const INK = C.ink;
export const RED = C.red;

/** 卡片（SVG）：第一篇那种米白纸卡、墨色细边、小圆角、淡淡的错位阴影 */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; k?: number; children?: React.ReactNode; accent?: string }> = ({ x, y, w, h, k = 1, children, accent }) => {
  if (k <= 0) return null;
  const s = interpolate(k, [0, 1], [0.94, 1]);
  return (
    <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${s}) translate(${-w / 2} ${-h / 2})`} opacity={Math.min(1, k * 1.4)}>
      <rect x={8} y={8} width={w} height={h} rx={16} fill="rgba(27,30,36,0.12)" />
      <rect x={0} y={0} width={w} height={h} rx={16} fill="#FBF7EF" stroke={INK} strokeWidth={3.5} />
      {accent && <rect x={2} y={2} width={10} height={h - 4} rx={4} fill={accent} />}
      {children}
    </g>
  );
};

/** 顶部关键词（≤8 字，不复读字幕）：同一个位置、思源宋体粗体墨色（和第一篇的大字一样），淡入 + 轻轻放大 */
export const Keyword: React.FC<{ text: React.ReactNode; at: number; out?: number; y?: number; size?: number; color?: string }> = ({ text, at, out = 1e9, y = 326, size = 88, color = INK }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at - 6, at + 6, out - 6, out + 4], [0, 1, 1, 0], CL);
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: size * 0.9, color, lineHeight: 1.2, opacity: k, scale: String(interpolate(k, [0, 1], [1.06, 1])), WebkitTextStroke: `${Math.max(5, size * 0.07)}px ${C.paper}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/**
 * 顶部三格进度（10-26 用户：底部进度条挪上来，和三格方框合在一起）。
 * 10-26 深夜用户：“上方的进度条不要第一篇的风格，但是保留目录的标签，总体的动画和画面还是第二篇的风格”
 * → 第一篇的页眉（目录标签：国富论｜第X篇·第X章｜No.XX）保留；进度条用回第二篇的样子：粗手绘边的胖胶囊、每一部分自己的颜色、下方实心阴影、当前格放大；
 *   讲到哪一格，那一格就从左往右涂上这一部分的颜色（到“第 X 件的结论”涂满），讲完的保持彩色并打勾；位置在页眉下面（y=210）。
 * 帧号都是全片帧号；spans = 每一部分的起止，ticks = 每一部分结论那句开始的帧。
 */
/** 页眉、三格、顶部关键词、结论章的高度（EP25 起）。10-31 用户看 EP22 手机截图：页眉和三格“往上靠，现在会挤占中间的画面”→ 整组上移约 54px，页眉贴着手机状态栏下面（抖音顶部导航大约盖到 y≈120，页眉的字从 104 起），两排之间仍留约 24px；EP24 及以前不传，位置不变 */
export const TOPS = { header: 104, bar: 186, keyword: 272, verdict: 284 };

export const PartBar: React.FC<{ parts: { n: string; short: string; col: string }[]; from: number; to: number; ticks: number[]; spans: [number, number][]; top?: number }> = ({ parts, from, to, ticks, spans, top = 240 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [from - 8, from + 6, to - 6, to + 6], [0, 1, 1, 0], CL);
  if (k <= 0) return null;
  return (
    // 10-27 用户：页眉和进度条“两排字体有点拥挤”→ 往下挪到 240、胶囊矮一点（58）、字小一点（28），和页眉那条线之间留出约 28px；EP25 起传 TOPS.bar
    <div style={{ position: "absolute", left: 40, right: 40, top, display: "flex", gap: 14, opacity: k, translate: `0 ${(1 - k) * -20}px` }}>
      {parts.map((p, i) => {
        const fill = interpolate(f, [spans[i][0], ticks[i]], [0, 1], CL);
        const done = f >= ticks[i];
        const on = f >= spans[i][0] && f < spans[i][1];
        const tk = interpolate(f, [ticks[i], ticks[i] + 6, ticks[i] + 10], [0, 1.3, 1], CL);
        const label = (color: string) => (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color }}>
            <span>{p.n}</span><span>{p.short}</span>
            {done && <span style={{ display: "inline-block", scale: String(tk), marginLeft: 4 }}>✓</span>}
          </div>
        );
        return (
          <div key={p.n} style={{ position: "relative", flex: 1, height: 58, borderRadius: 29, border: `4px solid ${L}`, background: "#FFFCF6", overflow: "hidden", fontFamily: SERIF, fontWeight: 900, fontSize: 28, whiteSpace: "nowrap", scale: on ? "1.06" : "1", boxShadow: "0 5px 0 rgba(62,42,32,.16)", opacity: fill > 0 ? 1 : 0.85 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: p.col }} />
            {label(CR.text)}
            {/* 涂到的那一截，字换成白色 */}
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}>{label("#FFFCF6")}</div>
          </div>
        );
      })}
    </div>
  );
};

/** 镜头内分段：在 [a, b) 之间显示，前后 8 帧淡入淡出 */
export const Shot: React.FC<{ f: number; a: number; b: number; children: React.ReactNode; d?: number }> = ({ f, a, b, children, d = 8 }) => {
  const k = interpolate(f, [a - d, a, b - d, b], [0, 1, 1, 0], CL);
  if (k <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: k }}>{children}</div>;
};
