// 通用道具库：动物与商品。原点在物体底部中心（狗在脚底），方便摆放。
import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./kit";

export type DogKind = "mutt" | "mastiff" | "greyhound" | "spaniel" | "shepherd";
const DOGS: Record<DogKind, { body: string; ear: string; w: number; h: number; leg: number; snout: number; floppy: boolean }> = {
  mutt: { body: "#C8924E", ear: "#8A5A36", w: 110, h: 54, leg: 40, snout: 26, floppy: true },
  mastiff: { body: "#A8794A", ear: "#4A3426", w: 150, h: 78, leg: 46, snout: 22, floppy: true },
  greyhound: { body: "#B9B2A6", ear: "#7D766C", w: 130, h: 40, leg: 64, snout: 38, floppy: false },
  spaniel: { body: "#E8DCC4", ear: "#8A5A36", w: 100, h: 50, leg: 34, snout: 24, floppy: true },
  shepherd: { body: "#3B3631", ear: "#3B3631", w: 120, h: 56, leg: 46, snout: 30, floppy: false },
};

/** 小狗：面朝右（flip 朝左），wag 为摇尾巴速度，hold 叼在嘴里的东西 */
export const Dog: React.FC<{ x: number; y: number; s?: number; kind?: DogKind; flip?: boolean; wag?: number; hold?: React.ReactNode; gray?: boolean; o?: number }> = ({ x, y, s = 1, kind = "mutt", flip, wag = 0.3, hold, gray, o = 1 }) => {
  const f = useCurrentFrame();
  const d = DOGS[kind];
  const col = gray ? "#8C8C8C" : d.body;
  const ear = gray ? "#5E5E5E" : d.ear;
  const tail = Math.sin(f * wag) * 18;
  const step = Math.sin(f * 0.2) * 2;
  const bx = d.w / 2, by = -d.leg - d.h / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={o}>
      <ellipse cx={0} cy={3} rx={d.w * 0.55} ry={8} fill="rgba(40,28,10,0.16)" />
      {[-bx + 16, -bx + 34, bx - 30, bx - 14].map((lx, i) => (
        <rect key={i} x={lx - 6} y={-d.leg - 4} width={12} height={d.leg + 4} rx={6} fill={i % 2 ? col : ear} opacity={i % 2 ? 1 : 0.85} />
      ))}
      <g transform={`rotate(${-30 + tail} ${-bx + 6} ${by - 6})`}>
        <path d={`M ${-bx + 6} ${by - 6} q -26 -10 -34 -34`} stroke={col} strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>
      <ellipse cx={0} cy={by + step * 0.2} rx={bx} ry={d.h / 2} fill={col} />
      <g transform={`translate(${bx - 6} ${by - d.h * 0.45})`}>
        <circle cx={0} cy={0} r={d.h * 0.55 + 6} fill={col} />
        <path d={`M 0 ${-4} h ${d.snout} q 10 0 10 10 q 0 10 -10 10 h ${-d.snout}`} fill={col} />
        <circle cx={d.snout + 8} cy={2} r={6} fill={C.ink} />
        <circle cx={6} cy={-10} r={4} fill={C.ink} />
        {d.floppy ? (
          <path d={`M -14 -14 q -10 4 -8 30 q 10 -4 14 -24 z`} fill={ear} />
        ) : (
          <path d={`M -10 -18 l -2 -26 l 16 18 z`} fill={ear} />
        )}
        {hold && <g transform={`translate(${d.snout + 2} 16)`}>{hold}</g>}
      </g>
    </g>
  );
};

