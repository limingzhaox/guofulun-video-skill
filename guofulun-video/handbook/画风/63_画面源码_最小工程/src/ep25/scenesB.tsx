// EP25 · 第二步：城里的自由是怎么换来的
// 小满：怎么翻身的？→ 比乡下早得多 → 包税：先包给别人、几年一包，后来包给城里人自己 → 全城一起担 → 永远包给全城、不涨，成了自由市 → 阿禾：多挣的都是自己的
// → 斯密推测的几项权利 → 自己的官、议会、规矩、城墙、守夜 → 本来能越收越多，却换成永远不涨的钱，斯密也觉得奇怪
// → 小雪：国王为什么让出去？→ 国王弱，大领主欺负城里人，三方又恨又怕 → 地主：也配平起平坐？→ 敌人的敌人（跷跷板）→ 关系越差，给的自由越多 → 多收税要城里点头、派代表
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SERIF, Sfx, Shell, useLines, useWordAt } from "../kit";
import { useTalk } from "../cast/talk";
import { Emote, Sprite } from "../v16/Sprite";
import { Head, TagDiv } from "../ep17/scenesA";
import { CoinFlow } from "../ep20/scenesA";
import { Card, Charter, CityWall, CoinStack, Farm, FOOT, GOLD, GREEN, Hall, IcoHouse, INK, Keyword, PaperTown, popIn, RED, RedStamp, Screen, Seesaw, Shot, TaxBox, TEAL, Town, Verdict } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MUTE = "#8A8076";

/** 画出来的箭头（画面坐标）：k = 画到多少（0–1），label = 箭头中间的字 */
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; k: number; col: string; label?: string; bend?: number }> = ({ x1, y1, x2, y2, k, col, label, bend = 0 }) => {
  if (k <= 0) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  return (
    <g>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, k)} />
      {k >= 1 && <path d="M -26 -16 L 0 0 L -26 16" transform={`translate(${x2} ${y2}) rotate(${(a * 180) / Math.PI})`} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
      {label && k >= 1 && (
        <g transform={`translate(${(x1 + 2 * mx + x2) / 4} ${(y1 + 2 * my + y2) / 4})`}>
          <rect x={-label.length * 19 - 14} y={-30} width={label.length * 38 + 28} height={56} rx={12} fill="#FBF7EF" stroke={col} strokeWidth={4} />
          <text y={12} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={INK}>{label}</text>
        </g>
      )}
    </g>
  );
};

const draw = (f: number, a: number, d = 14) => interpolate(f, [a - 2, a + d], [0, 1], CL);

