// EP23 · 结尾（回到开头那个镇子：谁养活谁 → 互相是对方的仆人 → 财富的自然进步：大部分本钱先种地、再开作坊、最后外贸（三个一样大的框） → 今天的说法 → 别套错：实际还看土地、贸易、制度 → 下次先问一句）→ 公式卡 + 下一集
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Paper, SERIF, Sfx, Shell, useLines, useWordAt } from "../kit";
import { CR } from "../cast/crayon";
import { Head, TagDiv } from "../ep17/scenesA";
import { Fly } from "../ep20/scenesA";
import { CountryTown } from "./scenesA";
import { Card, Farm, fade, FOOT, Formula23, GOLD, GREEN, IcoSack, IcoShirt, IcoShop, INK, Keyword, PaperTown, popIn, RED, Screen, Ship, Shot, TEAL, Town } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 先后三步：种地 → 开作坊 → 外贸（财富的自然进步），at = 每一框出现的帧。
 *  10-29 第二版：原来画成越来越高的台阶，像价值高低的排名；改成三个一样大的框，箭头只表示先后 */
const Steps: React.FC<{ f: number; at: [number, number, number] }> = ({ f, at }) => {
  const steps = [
    { x: 60, text: "先 · 种地", col: GOLD, icon: <g transform="translate(140 250) scale(0.6)"><Farm w={240} lush={0.8} t={f} /></g> },
    { x: 400, text: "再 · 开作坊", col: TEAL, icon: <g transform="translate(140 240) scale(1.2)"><IcoShop /></g> },
    { x: 740, text: "后 · 外贸", col: GREEN, icon: <g transform="translate(140 240) scale(0.38)"><Ship t={f} /></g> },
  ];
  return (
    <Screen>
      {steps.map((st, i) => {
        const k = popIn(f, at[i]);
        if (k <= 0) return null;
        return (
          <g key={i}>
            <g transform={`translate(${st.x} 740) scale(${Math.min(1, k)})`}>
              <rect x={0} y={0} width={280} height={320} rx={14} fill="#FBF7EF" stroke={st.col} strokeWidth={6} />
              <text x={140} y={70} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={st.col}>{st.text}</text>
              {st.icon}
            </g>
            {i > 0 && <path d={`M ${st.x - 52} 900 L ${st.x - 10} 900 M ${st.x - 28} 884 L ${st.x - 8} 900 L ${st.x - 28} 916`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        );
      })}
    </Screen>
  );
};

// ================================================================ 结尾：回到开头那个镇子
export const SEnding: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("ending");
  const W = useWordAt("ending");
  const s = [0, 1, 2, 3, 4, 5].map((i) => L.s(i));
  const wWho = W(1, "谁养活谁"), wServ = W(1, "互相是对方的仆人");
  const wName = W(2, "财富的自然进步"), a1 = W(2, "先去种地"), a2 = W(2, "再去开作坊"), a3 = W(2, "最后才做外贸"), wGrip = W(2, "看得住");
  const wToday = W(3, "农业先得有剩余");
  const wOrder = W(4, "自然顺序"), wLand = W(4, "土地"), wTrade = W(4, "贸易"), wInst = W(4, "制度");
  const q1 = W(5, "拿什么跟对方换");
  const listOn = interpolate(f, [s[2] - 10, s[2] + 6], [0, 1], CL);

  return (
    <Shell dur={L.dur} enter="page" cam="still" zoom={0} kicks={[wServ, a3, q1]}>
      <PaperTown f={f + 900} />
      {listOn < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - listOn }}>
          {/* 回到开头那个镇子：同一张图，镇子长大了；农夫和阿禾互相递东西——互相是对方的仆人 */}
          <CountryTown f={f} townN={6} q={fade(f, wWho - 4, wServ, 6)} />
          <Screen>
            <Fly f={f} a={wServ - 4} d={18} from={[300, FOOT - 160]} to={[760, FOOT - 430]} lift={100} s={0.8}><IcoSack /></Fly>
            <Fly f={f} a={wServ + 4} d={18} from={[780, FOOT - 160]} to={[320, FOOT - 430]} lift={100} s={0.9}><IcoShirt /></Fly>
          </Screen>
          <Head id="folk_farmer" x={300} y={FOOT - 470} k={popIn(f, s[1])} size={130} />
          <Head id="ahe" x={780} y={FOOT - 470} k={popIn(f, s[1] + 4)} size={130} />
          <TagDiv x={540} y={600} text="互相是对方的仆人" col={RED} k={popIn(f, wServ + 6)} size={44} />
          <Keyword text={f < wServ ? "回到那个镇子" : "谁也离不开谁"} at={2} out={s[2] + 10} size={72} />
        </div>
      )}
      {listOn > 0 && <AbsoluteFill style={{ opacity: listOn * 0.94 }}><Paper /></AbsoluteFill>}
      {/* 财富的自然进步：先种地 → 再开作坊 → 最后外贸；作坊比外贸看得住 */}
      <Shot f={f} a={s[2]} b={s[3]}>
        <Steps f={f} at={[a1, a2, a3]} />
        <TagDiv x={540} y={560} text="书里叫：财富的自然进步" col={INK} k={popIn(f, wName)} size={40} />
        <TagDiv x={540} y={660} text="大部分本钱的去向" col={GOLD} k={popIn(f, a1)} size={30} />
        <TagDiv x={540} y={1130} text="看得住" col={TEAL} k={popIn(f, wGrip)} size={32} />
        <TagDiv x={880} y={1130} text="漂在海上" col={CR.mute} k={popIn(f, wGrip + 6)} size={30} />
        <Keyword text="一步一步来" at={s[2] + 2} out={s[3]} size={72} />
      </Shot>
      {/* 今天的说法：农业先有剩余，城市才长得起来 */}
      <Shot f={f} a={s[3]} b={s[4]}>
        <Screen>
          <Card x={60} y={520} w={960} h={420} k={popIn(f, s[3] + 2)} accent={GOLD}>
            <text x={480} y={80} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK}>今天的说法</text>
            {[0, 1, 2].map((i) => <g key={i} transform={`translate(${160 + i * 70} 280) scale(${popIn(f, wToday + i * 4) * 1})`}><IcoSack /></g>)}
            <text x={230} y={350} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={GOLD}>农业剩余</text>
            <path d="M 400 240 L 540 240 M 520 222 L 544 240 L 520 258" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={f >= wToday + 10 ? 1 : 0} />
            <g transform={`translate(740 300) scale(${popIn(f, wToday + 14) * 0.5})`}><Town n={5} /></g>
            <text x={740} y={350} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={TEAL} opacity={f >= wToday + 14 ? 1 : 0}>城市长起来</text>
          </Card>
        </Screen>
        <Keyword text="先有余粮" at={s[3] + 2} out={s[4]} size={72} />
      </Shot>
      {/* 别套错：这是斯密说的自然顺序，各国实际怎么走，还看土地、贸易和制度（10-29 第二版：去掉“今天一个人能种几百亩地”） */}
      <Shot f={f} a={s[4]} b={s[5]}>
        <Screen>
          <Card x={60} y={480} w={960} h={520} k={popIn(f, s[4] + 2)} accent={RED}>
            <text x={480} y={80} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={INK}>斯密说的自然顺序</text>
            <text x={480} y={170} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill="#8A8076" opacity={f >= wOrder ? 1 : 0}>种地 → 作坊 → 外贸</text>
            <text x={480} y={270} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={36} fill={INK} opacity={f >= wLand - 6 ? 1 : 0}>各国实际的走法，还看</text>
            {[["土地", wLand, GOLD], ["贸易", wTrade, TEAL], ["制度", wInst, GREEN]].map(([t, a, c], i) => (
              <g key={i} transform={`translate(${200 + i * 280} 390) scale(${popIn(f, a as number)})`}>
                <rect x={-110} y={-50} width={220} height={100} rx={18} fill="#FBF7EF" stroke={c as string} strokeWidth={6} />
                <text y={18} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={52} fill={c as string}>{t as string}</text>
              </g>
            ))}
          </Card>
        </Screen>
        <Keyword text="实际还看条件" at={s[4] + 2} out={s[5]} size={76} color={RED} />
      </Shot>
      {/* 下次先问一句：他们拿什么跟对方换？ */}
      <Shot f={f} a={s[5]} b={L.dur + 20}>
        <Screen>
          <Card x={140} y={520} w={800} h={460} k={popIn(f, s[5] + 2)} accent={GOLD}>
            <path d="M 300 200 Q 400 140 500 200" fill="none" stroke={INK} strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />
            <path d="M 500 260 Q 400 320 300 260" fill="none" stroke={INK} strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />
            <text x={400} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={110} fill={RED} opacity={popIn(f, q1) > 0 ? 1 : 0}>?</text>
            <text x={400} y={420} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={INK} opacity={f >= q1 ? 1 : 0}>他们拿什么换？</text>
          </Card>
        </Screen>
        <Head id="folk_farmer" x={250} y={760} k={popIn(f, s[5] + 6)} size={120} />
        <Head id="ahe" x={830} y={760} k={popIn(f, s[5] + 10)} size={120} />
        <Keyword text="下次先问一句" at={s[5]} size={72} />
      </Shot>

      <Sfx at={4} name="paper" v={0.3} />
      <Sfx at={wServ} name="swish" v={0.22} />
      <Sfx at={wServ + 8} name="ding" v={0.24} />
      <Sfx at={s[2] - 6} name="paper" v={0.28} />
      {[a1, a2, a3].map((a, i) => <Sfx key={i} at={a - 4} name="pop" v={0.26} />)}
      <Sfx at={s[3] - 2} name="paper" v={0.24} />
      <Sfx at={wToday} name="pour" v={0.2} />
      <Sfx at={s[4] - 2} name="paper" v={0.24} />
      {[wLand, wTrade, wInst].map((a, i) => <Sfx key={`c${i}`} at={a} name="pop" v={0.2} />)}
      <Sfx at={s[5]} name="paper" v={0.24} />
      <Sfx at={q1} name="ding" v={0.28} />
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
      <Formula23 k={k} />
      {hookK > 0 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1180, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: INK, opacity: hookK }}>
          下一集：欧洲的地，为什么<span style={{ color: RED }}>几百年没好好种</span>？
        </div>
      )}
      <Sfx at={2} name="paper" v={0.34} />
    </Shell>
  );
};
