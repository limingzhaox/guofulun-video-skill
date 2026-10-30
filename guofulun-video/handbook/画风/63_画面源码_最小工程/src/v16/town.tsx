// v16 样片 / EP16：书里那个年代的小镇（彩铅手绘风，跟新角色的画风配套）。
// 一条比画面宽的街（世界坐标 0–2000），镜头左右移、推拉；后排一溜铺子，每家门口站一位手艺人。
import React from "react";
import { useCurrentFrame } from "remotion";
import { CR, fuzz, rng, useBoil, wob } from "../cast/crayon";

export const WORLD_W = 2300;
/** 后排铺子门口的地面 y、前排人物脚底 y */
export const ROW_Y = 770;
export const FRONT_Y = 1270;

const L = CR.line;

/** 手绘感的矩形（四边略抖） */
export const wrect = (x: number, y: number, w: number, h: number, seed = 1, j = 2.2) => {
  const r = rng(seed * 17 + 5);
  const J = () => (r() - 0.5) * 2 * j;
  const pts = [[x, y], [x + w / 2, y], [x + w, y], [x + w, y + h / 2], [x + w, y + h], [x + w / 2, y + h], [x, y + h], [x, y + h / 2]];
  return "M " + pts.map(([a, b]) => `${(a + J()).toFixed(1)} ${(b + J()).toFixed(1)}`).join(" L ") + " Z";
};

/** 一条手绘线 */
const Ln: React.FC<{ d: string; w?: number; c?: string; o?: number }> = ({ d, w = 4, c = L, o = 1 }) => (
  <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} />
);

// ---------------------------------------------------------------- 天空、远山、街面
export const SkyHills: React.FC<{ drift?: number }> = ({ drift = 0 }) => {
  const boil = useBoil(6);
  return (
    <g>
      <rect x={-600} y={-1300} width={WORLD_W + 1200} height={2100} fill="url(#skyG)" />
      {[[180, 330, 1.1, 2], [760, 250, 0.8, 5], [1320, 340, 1, 7], [1820, 270, 0.9, 9]].map(([x, y, s, sd], i) => (
        <g key={i} transform={`translate(${x + drift * (0.4 + i * 0.1)} ${y}) scale(${s})`} filter="url(#crayon)">
          <path d={fuzz(0, 0, 120, 40, 12, 0.22, sd, boil)} fill="#FFFFFF" stroke={L} strokeWidth={2.5} opacity={0.92} />
          <path d={fuzz(-30, 14, 70, 18, 9, 0.18, sd + 1, boil)} fill={CR.pink} opacity={0.45} />
        </g>
      ))}
      <g filter="url(#crayon)">
        <path d={wob([[-600, 640], [-200, 520], [250, 590], [700, 500], [1150, 580], [1600, 510], [2050, 590], [2600, 540], [2600, 820], [-600, 820]], 6, 3)} fill="#CFE3C4" stroke={L} strokeWidth={3} />
        <path d={wob([[-600, 700], [0, 640], [500, 690], [980, 630], [1500, 690], [2000, 640], [2600, 690], [2600, 820], [-600, 820]], 6, 4)} fill="#B9D7A6" stroke={L} strokeWidth={3} />
      </g>
    </g>
  );
};

