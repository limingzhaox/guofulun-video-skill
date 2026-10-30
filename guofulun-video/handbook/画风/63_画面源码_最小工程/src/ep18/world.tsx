// EP18（第二篇第2章中：借新还旧）专用：三件事的配色、借条（汇票）、快塌的房子、水塘、账本、结论章、公式卡。
// 金币、钞票、保险柜、银行、红章这些和 EP17 同一套，直接从 `../ep17/world` 拿；通用部件来自 `src/v16/stage.tsx`。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR } from "../cast/crayon";
import { wrect } from "../v16/town";
import { C, SERIF } from "../kit";

export * from "../ep17/world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

/** 颜色编码：第一件（钞票发多了）赭金、第二件（银行借给谁）墨青、第三件（借新还旧）橄榄绿——第一篇那种压低饱和的配色 */
const GOLD18 = "#C3923F", TEAL18 = "#3F6E73", GREEN18 = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "钞票发多了", col: GOLD18 },
  { n: "②", short: "银行借给谁", col: TEAL18 },
  { n: "③", short: "借新还旧", col: GREEN18 },
];

// ---------------------------------------------------------------- 借条（书里的汇票：两个月后付钱的票）
/**
 * 一张借条 / 汇票（SVG，原点在中心）。amount = 金额（如 "£100"）；top = 上面一行小字；
 * paid = “已还”红章的程度（0–1）；fake = 打问号的假票；dim = 压暗。
 */
