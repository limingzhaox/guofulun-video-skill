// EP06 专用道具：奶茶杯（全集串场元素）、三色价格条、海狸、鹿、树、草、钱袋、钥匙、面粉袋、源头泉眼
import React from "react";
import { C, SERIF } from "../kit";

/** 价格的三块：工资=赭黄、利润=朱红、地租=灰绿（整集统一，用颜色帮观众记住） */
export const PART = { wage: C.ochre, profit: C.red, rent: C.sage } as const;
export type PartKey = keyof typeof PART;
export const PART_NAME: Record<PartKey, string> = { wage: "工资", profit: "利润", rent: "地租" };

const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
/** 两个颜色之间插值 */
export const mix = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`;
};

const TEA = "#C9A07A";
const halfW = (y: number) => 72 + 26 * (-y / 300); // 杯身内壁半宽（杯底 y=0，杯口 y=-300）

/**
 * 奶茶杯：原点在杯底中心，高约 420（含吸管）。
 * split 0→1：奶茶从一种颜色分成三层（自上而下 工资 / 利润 / 地租）；三层等高，只是示意，不代表真实比例。
 * lift：三层往外错开（拆开给人看）；price：价签文字
 */
export const MilkTea: React.FC<{ s?: number; split?: number; lift?: number; price?: string; o?: number; dim?: PartKey[]; level?: number; straw?: boolean }> = ({ s = 1, split = 0, lift = 0, price = "¥20", o = 1, dim = [], level = 1, straw = true }) => {
  const top = -268 + (1 - level) * 258; // level：剩下多少（被吸管吸走时往下降）
  const bands: { k: PartKey; y0: number; y1: number }[] = [
    { k: "wage", y0: -268, y1: -182 },
    { k: "profit", y0: -182, y1: -96 },
    { k: "rent", y0: -96, y1: -10 },
  ];
  return (
    <g transform={`scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={6} rx={110} ry={14} fill="rgba(40,28,10,0.16)" />
      {/* 杯身 */}
      <path d="M -98 -300 L 98 -300 L 74 0 L -74 0 Z" fill="#FBF7EF" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      {bands.map((b, i) => {
        const dx = [-26, 40, -14][i] * lift;
        const col = mix(TEA, PART[b.k], split);
        const off = dim.includes(b.k) ? 0.25 : 1;
        const y0 = Math.max(b.y0, top);
        if (y0 >= b.y1) return null;
        return (
          <g key={b.k} transform={`translate(${dx} 0)`} opacity={off}>
            <path d={`M ${-halfW(y0) + 6} ${y0} L ${halfW(y0) - 6} ${y0} L ${halfW(b.y1) - 6} ${b.y1} L ${-halfW(b.y1) + 6} ${b.y1} Z`} fill={col} />
            {split > 0.5 && i < 2 && <line x1={-halfW(b.y1) + 6} y1={b.y1} x2={halfW(b.y1) - 6} y2={b.y1} stroke="#FBF7EF" strokeWidth={4} opacity={(split - 0.5) * 2} />}
          </g>
        );
      })}
      {/* 珍珠 */}
      {[[-40, -26], [-12, -22], [18, -28], [44, -22], [-26, -50], [6, -48], [32, -52]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={11} fill="#3A2A20" opacity={1 - split * 0.55} />
      ))}
      {/* 高光 + 杯盖 + 吸管 */}
      <path d="M -80 -284 L -64 -20" stroke="#FFFFFF" strokeWidth={10} opacity={0.35} strokeLinecap="round" />
      <path d="M -108 -300 Q -108 -330 0 -334 Q 108 -330 108 -300 Z" fill="#FBF7EF" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-110} y={-306} width={220} height={14} rx={7} fill="#FBF7EF" stroke={C.ink} strokeWidth={4} />
      {straw && <path d="M 18 -330 L 52 -430" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />}
      {straw && <path d="M 18 -330 L 52 -430" stroke={C.red} strokeWidth={14} strokeLinecap="round" />}
      {/* 价签 */}
      {price && (
        <g transform="translate(96 -210) rotate(10)">
          <path d="M 0 0 L 30 -40" stroke={C.ink2} strokeWidth={3} />
          <path d="M 18 -34 L 116 -34 L 132 -4 L 116 26 L 18 26 Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={30} cy={-4} r={6} fill={C.ink} />
          <text x={78} y={10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={C.red}>{price}</text>
        </g>
      )}
    </g>
  );
};

