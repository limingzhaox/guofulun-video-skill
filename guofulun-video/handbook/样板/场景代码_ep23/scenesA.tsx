// EP23 · 冷开场（10-29 新规矩：城里人和乡下人，谁养活谁？2.3 秒 → 农夫、阿禾顶嘴）→ 报《国富论》+ 三问（≤6 秒，18 秒进故事）
//       → 第一步（城里拿什么换乡下的粮：自己缝十天 vs 三天的粮换一件 → 小满：农夫不亏吗？→ 少花力气多换东西 → 一英里和二十英里的粮一个价 → 两边都赚）
// 同一个镇子从头用到尾：左边农夫的田，右边阿禾的裁缝铺
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, SERIF, Sfx, Shell, useLines, useWordAt } from "../kit";
import { Sparkle } from "../cast/crayon";
import { useTalk } from "../cast/talk";
import { Emote, Sprite } from "../v16/Sprite";
import { Head, TagDiv } from "../ep17/scenesA";
import { CoinFlow, Fly, Workshop } from "../ep20/scenesA";
import { Card, Cart, CoinStack, Days, Farm, FOOT, GOLD, GREEN, IcoBread, IcoGear, IcoSack, IcoShirt, IcoTimber, INK, Keyword, PaperTown, popIn, RED, RedStamp, Screen, Ship, Shot, TEAL, Town, Verdict } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const Grain: React.FC = () => <g><g transform="translate(-28 0)"><IcoSack /></g><g transform="translate(30 4) scale(0.9)"><IcoSack /></g></g>;

/** 左边乡下（田 + 粮袋）、右边城里（镇子），中间来回的箭头：开头和第一步结尾共用（回扣开头画面） */
export const CountryTown: React.FC<{ f: number; townN?: number; arrows?: number; q?: number }> = ({ f, townN = 3, arrows = 1, q = 0 }) => (
  <Screen>
    <g transform={`translate(250 ${FOOT - 10}) scale(1.25)`}><Farm w={380} lush={0.7} t={f} /></g>
    <g transform={`translate(250 ${FOOT - 200}) scale(1.5)`}><Grain /></g>
    <g transform={`translate(${townN > 4 ? 780 : 820} ${FOOT - 10}) scale(${townN > 4 ? 0.7 : 0.9})`}><Town n={townN} /></g>
    {arrows > 0 && (
      <g opacity={arrows}>
        <path d="M 420 800 Q 540 730 660 800" fill="none" stroke={GOLD} strokeWidth={9} strokeDasharray="18 12" strokeLinecap="round" />
        <path d="M 644 784 L 664 802 L 640 814" fill="none" stroke={GOLD} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 660 910 Q 540 980 420 910" fill="none" stroke={TEAL} strokeWidth={9} strokeDasharray="18 12" strokeLinecap="round" />
        <path d="M 436 894 L 416 912 L 440 924" fill="none" stroke={TEAL} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
    {q > 0 && <text x={540} y={900} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={130} fill={RED} opacity={q}>?</text>}
  </Screen>
);

/** 三问卡：问题 + 下面一行概念名，第三张红边放大（不加“出人意料”） */
const ThreeRows23: React.FC<{ f: number; at: [number, number, number]; hot?: number }> = ({ f, at, hot = 1e9 }) => {
  const rows = [
    { col: GOLD, title: "城里拿什么换乡下的粮？", term: "书里叫“城乡之间的大买卖”", icon: <g transform="translate(150 175)"><Grain /><g transform="translate(70 -10) scale(0.8)"><IcoShirt /></g></g> },
    { col: TEAL, title: "为什么先有乡下才有城？", term: "书里说“吃饭比享受在先”", icon: <g transform="translate(150 160) scale(1.6)"><IcoBread /></g> },
    { col: GREEN, title: "地便宜的地方，余钱会去哪？", term: "书里举“北美殖民地”", icon: <g transform="translate(150 200) scale(0.5)"><Ship /></g> },
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
              <text x={290} y={108} fontFamily={SERIF} fontWeight={900} fontSize={44} fill={INK}>{r.title}</text>
              <text x={290} y={172} fontFamily={SERIF} fontWeight={900} fontSize={32} fill={r.col}>{r.term}</text>
            </Card>
          </g>
        );
      })}
    </Screen>
  );
};

