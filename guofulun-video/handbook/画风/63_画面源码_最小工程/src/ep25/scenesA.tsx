// EP25 · 冷开场（你知道吗，几百年前的欧洲，农奴攒了钱，就算冒着被抓回去的风险，也要带进城。→ 农夫：这点钱让老爷知道了，就归他了……）
//       → 报《国富论》（乡下归老爷管；城里有城墙、有自己的规矩）+ 三问
//       → 第一步（城里人一开始也不自由：手艺人、小买卖的，听老爷管 → 挑着货赶集 → 过路、过桥、摆摊都交钱 → 交一笔按人头算的钱，路上的钱就免了，可年年都得交）
// 同一个世界从头用到尾：左边老爷的庄园和田，右边有城墙城门的城，农夫揣着钱袋往城门走
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, SERIF, Sfx, Shell, useLines, useWordAt } from "../kit";
import { useTalk } from "../cast/talk";
import { Emote, Sprite } from "../v16/Sprite";
import { Head, TagDiv } from "../ep17/scenesA";
import { CoinFlow, Fly } from "../ep20/scenesA";
import { Cart } from "../ep22/world";
import { Card, Charter, CityWall, Days, Farm, FOOT, GOLD, GREEN, INK, Keyword, Manor, PaperTown, popIn, Purse, RED, RedStamp, Screen, Shield, Shot, TEAL, TollGate, Town, Verdict } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MUTE = "#8A8076";

/** 同一个世界：左边老爷的庄园和田（乡下），右边有城墙的城；manorK / cityK 控制什么时候冒出来，gate = 城门开多大 */
export const GateWorld: React.FC<{ f: number; manorK?: number; cityK?: number; gate?: number; lit?: number; flag?: number; road?: number }> = ({ f, manorK = 1, cityK = 1, gate = 0, lit = 0, flag = 0, road = 1 }) => (
  <Screen>
    {manorK > 0 && (
      <g opacity={Math.min(1, manorK)}>
        <g transform={`translate(240 ${FOOT - 150}) scale(${0.45 * Math.min(1.05, manorK)})`}><Manor t={f} /></g>
        <g transform={`translate(250 ${FOOT - 8}) scale(${0.9 * Math.min(1.05, manorK)})`}><Farm w={320} lush={0.2} t={f} /></g>
      </g>
    )}
    {road > 0 && cityK > 0 && <path d={`M 420 ${FOOT - 10} Q 560 ${FOOT - 40} 700 ${FOOT - 10}`} fill="none" stroke="#B49C76" strokeWidth={10} strokeDasharray="20 16" strokeLinecap="round" opacity={0.7 * Math.min(1, road, cityK)} />}
    {cityK > 0 && <g opacity={Math.min(1, cityK)} transform={`translate(790 ${FOOT - 8}) scale(${0.72 * Math.min(1.05, cityK)})`}><CityWall gate={gate} lit={lit} flag={flag} t={f} /></g>}
  </Screen>
);

