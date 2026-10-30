// EP20 · 冷开场（大家都攒着钱不花，国家是不是就更穷了 → 不一定，省下的钱换一群人花 → 前提是有人拿去用 → 三步）→ 第一步（省下的钱被谁花了）
// 全片一个案例：双胞胎兄弟（哥哥花、弟弟存）+ 阿禾的裁缝作坊 + 一个存钱罐；左边宴席、右边作坊，位置不变
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, SERIF, Sfx, Shell, useLines, useWordAt } from "../kit";
import { CR, Sparkle } from "../cast/crayon";
import { useTalk } from "../cast/talk";
import { Emote, Sprite } from "../v16/Sprite";
import { Head, TagDiv } from "../ep17/scenesA";
import { BankHouse, Card, ClothesRack, fade, FeastTable, FOOT, Furnace, GOLD, GREEN, Guinea, IcoBread, IcoCloth, IcoShop, INK, Keyword, MoneyPile, PaperTown, popIn, RED, RedStamp, SaveJar, Screen, Shot, TEAL, Verdict } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const arc = (p: number, x0: number, y0: number, x1: number, y1: number, lift = 140): [number, number] => [x0 + (x1 - x0) * p, y0 + (y1 - y0) * p - Math.sin(Math.PI * p) * lift];
/** 一枚东西沿弧线从 a 帧飞到 a+d 帧（飞完就不画） */
export const Fly: React.FC<{ f: number; a: number; d?: number; from: [number, number]; to: [number, number]; lift?: number; s?: number; children: React.ReactNode }> = ({ f, a, d = 18, from, to, lift = 120, s = 1, children }) => {
  const p = interpolate(f, [a, a + d], [0, 1], CL);
  if (f < a || p >= 1) return null;
  const [x, y] = arc(p, from[0], from[1], to[0], to[1], lift);
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>;
};
/** 一串金币从 a 帧起，每 gap 帧一枚，沿弧线飞过去 */
export const CoinFlow: React.FC<{ f: number; a: number; n?: number; gap?: number; from: [number, number]; to: [number, number]; lift?: number; s?: number }> = ({ f, a, n = 4, gap = 5, from, to, lift = 100, s = 0.45 }) => (
  <>{Array.from({ length: n }).map((_, i) => <Fly key={i} f={f} a={a + i * gap} d={18} from={from} to={to} lift={lift} s={s}><Guinea /></Fly>)}</>
);

/** 阿禾的裁缝作坊（画面右边，位置全片不变）：铺子 + 招牌 */
export const Workshop: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = 830, y = FOOT - 10, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform="scale(2.1)"><IcoShop /></g>
    <g transform="translate(0 -300)"><rect x={-110} y={-30} width={220} height={60} rx={10} fill="#FFFBF0" stroke={CR.line} strokeWidth={4} /><text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={INK}>阿禾裁缝铺</text></g>
  </g>
);

/**
 * 开头的三步：问句卡 + 这一步讲的概念名（10-28 用户：只剩悬念观众猜不透，标题上要讲清楚概念），第三张红边放大（不加“出人意料”，顶部不挂横幅）
 */
const ThreeRows20: React.FC<{ f: number; at: [number, number, number]; hot?: number }> = ({ f, at, hot = 1e9 }) => {
  const rows = [
    { col: GOLD, title: "省下的钱，被谁花掉了？", term: "书里叫“节俭”", icon: <g transform="translate(150 205) scale(0.62)"><SaveJar level={0.6} /></g> },
    { col: TEAL, title: "请客花钱，不也养活了人？", term: "书里叫“生产性劳动”", icon: <g transform="translate(150 185) scale(0.42)"><FeastTable /></g> },
    { col: GREEN, title: "要是人人都省，会怎样？", term: "后来叫“节俭悖论”", icon: <g transform="translate(150 205) scale(0.62)"><SaveJar level={0.6} lid={1} dim={0.25} /></g> },
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
              <text x={290} y={105} fontFamily={SERIF} fontWeight={900} fontSize={50} fill={INK}>{r.title}</text>
              <text x={290} y={180} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={r.col} opacity={interpolate(f, [at[i] + 6, at[i] + 14], [0, 1], CL)}>{r.term}</text>
            </Card>
          </g>
        );
      })}
    </Screen>
  );
};

