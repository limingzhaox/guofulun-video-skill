// EP24（第三篇第2章：罗马帝国倒了以后，欧洲大片的地为什么几百年都没人好好种）专用：三步的配色、山坡上老爷的大宅、地契、租约、盾牌、结论章、公式卡。
// 10-30 按 ★★★★★ 做的第一集：第一句“你有没有想过……”，第一句念完之前屏幕上只有大字；同一个庄园、同一个农夫从农奴演到分成佃农、交租金的佃农。
// 田、镇子、日子格子从 `../ep23/world` 拿（一路带上 EP22–EP17 和 v16/stage 的道具）。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR, wob } from "../cast/crayon";
import { C, SERIF } from "../kit";
import { wrect } from "../v16/town";
import { TOPS } from "../v16/stage";

export * from "../ep23/world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

/** 颜色：第一步赭金、第二步墨青、第三步橄榄绿 */
export const GOLD24 = "#C3923F", TEAL24 = "#3F6E73", GREEN24 = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "地攥在谁手里", col: GOLD24 },
  { n: "②", short: "种地的人图啥", col: TEAL24 },
  { n: "③", short: "交了租金呢", col: GREEN24 },
];

/** 山坡上老爷的大宅（原点在山脚中心）：flag = 旗子，garden = 宅子前的花园排场（0–1），dim = 压暗 */
export const Manor: React.FC<{ s?: number; flag?: number; garden?: number; t?: number; dim?: number }> = ({ s = 1, flag = 1, garden = 0, t = 0, dim = 0 }) => (
  <g transform={`scale(${s})`} opacity={1 - dim * 0.5}>
    <g filter="url(#crayon)">
      <path d={wob([[-270, 0], [-190, -64], [-70, -104], [70, -106], [190, -64], [270, 0]], 2, 7)} fill="#CBB27A" stroke={L} strokeWidth={4} />
      {[-122, 122].map((x, i) => (
        <g key={i}>
          <path d={wrect(x - 34, -300, 68, 204, 11 + i)} fill="#E7D6B8" stroke={L} strokeWidth={4} />
          <path d={wob([[x - 46, -296], [x, -366], [x + 46, -296]], 1.2, 13 + i)} fill="#8E5A44" stroke={L} strokeWidth={4} strokeLinejoin="round" />
          <path d={wrect(x - 11, -256, 22, 32, 17 + i)} fill="#5A4636" />
        </g>
      ))}
      <path d={wrect(-92, -252, 184, 156, 21)} fill="#F0E2C6" stroke={L} strokeWidth={4} />
      <path d={wob([[-106, -248], [0, -324], [106, -248]], 1.2, 23)} fill="#A8634A" stroke={L} strokeWidth={4} strokeLinejoin="round" />
      <path d={wrect(-24, -172, 48, 76, 25)} fill="#7A5236" stroke={L} strokeWidth={3} />
      {[-60, 60].map((x, i) => <path key={i} d={wrect(x - 15, -224, 30, 32, 27 + i)} fill="#F3E3B8" stroke={L} strokeWidth={3} />)}
    </g>
    {flag > 0 && (
      <g transform="translate(0 -322)" opacity={flag}>
        <path d="M 0 0 L 0 -72" stroke={L} strokeWidth={4} strokeLinecap="round" />
        <path d={`M 0 -72 Q 24 ${-66 + Math.sin(t * 0.2) * 5} 48 -62 Q 24 -56 0 -50 Z`} fill={C.red} stroke={L} strokeWidth={3} />
      </g>
    )}
    {garden > 0 && (
      <g opacity={Math.min(1, garden)}>
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} transform={`translate(${-200 + i * 50} ${-18 - (i % 2) * 14}) scale(${Math.min(1, garden)})`}>
            <path d="M 0 0 L 0 -26" stroke={CR.leaf2} strokeWidth={4} />
            <circle cy={-30} r={11} fill={["#E58BA0", "#F0C24B", "#D96C5A"][i % 3]} stroke={L} strokeWidth={2.5} />
          </g>
        ))}
        <g transform="translate(0 -40)" filter="url(#crayon)">
          <path d={wob([[-40, 0], [-30, -24], [30, -24], [40, 0]], 1, 31)} fill="#BFD7E4" stroke={L} strokeWidth={3} />
          <path d={`M 0 -24 Q -6 ${-56 - Math.sin(t * 0.3) * 4} -18 -40 M 0 -24 Q 6 ${-56 - Math.cos(t * 0.3) * 4} 18 -40`} fill="none" stroke="#7FB0D8" strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
    )}
  </g>
);