/** 三问卡：问题 + 下面一行概念名，第三张红边放大 */
const ThreeRows25: React.FC<{ f: number; at: [number, number, number]; hot?: number }> = ({ f, at, hot = 1e9 }) => {
  const rows = [
    { col: GOLD, title: "城里人一开始就自由吗？", term: "书里说：穷得像走街串巷的货郎", icon: <g transform="translate(150 190) scale(1.1)"><Purse full={0.3} /></g> },
    { col: TEAL, title: "城里的自由是怎么换来的？", term: "书里叫“自由市”", icon: <g transform="translate(150 118) scale(0.5)"><Charter years="永远" rot={4} /></g> },
    { col: GREEN, title: "城里富了，乡下跟着富了吗？", term: "书里说：城富了，乡下照样可能穷", icon: <g transform="translate(150 196) scale(0.3)"><CityWall lit={1} /></g> },
  ];
  const h = popIn(f, hot);
  return (
    <Screen>
      {rows.map((r, i) => {
        const k = popIn(f, at[i]);
        if (k <= 0) return null;
        const big = i === 2 ? 1 + 0.06 * h : 1;
        const y0 = 390 + i * 270;
        return (
          <g key={i} transform={`translate(540 ${y0 + 115}) scale(${big}) translate(-540 ${-(y0 + 115)})`}>
            <Card x={60} y={y0} w={960} h={230} k={Math.min(1, k)} accent={r.col}>
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

// ================================================================ 冷开场（慢语速）
export const SHook: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("hook");
  const W = useWordAt("hook");
  const M = useTalk("hook");
  const s = [0, 1].map((i) => L.s(i));
  // ★★★★★：第 0 帧顶部一行大字；念到“欧洲”出庄园和田、“农奴”农夫出来、“攒了钱”钱袋、“被抓回去”老爷冒头、“带进城”出城墙、农夫往城门走、大字“带进城”变红
  const wEu = W(0, "欧洲"), wSerf = W(0, "农奴"), wSave = W(0, "攒了钱"), wCatch = W(0, "被抓回去"), wCity = W(0, "带进城");
  const wKnow = W(1, "让老爷知道了"), wHis = W(1, "归他了"), wIn = W(1, "带进城"), wYear = W(1, "躲他一年"), wMine = W(1, "我自己的了");
  const t1 = interpolate(f, [0, 6], [0, 1], CL);
  // 农夫：念到“带进城”从庄园边往城门走
  const fx: [number, number][] = [[0, 360], [wCity + 2, 360], [wCity + 40, 560]];

  return (
    <Shell dur={L.dur} enter="none" cam="still" zoom={0} kicks={[wCatch, wCity, wHis]}>
      <PaperTown f={f} />
      {/* 镜头 1：第 0 帧只有一行大字，东西跟着念到的词出来 */}
      <Shot f={f} a={0} b={s[1]}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 270, fontFamily: SERIF, fontWeight: 900, fontSize: 74, lineHeight: 1.4, color: INK, textAlign: "center", WebkitTextStroke: `5px ${C.paper}`, paintOrder: "stroke fill", opacity: t1, translate: `0 ${(1 - t1) * 20}px`, whiteSpace: "nowrap" }}>
          攒的钱，为啥要<span style={{ color: f >= wCity ? RED : "inherit" }}>带进城</span>？
        </div>
        <GateWorld f={f} manorK={popIn(f, wEu - 2)} cityK={popIn(f, wCity - 2)} gate={interpolate(f, [wCity + 20, wCity + 34], [0, 0.8], CL)} />
        {f >= wSerf - 4 && <Sprite id="folk_farmer" view="front" x={fx} y={FOOT + 6} h={360} seed={61} walk={[[wCity + 2, wCity + 40]]} o={popIn(f, wSerf - 2)} />}
        <Screen>{f >= wSave - 4 && <g transform={`translate(${f < wCity + 2 ? 470 : interpolate(f, [wCity + 2, wCity + 40], [470, 670], CL)} ${FOOT - 150}) scale(${popIn(f, wSave)})`}><Purse full={1} /></g>}</Screen>
        <Head id="folk_banker" x={120} y={FOOT - 650} k={popIn(f, wCatch - 4)} size={120} />
        <Emote x={170} y={FOOT - 730} kind="!" at={wCatch} dur={50} />
        <TagDiv x={210} y={FOOT - 440} text="老爷的庄园" col={GOLD} k={popIn(f, wEu + 4)} size={32} />
        <TagDiv x={120} y={FOOT - 560} text="会追回去" col={RED} k={popIn(f, wCatch + 4)} size={30} />
        <TagDiv x={790} y={FOOT - 330} text="城" col={TEAL} k={popIn(f, wCity + 4)} size={36} />
      </Shot>
      {/* 镜头 2：农夫说委屈——让老爷知道，钱就归他；带进城躲一年，人和钱都是自己的 */}
      <Shot f={f} a={s[1]} b={L.dur + 20} d={6}>
        <Screen>
          <g transform={`translate(860 ${FOOT - 8}) scale(0.5)`} opacity={popIn(f, wIn - 2) > 0 ? 1 : 0}><CityWall gate={interpolate(f, [wIn, wIn + 12], [0, 0.8], CL)} /></g>
          <g transform={`translate(470 ${FOOT - 300}) scale(${1.3})`}><Purse full={f < wHis ? 1 : f < wMine ? 0.35 : 1} glow={popIn(f, wMine)} /></g>
          <Fly f={f} a={wHis} d={20} from={[470, FOOT - 360]} to={[820, 700]} lift={80} s={0.9}><circle r={22} fill="#E9B949" stroke="#3E2A20" strokeWidth={3} /></Fly>
          {f >= wYear - 4 && <g transform="translate(470 600) scale(0.62)"><Days f={f} n={12} at={wYear - 4} gap={2} col={TEAL} label="一年" /></g>}
        </Screen>
        <Sprite id="folk_farmer" view="front" x={250} y={FOOT} h={540} seed={61} talk={M("农夫", f)} jolts={[wKnow]} o={interpolate(f, [s[1], s[1] + 8], [0, 1], CL)} />
        <Head id="folk_banker" x={820} y={700} k={popIn(f, wKnow - 2) * (f < wIn ? 1 : 0)} size={130} />
        <Emote x={320} y={FOOT - 580} kind="sweat" at={wKnow} dur={50} />
        <Emote x={320} y={FOOT - 580} kind="♪" at={wMine} dur={40} />
        <TagDiv x={250} y={FOOT - 600} text="农夫" col={TEAL} k={popIn(f, s[1] + 4)} size={34} />
        <Keyword text={f < wIn ? "钱藏不住" : "躲一年，就自由"} at={s[1] + 6} size={72} />
      </Shot>

      <Sfx at={2} name="ding" v={0.3} />
      <Sfx at={wEu} name="pop" v={0.16} />
      <Sfx at={wSerf} name="pop" v={0.16} />
      <Sfx at={wSave} name="coin" v={0.2} />
      <Sfx at={wCatch} name="thump" v={0.22} />
      <Sfx at={wCity} name="whoosh" v={0.2} />
      <Sfx at={s[1]} name="boing" v={0.16} />
      <Sfx at={wHis} name="coin" v={0.22} />
      <Sfx at={wYear} name="tick" v={0.2} />
      <Sfx at={wMine} name="twinkle" v={0.22} />
    </Shell>
  );
};

// ================================================================ 第 3 句报《国富论》+ 三问（正常语速）
export const SMenu: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("menu");
  const W = useWordAt("menu");
  const s = [0, 1].map((i) => L.s(i));
  const wBook = W(0, "国富论"), wLord = W(0, "乡下归老爷管"), wWall = W(0, "城墙"), wRule = W(0, "自己的规矩"), wNo = W(0, "老爷管不着"), wSafe = W(0, "才安全");
  // 三张卡每张间隔不超过 1.5 秒
  const r1 = W(1, "一开始就自由吗") - 6;
  const r2 = Math.min(W(1, "怎么换来的") - 10, r1 + 45);
  const r3 = Math.min(W(1, "乡下跟着富了吗") - 10, r2 + 45);
  // 老爷想进城门：念到“管不着”被城墙挡回去
  const lx = interpolate(f, [wNo - 14, wNo, wNo + 10], [300, 600, 520], CL);

  return (
    <Shell dur={L.dur} enter="none" cam="still" zoom={0} kicks={[wBook, wSafe, r3]}>
      <PaperTown f={f + 100} />
      {/* 镜头 3：《国富论》——乡下归老爷管；城墙、自己的规矩，老爷管不着，人和钱才安全 */}
      <Shot f={f} a={0} b={s[1]}>
        <GateWorld f={f} />
        <Sprite id="folk_farmer" view="front" x={560} y={FOOT + 6} h={340} seed={61} />
        <Screen>
          <g transform={`translate(${lx} ${FOOT - 380})`} opacity={f >= wNo - 16 ? 1 : 0}>
            <text textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={90} fill={RED} opacity={f >= wNo ? 1 : 0}>✗</text>
          </g>
          <g transform={`translate(790 ${FOOT - 420}) scale(${popIn(f, wSafe) * 0.85})`}><Shield /></g>
          <g transform={`translate(960 ${FOOT - 470}) scale(${popIn(f, wRule) * 0.34})`}><Charter title="规矩" rot={6} /></g>
        </Screen>
        <Head id="folk_banker" x={f >= wNo - 16 ? lx : 240} y={FOOT - 470} k={popIn(f, wLord)} size={110} />
        <RedStamp x={540} y={560} text="《国富论》" k={popIn(f, wBook + 4)} size={70} rot={-6} />
        <TagDiv x={240} y={FOOT - 330} text="老爷管" col={GOLD} k={popIn(f, wLord + 4)} size={34} />
        <TagDiv x={700} y={FOOT - 290} text="城墙" col={TEAL} k={popIn(f, wWall)} size={34} />
        <Keyword text="城里才安全" at={2} out={s[1]} size={66} />
      </Shot>
      {/* 镜头 4：三步（同一个问题），三张卡间隔 ≤ 1.5 秒，第三张红边放大 */}
      <Shot f={f} a={s[1]} b={L.dur + 20}>
        <ThreeRows25 f={f} at={[r1, r2, r3]} hot={r3} />
      </Shot>

      <Sfx at={wBook + 4} name="stamp" v={0.34} />
      <Sfx at={wLord} name="pop" v={0.18} />
      <Sfx at={wRule} name="paper" v={0.2} />
      <Sfx at={wNo} name="thump" v={0.24} />
      <Sfx at={wSafe} name="ding" v={0.22} />
      <Sfx at={s[1] - 4} name="paper" v={0.28} />
      {[r1, r2, r3].map((a, i) => <Sfx key={`r${i}`} at={a - 4} name="pop" v={0.26} />)}
    </Shell>
  );
};

/** 集市的摊子（原点在地面中心） */
const Stall: React.FC<{ col?: string }> = ({ col = "#C25B4A" }) => (
  <g>
    <path d="M -90 0 L -90 -150 M 90 0 L 90 -150" stroke="#7A5236" strokeWidth={8} strokeLinecap="round" />
    <path d="M -110 -150 L 110 -150 L 90 -200 L -90 -200 Z" fill={col} stroke="#3E2A20" strokeWidth={4} />
    {[-66, -22, 22, 66].map((x) => <path key={x} d={`M ${x} -150 L ${x * 0.82} -200`} stroke="#FFF7E8" strokeWidth={10} opacity={0.7} />)}
    <path d="M -96 -60 L 96 -60 L 96 -40 L -96 -40 Z" fill="#C9A47A" stroke="#3E2A20" strokeWidth={4} />
  </g>
);

// ================================================================ 第一步：城里人一开始也不自由
export const SPoor: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("poor");
  const W = useWordAt("poor");
  const M = useTalk("poor");
  const s = Array.from({ length: 5 }).map((_, i) => L.s(i));
  const wCountry = W(0, "乡下人");
  const wCraft = W(1, "手艺人"), wTrade = W(1, "做小买卖的"), wSerf = W(1, "和农奴一样"), wLord = W(1, "听老爷管");
  const wPoor = W(2, "又穷"), wLook = W(2, "看不起"), wFair1 = W(2, "一个集"), wFair2 = W(2, "另一个集"), wPed = W(2, "货郎");
  const wRoad = W(3, "过条路"), wBridge = W(3, "过座桥"), wStall = W(3, "摆个摊"), wShort = W(3, "不够交的");
  const wEasy = W(4, "省事的办法"), wKing = W(4, "国王或者领主"), wPay = W(4, "交一笔钱"), wFree = W(4, "就不用再交了"), wYear = W(4, "年年都得交");
  const vAt = wYear + 24;
  const tolls = [wRoad, wBridge, wStall];
  const paid = tolls.filter((a) => f >= a + 16).length;
  // 阿禾挑着货从这个集赶到那个集
  const ax: [number, number][] = [[0, 230], [wFair1, 230], [wFair2 + 30, 820]];

  return (
    <Shell dur={L.dur} enter="page" cam="still" zoom={0} kicks={[wSerf, wShort, wYear]}>
      <PaperTown f={f + 200} dusk={interpolate(f, [s[1] - 10, s[1] + 10, s[3] - 10, s[3] + 10], [0, 0.26, 0.26, 0], CL)} />
      {/* 镜头 1：城里人一开始，也不比乡下人自由——老爷一个人牵着城和乡下 */}
      <Shot f={f} a={0} b={s[1]}>
        <Screen>
          <g transform={`translate(290 ${FOOT - 10}) scale(0.62)`}><Town n={4} /></g>
          <g transform={`translate(790 ${FOOT - 10}) scale(1)`} opacity={popIn(f, wCountry - 4) > 0 ? 1 : 0}><Farm w={360} lush={0.3} t={f} /></g>
          {[[290, FOOT - 200], [790, FOOT - 160]].map(([x, y], i) => (
            <path key={i} d={`M 540 650 L ${x} ${y}`} stroke={GOLD} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" pathLength={1} strokeDashoffset={0} opacity={interpolate(f, [8 + i * 10, 20 + i * 10], [0, 1], CL)} />
          ))}
        </Screen>
        <Head id="folk_banker" x={540} y={600} k={popIn(f, 4)} size={140} />
        <TagDiv x={290} y={FOOT - 310} text="城里人" col={TEAL} k={popIn(f, 6)} size={34} />
        <TagDiv x={790} y={FOOT - 280} text="乡下人" col={GREEN} k={popIn(f, wCountry)} size={34} />
        <Keyword text={f < 40 ? "第一步" : "一样不自由"} at={2} out={s[1]} size={f < 40 ? 96 : 70} color={f < 40 ? GOLD : INK} />
      </Shot>
      {/* 镜头 2：罗马帝国倒了以后，城里住的多半是手艺人、做小买卖的；和农奴差不多，得听老爷管 */}
      <Shot f={f} a={s[1]} b={s[2]}>
        <Screen>
          <g transform={`translate(540 ${FOOT - 10}) scale(0.8)`} opacity={0.55}><Town n={5} dim={1} /></g>
          {[180, 400, 680, 900].map((x, i) => (
            <path key={i} d={`M 540 560 L ${x} 840`} stroke={GOLD} strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" opacity={interpolate(f, [wLord - 4 + i * 3, wLord + 6 + i * 3], [0, 1], CL)} />
          ))}
          {f >= wSerf - 2 && <text x={790} y={930} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={80} fill={RED} opacity={popIn(f, wSerf) > 0 ? 1 : 0}>≈</text>}
        </Screen>
        <Head id="folk_smith" x={180} y={920} k={popIn(f, wCraft)} size={130} />
        <Head id="folk_tailor" x={400} y={920} k={popIn(f, wCraft + 6)} size={130} />
        <Head id="ahe" x={680} y={920} k={popIn(f, wTrade)} size={130} />
        <Head id="folk_farmer" x={900} y={920} k={popIn(f, wSerf)} size={130} />
        <Head id="folk_banker" x={540} y={520} k={popIn(f, wLord - 4)} size={130} />
        <TagDiv x={290} y={1040} text="手艺人" col={TEAL} k={popIn(f, wCraft + 4)} size={32} />
        <TagDiv x={680} y={1040} text="做小买卖的" col={GOLD} k={popIn(f, wTrade + 4)} size={32} />
        <TagDiv x={900} y={1040} text="农奴" col={MUTE} k={popIn(f, wSerf + 4)} size={32} />
        <Keyword text="罗马倒下之后" at={s[1] + 4} out={s[2]} size={66} />
      </Shot>
      {/* 镜头 3：又穷又被看不起，挑着货从一个集赶到另一个集，像今天的货郎 */}
      <Shot f={f} a={s[2]} b={s[3]}>
        <Screen>
          <g transform={`translate(190 ${FOOT - 10})`} opacity={popIn(f, wFair1 - 4) > 0 ? 1 : 0}><Stall col="#C25B4A" /></g>
          <g transform={`translate(890 ${FOOT - 10})`} opacity={popIn(f, wFair2 - 4) > 0 ? 1 : 0}><Stall col="#3F6E73" /></g>
          <g transform={`translate(${interpolate(f, [wFair1, wFair2 + 30], [330, 920], CL) - 150} ${FOOT}) scale(0.7)`}><Cart t={f > wFair1 && f < wFair2 + 30 ? f : 0} cargo={<g transform="scale(0.9)"><Purse full={0.25} /></g>} /></g>
        </Screen>
        <Sprite id="ahe" view={f < wFair1 ? "front" : "tq_r"} x={ax} y={FOOT + 4} h={380} seed={33} walk={[[wFair1, wFair2 + 30]]} />
        <Head id="folk_banker" x={860} y={560} k={popIn(f, wLook - 2)} size={110} />
        <Emote x={910} y={480} kind="…" at={wLook} dur={50} />
        <TagDiv x={300} y={600} text="穷" col={MUTE} k={popIn(f, wPoor)} size={40} />
        <TagDiv x={860} y={680} text="看不起" col={RED} k={popIn(f, wLook + 2)} size={32} />
        <TagDiv x={540} y={760} text="今天的货郎" col={GOLD} k={popIn(f, wPed)} size={36} />
        <Keyword text="挑着货赶集" at={s[2] + 4} out={s[3]} size={66} />
      </Shot>
      {/* 镜头 4：阿禾——过条路、过座桥、摆个摊都交钱，钱袋一路变瘪 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <path d={`M 120 ${FOOT - 4} L 1000 ${FOOT - 4}`} stroke="#B49C76" strokeWidth={10} strokeDasharray="22 16" strokeLinecap="round" opacity={0.7} />
          {[["过路", 470], ["过桥", 680], ["摆摊", 890]].map(([t, x], i) => (
            <g key={i} transform={`translate(${x} ${FOOT - 140}) scale(${popIn(f, tolls[i] - 4) * 0.9})`}><TollGate label={t as string} /></g>
          ))}
          <g transform={`translate(250 ${FOOT - 560}) scale(1.5)`}><Purse full={1 - paid * 0.3} /></g>
          {tolls.map((a, i) => <CoinFlow key={i} f={f} a={a} n={2} gap={4} from={[250, FOOT - 640]} to={[[470, 680, 890][i], FOOT - 300]} lift={80} />)}
        </Screen>
        <Sprite id="ahe" view="front" x={250} y={FOOT + 4} h={420} seed={33} talk={M("阿禾", f)} jolts={[wShort]} />
        <Emote x={330} y={FOOT - 430} kind="sweat" at={wShort} dur={50} />
        <Keyword text="处处交钱" at={s[3] + 4} out={s[4]} size={70} />
      </Shot>
      {/* 镜头 5：省事的办法——每年给国王或领主交一笔按人头算的钱，路上的关卡就抬杆放行；可这笔钱年年都得交 */}
      <Shot f={f} a={s[4]} b={L.dur + 20}>
        <Screen>
          {[["过路", 500], ["过桥", 660]].map(([t, x], i) => (
            <g key={i} transform={`translate(${x} ${FOOT - 130}) scale(0.8)`} opacity={popIn(f, s[4] + 4) > 0 ? 1 : 0}><TollGate label={t as string} up={interpolate(f, [wFree - 2 + i * 6, wFree + 10 + i * 6], [0, 1], CL)} /></g>
          ))}
          <CoinFlow f={f} a={wPay} n={3} gap={4} from={[230, FOOT - 420]} to={[830, FOOT - 420]} lift={90} />
          {f >= wYear - 6 && <g transform="translate(330 560)"><Days f={f} n={6} at={wYear - 6} gap={4} col={GOLD} label="年年交" /></g>}
          {f >= wYear - 6 && <CoinFlow f={f} a={wYear} n={5} gap={5} from={[230, FOOT - 420]} to={[830, FOOT - 420]} lift={70} />}
        </Screen>
        <Sprite id="ahe" view={f < wFree + 8 ? "front" : "tq_r"} x={[[0, 230], [wFree + 8, 230], [wFree + 40, 300]]} y={FOOT + 4} h={400} seed={33} walk={[[wFree + 8, wFree + 40]]} hops={[wFree + 2]} />
        <Sprite id="folk_king" view="front" x={830} y={FOOT + 4} h={480} seed={81} o={popIn(f, wKing - 4)} nods={[wPay + 20]} />
        <TagDiv x={830} y={FOOT - 530} text="国王 / 领主" col={TEAL} k={popIn(f, wKing)} size={32} />
        <TagDiv x={540} y={FOOT - 520} text="按人头算" col={GOLD} k={popIn(f, wPay + 8)} size={34} />
        <TagDiv x={520} y={FOOT - 300} text="路上的钱免了" col={GREEN} k={popIn(f, wFree + 6) * (f < wYear - 6 ? 1 : 0)} size={32} />
        <Keyword text={f < wYear - 6 ? "交一笔，免一路" : "可年年都要交"} at={s[4] + 4} out={vAt} size={66} />
      </Shot>
      <Verdict i={0} text="城里人起初，也不自由" at={vAt} />

      <Sfx at={4} name="paper" v={0.24} />
      <Sfx at={wCountry} name="pop" v={0.16} />
      <Sfx at={s[1] - 2} name="paper" v={0.22} />
      <Sfx at={wCraft} name="pop" v={0.18} />
      <Sfx at={wTrade} name="pop" v={0.18} />
      <Sfx at={wSerf} name="thump" v={0.2} />
      <Sfx at={wLord} name="swish" v={0.18} />
      <Sfx at={s[2] - 2} name="paper" v={0.22} />
      <Sfx at={wFair1} name="clack" v={0.18} />
      <Sfx at={wLook} name="buzz" v={0.16} />
      <Sfx at={s[3]} name="boing" v={0.16} />
      {tolls.map((a, i) => <Sfx key={`t${i}`} at={a + 14} name="coin" v={0.22} />)}
      <Sfx at={wShort} name="thump" v={0.2} />
      <Sfx at={s[4] - 2} name="paper" v={0.22} />
      <Sfx at={wPay + 16} name="coin" v={0.22} />
      <Sfx at={wFree} name="clack" v={0.2} />
      <Sfx at={wYear} name="tick" v={0.2} />
      <Sfx at={vAt} name="stamp" v={0.36} />
    </Shell>
  );
};