/** 街面：近处石子路（铺满到画面底，字幕区下面也是路） */
export const Street: React.FC = () => {
  const r = rng(21);
  const stones = Array.from({ length: 120 }).map(() => [r() * (WORLD_W + 800) - 400, 830 + Math.pow(r(), 0.8) * 1500, 0.6 + r() * 0.9]);
  return (
    <g>
      <rect x={-600} y={790} width={WORLD_W + 1200} height={2300} fill="#EADBC0" />
      <rect x={-600} y={790} width={WORLD_W + 1200} height={36} fill="#D9C6A2" />
      <g filter="url(#crayon)">
        {stones.map(([x, y, s], i) => {
          const k = 0.5 + (y - 830) / 1500;
          return <path key={i} d={wob([[x - 26 * s * k, y], [x, y - 11 * s * k], [x + 26 * s * k, y], [x, y + 11 * s * k]], 2, i)} fill={i % 3 ? "#DCC9A8" : "#D2BC97"} stroke="#B49C78" strokeWidth={2} />;
        })}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- 后排铺子（招牌只画图标，不写字）
export type ShopKind = "tailor" | "shoe" | "smith" | "butcher" | "gold" | "books" | "fish";
const SHOP_COL: Record<ShopKind, [string, string]> = {
  tailor: ["#F3C9C4", "#C9584B"], shoe: ["#E9D8B6", "#8C5A3C"], smith: ["#D8D2C8", "#5E5A63"],
  butcher: ["#F6E1C9", "#C24A3E"], gold: ["#F4E7B8", "#C7962F"], books: ["#DCE6EE", "#4F77A8"], fish: ["#D7ECEA", "#3F8F8A"],
};

const SignIcon: React.FC<{ kind: ShopKind; t: number }> = ({ kind, t }) => {
  switch (kind) {
    case "tailor": return (<g><path d="M -26 18 L 22 -20" stroke="#8C8C94" strokeWidth={5} strokeLinecap="round" /><circle cx={24} cy={-22} r={4} fill="none" stroke="#8C8C94" strokeWidth={2.5} /><path d="M 24 -22 C 40 -6 -10 0 6 18 C 18 30 -20 30 -10 14" fill="none" stroke={CR.coral} strokeWidth={3} /></g>);
    case "shoe": return (<path d="M -24 -22 L -8 -22 L -6 4 C 6 6 22 8 26 16 L 26 22 L -24 22 Z" fill="#8C5A3C" stroke={L} strokeWidth={3} strokeLinejoin="round" />);
    case "smith": return (<g><path d="M -28 -6 L 22 -6 C 22 4 14 8 6 8 L 6 14 L 14 22 L -14 22 L -6 14 L -6 8 C -18 8 -28 2 -28 -6 Z" fill="#5E5A63" stroke={L} strokeWidth={3} strokeLinejoin="round" /><circle cx={0} cy={-18} r={6 + Math.sin(t * 0.4) * 1.5} fill="#F7A23A" opacity={0.85} /></g>);
    case "butcher": return (<g>{[-16, 0, 16].map((x, i) => <ellipse key={i} cx={x} cy={4 + (i % 2) * 6} rx={9} ry={16} fill="#C24A3E" stroke={L} strokeWidth={2.5} />)}<path d="M -24 -14 L 24 -14" stroke={L} strokeWidth={3} /></g>);
    case "gold": return (<g><circle cx={0} cy={4} r={16} fill="none" stroke="#C7962F" strokeWidth={7} /><path d="M -8 -14 L 0 -26 L 8 -14 Z" fill="#9FD3F0" stroke={L} strokeWidth={2.5} /></g>);
    case "fish": return (<g><path d="M -26 0 Q -4 -20 18 0 Q -4 20 -26 0 Z M 18 0 L 30 -12 L 30 12 Z" fill="#7FB0D8" stroke={L} strokeWidth={3} strokeLinejoin="round" /><circle cx={-14} cy={-3} r={3} fill={L} /></g>);
    case "books": return (<g>{[-18, -4, 10].map((x, i) => <rect key={i} x={x} y={-20 + i * 2} width={12} height={40 - i * 2} fill={["#4F77A8", "#C9584B", "#6DB38A"][i]} stroke={L} strokeWidth={2.5} />)}</g>);
  }
};

/** 橱窗里的货（中心在橱窗中间，约 120×80） */
const WindowGoods: React.FC<{ kind: ShopKind; t: number }> = ({ kind, t }) => {
  switch (kind) {
    case "tailor": return (<g>{[CR.coral, CR.blue, CR.gold, CR.green].map((c, i) => <g key={i}><rect x={-56 + i * 28} y={-6 - (i % 2) * 8} width={24} height={44 + (i % 2) * 8} rx={4} fill={c} stroke={L} strokeWidth={2.5} /><Ln d={`M ${-50 + i * 28} ${4 - (i % 2) * 8} L ${-38 + i * 28} ${4 - (i % 2) * 8}`} w={2} c="#FFFFFF" o={0.7} /></g>)}</g>);
    case "shoe": return (<g>{[-34, 18].map((x, i) => <path key={i} transform={`translate(${x} 10)`} d="M -20 -26 L -6 -26 L -4 2 C 6 4 18 6 22 14 L 22 20 L -20 20 Z" fill={i ? "#B5784D" : "#8C5A3C"} stroke={L} strokeWidth={2.5} strokeLinejoin="round" />)}</g>);
    case "smith": return (<g><path d="M -48 -14 a 18 18 0 1 0 36 0" fill="none" stroke="#5E5A63" strokeWidth={9} strokeLinecap="round" /><path d="M 10 -26 L 40 28 M 24 -26 L 18 28" stroke="#5E5A63" strokeWidth={6} strokeLinecap="round" /><circle cx={-30} cy={20} r={6} fill="#F7A23A" opacity={0.5 + 0.3 * Math.sin(t * 0.3)} /></g>);
    case "butcher": return (<g><Ln d="M -56 -30 L 56 -30" w={3} />{[-40, -16, 8, 32].map((x, i) => <ellipse key={i} cx={x} cy={-4 + (i % 2) * 6} rx={10} ry={22} fill={i % 2 ? "#D9705F" : "#C24A3E"} stroke={L} strokeWidth={2.5} />)}</g>);
    case "gold": return (<g>{[-36, 0, 36].map((x, i) => <circle key={i} cx={x} cy={8} r={13} fill="none" stroke="#C7962F" strokeWidth={6} />)}<path d={`M -4 ${-26 + Math.sin(t * 0.2) * 2} l 4 -8 l 4 8 l -4 8 Z`} fill="#FFF3CF" stroke={L} strokeWidth={2} /></g>);
    case "fish": return (<g>{[-30, 6, 40].map((x, i) => <path key={i} transform={`translate(${x} ${(i % 2) * 14 - 6}) rotate(${i % 2 ? 8 : -8})`} d="M -22 0 Q -2 -14 16 0 Q -2 14 -22 0 Z M 16 0 L 26 -9 L 26 9 Z" fill={i % 2 ? "#9CC4E2" : "#7FB0D8"} stroke={L} strokeWidth={2.5} strokeLinejoin="round" />)}</g>);
    case "books": return (<g>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-50 + i * 20} y={-24 + (i % 3) * 4} width={17} height={50 - (i % 3) * 4} fill={["#4F77A8", "#C9584B", "#6DB38A", "#E8B84A", "#9C86C9"][i]} stroke={L} strokeWidth={2.5} />)}</g>);
  }
};

