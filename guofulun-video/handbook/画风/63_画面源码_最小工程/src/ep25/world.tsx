// EP25（第三篇第3章：罗马帝国倒了以后，城市怎样兴起）专用：三步的配色、有城墙城门的城、收钱的关卡、钱袋、税箱、包税契约、跷跷板、锁链、议事大厅、今天的大城市、细布。
// 10-31 用户：页眉和三格往上靠（`TOPS`），顶部关键词、结论章跟着上移；同一座城、同一个农夫从头用到尾。
// 田、镇子、庄园、日子格子从 `../ep24/world` 拿（一路带上 EP23–EP17 和 v16/stage 的道具）。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR, wob } from "../cast/crayon";
import { C, SERIF } from "../kit";
import { IcoHouse, IcoShop, Keyword as Keyword0, TOPS } from "../v16/stage";
import { wrect } from "../v16/town";

export * from "../ep24/world";
export { TOPS };

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

/** 颜色：第一步赭金、第二步墨青、第三步橄榄绿 */
export const GOLD25 = "#C3923F", TEAL25 = "#3F6E73", GREEN25 = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "一开始自由吗", col: GOLD25 },
  { n: "②", short: "自由是怎么来的", col: TEAL25 },
  { n: "③", short: "乡下跟着富吗", col: GREEN25 },
];

/** 顶部关键词：EP25 起放在 TOPS.keyword（比老集高约 54px） */
export const Keyword: typeof Keyword0 = (p) => <Keyword0 y={TOPS.keyword} {...p} />;

/**
 * 有城墙的城（原点在城门底边中心）：wall = 城墙砌到多高（0–1，一层层往上长），gate = 城门开多大（0 关、1 全开），
 * lit = 城楼上的灯（守夜），flag = 城楼上的旗，houses = 墙后露出几座房顶，dim = 压暗（乡下、照样穷）
 */
