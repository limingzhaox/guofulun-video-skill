// EP17（第二篇第2章上：钱是轮子）专用：三件事的配色和顶部进度、金币、钞票、保险柜、银行、手机、轮子车、结论章、公式卡。
// 通用部件从 `src/v16/stage.tsx` 拿（v16 风格定稿：第一篇纸色、虚化小镇、白卡片、固定位置关键词）。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR, HAND } from "../cast/crayon";
import { wrect } from "../v16/town";
import { IcoBread, IcoCloth, IcoShirt, Screen } from "../v16/stage";
import { C, SANS, SERIF } from "../kit";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

export * from "../v16/stage";

/** 前排脚底（画面坐标） */
export const FOOT = 1262;

/** 颜色编码：第一件（钱 / 金币）金、第二件（钞票）青、第三件（省下的）绿——10-26 和第一篇融合，改成第一篇那种压低饱和的赭金、墨青、橄榄绿 */
export const GOLD = "#C3923F";
export const TEAL = "#3F6E73";
export const GREEN = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "钱不是财富", col: GOLD },
  { n: "②", short: "纸能当钱", col: TEAL },
  { n: "③", short: "省下的去哪了", col: GREEN }, // 10-27 用户：“省下去哪了”读起来像“省（下去）哪了”，补一个“的”
];

// ---------------------------------------------------------------- 钱：金币、一摞金币、钞票
/** 一枚金币（书里的几尼：圆金币，正面压一个 £） */
export const Guinea: React.FC<{ s?: number; flip?: number }> = ({ s = 1, flip = 1 }) => (
  <g transform={`scale(${s * flip} ${s})`} filter="url(#crayon)">
    <circle r={40} fill={CR.gold} stroke={L} strokeWidth={4} />
    <circle r={30} fill="none" stroke="#B9862E" strokeWidth={3} />
    <text y={13} textAnchor="middle" fontFamily={HAND} fontSize={36} fill="#9A6A22">£</text>
  </g>
);
/** 一摞金币（原点在底部中心） */
export const CoinStack: React.FC<{ s?: number; n?: number }> = ({ s = 1, n = 4 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    {Array.from({ length: n }).map((_, i) => (
      <g key={i} transform={`translate(0 ${-10 - i * 14})`}>
        <ellipse rx={34} ry={11} fill={i === n - 1 ? CR.goldHi : CR.gold} stroke={L} strokeWidth={3} />
      </g>
    ))}
  </g>
);
/** 一张钞票（米白纸、青绿边、£ 和一个小印） */
export const Note: React.FC<{ s?: number; rot?: number; dim?: number }> = ({ s = 1, rot = 0, dim = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-80, -44, 160, 88, 51, 1.5)} fill="#FBF4E2" stroke={L} strokeWidth={3.5} />
    <rect x={-70} y={-34} width={140} height={68} rx={6} fill="none" stroke={TEAL} strokeWidth={4} />
    <text x={-46} y={14} textAnchor="middle" fontFamily={HAND} fontSize={40} fill={TEAL}>£</text>
    {[0, 1].map((i) => <path key={i} d={`M -18 ${-8 + i * 16} Q 4 ${-16 + i * 16} 22 ${-8 + i * 16}`} stroke="#B9AE96" strokeWidth={3} fill="none" />)}
    <circle cx={46} cy={0} r={15} fill="none" stroke={CR.coral} strokeWidth={3} />
    {dim > 0 && <rect x={-82} y={-46} width={164} height={92} fill="#2B3550" opacity={dim} />}
  </g>
);