export const Shop: React.FC<{ x: number; w?: number; kind: ShopKind; seed?: number }> = ({ x, w = 330, kind, seed = 1 }) => {
  const t = useCurrentFrame();
  const [wall, accent] = SHOP_COL[kind];
  const top = ROW_Y - 336, base = ROW_Y - 14;
  const roofY = top - 70;
  const swingA = Math.sin(t * 0.06 + seed) * 3;
  return (
    <g filter="url(#crayon)">
      {/* 屋顶 */}
      <path d={wob([[x - 14, top + 6], [x + w * 0.5, roofY], [x + w + 14, top + 6]], 2.5, seed, 0, true)} fill="#C98B67" stroke={L} strokeWidth={4} strokeLinejoin="round" />
      {[0.25, 0.5, 0.75].map((k, i) => <Ln key={i} d={`M ${x + w * k - 26} ${top - 4} L ${x + w * 0.5} ${roofY + 14}`} w={2.5} c="#9A6248" o={0.6} />)}
      {/* 墙 + 木梁 */}
      <path d={wrect(x, top, w, base - top, seed)} fill={wall} stroke={L} strokeWidth={4} />
      <Ln d={`M ${x} ${top + 92} L ${x + w} ${top + 92}`} w={6} c="#8C6248" />
      <Ln d={`M ${x + 18} ${top} L ${x + 18} ${base} M ${x + w - 18} ${top} L ${x + w - 18} ${base}`} w={6} c="#8C6248" />
      {/* 楼上小窗 */}
      <path d={wrect(x + w * 0.5 - 34, top + 18, 68, 58, seed + 3)} fill="#FBF3DF" stroke={L} strokeWidth={3} />
      <Ln d={`M ${x + w * 0.5} ${top + 18} L ${x + w * 0.5} ${top + 76} M ${x + w * 0.5 - 34} ${top + 47} L ${x + w * 0.5 + 34} ${top + 47}`} w={2.5} />
      {/* 条纹雨棚 */}
      <path d={wob([[x + 26, top + 104], [x + w - 26, top + 104], [x + w - 6, top + 150], [x + 6, top + 150]], 1.5, seed + 5)} fill={accent} stroke={L} strokeWidth={3.5} strokeLinejoin="round" />
      {Array.from({ length: 6 }).map((_, i) => {
        const sx = x + 26 + ((w - 52) / 6) * i;
        return i % 2 ? <path key={i} d={`M ${sx} ${top + 104} L ${sx + (w - 52) / 6} ${top + 104} L ${sx + (w - 52) / 6 + 4} ${top + 150} L ${sx + 4} ${top + 150} Z`} fill="#FBF6EC" opacity={0.85} /> : null;
      })}
      {/* 橱窗（摆着这家卖的东西）+ 门 */}
      <path d={wrect(x + 34, top + 168, w * 0.42, 96, seed + 7)} fill="#FFF8E8" stroke={L} strokeWidth={3} />
      <g transform={`translate(${x + 34 + w * 0.21} ${top + 216})`}><WindowGoods kind={kind} t={t} /></g>
      <path d={wrect(x + w - 34 - w * 0.3, top + 162, w * 0.3, base - top - 162, seed + 9)} fill="#A9784F" stroke={L} strokeWidth={3.5} />
      <circle cx={x + w - 34 - w * 0.3 + 14} cy={top + 250} r={4} fill={CR.gold} stroke={L} strokeWidth={1.5} />
      {/* 挂出来的招牌，轻轻晃 */}
      <g transform={`translate(${x + w * 0.27} ${top + 120}) rotate(${swingA})`}>
        <Ln d="M -26 -40 L -26 -18 M 26 -40 L 26 -18" w={2.5} />
        <path d={wrect(-44, -20, 88, 74, seed + 11)} fill="#FBF6EC" stroke={L} strokeWidth={3.5} />
        <g transform="translate(0 17) scale(0.9)"><SignIcon kind={kind} t={t} /></g>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- 织机（梭子来回、布卷慢慢变粗）
export const Loom: React.FC<{ x: number; y?: number; s?: number; run?: boolean; cloth?: number }> = ({ x, y = FRONT_Y, s = 1, run = true, cloth = 0.3 }) => {
  const t = useCurrentFrame();
  const cyc = 26;
  const ph = run ? (t % cyc) / cyc : 0;
  const dir = Math.floor(t / cyc) % 2 ? -1 : 1;
  const shuttleX = run ? (dir > 0 ? -110 + 220 * ph : 110 - 220 * ph) : 0;
  const heddle = run ? Math.sin((t / cyc) * Math.PI) * 10 : 0;
  const rollR = 20 + cloth * 26;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#crayon)">
      <ellipse cx={0} cy={4} rx={190} ry={16} fill="rgba(80,58,38,0.16)" />
      {/* 两根立柱 + 顶梁 */}
      <path d={wrect(-170, -360, 26, 360, 2)} fill={CR.wood} stroke={L} strokeWidth={4} />
      <path d={wrect(144, -360, 26, 360, 3)} fill={CR.wood} stroke={L} strokeWidth={4} />
      <path d={wrect(-184, -380, 368, 30, 4)} fill={CR.wood2} stroke={L} strokeWidth={4} />
      {/* 经线 */}
      {Array.from({ length: 15 }).map((_, i) => <Ln key={i} d={`M ${-120 + i * 17} -330 L ${-120 + i * 17} -150`} w={3} c="#8C7458" />)}
      {/* 正在织的一段（彩色纬线一层层往上） */}
      {Array.from({ length: 4 }).map((_, i) => <Ln key={`w${i}`} d={`M -124 ${-156 - i * 8} L 124 ${-156 - i * 8}`} w={6} c={[CR.coral, CR.gold, CR.blue, CR.coral][i]} o={0.85} />)}
      {/* 综框（上下动） */}
      <g transform={`translate(0 ${heddle})`}>
        <path d={wrect(-136, -300, 272, 16, 5)} fill={CR.wood2} stroke={L} strokeWidth={3} />
        <path d={wrect(-136, -228, 272, 16, 6)} fill={CR.wood2} stroke={L} strokeWidth={3} />
      </g>
      {/* 已经织好的布 */}
      <path d={wrect(-124, -150, 248, 70, 7)} fill="#F4EAD5" stroke={L} strokeWidth={3} />
      {[0, 1, 2].map((i) => <Ln key={i} d={`M -124 ${-136 + i * 22} L 124 ${-136 + i * 22}`} w={5} c={CR.blue} o={0.55} />)}
      {/* 梭子 */}
      <g transform={`translate(${shuttleX} -170)`}>
        <path d="M -36 0 Q 0 -14 36 0 Q 0 14 -36 0 Z" fill="#C88A55" stroke={L} strokeWidth={3} />
        <ellipse cx={0} cy={0} rx={8} ry={4} fill={CR.cream} stroke={L} strokeWidth={1.5} />
      </g>
      {/* 胸梁 + 布卷 */}
      <path d={wrect(-184, -84, 368, 24, 8)} fill={CR.wood2} stroke={L} strokeWidth={4} />
      <circle cx={0} cy={-34} r={rollR} fill="#F4EAD5" stroke={L} strokeWidth={3.5} />
      <circle cx={0} cy={-34} r={rollR * 0.55} fill="none" stroke={CR.blue} strokeWidth={4} opacity={0.5} />
      <Ln d="M -150 0 L -150 -84 M 150 0 L 150 -84" w={10} c={CR.wood} />
    </g>
  );
};

/** 一筐纱团 */
export const YarnBasket: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = FRONT_Y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#crayon)">
    {[[-34, -78, CR.coral], [8, -88, CR.blue], [44, -76, CR.gold], [-6, -64, CR.purple]].map(([cx, cy, c], i) => (
      <g key={i}><circle cx={cx as number} cy={cy as number} r={26} fill={c as string} stroke={L} strokeWidth={3} />
        <Ln d={`M ${(cx as number) - 18} ${(cy as number) - 8} Q ${cx} ${(cy as number) + 10} ${(cx as number) + 18} ${(cy as number) - 6}`} w={2} c="#FFFFFF" o={0.6} /></g>
    ))}
    <path d={wob([[-76, -60], [76, -60], [62, 0], [-62, 0]], 2, 31)} fill="#D6A867" stroke={L} strokeWidth={4} strokeLinejoin="round" />
    {[-40, -14, 12, 38].map((xx, i) => <Ln key={i} d={`M ${xx} -58 L ${xx * 0.84} -2`} w={2.5} c="#A9783F" />)}
  </g>
);