// ================================================================ 冷开场（慢语速：一句拌嘴 + 农夫、阿禾顶嘴）
export const SHook: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("hook");
  const W = useWordAt("hook");
  const M = useTalk("hook");
  const s = [0, 1, 2].map((i) => L.s(i));
  const wWho = W(0, "谁养活谁");
  const wGrain = W(1, "都是我种的"), wShirt = W(2, "可是我做的");
  const t1 = interpolate(f, [0, 6], [0, 1], CL);

  return (
    <Shell dur={L.dur} enter="none" cam="still" zoom={0} kicks={[wWho, wShirt]}>
      <PaperTown f={f} />
      {/* 镜头 1：第 0 帧——一行大字 + 左边田和粮、右边镇子，中间来回的箭头；念到“谁养活谁”中间冒问号 */}
      <Shot f={f} a={0} b={s[1]}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 270, fontFamily: SERIF, fontWeight: 900, fontSize: 76, lineHeight: 1.4, color: INK, textAlign: "center", WebkitTextStroke: `5px ${C.paper}`, paintOrder: "stroke fill", opacity: t1, translate: `0 ${(1 - t1) * 20}px`, whiteSpace: "nowrap" }}>
          城里乡下，<span style={{ color: f >= wWho ? RED : "inherit" }}>谁养活谁</span>？
        </div>
        <CountryTown f={f} arrows={interpolate(f, [2, 10], [0, 1], CL)} q={popIn(f, wWho + 2)} />
        <TagDiv x={250} y={FOOT - 420} text="乡下" col={GOLD} k={popIn(f, 4)} size={42} />
        <TagDiv x={820} y={FOOT - 300} text="城里" col={TEAL} k={popIn(f, 8)} size={42} />
      </Shot>
      {/* 镜头 2（2.6 秒起）：农夫和阿禾顶嘴——一个举着粮袋，一个举着衣服 */}
      <Shot f={f} a={s[1]} b={L.dur + 20} d={4}>
        <Screen>
          <g transform={`translate(390 ${FOOT - 380}) scale(${popIn(f, wGrain - 4) * 1.2})`}><Grain /></g>
          <g transform={`translate(700 ${FOOT - 400}) scale(${popIn(f, wShirt - 4) * 1.4})`}><IcoShirt /></g>
        </Screen>
        <Sprite id="folk_farmer" view="front" x={220} y={FOOT} h={600} seed={61} talk={M("农夫", f)} jolts={[wGrain]} />
        <Sprite id="ahe" view="tq_l" x={870} y={FOOT} h={600} seed={3} talk={M("阿禾", f)} jolts={[wShirt]} />
        <Emote x={290} y={FOOT - 640} kind="!" at={s[1] + 4} dur={40} />
        <Emote x={940} y={FOOT - 640} kind="!" at={s[2] + 4} dur={40} />
        <TagDiv x={220} y={FOOT - 690} text="乡下 · 农夫" col={GOLD} k={popIn(f, s[1] + 2)} size={34} />
        <TagDiv x={870} y={FOOT - 690} text="城里 · 阿禾" col={TEAL} k={popIn(f, s[2] - 4)} size={34} />
        <Keyword text="城里 vs 乡下" at={s[1]} size={72} />
      </Shot>

      <Sfx at={2} name="ding" v={0.34} />
      <Sfx at={wWho + 2} name="pop" v={0.24} />
      <Sfx at={s[1]} name="boing" v={0.18} />
      <Sfx at={wGrain} name="thump" v={0.22} />
      <Sfx at={wShirt} name="pop" v={0.24} />
    </Shell>
  );
};