/** 坐着的猫：原点在脚底中心；look 为眼珠左右偏移（-1..1） */
export const Cat: React.FC<{ x: number; y: number; s?: number; flip?: boolean; look?: number; o?: number; color?: string; walk?: boolean }> = ({ x, y, s = 1, flip, look = 0, o = 1, color = "#D98A3D", walk }) => {
  const f = useCurrentFrame();
  const blink = ((f + 48) % 96) < 4; // 错开相位，封面（第 0 帧）不会正好闭眼
  const tail = Math.sin(f * 0.12) * 14;
  const stripe = "#B8692A";
  const bob = walk ? Math.abs(Math.sin(f * 0.35)) * -6 : 0;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`} opacity={o}>
      <ellipse cx={0} cy={2} rx={70} ry={10} fill="rgba(40,28,10,0.16)" />
      <g transform={`rotate(${tail} 46 -20)`}>
        <path d="M 46 -20 q 46 -6 40 -60 q -2 -16 10 -22" stroke={color} strokeWidth={16} fill="none" strokeLinecap="round" />
      </g>
      <path d="M -52 0 Q -60 -96 0 -110 Q 60 -96 52 0 Z" fill={color} />
      {[-30, -8, 14].map((sx) => <path key={sx} d={`M ${sx} -96 q 6 14 0 28`} stroke={stripe} strokeWidth={6} fill="none" strokeLinecap="round" />)}
      <ellipse cx={-22} cy={-4} rx={18} ry={9} fill="#F3E3C8" />
      <ellipse cx={22} cy={-4} rx={18} ry={9} fill="#F3E3C8" />
      <g transform="translate(0 -140)">
        <path d="M -46 -10 L -40 -58 L -12 -34 Z" fill={color} /><path d="M 46 -10 L 40 -58 L 12 -34 Z" fill={color} />
        <path d="M -38 -18 L -36 -46 L -20 -32 Z" fill="#F0B8A0" /><path d="M 38 -18 L 36 -46 L 20 -32 Z" fill="#F0B8A0" />
        <ellipse cx={0} cy={0} rx={50} ry={42} fill={color} />
        <path d="M -16 -40 q 4 12 0 20 M 0 -42 q 4 12 0 22 M 16 -40 q 4 12 0 20" stroke={stripe} strokeWidth={5} fill="none" strokeLinecap="round" />
        <ellipse cx={0} cy={14} rx={24} ry={16} fill="#F3E3C8" />
        {blink ? (
          <g stroke={C.ink} strokeWidth={4} strokeLinecap="round"><line x1={-26} y1={-4} x2={-12} y2={-4} /><line x1={12} y1={-4} x2={26} y2={-4} /></g>
        ) : (
          <g>
            <ellipse cx={-19} cy={-4} rx={9} ry={11} fill="#F6E7A8" /><ellipse cx={19} cy={-4} rx={9} ry={11} fill="#F6E7A8" />
            <ellipse cx={-19 + look * 3} cy={-3} rx={4} ry={8} fill={C.ink} /><ellipse cx={19 + look * 3} cy={-3} rx={4} ry={8} fill={C.ink} />
          </g>
        )}
        <path d="M -5 8 L 5 8 L 0 14 Z" fill="#D9776A" />
        <path d="M 0 14 q -6 8 -12 4 M 0 14 q 6 8 12 4" stroke={C.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <g stroke={C.ink2} strokeWidth={1.8} opacity={0.7}>
          <line x1={-26} y1={12} x2={-56} y2={8} /><line x1={-26} y1={18} x2={-56} y2={22} /><line x1={26} y1={12} x2={56} y2={8} /><line x1={26} y1={18} x2={56} y2={22} />
        </g>
      </g>
    </g>
  );
};

/** 手机推送式的订单卡 */
export const OrderCard: React.FC<{ x: number; y: number; w?: number; title: string; sub: string; price: string; o?: number; s?: number; gray?: boolean }> = ({ x, y, w = 560, title, sub, price, o = 1, s = 1, gray }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-w / 2} y={-62} width={w} height={124} rx={26} fill="#FBF7EF" stroke={gray ? C.mute : C.ink} strokeWidth={3} />
    <rect x={-w / 2 + 22} y={-36} width={72} height={72} rx={18} fill={gray ? C.mute : C.red} />
    <path d={`M ${-w / 2 + 40} 10 q 18 -30 36 0`} stroke="#FBF7EF" strokeWidth={6} fill="none" strokeLinecap="round" />
    <circle cx={-w / 2 + 50} cy={-12} r={5} fill="#FBF7EF" /><circle cx={-w / 2 + 66} cy={-12} r={5} fill="#FBF7EF" />
    <text x={-w / 2 + 116} y={-8} fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={34} fill={gray ? C.mute : C.ink}>{title}</text>
    <text x={-w / 2 + 116} y={34} fontFamily="SansL, SansC, sans-serif" fontWeight={500} fontSize={24} fill={C.mute}>{sub}</text>
    <text x={w / 2 - 26} y={12} textAnchor="end" fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={40} fill={gray ? C.mute : C.red}>{price}</text>
  </g>
);

/** 木货箱：原点在底部中心 */
export const Crate: React.FC<{ s?: number; label?: string; color?: string }> = ({ s = 1, label, color = C.wood2 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-40} y={-64} width={80} height={64} rx={4} fill={color} stroke={C.ink} strokeWidth={3} />
    <line x1={-40} y1={-32} x2={40} y2={-32} stroke={C.ink} strokeWidth={2} opacity={0.5} />
    <line x1={-36} y1={-60} x2={36} y2={-4} stroke={C.ink} strokeWidth={2} opacity={0.35} />
    {label && <text x={0} y={-24} textAnchor="middle" fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={24} fill={C.ink}>{label}</text>}
  </g>
);

/** 一匹马（侧面，朝右）：原点在脚底中心 */
export const Horse: React.FC<{ x: number; y: number; s?: number; phase?: number }> = ({ x, y, s = 1, phase = 0 }) => {
  const f = useCurrentFrame();
  const g = Math.sin(f * 0.3 + phase) * 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-26, -12, 18, 30].map((lx, i) => (
        <line key={i} x1={lx} y1={-40} x2={lx + (i % 2 ? g : -g) * 0.6} y2={0} stroke="#5A3D28" strokeWidth={8} strokeLinecap="round" />
      ))}
      <ellipse cx={0} cy={-52} rx={44} ry={20} fill="#7A5236" />
      <path d="M 34 -60 L 56 -96 L 74 -90 L 60 -58 Z" fill="#7A5236" />
      <path d="M 40 -66 L 52 -94" stroke="#3A2A20" strokeWidth={6} strokeLinecap="round" />
      <path d="M -42 -56 q -16 6 -14 28" stroke="#3A2A20" strokeWidth={7} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** 帆船：原点在吃水线中心，load 为甲板上货箱的层数 */
export const Ship: React.FC<{ x: number; y: number; s?: number; rock?: number; children?: React.ReactNode }> = ({ x, y, s = 1, rock = 0, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rock})`}>
    <path d="M -150 -40 L 150 -40 L 116 20 L -120 20 Z" fill={C.wood} stroke={C.ink} strokeWidth={3} />
    <line x1={-140} y1={-24} x2={140} y2={-24} stroke={C.ink} strokeWidth={2} opacity={0.4} />
    <rect x={-4} y={-250} width={8} height={212} fill={C.ink2} />
    <path d="M 6 -240 Q 96 -170 6 -70 Z" fill="#FBF7EF" stroke={C.ink} strokeWidth={3} />
    <path d="M -6 -230 Q -80 -160 -6 -80 Z" fill="#FBF7EF" stroke={C.ink} strokeWidth={3} />
    <path d="M 4 -250 l 30 8 l -30 8 z" fill={C.red} />
    {children}
  </g>
);

