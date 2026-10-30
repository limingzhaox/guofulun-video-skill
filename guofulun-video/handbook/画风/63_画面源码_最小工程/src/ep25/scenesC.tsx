// EP25 · 第三步：城里富了，乡下跟着富了吗（城先安全，乡下没人保护 → 能留在自己手里才想过得更好 → 农夫藏钱、逃进城、躲一年就自由，钱聚到城里
//         → 靠海靠河的城做远方生意 → 大地主换远方的好东西，商人在本地开作坊 → 九百户里三十一户去威尼斯办丝绸作坊 → 粗手艺做细，农业的孩子
//         → 八十磅细布里有几千磅粮食的价钱，粮食运不远、细布运得远 → 小满：乡下也富了吧？→ 不一定，城富了周围照样穷）
// 结尾（回到农夫要进的那座城门 → 一点点换来的 → 自由市 / 城市自治 → 别套错 → 今天的大城市 → 下次也问一句）→ 公式卡 + 下一集
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Paper, SERIF, Sfx, Shell, useLines, useWordAt } from "../kit";
import { useTalk } from "../cast/talk";
import { Emote, Sprite } from "../v16/Sprite";
import { Head, TagDiv } from "../ep17/scenesA";
import { CoinFlow, Fly } from "../ep20/scenesA";
import { Barrel, Cart } from "../ep22/world";
import { Ship } from "../ep17/world";
import { GateWorld } from "./scenesA";
import { Card, Chain, Charter, Chest, CityWall, ClothRoll, Days, fade, Farm, FOOT, Formula25, GOLD, GREEN, IcoBread, IcoCloth, IcoSack, IcoShop, INK, Keyword, PaperTown, popIn, Purse, RED, RedStamp, Screen, Seesaw, Shield, Shot, Skyline, TaxBox, TEAL, Town, Verdict } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MUTE = "#8A8076";

/** 本地开的作坊（原点在地面中心）：label = 门楣上的字 */
const Shop: React.FC<{ s?: number; label: string }> = ({ s = 1, label }) => (
  <g transform={`scale(${s})`}>
    <g transform="scale(2.1)"><IcoShop /></g>
    <g transform="translate(0 -300)">
      <rect x={-label.length * 20 - 20} y={-30} width={label.length * 40 + 40} height={60} rx={10} fill="#FFFBF0" stroke={INK} strokeWidth={4} />
      <text y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={INK}>{label}</text>
    </g>
  </g>
);