// ================================================================ 第 3 句报《国富论》+ 三问（正常语速）
export const SMenu: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("menu");
  const W = useWordAt("menu");
  const s = [0, 1].map((i) => L.s(i));
  const wAll = W(0, "全靠乡下"), wNot = W(0, "不是从乡下抢来的");
  // 三张卡每张间隔不超过 1.5 秒
  const r1 = W(1, "城里拿什么换");
  const r2 = Math.min(W(1, "为什么先有乡下"), r1 + 45);
  const r3 = Math.min(W(1, "地便宜"), r2 + 45);

  return (
    <Shell dur={L.dur} enter="none" cam="still" zoom={0} kicks={[wNot, r3]}>
      <PaperTown f={f + 100} />
      {/* 镜头 3：《国富论》的答案——粮一袋袋运进城（全靠乡下），衣服、农具运回乡下；红章“不是抢来的” */}
      <Shot f={f} a={0} b={s[1]}>
        <CountryTown f={f} />
        <Screen>
          {[0, 1, 2].map((i) => <Fly key={`g${i}`} f={f} a={wAll - 6 + i * 6} d={18} from={[300, FOOT - 160]} to={[760, FOOT - 120]} lift={140} s={0.7}><IcoSack /></Fly>)}
          {[0, 1].map((i) => <Fly key={`s${i}`} f={f} a={wNot - 6 + i * 6} d={18} from={[780, FOOT - 160]} to={[300, FOOT - 200]} lift={120} s={0.8}>{i === 0 ? <IcoShirt /> : <IcoGear />}</Fly>)}
        </Screen>
        <RedStamp x={540} y={640} text="不是抢来的" k={popIn(f, wNot + 6)} size={70} rot={-6} />
        <Keyword text="《国富论》的答案" at={2} out={s[1]} size={66} />
      </Shot>
      {/* 镜头 4：三步（同一个问题），三张卡间隔 ≤ 1.5 秒，第三张红边放大 */}
      <Shot f={f} a={s[1]} b={L.dur + 20}>
        <ThreeRows23 f={f} at={[r1, r2, r3]} hot={r3} />
      </Shot>

      <Sfx at={wAll} name="swish" v={0.2} />
      <Sfx at={wNot + 6} name="stamp" v={0.36} />
      <Sfx at={s[1] - 4} name="paper" v={0.28} />
      {[r1, r2, r3].map((a, i) => <Sfx key={`r${i}`} at={a - 4} name="pop" v={0.26} />)}
    </Shell>
  );
};