/** 小房子：原点在底部中心；lit 为窗户亮度 */
export const House: React.FC<{ x: number; y: number; s?: number; lit?: number; o?: number }> = ({ x, y, s = 1, lit = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-70} y={-110} width={140} height={110} fill="#D9C9A8" stroke={C.ink} strokeWidth={3} />
    <path d="M -86 -106 L 0 -176 L 86 -106 Z" fill={C.wood} stroke={C.ink} strokeWidth={3} />
    <rect x={-46} y={-82} width={36} height={34} fill={lit > 0 ? "#F6D27A" : "#6C7380"} stroke={C.ink} strokeWidth={2.5} />
    <rect x={14} y={-70} width={34} height={70} fill={C.wood2} stroke={C.ink} strokeWidth={2.5} />
    {lit > 0 && <circle cx={-28} cy={-65} r={60} fill="#F6D27A" opacity={0.18 * lit} />}
  </g>
);

/** 手工皂 */
export const Soap: React.FC<{ s?: number; color?: string }> = ({ s = 1, color = "#E7B7A8" }) => (
  <g transform={`scale(${s})`}>
    <rect x={-26} y={-30} width={52} height={30} rx={8} fill={color} stroke={C.ink} strokeWidth={2.5} />
    <path d="M -14 -16 q 14 -10 28 0" stroke="#FBF7EF" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** 牛（侧面朝右）：原点在脚底中心；scared 时眼睛瞪圆 */
export const Ox: React.FC<{ x: number; y: number; s?: number; flip?: boolean; scared?: boolean; o?: number }> = ({ x, y, s = 1, flip, scared, o = 1 }) => {
  const f = useCurrentFrame();
  const tail = Math.sin(f * 0.15) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={o}>
      <ellipse cx={0} cy={3} rx={86} ry={10} fill="rgba(40,28,10,0.16)" />
      {[-56, -34, 34, 56].map((lx, i) => <rect key={i} x={lx - 8} y={-50} width={16} height={50} rx={6} fill="#5A3D28" />)}
      <g transform={`rotate(${tail} -76 -96)`}><path d="M -76 -96 q -26 10 -22 52" stroke="#7A5236" strokeWidth={6} fill="none" strokeLinecap="round" /><circle cx={-98} cy={-44} r={7} fill="#3A2A20" /></g>
      <rect x={-82} y={-118} width={150} height={76} rx={36} fill="#9A6B45" />
      <ellipse cx={-30} cy={-96} rx={26} ry={18} fill="#F1EADB" opacity={0.85} />
      <g transform="translate(76 -110)">
        <rect x={-18} y={-26} width={48} height={52} rx={18} fill="#9A6B45" />
        <rect x={6} y={2} width={30} height={22} rx={10} fill="#E8B49A" />
        <circle cx={16} cy={12} r={2.5} fill={C.ink} /><circle cx={28} cy={12} r={2.5} fill={C.ink} />
        <circle cx={10} cy={-10} r={scared ? 7 : 4.5} fill={scared ? "#FBF7EF" : C.ink} />
        {scared && <circle cx={10} cy={-10} r={3.5} fill={C.ink} />}
        <path d="M -12 -24 q -14 -18 -4 -30 M 18 -26 q 8 -20 22 -24" stroke="#EDE3CF" strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

export const SaltPile: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -46 0 Q -30 -54 0 -60 Q 30 -54 46 0 Z" fill="#FBF7EF" stroke={C.ink} strokeWidth={2.5} />
    {[-18, 0, 16, -6, 10].map((x, i) => <circle key={i} cx={x} cy={-14 - (i % 3) * 12} r={2} fill={C.mute} />)}
  </g>
);

export const Cowrie: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={-26} rx={34} ry={24} fill="#F3E1C2" stroke={C.ink} strokeWidth={2.5} />
    <path d="M -22 -26 Q 0 -18 22 -26" stroke={C.ink} strokeWidth={3} fill="none" />
    {[-14, -6, 2, 10].map((x) => <line key={x} x1={x} y1={-24} x2={x + 2} y2={-18} stroke={C.ink} strokeWidth={2} />)}
  </g>
);