/** 粮仓（门开着，里面码着麻袋） */
export const Granary: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = FRONT_Y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#crayon)">
    <path d={wob([[-230, -360], [0, -520], [230, -360]], 3, 41)} fill="#B36A4E" stroke={L} strokeWidth={5} strokeLinejoin="round" />
    <path d={wrect(-210, -370, 420, 370, 42)} fill="#E7D3AE" stroke={L} strokeWidth={5} />
    {[-150, -75, 0, 75, 150].map((xx, i) => <Ln key={i} d={`M ${xx} -366 L ${xx} -4`} w={2.5} c="#C2A57A" />)}
    <path d={wrect(-110, -250, 220, 250, 43)} fill="#5A4031" stroke={L} strokeWidth={4} />
    {[[-58, -40], [0, -44], [58, -40], [-30, -110], [30, -112], [0, -176]].map(([sx, sy], i) => (
      <g key={i} transform={`translate(${sx} ${sy})`}>
        <path d={wob([[-34, 30], [-30, -18], [-12, -34], [12, -34], [30, -18], [34, 30]], 2, 50 + i)} fill="#E9D6A6" stroke={L} strokeWidth={3} />
        <Ln d="M -10 -30 L 10 -30" w={3} c="#A9783F" />
      </g>
    ))}
    <path d={wrect(-40, -330, 80, 56, 44)} fill="#FBF3DF" stroke={L} strokeWidth={3} />
  </g>
);