// ================================================================ 冷开场
export const SHook: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("hook");
  const W = useWordAt("hook");
  const s = [0, 1, 2, 3, 4].map((i) => L.s(i));
  const wSave = W(0, "攒着钱不花"), wShop = W(0, "店越来越难做"), wPoor = W(0, "更穷");
  const wNot = W(1, "不一定"), wSpent = W(1, "也会被花掉"), wOther = W(1, "换了一群人花");
  const wUse = W(2, "拿去做生意");
  const r1 = W(3, "被谁花掉了"), r2 = W(3, "请客花钱"), r3 = W(4, "人人都省");
  const t1 = interpolate(f, [0, 6], [0, 1], CL);
  const jarLevel = interpolate(f, [0, wSave + 10], [0.25, 0.75], CL) * (1 - 0.5 * interpolate(f, [wSpent, wOther + 10], [0, 1], CL));

  return (
    <Shell dur={L.dur} enter="none" cam="still" zoom={0} kicks={[wSave, wNot, wUse]}>
      <PaperTown f={f} />
      {/* 镜头 1：存钱罐一枚枚往里落，旁边的铺子冷清 */}
      <Shot f={f} a={0} b={s[1]}>
        <div style={{ position: "absolute", left: 50, right: 50, top: 250, fontFamily: SERIF, fontWeight: 900, fontSize: 60, lineHeight: 1.4, color: INK, textAlign: "center", WebkitTextStroke: `5px ${C.paper}`, paintOrder: "stroke fill", opacity: t1, translate: `0 ${(1 - t1) * 20}px` }}>
          <div style={{ whiteSpace: "nowrap" }}>大家都<span style={{ color: f >= wSave ? RED : "inherit" }}>攒着钱不花</span>，</div>
          <div style={{ whiteSpace: "nowrap", fontSize: 54 }}>店越来越难做，国家是不是就<span style={{ color: f >= wPoor ? RED : "inherit" }}>更穷</span>了？</div>
        </div>
        <Screen>
          <g transform={`translate(330 ${FOOT - 20}) scale(${interpolate(f, [0, 8], [0.8, 1.35], CL)})`}><SaveJar level={jarLevel} /></g>
          {Array.from({ length: 6 }).map((_, i) => <Fly key={i} f={f} a={2 + i * 9} d={14} from={[330 + (i % 2 ? 60 : -60), 560]} to={[330, FOOT - 330]} lift={30} s={0.5}><Guinea /></Fly>)}
          <g transform={`translate(820 ${FOOT - 10}) scale(${popIn(f, wShop - 6) * 2.1})`}><IcoShop /></g>
          {f >= wShop && [0, 1, 2].map((i) => <path key={i} d={`M ${740 + i * 70} ${FOOT - 40} q 20 -16 40 0`} fill="none" stroke="#C9B9A2" strokeWidth={5} opacity={0.6 * fade(f, wShop + i * 6, 1e9, 6)} />)}
        </Screen>
        <TagDiv x={820} y={FOOT - 330} text="客人少了" col={CR.mute} k={popIn(f, wShop + 4)} size={38} />
      </Shot>
      {/* 镜头 2：书里的答案——罐里的钱飞到裁缝铺，换了一群人花；前提：得有人拿去用 */}
      <Shot f={f} a={s[1]} b={s[3]}>
        <Screen>
          <g transform={`translate(260 ${FOOT - 20}) scale(1.2)`}><SaveJar level={jarLevel} /></g>
          <Workshop x={800} />
          <CoinFlow f={f} a={wSpent - 4} n={6} gap={6} from={[260, FOOT - 300]} to={[800, FOOT - 220]} lift={160} />
          {f >= wOther && [0, 1].map((i) => <g key={i}><Sparkle x={[700, 900][i]} y={FOOT - 380} s={0.9} t={f + i * 9} /></g>)}
        </Screen>
        {[0, 1].map((i) => <Head key={i} id="folk_tailor" x={[720, 900][i]} y={FOOT - 470} k={popIn(f, wOther + i * 4)} size={110} />)}
        <RedStamp x={540} y={720} text="得拿去做生意" k={popIn(f, wUse)} size={68} rot={-6} />
        <Keyword text={f < wOther ? "书里的答案" : "花钱的人换了"} at={s[1] + 4} out={s[3]} size={72} />
      </Shot>
      {/* 镜头 3：三步（同一个问题），第三张红边放大 */}
      <Shot f={f} a={s[3]} b={L.dur + 20}>
        <ThreeRows20 f={f} at={[r1, r2, r3]} hot={r3} />
      </Shot>

      <Sfx at={2} name="coin" v={0.36} />
      {[1, 2, 3, 4, 5].map((i) => <Sfx key={`c${i}`} at={2 + i * 9 + 12} name="coin" v={0.12} />)}
      <Sfx at={wShop} name="blip" v={0.2} />
      <Sfx at={s[1] - 4} name="paper" v={0.28} />
      <Sfx at={wSpent} name="swish" v={0.22} />
      <Sfx at={wOther} name="twinkle" v={0.26} />
      <Sfx at={wUse} name="stamp" v={0.4} />
      <Sfx at={s[3] - 4} name="paper" v={0.28} />
      {[r1, r2, r3].map((a, i) => <Sfx key={`r${i}`} at={a - 4} name="pop" v={0.26} />)}
    </Shell>
  );
};

