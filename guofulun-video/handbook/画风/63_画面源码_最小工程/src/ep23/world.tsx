// EP23（第三篇第1章：财富的自然进步）专用：三步的配色、一个慢慢长大的镇子、一片田、日子格子、结论章、公式卡。
// 10-29 新规矩第一集：开头从“城里人和乡下人，谁养活谁”这句拌嘴开口；3 分钟试验；同一个镇子从头长到尾（农夫 + 阿禾 + 一个个搬来的手艺人）。
// 帆船、马车、粮袋、麦子、金币等从 `../ep22/world`（一路带上 EP21–EP17 和 v16/stage）拿。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR } from "../cast/crayon";
import { C, SERIF } from "../kit";
import { IcoField, IcoHouse, IcoShop, Wheat } from "../ep22/world";
import { Keyword as Keyword0, TOPS } from "../v16/stage";

export * from "../ep22/world";
export { TOPS };

/** 顶部关键词：10-31 用户要页眉和三格往上靠，EP23 重出时跟着放到 TOPS.keyword（EP24 从这里拿） */
export const Keyword: typeof Keyword0 = (p) => <Keyword0 y={TOPS.keyword} {...p} />;

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

/** 颜色：第一步赭金、第二步墨青、第三步橄榄绿 */
const GOLD23 = "#C3923F", TEAL23 = "#3F6E73", GREEN23 = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "城里拿什么换", col: GOLD23 },
  { n: "②", short: "先有乡下才有城", col: TEAL23 },
  { n: "③", short: "地便宜钱去哪", col: GREEN23 },
];

/**
 * 一个慢慢长大的镇子（原点在街面中心）：n = 有几栋房子（0–6，可以是小数，正在冒出来的那栋按小数缩放），
 * dim = 压暗（长不大的镇子），s = 整体缩放。房子从中间往两边一栋栋加：铺子、住家交替。
 */
export const Town: React.FC<{ n: number; s?: number; dim?: number }> = ({ n, s = 1, dim = 0 }) => {
  const slots = [0, -1, 1, -2, 2, -3];
  return (
    <g transform={`scale(${s})`} opacity={1 - dim * 0.5}>
      <path d="M -460 6 L 460 6" stroke={L} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
      {slots.map((x, i) => {
        const k = Math.max(0, Math.min(1, n - i));
        if (k <= 0) return null;
        return (
          <g key={i} transform={`translate(${x * 140} 0) scale(${k * 1.25})`}>
            {i % 2 === 0 ? <IcoShop /> : <IcoHouse />}
          </g>
        );
      })}
    </g>
  );
};

/** 一片田（原点在田埂中心）：lush = 庄稼长得多好（0–1），w = 宽度 */
export const Farm: React.FC<{ w?: number; lush?: number; t?: number }> = ({ w = 420, lush = 0.6, t = 0 }) => (
  <g>
    <g transform="translate(0 -6) scale(1.3)"><IcoField /></g>
    <g transform={`translate(${-w / 2} -10)`}><Wheat w={w} h={40 + 90 * lush} t={t} /></g>
  </g>
);

/** 日子格子：n 个小日历块排一行（第 i 块在 at + i*gap 帧弹出），label = 下面的字 */
export const Days: React.FC<{ f: number; n: number; at: number; gap?: number; col?: string; label?: string; w?: number }> = ({ f, n, at, gap = 3, col = C.red, label, w = 62 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const k = interpolate(f, [at + i * gap - 4, at + i * gap + 2], [0, 1], CL);
      if (k <= 0) return null;
      return (
        <g key={i} transform={`translate(${i * (w + 10)} 0) scale(${k})`}>
          <rect x={-w / 2} y={-36} width={w} height={72} rx={8} fill="#FFFBF0" stroke={L} strokeWidth={3} />
          <rect x={-w / 2} y={-36} width={w} height={16} rx={6} fill={col} />
          <text y={26} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={26} fill={C.ink}>{i + 1}</text>
        </g>
      );
    })}
    {label && f >= at && <text x={((n - 1) * (w + 10)) / 2} y={96} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={col}>{label}</text>}
  </g>
);

// ---------------------------------------------------------------- 结论章 / 公式卡
/** 每一步的结论章（画面上的字，口播用普通的话说，不念“第 X 步的结论”） */
export const Verdict: React.FC<{ i: 0 | 1 | 2; text: string; at: number; y?: number; out?: number }> = ({ i, text, at, y = TOPS.verdict, out = 1e9 }) => {
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

/** 结尾公式卡：标题条 + 3 行大字（以书里的说法开头），旁白念完只停 2–3 秒 */
export const Formula23: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const rows: [string, string][] = [
    ["城乡大买卖：互相是对方的仆人", GOLD23],
    ["先有余粮：才养得起手艺人", TEAL23],
    ["自然进步：先种地，再开厂，后外贸", GREEN23],
  ];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 34px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>城里乡下的三句话</span></div>
      {rows.map(([a, c], i) => (
        <div key={i} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap" }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, background: c, color: C.paper, fontSize: 40, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
          <span style={{ fontSize: 48, color: C.ink }}>{a}</span>
        </div>
      ))}
    </div>
  );
};