export const DriedFish: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -54 -24 Q -10 -50 34 -26 L 56 -42 L 52 -24 L 56 -6 L 34 -22 Q -10 2 -54 -24 Z" fill="#C9B48E" stroke={C.ink} strokeWidth={2.5} />
    <circle cx={-38} cy={-28} r={3} fill={C.ink} />
    {[-16, -2, 12].map((x) => <path key={x} d={`M ${x} -38 q 4 12 0 24`} stroke={C.ink2} strokeWidth={2} fill="none" />)}
  </g>
);

export const Tobacco: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M 0 0 Q -42 -40 0 -90 Q 42 -40 0 0 Z" fill="#8A6A2E" stroke={C.ink} strokeWidth={2.5} />
    <path d="M 0 -4 L 0 -84" stroke="#5A4520" strokeWidth={3} />
    {[-60, -42, -24].map((y) => <path key={y} d={`M 0 ${y} l -16 -10 M 0 ${y} l 16 -10`} stroke="#5A4520" strokeWidth={2} />)}
  </g>
);

export const NailBundle: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[-18, -9, 0, 9, 18].map((x, i) => (
      <g key={x} transform={`translate(${x} 0) rotate(${(i - 2) * 6})`}>
        <line x1={0} y1={0} x2={0} y2={-64} stroke={C.steel} strokeWidth={5} strokeLinecap="round" />
        <rect x={-7} y={-68} width={14} height={5} rx={2} fill={C.ink2} />
      </g>
    ))}
    <rect x={-26} y={-36} width={52} height={10} rx={3} fill={C.red} />
  </g>
);