/** 地契 / 祖上的规矩（原点在纸中心）：title 大字、sub 小字、lock = 上锁（限定继承：不许卖） */
export const Deed: React.FC<{ s?: number; title: string; sub?: string; lock?: number; rot?: number }> = ({ s = 1, title, sub, lock = 0, rot = -4 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-120, -150, 240, 300, 41)} fill="#F4E6C4" stroke={L} strokeWidth={4} />
      <path d={wrect(-136, -164, 272, 28, 43)} fill="#D9B98A" stroke={L} strokeWidth={4} />
      <path d={wrect(-136, 136, 272, 28, 45)} fill="#D9B98A" stroke={L} strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M -86 ${10 + i * 26} L 86 ${10 + i * 26}`} stroke="#B8A27A" strokeWidth={3} strokeLinecap="round" />)}
    </g>
    <text y={-62} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={54} fill={C.ink}>{title}</text>
    {sub && <text y={-12} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={26} fill={C.red}>{sub}</text>}
    {lock > 0 && (
      <g transform={`translate(80 96) scale(${Math.min(1.1, lock)})`} filter="url(#crayon)">
        <path d="M -22 -10 L -22 -32 Q -22 -54 0 -54 Q 22 -54 22 -32 L 22 -10" fill="none" stroke="#6E6A63" strokeWidth={8} />
        <path d={wrect(-34, -12, 68, 56, 47)} fill="#C9A24A" stroke={L} strokeWidth={4} />
        <circle cy={12} r={7} fill={L} />
      </g>
    )}
  </g>
);

/** 租约（原点在纸中心）：years = 写在上面的年限，seal = 盖“算数”的章（0–1），torn = 作废（0–1，画一道红叉） */
export const Lease: React.FC<{ s?: number; years?: string; seal?: number; torn?: number; rot?: number; sealText?: string }> = ({ s = 1, years, seal = 0, torn = 0, rot = 3, sealText = "算数" }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-110, -140, 220, 280, 51)} fill="#FBF3DF" stroke={L} strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M -76 ${-20 + i * 26} L 76 ${-20 + i * 26}`} stroke="#C8B693" strokeWidth={3} strokeLinecap="round" />)}
    </g>
    <text y={-74} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={50} fill={C.ink}>租约</text>
    {years && <text y={118} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={GREEN24}>{years}</text>}
    {seal > 0 && (
      <g transform={`translate(58 70) rotate(-14) scale(${interpolate(seal, [0, 0.6, 1], [2, 0.92, 1], CL)})`} opacity={Math.min(1, seal * 2)}>
        <circle r={44} fill="none" stroke={C.red} strokeWidth={6} />
        <text y={12} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={C.red}>{sealText}</text>
      </g>
    )}
    {torn > 0 && <g opacity={Math.min(1, torn)}><path d="M -90 -110 L 90 110 M 90 -110 L -90 110" stroke={C.red} strokeWidth={10} strokeLinecap="round" /></g>}
  </g>
);

/** 盾牌（原点在中心）：地多就能养兵、能自保 */
export const Shield: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} filter="url(#crayon)">
    <path d={wob([[-70, -80], [70, -80], [70, 0], [0, 90], [-70, 0]], 1.4, 61)} fill="#8E9AA6" stroke={L} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 0 -64 L 0 64 M -52 -20 L 52 -20" stroke={C.red} strokeWidth={12} strokeLinecap="round" />
  </g>
);