export const CityWall: React.FC<{ s?: number; wall?: number; gate?: number; lit?: number; flag?: number; houses?: number; t?: number; dim?: number; flagText?: string }> = ({ s = 1, wall = 1, gate = 0, lit = 0, flag = 0, houses = 4, t = 0, dim = 0, flagText }) => {
  const H = 200, rows = 6;
  const shown = Math.max(0, Math.min(rows, wall * rows));
  return (
    <g transform={`scale(${s})`} opacity={1 - dim * 0.45}>
      {/* 墙后的房顶 */}
      {Array.from({ length: Math.min(5, Math.ceil(houses)) }).map((_, i) => {
        const k = Math.max(0, Math.min(1, houses - i));
        const xs = [-150, 150, -40, 60, -230];
        return k > 0 ? <g key={i} transform={`translate(${xs[i]} ${-H + 30 - (i % 2) * 26}) scale(${1.05 * k})`}>{i % 2 ? <IcoShop /> : <IcoHouse />}</g> : null;
      })}
      <clipPath id="cw-build"><rect x={-340} y={-H * (shown / rows) - 2} width={680} height={H * (shown / rows) + 4} /></clipPath>
      <g clipPath="url(#cw-build)" filter="url(#crayon)">
        <path d={wrect(-300, -H, 600, H, 301)} fill="#D9C4A0" stroke={L} strokeWidth={5} />
        {Array.from({ length: rows - 1 }).map((_, r) => <path key={r} d={`M -296 ${-((r + 1) * H) / rows} L 296 ${-((r + 1) * H) / rows}`} stroke="#B49C76" strokeWidth={3} />)}
        {Array.from({ length: rows }).map((_, r) => Array.from({ length: 9 }).map((__, c) => (
          <path key={`${r}-${c}`} d={`M ${-300 + c * 66 + (r % 2) * 33} ${-(r * H) / rows} L ${-300 + c * 66 + (r % 2) * 33} ${-((r + 1) * H) / rows}`} stroke="#B49C76" strokeWidth={3} />
        )))}
      </g>
      {/* 垛口和两座城楼：墙砌满了才出来 */}
      {wall >= 0.99 && (
        <g filter="url(#crayon)">
          {Array.from({ length: 9 }).map((_, i) => <path key={i} d={wrect(-290 + i * 66, -H - 26, 40, 28, 311 + i)} fill="#D9C4A0" stroke={L} strokeWidth={4} />)}
          {[-300, 300].map((x, i) => (
            <g key={i}>
              <path d={wrect(x - 50, -H - 90, 100, H + 90, 321 + i)} fill="#CDB48C" stroke={L} strokeWidth={5} />
              <path d={wob([[x - 62, -H - 86], [x, -H - 160], [x + 62, -H - 86]], 1.2, 323 + i)} fill="#8E5A44" stroke={L} strokeWidth={5} strokeLinejoin="round" />
              <path d={wrect(x - 14, -H - 50, 28, 36, 325 + i)} fill="#5A4636" />
            </g>
          ))}
        </g>
      )}
      {/* 城门：两扇门板，往两边收 */}
      {shown > 3 && (
        <g>
          <path d="M -70 0 L -70 -110 Q 0 -170 70 -110 L 70 0 Z" fill="#4A3A2E" stroke={L} strokeWidth={5} />
          {[-1, 1].map((d) => (
            <g key={d} transform={`translate(${d * 70} 0) scale(${1 - gate * 0.85} 1) translate(${-d * 70} 0)`}>
              <path d={d < 0 ? "M -70 0 L -70 -110 Q -36 -150 0 -158 L 0 0 Z" : "M 70 0 L 70 -110 Q 36 -150 0 -158 L 0 0 Z"} fill="#9A6A44" stroke={L} strokeWidth={4} />
              {[-40, -80, -120].map((y) => <path key={y} d={`M ${d * 66} ${y} L ${d * 6} ${y}`} stroke="#6E4A30" strokeWidth={5} />)}
            </g>
          ))}
        </g>
      )}
      {/* 守夜的灯 */}
      {lit > 0 && wall >= 0.99 && [-300, 300].map((x, i) => (
        <g key={i} transform={`translate(${x} ${-H - 32})`} opacity={Math.min(1, lit)}>
          <circle r={40 + Math.sin(t * 0.2 + i) * 4} fill="#F6D57A" opacity={0.35} />
          <circle r={14} fill="#F2B84B" stroke={L} strokeWidth={3} />
        </g>
      ))}
      {/* 旗：自由市 */}
      {flag > 0 && wall >= 0.99 && (
        <g transform={`translate(300 ${-H - 156})`} opacity={Math.min(1, flag)}>
          <path d="M 0 0 L 0 -90" stroke={L} strokeWidth={5} strokeLinecap="round" />
          <path d={`M 0 -90 Q 50 ${-82 + Math.sin(t * 0.2) * 6} 100 -76 Q 50 -66 0 -58 Z`} fill={C.red} stroke={L} strokeWidth={3} />
          {flagText && <text x={-16} y={-60} textAnchor="end" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={C.red} stroke={C.paper} strokeWidth={8} paintOrder="stroke">{flagText}</text>}
        </g>
      )}
    </g>
  );
};

/** 收钱的关卡（原点在杆子脚下）：up = 横杆抬起来（0 放下拦着、1 抬起放行），label = 下面的字（过路、过桥、摆摊） */
export const TollGate: React.FC<{ s?: number; up?: number; label?: string; col?: string }> = ({ s = 1, up = 0, label, col = GOLD25 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-14, -150, 28, 150, 341)} fill={CR.wood2} stroke={L} strokeWidth={4} />
      <g transform={`translate(0 -130) rotate(${-up * 75})`}>
        <path d={wrect(0, -12, 190, 24, 343)} fill="#FFF7E8" stroke={L} strokeWidth={4} />
        {[30, 90, 150].map((x) => <rect key={x} x={x} y={-12} width={28} height={24} fill={C.red} opacity={0.85} />)}
      </g>
    </g>
    {label && (
      <g transform="translate(0 48)">
        <rect x={-62} y={-30} width={124} height={50} rx={10} fill="#FBF7EF" stroke={col} strokeWidth={4} />
        <text y={8} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={32} fill={C.ink}>{label}</text>
      </g>
    )}
  </g>
);