export const IOU: React.FC<{ s?: number; rot?: number; amount?: string; top?: string; paid?: number; fake?: boolean; dim?: number; hot?: number }> = ({ s = 1, rot = 0, amount = "£100", top = "两个月后付", paid = 0, fake = false, dim = 0, hot = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    {hot > 0 && <ellipse rx={190} ry={130} fill={CR.goldHi} opacity={0.45 * hot} filter="url(#glow)" />}
    <g filter="url(#crayon)">
      <path d={wrect(-130, -88, 260, 176, 181, 2)} fill="rgba(62,42,32,0.12)" transform="translate(8 9)" />
      <path d={wrect(-130, -88, 260, 176, 181, 2)} fill="#FFFBF0" stroke={L} strokeWidth={4} />
      <path d={wrect(-116, -74, 232, 148, 182, 1.5)} fill="none" stroke="#C9B9A2" strokeWidth={2.5} />
      <path d="M -40 52 Q -20 38 0 50 T 40 46 T 70 52" fill="none" stroke={L} strokeWidth={3} strokeLinecap="round" />
      <circle cx={88} cy={44} r={20} fill="none" stroke={C.red} strokeWidth={4} />
    </g>
    <text x={0} y={-38} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={26} fill={C.ink2}>{top}</text>
    <text x={0} y={22} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={C.red}>{amount}</text>
    {fake && <text x={100} y={-34} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={C.ink}>?</text>}
    {paid > 0 && (
      <g transform={`translate(-58 40) rotate(-14) scale(${paid})`}>
        <rect x={-58} y={-30} width={116} height={60} rx={8} fill="rgba(251,247,239,0.85)" stroke={C.red} strokeWidth={5} />
        <text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={C.red}>已还</text>
      </g>
    )}
    {dim > 0 && <rect x={-132} y={-90} width={264} height={180} rx={10} fill={C.ink} opacity={dim} />}
  </g>
);

// ---------------------------------------------------------------- 快塌的房子
/**
 * 书里的比方：“这房子摇摇欲坠，撑不了多久；可它不一定今晚塌，那我今晚就睡这儿。”
 * 歪着的小木屋、一根斜撑、几道裂缝、窗里亮着灯；t = 帧号（轻轻晃），crack = 裂缝出现程度，lean = 歪的角度。原点在地面中心。
 */
export const CrazyHouse: React.FC<{ s?: number; t?: number; crack?: number; lean?: number; lit?: number }> = ({ s = 1, t = 0, crack = 1, lean = 7, lit = 1 }) => {
  const sway = Math.sin(t * 0.09) * 1.2;
  return (
    <g transform={`scale(${s})`}>
      <g transform={`rotate(${lean + sway})`} style={{ transformOrigin: "0 0" }}>
        <g filter="url(#crayon)">
          <path d={wrect(-170, -300, 340, 300, 191, 3)} fill="#C9A47A" stroke={L} strokeWidth={6} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M -170 ${-60 - i * 55} L 170 ${-56 - i * 55}`} stroke="#A9845A" strokeWidth={3} />)}
          <path d="M -205 -296 L 8 -462 L 210 -292 Z" fill="#8E5E3E" stroke={L} strokeWidth={6} strokeLinejoin="round" />
          <path d={wrect(80, -440, 46, 100, 192, 2)} fill="#9A6A44" stroke={L} strokeWidth={5} transform="rotate(9 100 -400)" />
          <path d={wrect(-40, -150, 84, 150, 193, 2)} fill="#6E4A32" stroke={L} strokeWidth={5} />
          <path d={wrect(-130, -230, 74, 66, 194, 2)} fill={lit > 0 ? "#F7D77A" : "#6E6A64"} stroke={L} strokeWidth={5} />
          <path d={wrect(70, -230, 74, 66, 195, 2)} fill="#5E5248" stroke={L} strokeWidth={5} />
          <path d="M 70 -230 L 144 -164 M 144 -230 L 70 -164" stroke={L} strokeWidth={4} />
        </g>
        {/* 裂缝 */}
        <g opacity={crack} filter="url(#crayon)">
          <path d="M -150 -280 L -120 -240 L -134 -200 L -104 -160" fill="none" stroke={L} strokeWidth={4} strokeLinecap="round" />
          <path d="M 160 -120 L 130 -90 L 146 -50 L 118 -20" fill="none" stroke={L} strokeWidth={4} strokeLinecap="round" />
          <path d="M 40 -300 L 56 -270 L 42 -246" fill="none" stroke={L} strokeWidth={4} strokeLinecap="round" />
        </g>
        {lit > 0 && <ellipse cx={-93} cy={-197} rx={70} ry={60} fill={CR.goldHi} opacity={0.35 * lit} filter="url(#glow)" />}
      </g>
      {/* 斜撑 */}
      <g filter="url(#crayon)">
        <path d="M 250 0 L 150 -250" stroke={CR.wood2} strokeWidth={18} strokeLinecap="round" />
        <path d="M 210 0 L 290 0" stroke={L} strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- 水塘（银行的柜子）
/**
 * 书里的比方：好银行的柜子像一口水塘，流出去多少，就流进来多少。
 * outK / inK = 出水、进水的水流大小（0–1）；level = 水位（0–1）；t = 帧号。原点在塘底中心，宽约 560。
 */
export const Pond: React.FC<{ s?: number; t?: number; outK?: number; inK?: number; level?: number; label?: boolean }> = ({ s = 1, t = 0, outK = 1, inK = 1, level = 0.8, label = true }) => {
  const h = 40 + 120 * level;
  const dash = (k: number, dir: number) => ({ strokeDasharray: "26 18", strokeDashoffset: dir * t * 3, opacity: k });
  return (
    <g transform={`scale(${s})`}>
      <g filter="url(#crayon)">
        <path d="M -300 0 Q -300 -190 -260 -200 L 260 -200 Q 300 -190 300 0 Z" fill="#E6DCCB" stroke={L} strokeWidth={6} />
        <path d={`M -270 0 L -270 ${-h} L 270 ${-h} L 270 0 Z`} fill="#9CC3D9" />
        <path d={`M -270 ${-h} Q -135 ${-h - 10 + Math.sin(t * 0.2) * 4} 0 ${-h} T 270 ${-h}`} fill="none" stroke="#6FA8D6" strokeWidth={6} />
        <path d="M -300 0 Q -300 -190 -260 -200 L 260 -200 Q 300 -190 300 0 Z" fill="none" stroke={L} strokeWidth={6} />
        {/* 右边进水管、左边出水管 */}
        <path d={wrect(250, -300, 150, 46, 201, 1.5)} fill="#8C99A6" stroke={L} strokeWidth={5} />
        <path d={wrect(-400, -70, 150, 46, 202, 1.5)} fill="#8C99A6" stroke={L} strokeWidth={5} />
      </g>
      <path d="M 260 -254 Q 230 -230 230 -170" fill="none" stroke="#6FA8D6" strokeWidth={14 * inK + 1} strokeLinecap="round" style={dash(inK, -1)} />
      <path d="M -400 -47 L -470 -47 Q -500 -47 -500 0" fill="none" stroke="#6FA8D6" strokeWidth={14 * outK + 1} strokeLinecap="round" style={dash(outK, -1)} />
      {label && (
        <>
          <text x={330} y={-320} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={C.ink} opacity={inK > 0.05 ? 1 : 0.4}>流进来</text>
          <text x={-420} y={-96} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={C.ink}>流出去</text>
        </>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- 账本（按时还钱一目了然）
/** 打开的账本：rows = 每一行的还款记录（true = 按时还，false = 空着），k = 打勾进度（0–1）；原点在中心 */
export const Ledger: React.FC<{ s?: number; rows: { name: string; marks: boolean[] }[]; k?: number; warn?: number }> = ({ s = 1, rows, k = 1, warn = 0 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d="M -330 -220 Q -170 -250 0 -214 Q 170 -250 330 -220 L 330 220 Q 170 190 0 226 Q -170 190 -330 220 Z" fill="#FFFBF0" stroke={L} strokeWidth={5} />
      <path d="M 0 -214 L 0 226" stroke={L} strokeWidth={4} />
    </g>
    {rows.map((r, i) => (
      <g key={i} transform={`translate(-300 ${-130 + i * 110})`}>
        <text x={0} y={14} fontFamily={SERIF} fontWeight={900} fontSize={34} fill={C.ink}>{r.name}</text>
        {r.marks.map((m, j) => {
          const on = k * r.marks.length > j;
          return (
            <g key={j} transform={`translate(${170 + j * 72} 0)`} opacity={on ? 1 : 0}>
              {m ? <path d="M -16 0 L -4 14 L 20 -16" fill="none" stroke={GREEN18} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
                 : <circle r={14} fill="none" stroke="#C9B9A2" strokeWidth={4} strokeDasharray="6 6" />}
            </g>
          );
        })}
        {i === rows.length - 1 && warn > 0 && (
          <g opacity={warn} transform="translate(580 0)">
            <path d="M -18 -20 L 18 22" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
            <path d="M 4 22 L 18 22 L 18 6" fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- 横条对比（金额、利率）
/** 一根带字的横条（SVG）：w = 宽度（0–1 动画用 k 控制），col = 颜色，label 在条上方，value 在条里 */
export const Bar: React.FC<{ x: number; y: number; w: number; k: number; col: string; label: string; value: string; h?: number }> = ({ x, y, w, k, col, label, value, h = 76 }) => (
  <g opacity={k > 0 ? 1 : 0}>
    <text x={x} y={y - 16} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={C.ink}>{label}</text>
    <rect x={x} y={y} width={Math.max(0, w * k)} height={h} rx={16} fill={col} stroke={L} strokeWidth={4} />
    <text x={x + 24} y={y + h / 2 + 15} fontFamily={SERIF} fontWeight={900} fontSize={40} fill="#FFFCF6" opacity={k > 0.6 ? 1 : 0}>{value}</text>
  </g>
);

// ---------------------------------------------------------------- 结论章 / 公式卡
/** “第 X 件的结论”：上面一行小字，下面一块彩色印章大字（画面坐标），样子同 EP17 */
export const Verdict: React.FC<{ i: 0 | 1 | 2; text: string; at: number; y?: number; out?: number }> = ({ i, text, at, y = 338, out = 1e9 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at - 6, at + 4, out - 6, out + 4], [0, 1, 1, 0], CL);
  if (k <= 0) return null;
  const col = PARTS[i].col;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, fontFamily: SERIF, fontWeight: 900, opacity: k }}>
      <div style={{ fontSize: 36, color: C.ink, letterSpacing: "0.08em", WebkitTextStroke: `6px ${C.paper}`, paintOrder: "stroke fill" }}>第{["一", "二", "三"][i]}件的结论</div>
      <div style={{ background: col, color: C.paper, fontSize: 50, padding: "10px 30px", borderRadius: 8, border: `3px solid ${C.ink}`, whiteSpace: "nowrap", rotate: "-2deg", scale: String(interpolate(f, [at - 2, at + 8], [1.5, 1], CL)), boxShadow: `8px 8px 0 ${C.red}` }}>{text}</div>
    </div>
  );
};

/**
 * 结尾公式卡：标题条 + 3 行大字（v5.1“3 行以内，大字”），最后 5 秒停住，方便截图。
 * 10-27 复核：EP17、EP18 两集都多了一行箭头小字，卡上一共 7 行字——去掉副行，一件一行。
 */
export const Formula18: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const rows: [string, string][] = [
    ["钞票最多顶替原来的金银", GOLD18],
    ["银行只借本来要压着的现钱", TEAL18],
    ["开票再开票：借来的只是时间", GREEN18],
  ];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 34px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>银行的三条线</span></div>
      {rows.map(([a, c], i) => (
        <div key={i} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap" }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, background: c, color: C.paper, fontSize: 40, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
          <span style={{ fontSize: 54, color: C.ink }}>{a}</span>
        </div>
      ))}
    </div>
  );
};
