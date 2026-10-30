// EP17 · 冷开场（多印钱给每人发一百万，大家就都富了吗 → 不会：钱是轮子，大家要的是车上的货 → 三件事）→ 第一件（钱不算财富：纯收入、养金币要本钱、大轮子、钱的两个意思、一枚金币付三个人）
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, Paper, SERIF, Sfx, Shell, useLines, useWordAt } from "../kit";
import { CR, Sparkle } from "../cast/crayon";
import { useTalk } from "../cast/talk";
import { Avatar16, Emote, Sprite } from "../v16/Sprite";
import { Card, CoinStack, Desk, fade, FOOT, GOLD, GREEN, Guinea, IcoBread, IcoCloth, IcoGear, IcoHouse, IcoLoom, IcoShirt, IcoShop, IcoTimber, INK, Keyword, MillionPhone, Note, PaperTown, Payslip, Phone, popIn, RED, RedStamp, Room, Screen, Shot, TEAL, Vault, Verdict, WheelCart } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** 念到某个字时跳一下（1 → 1.25 → 1） */
const bump = (f: number, at: number) => interpolate(f, [at - 2, at + 4, at + 10], [1, 1.25, 1], CL);

/** 小标签（HTML）：10-26 和第一篇融合——宋体、墨色细边、小圆角，像书页上的批注签 */
export const TagDiv: React.FC<{ x: number; y: number; text: string; col: string; k: number; size?: number; dark?: boolean }> = ({ x, y, text, col, k, size = 42, dark }) => {
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(k), background: col, color: dark ? C.ink : C.paper, fontFamily: SERIF, fontWeight: 900, fontSize: size * 0.9, padding: `${size * 0.12}px ${size * 0.4}px`, borderRadius: 8, border: `3px solid ${C.ink}`, whiteSpace: "nowrap", boxShadow: "4px 4px 0 rgba(27,30,36,.14)" }}>{text}</div>
  );
};
/**
 * 货车一整幕（10-26 深夜用户：只有一辆车的画面“太单调了，加一点元素”）：
 * 阿禾在后面推车、车慢慢往前走、轮子扬起一点土；上方三个街坊等着车上的货，念到“货”时每人头边冒出一样东西。
 * x = 车的位置（会往左挪 move 像素）；heads = 街坊出现的帧；goods = 街坊拿到货的帧（不给就不冒）。
 */
export const CartScene: React.FC<{ f: number; a: number; x?: number; move?: number; wheelGlow?: number; goodsGlow?: number; heads?: number; goods?: number; paper?: number }> = ({ f, a, x = 320, move = 40, wheelGlow = 0, goodsGlow = 0, heads = 1e9, goods = 1e9, paper = 0 }) => {
  const cx = x - interpolate(f, [a, a + 150], [0, move], CL);
  return (
    <>
      <Screen>
        {/* 车轮后面扬起的土 */}
        {[0, 1, 2].map((i) => {
          const t = (f - a + i * 9) % 27;
          return <circle key={i} cx={cx + 150 + t * 3} cy={FOOT - 10 - t * 0.8} r={10 + t * 0.6} fill="#D9C6A2" opacity={0.5 * (1 - t / 27)} />;
        })}
        <g transform={`translate(${cx} ${FOOT}) scale(1.05)`}><WheelCart t={f} wheelGlow={wheelGlow} goodsGlow={goodsGlow} paper={paper} /></g>
        {/* 车上的货送到街坊手里 */}
        {f >= goods - 4 && [0, 1, 2].map((i) => {
          const p = interpolate(f, [goods + i * 4, goods + 14 + i * 4], [0, 1], CL);
          return p < 1 ? <g key={i} transform={`translate(${interpolate(p, [0, 1], [cx + 180, 290 + i * 250])} ${interpolate(p, [0, 0.5, 1], [FOOT - 290, 660, 700])}) scale(0.7)`}>{[<IcoBread key="b" />, <IcoShirt key="s" />, <IcoCloth key="c" />][i]}</g> : null;
        })}
        {f >= goods + 14 && [0, 1, 2].map((i) => <g key={`g${i}`} transform={`translate(${370 + i * 250} 650) scale(${popIn(f, goods + 14 + i * 4) * 0.75})`}>{[<IcoBread key="b" />, <IcoShirt key="s" />, <IcoCloth key="c" />][i]}</g>)}
      </Screen>
      {[0, 1, 2].map((i) => <Head key={i} id={["female2", "folk_tailor", "amu"][i]} x={290 + i * 250} y={620} k={popIn(f, heads + i * 4)} size={130} />)}
      <Sprite id="ahe" view="tq_l" x={cx + 590} y={FOOT} h={500} seed={3} walk={[[a, a + 150]]} />
    </>
  );
};