/** 钱袋（原点在袋底中心）：full = 鼓不鼓（0 瘪、1 满），glow = 发光（钱是自己的了） */
export const Purse: React.FC<{ s?: number; full?: number; glow?: number }> = ({ s = 1, full = 1, glow = 0 }) => {
  const w = 46 + 34 * full, h = 60 + 40 * full;
  return (
    <g transform={`scale(${s})`}>
      {glow > 0 && <circle cy={-h / 2} r={h * 0.9} fill="#F6D57A" opacity={0.4 * Math.min(1, glow)} />}
      <g filter="url(#crayon)">
        <path d={`M ${-w} -10 Q ${-w - 6} ${-h} -18 ${-h - 4} L 18 ${-h - 4} Q ${w + 6} ${-h} ${w} -10 Q 0 8 ${-w} -10 Z`} fill="#B98A55" stroke={L} strokeWidth={4} />
        <path d={`M -24 ${-h - 4} Q 0 ${-h - 20} 24 ${-h - 4}`} fill="none" stroke={L} strokeWidth={5} strokeLinecap="round" />
      </g>
      <circle cy={-h / 2} r={16 + 6 * full} fill={CR.gold} stroke={L} strokeWidth={3} />
    </g>
  );
};

/** 税箱（原点在箱底中心）：上面写“税” */
export const TaxBox: React.FC<{ s?: number; label?: string; coins?: number }> = ({ s = 1, label = "税", coins = 0 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-80, -110, 160, 110, 351)} fill="#8E6A4A" stroke={L} strokeWidth={5} />
      <path d={wrect(-90, -126, 180, 26, 353)} fill="#A8805A" stroke={L} strokeWidth={4} />
      <rect x={-30} y={-122} width={60} height={10} rx={4} fill="#3A2C22" />
    </g>
    {Array.from({ length: Math.min(6, Math.floor(coins)) }).map((_, i) => <circle key={i} cx={-50 + i * 20} cy={-136 - (i % 2) * 10} r={13} fill={CR.gold} stroke={L} strokeWidth={3} />)}
    <rect x={-40} y={-90} width={80} height={60} rx={8} fill="#F4E6C4" stroke={L} strokeWidth={3} />
    <text y={-46} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={C.ink}>{label}</text>
  </g>
);

/** 包税契约（原点在纸中心）：years = 写着的年限，cross = 把年限划掉（0–1），next = 划掉后改写的字，seal = 盖章（0–1），sealText = 章上的字 */
export const Charter: React.FC<{ s?: number; title?: string; years?: string; cross?: number; next?: string; seal?: number; sealText?: string; rot?: number }> = ({ s = 1, title = "包税", years, cross = 0, next, seal = 0, sealText = "不涨", rot = -3 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-130, -160, 260, 320, 361)} fill="#F4E6C4" stroke={L} strokeWidth={4} />
      <path d={wrect(-146, -176, 292, 30, 363)} fill="#D9B98A" stroke={L} strokeWidth={4} />
      <path d={wrect(-146, 146, 292, 30, 365)} fill="#D9B98A" stroke={L} strokeWidth={4} />
      {[0, 1, 2].map((i) => <path key={i} d={`M -90 ${-30 + i * 28} L 90 ${-30 + i * 28}`} stroke="#B8A27A" strokeWidth={3} strokeLinecap="round" />)}
    </g>
    <text y={-78} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={52} fill={C.ink}>{title}</text>
    {years && <text y={86} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={TEAL25} opacity={1 - cross * 0.5}>{years}</text>}
    {cross > 0 && <path d="M -80 72 L 80 72" stroke={C.red} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, cross)} />}
    {next && cross >= 1 && <text y={136} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={C.red}>{next}</text>}
    {seal > 0 && (
      <g transform={`translate(78 -6) rotate(-14) scale(${interpolate(seal, [0, 0.6, 1], [2, 0.92, 1], CL)})`} opacity={Math.min(1, seal * 2)}>
        <circle r={46} fill="none" stroke={C.red} strokeWidth={6} />
        <text y={12} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={32} fill={C.red}>{sealText}</text>
      </g>
    )}
  </g>
);

