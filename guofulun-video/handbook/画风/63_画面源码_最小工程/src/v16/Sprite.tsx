// v16 新角色（用户用别的 AI 画的彩铅设定图，2026-10-24）：把设定图拆出来的单视角透明图当“纸偶”来演。
// 素材：public/cast/v16/<角色>_<视角>.png（cut_v16.py 拆图抠图，原图不动）；眼睛、嘴的位置在 anchors.json。
// 能做：呼吸、眨眼（盖一层同色眼皮）、说话张嘴（按 TTS 逐字）、走路颠步、跳一下、点头、摇头、吓一跳、转身换视角、脸红、头顶符号。
// 做不到：抬手、指东西、换表情——设定图里没有这些姿势，要另外出图。
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import anchorsJson from "../../public/cast/v16/anchors.json";
import manifest from "../../public/cast/v16/manifest.json";
import { HAND } from "../cast/crayon";

export type View = "front" | "tq_r" | "pr_r" | "back" | "pr_l" | "tq_l";
type Eye = { x: number; y: number; w: number; h: number; skin?: string };
type MouthA = { x: number; y: number; w: number; bg?: string };
type Anchor = { w: number; h: number; eyes: Eye[]; mouth?: MouthA; skin?: string };
const A = anchorsJson as unknown as Record<string, Anchor>;
const SIZE: Record<string, [number, number]> = {};

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 猫狗眼睛太大，盖眼皮会穿帮：不眨眼，只靠身体动作 */
const NO_BLINK = new Set(["cat", "dog"]);

/** 角色 + 视角 → 图片名。女主正面用用户确认过的单人基准图锁脸；狗正面用没改过的双宠图右半 */
export const spriteName = (id: string, view: View) => {
  if (id === "female" && view === "front") return "female_front_base";
  return `${id}_${view}`;
};

/** 图片原始宽高（anchors 里没有的背面图，按拆图清单补） */
for (const [k, v] of Object.entries(manifest as Record<string, { w: number; h: number }>)) SIZE[k] = [v.w, v.h];

/** 可复现的 0–1 伪随机 */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** 第 f 帧眼睛闭上多少（0 睁开，1 全闭）：每 2.5–4.5 秒眨一次，偶尔连眨两下 */
const blinkAt = (f: number, seed: number) => {
  let t = 18 + Math.floor(hash(seed) * 50);
  let i = 0;
  while (t <= f + 1) {
    const d = f - t;
    if (d >= 0 && d < 6) return [0.55, 1, 1, 0.65, 0.25, 0][d];
    const dbl = hash(seed * 3 + i) < 0.18;
    t += dbl ? 9 : 75 + Math.floor(hash(seed * 7 + i * 13) * 60);
    i++;
  }
  return 0;
};

/** [[帧, 值], …] 线性插值（位置、视角切换都用它） */
const track = (f: number, v: number | [number, number][]) => {
  if (typeof v === "number") return v;
  if (v.length === 1) return v[0][1];
  return interpolate(f, v.map((p) => p[0]), v.map((p) => p[1]), CL);
};

export type SpriteProps = {
  id: string;
  /** 固定视角，或 [[从第几帧起, 视角], …]（切换时有 6 帧压扁回弹，像转身） */
  view?: View | [number, View][];
  x: number | [number, number][];
  /** 脚底 y */
  y: number | [number, number][];
  /** 画面上的身高（px） */
  h: number;
  /** 张嘴程度 0–1（useTalk 给的） */
  talk?: number;
  seed?: number;
  /** 走路的帧段 [起, 止]：一颠一颠 */
  walk?: [number, number][];
  hops?: number[];
  nods?: number[];
  shakes?: number[];
  /** 吓一跳：往后一缩再弹起来 */
  jolts?: number[];
  /** 脸红 0–1 */
  blush?: number;
  o?: number;
  shadow?: boolean;
  /** 额外倾斜（度），比如歪头想事情 */
  tilt?: number;
};