/** 金属条：metal 决定颜色 */
export const Bar: React.FC<{ s?: number; metal?: "iron" | "copper" | "gold" | "silver" }> = ({ s = 1, metal = "silver" }) => {
  const col = { iron: "#6C7380", copper: "#C07045", gold: "#E2B54A", silver: "#C9CDD3" }[metal];
  return (
    <g transform={`scale(${s})`}>
      <path d="M -60 0 L -46 -34 L 46 -34 L 60 0 Z" fill={col} stroke={C.ink} strokeWidth={3} />
      <path d="M -40 -26 L 30 -26" stroke="#FBF7EF" strokeWidth={4} opacity={0.6} strokeLinecap="round" />
    </g>
  );
};

/** 钱币：fill 为含金属量（0..1），面值文字保持不变——用来表现“偷偷减重” */
export const BigCoin: React.FC<{ s?: number; fill?: number; face?: string; spin?: number }> = ({ s = 1, fill = 1, face = "", spin = 1 }) => (
  <g transform={`scale(${s * spin} ${s})`}>
    <circle r={100} fill="#F3E1C2" stroke={C.ink} strokeWidth={5} />
    <circle r={100 * Math.sqrt(Math.max(0, fill))} fill="#E2B54A" />
    <circle r={84} fill="none" stroke="#B8902E" strokeWidth={4} />
    {face && <text x={0} y={22} textAnchor="middle" fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={64} fill={C.ink}>{face}</text>}
  </g>
);

export const Diamond: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -40 -50 L 40 -50 L 56 -30 L 0 20 L -56 -30 Z" fill="#CFE6EE" stroke={C.ink} strokeWidth={3} />
    <path d="M -56 -30 L 56 -30 M -20 -50 L -12 -30 L 0 20 L 12 -30 L 20 -50" stroke={C.ink} strokeWidth={2} fill="none" />
    <path d="M 46 -64 l 6 -10 l 6 10 l -6 10 z" fill="#F6D27A" />
  </g>
);

export const WaterGlass: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -30 -80 L 30 -80 L 24 0 L -24 0 Z" fill="#FBF7EF" stroke={C.ink} strokeWidth={3} />
    <path d="M -27 -50 L 27 -50 L 24 -2 L -24 -2 Z" fill="#9CC8D8" />
    <path d="M -27 -50 q 13 -6 27 0 t 27 0" stroke="#FBF7EF" strokeWidth={2} fill="none" />
  </g>
);

/** 手机：children 画在屏幕里（屏幕原点在中心） */
export const Phone: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-290} width={300} height={580} rx={44} fill={C.ink} />
    <rect x={-134} y={-274} width={268} height={548} rx={32} fill="#FBF7EF" />
    <rect x={-40} y={-262} width={80} height={16} rx={8} fill={C.ink} />
    {children}
  </g>
);

export const Headphones: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -46 -10 Q -46 -80 0 -80 Q 46 -80 46 -10" stroke={C.ink} strokeWidth={10} fill="none" />
    <rect x={-60} y={-24} width={30} height={46} rx={10} fill={C.red} stroke={C.ink} strokeWidth={3} />
    <rect x={30} y={-24} width={30} height={46} rx={10} fill={C.red} stroke={C.ink} strokeWidth={3} />
  </g>
);

export const OldBook: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-40} y={-56} width={80} height={56} rx={4} fill={C.navy} stroke={C.ink} strokeWidth={3} />
    <rect x={-32} y={-50} width={64} height={8} fill={C.ochre} />
    <line x1={-28} y1={-20} x2={28} y2={-20} stroke="#FBF7EF" strokeWidth={2} opacity={0.5} />
  </g>
);

