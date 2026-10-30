// EP21（第二篇第4章：贷出取息的资财）专用：三步的配色、煤堆、利率牌、结论章、公式卡。
// “一集一个问题”试做第二集：接着用上一集的双胞胎兄弟、存钱罐和阿禾的裁缝铺，不换比喻。
// 存钱罐、宴席桌、一屋子衣服、金币、借条、帆船、牛、矿井等从 `../ep20/world`（一路带上 EP19、EP18、EP17 和 v16/stage）拿。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR, fuzz } from "../cast/crayon";
import { wrect } from "../v16/town";
import { C, SERIF } from "../kit";

export * from "../ep20/world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

/** 颜色：第一步赭金、第二步墨青、第三步橄榄绿（第一篇那种压低饱和的配色） */
const GOLD21 = "#C3923F", TEAL21 = "#3F6E73", GREEN21 = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "钱买什么", col: GOLD21 },
  { n: "②", short: "利息怎么来", col: TEAL21 },
  { n: "③", short: "还款看什么", col: GREEN21 },
];

/** 一张借约（原点在中心）：一行一项（本金 / 期限 / 利息），n = 已经写上的行数，paid = “已还”红章 */
export const LoanNote: React.FC<{ s?: number; rot?: number; rows: string[]; n?: number; paid?: number }> = ({ s = 1, rot = 0, rows, n = rows.length, paid = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-150, -110, 300, 220, 231, 2)} fill="rgba(62,42,32,0.12)" transform="translate(8 9)" />
      <path d={wrect(-150, -110, 300, 220, 231, 2)} fill="#FFFBF0" stroke={L} strokeWidth={4} />
    </g>
    <text y={-72} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={C.ink2}>借约</text>
    {rows.map((r, i) => <text key={i} y={-22 + i * 50} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={i === rows.length - 1 ? C.red : C.ink} opacity={i < n ? 1 : 0}>{r}</text>)}
    {paid > 0 && (
      <g transform={`translate(100 -78) rotate(-14) scale(${paid})`}>
        <rect x={-58} y={-30} width={116} height={60} rx={8} fill="rgba(251,247,239,0.85)" stroke={C.red} strokeWidth={5} />
        <text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={C.red}>已还</text>
      </g>
    )}
  </g>
);

/** 一堆煤（原点在底部中心） */
export const CoalHeap: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={fuzz(0, -34, 80, 36, 14, 0.12, 4, 0)} fill="#3B3A3F" stroke={L} strokeWidth={4} />
    {[[-40, -50], [-6, -62], [30, -48], [10, -30], [-28, -24]].map(([x, y], i) => <path key={i} d={fuzz(x, y, 16, 12, 7, 0.25, i + 2, 0)} fill={i % 2 ? "#55535A" : "#2C2B30"} stroke={L} strokeWidth={2.5} />)}
  </g>
);

/**
 * 利率牌：“一百镑借一年，利息 £X”。value = 当前利息（数字，滚动用），hi = 起始值（画一条从高到低的线），
 * k = 弹出程度；原点在牌子中心
 */
export const RateBoard: React.FC<{ s?: number; value: number; k?: number; title?: string; down?: number; text?: string }> = ({ s = 1, value, k = 1, title = "一百镑借一年", down = 0, text }) => {
  if (k <= 0) return null;
  return (
    <g transform={`scale(${s * Math.min(1, k)})`}>
      <g filter="url(#crayon)">
        <path d={wrect(-170, -110, 340, 220, 211, 2)} fill="rgba(62,42,32,0.12)" transform="translate(8 9)" />
        <path d={wrect(-170, -110, 340, 220, 211, 2)} fill="#FFFBF0" stroke={L} strokeWidth={4} />
      </g>
      <text y={-58} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={C.ink2}>{title}</text>
      <text y={10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={C.ink}>利息</text>
      <text y={84} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={76} fill={C.red}>{text ?? `£${Math.round(value)}`}</text>
      {down > 0 && <path d={`M 142 -40 L 142 ${-40 + 90 * down}`} stroke={C.red} strokeWidth={8} strokeLinecap="round" />}
      {down > 0.9 && <path d="M 126 34 L 142 54 L 158 34" fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
};

/** 一个人头上方的出价牌（“£10 / 年”）；原点在牌子中心 */
export const Bid: React.FC<{ s?: number; amount: string; col?: string; k?: number; crossed?: number }> = ({ s = 1, amount, col = C.red, k = 1, crossed = 0 }) => {
  if (k <= 0) return null;
  return (
    <g transform={`scale(${s * Math.min(1, k)})`}>
      <path d={wrect(-90, -46, 180, 92, 221, 2)} fill="#FFFBF0" stroke={L} strokeWidth={4} filter="url(#crayon)" />
      <text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={col}>{amount}</text>
      <text y={40} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={20} fill={C.ink2}>一年利息</text>
      {crossed > 0 && <path d={`M -80 -36 L ${-80 + 160 * crossed} ${-36 + 72 * crossed}`} stroke={C.red} strokeWidth={7} strokeLinecap="round" />}
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

/** 结尾公式卡：标题条 + 3 行大字，最后 4 秒多只剩这张卡 */
export const Formula21: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const rows: [string, string][] = [
    ["借出去的：是钱能买的东西", GOLD21],
    ["利息：从利润里分出来", TEAL21],
    ["高息：先问拿什么还", GREEN21],
  ];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 34px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>利息的三句话</span></div>
      {rows.map(([a, c], i) => (
        <div key={i} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap" }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, background: c, color: C.paper, fontSize: 40, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
          <span style={{ fontSize: 52, color: C.ink }}>{a}</span>
        </div>
      ))}
    </div>
  );
};