/** 当前视角 + 离上一次切换过了几帧 + 离下一次切换还有几帧 */
const viewAt = (f: number, v: SpriteProps["view"]): [View, number, number] => {
  if (!v) return ["front", 99, 99];
  if (typeof v === "string") return [v, 99, 99];
  let cur = v[0][1], since = 99, next = 99;
  for (const [k, vv] of v) {
    if (k <= f) { cur = vv; since = f - k; } else { next = Math.min(next, k - f); }
  }
  return [cur, since, next];
};

export const Sprite: React.FC<SpriteProps> = (p) => {
  const f = useCurrentFrame();
  const seed = p.seed ?? 1;
  const [view, since, next] = viewAt(f, p.view);
  const name = spriteName(p.id, view);
  const [W, H] = SIZE[name] ?? [300, 500];
  const h = p.h;
  const w = (h * W) / H;
  let x = track(f, p.x);
  let y = track(f, p.y);
  let sx = 1, sy = 1, rot = p.tilt ?? 0, lift = 0;

  // 呼吸
  const br = Math.sin(f * 0.105 + seed * 1.7);
  sy *= 1 + 0.012 * br;
  sx *= 1 - 0.005 * br;

  // 转身：切换前 3 帧压扁，切换后 6 帧回弹
  if (since < 6) sx *= interpolate(since, [0, 3, 6], [0.8, 1.05, 1]);
  else if (next <= 3) sx *= interpolate(3 - next, [0, 3], [1, 0.82]);

  // 走路：颠步 + 左右轻摆
  for (const [a, b] of p.walk ?? []) {
    if (f >= a && f <= b) {
      const ph = (f - a) * 0.45;
      const s = Math.abs(Math.sin(ph));
      lift += s * h * 0.035;
      rot += Math.sin(ph) * 3;
      sy *= 1 - 0.03 * (1 - s);
    }
  }
  // 跳一下：预备下蹲 → 腾空拉长 → 落地压扁
  for (const a of p.hops ?? []) {
    const t = f - a;
    if (t < 0 || t >= 17) continue;
    if (t < 3) { sy *= 0.92; sx *= 1.05; }
    else if (t < 13) { lift += h * 0.11 * Math.sin((Math.PI * (t - 3)) / 10); sy *= 1.05; sx *= 0.97; }
    else { sy *= interpolate(t, [13, 15, 17], [0.93, 1.02, 1]); sx *= interpolate(t, [13, 15, 17], [1.05, 0.99, 1]); }
  }
  // 点头：身子往下点两次
  for (const a of p.nods ?? []) {
    const t = f - a;
    if (t >= 0 && t < 16) sy *= 1 - 0.03 * Math.abs(Math.sin((Math.PI * t) / 8));
  }
  // 摇头：左右晃，越晃越小
  for (const a of p.shakes ?? []) {
    const t = f - a;
    if (t >= 0 && t < 20) rot += Math.sin(t * 0.95) * 5 * (1 - t / 20);
  }
  // 吓一跳
  for (const a of p.jolts ?? []) {
    const t = f - a;
    if (t >= 0 && t < 14) {
      lift += h * 0.06 * Math.sin((Math.PI * Math.min(t, 7)) / 7) * (t < 7 ? 1 : 0);
      sx *= t < 4 ? 0.94 : interpolate(t, [4, 8, 14], [1.06, 0.98, 1], CL);
      sy *= t < 4 ? 1.07 : interpolate(t, [4, 8, 14], [0.95, 1.02, 1], CL);
    }
  }
  // 说话：身子跟着字轻轻颠
  const talk = p.talk ?? 0;
  if (talk > 0) { lift += talk * h * 0.008; rot += Math.sin(f * 0.33 + seed) * 0.9; }

  const an = A[name];
  const closed = NO_BLINK.has(p.id) || !an ? 0 : blinkAt(f, seed * 11 + 3);
  const shadowK = 1 - Math.min(0.5, lift / (h * 0.25));

  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h, width: w, height: h, opacity: p.o ?? 1 }}>
      {p.shadow !== false && (
        <div style={{ position: "absolute", left: w * 0.5 - w * 0.36 * shadowK, top: h - h * 0.025, width: w * 0.72 * shadowK, height: h * 0.05, borderRadius: "50%", background: "rgba(80,58,38,0.2)", filter: "blur(4px)" }} />
      )}
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 100%", transform: `translateY(${-lift}px) rotate(${rot}deg) scale(${sx}, ${sy})` }}>
        <Img src={staticFile(`cast/v16/${name}.png`)} style={{ position: "absolute", inset: 0, width: w, height: h }} />
        {an && (
          <svg viewBox={`0 0 ${W} ${H}`} width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {closed > 0 && an.eyes.map((e, i) => <Lid key={i} e={e} c={closed} skin={e.skin ?? an.skin ?? "#F6DCC4"} id={`${name}-${seed}-${i}`} />)}
            {talk > 0.06 && an.mouth && <Mouth m={an.mouth} o={talk} id={`${name}-${seed}-m`} skin={an.mouth.bg ?? an.eyes[0]?.skin ?? "#F6DCC4"} />}
            {(p.blush ?? 0) > 0 && an.eyes.length === 2 && an.eyes.map((e, i) => (
              <ellipse key={`b${i}`} cx={e.x + e.w / 2} cy={e.y + e.h * 1.25} rx={e.w * 0.5} ry={e.h * 0.22} fill="#F27E83" opacity={0.45 * (p.blush ?? 0)} />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};

/** 眼皮：从上往下盖，全闭时画一条睫毛弧线 */
const Lid: React.FC<{ e: Eye; c: number; skin: string; id: string }> = ({ e, c, skin, id }) => {
  const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
  const rx = e.w * 0.62, ry = e.h * 0.62;
  const edge = cy - ry + 2 * ry * c;
  const lw = Math.max(2, e.h / 12);
  return (
    <g>
      <clipPath id={id}><rect x={cx - rx - 2} y={cy - ry - 2} width={rx * 2 + 4} height={edge - (cy - ry) + 2} /></clipPath>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={skin} clipPath={`url(#${id})`} />
      {c > 0.85
        ? <path d={`M ${cx - rx * 0.86} ${cy - ry * 0.05} Q ${cx} ${cy + ry * 0.5} ${cx + rx * 0.86} ${cy - ry * 0.05}`} fill="none" stroke="#4A2E22" strokeWidth={lw} strokeLinecap="round" />
        : <path d={`M ${cx - rx * 0.92} ${edge} Q ${cx} ${edge + ry * 0.12} ${cx + rx * 0.92} ${edge}`} fill="none" stroke="#4A2E22" strokeWidth={lw} strokeLinecap="round" />}
    </g>
  );
};

/**
 * 张开的嘴：先用嘴周围的底色（anchors 里的 mouth.bg）盖住原画上闭着的嘴线，再画上沿平、下沿圆（D 形）的嘴，张得大时露出舌头。
 * 不先盖的话，原来那条微笑线会和张开的嘴叠在一起（2026-10-25 用户指出）。
 */
const Mouth: React.FC<{ m: MouthA; o: number; id: string; skin: string }> = ({ m, o, id, skin }) => {
  const hw = m.w * (0.42 + 0.12 * o);
  const dh = m.w * (0.18 + 0.5 * o);
  const top = m.y - m.w * 0.08;
  const d = `M ${m.x - hw} ${top} Q ${m.x} ${top - m.w * 0.06} ${m.x + hw} ${top} Q ${m.x + hw * 0.9} ${top + dh} ${m.x} ${top + dh} Q ${m.x - hw * 0.9} ${top + dh} ${m.x - hw} ${top} Z`;
  return (
    <g>
      <radialGradient id={id}>
        <stop offset="0.82" stopColor={skin} stopOpacity={1} />
        <stop offset="1" stopColor={skin} stopOpacity={0} />
      </radialGradient>
      {/* 原画的微笑线往右收尾时常多出一小勾：盖的范围放宽、略往右挪 */}
      <ellipse cx={m.x + m.w * 0.12} cy={m.y + m.w * 0.03} rx={m.w * 1.25} ry={m.w * 0.46} fill={`url(#${id})`} />
      <path d={d} fill="#6E2A22" stroke="#4A2018" strokeWidth={Math.max(1.2, m.w / 18)} strokeLinejoin="round" />
      {o > 0.45 && <ellipse cx={m.x} cy={top + dh * 0.78} rx={hw * 0.55} ry={dh * 0.22} fill="#E6877A" />}
    </g>
  );
};

/** 头顶符号：！ ？ ♪ 汗 星星；at 起出现 dur 帧 */
export const Emote: React.FC<{ x: number; y: number; kind: "!" | "?" | "♪" | "sweat" | "spark" | "…"; at: number; dur?: number; s?: number; color?: string }> = ({ x, y, kind, at, dur = 40, s = 1, color = "#E8604C" }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dur) return null;
  const k = interpolate(t, [0, 5, 8, dur - 6, dur], [0, 1.25, 1, 1, 0], CL);
  const bob = Math.sin(t * 0.3) * 4;
  const common: React.CSSProperties = { position: "absolute", left: x, top: y + bob, transform: `translate(-50%, -50%) scale(${k * s})`, fontFamily: HAND, fontSize: 92, color, WebkitTextStroke: "3px #3E2A20", lineHeight: 1 };
  if (kind === "sweat") {
    return (
      <svg width={60} height={80} viewBox="-30 -40 60 80" style={{ ...common, overflow: "visible" }}>
        <path d="M 0 -30 C 14 -6 20 6 20 14 A 20 20 0 0 1 -20 14 C -20 6 -14 -6 0 -30 Z" fill="#9FD3F0" stroke="#3E2A20" strokeWidth={3} />
        <ellipse cx={-6} cy={12} rx={4} ry={7} fill="#fff" opacity={0.8} />
      </svg>
    );
  }
  if (kind === "spark") {
    return (
      <svg width={120} height={120} viewBox="-60 -60 120 120" style={{ ...common, overflow: "visible" }}>
        {[0, 1, 2].map((i) => {
          const a = (i * 2 * Math.PI) / 3 + t * 0.05, r = 34 + 8 * Math.sin(t * 0.4 + i);
          const cx = Math.cos(a) * r, cy = Math.sin(a) * r, q = 12 - i * 2;
          return <path key={i} d={`M ${cx} ${cy - q * 1.6} Q ${cx} ${cy} ${cx + q * 1.6} ${cy} Q ${cx} ${cy} ${cx} ${cy + q * 1.6} Q ${cx} ${cy} ${cx - q * 1.6} ${cy} Q ${cx} ${cy} ${cx} ${cy - q * 1.6} Z`} fill="#F7D77A" stroke="#3E2A20" strokeWidth={2.5} />;
        })}
      </svg>
    );
  }
  return <div style={common}>{kind === "!" ? "！" : kind === "?" ? "？" : kind}</div>;
};

/** 字幕旁的小头像：从正面图里裁出脸 */
export const Avatar16: React.FC<{ id: string; size?: number }> = ({ id, size = 64 }) => {
  const name = spriteName(id, "front");
  const [W, H] = SIZE[name] ?? [300, 500];
  const an = A[name];
  const ey = an?.eyes.length ? an.eyes.reduce((s, e) => s + e.y + e.h / 2, 0) / an.eyes.length : H * 0.3;
  const faceW = W * (id === "cat" || id === "dog" ? 0.8 : 0.95);
  const k = size / faceW;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "#FBF6EC", border: "3px solid #3E2A20", position: "relative", flex: "none", marginRight: 14 }}>
      <Img src={staticFile(`cast/v16/${name}.png`)} style={{ position: "absolute", width: W * k, height: H * k, left: (size - W * k) / 2, top: size * 0.52 - ey * k }} />
    </div>
  );
};