/** 工资条卡片：原点在中心；amount 为显示的数字，up 显示涨幅箭头 */
export const Payslip: React.FC<{ x: number; y: number; s?: number; year: string; amount: string; up?: boolean; stamp?: string; o?: number }> = ({ x, y, s = 1, year, amount, up, stamp, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-260} y={-170} width={520} height={340} rx={24} fill="#FBF7EF" stroke={C.ink} strokeWidth={4} />
    <rect x={-260} y={-170} width={520} height={70} rx={24} fill={C.ink} />
    <rect x={-260} y={-120} width={520} height={20} fill={C.ink} />
    <text x={-224} y={-122} fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={34} fill={C.paper}>工资条</text>
    <text x={224} y={-122} textAnchor="end" fontFamily="SerifL, SerifC, serif" fontWeight={600} fontSize={30} fill={C.paper}>{year}</text>
    {[-50, -14].map((yy) => <rect key={yy} x={-224} y={yy} width={200} height={12} rx={6} fill={C.ink} opacity={0.12} />)}
    <text x={-224} y={100} fontFamily="SerifL, SerifC, serif" fontWeight={600} fontSize={28} fill={C.mute}>实发</text>
    <text x={224} y={110} textAnchor="end" fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={88} fill={C.ink}>{amount}</text>
    {up && <path d="M 236 30 L 236 -40 M 214 -16 L 236 -40 L 258 -16" stroke={C.red} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    {stamp && (
      <g transform="translate(-60 -20) rotate(-10)">
        <rect x={-150} y={-46} width={300} height={92} rx={8} fill="none" stroke={C.red} strokeWidth={6} />
        <text x={0} y={18} textAnchor="middle" fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={56} fill={C.red}>{stamp}</text>
      </g>
    )}
  </g>
);

export const Hourglass: React.FC<{ s?: number; t?: number }> = ({ s = 1, t = 0.5 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-26} y={-76} width={52} height={8} rx={3} fill={C.wood} />
    <rect x={-26} y={-8} width={52} height={8} rx={3} fill={C.wood} />
    <path d="M -20 -68 L 20 -68 L 3 -38 L 20 -8 L -20 -8 L -3 -38 Z" fill="#FBF7EF" stroke={C.ink} strokeWidth={2.5} />
    <path d={`M ${-16 * (1 - t)} -64 L ${16 * (1 - t)} -64 L 2 -40 L -2 -40 Z`} fill={C.ochre} />
    <path d={`M -18 -10 L 18 -10 L ${12 * t} ${-10 - 20 * t} L ${-12 * t} ${-10 - 20 * t} Z`} fill={C.ochre} />
  </g>
);

export const CornSack: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -40 0 Q -50 -50 -26 -76 L 26 -76 Q 50 -50 40 0 Z" fill="#D9C08A" stroke={C.ink} strokeWidth={3} />
    <path d="M -26 -76 Q 0 -90 26 -76" stroke={C.ink} strokeWidth={3} fill="none" />
    {[-14, 0, 14].map((x) => <path key={x} d={`M ${x} -84 q 4 -16 0 -30`} stroke="#B8902E" strokeWidth={4} fill="none" strokeLinecap="round" />)}
    <text x={0} y={-24} textAnchor="middle" fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={26} fill={C.ink}>谷</text>
  </g>
);

/** 尺子：stretch 让刻度忽长忽短（会变的尺子），label 写在尺身上 */
export const Ruler: React.FC<{ x: number; y: number; w?: number; stretch?: number; label?: string; color?: string; o?: number }> = ({ x, y, w = 760, stretch = 1, label, color = "#E8D7A8", o = 1 }) => {
  const ticks = 20;
  const ww = w * stretch;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect x={-ww / 2} y={-34} width={ww} height={68} rx={8} fill={color} stroke={C.ink} strokeWidth={3} />
      {Array.from({ length: ticks + 1 }).map((_, i) => (
        <line key={i} x1={-ww / 2 + (ww / ticks) * i} y1={-34} x2={-ww / 2 + (ww / ticks) * i} y2={i % 5 === 0 ? 4 : -14} stroke={C.ink} strokeWidth={i % 5 === 0 ? 3 : 2} />
      ))}
      {label && <text x={0} y={26} textAnchor="middle" fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={26} fill={C.ink}>{label}</text>}
    </g>
  );
};