/** 一大片地的俯视图（原点在左上角）：split = 分成几块（1 = 一整块），fence = 篱笆画到哪（0–1），sold = 第几块挂“卖” */
export const LandMap: React.FC<{ w?: number; h?: number; split?: number; fence?: number; lush?: number; label?: string; labelK?: number }> = ({ w = 900, h = 420, split = 1, fence = 0, lush = 0.4, label, labelK = 0 }) => {
  const cols = split >= 8 ? 4 : split >= 4 ? 2 : 1, rows = split >= 8 ? 2 : split >= 4 ? 2 : 1;
  return (
    <g>
      <g filter="url(#crayon)">
        <path d={wrect(0, 0, w, h, 71)} fill={lush > 0.6 ? "#B6C27A" : lush > 0.3 ? "#C9C08A" : "#D6C9A2"} stroke={L} strokeWidth={5} />
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M 30 ${40 + i * 55} L ${w - 30} ${40 + i * 55}`} stroke={lush > 0.3 ? CR.leaf2 : "#B7A87E"} strokeWidth={6} strokeLinecap="round" strokeDasharray={lush > 0.3 ? "0" : "26 30"} opacity={0.7} />)}
      </g>
      {Array.from({ length: cols - 1 }).map((_, i) => <path key={`c${i}`} d={`M ${((i + 1) * w) / cols} 0 L ${((i + 1) * w) / cols} ${h}`} stroke={L} strokeWidth={5} strokeDasharray="18 12" />)}
      {rows > 1 && <path d={`M 0 ${h / 2} L ${w} ${h / 2}`} stroke={L} strokeWidth={5} strokeDasharray="18 12" />}
      {fence > 0 && <path d={`M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`} fill="none" stroke={CR.wood2} strokeWidth={12} strokeDasharray="22 10" pathLength={1} strokeDashoffset={0} opacity={Math.min(1, fence)} />}
      {label && labelK > 0 && <text x={w / 2} y={h / 2 + 22} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={C.ink} opacity={Math.min(1, labelK)}>{label}</text>}
    </g>
  );
};

/** 两根对比条（画面坐标）：k 控制长到多少 */
export const PairBars: React.FC<{ f: number; rows: { label: string; value: string; w: number; col: string; at: number }[]; x?: number; y?: number }> = ({ f, rows, x = 60, y = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {rows.map((r, i) => {
      const k = interpolate(f, [r.at - 4, r.at + 14], [0, 1], CL);
      if (k <= 0) return null;
      return (
        <g key={i} transform={`translate(0 ${i * 150})`}>
          <text y={-14} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={C.ink}>{r.label}</text>
          <rect y={0} width={Math.max(0, r.w * k)} height={76} rx={16} fill={r.col} stroke={L} strokeWidth={4} />
          <text x={24} y={52} fontFamily={SERIF} fontWeight={900} fontSize={40} fill="#FFFCF6" opacity={k > 0.6 ? 1 : 0}>{r.value}</text>
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- 结论章 / 公式卡
/** 每一步的结论章（画面上的字） */
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
export const Formula24: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const rows: [string, string][] = [
    ["长子继承、限定继承：地不分，也不卖", GOLD24],
    ["农奴的活：到头来最贵", TEAL24],
    ["租约太短：佃农不敢往地里投钱", GREEN24],
  ];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 30px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>地为什么没种好</span></div>
      {rows.map(([a, c], i) => (
        <div key={i} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
          <span style={{ width: 60, height: 60, borderRadius: 30, background: c, color: C.paper, fontSize: 38, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
          <span style={{ fontSize: 44, color: C.ink }}>{a}</span>
        </div>
      ))}
    </div>
  );
};