/** 三色价格条：原点在底边中心，parts 自下而上；h 为各段高度（像素） */
export const PriceBar: React.FC<{ x: number; y: number; w?: number; parts: { k: PartKey; h: number }[]; labels?: boolean; o?: number; size?: number }> = ({ x, y, w = 200, parts, labels = true, o = 1, size = 36 }) => {
  let acc = 0;
  const total = parts.reduce((a, p) => a + p.h, 0);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {parts.map((p) => {
        const y0 = -acc - p.h;
        acc += p.h;
        if (p.h <= 0.5) return null;
        return (
          <g key={p.k}>
            <rect x={-w / 2} y={y0} width={w} height={p.h} fill={PART[p.k]} />
            {labels && p.h > size * 1.3 && (
              <text x={0} y={y0 + p.h / 2 + size * 0.36} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={size} fill={C.paper}>{PART_NAME[p.k]}</text>
            )}
          </g>
        );
      })}
      {total > 0.5 && <rect x={-w / 2} y={-total} width={w} height={total} fill="none" stroke={C.ink} strokeWidth={5} />}
    </g>
  );
};

/** 海狸：原点在脚底中心 */
export const Beaver: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={9} fill="rgba(40,28,10,0.16)" />
    <g transform="rotate(-12 -60 -14)">
      <ellipse cx={-70} cy={-14} rx={38} ry={15} fill="#5C3D28" stroke={C.ink} strokeWidth={3} />
      {[-90, -74, -58].map((x) => <path key={x} d={`M ${x} -26 l 8 24`} stroke="#8A6448" strokeWidth={2} />)}
    </g>
    <ellipse cx={0} cy={-38} rx={56} ry={36} fill="#8A5A3A" stroke={C.ink} strokeWidth={3} />
    <ellipse cx={8} cy={-30} rx={30} ry={20} fill="#A87652" />
    <circle cx={36} cy={-84} r={8} fill="#6E4630" stroke={C.ink} strokeWidth={2.5} />
    <circle cx={48} cy={-62} r={26} fill="#8A5A3A" stroke={C.ink} strokeWidth={3} />
    <circle cx={58} cy={-68} r={4.5} fill={C.ink} />
    <ellipse cx={72} cy={-56} rx={6} ry={5} fill={C.ink} />
    <rect x={60} y={-46} width={12} height={13} rx={2} fill="#FBF7EF" stroke={C.ink} strokeWidth={2} />
    <ellipse cx={-20} cy={-4} rx={14} ry={7} fill="#5C3D28" />
    <ellipse cx={30} cy={-4} rx={14} ry={7} fill="#5C3D28" />
  </g>
);