export const Bone: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-22} y={-5} width={44} height={10} rx={5} fill="#F3ECDD" stroke={C.ink2} strokeWidth={2} />
    {[-22, 22].map((cx) => [-6, 6].map((cy) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={7} fill="#F3ECDD" stroke={C.ink2} strokeWidth={2} />))}
    <rect x={-20} y={-4} width={40} height={8} fill="#F3ECDD" />
  </g>
);

export const Meat: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -30 0 q -6 -26 18 -32 q 30 -6 38 14 q 8 20 -14 24 q -24 4 -42 -6 z" fill="#C4432E" stroke={C.ink} strokeWidth={2.5} />
    <path d="M -14 -12 q 10 -10 24 -4" stroke="#F3D5C8" strokeWidth={5} fill="none" strokeLinecap="round" />
    <rect x={26} y={-14} width={18} height={8} rx={4} fill="#F3ECDD" stroke={C.ink} strokeWidth={2} />
  </g>
);

export const Bread: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -34 0 q -4 -30 34 -30 q 38 0 34 30 z" fill="#D9A25B" stroke={C.ink} strokeWidth={2.5} />
    {[-14, 0, 14].map((x) => <path key={x} d={`M ${x - 6} -20 l 10 -6`} stroke="#F3D9A8" strokeWidth={4} strokeLinecap="round" />)}
  </g>
);

export const Mug: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-16} y={-40} width={32} height={40} rx={4} fill="#E8B04A" stroke={C.ink} strokeWidth={2.5} />
    <path d="M -18 -40 q 0 -12 18 -10 q 18 -2 18 10 z" fill="#FBF7EF" stroke={C.ink} strokeWidth={2.5} />
    <path d="M 16 -32 q 14 0 14 12 q 0 12 -14 12" stroke={C.ink} strokeWidth={4} fill="none" />
  </g>
);

export const Barrel: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -26 0 q -8 -32 0 -64 h 52 q 8 32 0 64 z" fill={C.wood2} stroke={C.ink} strokeWidth={2.5} />
    {[-14, -50].map((y) => <line key={y} x1={-30} y1={y} x2={30} y2={y} stroke={C.ink} strokeWidth={4} />)}
  </g>
);

export const Bow: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M 0 -60 q 34 30 0 60" stroke={C.wood} strokeWidth={6} fill="none" strokeLinecap="round" />
    <line x1={0} y1={-60} x2={0} y2={0} stroke={C.ink2} strokeWidth={1.5} />
    <line x1={-10} y1={-30} x2={30} y2={-30} stroke={C.ink} strokeWidth={3} />
    <path d="M 30 -30 l -8 -5 l 0 10 z" fill={C.ink} />
  </g>
);

export const Coin: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r={16} fill="#E8C35A" stroke={C.ink} strokeWidth={2.5} />
    <circle r={10} fill="none" stroke="#B8902E" strokeWidth={2} />
  </g>
);

export const Bubble: React.FC<{ x: number; y: number; w: number; text: string; color?: string; tailLeft?: boolean; o?: number; size?: number }> = ({ x, y, w, text, color = C.ink, tailLeft = true, o = 1, size = 34 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={0} y={0} width={w} height={size * 1.9} rx={22} fill="#FBF7EF" stroke={color} strokeWidth={3} />
    <path d={tailLeft ? `M 30 ${size * 1.9 - 1} l -10 22 l 30 -22` : `M ${w - 50} ${size * 1.9 - 1} l 30 22 l -10 -22`} fill="#FBF7EF" stroke={color} strokeWidth={3} strokeLinejoin="round" />
    <rect x={tailLeft ? 22 : w - 52} y={size * 1.9 - 4} width={32} height={6} fill="#FBF7EF" />
    <text x={w / 2} y={size * 1.25} textAnchor="middle" fontFamily="SerifL, SerifC, serif" fontWeight={900} fontSize={size} fill={color}>{text}</text>
  </g>
);