/** 跷跷板（原点在支点脚下）：tilt = 倾斜角度（正数右边往下），left / right = 两头坐的东西（原点在板面上） */
export const Seesaw: React.FC<{ s?: number; tilt?: number; left?: React.ReactNode; right?: React.ReactNode }> = ({ s = 1, tilt = 0, left, right }) => {
  const arm = 360, r = (tilt * Math.PI) / 180;
  const ly = -Math.sin(r) * arm, ry = Math.sin(r) * arm, lx = -Math.cos(r) * arm, rx = Math.cos(r) * arm;
  return (
    <g transform={`scale(${s})`}>
      <g filter="url(#crayon)">
        <path d={wob([[-70, 0], [0, -120], [70, 0]], 1.5, 371)} fill={CR.wood2} stroke={L} strokeWidth={5} strokeLinejoin="round" />
        <g transform={`translate(0 -126) rotate(${tilt})`}>
          <path d={wrect(-arm - 20, -14, arm * 2 + 40, 28, 373)} fill={CR.wood} stroke={L} strokeWidth={5} />
        </g>
      </g>
      <circle cy={-126} r={14} fill={CR.gold} stroke={L} strokeWidth={4} />
      <g transform={`translate(${lx} ${-140 + ly})`}>{left}</g>
      <g transform={`translate(${rx} ${-140 + ry})`}>{right}</g>
    </g>
  );
};

/** 脚镣锁链（原点在中心）：broken = 断开（0–1，两半往两边弹开） */
export const Chain: React.FC<{ s?: number; broken?: number }> = ({ s = 1, broken = 0 }) => (
  <g transform={`scale(${s})`}>
    {[-1, 1].map((d) => (
      <g key={d} transform={`translate(${d * broken * 60} ${broken * 30}) rotate(${d * broken * 24})`}>
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={d * (24 + i * 44)} cy={0} rx={28} ry={18} fill="none" stroke="#6E6A63" strokeWidth={10} />
        ))}
      </g>
    ))}
    {broken > 0.05 && broken < 0.9 && <g opacity={1 - broken}>{[0, 60, 120, 180, 240, 300].map((a) => <path key={a} d="M 0 0 L 0 -40" transform={`rotate(${a})`} stroke="#F2B84B" strokeWidth={6} strokeLinecap="round" />)}</g>}
  </g>
);

/** 全国议事的大厅（原点在台阶中心）：seats = 坐进去的头像（画面上的 Head 自己叠，这里只画房子），label = 门楣上的字 */
export const Hall: React.FC<{ s?: number; label?: string; door?: number }> = ({ s = 1, label = "全国大会", door = 0 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-300, -30, 600, 30, 381)} fill="#CBB892" stroke={L} strokeWidth={4} />
      <path d={wrect(-260, -300, 520, 270, 383)} fill="#EADCBF" stroke={L} strokeWidth={5} />
      <path d={wob([[-300, -300], [0, -420], [300, -300]], 1.2, 385)} fill="#B9864E" stroke={L} strokeWidth={5} strokeLinejoin="round" />
      {[-200, -100, 100, 200].map((x, i) => <path key={i} d={wrect(x - 18, -290, 36, 260, 387 + i)} fill="#F6EEDC" stroke={L} strokeWidth={4} />)}
      <path d="M -50 -30 L -50 -170 Q 0 -210 50 -170 L 50 -30 Z" fill="#4A3A2E" stroke={L} strokeWidth={4} />
    </g>
    {door < 1 && <path d="M -50 -30 L -50 -170 Q 0 -210 50 -170 L 50 -30 Z" fill="#9A6A44" stroke={L} strokeWidth={4} transform={`translate(-50 0) scale(${1 - door} 1) translate(50 0)`} />}
    <text y={-330} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={C.ink}>{label}</text>
  </g>
);