export const SFree: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("free");
  const W = useWordAt("free");
  const M = useTalk("free");
  const s = Array.from({ length: 15 }).map((_, i) => L.s(i));
  const wUp = W(0, "翻身");
  const wTown = W(1, "城里人得到自由"), wFarm = W(1, "乡下种地的人"), wEarly = W(1, "早得多");
  const wOther = W(2, "包给别人"), wFix = W(2, "定好的钱"), wCollect = W(2, "自己去收"), wYears = W(2, "几年一包"), wSelf = W(2, "包给城里人自己");
  const wAll = W(3, "全城一起担"), wDecide = W(3, "自己定");
  const wEver = W(4, "永远包给了全城"), wNoRise = W(4, "再也不涨"), wFreeTown = W(4, "自由市"), wSelfRule = W(4, "自己管自己");
  const wDead = W(5, "定死的"), wMore = W(5, "多挣的");
  const wGuess = W(6, "推测"), wMarry = W(6, "嫁女儿"), wInherit = W(6, "继承家产"), wWill = W(6, "立遗嘱");
  const wOff = W(7, "自己的官"), wCouncil = W(7, "议会"), wRule = W(7, "定规矩"), wWall = W(7, "修城墙"), wWatch = W(7, "守夜");
  const wRich = W(8, "越来越富"), wCould = W(8, "越收越多"), wNever = W(8, "永远不涨"), wMany = W(8, "一个个"), wOdd = W(8, "觉得奇怪");
  const wGive = W(9, "让出去");
  const wWeak = W(10, "国王弱"), wBully = W(10, "欺负城里人"), wCant = W(10, "管不住"), wLook = W(10, "看不起城里人"), wHate = W(10, "城里人又恨又怕"), wHate2 = W(10, "也一样又恨又怕");
  const wEqual = W(11, "平起平坐");
  const wEnemy = W(12, "敌人的敌人"), wSafe = W(12, "越安全"), wGood = W(12, "越有好处"), wSide = W(12, "站到了国王一边");
  const wWorse = W(13, "关系越差"), wMoreFree = W(13, "自由就越多");
  const wStrong = W(14, "越来越强"), wTax = W(14, "多收税"), wNod = W(14, "城里点头"), wMeet = W(14, "全国开大会"), wRep = W(14, "派代表");
  const vAt = wRep + 30;

  // 包税：税箱从国王手边 → 包税的人 → 城里
  const bx = interpolate(f, [wOther, wOther + 16, wSelf, wSelf + 18], [360, 640, 640, 880], CL);
  const bs = interpolate(f, [wSelf + 6, wSelf + 18], [0.9, 0.4], CL);
  // 跷跷板：一开始大领主那头沉；城里人坐到国王这头，国王这头压下去
  const tilt = interpolate(f, [wSafe, wSafe + 22], [-12, 14], CL);
  const r = (tilt * Math.PI) / 180, endY = (d: number) => FOOT - 20 - 140 + (d < 0 ? -Math.sin(r) * 360 : Math.sin(r) * 360);
  const endX = (d: number) => 540 + d * Math.cos(r) * 360;
  // 城后来越来越强：城墙放大
  const cityS = interpolate(f, [wStrong - 4, wStrong + 16], [0.42, 0.55], CL);

  return (
    <Shell dur={L.dur} enter="page" cam="still" zoom={0} kicks={[wEver, wNever, wSide, wNod]}>
      <PaperTown f={f + 300} />
      {/* 镜头 1：小满——那城里人后来怎么翻身的？ */}
      <Shot f={f} a={0} b={s[1]}>
        <Screen><g transform={`translate(800 ${FOOT - 8}) scale(0.6)`}><CityWall t={f} /></g></Screen>
        <Sprite id="xiaoman3" view="tq_r" x={300} y={FOOT} h={560} seed={5} talk={M("小满", f)} hops={[4]} />
        <Emote x={370} y={FOOT - 600} kind="?" at={wUp} dur={40} />
        <Keyword text={f < 40 ? "第二步" : "城里人的转机"} at={2} out={s[1]} size={f < 40 ? 96 : 70} color={f < 40 ? TEAL : INK} />
      </Shot>
      {/* 镜头 2：城里人得到自由，比乡下种地的人早得多——一根时间线，小红点跑过去，城的旗先升，田的旗很晚才升 */}
      <Shot f={f} a={s[1]} b={s[2]}>
        <Screen>
          <path d="M 110 860 L 980 860" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <path d="M 956 842 L 984 860 L 956 878" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <text x={980} y={920} textAnchor="end" fontFamily={SERIF} fontWeight={900} fontSize={32} fill={MUTE}>时间</text>
          <circle cx={interpolate(f, [s[1] + 4, s[2] - 6], [110, 900], CL)} cy={860} r={16} fill={RED} />
          <g transform={`translate(300 820) scale(${popIn(f, wTown) * 0.45})`}><CityWall flag={1} /></g>
          <g transform={`translate(840 820) scale(${popIn(f, wFarm) * 0.9})`}><Farm w={200} lush={0.4} /></g>
          {f >= wEarly && <path d={`M 300 600 L 840 600`} stroke={GOLD} strokeWidth={6} strokeDasharray="14 10" opacity={popIn(f, wEarly) > 0 ? 1 : 0} />}
        </Screen>
        <TagDiv x={300} y={980} text="城里人" col={TEAL} k={popIn(f, wTown + 4)} size={34} />
        <TagDiv x={840} y={980} text="种地的人" col={GREEN} k={popIn(f, wFarm + 4)} size={34} />
        <TagDiv x={570} y={560} text="早得多" col={GOLD} k={popIn(f, wEarly)} size={40} />
        <Keyword text="城里先自由" at={s[1] + 4} out={s[2]} size={66} />
      </Shot>
      {/* 镜头 3：包税——国王把收税包给别人，包的人先交定好的钱、再自己去收，几年一包；后来包给城里人自己 */}
      <Shot f={f} a={s[2]} b={s[3]}>
        <Screen>
          <g transform={`translate(880 ${FOOT - 8}) scale(0.5)`} opacity={popIn(f, wSelf - 2) > 0 ? 1 : 0}><CityWall t={f} gate={0.85} /></g>
          <g transform={`translate(${bx} ${FOOT - (bs < 0.9 ? 12 : 40)}) scale(${bs})`}><TaxBox label="人头税" /></g>
          <CoinFlow f={f} a={wFix} n={3} gap={4} from={[740, FOOT - 380]} to={[200, FOOT - 380]} lift={90} />
          {[[620, 640], [760, 600], [900, 640]].map(([x, y], i) => <CoinFlow key={i} f={f} a={wCollect + i * 4} n={1} gap={3} from={[x, y + 40]} to={[740, FOOT - 300]} lift={40} />)}
          <g transform={`translate(520 560) scale(${popIn(f, wYears) * 0.5})`}><Charter years="几年一包" /></g>
        </Screen>
        <Sprite id="folk_king" view="front" x={190} y={FOOT + 4} h={470} seed={81} nods={[wFix + 20]} />
        {f < wSelf + 6 && <Sprite id="folk_merchant" view="front" x={760} y={FOOT + 4} h={440} seed={44} o={popIn(f, wOther - 2) * interpolate(f, [wSelf - 2, wSelf + 6], [1, 0], CL)} />}
        {[["folk_smith", 620, 640], ["folk_tailor", 760, 600], ["ahe", 900, 640]].map(([id, x, y], i) => (
          <Head key={i} id={id as string} x={x as number} y={y as number} k={popIn(f, wCollect - 6 + i * 3) * (f < wYears ? 1 : 0)} size={90} />
        ))}
        <TagDiv x={190} y={FOOT - 520} text="国王" col={TEAL} k={popIn(f, s[2] + 4)} size={32} />
        <TagDiv x={760} y={FOOT - 490} text="包税的人" col={GOLD} k={popIn(f, wOther + 4) * (f < wSelf ? 1 : 0)} size={32} />
        <TagDiv x={880} y={FOOT - 300} text="城里人自己" col={GREEN} k={popIn(f, wSelf + 10)} size={34} />
        <Keyword text="包税" at={s[2] + 4} out={s[3]} size={76} />
      </Shot>
      {/* 镜头 4：全城一起担这笔钱，怎么收、找谁收，城里人自己定——每家往同一个税箱里放钱 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <g transform={`translate(540 ${FOOT - 10}) scale(0.85)`}><Town n={5} /></g>
          <g transform="translate(540 780) scale(1.1)"><TaxBox label="全城" coins={interpolate(f, [wAll, wAll + 40], [0, 6], CL)} /></g>
          {[-340, -170, 0, 170, 340].map((x, i) => <CoinFlow key={i} f={f} a={wAll + i * 5} n={1} gap={3} from={[540 + x * 0.85, FOOT - 160]} to={[540, 690]} lift={60} />)}
        </Screen>
        <TagDiv x={540} y={560} text="自己定怎么收" col={GREEN} k={popIn(f, wDecide)} size={38} />
        <Keyword text="全城分摊" at={s[3] + 4} out={s[4]} size={66} />
      </Shot>
      {/* 镜头 5：永远包给全城，钱数再也不涨——契约上“几年一包”划掉改“永远”、盖“不涨”章；城楼升起“自由市”的旗 */}
      <Shot f={f} a={s[4]} b={s[5]}>
        <Screen>
          <g transform="translate(290 780) scale(0.95)"><Charter years="几年一包" cross={draw(f, wEver, 12)} next="永远" seal={interpolate(f, [wNoRise, wNoRise + 10], [0, 1], CL)} /></g>
          <g transform={`translate(790 ${FOOT - 8}) scale(0.6)`}><CityWall flag={interpolate(f, [wFreeTown - 4, wFreeTown + 8], [0, 1], CL)} flagText="自由市" t={f} houses={5} /></g>
        </Screen>
        <RedStamp x={790} y={640} text="自由市" k={popIn(f, wFreeTown + 2)} size={72} rot={-6} />
        <TagDiv x={790} y={FOOT - 300} text="自己管自己" col={TEAL} k={popIn(f, wSelfRule)} size={34} />
        <Keyword text="永远包出去" at={s[4] + 4} out={s[5]} size={66} />
      </Shot>
      {/* 镜头 6：阿禾——税定死了，多挣的都是自己的：税箱不动，自己那摞钱越堆越高 */}
      <Shot f={f} a={s[5]} b={s[6]}>
        <Screen>
          <g transform={`translate(640 ${FOOT - 40}) scale(0.8)`}><TaxBox label="定死" coins={2} /></g>
          <g transform={`translate(880 ${FOOT - 40}) scale(${popIn(f, wMore - 4) * 1.2})`}><CoinStack n={Math.round(interpolate(f, [wMore, wMore + 30], [1, 5], CL))} /></g>
        </Screen>
        <Sprite id="ahe" view="front" x={280} y={FOOT + 4} h={540} seed={33} talk={M("阿禾", f)} hops={[wMore]} />
        <Emote x={350} y={FOOT - 580} kind="♪" at={wMore + 4} dur={40} />
        <TagDiv x={640} y={FOOT - 260} text="不涨" col={RED} k={popIn(f, wDead)} size={34} />
        <TagDiv x={880} y={FOOT - 330} text="归自己" col={GREEN} k={popIn(f, wMore + 10)} size={34} />
      </Shot>
      {/* 镜头 7：斯密推测的几项权利——嫁女儿不用老爷点头、孩子能继承家产、自己能立遗嘱 */}
      <Shot f={f} a={s[6]} b={s[7]}>
        <Screen>
          {[["嫁女儿", wMarry], ["继承家产", wInherit], ["立遗嘱", wWill]].map(([t, a], i) => (
            <Card key={i} x={50 + i * 330} y={540} w={310} h={440} k={popIn(f, (a as number) - 4)} accent={[GOLD, TEAL, GREEN][i]}>
              {i === 0 && <path d="M 155 250 C 155 210 95 190 85 235 C 75 280 155 320 155 340 C 155 320 235 280 225 235 C 215 190 155 210 155 250 Z" fill={RED} opacity={0.85} />}
              {i === 1 && <g transform="translate(155 300) scale(1.4)"><IcoHouse /></g>}
              {i === 2 && <g transform="translate(155 250) scale(0.42)"><Charter title="遗嘱" rot={0} /></g>}
              <text x={155} y={400} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK}>{t as string}</text>
            </Card>
          ))}
          {f >= wMarry && <text x={215} y={620} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={MUTE}>不用老爷点头</text>}
        </Screen>
        <TagDiv x={540} y={1080} text="斯密的推测" col={MUTE} k={popIn(f, wGuess)} size={36} />
        <Keyword text="慢慢有了权利" at={s[6] + 4} out={s[7]} size={66} />
      </Shot>
      {/* 镜头 8：自己的官、议会、规矩，城墙一层层砌起来，城楼上点起守夜的灯 */}
      <Shot f={f} a={s[7]} b={s[8]}>
        <Screen>
          <g transform={`translate(540 ${FOOT - 8}) scale(0.95)`}><CityWall wall={interpolate(f, [wWall - 4, wWall + 36], [0.2, 1], CL)} lit={popIn(f, wWatch) > 0 ? 1 : 0} t={f} houses={4} /></g>
          <g transform={`translate(860 640) scale(${popIn(f, wCouncil) * 0.36})`}><Hall label="议会" /></g>
          <g transform={`translate(540 560) scale(${popIn(f, wRule) * 0.42})`}><Charter title="规矩" rot={2} /></g>
        </Screen>
        <Head id="folk_clerk" x={200} y={560} k={popIn(f, wOff)} size={120} />
        <TagDiv x={200} y={660} text="自己的官" col={TEAL} k={popIn(f, wOff + 4)} size={30} />
        <TagDiv x={270} y={FOOT - 380} text="守夜、守城" col={GOLD} k={popIn(f, wWatch + 4)} size={30} />
        <TagDiv x={860} y={700} text="议会" col={TEAL} k={popIn(f, wCouncil + 4)} size={32} />
        <Keyword text="官、议会、城墙" at={s[7] + 4} out={s[8]} size={66} />
      </Shot>
      {/* 镜头 9a：城越来越富，税本来能越收越多（虚线往上走），国王实际拿的是一条平线 */}
      <Shot f={f} a={s[8]} b={wMany - 6}>
        <Screen>
          <Card x={60} y={420} w={960} h={620} k={popIn(f, s[8] + 2)}>
            <path d="M 90 540 L 900 540 M 90 540 L 90 80" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            {[0, 1, 2, 3].map((i) => {
              const k = interpolate(f, [wRich + i * 6, wRich + i * 6 + 12], [0, 1], CL);
              return <rect key={i} x={170 + i * 190} y={540 - (120 + i * 90) * k} width={110} height={(120 + i * 90) * k} rx={10} fill={TEAL} opacity={0.75} />;
            })}
            <path d="M 150 440 L 850 130" stroke={GOLD} strokeWidth={8} strokeDasharray="18 12" strokeLinecap="round" pathLength={1} opacity={f >= wCould - 2 ? 1 : 0} />
            <text x={900} y={110} textAnchor="end" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={GOLD} opacity={f >= wCould ? 1 : 0}>本来能收</text>
            <path d="M 150 440 L 880 440" stroke={RED} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw(f, wNever, 16)} />
            <text x={480} y={596} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={RED} opacity={f >= wNever + 10 ? 1 : 0}>国王实收：永远不涨</text>
            <text x={110} y={60} fontFamily={SERIF} fontWeight={900} fontSize={30} fill={INK}>城里越来越富 →</text>
          </Card>
        </Screen>
        <Keyword text="本来能多收" at={s[8] + 4} out={wMany - 6} size={66} />
      </Shot>
      {/* 镜头 9b：在自己的国土里养出一个个自己管自己的城——斯密也觉得奇怪 */}
      <Shot f={f} a={wMany - 6} b={s[9]}>
        <Screen>
          <path d="M 120 520 Q 300 430 560 470 Q 860 420 960 560 Q 1000 820 900 1080 Q 640 1180 360 1120 Q 120 1060 100 820 Q 90 640 120 520 Z" fill="#EFE3C6" stroke={INK} strokeWidth={5} strokeDasharray="20 10" />
          {[[260, 640], [520, 600], [800, 660], [360, 880], [660, 860], [860, 960], [480, 1060]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${popIn(f, wMany + i * 4) * 0.2})`}><CityWall flag={1} /></g>
          ))}
          {f >= wOdd && <text x={540} y={820} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={150} fill={RED} opacity={popIn(f, wOdd) > 0 ? 1 : 0}>?</text>}
        </Screen>
        <TagDiv x={540} y={1180} text="国王自己的国土里" col={TEAL} k={popIn(f, wMany)} size={32} />
        <Keyword text="斯密也奇怪" at={wMany - 4} out={s[9]} size={66} />
      </Shot>
      {/* 镜头 10：小雪——国王为什么把钱和权都让出去？ */}
      <Shot f={f} a={s[9]} b={s[10]}>
        <Sprite id="female2" view="tq_r" x={300} y={FOOT} h={560} seed={9} talk={M("小雪", f)} hops={[s[9] + 4]} />
        <Sprite id="folk_king" view="front" x={800} y={FOOT + 4} h={460} seed={81} />
        <Emote x={370} y={FOOT - 600} kind="?" at={wGive} dur={40} />
        <Emote x={860} y={FOOT - 500} kind="sweat" at={wGive + 6} dur={50} />
      </Shot>
      {/* 镜头 11：三方关系——国王弱，大领主欺负城里人，国王管不住；三方又恨又怕 */}
      <Shot f={f} a={s[10]} b={s[11]}>
        <Screen>
          <Arrow x1={820} y1={600} x2={600} y2={950} k={draw(f, wBully)} col={RED} label={f >= wLook ? "看不起" : "欺负"} bend={-0.15} />
          <Arrow x1={480} y1={950} x2={760} y2={600} k={draw(f, wHate)} col={TEAL} label="又恨又怕" bend={-0.15} />
          <Arrow x1={330} y1={520} x2={720} y2={500} k={draw(f, wHate2)} col={GOLD} label="又恨又怕" bend={0.05} />
          {f >= wCant && f < wHate && <text x={300} y={820} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={70} fill={RED}>✗</text>}
        </Screen>
        <Head id="folk_king" x={230} y={520} k={popIn(f, s[10] + 2)} size={f < wWeak ? 150 : interpolate(f, [wWeak, wWeak + 10], [150, 110], CL)} />
        <Head id="folk_banker" x={860} y={520} k={popIn(f, s[10] + 6)} size={170} />
        <Head id="ahe" x={430} y={1040} k={popIn(f, s[10] + 10)} size={130} />
        <Emote x={280} y={420} kind="sweat" at={wCant} dur={50} />
        <TagDiv x={230} y={640} text="国王" col={TEAL} k={popIn(f, s[10] + 4)} size={30} />
        <TagDiv x={860} y={660} text="大领主" col={RED} k={popIn(f, s[10] + 8)} size={30} />
        <TagDiv x={430} y={1150} text="城里人" col={GOLD} k={popIn(f, s[10] + 12)} size={30} />
        <Keyword text={f < wLook ? "国王护不住" : "三方的恩怨"} at={s[10] + 4} out={s[11]} size={66} />
      </Shot>
      {/* 镜头 12：地主——一帮卖货的，也配跟我平起平坐？ */}
      <Shot f={f} a={s[11]} b={s[12]}>
        <Sprite id="folk_banker" view="front" x={720} y={FOOT} h={600} seed={71} talk={M("地主", f)} shakes={[wEqual]} />
        <Head id="ahe" x={250} y={FOOT - 200} k={popIn(f, s[11] + 6)} size={130} />
        <Emote x={300} y={FOOT - 300} kind="sweat" at={wEqual} dur={50} />
        <TagDiv x={720} y={FOOT - 660} text="大领主" col={RED} k={popIn(f, s[11] + 2)} size={34} />
      </Shot>
      {/* 镜头 13：敌人的敌人——跷跷板：一开始大领主那头沉；城里人坐到国王这头，国王这头压下去 */}
      <Shot f={f} a={s[12]} b={s[13]}>
        <Screen><g transform={`translate(540 ${FOOT - 20})`}><Seesaw tilt={tilt} /></g></Screen>
        <Head id="folk_banker" x={endX(-1)} y={endY(-1) - 60} k={popIn(f, s[12] + 2)} size={150} />
        <Head id="folk_king" x={endX(1) - 50} y={endY(1) - 60} k={popIn(f, s[12] + 6)} size={130} />
        {f >= wSafe + 14 ? <Head id="ahe" x={endX(1) + 70} y={endY(1) - 60} k={1} size={120} /> : null}
        {f >= wSafe - 6 && f < wSafe + 14 && <Head id="ahe" x={interpolate(f, [wSafe - 6, wSafe + 14], [540, endX(1) + 70], CL)} y={interpolate(f, [wSafe - 6, wSafe + 4, wSafe + 14], [560, 480, endY(1) - 60], CL)} k={1} size={120} />}
        <TagDiv x={540} y={560} text="敌人的敌人" col={RED} k={popIn(f, wEnemy) * (f < wSafe - 6 ? 1 : 0)} size={40} />
        <TagDiv x={endX(1)} y={endY(1) + 70} text="对国王有好处" col={GOLD} k={popIn(f, wGood)} size={30} />
        <RedStamp x={540} y={600} text="站一边" k={popIn(f, wSide + 4)} size={70} rot={-6} />
        <Keyword text="国王和城里人一伙" at={s[12] + 4} out={s[13]} size={66} />
      </Shot>
      {/* 镜头 14：跟大领主关系越差，给城里的自由越多——两根条一起往长里走 */}
      <Shot f={f} a={s[13]} b={s[14]}>
        <Screen>
          {[["跟大领主关系差", RED, wWorse], ["给城里的自由", TEAL, wMoreFree - 8]].map(([t, c, a], i) => {
            const k = interpolate(f, [(a as number) - 2, s[14] - 6], [0.15, 1], CL);
            return (
              <g key={i} transform={`translate(110 ${640 + i * 220})`}>
                <text y={-18} fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK}>{t as string}</text>
                <rect width={860} height={80} rx={16} fill="#EFE6D3" stroke={INK} strokeWidth={4} />
                <rect width={860 * k} height={80} rx={16} fill={c as string} opacity={f >= (a as number) - 2 ? 1 : 0} />
              </g>
            );
          })}
          <text x={540} y={1110} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={GOLD} opacity={f >= wMoreFree ? 1 : 0}>越差 → 越多</text>
        </Screen>
        <Head id="folk_king" x={160} y={480} k={popIn(f, s[13] + 2)} size={110} />
        <Keyword text="越差，给得越多" at={s[13] + 4} out={s[14]} size={66} />
      </Shot>
      {/* 镜头 15：城越来越强——国王想多收税，得城里点头；全国开大会商量加税，城里派代表去 */}
      <Shot f={f} a={s[14]} b={L.dur + 20}>
        <Screen>
          <g transform={`translate(860 ${FOOT - 8}) scale(${cityS})`}><CityWall t={f} lit={1} flag={1} /></g>
          <g transform={`translate(540 760) scale(${popIn(f, wMeet - 2) * 0.55})`}><Hall door={interpolate(f, [wRep - 4, wRep + 8], [0, 1], CL)} /></g>
          <g transform={`translate(330 ${FOOT - 40}) scale(0.7)`}><TaxBox coins={2} /></g>
          {f >= wTax && f < wNod + 10 && <g transform={`translate(${interpolate(f, [wTax, wTax + 12], [760, 520], CL)} ${FOOT - 260})`}><circle r={24} fill="#E9B949" stroke={INK} strokeWidth={3} /><text y={-40} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={RED}>?</text></g>}
        </Screen>
        <Sprite id="folk_king" view="front" x={160} y={FOOT + 4} h={440} seed={81} />
        <Head id="ahe" x={f < wRep ? 860 : interpolate(f, [wRep, wRep + 18], [860, 540], CL)} y={f < wRep ? FOOT - 360 : interpolate(f, [wRep, wRep + 18], [FOOT - 360, 680], CL)} k={popIn(f, wNod - 6)} size={100} />
        <RedStamp x={700} y={FOOT - 470} text="城里点头" k={popIn(f, wNod + 4) * (f < wMeet - 4 ? 1 : 0)} size={56} rot={-6} />
        <TagDiv x={860} y={FOOT - 290} text="越来越强" col={TEAL} k={popIn(f, wStrong) * (f < wNod - 6 ? 1 : 0)} size={30} />
        <TagDiv x={540} y={470} text="全国大会" col={TEAL} k={popIn(f, wMeet + 2)} size={34} />
        <TagDiv x={540} y={820} text="城里的代表" col={GOLD} k={popIn(f, wRep + 18)} size={32} />
        <Keyword text="加税，得城里点头" at={s[14] + 4} out={vAt} size={64} />
      </Shot>
      <Verdict i={1} text="税包下来，换来自由" at={vAt} />

      <Sfx at={4} name="paper" v={0.24} />
      <Sfx at={2} name="boing" v={0.16} />
      <Sfx at={s[1] - 2} name="paper" v={0.22} />
      <Sfx at={wTown} name="pop" v={0.18} />
      <Sfx at={wFarm} name="pop" v={0.18} />
      <Sfx at={wEarly} name="ding" v={0.2} />
      <Sfx at={s[2] - 2} name="paper" v={0.22} />
      <Sfx at={wOther} name="swish" v={0.2} />
      <Sfx at={wFix + 16} name="coin" v={0.22} />
      <Sfx at={wCollect + 12} name="coin" v={0.18} />
      <Sfx at={wYears} name="paper" v={0.22} />
      <Sfx at={wSelf} name="swish" v={0.2} />
      <Sfx at={wAll + 12} name="coin" v={0.22} />
      <Sfx at={wDecide} name="pop" v={0.18} />
      <Sfx at={wEver} name="erase" v={0.22} />
      <Sfx at={wNoRise} name="stamp" v={0.34} />
      <Sfx at={wFreeTown} name="twinkle" v={0.22} />
      <Sfx at={s[5]} name="boing" v={0.16} />
      <Sfx at={wMore} name="coin" v={0.22} />
      {[wMarry, wInherit, wWill].map((a, i) => <Sfx key={`r${i}`} at={a - 4} name="pop" v={0.22} />)}
      <Sfx at={wOff} name="pop" v={0.18} />
      <Sfx at={wWall} name="hammer" v={0.22} />
      <Sfx at={wWall + 18} name="hammer" v={0.18} />
      <Sfx at={wWatch} name="ding" v={0.2} />
      <Sfx at={wRich} name="blip" v={0.18} />
      <Sfx at={wNever} name="thump" v={0.22} />
      <Sfx at={wMany} name="pop" v={0.2} />
      <Sfx at={wOdd} name="boing" v={0.2} />
      <Sfx at={s[9]} name="boing" v={0.16} />
      <Sfx at={wBully} name="whoosh" v={0.2} />
      <Sfx at={wCant} name="buzz" v={0.18} />
      <Sfx at={wHate} name="whoosh" v={0.18} />
      <Sfx at={wHate2} name="whoosh" v={0.18} />
      <Sfx at={wEqual} name="thump" v={0.2} />
      <Sfx at={wSafe} name="swish" v={0.2} />
      <Sfx at={wSafe + 16} name="clack" v={0.24} />
      <Sfx at={wSide + 4} name="stamp" v={0.32} />
      <Sfx at={wWorse} name="blip" v={0.18} />
      <Sfx at={wStrong} name="pop" v={0.2} />
      <Sfx at={wNod + 4} name="stamp" v={0.3} />
      <Sfx at={wMeet} name="doorbell" v={0.2} />
      <Sfx at={wRep} name="swish" v={0.2} />
      <Sfx at={vAt} name="stamp" v={0.36} />
    </Shell>
  );
};
