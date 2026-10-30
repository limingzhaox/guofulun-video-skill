// EP20（第二篇第3章：省钱和花钱）专用：三步的配色、存钱罐、宴席桌、一屋子衣服、结论章、公式卡。
// 10-28 按“一集一个问题”试做：全片只用一个案例（双胞胎兄弟 + 阿禾的裁缝作坊 + 一个存钱罐），不换比喻。
// 金币、钞票、银行、红章、横条等从 `../ep19/world`（它带上了 EP17、EP18 和 v16/stage 的通用部件）拿。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR } from "../cast/crayon";
import { wrect } from "../v16/town";
import { C, SERIF } from "../kit";
import { CoinStack, IcoBread, IcoShirt, IcoCloth } from "../ep17/world";

export * from "../ep19/world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

/** 颜色：第一步赭金、第二步墨青、第三步橄榄绿（第一篇那种压低饱和的配色） */
const GOLD20 = "#C3923F", TEAL20 = "#3F6E73", GREEN20 = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "省下的钱去哪", col: GOLD20 },
  { n: "②", short: "花掉的不也养人", col: TEAL20 },
  { n: "③", short: "人人都省会怎样", col: GREEN20 },
];

/**
 * 存钱罐（玻璃罐，原点在罐底中心）：level = 装了多少（0–1），lid = 盖子盖上（压在箱底、没人用），
 * dim = 压暗，label = 罐子上的标签（如“£50”）
 */
export const SaveJar: React.FC<{ s?: number; level?: number; lid?: number; dim?: number; label?: string }> = ({ s = 1, level = 0.6, lid = 0, dim = 0, label }) => {
  const h = 230 * Math.max(0, Math.min(1, level));
  return (
    <g transform={`scale(${s})`}>
      <g filter="url(#crayon)">
        <path d="M -95 0 Q -110 -130 -80 -250 L 80 -250 Q 110 -130 95 0 Z" fill="rgba(214,235,247,0.55)" stroke={L} strokeWidth={5} />
      </g>
      {h > 0 && (
        <g>
          <clipPath id="jarIn"><path d="M -90 -4 Q -104 -130 -76 -246 L 76 -246 Q 104 -130 90 -4 Z" /></clipPath>
          <g clipPath="url(#jarIn)">
            <rect x={-110} y={-h - 4} width={220} height={h + 4} fill={CR.gold} />
            {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-70 + (i % 5) * 35} cy={-12 - Math.floor(i / 5) * 30} r={15} fill={CR.goldHi} stroke="#B9862E" strokeWidth={3} opacity={-12 - Math.floor(i / 5) * 30 > -h ? 1 : 0} />)}
          </g>
        </g>
      )}
      <g filter="url(#crayon)">
        <path d={wrect(-90, -275, 180, 32, 261, 1.5)} fill={lid > 0.5 ? "#8A5A3A" : "#C9A47A"} stroke={L} strokeWidth={4} transform={`translate(0 ${(1 - lid) * -26}) rotate(${(1 - lid) * -12})`} />
      </g>
      {label && <g transform="translate(0 -120)"><rect x={-56} y={-26} width={112} height={52} rx={10} fill="#FFFBF0" stroke={L} strokeWidth={3} /><text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={C.ink}>{label}</text></g>}
      {dim > 0 && <path d="M -95 0 Q -110 -130 -80 -250 L 80 -250 Q 110 -130 95 0 Z" fill={C.ink} opacity={dim} />}
    </g>
  );
};

/** 宴席桌（原点在桌腿着地处中心）：food = 桌上还剩多少（0–1），t = 帧号 */
export const FeastTable: React.FC<{ s?: number; food?: number; t?: number }> = ({ s = 1, food = 1, t = 0 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-220, -150, 440, 34, 271, 1.5)} fill={CR.wood} stroke={L} strokeWidth={5} />
      <path d="M -190 -116 L -190 0 M 190 -116 L 190 0" stroke={CR.wood2} strokeWidth={16} strokeLinecap="round" />
      {[-140, -45, 50, 145].map((x, i) => <ellipse key={i} cx={x} cy={-158} rx={42} ry={12} fill="#FFFBF0" stroke={L} strokeWidth={3} />)}
    </g>
    {[-140, -45, 50, 145].map((x, i) => {
      const k = Math.max(0, Math.min(1, food * 4 - i));
      if (k <= 0) return null;
      return <g key={`f${i}`} transform={`translate(${x} ${-170}) scale(${0.75 * k})`}>{[<IcoBread key="b" />, <IcoBread key="c" s={0.9} />, <IcoBread key="d" />, <IcoBread key="e" s={0.9} />][i]}</g>;
    })}
    {food > 0.2 && [0, 1].map((i) => <path key={`st${i}`} d={`M ${-80 + i * 150} -200 q 10 -20 0 -40 q -10 -20 0 -40`} fill="none" stroke="#D9D3CC" strokeWidth={5} opacity={0.5 + 0.3 * Math.sin(t * 0.2 + i)} />)}
  </g>
);

/** 一屋子衣服（衣架上一件件挂起来；原点在架子底部中心）：n = 挂了几件 */
export const ClothesRack: React.FC<{ s?: number; n?: number }> = ({ s = 1, n = 6 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d="M -220 0 L -220 -260 M 220 0 L 220 -260 M -230 -260 L 230 -260" stroke={CR.wood2} strokeWidth={12} strokeLinecap="round" />
    </g>
    {Array.from({ length: Math.max(0, Math.min(8, Math.floor(n))) }).map((_, i) => (
      <g key={i} transform={`translate(${-180 + i * 52} -150)`}>
        <path d="M 0 -110 L 0 -96" stroke={L} strokeWidth={3} />
        <g transform="scale(0.85)">{i % 3 === 2 ? <IcoCloth s={1} /> : <IcoShirt s={1} col={["#E8604C", "#6FA8D6", "#E8604C", "#9CC778", "#6FA8D6", "#E8604C", "#9CC778", "#6FA8D6"][i]} />}</g>
      </g>
    ))}
  </g>
);

/** 一摞金币 + 金额签（原点在底部中心） */
export const MoneyPile: React.FC<{ s?: number; n?: number; label: string; dim?: number }> = ({ s = 1, n = 5, label, dim = 0 }) => (
  <g transform={`scale(${s})`} opacity={1 - dim * 0.6}>
    <CoinStack n={n} s={1.2} />
    <g transform={`translate(0 ${-30 - n * 17})`}><rect x={-62} y={-26} width={124} height={52} rx={10} fill="#FFFBF0" stroke={L} strokeWidth={3} /><text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={C.ink}>{label}</text></g>
  </g>
);

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

/** 结尾公式卡：标题条 + 3 行大字（书里的说法 / 今天的说法开头），最后 4 秒多只剩这张卡 */
export const Formula20: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const rows: [string, string][] = [
    ["节俭：存下的钱换一群人花", GOLD20],
    ["生产性劳动：干完留下东西", TEAL20],
    ["节俭悖论：人人少花，收入跟着降", GREEN20],
  ];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 34px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>省钱和花钱的三句话</span></div>
      {rows.map(([a, c], i) => (
        <div key={i} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap" }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, background: c, color: C.paper, fontSize: 40, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
          <span style={{ fontSize: 52, color: C.ink }}>{a}</span>
        </div>
      ))}
    </div>
  );
};