/** 门口一袋粮（可以单独拎出来放大、贴标签） */
export const Sack: React.FC<{ x: number; y?: number; s?: number; seed?: number }> = ({ x, y = FRONT_Y, s = 1, seed = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#crayon)">
    <path d={wob([[-52, 0], [-48, -70], [-24, -100], [24, -100], [48, -70], [52, 0]], 2.5, 60 + seed)} fill="#E9D6A6" stroke={L} strokeWidth={4} />
    <Ln d="M -18 -94 Q 0 -86 18 -94" w={4} c="#A9783F" />
    {/* 麦穗记号 */}
    <g transform="translate(0 -44)">
      <Ln d="M 0 22 L 0 -22" w={3} c="#B08A3E" />
      {[-14, -4, 6].map((yy, i) => <g key={i}><ellipse cx={-7} cy={yy} rx={6} ry={3.5} transform={`rotate(-35 -7 ${yy})`} fill={CR.gold} stroke={L} strokeWidth={1.5} /><ellipse cx={7} cy={yy} rx={6} ry={3.5} transform={`rotate(35 7 ${yy})`} fill={CR.gold} stroke={L} strokeWidth={1.5} /></g>)}
    </g>
  </g>
);

/** 盆花、木箱这些零碎，让街上不空 */
export const FlowerPot: React.FC<{ x: number; y?: number; s?: number; c?: string }> = ({ x, y = FRONT_Y, s = 1, c = CR.coral }) => {
  const t = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#crayon)">
      <g transform={`rotate(${Math.sin(t * 0.05 + x) * 2} 0 -40)`}>
        <Ln d="M 0 -40 L -6 -96 M 0 -40 L 10 -88 M 0 -40 L 0 -110" w={4} c={CR.leaf2} />
        {[[-6, -100], [12, -92], [0, -116]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r={13} fill={c} stroke={L} strokeWidth={2.5} />)}
        {[[-6, -100], [12, -92], [0, -116]].map(([fx, fy], i) => <circle key={`c${i}`} cx={fx} cy={fy} r={4.5} fill={CR.goldHi} />)}
      </g>
      <path d={wob([[-34, -46], [34, -46], [26, 0], [-26, 0]], 1.5, x)} fill="#C77B55" stroke={L} strokeWidth={3.5} />
    </g>
  );
};