// ================================================================ 第一步：城里拿什么换乡下的粮
export const STrade: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("trade");
  const W = useWordAt("trade");
  const M = useTalk("trade");
  const s = Array.from({ length: 7 }).map((_, i) => L.s(i));
  const wSew = W(0, "自己缝"), w10 = W(0, "十天");
  const w3 = W(1, "相当于三天活计的粮"), wSwap = W(1, "跟阿禾换"), wWear = W(1, "当天就穿上了"), wTools = W(1, "犁、锄头、车轮");
  const wLess = W(3, "少得多的劳动"), wMore = W(3, "多得多的东西"), wAhe = W(3, "不用自己下地");
  const w1 = W(4, "一英里外"), w20 = W(4, "二十英里外"), wPrice = W(4, "卖一个价"), wSave = W(4, "省下一大笔");
  const wNoGrain = W(6, "一粒粮也不长"), wOnly = W(6, "在城里找到了买家"), wBoth = W(6, "两边都赚了");

  return (
    <Shell dur={L.dur} enter="page" cam="still" zoom={0} kicks={[w10, wWear, wPrice, wBoth]}>
      <PaperTown f={f + 200} />
      {/* 镜头 1：要是没有裁缝——农夫自己缝一件衣服，一缝十天 */}
      <Shot f={f} a={0} b={s[1]}>
        <Screen>
          <g transform="translate(180 700)"><Days f={f} n={10} at={wSew + 4} gap={3} col={RED} label={f >= w10 ? "自己缝一件：10 天" : undefined} /></g>
          <g transform={`translate(560 ${FOOT - 360}) scale(${popIn(f, wSew) * 1.3})`}><IcoShirt col="#9AA6B2" /></g>
        </Screen>
        <Sprite id="folk_farmer" view="front" x={260} y={FOOT} h={480} seed={61} />
        <Emote x={320} y={FOOT - 520} kind="sweat" at={w10} dur={50} />
        <Keyword text={f < 40 ? "第一步" : "自己动手，太慢"} at={2} out={s[1]} size={f < 40 ? 96 : 72} color={f < 40 ? GOLD : INK} />
      </Shot>
      {/* 镜头 2：相当于三天活计的粮换阿禾一件衣服，当天就穿上；犁、锄头、车轮也这么换。
          10-29 第二版：裁缝铺和阿禾整体往左挪（原来阿禾贴着右边、挡住招牌），日历写“相当于 3 天活计”（原来“种粮：3 天”像粮三天长熟） */}
      <Shot f={f} a={s[1]} b={s[2]}>
        <Screen>
          <g transform="translate(140 640)"><Days f={f} n={3} at={w3 - 4} gap={4} col={GREEN} label="相当于 3 天活计" /></g>
          <Workshop x={640} />
          <Fly f={f} a={wSwap - 4} d={20} from={[260, FOOT - 220]} to={[600, FOOT - 200]} lift={140} s={0.9}><Grain /></Fly>
          <Fly f={f} a={wWear - 10} d={18} from={[640, FOOT - 240]} to={[300, FOOT - 420]} lift={120} s={1.1}><IcoShirt /></Fly>
          {f >= wWear + 8 && <g transform="translate(300 940) scale(1.1)"><IcoShirt /></g>}
          {f >= wTools - 4 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${460 + i * 110} 860) scale(${popIn(f, wTools + i * 5) * 1.1})`}>{[<IcoTimber key="a" />, <IcoGear key="b" t={f} />, <g key="c" transform="scale(0.5)"><Cart t={f} /></g>][i]}</g>)}
        </Screen>
        <Sprite id="folk_farmer" view="front" x={200} y={FOOT} h={440} seed={61} hops={[wWear + 4]} />
        <Sprite id="ahe" view="tq_l" x={860} y={FOOT} h={360} seed={3} />
        <TagDiv x={570} y={770} text="犁、锄头、车轮" col={TEAL} k={popIn(f, wTools + 4)} size={32} />
        <Keyword text={f < wWear ? "三天活计，换一件" : "衣服到手"} at={s[1] + 4} out={s[2]} size={72} />
      </Shot>
      {/* 镜头 3：小满——粮都让城里人吃了，农夫不亏吗？ */}
      <Shot f={f} a={s[2]} b={s[3]}>
        <Screen>
          <g transform={`translate(780 ${FOOT - 20}) scale(0.55)`}><Town n={3} /></g>
          <g transform={`translate(560 ${FOOT - 60}) scale(1.1)`}><Grain /></g>
        </Screen>
        <Sprite id="xiaoman3" view="tq_r" x={300} y={FOOT} h={600} seed={5} talk={M("小满", f)} hops={[s[2] + 4]} />
        <Emote x={370} y={FOOT - 640} kind="?" at={s[2] + 6} dur={40} />
      </Shot>
      {/* 镜头 4：书里说，乡下人花少得多的劳动，换回多得多的东西；阿禾也靠这些粮，不用自己下地。
          10-29 第二版：原来两根柱子单位不一样（力气 vs 东西），改成同一个单位——天：自己缝 10 格，用粮换 3 格 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <Card x={60} y={470} w={960} h={420} k={popIn(f, s[3] + 2)}>
            <text x={40} y={114} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={RED}>自己缝</text>
            <g transform="translate(250 100)"><Days f={f} n={10} at={s[3] + 6} gap={2} col={RED} w={50} /></g>
            <text x={40} y={234} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={GREEN}>用粮换</text>
            <g transform="translate(250 220)"><Days f={f} n={3} at={wLess - 4} gap={4} col={GREEN} w={50} /></g>
            <text x={40} y={354} fontFamily={SERIF} fontWeight={900} fontSize={38} fill={INK} opacity={f >= wMore ? 1 : 0}>换回来</text>
            {f >= wMore && [0, 1, 2].map((i) => <g key={i} transform={`translate(${300 + i * 140} 340) scale(${popIn(f, wMore + i * 4) * 0.8})`}>{[<IcoShirt key="a" />, <IcoGear key="b" t={f} />, <IcoTimber key="c" />][i]}</g>)}
            <text x={930} y={400} textAnchor="end" fontFamily={SERIF} fontWeight={900} fontSize={24} fill="#8A8076">天数为举例</text>
          </Card>
        </Screen>
        <Head id="ahe" x={880} y={1010} k={popIn(f, wAhe - 6)} size={130} />
        <Screen><Fly f={f} a={wAhe - 4} d={16} from={[600, 1060]} to={[860, 1030]} lift={60} s={0.8}><IcoBread /></Fly></Screen>
        <TagDiv x={880} y={1120} text="阿禾：不用下地" col={TEAL} k={popIn(f, wAhe + 4)} size={32} />
        <Keyword text="少花力气，多换东西" at={s[3] + 4} out={s[4]} size={70} />
      </Shot>
      {/* 镜头 5：一英里外的粮和二十英里外运来的卖一个价，近处的农夫光运费就省下一大笔 */}
      <Shot f={f} a={s[4]} b={s[5]}>
        <Screen>
          <g transform={`translate(540 ${FOOT - 20}) scale(0.55)`}><Town n={4} /></g>
          <path d="M 60 1200 L 1020 1200" stroke="#C9B9A2" strokeWidth={10} strokeLinecap="round" strokeDasharray="30 18" />
          <g transform={`translate(${interpolate(f, [w1 - 6, w1 + 20], [300, 380], CL)} 1200) scale(0.5)`}><Cart t={f} cargo={<Grain />} /></g>
          {f >= w20 - 6 && <g transform={`translate(${interpolate(f, [w20 - 6, wPrice + 10], [1150, 760], CL)} 1200) scale(0.5)`}><Cart t={f} flip cargo={<Grain />} /></g>}
          {f >= wPrice - 4 && [380, 760].map((x, i) => <g key={i} transform={`translate(${x} 1010) scale(${popIn(f, wPrice + i * 4)})`}><rect x={-80} y={-34} width={160} height={68} rx={12} fill="#FFFBF0" stroke={INK} strokeWidth={3} /><text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={RED}>一个价</text></g>)}
        </Screen>
        <TagDiv x={380} y={1270} text="1 英里" col={GOLD} k={popIn(f, w1)} size={32} />
        <TagDiv x={800} y={1270} text="20 英里" col={INK} k={popIn(f, w20)} size={32} />
        <TagDiv x={380} y={900} text="近处：省下运费" col={GREEN} k={popIn(f, wSave)} size={34} />
        <Keyword text="近处的粮更赚" at={s[4] + 4} out={s[5]} size={70} />
      </Shot>
      {/* 镜头 6：农夫——这么一算，我还赚了 */}
      <Shot f={f} a={s[5]} b={s[6]}>
        <Screen>
          <g transform={`translate(640 ${FOOT - 20}) scale(1.2)`}><CoinStack n={4} /></g>
          <g transform="translate(820 1060) scale(1.1)"><IcoShirt /></g>
        </Screen>
        <Sprite id="folk_farmer" view="front" x={330} y={FOOT} h={620} seed={61} talk={M("农夫", f)} hops={[s[5] + 4]} />
        <Emote x={400} y={FOOT - 660} kind="♪" at={s[5] + 6} dur={40} />
      </Shot>
      {/* 镜头 7：回扣开头那张图——城里一粒粮也不长，全靠乡下；乡下的余粮，也在城里找到了买家：两边都赚 */}
      <Shot f={f} a={s[6]} b={L.dur + 20}>
        <CountryTown f={f} />
        <Screen>
          <CoinFlow f={f} a={wOnly - 6} n={4} gap={5} from={[780, FOOT - 200]} to={[300, FOOT - 220]} lift={120} />
          {f >= wBoth && [0, 1].map((i) => <Sparkle key={i} x={[260, 800][i]} y={FOOT - 380} s={1.1} t={f + i * 9} />)}
        </Screen>
        <TagDiv x={820} y={FOOT - 300} text="一粒粮也不长" col={TEAL} k={popIn(f, wNoGrain)} size={34} />
        <TagDiv x={250} y={FOOT - 420} text="余粮找到买家" col={GOLD} k={popIn(f, wOnly - 4)} size={34} />
      </Shot>
      <Verdict i={0} text="城里乡下，换着过日子" at={s[6] + 4} />

      <Sfx at={4} name="paper" v={0.24} />
      <Sfx at={w10} name="thump" v={0.22} />
      <Sfx at={s[1] - 2} name="paper" v={0.22} />
      <Sfx at={wSwap} name="swish" v={0.22} />
      <Sfx at={wWear} name="ding" v={0.26} />
      {[0, 1, 2].map((i) => <Sfx key={`t${i}`} at={wTools + i * 5} name="pop" v={0.16} />)}
      <Sfx at={s[2] + 4} name="boing" v={0.18} />
      <Sfx at={s[3] - 2} name="paper" v={0.22} />
      <Sfx at={wMore} name="pour" v={0.2} />
      <Sfx at={s[4] - 2} name="paper" v={0.22} />
      <Sfx at={wPrice} name="ding" v={0.24} />
      <Sfx at={wSave} name="coin" v={0.24} />
      <Sfx at={s[5] + 4} name="coin" v={0.22} />
      <Sfx at={s[6] - 2} name="paper" v={0.22} />
      <Sfx at={wOnly} name="coin" v={0.2} />
      <Sfx at={s[6] + 4} name="stamp" v={0.4} />
    </Shell>
  );
};