// ================================================================ 第一步：省下的钱，到底被谁花了
export const SSave: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("save");
  const W = useWordAt("save");
  const M = useTalk("save");
  const s = Array.from({ length: 8 }).map((_, i) => L.s(i));
  const w100 = W(0, "一百镑"), wBro = W(0, "哥哥全花在"), wHalf = W(0, "花一半"), w50 = W(0, "存下五十镑");
  const wLend = W(2, "借给了开作坊的阿禾"), wInt = W(2, "利息");
  const wCloth = W(3, "买布料"), wWage = W(3, "付工钱"), wFood = W(3, "买米买面"), wWorker = W(3, "干活的人");
  const wEat = W(4, "被吃掉"), wWho = W(4, "吃的人");
  const wThrift = W(5, "节俭"), wInvest = W(5, "储蓄变成投资"), wShop = W(5, "开店、开厂");
  const wSaveOnly = W(6, "直接靠省"), wNone = W(6, "一分也不会多");
  const wTwo = W(7, "两个裁缝");
  // 弟弟的一百镑：念到“花一半”拆成两摞（花 £50 / 存 £50），念到“存下五十镑”右边那摞飞进罐子
  const split = interpolate(f, [wHalf - 2, wHalf + 10], [0, 1], CL);

  return (
    <Shell dur={L.dur} enter="page" cam="still" zoom={0} kicks={[w50, wLend, wInvest, wTwo]}>
      <PaperTown f={f + 200} />
      {/* 镜头 1：双胞胎兄弟，一年都挣一百镑；哥哥全花在宴席上，弟弟花一半、存下五十镑；小满：钱存着不也躺着？ */}
      <Shot f={f} a={0} b={s[2]}>
        <Screen>
          <g transform={`translate(430 ${FOOT - 10}) scale(${popIn(f, 6) * 0.55})`}><FeastTable food={1} t={f} /></g>
          <g transform={`translate(200 ${FOOT - 560}) scale(${popIn(f, w100) * (1 - interpolate(f, [wBro, wBro + 16], [0, 1], CL))})`}><MoneyPile label="£100" /></g>
          <CoinFlow f={f} a={wBro} n={5} gap={4} from={[200, FOOT - 600]} to={[430, FOOT - 150]} lift={120} />
          {f < wHalf + 2 && <g transform={`translate(770 ${FOOT - 560}) scale(${popIn(f, w100 + 4)})`}><MoneyPile label="£100" n={5} /></g>}
          {f >= wHalf - 2 && (
            <>
              <g transform={`translate(${770 - 100 * split} ${FOOT - 560}) scale(${0.85 * split})`}><MoneyPile label="花 £50" n={3} dim={0.4} /></g>
              <g transform={`translate(${770 + 100 * split} ${FOOT - 560 + 420 * interpolate(f, [w50, w50 + 14], [0, 1], CL)}) scale(${0.85 * split * (1 - interpolate(f, [w50 + 8, w50 + 14], [0, 1], CL))})`}><MoneyPile label="存 £50" n={3} /></g>
            </>
          )}
          {f >= w50 - 2 && <g transform={`translate(960 ${FOOT - 20}) scale(${popIn(f, w50) * 0.75})`}><SaveJar level={interpolate(f, [w50 + 8, w50 + 16], [0.1, 0.5], CL)} label="£50" /></g>}
        </Screen>
        <Sprite id="folk_merchant" view="front" x={200} y={FOOT} h={460} seed={51} />
        <Sprite id="folk_merchant" view="front" x={770} y={FOOT} h={460} seed={52} />
        <TagDiv x={200} y={FOOT - 500} text="哥哥" col={TEAL} k={popIn(f, 4)} size={38} />
        <TagDiv x={770} y={FOOT - 500} text="弟弟" col={GOLD} k={popIn(f, 8)} size={38} />
        {f >= s[1] - 6 && <Sprite id="xiaoman3" view="front" x={580} y={FOOT + 10} h={300} seed={5} talk={M("小满", f)} o={fade(f, s[1], 1e9, 6)} />}
        <Emote x={640} y={FOOT - 320} kind="?" at={s[1] + 4} dur={40} />
        <Keyword text={f < w100 ? "第一步" : "两兄弟，各挣 £100"} at={2} out={s[2]} color={f < w100 ? GOLD : INK} size={f < w100 ? 96 : 72} />
      </Shot>
      {/* 镜头 2：弟弟把五十镑借给阿禾 → 一部分买布料、一部分付工钱 → 裁缝拿工钱买米买面；同一时间，哥哥那边被客人吃掉 */}
      <Shot f={f} a={s[2]} b={s[5]}>
        <Screen>
          <g transform={`translate(270 ${FOOT - 40}) scale(0.9)`}><SaveJar level={interpolate(f, [wLend, wLend + 20], [0.5, 0.05], CL)} label="£50" /></g>
          <Workshop x={800} />
          <CoinFlow f={f} a={wLend} n={5} gap={5} from={[270, FOOT - 300]} to={[800, FOOT - 240]} lift={150} />
          {/* 钱分两路：两枚去买布，三枚付工钱（同一笔五十镑，不重复算） */}
          <CoinFlow f={f} a={wCloth - 4} n={2} gap={5} from={[800, FOOT - 260]} to={[600, FOOT - 470]} lift={60} s={0.4} />
          {f >= wCloth - 2 && [0, 1].map((i) => <g key={i} transform={`translate(${560 + i * 90} ${FOOT - 440}) scale(${popIn(f, wCloth + 8 + i * 4) * 1.25})`}><IcoCloth /></g>)}
          <CoinFlow f={f} a={wWage - 4} n={3} gap={5} from={[800, FOOT - 260]} to={[880, FOOT - 600]} lift={60} s={0.4} />
          {f >= wFood && [0, 1].map((i) => <Fly key={`b${i}`} f={f} a={wFood + i * 6} d={16} from={[1040, FOOT - 200]} to={[[800, 960][i], FOOT - 560]} lift={80} s={0.75}><IcoBread /></Fly>)}
          {f >= wFood + 16 && [0, 1].map((i) => <g key={`bb${i}`} transform={`translate(${[800, 960][i]} ${FOOT - 470}) scale(0.6)`}><IcoBread /></g>)}
          {/* 一年存下的和花掉的，都被吃掉：左上小画框里客人吃哥哥的宴席，右边裁缝吃饭 */}
          {f >= s[4] - 6 && (
            <Card x={40} y={440} w={460} h={330} k={popIn(f, s[4])} accent={TEAL}>
              <g transform="translate(230 270) scale(0.55)"><FeastTable food={1 - interpolate(f, [wEat, wEat + 30], [0, 0.8], CL)} t={f} /></g>
            </Card>
          )}
        </Screen>
        {[0, 1].map((i) => <Head key={i} id="folk_tailor" x={[800, 960][i]} y={FOOT - 620} k={popIn(f, wWage + 6 + i * 4)} size={150} />)}
        {f >= s[4] - 6 && [0, 1].map((i) => <Head key={`g${i}`} id={["folk_mason", "folk_farmer"][i]} x={[170, 370][i]} y={545} k={popIn(f, s[4] + 4 + i * 4)} size={100} />)}
        <Sprite id="folk_merchant" view="front" x={100} y={FOOT} h={300} seed={52} o={f < s[4] - 6 ? 1 : 0} />
        <TagDiv x={530} y={FOOT - 20} text="借出 £50 收利息" col={GOLD} k={popIn(f, wInt) * (f < s[3] ? 1 : 0)} size={34} />
        <TagDiv x={605} y={FOOT - 330} text="买布" col={TEAL} k={popIn(f, wCloth + 6) * (f < s[4] ? 1 : 0)} size={32} />
        <TagDiv x={880} y={FOOT - 720} text="工钱 → 买米买面" col={GREEN} k={popIn(f, wWage + 8)} size={32} />
        <TagDiv x={270} y={740} text="哥哥的客人、仆人" col={TEAL} k={popIn(f, s[4] + 8)} size={32} />
        <Keyword text={f < s[3] ? "钱借给了阿禾" : f < s[4] ? "钱进了裁缝口袋" : "吃的人不一样"} at={s[2] + 4} out={s[5]} size={72} />
      </Shot>
      {/* 镜头 3：书里叫“节俭”；今天的说法：储蓄变成投资——省下的钱最后得有人拿去开店、开厂（不讲银行怎么放贷）；本钱多起来直接靠省 */}
      <Shot f={f} a={s[5]} b={s[7]}>
        <Screen>
          <Card x={60} y={440} w={960} h={460} k={popIn(f, s[5] + 2)}>
            <text x={480} y={80} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={GOLD} opacity={f >= wThrift ? 1 : 0}>书里叫：节俭</text>
            <g transform="translate(170 390) scale(0.75)"><SaveJar level={0.6} /></g>
            {f >= wShop - 4 && <g transform={`translate(560 395) scale(${popIn(f, wShop) * 1.3})`}><IcoShop /></g>}
            {f >= wShop && <g transform={`translate(800 395) scale(${popIn(f, wShop + 8) * 0.5})`}><Furnace t={f} /></g>}
            <CoinFlow f={f} a={wShop - 2} n={3} gap={5} from={[200, 260]} to={[560, 300]} lift={70} s={0.4} />
            <CoinFlow f={f} a={wShop + 8} n={3} gap={5} from={[200, 260]} to={[800, 300]} lift={90} s={0.4} />
            {f >= wInvest - 4 && <text x={480} y={150} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK} opacity={popIn(f, wInvest) > 0 ? 1 : 0}>今天的说法：储蓄变成投资</text>}
          </Card>
          {f >= s[6] - 4 && (
            <g opacity={popIn(f, s[6]) > 0 ? 1 : 0}>
              <rect x={80} y={940} width={920} height={250} rx={18} fill="#FBF7EF" stroke={INK} strokeWidth={3} />
              <text x={120} y={1010} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={INK}>挣得多</text>
              <rect x={280} y={975} width={640} height={50} rx={12} fill="#C9B9A2" />
              <text x={120} y={1120} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={INK}>本钱</text>
              <rect x={280} y={1085} width={interpolate(f, [wSaveOnly, wSaveOnly + 20], [40, 360], CL) * (f >= wNone ? 1 : 1)} height={50} rx={12} fill={GOLD} />
              {f >= wSaveOnly && <text x={660} y={1122} fontFamily={SERIF} fontWeight={900} fontSize={34} fill={GOLD}>← 只靠存下的</text>}
            </g>
          )}
        </Screen>
        <Keyword text={f < s[6] ? "存下 → 开店开厂" : "本钱，靠省出来"} at={s[5] + 4} out={s[7]} size={70} />
      </Shot>
      {/* 镜头 4：第一步的结论——阿禾靠这五十镑多雇了两个裁缝 */}
      <Shot f={f} a={s[7]} b={L.dur + 20}>
        <Screen><Workshop x={540} s={1.1} /></Screen>
        {[0, 1, 2, 3].map((i) => <Head key={i} id="folk_tailor" x={300 + i * 160} y={FOOT - 520 + (i % 2) * 30} k={popIn(f, i < 2 ? s[7] : wTwo + (i - 2) * 6)} size={120} />)}
        <Sprite id="ahe" view="tq_l" x={900} y={FOOT} h={420} seed={3} hops={[wTwo + 4]} />
        <TagDiv x={700} y={FOOT - 640} text="+2 个裁缝" col={GOLD} k={popIn(f, wTwo + 6)} size={38} />
      </Shot>
      <Verdict i={0} text="存下的钱，雇来了人" at={s[7] + 4} />

      <Sfx at={4} name="coin" v={0.3} />
      <Sfx at={w100} name="coin" v={0.24} />
      <Sfx at={wBro} name="whoosh" v={0.2} />
      <Sfx at={wHalf} name="pop" v={0.2} />
      <Sfx at={w50} name="ding" v={0.26} />
      <Sfx at={s[1] + 2} name="boing" v={0.18} />
      <Sfx at={s[2] - 2} name="paper" v={0.24} />
      <Sfx at={wLend} name="swish" v={0.22} />
      <Sfx at={wCloth} name="coin" v={0.16} />
      <Sfx at={wWage} name="coin" v={0.2} />
      <Sfx at={wFood} name="pop" v={0.18} />
      <Sfx at={wEat} name="blip" v={0.2} />
      <Sfx at={s[5] - 2} name="paper" v={0.24} />
      <Sfx at={wShop} name="coin" v={0.2} />
      <Sfx at={wInvest} name="ding" v={0.26} />
      <Sfx at={wSaveOnly} name="swish" v={0.2} />
      <Sfx at={s[7] + 4} name="stamp" v={0.4} />
      <Sfx at={wTwo} name="twinkle" v={0.26} />
    </Shell>
  );
};