// ================================================================ 第三步：城里富了，乡下呢
export const SRich: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("rich");
  const W = useWordAt("rich");
  const M = useTalk("rich");
  const s = Array.from({ length: 11 }).map((_, i) => L.s(i));
  const wOrder = W(0, "秩序"), wSafe = W(0, "都安全了"), wNone = W(0, "还没人保护");
  const wFed = W(1, "只求吃饱"), wRob = W(1, "被人抢走"), wKeep = W(1, "留在自己手里"), wBetter = W(1, "过得更好");
  const wSaved = W(2, "攒下的钱"), wTaken = W(2, "被拿走"), wHide = W(2, "藏好"), wRun = W(2, "逃进城");
  const wYear = W(3, "一年"), wFree = W(3, "永远自由"), wOne = W(3, "一笔一笔");
  const wSea = W(4, "靠海"), wFar = W(4, "很远的地方"), wItaly = W(4, "意大利");
  const wWool = W(5, "羊毛"), wWine = W(5, "好酒"), wBuyer = W(5, "有了买主"), wFare = W(5, "省运费"), wShop = W(5, "开作坊"), wImport = W(5, "外地运来");
  const w900 = W(6, "九百户"), w31 = W(6, "三十一户"), wVenice = W(6, "威尼斯"), wSilk = W(6, "丝绸作坊");
  const wRough = W(7, "粗手艺"), wFine = W(7, "做细"), wChild = W(7, "农业的孩子"), wCheap = W(7, "便宜的粮食");
  const w80 = W(8, "八十磅"), wEat = W(8, "要吃饭"), wK = W(8, "几千磅"), wPrice = W(8, "算进了布价里"), wHeavy = W(8, "又沉又占地方"), wShort = W(8, "运不了多远"), wWeave = W(8, "织成细布"), wAway = W(8, "很远的地方"), wShape = W(8, "换了个样子");
  const wAlso = W(9, "跟着富了");
  const wNo = W(10, "不一定"), wUp = W(10, "富起来"), wAround = W(10, "周围的乡下"), wTrade = W(10, "做买卖的那些地方"), wPoor = W(10, "照样穷");
  const vAt = wPoor + 30;
  // 台阶：觉得钱能留在自己手里，才一级级往上走
  const step = f < wBetter ? 0 : Math.min(3, Math.floor((f - wBetter) / 8) + 1);
  // 农夫：念到“逃进城”从庄园边往城门走
  const fx: [number, number][] = [[0, 380], [wRun, 380], [wRun + 40, 660]];

  return (
    <Shell dur={L.dur} enter="page" cam="still" zoom={0} kicks={[wNone, wFree, wPrice, wPoor]}>
      <PaperTown f={f + 600} dusk={interpolate(f, [s[10] - 10, s[10] + 10], [0, 0.3], CL)} />
      {/* 镜头 1：城里先有了秩序、像样的管理，人和钱都安全了；乡下种地的人还没人保护 */}
      <Shot f={f} a={0} b={s[1]}>
        <Screen>
          <g transform={`translate(780 ${FOOT - 8}) scale(0.7)`}><CityWall lit={1} t={f} /></g>
          <g transform={`translate(780 ${FOOT - 420}) scale(${popIn(f, wSafe) * 0.85})`}><Shield /></g>
          <g transform={`translate(250 ${FOOT - 8}) scale(1)`} opacity={0.75}><Farm w={340} lush={0.2} t={f} /></g>
          {f >= wNone - 4 && <path d="M 190 760 L 310 760 L 310 840 L 250 920 L 190 840 Z" fill="none" stroke={MUTE} strokeWidth={6} strokeDasharray="14 10" opacity={popIn(f, wNone) > 0 ? 1 : 0} />}
        </Screen>
        <TagDiv x={700} y={600} text="秩序" col={TEAL} k={popIn(f, wOrder)} size={32} />
        <TagDiv x={880} y={600} text="管理" col={TEAL} k={popIn(f, wOrder + 8)} size={32} />
        <TagDiv x={250} y={FOOT - 230} text="没人保护" col={MUTE} k={popIn(f, wNone + 4)} size={32} />
        <Keyword text={f < 40 ? "第三步" : "城里先安全"} at={2} out={s[1]} size={f < 40 ? 96 : 70} color={f < 40 ? GREEN : INK} />
      </Shot>
      {/* 镜头 2：没人保护只求吃饱，多挣的怕被抢；能留在自己手里，才一级级往上走 */}
      <Shot f={f} a={s[1]} b={s[2]}>
        <Screen>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={170 + i * 190} y={FOOT - 90 - i * 120} width={190} height={90 + i * 120} fill={i <= step ? "#D9C79E" : "#EFE6D3"} stroke={INK} strokeWidth={4} />)}
          <g transform={`translate(${265 + step * 190} ${FOOT - 250 - step * 120})`}>
            {f >= wFed - 4 && f < wKeep && <g transform={`translate(-100 60) scale(${popIn(f, wFed) * 0.9})`}><IcoBread /></g>}
          </g>
          {f >= wRob && f < wKeep && <Fly f={f} a={wRob} d={18} from={[400, FOOT - 300]} to={[880, 560]} lift={60} s={1}><Purse full={0.8} /></Fly>}
          {f >= wKeep && <g transform={`translate(${f < wKeep + 16 ? interpolate(f, [wKeep, wKeep + 16], [880, 380 + step * 190], CL) : 380 + step * 190} ${f < wKeep + 16 ? interpolate(f, [wKeep, wKeep + 16], [560, FOOT - 220 - step * 120], CL) : FOOT - 220 - step * 120})`}><Purse full={0.9} glow={1} /></g>}
          {f < wRob && f >= s[1] && <g transform={`translate(400 ${FOOT - 220})`}><Purse full={0.8} /></g>}
        </Screen>
        <Head id="folk_farmer" x={265 + step * 190} y={FOOT - 220 - step * 120 - 50} k={popIn(f, s[1] + 2)} size={130} />
        <Head id="folk_banker" x={880} y={540} k={popIn(f, wRob - 4) * (f < wKeep ? 1 : 0)} size={110} />
        <TagDiv x={265} y={FOOT - 40} text="只求吃饱" col={MUTE} k={popIn(f, wFed) * (f < wBetter ? 1 : 0)} size={30} />
        <TagDiv x={830} y={FOOT - 600} text="过得更好" col={GREEN} k={popIn(f, wBetter + 10)} size={34} />
        <Keyword text={f < wKeep ? "怕被抢走" : "留得住，才肯干"} at={s[1] + 4} out={s[2]} size={66} />
      </Shot>
      {/* 镜头 3：回到开头那个农夫——钱让老爷知道就会被拿走，只好藏好，一有机会就逃进城 */}
      <Shot f={f} a={s[2]} b={s[3]}>
        <GateWorld f={f} gate={interpolate(f, [wRun + 20, wRun + 34], [0, 0.85], CL)} />
        <Screen><g transform={`translate(470 ${FOOT + 20}) scale(0.7)`} opacity={f >= wHide - 4 && f < wRun ? 1 : 0}><Chest sink={interpolate(f, [wHide, wHide + 20], [0, 1], CL)} /></g></Screen>
        <Sprite id="folk_farmer" view="front" x={fx} y={FOOT + 6} h={360} seed={61} walk={[[wRun, wRun + 40]]} jolts={[wTaken]} />
        <Screen>{f >= wSaved - 4 && f < wHide && <g transform={`translate(470 ${FOOT - 150}) scale(${popIn(f, wSaved)})`}><Purse full={1} /></g>}</Screen>
        <Head id="folk_banker" x={150} y={FOOT - 520} k={popIn(f, wTaken - 4)} size={120} />
        <Emote x={200} y={FOOT - 600} kind="!" at={wTaken} dur={50} />
        <TagDiv x={470} y={FOOT - 260} text="藏起来" col={GOLD} k={popIn(f, wHide + 4) * (f < wRun ? 1 : 0)} size={32} />
        <Keyword text="回到那个农夫" at={s[2] + 4} out={s[3]} size={66} />
      </Shot>
      {/* 镜头 4：在城里躲过老爷一年，脚上的锁链断开；钱一笔一笔聚进城里 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <g transform={`translate(760 ${FOOT - 8}) scale(0.78)`}><CityWall gate={0.85} lit={1} t={f} /></g>
          <g transform="translate(140 560) scale(0.86)"><Days f={f} n={12} at={wYear - 6} gap={2} col={TEAL} label="一年" /></g>
          <g transform={`translate(380 ${FOOT - 40}) scale(0.9)`}><Chain broken={interpolate(f, [wFree, wFree + 12], [0, 1], CL)} /></g>
          {[0, 1, 2].map((i) => <CoinFlow key={i} f={f} a={wOne + i * 10} n={2} gap={4} from={[60, FOOT - 300 - i * 40]} to={[760, FOOT - 120]} lift={70} />)}
        </Screen>
        <Sprite id="folk_farmer" view="front" x={380} y={FOOT - 60} h={380} seed={61} hops={[wFree + 4]} />
        <TagDiv x={380} y={FOOT - 490} text="永远自由" col={GREEN} k={popIn(f, wFree + 6)} size={36} />
        <Keyword text="躲一年，就自由" at={s[3] + 4} out={s[4]} size={66} />
      </Shot>
      {/* 镜头 5：靠海、靠大河的城，把东西运到很远的地方去卖；最早富起来的大概是意大利的那些城 */}
      <Shot f={f} a={s[4]} b={s[5]}>
        <Screen>
          <path d={`M 0 ${FOOT - 60} Q 270 ${FOOT - 80} 540 ${FOOT - 60} T 1080 ${FOOT - 60} L 1080 ${FOOT + 60} L 0 ${FOOT + 60} Z`} fill="#9FC3CF" opacity={0.7} />
          <g transform={`translate(230 ${FOOT - 70}) scale(0.5)`}><CityWall flag={1} t={f} /></g>
          <g transform={`translate(${interpolate(f, [wSea, wFar + 30], [430, 900], CL)} ${FOOT - 70}) scale(0.9)`}><Ship t={f} /></g>
          <path d={`M 480 ${FOOT - 250} Q 760 ${FOOT - 380} 1040 ${FOOT - 300}`} fill="none" stroke={TEAL} strokeWidth={7} strokeDasharray="16 12" strokeLinecap="round" opacity={f >= wFar - 4 ? 1 : 0} />
        </Screen>
        <TagDiv x={230} y={FOOT - 330} text="靠海、靠河" col={TEAL} k={popIn(f, wSea)} size={32} />
        <TagDiv x={900} y={FOOT - 420} text="远方" col={GOLD} k={popIn(f, wFar + 4)} size={34} />
        <TagDiv x={300} y={620} text="大概是意大利的城" col={GREEN} k={popIn(f, wItaly)} size={34} />
        <Keyword text="做远方的生意" at={s[4] + 4} out={s[5]} size={66} />
      </Shot>
      {/* 镜头 6：大地主拿羊毛、粮食换远方的好酒、细布；商人为省运费在本地开作坊照着做，原料多从外地运来 */}
      <Shot f={f} a={s[5]} b={s[6]}>
        <Screen>
          <g transform={`translate(160 ${FOOT - 380})`} opacity={popIn(f, wWool - 4) > 0 ? 1 : 0}><IcoCloth col="#FFFFFF" s={1.3} /></g>
          <g transform={`translate(160 ${FOOT - 240})`} opacity={popIn(f, wWool + 4) > 0 ? 1 : 0}><IcoSack s={1.3} /></g>
          <g transform={`translate(920 ${FOOT - 240}) scale(0.7)`} opacity={popIn(f, wWine - 6) > 0 ? 1 : 0}><Barrel label="酒" /></g>
          <g transform={`translate(920 ${FOOT - 380}) scale(0.55)`} opacity={popIn(f, wWine) > 0 ? 1 : 0}><ClothRoll fine={1} /></g>
          <Fly f={f} a={wWine + 4} d={22} from={[160, FOOT - 300]} to={[920, FOOT - 300]} lift={90} s={1}><IcoSack /></Fly>
          <Fly f={f} a={wWine + 8} d={22} from={[920, FOOT - 420]} to={[160, FOOT - 420]} lift={-70} s={0.5}><ClothRoll fine={1} /></Fly>
          {f >= wBuyer && <CoinFlow f={f} a={wBuyer} n={3} gap={4} from={[160, FOOT - 500]} to={[920, FOOT - 500]} lift={60} />}
          <g transform={`translate(540 ${FOOT - 10}) scale(${popIn(f, wShop) * 0.8})`}><Shop label="本地作坊" /></g>
          {[0, 1, 2].map((i) => <Fly key={i} f={f} a={wImport + i * 6} d={20} from={[1100, 700 + i * 30]} to={[560, FOOT - 120]} lift={60} s={0.7}><IcoSack /></Fly>)}
        </Screen>
        <Head id="folk_banker" x={160} y={600} k={popIn(f, s[5] + 2)} size={120} />
        <TagDiv x={160} y={700} text="大地主" col={GOLD} k={popIn(f, s[5] + 6)} size={30} />
        <TagDiv x={920} y={600} text="远方的好东西" col={TEAL} k={popIn(f, wWine + 4)} size={30} />
        <TagDiv x={540} y={640} text="省运费" col={RED} k={popIn(f, wFare) * (f < wShop ? 1 : 0)} size={36} />
        <TagDiv x={760} y={FOOT - 160} text="外地原料" col={MUTE} k={popIn(f, wImport + 10)} size={30} />
        <Keyword text={f < wShop ? "换远方的好东西" : "在本地照着做"} at={s[5] + 4} out={s[6]} size={64} />
      </Shot>
      {/* 镜头 7：书里的例子——九百户人家被赶出一座城，三十一户去了威尼斯，办丝绸作坊 */}
      <Shot f={f} a={s[6]} b={s[7]}>
        <Screen>
          {Array.from({ length: 900 }).map((_, i) => {
            const r = Math.floor(i / 30), c = i % 30, hot = i >= 869;
            const k = interpolate(f, [w900 - 6 + r * 0.6, w900 + r * 0.6], [0, 1], CL);
            if (k <= 0) return null;
            const go = hot ? interpolate(f, [w31 + (i - 869) * 0.6, w31 + 18 + (i - 869) * 0.6], [0, 1], CL) : 0;
            const x0 = 90 + c * 14, y0 = 560 + r * 14;
            const x1 = 760 + ((i - 869) % 8) * 22, y1 = 640 + Math.floor((i - 869) / 8) * 22;
            return <circle key={i} cx={x0 + (x1 - x0) * go} cy={y0 + (y1 - y0) * go - Math.sin(go * Math.PI) * 80} r={hot && f >= w31 - 4 ? 6 : 4.5} fill={hot && f >= w31 - 4 ? RED : MUTE} opacity={0.85 * k} />;
          })}
          <g transform={`translate(840 ${FOOT - 40}) scale(${popIn(f, wSilk) * 0.85})`}><ClothRoll fine={1} label="丝绸" /></g>
        </Screen>
        <TagDiv x={300} y={1040} text="九百户" col={MUTE} k={popIn(f, w900 + 6)} size={36} />
        <TagDiv x={840} y={560} text="三十一户" col={RED} k={popIn(f, w31 + 20)} size={34} />
        <TagDiv x={840} y={880} text="威尼斯" col={TEAL} k={popIn(f, wVenice)} size={34} />
        <Keyword text="书里的例子" at={s[6] + 4} out={s[7]} size={66} />
      </Shot>
      {/* 镜头 8：本地的粗手艺一点点做细——这样的作坊是农业的孩子，靠本地便宜的粮食和原料 */}
      <Shot f={f} a={s[7]} b={s[8]}>
        <Screen>
          <g transform={`translate(700 ${FOOT - 220}) scale(1.5)`}><ClothRoll fine={interpolate(f, [wFine - 4, wFine + 30], [0, 1], CL)} /></g>
          <g transform={`translate(220 ${FOOT - 8}) scale(0.9)`}><Farm w={300} lush={0.8} t={f} /></g>
          <g transform={`translate(220 ${FOOT - 260})`}><IcoSack s={1.2} /></g>
          {f >= wCheap - 4 && <path d={`M 300 ${FOOT - 300} Q 420 ${FOOT - 400} 520 ${FOOT - 330}`} fill="none" stroke={GREEN} strokeWidth={8} strokeDasharray="16 12" strokeLinecap="round" />}
        </Screen>
        <TagDiv x={700} y={FOOT - 470} text={f < wFine ? "粗布" : "细布"} col={f < wFine ? MUTE : RED} k={popIn(f, wRough)} size={34} />
        <TagDiv x={220} y={FOOT - 380} text="粮食便宜" col={GREEN} k={popIn(f, wCheap)} size={32} />
        <RedStamp x={540} y={560} text="农业的孩子" k={popIn(f, wChild + 4)} size={68} rot={-5} />
        <Keyword text="粗布变细布" at={s[7] + 4} out={s[8]} size={66} />
      </Shot>
      {/* 镜头 9a：八十磅细布——织布的人要吃饭，几千磅粮食的价钱算进了布价 */}
      <Shot f={f} a={s[8]} b={wHeavy - 6}>
        <Screen>
          <g transform={`translate(540 ${FOOT - 300}) scale(1.4)`}><ClothRoll fine={1} grain={interpolate(f, [wPrice + 10, wPrice + 24], [0, 1], CL)} /></g>
          {Array.from({ length: 10 }).map((_, i) => {
            const k = popIn(f, wK + i * 3);
            if (k <= 0) return null;
            const x = 120 + (i % 5) * 80, y = 760 + Math.floor(i / 5) * 90;
            const go = interpolate(f, [wPrice + i * 2, wPrice + 14 + i * 2], [0, 1], CL);
            return <g key={i} transform={`translate(${x + (540 - x) * go} ${y + (FOOT - 360 - y) * go}) scale(${k * (1 - go * 0.8)})`} opacity={1 - go}><IcoSack /></g>;
          })}
        </Screen>
        {[["folk_tailor", 820, 700], ["folk_smith", 960, 820]].map(([id, x, y], i) => <Head key={i} id={id as string} x={x as number} y={y as number} k={popIn(f, wEat + i * 4)} size={110} />)}
        <Screen>{[[820, 800], [960, 920]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) scale(${popIn(f, wEat + 6 + i * 4) * 0.7})`}><IcoBread /></g>)}</Screen>
        <TagDiv x={540} y={FOOT - 150} text="八十磅" col={INK} k={popIn(f, w80)} size={38} />
        <TagDiv x={280} y={700} text="几千磅粮食" col={GOLD} k={popIn(f, wK + 6) * (f < wPrice ? 1 : 0)} size={34} />
        <TagDiv x={540} y={620} text="算进布价" col={RED} k={popIn(f, wPrice + 14)} size={36} />
        <Keyword text="布价里有粮食" at={s[8] + 4} out={wHeavy - 6} size={66} />
      </Shot>
      {/* 镜头 9b：粮食又沉又占地方，车走不远就停；织成细布，车一路运到远方——粮食换了个样子卖到远方 */}
      <Shot f={f} a={wHeavy - 6} b={s[9]}>
        <Screen>
          {[620, 980].map((y, i) => <path key={i} d={`M 40 ${y} L 1040 ${y}`} stroke="#B49C76" strokeWidth={8} strokeDasharray="20 14" strokeLinecap="round" opacity={0.7} />)}
          <g transform={`translate(${interpolate(f, [wHeavy, wShort + 4], [170, 360], CL)} 620) scale(0.8)`}><Cart t={f < wShort + 4 ? f * 0.5 : wShort * 0.5} cargo={<g>{[-50, 0, 50].map((x) => <g key={x} transform={`translate(${x} 0)`}><IcoSack s={0.9} /></g>)}<g transform="translate(-25 -60)"><IcoSack s={0.9} /></g><g transform="translate(25 -60)"><IcoSack s={0.9} /></g></g>} /></g>
          {f >= wShort && <text x={560} y={520} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={80} fill={RED} opacity={popIn(f, wShort + 4) > 0 ? 1 : 0}>✗</text>}
          <g transform={`translate(${interpolate(f, [wWeave, wAway + 20], [170, 900], CL)} 980) scale(0.8)`} opacity={popIn(f, wWeave - 4) > 0 ? 1 : 0}><Cart t={f} cargo={<g transform="scale(0.6)"><ClothRoll fine={1} grain={f >= wShape ? 1 : 0} /></g>} /></g>
          <g transform="translate(980 900)" opacity={f >= wAway - 4 ? 1 : 0}><path d="M 0 0 L 0 -120" stroke={INK} strokeWidth={5} /><path d="M 0 -120 L 60 -100 L 0 -80 Z" fill={TEAL} stroke={INK} strokeWidth={3} /></g>
        </Screen>
        <TagDiv x={170} y={460} text="粮食：又沉又占地方" col={GOLD} k={popIn(f, wHeavy)} size={30} />
        <TagDiv x={170} y={820} text="细布" col={RED} k={popIn(f, wWeave)} size={32} />
        <TagDiv x={900} y={760} text="很远的地方" col={TEAL} k={popIn(f, wAway + 4)} size={30} />
        <TagDiv x={540} y={1120} text="粮食换了个样子" col={GREEN} k={popIn(f, wShape + 4)} size={36} />
        <Keyword text="细布替粮食走远路" at={wHeavy - 4} out={s[9]} size={62} />
      </Shot>
      {/* 镜头 10：小满——城里这么富，乡下也跟着富了吧？ */}
      <Shot f={f} a={s[9]} b={s[10]}>
        <Screen><g transform={`translate(820 ${FOOT - 8}) scale(0.55)`}><CityWall lit={1} flag={1} t={f} /></g></Screen>
        <Sprite id="xiaoman3" view="tq_r" x={300} y={FOOT} h={560} seed={5} talk={M("小满", f)} hops={[s[9] + 4]} />
        <Emote x={370} y={FOOT - 600} kind="?" at={wAlso} dur={40} />
      </Shot>
      {/* 镜头 11：不一定——一座城富起来，周围的乡下、跟它做买卖的地方照样穷 */}
      <Shot f={f} a={s[10]} b={L.dur + 20}>
        <Screen>
          <g transform={`translate(540 ${FOOT - 8}) scale(0.62)`}><CityWall lit={1} flag={1} t={f} houses={5} /></g>
          {f >= wUp && <g opacity={0.5 + 0.5 * Math.sin(f * 0.2)}>{[[420, 900], [660, 880], [540, 840]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill="#F2D27A" />)}</g>}
          {[[150, FOOT - 8], [930, FOOT - 8]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) scale(${popIn(f, wAround + i * 4) * 0.7})`} opacity={0.55}><Farm w={240} lush={0.05} /></g>)}
          {[[200, 560], [880, 560]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) scale(${popIn(f, wTrade + i * 4) * 0.5})`} opacity={0.75}><Town n={3} dim={1} /></g>)}
          {f >= wTrade && [[200, 560], [880, 560]].map(([x, y], i) => <path key={i} d={`M ${x} ${y + 30} Q ${(x + 540) / 2} ${y + 160} 540 ${FOOT - 200}`} fill="none" stroke={MUTE} strokeWidth={5} strokeDasharray="12 10" />)}
          {f >= wNo && f < wAround && <text x={540} y={760} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={130} fill={RED}>?</text>}
        </Screen>
        <TagDiv x={150} y={FOOT - 180} text="穷" col={MUTE} k={popIn(f, wAround + 6)} size={36} />
        <TagDiv x={930} y={FOOT - 180} text="穷" col={MUTE} k={popIn(f, wAround + 10)} size={36} />
        <TagDiv x={540} y={660} text="跟它做买卖的地方" col={MUTE} k={popIn(f, wTrade + 6) * (f < wPoor ? 1 : 0)} size={30} />
        <RedStamp x={540} y={680} text="照样穷" k={popIn(f, wPoor + 4)} size={76} rot={-6} />
        <Keyword text={f < wAround ? "富了谁？" : "城富，乡下未必"} at={s[10] + 4} out={vAt} size={66} />
      </Shot>
      <Verdict i={2} text="城富了，乡下未必富" at={vAt} />

      <Sfx at={4} name="paper" v={0.24} />
      <Sfx at={wSafe} name="ding" v={0.22} />
      <Sfx at={wNone} name="buzz" v={0.16} />
      <Sfx at={s[1] - 2} name="paper" v={0.22} />
      <Sfx at={wRob} name="whoosh" v={0.2} />
      <Sfx at={wKeep} name="twinkle" v={0.22} />
      <Sfx at={wBetter + 8} name="blip" v={0.18} />
      <Sfx at={wBetter + 16} name="blip" v={0.18} />
      <Sfx at={s[2] - 2} name="paper" v={0.22} />
      <Sfx at={wTaken} name="thump" v={0.2} />
      <Sfx at={wHide} name="pour" v={0.18} />
      <Sfx at={wRun} name="whoosh" v={0.2} />
      <Sfx at={wYear} name="tick" v={0.2} />
      <Sfx at={wFree} name="clack" v={0.28} />
      <Sfx at={wOne + 12} name="coin" v={0.2} />
      <Sfx at={wSea} name="whoosh" v={0.16} />
      <Sfx at={wItaly} name="pop" v={0.2} />
      <Sfx at={wWine + 4} name="swish" v={0.2} />
      <Sfx at={wBuyer + 12} name="coin" v={0.2} />
      <Sfx at={wShop} name="hammer" v={0.22} />
      <Sfx at={w900} name="pop" v={0.18} />
      <Sfx at={w31} name="whoosh" v={0.2} />
      <Sfx at={wSilk} name="twinkle" v={0.2} />
      <Sfx at={wFine} name="swish" v={0.18} />
      <Sfx at={wChild + 4} name="stamp" v={0.32} />
      <Sfx at={w80} name="pop" v={0.2} />
      <Sfx at={wK} name="pop" v={0.18} />
      <Sfx at={wPrice} name="swish" v={0.2} />
      <Sfx at={wShort + 4} name="buzz" v={0.2} />
      <Sfx at={wWeave} name="whoosh" v={0.2} />
      <Sfx at={wShape} name="ding" v={0.22} />
      <Sfx at={s[9]} name="boing" v={0.16} />
      <Sfx at={wNo} name="boing" v={0.2} />
      <Sfx at={wPoor + 4} name="stamp" v={0.34} />
      <Sfx at={vAt} name="stamp" v={0.36} />
    </Shell>
  );
};

// ================================================================ 结尾：回到农夫要进的那座城门
export const SEnding: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("ending");
  const W = useWordAt("ending");
  const s = [0, 1, 2, 3, 4, 5].map((i) => L.s(i));
  const wStep = W(1, "一点点换来的"), wTax = W(1, "税包下来"), wFear = W(1, "都怕大领主"), wTogether = W(1, "站到了一起"), wWall = W(1, "城墙"), wGather = W(1, "往这样的城里聚");
  const wFree = W(2, "自由市"), wAuto = W(2, "城市自治");
  const wWrong = W(3, "别套错"), wOld = W(3, "几百年前欧洲"), wToday = W(3, "和今天不一样"), wNot = W(3, "不拿它评价");
  const wBig = W(4, "大城市"), wJob = W(4, "工作好找"), wChance = W(4, "机会多"), wFarmer = W(4, "那个农夫"), wTake = W(4, "别被人拿走");
  const wMore = W(5, "越聚越多"), wAsk1 = W(5, "机会多不多"), wAsk2 = W(5, "也问一句"), wKeep = W(5, "留在自己手里");
  const cardOn = interpolate(f, [s[2] - 10, s[2] + 6], [0, 1], CL);

  return (
    <Shell dur={L.dur} enter="page" cam="still" zoom={0} kicks={[wGather, wFree, wKeep]}>
      <PaperTown f={f + 900} />
      {cardOn < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cardOn }}>
          {/* 回到开头那座城门：同一座城、同一个农夫、同一个钱袋 */}
          <Shot f={f} a={0} b={s[1] + 10}>
            <GateWorld f={f} gate={interpolate(f, [6, 24], [0.2, 0.85], CL)} />
            <Sprite id="folk_farmer" view="front" x={600} y={FOOT + 6} h={360} seed={61} />
            <Screen><g transform={`translate(700 ${FOOT - 150})`}><Purse full={1} glow={0.6} /></g></Screen>
            <Keyword text="回到那座城门" at={2} out={s[1] + 10} size={70} />
          </Shot>
          {/* 一点点换来的：税包下来 → 和国王站到一起 → 城墙、规矩和安全 → 人和钱往城里聚 */}
          <Shot f={f} a={s[1]} b={s[2] + 10}>
            <Screen>
              {[0, 1, 2].map((i) => (
                <Card key={i} x={30 + i * 345} y={400} w={330} h={380} k={popIn(f, [wTax, wFear, wWall][i] - 6)} accent={[GOLD, TEAL, GREEN][i]}>
                  {i === 0 && <g transform="translate(165 230) scale(0.9)"><TaxBox coins={3} /></g>}
                  {i === 1 && <g transform="translate(165 250) scale(0.32)"><Seesaw tilt={interpolate(f, [wTogether, wTogether + 16], [-10, 12], CL)} /></g>}
                  {i === 2 && <g transform="translate(165 260) scale(0.36)"><CityWall lit={1} /></g>}
                  <text x={165} y={330} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={32} fill={INK}>{["税包下来", "和国王站一边", "有了城墙规矩"][i]}</text>
                </Card>
              ))}
              <g transform={`translate(540 ${FOOT - 8}) scale(0.5)`} opacity={popIn(f, s[1] + 4) > 0 ? 1 : 0}><CityWall gate={interpolate(f, [wGather - 8, wGather + 4], [0, 0.85], CL)} lit={1} flag={1} t={f} /></g>
              {f >= wGather - 4 && [0, 1, 2].map((i) => <CoinFlow key={i} f={f} a={wGather + i * 8} n={2} gap={4} from={[i % 2 ? 1060 : 20, FOOT - 200 - i * 30]} to={[540, FOOT - 80]} lift={60} />)}
            </Screen>
            {[["folk_farmer", 160], ["ahe", 920], ["folk_tailor", 260]].map(([id, x0], i) => {
              const k = popIn(f, wGather - 6 + i * 4);
              const x = interpolate(f, [wGather + i * 6, wGather + 40 + i * 6], [x0 as number, 540 + (i - 1) * 60], CL);
              return <Head key={i} id={id as string} x={x} y={FOOT - 140} k={k * interpolate(f, [wGather + 36 + i * 6, wGather + 46 + i * 6], [1, 0.0001], CL)} size={100} />;
            })}
            <Keyword text="自由怎么来的" at={s[1] + 4} size={66} />
          </Shot>
        </div>
      )}
      {cardOn > 0 && <AbsoluteFill style={{ opacity: cardOn * 0.94 }}><Paper /></AbsoluteFill>}
      {/* 书里的叫法“自由市”；今天常说“城市自治” */}
      <Shot f={f} a={s[2]} b={s[3]}>
        <Screen>
          <Card x={60} y={420} w={960} h={560} k={popIn(f, s[2] + 2)}>
            <text x={480} y={80} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={INK}>书里的叫法</text>
            <g opacity={f >= wFree - 4 ? 1 : 0}>
              <rect x={300} y={120} width={360} height={110} rx={16} fill="#FBF7EF" stroke={TEAL} strokeWidth={6} />
              <text x={480} y={192} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={50} fill={INK}>自由市</text>
            </g>
            <text x={480} y={330} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={INK} opacity={f >= wAuto - 10 ? 1 : 0}>今天常说</text>
            <g opacity={f >= wAuto - 4 ? 1 : 0}>
              <rect x={280} y={370} width={400} height={110} rx={16} fill="#FBF7EF" stroke={GREEN} strokeWidth={6} />
              <text x={480} y={442} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={50} fill={INK}>城市自治</text>
            </g>
          </Card>
        </Screen>
        <Keyword text="记住这个词" at={s[2]} size={72} />
      </Shot>
      {/* 别套错：几百年前欧洲的事；今天不一样；不评价今天的政策 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <Card x={50} y={420} w={460} h={560} k={popIn(f, wOld - 6)} accent={GOLD}>
            <text x={230} y={76} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={INK}>几百年前</text>
            <g transform="translate(230 420) scale(0.55)"><CityWall flag={1} /></g>
            <text x={230} y={500} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={GOLD}>欧洲的城</text>
          </Card>
          <Card x={570} y={420} w={460} h={560} k={popIn(f, wToday - 6)} accent={TEAL}>
            <text x={230} y={76} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill={INK}>今天</text>
            <g transform="translate(250 430) scale(0.5)"><Skyline lit={0.7} /></g>
            <text x={230} y={500} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill={TEAL}>不一样</text>
          </Card>
        </Screen>
        <TagDiv x={540} y={1080} text="不评价今天的政策" col={RED} k={popIn(f, wNot)} size={36} />
        <Keyword text="别套到今天" at={wWrong - 4} size={76} color={RED} />
      </Shot>
      {/* 今天很多人往大城市跑，图工作好找、机会多；几百年前的农夫图的是钱别被拿走 */}
      <Shot f={f} a={s[4]} b={s[5]}>
        <Screen>
          <g transform={`translate(790 ${FOOT - 8}) scale(${popIn(f, wBig - 4) * 0.75})`}><Skyline n={interpolate(f, [wBig - 4, wBig + 20], [2, 7], CL)} lit={0.7} /></g>
          <Card x={50} y={430} w={420} h={400} k={popIn(f, wFarmer - 4)} accent={GOLD}>
            <g transform="translate(210 330) scale(0.4)"><CityWall gate={0.85} /></g>
            <g transform="translate(330 300)"><Purse full={1} glow={popIn(f, wTake) > 0 ? 1 : 0} /></g>
            <text x={210} y={380} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={GOLD}>几百年前</text>
          </Card>
        </Screen>
        {["xiaoman3", "female2"].map((id, i) => (
          <Sprite key={id} id={id} view="tq_r" x={[[s[4], 60 + i * 110], [s[4] + 70, 180 + i * 110]]} y={FOOT + 4} h={300} seed={5 + i * 4} walk={[[s[4], s[4] + 70]]} />
        ))}
        <Head id="folk_farmer" x={150} y={500} k={popIn(f, wFarmer)} size={100} />
        <TagDiv x={720} y={600} text="工作好找" col={TEAL} k={popIn(f, wJob)} size={34} />
        <TagDiv x={900} y={680} text="机会多" col={TEAL} k={popIn(f, wChance)} size={34} />
        <TagDiv x={260} y={880} text="钱别被拿走" col={GOLD} k={popIn(f, wTake + 4)} size={32} />
        <Keyword text="今天的大城市" at={s[4] + 4} out={s[5]} size={70} />
      </Shot>
      {/* 下次也问一句：挣到的钱，能不能安安稳稳留在自己手里？ */}
      <Shot f={f} a={s[5]} b={L.dur + 20}>
        <Screen>
          <g transform={`translate(240 ${FOOT - 8}) scale(0.45)`}><Skyline lit={0.7} /></g>
          <g transform={`translate(860 ${FOOT - 8}) scale(0.4)`}><CityWall lit={1} flag={1} /></g>
          <Card x={100} y={430} w={880} h={420} k={popIn(f, s[5] + 2)} accent={GOLD}>
            <text x={440} y={110} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={MUTE} opacity={f >= wAsk1 - 4 ? 1 : 0}>机会多不多？</text>
            <text x={440} y={230} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={110} fill={RED} opacity={popIn(f, wAsk2) > 0 ? 1 : 0}>?</text>
            <text x={440} y={340} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={INK} opacity={f >= wKeep - 6 ? 1 : 0}>挣到的钱，能不能留在自己手里</text>
          </Card>
        </Screen>
        <TagDiv x={540} y={940} text="人和钱越聚越多" col={TEAL} k={popIn(f, wMore)} size={32} />
        <Keyword text="下次也问一句" at={s[5]} size={72} />
      </Shot>

      <Sfx at={4} name="paper" v={0.3} />
      <Sfx at={wTax - 6} name="pop" v={0.22} />
      <Sfx at={wFear - 6} name="pop" v={0.22} />
      <Sfx at={wTogether} name="clack" v={0.2} />
      <Sfx at={wWall - 6} name="pop" v={0.22} />
      <Sfx at={wGather} name="coin" v={0.22} />
      <Sfx at={s[2] - 6} name="paper" v={0.28} />
      <Sfx at={wFree - 4} name="pop" v={0.24} />
      <Sfx at={wAuto - 4} name="ding" v={0.26} />
      <Sfx at={s[3] - 4} name="paper" v={0.26} />
      <Sfx at={wNot} name="stamp" v={0.3} />
      <Sfx at={s[4] - 2} name="paper" v={0.26} />
      <Sfx at={wBig} name="whoosh" v={0.2} />
      <Sfx at={wFarmer} name="pop" v={0.2} />
      <Sfx at={wTake + 4} name="twinkle" v={0.22} />
      <Sfx at={s[5] - 2} name="paper" v={0.26} />
      <Sfx at={wAsk2} name="ding" v={0.28} />
    </Shell>
  );
};

// ================================================================ 公式卡 + 下一集
export const SCta: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("cta");
  const W = useWordAt("cta");
  const k = interpolate(f, [0, 12], [0, 1], CL);
  // “下一集”那行念完“接着讲”就淡出，旁白念完只停 2–3 秒
  const hookK = fade(f, 10, W(0, "接着讲") + 18, 8);
  return (
    <Shell dur={L.dur} enter="none" cam="still" zoom={0}>
      <Paper />
      <Formula25 k={k} />
      {hookK > 0 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1140, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: INK, opacity: hookK }}>
          下一集：城里的生意，怎么把<span style={{ color: RED }}>乡下也带富了</span>？
        </div>
      )}
      <Sfx at={2} name="paper" v={0.34} />
    </Shell>
  );
};
