// 第一篇汇总（ep15s）：一件外套（串场道具，首尾呼应）+ 一根针 + 价格摆针 + 15 集回顾格子；三步颜色编码
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C, fin, SERIF, useLines } from "../kit";
import { GROUND } from "../ep10/world";
import { Person } from "../kit";

export { GROUND };

/** 路人（2026-10-24 用户反馈“小人没细节”）：不再用没脸的圆头小人，一律画成正片里有脸、有帽子、会眨眼的人物；
 *  参数沿用原来的 Mini（col = 衣服颜色，s = 原小人的比例），身高大约是原来的两倍 */
const HATS = ["cap", "none", "kerchief", "none", "beanie", "cap", "none"] as const;
const HAIR = ["#2A1C14", "#3A2A20", "#1F1A16", "#4A3426", "#6B5B4B"];
export const Mini: React.FC<{ x: number; y: number; col: string; s?: number; o?: number; mood?: "smile" | "happy" | "sad" | "wow" | "flat" | "tired" | "smirk"; flip?: boolean; armR?: [number, number]; legs?: [number, number] }> = ({ x, y, col, s = 1, o = 1, mood = "smile", flip, armR, legs }) => {
  const h = Math.abs(Math.round(x * 7 + parseInt(col.slice(1, 4), 16)));
  return <Person x={x} y={y} s={s * 0.5} shirt={col} hat={HATS[h % HATS.length]} hair={HAIR[h % HAIR.length]} apron={h % 4 === 1} seed={h % 97} mood={mood} flip={flip} armR={armR} legs={legs} o={o} />;
};
export const STEP = ["#4F77A8", "#C3923F", "#5E7F4A"]; // ①越造越多 ②怎么换怎么定价 ③怎么分
export const PART = { wage: "#C3923F", profit: "#B9412C", rent: "#78866A" };

/** 一件羊毛外套 */
export const Coat: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -90 -260 L -40 -290 L 0 -250 L 40 -290 L 90 -260 L 150 -170 L 110 -140 L 90 -170 L 90 0 L -90 0 L -90 -170 L -110 -140 L -150 -170 Z" fill="#8C5A40" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -40 -290 L 0 -200 L 40 -290" stroke={C.ink} strokeWidth={4} fill="none" />
    <line x1={0} y1={-200} x2={0} y2={0} stroke={C.ink} strokeWidth={3} />
    {[-160, -110, -60].map((y) => <circle key={y} cx={14} cy={y} r={7} fill="#E8C35A" stroke={C.ink} strokeWidth={2} />)}
    <rect x={-70} y={-110} width={50} height={8} rx={4} fill="#6E4630" />
    <rect x={20} y={-110} width={50} height={8} rx={4} fill="#6E4630" />
  </g>
);

/** 一根针 */
export const Pin: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    <line x1={0} y1={0} x2={0} y2={-90} stroke="#9EA6B2" strokeWidth={5} strokeLinecap="round" />
    <circle cx={0} cy={-92} r={7} fill="#C9CED6" stroke={C.ink} strokeWidth={2} />
  </g>
);

/** 外套背后的一大群人：一个个职业小人（带名字），k 0–1 依次冒出来 */
export const ROLES = ["放羊的", "剪毛的", "纺线的", "织布的", "染色的", "赶车的", "开船的"];
const ROLE_COL = ["#7C8C5A", "#8C6A4E", "#C3923F", "#5E7FA8", "#7A5C9E", "#86593A", "#3D4A63"];
export const Crowd: React.FC<{ k: number; y?: number; labels?: boolean; extra?: number }> = ({ k, y = GROUND, labels = true, extra = 0 }) => (
  <g>
    {ROLES.map((r, i) => {
      const a = Math.min(1, Math.max(0, k * ROLES.length - i));
      const x = 90 + i * 150;
      return (
        <g key={r} opacity={a} transform={`translate(0 ${(1 - a) * 30})`}>
          <Mini x={x} y={y} col={ROLE_COL[i]} s={1.3} />
          {labels && <text x={x} y={y + 50} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={28} fill={C.ink2}>{r}</text>}
        </g>
      );
    })}
    {Array.from({ length: Math.floor(extra * 30) }).map((_, i) => <Mini key={`e${i}`} x={40 + (i % 15) * 70} y={y - 150 - Math.floor(i / 15) * 90} col={ROLE_COL[i % 7]} s={0.8} o={0.6} />)}
  </g>
);

/** 价格摆针：中心线 + 来回摆的指针（amp 振幅、center 中心值 0–1） */
export const PriceSwing: React.FC<{ x: number; y: number; amp: number; t: number; w?: number }> = ({ x, y, amp, t, w = 700 }) => {
  const v = 0.5 + amp * Math.sin(t * 0.09) * Math.exp(-0.0);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-30} width={w} height={60} rx={30} fill="#E9DCC2" stroke={C.ink} strokeWidth={3} />
      <line x1={0} y1={-60} x2={0} y2={60} stroke={STEP[1]} strokeWidth={6} strokeDasharray="10 8" />
      <text x={0} y={-74} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={STEP[1]}>自然价格</text>
      <circle cx={(v - 0.5) * w} cy={0} r={26} fill={C.red} stroke={C.ink} strokeWidth={3} />
      <text x={-w / 2 + 20} y={70} fontFamily={SERIF} fontWeight={900} fontSize={26} fill={C.ink2}>贱</text>
      <text x={w / 2 - 20} y={70} textAnchor="end" fontFamily={SERIF} fontWeight={900} fontSize={26} fill={C.ink2}>贵</text>
    </g>
  );
};

