// EP19（第二篇第2章下：空中的车道）专用：三件事的配色、抽屉里的死本钱、金币大路、空中的纸车道、麦田、防火墙、带面额的钞票、天平、结论章、公式卡。
// 金币、钞票、保险柜、银行、红章、借条、水塘、横条这些从 `../ep18/world`（它又带上了 EP17 和 v16/stage 的通用部件）拿。
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CR, fuzz } from "../cast/crayon";
import { wrect } from "../v16/town";
import { C, SERIF } from "../kit";
import { CoinStack, Guinea } from "../ep17/world";

export * from "../ep18/world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const L = CR.line;

/** 颜色编码：第一件（银行帮了什么）赭金、第二件（小钞票要管）墨青、第三件（一张纸值多少）橄榄绿 */
const GOLD19 = "#C3923F", TEAL19 = "#3F6E73", GREEN19 = "#5E7F4A";
export const PARTS = [
  { n: "①", short: "银行帮了什么", col: GOLD19 },
  { n: "②", short: "小钞票要管", col: TEAL19 },
  { n: "③", short: "一张纸值多少", col: GREEN19 },
];

// ---------------------------------------------------------------- 抽屉里的死本钱
/** 拉开的抽屉，里面躺着几摞金币；sleep = 头顶“Zz”的程度。原点在柜子底部中心 */
export const Drawer: React.FC<{ s?: number; t?: number; sleep?: number; coins?: number }> = ({ s = 1, t = 0, sleep = 1, coins = 1 }) => (
  <g transform={`scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-170, -260, 340, 260, 211, 2)} fill={CR.wood} stroke={L} strokeWidth={5} />
      <path d={wrect(-150, -240, 300, 90, 212, 1.5)} fill={CR.wood2} stroke={L} strokeWidth={4} />
      <circle cx={0} cy={-195} r={9} fill={CR.gold} stroke={L} strokeWidth={3} />
      {/* 拉出来的抽屉 */}
      <path d="M -150 -130 L 150 -130 L 190 -60 L -190 -60 Z" fill="#D8B88E" stroke={L} strokeWidth={4} strokeLinejoin="round" />
      <path d={wrect(-190, -60, 380, 70, 213, 1.5)} fill={CR.wood} stroke={L} strokeWidth={5} />
      <circle cx={0} cy={-25} r={10} fill={CR.gold} stroke={L} strokeWidth={3} />
    </g>
    {coins > 0 && [-90, -20, 50, 110].map((x, i) => <g key={i} transform={`translate(${x} ${-78 - (i % 2) * 6}) scale(${0.62 * coins})`}><CoinStack n={2 + (i % 2)} /></g>)}
    {sleep > 0 && [0, 1, 2].map((i) => (
      <text key={i} x={120 + i * 34} y={-170 - i * 40 - ((t / 2) % 20)} fontFamily={SERIF} fontWeight={900} fontSize={34 + i * 8} fill={C.ink2} opacity={sleep * (0.8 - i * 0.15)}>Z</text>
    ))}
  </g>
);

// ---------------------------------------------------------------- 金币大路 → 麦田
/** 一片麦田（原点在左下角）：w 宽、h 高，k = 长出来的程度，t = 帧号（随风晃） */
export const Wheat: React.FC<{ w: number; h?: number; k?: number; t?: number }> = ({ w, h = 110, k = 1, t = 0 }) => {
  const n = Math.floor(w / 26);
  return (
    <g>
      <path d={`M 0 0 L ${w} 0 L ${w} ${-h * 0.35} L 0 ${-h * 0.35} Z`} fill="#C9B26A" opacity={0.6 * k} />
      {Array.from({ length: n }).map((_, i) => {
        const x = 13 + i * 26, sway = Math.sin(t * 0.08 + i * 0.7) * 6;
        const hh = h * k * (0.8 + ((i * 37) % 10) / 50);
        if (hh <= 2) return null;
        return (
          <g key={i}>
            <path d={`M ${x} 0 Q ${x + sway * 0.5} ${-hh * 0.5} ${x + sway} ${-hh}`} stroke="#9C8A3E" strokeWidth={3.5} fill="none" />
            <ellipse cx={x + sway} cy={-hh - 10} rx={7} ry={15} fill="#E2C25E" stroke={L} strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
};

/**
 * 金币铺的大路（原点在路中心）：把粮食运去市场，自己一根草也不长。
 * field = 大路改成麦田的程度（0–1，从左往右铺开）；carts = 路上有没有运粮的小车；t = 帧号
 */
export const Highway: React.FC<{ w?: number; t?: number; field?: number; carts?: boolean }> = ({ w = 1100, t = 0, field = 0, carts = true }) => {
  const x0 = -w / 2;
  return (
    <g>
      <g filter="url(#crayon)">
        <path d={`M ${x0} -70 L ${-x0} -70 L ${-x0} 70 L ${x0} 70 Z`} fill="#CDB48A" />
        <path d={`M ${x0} -46 L ${-x0} -46 L ${-x0} 46 L ${x0} 46 Z`} fill="#E8C877" stroke={L} strokeWidth={4} />
      </g>
      {/* 路面上压着一枚枚金币 */}
      {Array.from({ length: Math.floor(w / 70) }).map((_, i) => (
        <circle key={i} cx={x0 + 35 + i * 70} cy={(i % 2) * 22 - 11} r={14} fill={CR.gold} stroke="#B9862E" strokeWidth={3} opacity={0.9} />
      ))}
      {/* 运粮的小车 */}
      {carts && field < 1 && [0, 1].map((i) => {
        const x = x0 + (((t * 3 + i * w / 2) % w));
        return (
          <g key={i} transform={`translate(${x} -40)`} opacity={1 - field}>
            <g filter="url(#crayon)">
              <path d="M -60 -50 L 60 -50 L 52 0 L -52 0 Z" fill={CR.wood} stroke={L} strokeWidth={4} />
              {[-30, 0, 30].map((sx) => <path key={sx} d={`M ${sx - 18} -50 Q ${sx} -86 ${sx + 18} -50 Z`} fill="#E9D6A6" stroke={L} strokeWidth={3} />)}
              {[-36, 36].map((wx) => <g key={wx} transform={`translate(${wx} 6) rotate(${t * 5})`}><circle r={16} fill="#FFFBF0" stroke={L} strokeWidth={4} /><path d="M -14 0 L 14 0 M 0 -14 L 0 14" stroke={L} strokeWidth={3} /></g>)}
            </g>
          </g>
        );
      })}
      {/* 改成麦田：从左往右铺开 */}
      {field > 0 && (
        <g>
          <clipPath id="hwField"><rect x={x0} y={-200} width={w * field} height={280} /></clipPath>
          <g clipPath="url(#hwField)">
            <path d={`M ${x0} -70 L ${-x0} -70 L ${-x0} 70 L ${x0} 70 Z`} fill="#B9C98A" />
            <g transform={`translate(${x0} 60)`}><Wheat w={w} h={120} t={t} /></g>
          </g>
        </g>
      )}
    </g>
  );
};

/**
 * 空中的车道：一条用钞票铺成、挂在云上的路（原点在路中心）；一辆装满钞票的小车在上面跑。
 * k = 出现程度，wobble = 晃动（纸翅膀不如硬地稳），t = 帧号
 */
export const SkyWay: React.FC<{ w?: number; t?: number; k?: number; wobble?: number }> = ({ w = 900, t = 0, k = 1, wobble = 0 }) => {
  if (k <= 0) return null;
  const n = 9, x0 = -w / 2, step = w / n;
  const sag = (x: number) => 60 * (1 - Math.pow((2 * x) / w, 2));
  const cartX = x0 + ((t * 4) % w);
  return (
    <g opacity={Math.min(1, k * 1.4)} transform={`scale(${interpolate(k, [0, 1], [0.9, 1], CL)})`}>
      {/* 两头挂在云上 */}
      {[x0 - 40, -x0 + 40].map((cx, i) => (
        <g key={i} filter="url(#crayon)">
          <path d={fuzz(cx, -40, 110, 50, 10, 0.25, 5 + i, 0)} fill="#FFFDF7" stroke={L} strokeWidth={4} />
        </g>
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + step * i + step / 2;
        const y = sag(x) + Math.sin(t * 0.25 + i) * 10 * wobble;
        const rot = Math.sin(t * 0.3 + i * 1.3) * 9 * wobble;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#crayon)">
            <path d={wrect(-step / 2 - 2, -16, step + 4, 32, 220 + i, 1.2)} fill="#FBF4E2" stroke={L} strokeWidth={3} />
            <rect x={-step / 2 + 6} y={-9} width={step - 12} height={18} rx={4} fill="none" stroke={TEAL19} strokeWidth={3} />
          </g>
        );
      })}
      {/* 跑在上面的钞票小车 */}
      <g transform={`translate(${cartX} ${sag(cartX) - 40 + Math.sin(t * 0.25) * 8 * wobble})`}>
        <g filter="url(#crayon)">
          <path d="M -48 -36 L 48 -36 L 42 0 L -42 0 Z" fill="#FBF4E2" stroke={L} strokeWidth={4} />
          <rect x={-36} y={-30} width={72} height={22} rx={4} fill="none" stroke={TEAL19} strokeWidth={3} />
          {[-28, 28].map((wx) => <circle key={wx} cx={wx} cy={6} r={12} fill="#FFFBF0" stroke={L} strokeWidth={3.5} />)}
        </g>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- 带面额的钞票
/** 一张钞票，面额写在左边（如“£10”“6便士”），fine = 底下一行小字（如“董事可拖半年”）；原点在中心 */
export const DenomNote: React.FC<{ s?: number; rot?: number; label: string; fine?: string; dim?: number; col?: string }> = ({ s = 1, rot = 0, label, fine, dim = 0, col = TEAL19 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <g filter="url(#crayon)">
      <path d={wrect(-110, -60, 220, 120, 231, 1.5)} fill="rgba(62,42,32,0.12)" transform="translate(7 8)" />
      <path d={wrect(-110, -60, 220, 120, 231, 1.5)} fill="#FBF4E2" stroke={L} strokeWidth={3.5} />
      <rect x={-98} y={-48} width={196} height={96} rx={8} fill="none" stroke={col} strokeWidth={4} />
      <circle cx={70} cy={-6} r={18} fill="none" stroke={CR.coral} strokeWidth={3} />
    </g>
    <text x={-30} y={label.length > 3 ? 8 : 14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={label.length > 3 ? 32 : 44} fill={col}>{label}</text>
    {fine && <text x={0} y={42} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={17} fill={C.red}>{fine}</text>}
    {dim > 0 && <rect x={-112} y={-62} width={224} height={124} rx={10} fill={C.ink} opacity={dim} />}
  </g>
);

// ---------------------------------------------------------------- 防火墙
/** 两栋房子中间一道砖墙；fire = 左边房子冒火的程度，wall = 墙砌起来的程度，t = 帧号。原点在地面中心 */
export const FireWall: React.FC<{ s?: number; t?: number; fire?: number; wall?: number }> = ({ s = 1, t = 0, fire = 1, wall = 1 }) => {
  const house = (x: number, roof: string, seed: number) => (
    <g transform={`translate(${x} 0)`} filter="url(#crayon)">
      <path d={wrect(-130, -220, 260, 220, seed, 2)} fill="#E9DFCB" stroke={L} strokeWidth={5} />
      <path d="M -155 -218 L 0 -330 L 155 -218 Z" fill={roof} stroke={L} strokeWidth={5} strokeLinejoin="round" />
      <path d={wrect(-30, -110, 60, 110, seed + 1, 1.5)} fill="#8A5A3A" stroke={L} strokeWidth={4} />
      <path d={wrect(-100, -180, 50, 46, seed + 2, 1.5)} fill="#F7EFD0" stroke={L} strokeWidth={4} />
    </g>
  );
  const wh = 360 * wall;
  return (
    <g transform={`scale(${s})`}>
      {house(-200, "#B5654A", 241)}
      {house(200, "#7F9AA6", 244)}
      {/* 左边房子冒火 */}
      {fire > 0 && (
        <g transform="translate(-200 -330)" opacity={fire}>
          <path d={fuzz(0, -20 - Math.sin(t * 0.4) * 6, 70, 60, 9, 0.35, Math.floor(t / 3) % 5, 0)} fill="#F7A23A" />
          <path d={fuzz(0, -14, 36, 34, 8, 0.35, Math.floor(t / 3) % 4 + 7, 0)} fill="#FFE08A" />
        </g>
      )}
      {/* 中间的砖墙：从地面往上砌 */}
      {wall > 0 && (
        <g filter="url(#crayon)">
          <path d={`M -34 0 L 34 0 L 34 ${-wh} L -34 ${-wh} Z`} fill="#B86B50" stroke={L} strokeWidth={4} />
          {Array.from({ length: Math.floor(wh / 30) }).map((_, i) => (
            <path key={i} d={`M -34 ${-30 * (i + 1)} L 34 ${-30 * (i + 1)} M ${i % 2 ? -10 : 10} ${-30 * i} L ${i % 2 ? -10 : 10} ${-30 * (i + 1)}`} stroke="#8E4A36" strokeWidth={2.5} />
          ))}
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- 天平
/** 天平（原点在底座中心）：tilt = 横梁倾斜角度（正 = 左边重），left / right = 两个盘里放的东西 */
export const Balance: React.FC<{ s?: number; tilt?: number; left?: React.ReactNode; right?: React.ReactNode }> = ({ s = 1, tilt = 0, left, right }) => {
  const r = (tilt * Math.PI) / 180, arm = 230;
  const ly = Math.sin(r) * arm, ry = -Math.sin(r) * arm;
  const pan = (x: number, y: number, child: React.ReactNode) => (
    <g transform={`translate(${x} ${y - 330})`}>
      <path d="M 0 0 L -90 150 M 0 0 L 90 150" stroke={L} strokeWidth={3} />
      <g filter="url(#crayon)"><path d="M -110 150 Q 0 200 110 150 Z" fill="#D8C7A6" stroke={L} strokeWidth={4} /></g>
      <g transform="translate(0 145)">{child}</g>
    </g>
  );
  return (
    <g transform={`scale(${s})`}>
      <g filter="url(#crayon)">
        <path d={wrect(-90, -30, 180, 30, 251, 2)} fill={CR.wood2} stroke={L} strokeWidth={4} />
        <path d="M 0 -30 L 0 -330" stroke={CR.wood2} strokeWidth={16} strokeLinecap="round" />
        <path d={`M ${-arm} ${-330 + ly} L ${arm} ${-330 + ry}`} stroke={L} strokeWidth={10} strokeLinecap="round" />
        <circle cx={0} cy={-330} r={14} fill={CR.gold} stroke={L} strokeWidth={4} />
      </g>
      {pan(-arm, ly, left)}
      {pan(arm, ry, right)}
    </g>
  );
};

/** 一堆金币（天平右盘用）：n 枚，k = 一枚枚弹出来的进度（0–n） */
export const CoinPile: React.FC<{ n: number; k?: number }> = ({ n, k = n }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const on = Math.max(0, Math.min(1, k - i));
      if (on <= 0) return null;
      const x = -66 + (i % 5) * 33, y = -18 - Math.floor(i / 5) * 30;
      return <g key={i} transform={`translate(${x} ${y}) scale(${0.42 * on})`}><Guinea /></g>;
    })}
  </g>
);

// ---------------------------------------------------------------- 结论章 / 公式卡
/** “第 X 件的结论”：上面一行小字，下面一块彩色印章大字（画面坐标），样子同 EP17、EP18 */
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

/** 结尾公式卡：标题条 + 3 行大字（一件一行，以书里的说法开头），旁白念完只停 2–3 秒（10-28 起） */
export const Formula19: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const rows: [string, string][] = [
    ["空中的车道：死本钱变活钱", GOLD19],
    ["防火墙：钞票别小于五镑", TEAL19],
    ["见票即付：靠得住、随时兑才值钱", GREEN19],
  ];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 360, opacity: k, scale: String(interpolate(k, [0, 1], [0.94, 1])), background: "#FBF7EF", border: `6px solid ${C.ink}`, borderRadius: 28, padding: "44px 34px 44px", boxShadow: `14px 14px 0 ${C.red}`, fontFamily: SERIF, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: C.red, color: C.paper, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: "0.06em" }}>书里说纸币的三句话</span></div>
      {rows.map(([a, c], i) => (
        <div key={i} style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap" }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, background: c, color: C.paper, fontSize: 40, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
          <span style={{ fontSize: 52, color: C.ink }}>{a}</span>
        </div>
      ))}
    </div>
  );
};