/** 今天的大城市（原点在地面中心）：n = 楼长出来几栋（0–7），lit = 窗户亮灯 */
export const Skyline: React.FC<{ s?: number; n?: number; lit?: number }> = ({ s = 1, n = 7, lit = 0.6 }) => {
  const B = [[-330, 90, 300], [-220, 110, 420], [-90, 120, 520], [40, 100, 380], [160, 120, 600], [290, 90, 340], [-450, 80, 220]];
  return (
    <g transform={`scale(${s})`}>
      {B.map(([x, w, h], i) => {
        const k = Math.max(0, Math.min(1, n - i));
        if (k <= 0) return null;
        const hh = h * k;
        return (
          <g key={i}>
            <g filter="url(#crayon)"><path d={wrect(x - w / 2, -hh, w, hh, 391 + i)} fill={["#B7C3C9", "#9FB0B8", "#C9C2B2", "#A9B8AE", "#B9AFA4", "#AFC0C6", "#C4BBA8"][i]} stroke={L} strokeWidth={4} /></g>
            {Array.from({ length: Math.floor(hh / 60) }).map((_, r) => [0, 1].map((c) => (
              <rect key={`${r}-${c}`} x={x - w / 2 + 18 + c * (w / 2 - 6)} y={-hh + 22 + r * 60} width={w / 2 - 30} height={30} rx={4} fill={(r + c + i) % 3 < 2 * lit ? "#F6E3A6" : "#7E8C92"} stroke={L} strokeWidth={2} />
            )))}
          </g>
        );
      })}
      <path d="M -520 4 L 400 4" stroke={L} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
    </g>
  );
};

/** 一匹布（原点在布卷底边中心）：fine = 织得多细（0 粗布、1 细布），grain = 布里透出来的麦穗（价钱里有粮食），label = 布上的字 */
export const ClothRoll: React.FC<{ s?: number; fine?: number; grain?: number; label?: string }> = ({ s = 1, fine = 1, grain = 0, label }) => {
  const col = fine > 0.5 ? "#C25B4A" : "#B8A483";
  const lines = 4 + Math.round(fine * 10);
  return (
    <g transform={`scale(${s})`}>
      <g filter="url(#crayon)">
        <path d={wrect(-130, -110, 260, 110, 401)} fill={col} stroke={L} strokeWidth={5} />
        <ellipse cx={130} cy={-55} rx={22} ry={55} fill={fine > 0.5 ? "#9E4136" : "#9C8A6A"} stroke={L} strokeWidth={4} />
      </g>
      {Array.from({ length: lines }).map((_, i) => <path key={i} d={`M ${-124 + (i * 248) / lines} -104 L ${-124 + (i * 248) / lines} -6`} stroke={fine > 0.5 ? "#E8B04A" : "#8E7B5C"} strokeWidth={fine > 0.5 ? 2.5 : 5} opacity={0.7} />)}
      {grain > 0 && (
        <g opacity={Math.min(1, grain)} transform="translate(-20 -55)">
          {[-1, 0, 1].map((d) => <path key={d} d={`M ${d * 30} 30 Q ${d * 30 + 6} -10 ${d * 30} -40`} fill="none" stroke="#F2D27A" strokeWidth={7} strokeLinecap="round" />)}
          {[-1, 0, 1].map((d) => [0, 1, 2].map((j) => <ellipse key={`${d}-${j}`} cx={d * 30 + 8} cy={-30 + j * 18} rx={7} ry={11} fill="#F2D27A" stroke={L} strokeWidth={2} />))}
        </g>
      )}
      {label && <text y={40} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={C.ink}>{label}</text>}
    </g>
  );
};

// ---------------------------------------------------------------- 结论章 / 公式卡
/** 每一步的结论章（画面上的字）：EP25 起放在 TOPS.verdict */
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
export const Formula25: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const rows: [string, string][] = [
    ["起初：城里人又穷，处处交钱", GOLD25],
    ["自由市：税包下来，自己管自己", TEAL25],
    ["城富了：周围的乡下照样可能穷", GREEN25],
  ];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 320, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 30px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>人和钱，为什么往城里跑</span></div>
      {rows.map(([a, c], i) => (
        <div key={i} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
          <span style={{ width: 60, height: 60, borderRadius: 30, background: c, color: C.paper, fontSize: 38, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
          <span style={{ fontSize: 44, color: C.ink }}>{a}</span>
        </div>
      ))}
    </div>
  );
};