/** 鹿：原点在脚底中心 */
export const Deer: React.FC<{ s?: number; step?: number }> = ({ s = 1, step = 0 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={9} fill="rgba(40,28,10,0.16)" />
    {[[-38, step], [-22, -step], [30, -step], [44, step]].map(([x, a], i) => (
      <line key={i} x1={x} y1={-84} x2={x + a} y2={0} stroke={i % 2 ? "#8C5A32" : "#9E6A3E"} strokeWidth={10} strokeLinecap="round" />
    ))}
    <ellipse cx={0} cy={-104} rx={62} ry={30} fill="#B57A48" stroke={C.ink} strokeWidth={3} />
    {[[-20, -116], [0, -122], [18, -114], [-6, -104]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#F3E3C8" />)}
    <path d="M -58 -112 q -14 -6 -12 6" fill="#F3E3C8" stroke={C.ink} strokeWidth={2.5} />
    <path d="M 40 -116 L 64 -170 L 84 -160 L 62 -104 Z" fill="#B57A48" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
    <ellipse cx={80} cy={-176} rx={26} ry={16} fill="#B57A48" stroke={C.ink} strokeWidth={3} transform="rotate(20 80 -176)" />
    <circle cx={86} cy={-180} r={4} fill={C.ink} />
    <circle cx={104} cy={-168} r={5} fill={C.ink} />
    <path d="M 66 -190 q -10 -30 4 -50 M 70 -214 l -16 -8 M 78 -190 q 6 -32 28 -42 M 96 -226 l 6 -16" stroke={C.wood} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

export const Tree: React.FC<{ s?: number; o?: number }> = ({ s = 1, o = 1 }) => (
  <g transform={`scale(${s})`} opacity={o}>
    <rect x={-12} y={-120} width={24} height={120} rx={6} fill={C.wood} stroke={C.ink} strokeWidth={3} />
    {[[-40, -150, 50], [36, -156, 48], [0, -200, 60], [-10, -140, 46]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#869572" : C.sage} stroke={C.ink} strokeWidth={3} />
    ))}
  </g>
);

export const Grass: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[-18, -8, 2, 12, 22].map((x, i) => <path key={x} d={`M ${x} 0 q ${i % 2 ? 6 : -6} -24 ${i % 2 ? 2 : -2} -${36 + (i % 3) * 8}`} stroke={i % 2 ? "#6F7E5E" : C.sage} strokeWidth={6} fill="none" strokeLinecap="round" />)}
  </g>
);

/** 小价签：原点在挂孔 */
export const Tag: React.FC<{ text: string; color?: string; s?: number; rot?: number }> = ({ text, color = PART.rent, s = 1, rot = 8 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    <path d="M 0 0 L 24 -22 L 110 -22 L 110 22 L 24 22 Z" fill={color} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={18} cy={0} r={5} fill={C.paper} />
    <text x={68} y={11} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={C.paper}>{text}</text>
  </g>
);

export const MoneyBag: React.FC<{ s?: number; label?: string }> = ({ s = 1, label = "£" }) => (
  <g transform={`scale(${s})`}>
    <path d="M -50 0 Q -66 -60 -22 -86 L 22 -86 Q 66 -60 50 0 Z" fill="#E2B54A" stroke={C.ink} strokeWidth={3.5} />
    <path d="M -22 -86 Q -36 -108 -14 -112 L 14 -112 Q 36 -108 22 -86" fill="#E2B54A" stroke={C.ink} strokeWidth={3.5} />
    <path d="M -24 -88 L 24 -88" stroke={C.red} strokeWidth={6} />
    <text x={0} y={-24} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={C.ink}>{label}</text>
  </g>
);

export const Key: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle cx={0} cy={0} r={18} fill="none" stroke="#C9A040" strokeWidth={8} />
    <path d="M 18 0 L 70 0 M 56 0 L 56 14 M 66 0 L 66 10" stroke="#C9A040" strokeWidth={8} strokeLinecap="round" />
  </g>
);

export const FlourSack: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -40 0 Q -50 -50 -26 -76 L 26 -76 Q 50 -50 40 0 Z" fill="#F4EFE6" stroke={C.ink} strokeWidth={3} />
    <path d="M -26 -76 Q 0 -90 26 -76" stroke={C.ink} strokeWidth={3} fill="none" />
    <circle cx={-30} cy={-88} r={5} fill="#F4EFE6" opacity={0.8} /><circle cx={24} cy={-94} r={4} fill="#F4EFE6" opacity={0.8} />
    <text x={0} y={-24} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={26} fill={C.ink}>面</text>
  </g>
);

/** 源头泉眼（暗场用）：原点在井口中心；t 为帧号，用来让水往上冒 */
export const Spring: React.FC<{ color: string; t: number; s?: number; label: string; glow?: number }> = ({ color, t, s = 1, label, glow = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={0} rx={120 * glow} ry={40 * glow} fill={color} opacity={0.18} />
    {[0, 1, 2].map((i) => {
      const p = ((t * 0.02 + i / 3) % 1);
      return <ellipse key={i} cx={0} cy={0} rx={30 + p * 80} ry={10 + p * 26} fill="none" stroke={color} strokeWidth={3} opacity={(1 - p) * 0.8 * glow} />;
    })}
    <ellipse cx={0} cy={0} rx={70} ry={22} fill="#0E1013" stroke="#5A5F68" strokeWidth={8} />
    <path d={`M -14 0 Q -18 ${-60 - 6 * Math.sin(t * 0.2)} 0 ${-96 - 8 * Math.sin(t * 0.15)} Q 18 ${-60 - 6 * Math.cos(t * 0.2)} 14 0 Z`} fill={color} opacity={0.85 * glow} />
    <text x={0} y={92} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={52} fill={color}>{label}</text>
  </g>
);