/** 圆头像（HTML，画面坐标中心） */
export const Head: React.FC<{ id: string; x: number; y: number; k: number; size?: number }> = ({ id, x, y, k, size = 150 }) => {
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, scale: String(k), marginRight: -14 }}><Avatar16 id={id} size={size} /></div>;
};

/**
 * 三件事的清单（开头）：10-27 5 秒完播方案——不念“这一集讲三件事”，三行都写成悬念（问题），第三行点名“最出人意料”，红边放大。
 * hot = 第三行亮起来的帧
 */
export const ThreeRows: React.FC<{ f: number; at: [number, number, number]; hot?: number }> = ({ f, at, hot = 1e9 }) => {
  const rows = [
    { col: GOLD, title: "钱为什么不算财富？", icon: <g transform="translate(150 120)"><Guinea s={1.3} /></g> },
    { col: TEAL, title: "一张纸凭什么当金子花？", icon: <g transform="translate(150 120)"><Note s={0.95} rot={-6} /></g> },
    // 10-27 复核 P0：第三钩必须是第三件自己的事（原来的“柜里只留两成金银”是第二件的事）
    { col: GREEN, title: "金银少了，出产却多了？", icon: <g transform="translate(150 160)"><CoinStack s={1.1} n={4} /></g> },
  ];
  const h = popIn(f, hot);
  return (
    <Screen>
      {rows.map((r, i) => {
        const k = popIn(f, at[i]);
        if (k <= 0) return null;
        const big = i === 2 ? 1 + 0.06 * h : 1;
        return (
          <g key={i} transform={`translate(540 ${545 + i * 270}) scale(${big}) translate(-540 ${-(545 + i * 270)})`}>
            <Card x={60} y={430 + i * 270} w={960} h={230} k={Math.min(1, k)} accent={r.col}>
              {i === 2 && h > 0 && <rect x={-6} y={-6} width={972} height={242} rx={20} fill="none" stroke={RED} strokeWidth={6} opacity={Math.min(1, h)} />}
              {r.icon}
              {/* 10-27 复核 P0：“出人意料”只在旁白说一次，第三张卡只红边放大，不再加小字 */}
              <text x={290} y={135} fontFamily={SERIF} fontWeight={900} fontSize={52} fill={INK}>{r.title}</text>
            </Card>
          </g>
        );
      })}
    </Screen>
  );
};