/** 一步的结论印章（HTML） */
export const StepConclusion: React.FC<{ n: number; text: string; at: number; y?: number; dark?: boolean }> = ({ n, text, at, y = 420, dark }) => {
  const f = useCurrentFrame();
  if (f < at - 6) return null;
  const col = STEP[n - 1];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, fontFamily: SERIF, fontWeight: 900, opacity: fin(f, at - 6, 8) }}>
      <div style={{ fontSize: 34, color: dark ? "#E9E1CF" : C.ink2 }}>第{"一二三"[n - 1]}步的结论</div>
      {text.split("；").map((seg, i) => (
        <div key={i} style={{ background: col, color: C.paper, fontSize: 44, padding: "10px 26px", borderRadius: 6, whiteSpace: "nowrap", rotate: i % 2 ? "2deg" : "-2deg", boxShadow: `inset 0 0 0 4px ${C.paper}, inset 0 0 0 7px ${col}`, scale: String(interpolate(fin(f, at - 2 + i * 6, 8), [0, 1], [1.5, 1])), opacity: fin(f, at - 2 + i * 6, 6) }}>{seg}</div>
      ))}
    </div>
  );
};

/** 15 集回顾格子（HTML） */
export const EPS = [
  "做针的作坊", "晚饭不靠好心", "市场越大分工越细", "钱是怎么来的", "涨薪不一定变富",
  "价格分成三份", "口罩涨了又跌", "最有钱≠工资最高", "钱越多利润越薄", "钱多事少离家近",
  "好工作为啥难进", "工资涨房租也涨", "和首富都吃三顿", "钱越来越不值钱", "肉贵了手表便宜",
];
export const RecapGrid: React.FC<{ k: number; top?: number }> = ({ k, top = 360 }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, fontFamily: SERIF, fontWeight: 900 }}>
    {EPS.map((t, i) => {
      const a = Math.min(1, Math.max(0, k * EPS.length - i));
      const col = i < 3 ? STEP[0] : i < 7 ? STEP[1] : STEP[2];
      return (
        <div key={t} style={{ height: 104, borderRadius: 14, background: "#FBF7EF", border: `4px solid ${col}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", opacity: a, scale: String(0.85 + 0.15 * a) }}>
          <div style={{ fontSize: 22, color: col }}>EP{String(i + 1).padStart(2, "0")}</div>
          <div style={{ fontSize: 28, color: C.ink, whiteSpace: "nowrap" }}>{t}</div>
        </div>
      );
    })}
  </div>
);

/** 当代例子角标：这一句讲的是今天的例子，不出自原著 */
export const Modern: React.FC<{ scene: string; i: number }> = ({ scene, i }) => {
  const f = useCurrentFrame();
  const L = useLines(scene);
  const a = fin(f, L.s(i) - 6, 8) * (1 - fin(f, L.e(i), 8));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 292, right: 50, opacity: a, background: "#FBF7EF", border: `3px dashed ${C.ink2}`, color: C.ink2, borderRadius: 999, padding: "6px 20px", fontFamily: SERIF, fontWeight: 900, fontSize: 28, whiteSpace: "nowrap" }}>当代例子 · 非原著</div>
  );
};

/** 一条狗（侧面） */
export const Dog: React.FC<{ x: number; y?: number; s?: number; flip?: boolean }> = ({ x, y = GROUND, s = 1, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={-70} rx={70} ry={34} fill="#B98A5A" stroke={C.ink} strokeWidth={4} />
    {[-45, -20, 25, 50].map((lx) => <rect key={lx} x={lx - 7} y={-50} width={14} height={50} rx={6} fill="#B98A5A" stroke={C.ink} strokeWidth={3} />)}
    <path d="M -68 -80 Q -100 -110 -96 -130" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    <circle cx={74} cy={-104} r={32} fill="#B98A5A" stroke={C.ink} strokeWidth={4} />
    <ellipse cx={58} cy={-130} rx={12} ry={22} fill="#86593A" stroke={C.ink} strokeWidth={3} transform="rotate(-20 58 -130)" />
    <circle cx={84} cy={-110} r={4} fill={C.ink} />
    <circle cx={106} cy={-98} r={6} fill={C.ink} />
  </g>
);

/** 一根骨头 */
export const Bone: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-40} y={-8} width={80} height={16} rx={8} fill="#F3EBDD" stroke={C.ink} strokeWidth={3} />
    {[-40, 40].map((bx) => [-9, 9].map((by) => <circle key={`${bx}${by}`} cx={bx} cy={by} r={11} fill="#F3EBDD" stroke={C.ink} strokeWidth={3} />))}
  </g>
);
