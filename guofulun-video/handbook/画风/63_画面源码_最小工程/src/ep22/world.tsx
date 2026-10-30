// EP22（第二篇第5章：资本的各种用途——只讲批发里的国内贸易、外贸、转运）专用：三步的配色、岔路路牌、运货马车、酒桶、结论章、公式卡。
// “一集一个问题”试做第三集：接着用上一集的弟弟和他的一百镑；国内线苏格兰布 ⇄ 英格兰粮，外贸线英国布 ⇄ 葡萄牙酒，转运线荷兰船运波兰粮去葡萄牙（都是书里的例子）。
// 金币、帆船、牛、麦子、借约等从 `../ep21/world`（一路带上 EP20、EP19、EP18、EP17 和 v16/stage）拿。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR } from "../cast/crayon";
import { wrect } from "../v16/town";
import { C, SERIF } from "../kit";

export * from "../ep21/world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

/** 颜色：第一步赭金、第二步墨青、第三步橄榄绿（第一篇那种压低饱和的配色） */
const GOLD22 = "#C3923F", TEAL22 = "#3F6E73", GREEN22 = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "一趟养几拨人", col: GOLD22 },
  { n: "②", short: "二十四倍哪来", col: TEAL22 },
  { n: "③", short: "外贸还做不做", col: GREEN22 },
];

/** 岔路路牌（原点在柱子着地处）：左牌“国内”、右牌“外国”；home / abroad = 两块牌子各自弹出的程度，glow = 国内那块发亮 */
export const SignPost: React.FC<{ s?: number; home?: number; abroad?: number; glow?: number; homeText?: string; abroadText?: string }> = ({ s = 1, home = 1, abroad = 1, glow = 0, homeText = "国内", abroadText = "外国" }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d="M -10 0 L -8 -360 L 10 -360 L 12 0 Z" fill={CR.wood2} stroke={L} strokeWidth={5} />
    </g>
    {glow > 0 && <ellipse cx={-120} cy={-290} rx={150} ry={70} fill={CR.goldHi} opacity={0.55 * glow} filter="url(#glow)" />}
    {home > 0 && (
      <g transform={`translate(0 -290) scale(${home})`} filter="url(#crayon)">
        <path d="M 0 -42 L -190 -42 L -236 0 L -190 42 L 0 42 Z" fill="#E9D3A6" stroke={L} strokeWidth={5} strokeLinejoin="round" />
        <text x={-110} y={16} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={C.ink}>{homeText}</text>
      </g>
    )}
    {abroad > 0 && (
      <g transform={`translate(0 -190) scale(${abroad})`} filter="url(#crayon)">
        <path d="M 0 -42 L 190 -42 L 236 0 L 190 42 L 0 42 Z" fill="#CFE0E2" stroke={L} strokeWidth={5} strokeLinejoin="round" />
        <text x={110} y={16} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={C.ink}>{abroadText}</text>
      </g>
    )}
  </g>
);

/** 运货马车（原点在车轮着地处中心）：cargo = 车上装的东西（SVG 节点），t = 帧号（轮子转） */
export const Cart: React.FC<{ s?: number; t?: number; cargo?: React.ReactNode; flip?: boolean }> = ({ s = 1, t = 0, cargo, flip }) => (
  <g transform={`scale(${flip ? -s : s} ${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-120, -120, 240, 56, 241, 2)} fill={CR.wood} stroke={L} strokeWidth={5} />
      <path d="M 120 -92 L 200 -70" stroke={CR.wood2} strokeWidth={10} strokeLinecap="round" />
    </g>
    {cargo && <g transform={`translate(0 -124) scale(${flip ? -1 : 1} 1)`}>{cargo}</g>}
    {[-70, 70].map((x) => (
      <g key={x} transform={`translate(${x} -40) rotate(${t * 4})`} filter="url(#crayon)">
        <circle r={40} fill="#C9A47A" stroke={L} strokeWidth={5} />
        {[0, 60, 120].map((a) => <path key={a} d="M -34 0 L 34 0" transform={`rotate(${a})`} stroke={L} strokeWidth={4} />)}
        <circle r={8} fill={CR.wood2} />
      </g>
    ))}
  </g>
);

/** 一只木桶（酒、烟草；原点在桶底中心），label = 桶上的字 */
export const Barrel: React.FC<{ s?: number; label?: string; col?: string; dim?: number }> = ({ s = 1, label, col = "#B5654A", dim = 0 }) => (
  <g transform={`scale(${s})`} opacity={1 - dim * 0.6}>
    <g filter="url(#crayon)">
      <path d="M -60 0 Q -78 -70 -60 -140 L 60 -140 Q 78 -70 60 0 Z" fill={col} stroke={L} strokeWidth={5} />
      {[-112, -28].map((y) => <path key={y} d={`M -70 ${y} Q 0 ${y + 10} 70 ${y}`} fill="none" stroke="#5A3A2A" strokeWidth={8} />)}
    </g>
    {label && <g transform="translate(0 -70)"><rect x={-46} y={-22} width={92} height={44} rx={8} fill="#FFFBF0" stroke={L} strokeWidth={3} /><text y={12} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={28} fill={C.ink}>{label}</text></g>}
  </g>
);

/** 一个地名点（SVG，原点在点上）：小圆点 + 下面的地名 */
export const Place: React.FC<{ x: number; y: number; name: string; col?: string; k?: number; dy?: number }> = ({ x, y, name, col = C.ink, k = 1, dy = 54 }) => {
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.min(1, k)})`}>
      <circle r={16} fill={col} stroke={L} strokeWidth={4} />
      <text y={dy} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={C.ink} stroke="#FBF7EF" strokeWidth={8} paintOrder="stroke">{name}</text>
    </g>
  );
};

// ---------------------------------------------------------------- 结论章 / 公式卡
/** 每一步的结论章（画面上的字，口播用普通的话说，不念“第 X 步的结论”） */
export const Verdict: React.FC<{ i: 0 | 1 | 2; text: string; at: number; y?: number; out?: number }> = ({ i, text, at, y = 338, out = 1e9 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at - 6, at + 4, out - 6, out + 4], [0, 1, 1, 0], CL);
  if (k <= 0) return null;
  const col = PARTS[i].col;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, fontFamily: SERIF, fontWeight: 900, opacity: k }}>
      <div style={{ fontSize: 36, color: C.ink, letterSpacing: "0.08em", WebkitTextStroke: `6px ${C.paper}`, paintOrder: "stroke fill" }}>第{["一", "二", "三"][i]}步的结论</div>
      <div style={{ background: col, color: C.paper, fontSize: 50, padding: "10px 30px", borderRadius: 8, border: `3px solid ${C.ink}`, whiteSpace: "nowrap", rotate: "-2deg", scale: String(interpolate(f, [at - 2, at + 8], [1.5, 1], CL)), boxShadow: `8px 8px 0 ${C.red}` }}>{text}</div>
    </div>
  );
};

/** 结尾公式卡：标题条 + 3 行大字（书里的说法 / 今天的说法开头） */
export const Formula22: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const rows: [string, string][] = [
    ["国内贸易：一趟补回两份本钱", GOLD22],
    ["资金周转：本钱收回来，再用出去", TEAL22],
    ["外贸：多出来的就得运出去", GREEN22],
  ];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 34px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>做批发的三句话</span></div>
      {rows.map(([a, c], i) => (
        <div key={i} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap" }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, background: c, color: C.paper, fontSize: 40, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
          <span style={{ fontSize: 50, color: C.ink }}>{a}</span>
        </div>
      ))}
    </div>
  );
};