export const Crate: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = FRONT_Y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#crayon)">
    <path d={wrect(-60, -84, 120, 84, x)} fill={CR.wood} stroke={L} strokeWidth={4} />
    <Ln d="M -60 -42 L 60 -42 M -56 -80 L 56 -4 M 56 -80 L -56 -4" w={3} c={CR.wood2} />
  </g>
);

/** 画面最前面一溜花丛、草、矮木栅（字幕下面那块街不空，也拉出前后景深） */
export const Foreground: React.FC<{ y?: number }> = ({ y = FRONT_Y + 300 }) => {
  const t = useCurrentFrame();
  const r = rng(77);
  const bushes = Array.from({ length: 16 }).map((_, i) => [-300 + i * 170 + r() * 60, y + r() * 120, 0.8 + r() * 0.5]);
  const cols = [CR.coral, CR.gold, CR.purple, CR.pink, "#FFFFFF"];
  return (
    <g filter="url(#crayon)">
      {/* 矮木栅 */}
      {Array.from({ length: 30 }).map((_, i) => <path key={`p${i}`} d={wrect(-400 + i * 100, y - 110, 26, 120, i)} fill={CR.wood} stroke={L} strokeWidth={3.5} />)}
      <path d={wrect(-400, y - 92, WORLD_W + 800, 18, 3)} fill={CR.wood2} stroke={L} strokeWidth={3.5} />
      <path d={wrect(-400, y - 46, WORLD_W + 800, 18, 4)} fill={CR.wood2} stroke={L} strokeWidth={3.5} />
      {bushes.map(([x, by, s], i) => (
        <g key={i} transform={`translate(${x} ${by}) scale(${s})`}>
          <path d={fuzz(0, 0, 110, 60, 11, 0.25, i + 3, 0)} fill={i % 2 ? CR.leaf : CR.leaf2} stroke={L} strokeWidth={4} />
          {Array.from({ length: 5 }).map((_, j) => {
            const a = j * 1.3 + i;
            const fx = Math.cos(a) * 60, fy = -10 + Math.sin(a) * 26 + Math.sin(t * 0.06 + i + j) * 2;
            return <g key={j}><circle cx={fx} cy={fy} r={13} fill={cols[(i + j) % cols.length]} stroke={L} strokeWidth={2.5} /><circle cx={fx} cy={fy} r={4.5} fill={CR.goldHi} /></g>;
          })}
        </g>
      ))}
    </g>
  );
};

/** 彩旗串（挂在两家铺子之间） */
export const Bunting: React.FC<{ x1: number; x2: number; y: number; sag?: number }> = ({ x1, x2, y, sag = 40 }) => {
  const t = useCurrentFrame();
  const n = 9;
  const cols = [CR.coral, CR.gold, CR.blue, CR.green, CR.purple];
  return (
    <g filter="url(#crayon)">
      <Ln d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`} w={2.5} />
      {Array.from({ length: n }).map((_, i) => {
        const k = (i + 0.5) / n;
        const px = x1 + (x2 - x1) * k;
        const py = y + sag * 2 * 2 * k * (1 - k);
        const sw = Math.sin(t * 0.08 + i) * 6;
        return <path key={i} d={`M ${px - 14} ${py} L ${px + 14} ${py} L ${px + sw * 0.3} ${py + 30} Z`} fill={cols[i % cols.length]} stroke={L} strokeWidth={2} />;
      })}
    </g>
  );
};