// ================================================================ 冷开场（10-27 第四版：5 秒完播方案）
// 前 5 秒一个钩子一句话：屏幕大字只挂正在说的那一句；答案只给半张（不会 + 车轮 + 真正让你变富的是货），不解释；
// “拿更多的钱抢同样多的东西”挪到第一件结尾；目录改成三个悬念。画面：到账手机（彩铅道具）→ 四周都到账 →“不会”章 → 切轮子小车
export const SHook: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("hook");
  const W = useWordAt("hook");
  const s = [0, 1, 2, 3, 4, 5].map((i) => L.s(i));
  const wMillion = W(0, "一百万");
  const wAll = W(1, "所有人"), wRich = W(1, "都富了");
  const wNo = W(2, "不会"), wWheel = W(2, "车轮");
  const wGoods = W(3, "车上的货");
  const r1 = W(4, "钱为什么"), r2 = W(4, "一张纸"), r3 = W(5, "第三件"), wVault = W(5, "不到原来的一半");
  const count = interpolate(f, [4, wMillion + 6], [0, 1000000], { ...CL, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const crowd = interpolate(f, [s[1] - 2, s[1] + 10], [0, 1], CL);
  const no = popIn(f, wNo);
  // 屏幕大字 = 正在说的那一句：第一句第 0 帧就在，第二句念到时接在下面
  const t1 = interpolate(f, [0, 6], [0, 1], CL);
  const t2 = interpolate(f, [s[1] - 2, s[1] + 6], [0, 1], CL);

  return (
    <Shell dur={L.dur} enter="none" cam="still" zoom={0} kicks={[wMillion, wNo, wGoods]}>
      <PaperTown f={f} />
      {/* 镜头 1（0–5 秒）：到账一百万的手机；第二句时四周手机都到账；“不会”盖章 */}
      <Shot f={f} a={0} b={wWheel}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 250, fontFamily: SERIF, fontWeight: 900, fontSize: 64, lineHeight: 1.4, color: INK, textAlign: "center", WebkitTextStroke: `5px ${C.paper}`, paintOrder: "stroke fill" }}>
          <div style={{ opacity: t1, translate: `0 ${(1 - t1) * 20}px`, whiteSpace: "nowrap" }}>假如，国家给每人发<span style={{ color: f >= wMillion ? RED : "inherit" }}>一百万</span></div>
          <div style={{ opacity: t2, translate: `0 ${(1 - t2) * 20}px`, whiteSpace: "nowrap", fontSize: 56, color: C.ink2 }}>明天<span style={{ color: f >= wRich ? RED : "inherit" }}>所有人都富了</span>？</div>
        </div>
        {crowd > 0 && [[160, 790], [920, 790], [160, 1090], [920, 1090]].map(([x, y], i) => (
          <MillionPhone key={i} x={x} y={y} s={0.36} k={interpolate(f, [s[1] - 2 + i * 3, s[1] + 8 + i * 3], [0, 1], CL)} dim={no > 0 ? 0.3 : 0} />
        ))}
        <MillionPhone x={540} y={905 + interpolate(f, [0, 12], [140, 0], CL)} s={0.82} count={count} k={interpolate(f, [0, 8], [0, 1], CL)} dim={no > 0 ? 0.22 : 0} />
        <RedStamp x={540} y={880} text="不会" k={no} size={96} />
      </Shot>
      {/* 镜头 2（念到“车轮”切过来）：轮子小车；“真正让你变富的，是车上的货”——到此为止，不解释 */}
      <Shot f={f} a={wWheel} b={s[4]}>
        <CartScene f={f} a={wWheel} wheelGlow={fade(f, wWheel, wGoods - 2, 6)} goodsGlow={fade(f, wGoods, s[4] + 10, 6)} heads={wWheel + 6} goods={wGoods + 6} />
        <TagDiv x={170} y={FOOT - 300} text="车轮：钱" col={GOLD} k={popIn(f, wWheel + 4)} size={40} />
        <TagDiv x={560} y={FOOT - 410} text="车上的货" col={GREEN} k={popIn(f, wGoods)} size={40} />
        <Keyword text={f < wGoods ? "钱只是车轮" : "让你变富的，是货"} at={wWheel} out={s[4]} size={72} />
      </Shot>
      {/* 镜头 3：三个悬念（不念“三件事”），第三件红边放大；顶部不再挂“出人意料”的横幅（10-27 复核 P0） */}
      <Shot f={f} a={s[4]} b={L.dur + 20}>
        <ThreeRows f={f} at={[r1, r2, r3]} hot={wVault} />
      </Shot>

      <Sfx at={2} name="ding" v={0.36} />
      {Array.from({ length: 8 }).map((_, i) => <Sfx key={`t${i}`} at={6 + i * Math.max(3, (wMillion - 4) / 8)} name="tick" v={0.12} />)}
      <Sfx at={wMillion + 4} name="coin" v={0.34} />
      {[0, 1, 2, 3].map((i) => <Sfx key={`p${i}`} at={s[1] + i * 3} name="pop" v={0.16} />)}
      <Sfx at={wAll} name="ding" v={0.2} />
      <Sfx at={wNo} name="stamp" v={0.46} />
      <Sfx at={wWheel - 4} name="paper" v={0.3} />
      <Sfx at={wGoods} name="twinkle" v={0.28} />
      <Sfx at={s[4] - 4} name="paper" v={0.28} />
      {[r1, r2, r3].map((a, i) => <Sfx key={`r${i}`} at={a - 4} name="pop" v={0.26} />)}
      <Sfx at={wVault} name="thump" v={0.3} />
    </Shell>
  );
};