// ---------------------------------------------------------------- 银行
/** 保险柜（门开着，里面一摞一摞金币；原点在底部中心） */
export const Vault: React.FC<{ s?: number; stacks?: number; k?: number }> = ({ s = 1, stacks = 2, k = 1 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-130, -230, 260, 230, 61, 2)} fill="#7E8794" stroke={L} strokeWidth={5} />
      <path d={wrect(-108, -208, 216, 186, 62, 1.5)} fill="#3B3F4A" stroke={L} strokeWidth={4} />
      <path d="M -108 -114 L 108 -114" stroke="#5A606C" strokeWidth={4} />
    </g>
    {Array.from({ length: stacks }).map((_, i) => {
      const x = -72 + (i % 4) * 48, y = i < 4 ? -118 : -28;
      return <g key={i} transform={`translate(${x} ${y}) scale(${interpolate(k, [i / Math.max(1, stacks), (i + 1) / Math.max(1, stacks)], [0, 0.62], CL)})`}><CoinStack n={4} /></g>;
    })}
    <g filter="url(#crayon)">
      <circle cx={150} cy={-140} r={16} fill="#9AA3AF" stroke={L} strokeWidth={4} />
    </g>
  </g>
);
/** 石头小银行（门脸、柱子、山墙；原点在底部中心） */
export const BankHouse: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-220, -300, 440, 300, 71, 2)} fill="#E9DFCB" stroke={L} strokeWidth={5} />
    <path d="M -250 -300 L 0 -420 L 250 -300 Z" fill="#D8CBB2" stroke={L} strokeWidth={5} strokeLinejoin="round" />
    {[-160, -80, 80, 160].map((x) => <path key={x} d={wrect(x - 16, -290, 32, 290, x + 300, 1.5)} fill="#F4EDDD" stroke={L} strokeWidth={4} />)}
    <path d={wrect(-46, -170, 92, 170, 72, 1.5)} fill="#8A5A3A" stroke={L} strokeWidth={4} />
    <circle cx={0} cy={-358} r={30} fill={CR.gold} stroke={L} strokeWidth={4} />
    <text x={0} y={-346} textAnchor="middle" fontFamily={HAND} fontSize={34} fill="#8A5A1E">£</text>
  </g>
);
/** 今天的手机（屏幕里放子元素；原点在中心） */
export const Phone: React.FC<{ s?: number; children?: React.ReactNode }> = ({ s = 1, children }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-80, -150, 160, 300, 81, 1.5)} fill="#3A3F4B" stroke={L} strokeWidth={5} />
      <rect x={-66} y={-128} width={132} height={250} rx={10} fill="#FFFCF6" />
      <rect x={-20} y={-142} width={40} height={6} rx={3} fill="#5A606C" />
    </g>
    {children}
  </g>
);

