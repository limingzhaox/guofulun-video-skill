// EP23 · 第二步（为什么先有乡下才有城：吃饭比享受在先 → 手艺人一个个搬来，小村成小镇 → 天天开的集市 → 小雪：镇子越大乡下越吃亏？→ 粮越好卖、地越种越好
//       → 养活城里人的是乡下多出来的粮，这些粮也能从很远的地方运来）
//       → 第三步（暗场：地便宜的地方，余钱会去哪：本钱也会被别的去处吸走 → 北美殖民地荒地便宜，阿禾买地自己种 → 自己的主人 → 本钱放地上踏实
//       → 小满：地便宜不是好事吗？→ 余钱先买地，给远处做货的作坊开得晚 → 反过来，没有便宜地可买的地方，才开作坊给远处做货）
//       10-29 第二版按外部诊断改掉过头的说法（城长多大看乡下、手艺人都去种地、镇子长得慢、要等地都有了主）
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, SERIF, Sfx, Shell, useLines, useWordAt } from "../kit";
import { CR, Sparkle } from "../cast/crayon";
import { useTalk } from "../cast/talk";
import { Emote, Sprite } from "../v16/Sprite";
import { Head, TagDiv } from "../ep17/scenesA";
import { CoinFlow, Fly, Workshop } from "../ep20/scenesA";
import { Card, Cart, CoinStack, Farm, FOOT, GOLD, GREEN, IcoBread, IcoChair, IcoGear, IcoSack, IcoShirt, INK, Keyword, PaperTown, popIn, RED, Screen, Ship, Shot, TEAL, Town, Verdict } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ================================================================ 第二步：为什么先有乡下，才有城
export const SGrow: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("grow");
  const W = useWordAt("grow");
  const M = useTalk("grow");
  const s = Array.from({ length: 8 }).map((_, i) => L.s(i));
  const wEat = W(1, "吃饭比享受在先"), wSurplus = W(1, "多出粮来"), wFeed = W(1, "养得起不种地的人");
  const trades = ["铁匠", "木匠", "鞋匠", "裁缝", "屠夫", "面包师"].map((w) => W(2, w));
  const wTown = W(2, "小村就成了小镇");
  const wFair = W(3, "天天开的集市");
  const wSell = W(5, "越卖得掉"), wBetter = W(5, "越种越好");
  const wSize = W(7, "养活城里人的"), wSur = W(7, "乡下多出来的粮"), wFarG = W(7, "很远的地方");
  // 小镇一栋栋长出来：念到第几个手艺人就冒出第几栋房子（每栋 8 帧长满）
  const townN = trades.reduce((n, a) => n + interpolate(f, [a - 4, a + 4], [0, 1], CL), 0);
  const slotX = [0, -1, 1, -2, 2, -3].map((x) => 470 + x * 105);
  const who = ["folk_smith", "folk_mason", "folk_shoemaker", "ahe", "folk_butcher", ""];

  return (
    <Shell dur={L.dur} enter={{ ink: [540, 1000] }} cam="still" zoom={0} kicks={[wEat, wTown, wFarG]}>
      <PaperTown f={f + 400} />
      {/* 镜头 1：第二步——只有田，镇子那块地还空着，一个问号 */}
      <Shot f={f} a={0} b={s[1]}>
        <Screen>
          <g transform={`translate(300 ${FOOT - 10})`}><Farm w={420} lush={0.6} t={f} /></g>
          <path d="M 560 1250 L 1000 1250" stroke="#C9B9A2" strokeWidth={6} strokeDasharray="20 14" />
          <text x={780} y={1120} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={120} fill={RED} opacity={popIn(f, 10) > 0 ? 1 : 0}>?</text>
        </Screen>
        <Sprite id="folk_farmer" view="front" x={300} y={FOOT} h={380} seed={61} />
        <Keyword text="第二步" at={2} color={TEAL} size={96} />
      </Shot>
      {/* 镜头 2：吃饭比享受在先——先吃饱，再享受；地里多出来的粮，才养得起不种地的人 */}
      <Shot f={f} a={s[1]} b={s[2]}>
        <Screen>
          <Card x={60} y={470} w={960} h={360} k={popIn(f, s[1] + 2)}>
            <g transform={`translate(170 200) scale(${popIn(f, wEat) * 1.8})`}><IcoBread /></g>
            <text x={170} y={300} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={GOLD} opacity={f >= wEat ? 1 : 0}>先吃饱</text>
            <path d="M 300 180 L 420 180 M 400 162 L 424 180 L 400 198" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={f >= wEat + 6 ? 1 : 0} />
            <g transform={`translate(540 210) scale(${popIn(f, wEat + 10) * 1.6})`}><IcoChair /></g>
            <text x={540} y={300} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={TEAL} opacity={f >= wEat + 10 ? 1 : 0}>再享受</text>
            {f >= wSurplus - 4 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${730 + i * 70} 230) scale(${popIn(f, wSurplus + i * 5) * 0.9})`}><IcoSack /></g>)}
            <text x={800} y={300} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={GREEN} opacity={f >= wSurplus ? 1 : 0}>多出来的粮</text>
          </Card>
        </Screen>
        {[0, 1].map((i) => <Head key={i} id={["folk_smith", "folk_shoemaker"][i]} x={[720, 880][i]} y={960} k={popIn(f, wFeed + i * 5)} size={110} />)}
        <TagDiv x={800} y={1070} text="不种地的人" col={GREEN} k={popIn(f, wFeed + 6)} size={32} />
        <Keyword text="饭在前，享受在后" at={s[1] + 4} out={s[2]} size={70} />
      </Shot>
      {/* 镜头 3：手艺人一个个搬到农夫旁边，屠夫、面包师跟来——小村成了小镇 */}
      <Shot f={f} a={s[2]} b={s[3]}>
        <Screen>
          <g transform={`translate(470 ${FOOT - 10}) scale(0.75)`}><Town n={townN} /></g>
          <g transform={`translate(920 ${FOOT - 10})`}><Farm w={240} lush={0.7} t={f} /></g>
          {f >= trades[5] - 2 && <g transform={`translate(${slotX[5]} ${FOOT - 250}) scale(${popIn(f, trades[5]) * 1.1})`}><IcoBread /></g>}
        </Screen>
        {who.map((id, i) => id && <Head key={i} id={id} x={slotX[i]} y={FOOT - 230} k={popIn(f, trades[i])} size={90} />)}
        {["铁匠", "木匠", "鞋匠", "裁缝", "屠夫", "面包师"].map((t, i) => <TagDiv key={`t${i}`} x={slotX[i]} y={FOOT - 330 - (i % 2) * 50} text={t} col={i === 3 ? TEAL : INK} k={popIn(f, trades[i] + 3)} size={30} />)}
        <Sprite id="folk_farmer" view="front" x={940} y={FOOT} h={320} seed={61} />
        <Keyword text={f < wTown ? "一个个搬来" : "小村成了小镇"} at={s[2] + 4} out={s[3]} size={72} />
      </Shot>
      {/* 镜头 4：镇子像天天开的集市——粮进镇，衣服、农具出镇 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <g transform={`translate(470 ${FOOT - 10}) scale(0.75)`}><Town n={6} /></g>
          <g transform={`translate(920 ${FOOT - 10})`}><Farm w={240} lush={0.7} t={f} /></g>
          {Array.from({ length: 6 }).map((_, i) => <Fly key={`in${i}`} f={f} a={s[3] + 4 + i * 12} d={16} from={[920, FOOT - 120]} to={[slotX[i % 6], FOOT - 140]} lift={100} s={0.6}><IcoSack /></Fly>)}
          {Array.from({ length: 5 }).map((_, i) => <Fly key={`out${i}`} f={f} a={s[3] + 12 + i * 12} d={16} from={[slotX[(i + 2) % 6], FOOT - 160]} to={[920, FOOT - 160]} lift={120} s={0.7}>{i % 2 ? <IcoGear /> : <IcoShirt />}</Fly>)}
        </Screen>
        <TagDiv x={470} y={FOOT - 330} text="天天开的集市" col={GOLD} k={popIn(f, wFair)} size={38} />
        <Keyword text="粮进来，货出去" at={s[3] + 4} out={s[4]} size={72} />
      </Shot>
      {/* 镜头 5：小雪——那镇子越大，乡下不就越吃亏？ */}
      <Shot f={f} a={s[4]} b={s[5]}>
        <Screen>
          <g transform={`translate(760 ${FOOT - 10}) scale(0.6)`}><Town n={6} /></g>
        </Screen>
        <Sprite id="female2" view="tq_r" x={300} y={FOOT} h={580} seed={7} talk={M("小雪", f)} />
        <Emote x={360} y={FOOT - 620} kind="?" at={s[4] + 6} dur={40} />
      </Shot>
      {/* 镜头 6–7：不会——镇上人越多，乡下的粮越卖得掉，地越种越好；农夫：我的粮反倒不愁卖了 */}
      <Shot f={f} a={s[5]} b={s[7]}>
        <Screen>
          <g transform={`translate(700 ${FOOT - 10}) scale(0.62)`}><Town n={6} /></g>
          <g transform={`translate(260 ${FOOT - 10})`}><Farm w={380} lush={interpolate(f, [wBetter - 10, wBetter + 20], [0.5, 1], CL)} t={f} /></g>
          {[0, 1, 2, 3].map((i) => <Fly key={i} f={f} a={wSell - 6 + i * 6} d={16} from={[260, FOOT - 150]} to={[700, FOOT - 140]} lift={120} s={0.7}><IcoSack /></Fly>)}
          <CoinFlow f={f} a={wSell + 10} n={4} gap={5} from={[700, FOOT - 160]} to={[260, FOOT - 200]} lift={110} />
        </Screen>
        {f >= s[6] - 4 && <Sprite id="folk_farmer" view="front" x={250} y={FOOT} h={460} seed={61} talk={M("农夫", f)} hops={[s[6] + 4]} />}
        <Emote x={310} y={FOOT - 500} kind="♪" at={s[6] + 6} dur={40} />
        <TagDiv x={260} y={FOOT - 300} text="地越种越好" col={GREEN} k={popIn(f, wBetter) * (f < s[6] - 4 ? 1 : 0)} size={34} />
        <Keyword text="人越多，粮越好卖" at={s[5] + 4} out={s[7]} size={70} />
      </Shot>
      {/* 镜头 8：养活城里人的，是乡下多出来的粮——粮袋从田里送到手艺人手上；这些粮不一定出在附近——右边开进一辆“远方供给”的运粮车。
          10-29 第二版：原来是“乡下多出的粮 / 镇子有多大”两根条一起长（单位不同，又像附近的田决定城多大），改成供给关系 */}
      <Shot f={f} a={s[7]} b={L.dur + 20}>
        <Screen>
          <g transform={`translate(190 ${FOOT - 10})`}><Farm w={280} lush={0.85} t={f} /></g>
          <g transform={`translate(580 ${FOOT - 10}) scale(0.62)`}><Town n={4} /></g>
          {[0, 1, 2].map((i) => <Fly key={`g${i}`} f={f} a={wSur + i * 6} d={18} from={[190, FOOT - 160]} to={[480 + i * 100, FOOT - 300]} lift={110} s={0.6}><IcoSack /></Fly>)}
          {f >= wFarG - 6 && <g transform={`translate(${interpolate(f, [wFarG - 6, wFarG + 24], [1180, 930], CL)} ${FOOT - 10}) scale(0.5)`}><Cart t={f} flip cargo={<IcoSack />} /></g>}
          {[0, 1].map((i) => <Fly key={`r${i}`} f={f} a={wFarG + 30 + i * 8} d={18} from={[930, FOOT - 150]} to={[640 - i * 100, FOOT - 300]} lift={110} s={0.6}><IcoSack /></Fly>)}
        </Screen>
        {[0, 1, 2].map((i) => <Head key={i} id={["folk_smith", "ahe", "folk_shoemaker"][i]} x={480 + i * 100} y={FOOT - 360} k={popIn(f, s[7] + 4 + i * 4)} size={86} />)}
        <TagDiv x={580} y={FOOT - 460} text="不种地的手艺人" col={TEAL} k={popIn(f, wSize)} size={30} />
        <TagDiv x={190} y={FOOT - 330} text="乡下余粮" col={GOLD} k={popIn(f, wSur)} size={32} />
        <TagDiv x={930} y={FOOT - 220} text="远方供给" col={INK} k={popIn(f, wFarG + 10)} size={32} />
      </Shot>
      <Verdict i={1} text="先有余粮，才有城" at={s[7] + 4} />

      <Sfx at={4} name="paper" v={0.24} />
      <Sfx at={s[1] - 2} name="paper" v={0.22} />
      <Sfx at={wEat} name="pop" v={0.22} />
      <Sfx at={wSurplus} name="pour" v={0.2} />
      <Sfx at={s[2] - 2} name="paper" v={0.22} />
      {trades.map((a, i) => <Sfx key={`b${i}`} at={a} name={i === 5 ? "ding" : "pop"} v={0.2} />)}
      <Sfx at={wTown} name="twinkle" v={0.26} />
      <Sfx at={s[3] - 2} name="paper" v={0.22} />
      {[0, 1, 2].map((i) => <Sfx key={`c${i}`} at={s[3] + 6 + i * 24} name="coin" v={0.12} />)}
      <Sfx at={s[4] + 4} name="boing" v={0.18} />
      <Sfx at={wSell} name="swish" v={0.2} />
      <Sfx at={wBetter} name="twinkle" v={0.22} />
      <Sfx at={s[6] + 4} name="coin" v={0.2} />
      <Sfx at={s[7] + 4} name="stamp" v={0.4} />
      <Sfx at={wFarG} name="whoosh" v={0.18} />
    </Shell>
  );
};

// ================================================================ 第三步（暗场）：地便宜的地方，余钱会去哪
export const SLand: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("land");
  const W = useWordAt("land");
  const M = useTalk("land");
  const s = Array.from({ length: 7 }).map((_, i) => L.s(i));
  const wColony = W(1, "北美那些殖民地"), wCheap = W(1, "荒地还很便宜"), wSaved = W(1, "攒下一点钱"), wBuy = W(1, "买块地");
  const wSee = W(3, "看得见"), wGrip = W(3, "管得着"), wCalm = W(3, "踏实"), wQuiet = W(3, "清静");
  const wSpare5 = W(5, "有了余钱"), wAll = W(5, "先买地"), wNoShop = W(5, "给远处做货的作坊"), wSlow = W(5, "就开得晚");
  const wOwned = W(6, "没有便宜地可买"), wSpare = W(6, "有了余钱"), wFar = W(6, "更远的地方");
  // 暗场：第三步从头到“没有便宜地可买”压冷调，作坊开起来再亮回来（这一集的冷节拍）
  const dusk = interpolate(f, [0, 12, wOwned, wOwned + 20], [0, 0.3, 0.3, 0], CL);

  return (
    <Shell dur={L.dur} enter={{ ink: [540, 900] }} cam="still" zoom={0} kicks={[wCheap, wNoShop, wFar]}>
      <PaperTown f={f + 600} dusk={dusk} />
      {/* 镜头 1：第三步——本钱也会被别的去处吸走：一摞钱，左边作坊、右边田，两条虚线各指一边，中间一个问号
          （10-29 第二版：原来画“只有两栋房子、发暗的小镇”，配“可也有长不大的镇子”，原文没这么说） */}
      <Shot f={f} a={0} b={s[1]}>
        <Screen>
          <Workshop x={260} y={FOOT - 10} s={0.62} />
          <g transform={`translate(840 ${FOOT - 10})`}><Farm w={340} lush={0.7} t={f} /></g>
          <g transform={`translate(540 ${FOOT - 160}) scale(${popIn(f, 6) * 1.1})`}><CoinStack n={4} /></g>
          <g opacity={popIn(f, 14) > 0 ? 1 : 0}>
            <path d={`M 480 ${FOOT - 260} Q 400 ${FOOT - 360} 330 ${FOOT - 300}`} fill="none" stroke={TEAL} strokeWidth={7} strokeDasharray="16 12" strokeLinecap="round" />
            <path d={`M 600 ${FOOT - 260} Q 690 ${FOOT - 360} 770 ${FOOT - 280}`} fill="none" stroke={GREEN} strokeWidth={7} strokeDasharray="16 12" strokeLinecap="round" />
          </g>
          <text x={540} y={FOOT - 380} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={110} fill={RED} opacity={popIn(f, 18) > 0 ? 0.9 : 0}>?</text>
        </Screen>
        <Keyword text="第三步" at={2} color={GREEN} size={96} />
      </Shot>
      {/* 镜头 2：北美那些殖民地，荒地还很便宜；阿禾攒下一点钱，第一件事就是买块地，自己种 */}
      <Shot f={f} a={s[1]} b={s[3]}>
        <Screen>
          <g transform={`translate(${interpolate(f, [s[1], wCheap], [-120, 220], CL)} 760) scale(0.55)`}><Ship t={f} /></g>
          <path d="M 0 1262 Q 540 1180 1080 1262" fill="#D9C79F" opacity={0.6} />
          {f >= wCheap - 4 && (
            <g transform={`translate(780 1000) scale(${popIn(f, wCheap)})`}>
              <path d="M -6 0 L -4 -150 L 6 -150 L 8 0 Z" fill={CR.wood2} stroke={CR.line} strokeWidth={4} />
              <rect x={-110} y={-210} width={220} height={80} rx={10} fill="#FFFBF0" stroke={CR.line} strokeWidth={4} />
              <text y={-156} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={RED}>荒地 便宜</text>
            </g>
          )}
          <CoinFlow f={f} a={wBuy - 6} n={3} gap={5} from={[420, FOOT - 300]} to={[780, FOOT - 80]} lift={90} />
          {f >= wBuy + 6 && <g transform={`translate(780 ${FOOT - 10}) scale(${popIn(f, wBuy + 8)})`}><Farm w={360} lush={0.3 + 0.5 * interpolate(f, [s[2], s[3]], [0, 1], CL)} t={f} /></g>}
        </Screen>
        <Sprite id="ahe" view="tq_r" x={interpolate(f, [wSaved, wBuy + 10], [360, 520], CL)} y={FOOT} h={f >= s[2] - 4 ? 560 : 440} seed={3} talk={M("阿禾", f)} hops={[wBuy + 2]} />
        <Emote x={600} y={FOOT - 600} kind="♪" at={s[2] + 6} dur={50} />
        <TagDiv x={300} y={520} text="北美殖民地" col={INK} k={popIn(f, wColony)} size={36} />
        <TagDiv x={560} y={FOOT - 640} text="自己的主人" col={GREEN} k={popIn(f, s[2] + 10)} size={34} />
        <Keyword text={f < s[2] ? "地便宜，先买地" : "不用看客人脸色"} at={s[1] + 4} out={s[3]} size={72} />
      </Shot>
      {/* 镜头 3：利润差不多，大多数人愿意把本钱放在地上——看得见、管得着、踏实；乡下又清静、自在 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <Card x={60} y={470} w={960} h={430} k={popIn(f, s[3] + 2)}>
            <text x={480} y={80} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK}>利润差不多的时候</text>
            <g transform="translate(250 260)"><Farm w={300} lush={0.8} t={f} /></g>
            <text x={250} y={320} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={GREEN}>本钱放地上</text>
            <g transform="translate(720 250) scale(0.45)"><Ship t={f} /></g>
            <text x={720} y={320} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={CR.mute}>漂在买卖里</text>
            {[wSee, wGrip, wCalm].map((a, i) => f >= a - 2 && <text key={i} x={140 + i * 130} y={390} fontFamily={SERIF} fontWeight={900} fontSize={34} fill={GREEN} opacity={popIn(f, a) > 0 ? 1 : 0}>{["看得见", "管得着", "踏实"][i]}</text>)}
          </Card>
        </Screen>
        <TagDiv x={540} y={980} text="乡下又清静、自在" col={TEAL} k={popIn(f, wQuiet)} size={36} />
        <Keyword text="大多数人选地" at={s[3] + 4} out={s[4]} size={72} />
      </Shot>
      {/* 镜头 4：小满——地便宜，不是好事吗？ */}
      <Shot f={f} a={s[4]} b={s[5]}>
        <Screen><g transform={`translate(780 ${FOOT - 10})`}><Farm w={380} lush={0.8} t={f} /></g></Screen>
        <Sprite id="xiaoman3" view="tq_r" x={300} y={FOOT} h={580} seed={5} talk={M("小满", f)} hops={[s[4] + 4]} />
        <Emote x={360} y={FOOT - 620} kind="?" at={s[4] + 6} dur={40} />
      </Shot>
      {/* 镜头 5：手艺人有了余钱，更愿意先买地——钱从阿禾手里流到田里；给远处做货的作坊，就开得晚——作坊只画个虚框，镇上的小店照常亮着
          （10-29 第二版：原来画三个手艺人全跑去田里、作坊打叉、“镇子长得慢”，原文没说手艺人全走、也没说城长得慢） */}
      <Shot f={f} a={s[5]} b={s[6]}>
        <Screen>
          <g transform={`translate(300 ${FOOT - 10}) scale(0.7)`}><Town n={3} /></g>
          <g transform={`translate(840 ${FOOT - 10})`}><Farm w={360} lush={0.8} t={f} /></g>
          {f >= wNoShop - 4 && (
            <g opacity={popIn(f, wNoShop) > 0 ? 1 : 0}>
              <rect x={170} y={FOOT - 640} width={260} height={150} rx={14} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="18 12" opacity={0.7} />
              <g transform={`translate(300 ${FOOT - 555}) scale(0.5)`} opacity={0.35}><Ship t={f} /></g>
            </g>
          )}
          <CoinFlow f={f} a={wAll - 4} n={4} gap={5} from={[330, FOOT - 300]} to={[820, FOOT - 120]} lift={120} />
        </Screen>
        <Head id="ahe" x={330} y={FOOT - 330} k={popIn(f, wSpare5 - 4)} size={100} />
        <TagDiv x={840} y={FOOT - 330} text="余钱先买地" col={GREEN} k={popIn(f, wAll + 10)} size={34} />
        <TagDiv x={300} y={FOOT - 690} text="给远方做货的作坊" col={RED} k={popIn(f, wNoShop + 4)} size={30} />
        <TagDiv x={300} y={FOOT - 450} text="晚开张" col={RED} k={popIn(f, wSlow)} size={30} />
        <Keyword text={f < wSlow ? "钱先流向土地" : "远方作坊开得晚"} at={s[5] + 4} out={s[6]} size={72} />
      </Shot>
      {/* 镜头 6：反过来，没有便宜地可买的地方——篱笆围满；手艺人有了余钱才开作坊，给更远的地方做货（亮回来） */}
      <Shot f={f} a={s[6]} b={L.dur + 20}>
        <Screen>
          <g transform={`translate(780 ${FOOT - 10})`}><Farm w={460} lush={0.9} t={f} /></g>
          {f >= wOwned - 4 && [0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${560 + i * 85} ${FOOT - 10} L ${560 + i * 85} ${FOOT - 80} M ${540 + i * 85} ${FOOT - 50} L ${605 + i * 85} ${FOOT - 50}`} stroke={CR.wood2} strokeWidth={6} strokeLinecap="round" opacity={popIn(f, wOwned + i * 3) > 0 ? 1 : 0} />)}
          <g transform={`translate(260 ${FOOT - 10}) scale(0.6)`}><Town n={interpolate(f, [wSpare, wFar], [2, 4], CL)} /></g>
          {f >= wSpare - 4 && <Workshop x={260} y={FOOT - 300} s={0.55} />}
          {f >= wFar - 6 && <g transform={`translate(${interpolate(f, [wFar - 6, wFar + 40], [420, 1150], CL)} 720) scale(0.45)`}><Ship t={f} /></g>}
        </Screen>
        <TagDiv x={780} y={FOOT - 300} text="没有便宜地可买" col={INK} k={popIn(f, wOwned + 6)} size={34} />
        <TagDiv x={600} y={620} text="给远处做货" col={GOLD} k={popIn(f, wFar)} size={34} />
      </Shot>
      <Verdict i={2} text="这笔余钱，先去了土地" at={s[6] + 4} />

      <Sfx at={4} name="paper" v={0.24} />
      <Sfx at={s[1] - 2} name="paper" v={0.22} />
      <Sfx at={wColony} name="whoosh" v={0.2} />
      <Sfx at={wCheap} name="pop" v={0.22} />
      <Sfx at={wBuy} name="coin" v={0.22} />
      <Sfx at={s[2] + 4} name="twinkle" v={0.2} />
      <Sfx at={s[3] - 2} name="paper" v={0.22} />
      {[wSee, wGrip, wCalm].map((a, i) => <Sfx key={`k${i}`} at={a} name="pop" v={0.16} />)}
      <Sfx at={s[4] + 4} name="boing" v={0.18} />
      <Sfx at={wAll} name="swish" v={0.2} />
      <Sfx at={wNoShop} name="buzz" v={0.22} />
      <Sfx at={wOwned} name="hammer" v={0.22} />
      <Sfx at={wFar} name="whoosh" v={0.2} />
      <Sfx at={s[6] + 4} name="stamp" v={0.4} />
    </Shell>
  );
};