// ================================================================ 第一件：钱为什么不算财富
export const SWheel: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("wheel");
  const W = useWordAt("wheel");
  const M = useTalk("wheel");
  const s = Array.from({ length: 12 }).map((_, i) => L.s(i));
  const wMoreW = W(10, "造得再多"), wSameW = W(10, "不会多一斤"), wGrab = W(10, "抢同样多");
  const wRent = W(1, "地租"), wGross = W(1, "毛收入"), wHouse = W(1, "修房子"), wDitch = W(1, "修水沟"), wNet = W(1, "纯收入");
  const wLook = W(2, "看纯收入"), wNation = W(2, "一个国家");
  const wMetal = W(3, "金银本来就贵"), wLabor = W(3, "人工"), wCut = W(3, "扣掉");
  const wWheel = W(4, "大轮子"), wAxle = W(4, "轮子是轮子"), wGoods = W(4, "货是货"), wWant = W(4, "真正要的是货");
  const wTwo = W(6, "两个意思"), wSelf = W(6, "钱本身"), wBuy = W(6, "钱能买到");
  const w50 = W(7, "五十镑"), wEat = W(7, "吃的"), wWear = W(7, "穿的"), wLive = W(7, "住的");
  const wD1 = W(8, "今天"), wD2 = W(8, "明天"), wD3 = W(8, "后天"), wX3 = W(8, "三倍");
  const wFew = W(9, "少得多");
  const sack = (i: number) => interpolate(f, [wRent + i * 5, wRent + 14 + i * 5], [0, 1], CL);
  const net = (x: number) => x;
  const coinAt = f < wD2 ? 0 : f < wD3 ? 1 : 2;
  const hop = interpolate(f, [wD2 - 6, wD2 + 6, wD3 - 6, wD3 + 6], [0, 1, 1, 2], CL);

  return (
    <Shell dur={L.dur} enter="page" cam="still" zoom={0} kicks={[wNet, wCut, wWant, wX3]}>
      <PaperTown f={f} />
      {/* 镜头 1：第一件——金币和一堆吃的穿的住的，中间一个问号，小满站在下面想 */}
      <Shot f={f} a={0} b={s[1]}>
        <Screen>
          <g transform={`translate(270 720) scale(${popIn(f, 4) * 2.3})`}><Guinea /></g>
          <text x={540} y={760} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={120} fill={RED} opacity={popIn(f, 12) > 0 ? 1 : 0}>？</text>
          <g transform={`translate(800 780) scale(${popIn(f, 8)})`}>
            <g transform="translate(-90 0)"><IcoBread s={1.2} /></g>
            <g transform="translate(20 -10)"><IcoShirt s={1.15} /></g>
            <g transform="translate(120 10)"><IcoHouse s={0.95} /></g>
          </g>
          <text x={270} y={860} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK} opacity={popIn(f, 10) > 0 ? 1 : 0}>钱</text>
          <text x={810} y={860} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK} opacity={popIn(f, 14) > 0 ? 1 : 0}>吃的、穿的、住的</text>
        </Screen>
        <Sprite id="xiaoman3" view="front" x={540} y={FOOT} h={360} seed={5} tilt={-5} />
        <Emote x={640} y={FOOT - 360} kind="?" at={18} dur={40} />
        <Keyword text="第一件" at={2} color={GOLD} size={96} />
      </Shot>
      {/* 镜头 2：地主阿木，毛收入 → 纯收入；一个国家也一样 */}
      <Shot f={f} a={s[1]} b={s[3]}>
        <Screen>
          <Card x={60} y={360} w={960} h={310} k={1}>
            {f >= wGross - 6 && (
              <g>
                <rect x={60} y={110} width={840 * interpolate(f, [wGross - 4, wGross + 10], [0, 1], CL)} height={90} rx={20} fill="#C99A6B" stroke={CR.line} strokeWidth={4} />
                <text x={80} y={88} fontFamily={SERIF} fontWeight={900} fontSize={44} fill={INK}>毛收入：交上来的全部</text>
              </g>
            )}
            {f >= wHouse - 4 && <g transform={`translate(790 ${interpolate(f, [wHouse, wHouse + 12], [155, 245], CL)})`} opacity={fade(f, wHouse, s[3], 6)}><rect x={-110} y={-40} width={220} height={80} rx={18} fill="#B9B1A3" stroke={CR.line} strokeWidth={4} /><text y={13} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={INK}>修房子</text></g>}
            {f >= wDitch - 4 && <g transform={`translate(570 ${interpolate(f, [wDitch, wDitch + 12], [155, 245], CL)})`} opacity={fade(f, wDitch, s[3], 6)}><rect x={-110} y={-40} width={220} height={80} rx={18} fill="#9FC3D9" stroke={CR.line} strokeWidth={4} /><text y={13} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={INK}>修水沟</text></g>}
            {f >= wHouse && <rect x={680} y={110} width={220} height={90} fill="#FFFCF6" opacity={interpolate(f, [wHouse, wHouse + 8], [0, 1], CL)} />}
            {f >= wDitch && <rect x={460} y={110} width={220} height={90} fill="#FFFCF6" opacity={interpolate(f, [wDitch, wDitch + 8], [0, 1], CL)} />}
            {f >= wNet - 4 && <rect x={60} y={110} width={net(400)} height={90} rx={20} fill={GREEN} stroke={CR.line} strokeWidth={4} opacity={interpolate(f, [wNet - 4, wNet + 6], [0, 1], CL)} />}
            {f >= wNet - 4 && <text x={260} y={170} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill="#FFFCF6" opacity={interpolate(f, [wNet - 4, wNet + 6], [0, 1], CL)}>纯收入</text>}
            {f >= wLook - 4 && <rect x={50} y={100} width={420} height={110} rx={26} fill="none" stroke={RED} strokeWidth={8} opacity={fade(f, wLook, s[3], 6)} />}
          </Card>
          {[0, 1, 2].map((i) => {
            const p = sack(i);
            return p > 0 && p < 1 ? <g key={i} transform={`translate(${interpolate(p, [0, 1], [760, 330])} ${interpolate(p, [0, 0.5, 1], [1060, 900, 1080])})`}><g transform="scale(0.9)"><path d="M -36 0 L -32 -50 L -14 -66 L 14 -66 L 32 -50 L 36 0 Z" fill="#E9D6A6" stroke={CR.line} strokeWidth={3.5} /></g></g> : null;
          })}
          {f >= wNation - 4 && [0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${170 + i * 185} 820) scale(${popIn(f, wNation + i * 3) * 0.7})`}><IcoHouse /></g>)}
        </Screen>
        <Sprite id="amu" view="tq_r" x={230} y={FOOT} h={500} seed={11} nods={[wNet + 2]} o={f < wNation - 4 ? 1 : 1 - fade(f, wNation, 1e9, 6)} />
        <Sprite id="folk_farmer" view="front" x={840} y={FOOT} h={500} seed={31} o={f < wNation - 4 ? 1 : 1 - fade(f, wNation, 1e9, 6)} />
        <TagDiv x={230} y={FOOT - 540} text="地主" col={CR.mute} k={popIn(f, s[1] + 6) * (f < wNation - 4 ? 1 : 0)} size={38} />
        <TagDiv x={840} y={FOOT - 540} text="佃户" col={CR.mute} k={popIn(f, s[1] + 12) * (f < wNation - 4 ? 1 : 0)} size={38} />
      </Shot>
      {/* 镜头 3：钱本身也要本钱：金银 → 金币，从纯收入里扣 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <Card x={60} y={420} w={960} h={700} k={1}>
            <g transform={`translate(200 300) scale(${popIn(f, wMetal)})`} filter="url(#crayon)">
              <path d="M -90 0 L -60 -60 L 60 -60 L 90 0 Z" fill={CR.gold} stroke={CR.line} strokeWidth={5} />
              <path d="M -60 -60 L -40 -100 L 40 -100 L 60 -60" fill={CR.goldHi} stroke={CR.line} strokeWidth={5} />
            </g>
            <text x={200} y={370} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={42} fill={INK} opacity={f >= wMetal ? 1 : 0}>金银本来就贵</text>
            {f >= wLabor - 4 && <path d="M 360 250 L 560 250" stroke={CR.line} strokeWidth={10} strokeLinecap="round" opacity={popIn(f, wLabor) > 0 ? 1 : 0} />}
            {f >= wLabor - 4 && <path d="M 540 228 L 572 250 L 540 272" fill="none" stroke={CR.line} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
            {f >= wLabor - 4 && <text x={460} y={225} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK}>+ 人工</text>}
            <g transform={`translate(740 250) scale(${popIn(f, wLabor + 6) * 1.6})`}><Guinea /></g>
            {/* 纯收入里扣掉一块 */}
            <rect x={80} y={500} width={800} height={90} rx={20} fill={GREEN} stroke={CR.line} strokeWidth={4} opacity={popIn(f, s[3] + 6) > 0 ? 1 : 0} />
            <text x={300} y={562} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill="#FFFCF6" opacity={popIn(f, s[3] + 6) > 0 ? 1 : 0}>纯收入</text>
            {f >= wCut - 4 && (
              <g transform={`translate(0 ${interpolate(f, [wCut, wCut + 12], [0, 80], CL)})`}>
                <rect x={700} y={500} width={180} height={90} rx={20} fill={GOLD} stroke={CR.line} strokeWidth={4} />
                <text x={790} y={560} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill="#FFFCF6">养金币</text>
              </g>
            )}
            {f >= wCut && <rect x={700} y={500} width={180} height={90} fill="#FFFAEF" stroke={CR.line} strokeDasharray="12 10" strokeWidth={3} opacity={interpolate(f, [wCut, wCut + 8], [0, 1], CL)} />}
          </Card>
        </Screen>
      </Shot>
      {/* 镜头 4：大轮子：轮子是轮子，货是货 */}
      <Shot f={f} a={s[4]} b={s[5]}>
        <CartScene f={f} a={s[4]} wheelGlow={fade(f, wWheel, wGoods - 2, 6)} goodsGlow={fade(f, wGoods, s[5] + 10, 6)} heads={s[4] + 6} goods={wWant} />
        <TagDiv x={170} y={FOOT - 300} text="轮子：钱" col={GOLD} k={popIn(f, wAxle)} size={40} />
        <TagDiv x={560} y={FOOT - 410} text="货：吃的、穿的" col={GREEN} k={popIn(f, wGoods)} size={40} />
        <Keyword text={f < wAxle ? "钱：让货物转起来的轮子" : "轮子是轮子，货是货"} at={s[4] + 4} out={s[5]} size={72} />
      </Shot>
      {/* 镜头 5：小雪：可我的工资，就是钱呀？（手边一张工资单） */}
      <Shot f={f} a={s[5]} b={s[6]}>
        <Screen><g transform={`translate(790 860) rotate(6) scale(${popIn(f, s[5] + 2) * 1.25})`}><Payslip /></g></Screen>
        <Sprite id="female2" view="tq_r" x={360} y={FOOT} h={620} seed={7} talk={M("小雪", f)} />
        <Emote x={420} y={FOOT - 660} kind="?" at={s[5] + 6} dur={40} />
      </Shot>
      {/* 镜头 6：钱的两个意思；五十镑说的是第二个 */}
      <Shot f={f} a={s[6]} b={s[8]}>
        <Screen>
          <Card x={60} y={420} w={450} h={620} k={popIn(f, wSelf)} accent={GOLD}>
            <g transform={`translate(225 300) scale(${f >= w50 - 4 ? 1.5 : 2.2})`} opacity={f >= w50 - 4 ? 0.45 : 1}><Guinea /></g>
            <text x={225} y={520} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={48} fill={INK}>钱本身</text>
          </Card>
          <Card x={570} y={420} w={450} h={620} k={popIn(f, wBuy)} accent={GREEN}>
            {f >= w50 - 4 && <ellipse cx={225} cy={300} rx={200} ry={220} fill={CR.goldHi} opacity={0.35 * fade(f, w50, s[8], 6)} filter="url(#glow)" />}
            {/* 一直在；念到“吃的、穿的、住的”时各自跳一下 */}
            <g transform={`translate(110 300) scale(${1.1 * bump(f, wEat)})`}><IcoBread /></g>
            <g transform={`translate(240 310) scale(${1.1 * bump(f, wWear)})`}><IcoShirt /></g>
            <g transform={`translate(360 320) scale(${0.9 * bump(f, wLive)})`}><IcoHouse /></g>
            <text x={225} y={520} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={INK}>它能买到的东西</text>
          </Card>
          {f >= w50 - 4 && <g transform={`translate(795 500) scale(${popIn(f, w50)})`}><rect x={-110} y={-40} width={220} height={80} rx={40} fill={GREEN} stroke={CR.line} strokeWidth={4} /><text y={16} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill="#FFFCF6">一年 50 镑</text></g>}
        </Screen>
        <Keyword text={<>“钱”有<span style={{ color: RED }}>两个意思</span></>} at={wTwo} out={s[8]} size={74} />
      </Shot>
      {/* 镜头 7：一枚金币付三个人 → 收入是金币的三倍；所以金币总比收入少 */}
      <Shot f={f} a={s[8]} b={s[10]}>
        <Screen>
          <Card x={60} y={420} w={960} h={720} k={1}>
            {f < s[9] && (
              <g transform={`translate(${190 + hop * 290} ${interpolate(hop % 1, [0, 0.5, 1], [180, 90, 180])})`}><Guinea s={1.1} /></g>
            )}
            {[0, 1, 2].map((i) => (
              <g key={i} opacity={f < s[9] ? 1 : 0}>
                <g transform={`translate(${190 + i * 290} 560) scale(${popIn(f, [wD1, wD2, wD3][i] + 8)})`}>{[<IcoBread key="b" s={1.1} />, <IcoShirt key="s" s={1.0} />, <IcoCloth key="c" s={1.0} />][i]}</g>
                <text x={190 + i * 290} y={640} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK} opacity={f >= [wD1, wD2, wD3][i] ? 1 : 0}>{["今天", "明天", "后天"][i]}</text>
              </g>
            ))}
            {f >= wX3 - 4 && f < s[9] && <text x={480} y={110} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill={GREEN} opacity={popIn(f, wX3) > 0 ? 1 : 0}>收入 × 3，金币 × 1</text>}
            {/* 所以：流通的金币，比大家的收入少得多 */}
            {f >= s[9] - 4 && (
              <g opacity={fade(f, s[9], s[10] + 8, 6)}>
                <text x={80} y={250} fontFamily={SERIF} fontWeight={900} fontSize={46} fill={INK}>流通的金币</text>
                <rect x={80} y={280} width={170 * interpolate(f, [s[9], s[9] + 12], [0, 1], CL)} height={80} rx={18} fill={GOLD} stroke={CR.line} strokeWidth={4} />
                <text x={80} y={470} fontFamily={SERIF} fontWeight={900} fontSize={46} fill={INK}>大家的收入</text>
                <rect x={80} y={500} width={800 * interpolate(f, [s[9] + 6, wFew + 6], [0, 1], CL)} height={80} rx={18} fill={GREEN} stroke={CR.line} strokeWidth={4} />
              </g>
            )}
          </Card>
        </Screen>
        {f < s[9] && [0, 1, 2].map((i) => <Head key={i} id={["ahe", "folk_tailor", "folk_mason"][i]} x={250 + i * 290} y={790} k={popIn(f, s[8] + 4 + i * 4)} size={170} />)}
      </Shot>
      {/* 镜头 7b（10-27 5 秒完播方案：开头挪过来的金句，当第二钩）：回到开头那部到账手机——轮子造得再多，货也不多一斤，大家拿着更多的钱抢同样多的东西 */}
      <Shot f={f} a={s[10]} b={s[11]}>
        <MillionPhone x={540} y={640} s={0.5} k={popIn(f, s[10] + 2)} dim={f >= wGrab ? 0.25 : 0} />
        {[[220, 600], [860, 600]].map(([x, y], i) => <MillionPhone key={i} x={x} y={y} s={0.26} k={popIn(f, s[10] + 6 + i * 3)} dim={f >= wGrab ? 0.3 : 0} />)}
        <Screen>
          {/* 轮子造得再多：一个个金币轮子冒出来 */}
          {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${170 + i * 185} 900) scale(${popIn(f, wMoreW + i * 4)})`}><Guinea /></g>)}
          {/* 抢同样多的东西：一堆货在中间，两边的人拿着钱来抢，金币都往它涌 */}
          {f >= wSameW - 6 && (
            <g transform={`translate(520 1190) scale(${1.45 * popIn(f, wSameW - 4)})`}>
              <g transform="translate(-70 0)"><IcoBread s={1.0} /></g>
              <g transform="translate(20 0)"><IcoShirt s={0.95} /></g>
              <g transform="translate(100 0)"><IcoCloth s={0.8} /></g>
            </g>
          )}
          {f >= wGrab && [0, 1, 2, 3, 4].map((i) => {
            const p = interpolate(f, [wGrab + i * 2, wGrab + 14 + i * 2], [0, 1], CL);
            return p < 1 ? <g key={`g${i}`} transform={`translate(${interpolate(p, [0, 1], [170 + i * 185, 540])} ${interpolate(p, [0, 1], [900, 1140])}) scale(0.6)`}><Guinea /></g> : null;
          })}
        </Screen>
        {[0, 1].map((i) => <Head key={i} id={["female2", "folk_tailor"][i]} x={[240, 840][i]} y={1170} k={popIn(f, wGrab - 4 + i * 3)} size={150} />)}
        <TagDiv x={540} y={1040} text="货：一斤没多" col={GREEN} k={popIn(f, wSameW)} size={38} />
        <Keyword text="那一百万为什么没用" at={s[10] + 2} out={s[11]} size={70} />
      </Shot>
      {/* 镜头 8：第一件的结论 */}
      <Shot f={f} a={s[11]} b={L.dur + 20}>
        <CartScene f={f} a={s[11]} goodsGlow={1} heads={s[11]} goods={s[11] + 20} />
        <Screen>{[0, 1, 2].map((i) => <Sparkle key={i} x={[420, 650, 900][i]} y={[560, 520, 560][i]} s={1.1} t={f + i * 7} />)}</Screen>
      </Shot>
      <Verdict i={0} text="钱是轮子，收入是它换来的东西" at={s[11] + 4} y={338} />

      <Sfx at={4} name="ding" v={0.3} />
      {[0, 1, 2].map((i) => <Sfx key={`s${i}`} at={wRent + 12 + i * 5} name="thump" v={0.2} />)}
      <Sfx at={wGross} name="swish" v={0.22} />
      <Sfx at={wHouse} name="erase" v={0.22} />
      <Sfx at={wDitch} name="erase" v={0.22} />
      <Sfx at={wNet} name="ding" v={0.3} />
      <Sfx at={wNation} name="pop" v={0.22} />
      <Sfx at={s[3] - 4} name="paper" v={0.26} />
      <Sfx at={wMetal} name="thump" v={0.26} />
      <Sfx at={wLabor + 6} name="coin" v={0.3} />
      <Sfx at={wCut} name="erase" v={0.3} />
      <Sfx at={s[4] - 2} name="paper" v={0.24} />
      <Sfx at={wWheel} name="ding" v={0.26} />
      <Sfx at={wGoods} name="twinkle" v={0.28} />
      <Sfx at={s[5] + 4} name="boing" v={0.2} />
      <Sfx at={s[6] - 2} name="paper" v={0.24} />
      <Sfx at={wSelf} name="pop" v={0.24} />
      <Sfx at={wBuy} name="pop" v={0.24} />
      {[wEat, wWear, wLive].map((a, i) => <Sfx key={`e${i}`} at={a} name="blip" v={0.2} />)}
      <Sfx at={s[8] - 2} name="paper" v={0.24} />
      {[wD1, wD2, wD3].map((a, i) => <Sfx key={`d${i}`} at={a + (i ? 2 : 0)} name="coin" v={0.24} />)}
      <Sfx at={wX3} name="ding" v={0.3} />
      <Sfx at={s[10] - 2} name="paper" v={0.26} />
      <Sfx at={s[10] + 2} name="ding" v={0.26} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={`m${i}`} at={wMoreW + i * 4} name="coin" v={0.14} />)}
      <Sfx at={wSameW} name="thump" v={0.28} />
      <Sfx at={wGrab} name="whoosh" v={0.22} />
      <Sfx at={s[11] + 4} name="stamp" v={0.4} />
    </Shell>
  );
};