/** 推着货的车：大轮子（金币或钞票），车上是吃的、穿的（大家真正要的东西）；原点在轮子着地处 */
export const WheelCart: React.FC<{ s?: number; t?: number; paper?: number; goodsK?: number; wheelGlow?: number; goodsGlow?: number }> = ({ s = 1, t = 0, paper = 0, goodsK = 1, wheelGlow = 0, goodsGlow = 0 }) => {
  const r = 120;
  return (
    <g transform={`scale(${s})`}>
      {goodsGlow > 0 && <ellipse cx={170} cy={-300} rx={220} ry={120} fill={CR.goldHi} opacity={0.5 * goodsGlow} filter="url(#glow)" />}
      {wheelGlow > 0 && <circle cx={0} cy={-r} r={r + 40} fill={CR.goldHi} opacity={0.5 * wheelGlow} filter="url(#glow)" />}
      <g filter="url(#crayon)">
        <path d={wrect(-60, -250, 420, 70, 91, 2)} fill={CR.wood} stroke={L} strokeWidth={5} />
        <path d="M 360 -215 L 470 -150" stroke={CR.wood2} strokeWidth={14} strokeLinecap="round" />
      </g>
      <g transform={`translate(170 -250) scale(${goodsK})`}>
        <g transform="translate(-110 0)"><IcoBread s={1.2} /></g>
        <g transform="translate(0 0)"><IcoCloth s={1.2} /></g>
        <g transform="translate(120 0)"><IcoShirt s={1.1} /></g>
      </g>
      {/* 轮子：金币（金色、£）→ 换成钞票（米白、青绿边）；辐条跟着转 */}
      <g transform={`translate(0 ${-r}) rotate(${t * 3})`} filter="url(#crayon)">
        <circle r={r} fill={paper > 0.5 ? "#FBF4E2" : CR.gold} stroke={L} strokeWidth={6} />
        <circle r={r - 18} fill="none" stroke={paper > 0.5 ? TEAL : "#B9862E"} strokeWidth={6} />
        {[0, 45, 90, 135].map((a) => <path key={a} d={`M ${-(r - 22)} 0 L ${r - 22} 0`} transform={`rotate(${a})`} stroke={paper > 0.5 ? TEAL : "#B9862E"} strokeWidth={6} />)}
        <circle r={24} fill={paper > 0.5 ? "#FBF4E2" : CR.goldHi} stroke={L} strokeWidth={5} />
      </g>
      <g transform={`translate(0 ${-r})`}>
        <text y={14} textAnchor="middle" fontFamily={HAND} fontSize={40} fill={paper > 0.5 ? TEAL : "#8A5A1E"}>£</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- 开头的“到账一百万”手机
/**
 * 一部手机，屏幕上是到账通知；count = 显示的金额（元），会从 0 滚到 1,000,000；dim = 压暗；x、y 是手机中心（画面坐标）。
 * 10-26 深夜用户：第一幕“字体、配色、间距、配图风格都很不搭”——之前不管是真实截图风还是扁平线稿风，都和正片的彩铅道具不是一套。
 * 现在和保险柜、银行、金币同一种画法：彩铅抖线（crayon 滤镜）、深棕手绘线 CR.line、彩铅填色、手写感的矩形（wrect），字用宋体。
 */
export const MillionPhone: React.FC<{ x: number; y: number; s?: number; count?: number; k?: number; dim?: number }> = ({ x, y, s = 1, count = 1000000, k = 1, dim = 0 }) => {
  if (k <= 0) return null;
  const amount = "+" + Math.round(count).toLocaleString("en-US");
  const sc = s * interpolate(k, [0, 1], [0.9, 1]);
  return (
    <Screen>
      <g transform={`translate(${x} ${y}) scale(${sc})`} opacity={Math.min(1, k * 1.5)}>
        <g filter="url(#crayon)">
          {/* 机身：暖深棕彩铅、粗手绘线；屏幕：纸色 */}
          <rect x={-162} y={-318} width={324} height={636} rx={50} fill="rgba(62,42,32,0.12)" transform="translate(10 12)" />
          <rect x={-162} y={-318} width={324} height={636} rx={50} fill="#6B5A4C" stroke={L} strokeWidth={7} />
          <rect x={-142} y={-292} width={284} height={584} rx={34} fill="#F7EFDF" stroke={L} strokeWidth={4} />
          <rect x={-40} y={-284} width={80} height={14} rx={7} fill={L} />
          {/* 到账通知卡片 */}
          <path d={wrect(-124, -246, 248, 196, 141, 2)} fill="#FFFBF2" stroke={L} strokeWidth={4} />
          <path d={wrect(-108, -230, 42, 42, 142, 1.5)} fill={C.red} stroke={L} strokeWidth={3} />
          <path d="M -124 -170 L 124 -170" stroke={L} strokeWidth={2.5} opacity={0.3} />
          {/* 下面几行列表：彩铅画的圆和线 */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${-4 + i * 92})`}>
              <circle cx={-96} cy={0} r={20} fill="#EADFCB" stroke={L} strokeWidth={3} />
              <path d={`M -62 -8 L ${50 - i * 24} -8`} stroke="#B9AA92" strokeWidth={9} strokeLinecap="round" />
              <path d="M -62 12 L 6 12" stroke="#D8CCB6" strokeWidth={7} strokeLinecap="round" />
            </g>
          ))}
        </g>
        <text x={-87} y={-200} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={28} fill={C.paper}>¥</text>
        <text x={-54} y={-200} fontFamily={SERIF} fontWeight={900} fontSize={28} fill={C.ink} letterSpacing="0.06em">到账通知</text>
        <text x={-108} y={-104} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={C.red} letterSpacing="-0.02em">{amount}</text>
        <text x={-108} y={-70} fontFamily={SERIF} fontWeight={900} fontSize={22} fill={C.ink2}>元</text>
        {dim > 0 && <rect x={-142} y={-292} width={284} height={584} rx={34} fill={C.ink} opacity={dim} />}
      </g>
    </Screen>
  );
};

/** 一艘彩铅小帆船（运金银去国外、运货回来）；原点在船底中心 */
export const Ship: React.FC<{ s?: number; t?: number }> = ({ s = 1, t = 0 }) => {
  const bob = Math.sin(t * 0.12) * 5;
  return (
    <g transform={`translate(0 ${bob}) scale(${s})`} filter="url(#crayon)">
      <path d="M -150 -20 Q 0 40 150 -20 Q 120 -2 100 30 L -100 30 Q -120 -2 -150 -20 Z" transform="translate(0 -30)" fill="#8A5A3A" stroke={L} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -150 -50 L 150 -50" stroke={L} strokeWidth={4} />
      <path d="M 0 -50 L 0 -300" stroke={CR.wood2} strokeWidth={10} strokeLinecap="round" />
      <path d={wob2([[6, -290], [120, -90], [6, -90]])} fill="#F7EFDF" stroke={L} strokeWidth={4} strokeLinejoin="round" />
      <path d={wob2([[-6, -260], [-100, -100], [-6, -100]])} fill="#EADFCB" stroke={L} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 0 -300 L 40 -290 L 0 -278 Z" fill={C.red} stroke={L} strokeWidth={3} />
      <path d={`M -200 10 Q -150 ${-6 + bob * 0.4} -100 10 T 0 10 T 100 10 T 200 10`} fill="none" stroke="#7FB0D8" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};
const wob2 = (pts: number[][]) => "M " + pts.map(([x, y]) => `${x} ${y}`).join(" L ") + " Z";

/** 工资单（彩铅纸条 + 一小摞金币）；原点在中心 */
export const Payslip: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-120, -150, 240, 300, 161, 2)} fill="#FFFBF2" stroke={L} strokeWidth={4} />
      <rect x={-120} y={-150} width={240} height={56} fill="#F6C6CE" opacity={0.6} />
      {[0, 1, 2].map((i) => <path key={i} d={`M -90 ${-50 + i * 40} L 90 ${-50 + i * 40}`} stroke="#C9B9A2" strokeWidth={6} strokeLinecap="round" />)}
    </g>
    <text x={0} y={-112} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={C.ink}>工资</text>
    <g transform="translate(70 150)"><CoinStack s={0.9} n={3} /></g>
  </g>
);

/** 盖在画面上的红章（彩铅手绘边框 + 宋体），x、y 是中心；k = 弹出程度 */
export const RedStamp: React.FC<{ x: number; y: number; text: string; k: number; size?: number; rot?: number; o?: number }> = ({ x, y, text, k, size = 96, rot = -8, o = 1 }) => {
  if (k <= 0) return null;
  const w = size * (text.length * 1.02 + 0.9), h = size * 1.5;
  return (
    <Screen>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={o}>
        <g filter="url(#crayon)">
          <path d={wrect(-w / 2, -h / 2, w, h, 151, 3)} fill="rgba(251,247,239,0.9)" stroke={C.red} strokeWidth={9} />
          <path d={wrect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 152, 2)} fill="none" stroke={C.red} strokeWidth={3} />
        </g>
        <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={size} fill={C.red} letterSpacing="0.04em">{text}</text>
      </g>
    </Screen>
  );
};

// ---------------------------------------------------------------- 结论章 / 公式卡
/** “第 X 件的结论”：上面一行小字，下面一块彩色印章大字（画面坐标） */
export const Verdict: React.FC<{ i: 0 | 1 | 2; text: string; at: number; y?: number; out?: number }> = ({ i, text, at, y = 300, out = 1e9 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at - 6, at + 4, out - 6, out + 4], [0, 1, 1, 0], CL);
  if (k <= 0) return null;
  const col = PARTS[i].col;
  return (
    // 10-26 和第一篇融合：宋体、墨色细边、朱砂红错位阴影，像书页上盖的一枚章
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, fontFamily: SERIF, fontWeight: 900, opacity: k }}>
      <div style={{ fontSize: 36, color: C.ink, letterSpacing: "0.08em", WebkitTextStroke: `6px ${C.paper}`, paintOrder: "stroke fill" }}>第{["一", "二", "三"][i]}件的结论</div>
      <div style={{ background: col, color: C.paper, fontSize: 50, padding: "10px 30px", borderRadius: 8, border: `3px solid ${C.ink}`, whiteSpace: "nowrap", rotate: "-2deg", scale: String(interpolate(f, [at - 2, at + 8], [1.5, 1], CL)), boxShadow: `8px 8px 0 ${C.red}` }}>{text}</div>
    </div>
  );
};

/** 结尾公式卡（3 行大字，最后 5 秒停住，方便截图） */
export const Formula17: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  // 每行用书里的说法开头（10-26 用户：结尾要对上书里的专有名词）
  const rows: [string, string, string][] = [["钱是“流通的大轮子”", "收入是它换来的东西", GOLD], ["纸币：大家信它就能当钱", "两万镑金银，常能撑起十万钞票", TEAL], ["省下的金银不会闲着", "换成原料、工具和工钱", GREEN]];
  return (
    // 10-26 和第一篇融合：样子照第一篇的公式卡（米白纸卡、墨色粗边、朱砂红错位阴影、宋体、红底标题条）
    <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 34px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>钱的三件事</span></div>
      {rows.map(([a, b, c], i) => (
        <div key={i} style={{ marginTop: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
            <span style={{ width: 60, height: 60, borderRadius: 30, background: c, color: C.paper, fontSize: 38, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
            <span style={{ fontSize: 52, color: C.ink }}>{a}</span>
          </div>
          <div style={{ marginLeft: 74, marginTop: 6, fontSize: 44, color: c, whiteSpace: "nowrap" }}>→ {b}</div>
        </div>
      ))}
    </div>
  );
};
