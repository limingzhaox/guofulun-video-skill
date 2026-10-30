// 第一篇汇总 · 详细讲解版新增场景（v3，2026-10-24）：每章补原著例子 + 当代例子（角标“当代例子 · 非原著”）
import React from "react";
import { Anvil, Butcher, Lawyer, Shoemaker, Square } from "../ep10/world";
import { Farmer, Forge } from "../ep11/world";
import { Farm } from "../ep12/world";
import { Amu, LaoQian, Village, Bowl } from "../ep06s/world";
import { Ahe, Master2, WeaveStreet } from "../ep08/world";
import { Street, Mask, Factory as FactoryB } from "../ep07/world";
import { You, CoalPit } from "../ep13/world";
import { Ox, SaltPile, Cowrie, Tobacco, Meat, Bread, House } from "../props";
import { Person } from "../kit";
import { interpolate, useCurrentFrame } from "remotion";
import { C, fin, keys, Paper, pop, Seal, Sfx, Shell, Stage, swing, T, useFps, useLines, useWordAt, SERIF } from "../kit";
import { HeadMark } from "../story";
import { Coin, Ship } from "../props";
import { Bubble, Collier, Doctor, Scroll, Shoe, Smith, Xiaoman } from "../ep10/world";
import { Bundle, Scholar, Sickle } from "../ep11/world";
import { useMouth } from "../ep11/scenesA";
import { Loom } from "../ep08/world";
import { CoinStack } from "../ep09/world";
import { Landlord, Notice, Sea, Sheaf, Shopfront, VBar, Wheat } from "../ep12/world";
import { Coat, GROUND, Mini, Modern, PART, PriceSwing, STEP, StepConclusion } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ph = (f: number, L: { s: (i: number) => number }, a: number, b?: number) => fin(f, L.s(a) - 6, 12) * (b === undefined ? 1 : 1 - fin(f, L.s(b) - 6, 12));
/** 小动作：原地轻跳、走路摆腿、挥锤 */
const hop = (f: number, ph = 0, a = 10) => -Math.abs(Math.sin(f * 0.22 + ph)) * a;
const walkLegs = (f: number): [number, number] => [swing(f, 0.35, -22, 22), swing(f, 0.35, 22, -22)];
const Hop: React.FC<{ f: number; ph?: number; a?: number; on?: boolean; children: React.ReactNode }> = ({ f, ph = 0, a = 10, on = true, children }) => <g transform={`translate(0 ${on ? hop(f, ph, a) : 0})`}>{children}</g>;
const Ground: React.FC<{ col?: string }> = ({ col = "#CDBB98" }) => <rect x={0} y={GROUND} width={1080} height={130} fill={col} />;
const Nail: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    <line x1={0} y1={0} x2={0} y2={-70} stroke="#7D838C" strokeWidth={6} strokeLinecap="round" />
    <rect x={-12} y={-76} width={24} height={8} rx={3} fill="#9EA6B2" stroke={C.ink} strokeWidth={2} />
  </g>
);
const Phone: React.FC<{ s?: number; children?: React.ReactNode }> = ({ s = 1, children }) => (
  <g transform={`scale(${s})`}>
    <rect x={-70} y={-140} width={140} height={260} rx={22} fill="#2B2F3A" stroke={C.ink} strokeWidth={4} />
    <rect x={-58} y={-120} width={116} height={210} rx={8} fill="#E9F0F4" />
    {children}
  </g>
);
const Row: React.FC<{ at: number; f: number; children: React.ReactNode; size?: number; mt?: number }> = ({ at, f, children, size = 42, mt = 18 }) => (
  <div style={{ fontSize: size, marginTop: mt, opacity: fin(f, at - 8, 8), translate: `${(1 - fin(f, at - 8, 8)) * 30}px 0`, whiteSpace: "nowrap" }}>{children}</div>
);
const Box: React.FC<{ top?: number; o: number; center?: boolean; color?: string; children: React.ReactNode }> = ({ top = 380, o, center = true, color = C.ink, children }) => (
  <div style={{ position: "absolute", left: 70, right: 70, top, textAlign: center ? "center" : "left", fontFamily: SERIF, fontWeight: 900, color, opacity: o }}>{children}</div>
);

// ================================================================ ① 三个原因展开：打钉子 → 换活耗时间 → 蒸汽机阀门男孩 → 地里分不细 → 当代：一部手机
export const SPin2: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("pin2");
  const W = useWordAt("pin2");
  const w300 = W(0, "两三百根"), w2300 = W(0, "两千三百多根"), wLoom = W(1, "织布机"), wField = W(1, "地里"), wLose = W(1, "耗掉"), wEng = W(2, "蒸汽机"), wBoy = W(2, "男孩"), wRope = W(3, "绳子"), wSelf = W(3, "自己就会开关"), wIdea = W(4, "省事的办法"), wSlow = W(5, "慢得多"), wPlough = W(5, "春天犁地"), wReap = W(5, "秋天收割"), wPhone = W(6, "一部手机"), wSteps = W(6, "成千上万道工序");
  const p0 = ph(f, L, 0, 1), p1 = ph(f, L, 1, 2), pE = ph(f, L, 2, 5), p5 = ph(f, L, 5, 6), p6 = ph(f, L, 6);
  const tied = f >= wRope - 4;
  const lever = tied ? swing(f, 0.25, -25, 25) : f >= wEng ? keys(Math.floor((f - wEng) / 20) % 2, [[0, -25], [1, 25]]) : -25;
  const boyX = tied ? keys(f - wRope, [[0, 470], [30, 860]]) : 470;
  return (
    <Shell dur={L.dur} enter="fade" cam="panR" zoom={0.05} kicks={[w2300, wLose, wBoy, wSelf, wIdea, wSlow, wSteps]}>
      <Paper />
      <Modern scene="pin2" i={6} />
      <Stage>
        <Ground />
        {p0 > 0 && (
          <g opacity={p0}>
            <Forge x={960} s={0.75} fire={0.7 + 0.3 * Math.sin(f * 0.3)} />
            <g transform={`translate(400 ${GROUND})`}><Anvil s={0.7} /></g>
            <Smith x={180} s={1.05} mood={f >= w2300 ? "wow" : "flat"} armR={[f < w2300 ? swing(f, 0.3, 30, 110) : 20, 20]} tilt={f >= w2300 ? 6 : 0} />
            <Xiaoman x={600} s={1.05} mood="happy" armR={[swing(f, 0.45, 20, 130), 20]} />
            {Array.from({ length: f >= w300 - 6 ? 3 : 0 }).map((_, i) => <g key={i} transform={`translate(${320 + i * 40} ${GROUND - 8})`}><Nail rot={88} /></g>)}
            {Array.from({ length: f >= w2300 - 6 ? 24 : 0 }).map((_, i) => <g key={`b${i}`} transform={`translate(${740 + (i % 8) * 38} ${GROUND - 8 - Math.floor(i / 8) * 22})`}><Nail s={0.8} rot={88} /></g>)}
          </g>
        )}
        {p1 > 0 && (
          <g opacity={p1}>
            <Farm dim={0.55} manor={false} town={false} />
            <g transform={`translate(230 ${GROUND - 10})`}><Loom s={1.1} t={f} /></g>
            <g transform={`translate(860 ${GROUND - 10})`}><Sheaf s={1.8} /></g>
            <Ahe x={keys(f - wLoom, [[0, 300], [60, 760]])} s={0.8} mood={f >= wLose ? "tired" : "smile"} legs={f > wLoom && f < wLoom + 60 ? walkLegs(f) : [0, 0]} sweat={f >= wLose} />
            <HeadMark x={560} y={GROUND - 250} text="…" at={wLose} col={C.ink2} />
          </g>
        )}
        {pE > 0 && (
          <g opacity={pE}>
            <Village dim={0.55} />
            <rect x={120} y={GROUND - 360} width={200} height={360} rx={12} fill="#7A5C4A" stroke={C.ink} strokeWidth={4} />
            <rect x={150} y={GROUND - 420} width={50} height={80} fill="#5A4636" stroke={C.ink} strokeWidth={4} />
            <rect x={320} y={GROUND - 200} width={60} height={40} fill="#9EA6B2" stroke={C.ink} strokeWidth={4} />
            <g transform={`translate(380 ${GROUND - 180}) rotate(${lever})`}><rect x={0} y={-8} width={110} height={16} rx={8} fill="#C3923F" stroke={C.ink} strokeWidth={3} /></g>
            {tied && <path d={`M ${380 + 110 * Math.cos((lever * Math.PI) / 180)} ${GROUND - 180 + 110 * Math.sin((lever * Math.PI) / 180)} Q 420 ${GROUND - 330} 300 ${GROUND - 360}`} stroke={C.red} strokeWidth={4} fill="none" />}
            <Hop f={f} a={14} on={tied}><Mini x={boyX} y={GROUND} col="#6E8FA8" s={1.3} /></Hop>
            {tied && [0, 1].map((i) => <Hop key={i} f={f} ph={i + 1} a={14}><Mini x={900 + i * 80} y={GROUND} col={["#7C8C5A", "#C3923F"][i]} s={1.1} o={fin(f, wRope + 10, 10)} /></Hop>)}
            <HeadMark x={boyX + 20} y={GROUND - 260} text={tied ? "♪" : "…"} at={tied ? wRope + 10 : wBoy} />
          </g>
        )}
        {p5 > 0 && (
          <g opacity={p5}>
            <Farm dim={0.35} />
            <Farmer x={200} s={0.85} mood="tired" sweat armR={[f >= wReap - 6 ? swing(f, 0.3, 40, 120) : 40, 30]} />
            <g transform={`translate(260 ${GROUND - 150}) rotate(${f >= wReap - 6 ? swing(f, 0.3, -30, 20) : 0})`}><Sickle s={1.1} /></g>
          </g>
        )}
        {p6 > 0 && (
          <g opacity={p6}>
            <g transform={`translate(540 ${GROUND - 300})`}><Phone s={1.4} /></g>
            {Array.from({ length: Math.floor(interpolate(f, [wSteps - 20, wSteps + 20], [0, 28], CL)) }).map((_, i) => <Mini key={i} x={60 + (i % 14) * 74} y={GROUND - (i < 14 ? 0 : 90)} col={["#7C8C5A", "#5E7FA8", "#C3923F", "#86593A"][i % 4]} s={0.8} o={0.8} />)}
          </g>
        )}
      </Stage>
      {p0 > 0 && (
        <Box o={p0}>
          <div style={{ fontSize: 44 }}>第一个原因：手越来越熟</div>
          <Row f={f} at={w300}>普通铁匠：一天 <span style={{ color: C.mute }}>两三百根</span>，还打不好</Row>
          <Row f={f} at={w2300}>只打钉子的年轻人：<span style={{ color: STEP[0], fontSize: 56 }}>2300+ 根</span></Row>
        </Box>
      )}
      {p1 > 0 && <T y={400} size={44} serif style={{ opacity: p1 }}>第二个原因：从织布机走到地里</T>}
      {p1 > 0 && f >= wLose - 10 && <T y={480} size={46} serif color={C.red} style={{ opacity: fin(f, wLose - 10, 8) * p1 }}>一天里不知不觉耗掉不少时间</T>}
      {pE > 0 && <T y={400} size={44} serif style={{ opacity: pE }}>第三个原因：守阀门的男孩</T>}
      {pE > 0 && f >= wSelf - 10 && f < L.s(4) - 6 && <T y={480} size={46} serif color={STEP[0]} style={{ opacity: fin(f, wSelf - 10, 8) }}>拴根绳子，阀门自己开关</T>}
      {pE > 0 && f >= L.s(4) - 6 && <Seal x={540} y={520} text="天天琢磨一件事，就想出省事的办法" size={44} rot={-3} style={{ opacity: fin(f, L.s(4) - 6, 6) * pE, scale: String(interpolate(fin(f, wIdea - 10, 8), [0, 1], [1.4, 1])) }} />}
      {p5 > 0 && (
        <Box o={p5}>
          <div style={{ fontSize: 44 }}>分工在作坊里提得快，<span style={{ color: C.mute }}>在地里慢得多</span></div>
          <Row f={f} at={wPlough}>春天犁地、<span style={{ opacity: fin(f, wReap - 6, 8) }}>秋天收割：一个人总得换着干</span></Row>
        </Box>
      )}
      {p6 > 0 && <T y={400} size={44} serif style={{ opacity: p6 }}>一部手机：挖矿、炼材料、做芯片、组装</T>}
      {p6 > 0 && f >= wSteps - 10 && <T y={480} size={50} serif color={STEP[0]} style={{ opacity: fin(f, wSteps - 10, 8), scale: String(pop(f, fps, wSteps - 10, 10)) }}>成千上万道工序</T>}
      <Sfx at={w300} name="pop" v={0.28} />
      <Sfx at={w2300} name="boom" v={0.4} />
      <Sfx at={wLose} name="tick" v={0.3} />
      <Sfx at={wBoy} name="pop" v={0.28} />
      <Sfx at={wRope} name="ding" v={0.35} />
      <Sfx at={wIdea} name="boom" v={0.4} />
      <Sfx at={wSlow} name="tick" v={0.3} />
      <Sfx at={wPhone} name="pop" v={0.3} />
      <Sfx at={wSteps} name="ding" v={0.3} />
    </Shell>
  );
};

// ================================================================ ① 当代：外卖骑手 → 能交换才敢只干一样 → 哲学家和挑夫
export const STrade2: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("trade2");
  const W = useWordAt("trade2");
  const wRider = W(0, "骑手"), wPay = W(0, "这一单的钱"), wOne = W(1, "只干一样活"), wBest = W(1, "练到最好"), wPhil = W(2, "哲学家"), wPort = W(2, "挑夫"), wSmall = W(2, "没有我们想的那么大"), wEdu = W(2, "受的教育");
  const p0 = ph(f, L, 0, 1), p1 = ph(f, L, 1, 2), p2 = ph(f, L, 2);
  return (
    <Shell dur={L.dur} enter={{ iris: [540, 900] }} cam="push" zoom={0.05} kicks={[wPay, wBest, wSmall, wEdu]}>
      <Paper />
      <Modern scene="trade2" i={0} />
      <Stage>
        <Ground />
        {p0 > 0 && (
          <g opacity={p0}>
            <Street dim={0.5} />
            <circle cx={900} cy={420} r={60} fill="#E8C35A" />
            <g transform={`translate(${keys(f - wRider, [[-10, 120], [60, 520]])} 0)`}>
              <Hop f={f} a={8} on={f < wRider + 60}><Mini x={0} y={GROUND} col="#3F7F6A" s={1.5} /></Hop>
              <rect x={-60} y={GROUND - 190} width={70} height={60} rx={8} fill="#3F7F6A" stroke={C.ink} strokeWidth={3} />
            </g>
            <Hop f={f} a={10} on={f >= wPay - 6 && f < wPay + 30}><Mini x={880} y={GROUND} col="#6E8FA8" s={1.5} /></Hop>
            {f >= wPay - 6 && <g transform={`translate(700 ${GROUND - 260}) scale(${pop(f, fps, wPay - 6, 11) * 1.4})`}><Coin /></g>}
          </g>
        )}
        {p1 > 0 && <g opacity={p1}><Smith x={540} s={1.15} mood="happy" armR={[swing(f, 0.45, 20, 130), 20]} /></g>}
        {p2 > 0 && (
          <g opacity={p2}>
            <Square dim={0.5} banner={false} />
            <Scholar x={keys(f - L.s(2), [[0, 200], [30, 300]])} s={1.05} mood="smile" legs={f < L.s(2) + 30 ? walkLegs(f) : [0, 0]} tilt={f >= wSmall ? swing(f, 0.08, -4, 4) : 0} />
            <g transform={`translate(${keys(f - L.s(2), [[0, 120], [30, 0]])} 0)`}>
              <Hop f={f} a={6} on={f < L.s(2) + 30}><Mini x={760} y={GROUND} col="#86593A" s={1.6} />
              <g transform={`translate(790 ${GROUND - 200})`}><Bundle s={1.0} /></g></Hop>
            </g>
          </g>
        )}
      </Stage>
      {p0 > 0 && <T y={420} size={46} serif style={{ opacity: p0 }}>骑手给你送饭：<span style={{ color: C.mute }}>不认识你</span></T>}
      {p0 > 0 && f >= wPay - 8 && <T y={500} size={48} serif color={STEP[0]} style={{ opacity: fin(f, wPay - 8, 8) * p0 }}>是这一单的钱让他觉得值</T>}
      {p1 > 0 && <Seal x={540} y={520} text="能交换，才敢只干一样活，练到最好" size={46} rot={-3} style={{ opacity: p1, scale: String(interpolate(fin(f, wBest - 10, 8), [0, 1], [1.3, 1])) }} />}
      {p2 > 0 && (
        <Box o={p2}>
          <div style={{ fontSize: 44 }}><span style={{ opacity: fin(f, wPhil - 6, 8) }}>哲学家</span>和<span style={{ opacity: fin(f, wPort - 6, 8) }}>街头挑夫</span></div>
          <Row f={f} at={wSmall} size={46}>天生的差别，<span style={{ color: C.red }}>没那么大</span></Row>
          <Row f={f} at={wEdu} size={42}>是干的活、受的教育，慢慢拉开的</Row>
        </Box>
      )}
      <Sfx at={wRider} name="pop" v={0.28} />
      <Sfx at={wPay} name="ding" v={0.3} />
      <Sfx at={wBest} name="boom" v={0.35} />
      <Sfx at={wSmall} name="boom" v={0.4} />
    </Shell>
  );
};

// ================================================================ ① 尼罗河 → 当代：网上卖螺丝 → 外套染料背后的船 → 第一步结论
export const SMarket2: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("market2");
  const W = useWordAt("market2");
  const wSea = W(0, "海边"), wNile = W(0, "尼罗河"), wCheap = W(0, "又远又便宜"), wTown = W(1, "小县城"), wNet = W(1, "卖给全国"), wOne = W(1, "只做一种螺丝"), wDye = W(2, "染料"), wRope = W(2, "搓绳子的"), wNone = W(2, "一个都养不活"), wEnd = W(3, "第一步的结论");
  const p0 = ph(f, L, 0, 1), p1 = ph(f, L, 1, 2), p2 = ph(f, L, 2, 3), p3 = ph(f, L, 3);
  const roles = ["商人", "搬运工", "造船的", "织帆的", "搓绳子的"];
  return (
    <Shell dur={L.dur} enter="page" cam="panL" zoom={0.05} kicks={[wNile, wCheap, wNet, wOne, wNone, wEnd]}>
      <Paper />
      <Modern scene="market2" i={1} />
      <Stage>
        {p0 > 0 && (
          <g opacity={p0}>
            <Sea x={0} w={1080} t={f} />
            <path d={`M 620 ${GROUND - 170} L 760 ${GROUND - 340} L 900 ${GROUND - 170} Z`} fill="#D9B97A" stroke={C.ink} strokeWidth={4} opacity={fin(f, wNile - 6, 10)} />
            <Ship x={interpolate(f, [wSea - 10, wCheap + 30], [160, 420], CL)} y={GROUND - 20} s={0.9} rock={Math.sin(f * 0.1) * 2} />
          </g>
        )}
        {p1 > 0 && (
          <g opacity={p1}>
            <Street dim={0.6} />
            <Ground />
            <g opacity={1 - fin(f, wNet - 6, 10)}><Shopfront x={300} s={1.1} sign="只卖螺丝" /></g>
            <g transform={`translate(760 ${GROUND - 300})`}><Phone s={1.2} /></g>
            {Array.from({ length: Math.floor(interpolate(f, [wNet - 10, wNet + 30], [0, 20], CL)) }).map((_, i) => <Mini key={i} x={60 + (i % 10) * 100} y={GROUND - (i < 10 ? 0 : 0)} col={["#7C8C5A", "#5E7FA8", "#C3923F", "#86593A"][i % 4]} s={0.7} o={0.7} />)}
          </g>
        )}
        {p2 > 0 && (
          <g opacity={p2}>
            <Sea x={0} w={1080} t={f} />
            <Ship x={keys(f - wDye, [[0, 1250], [60, 860]])} y={GROUND - 190} s={0.8} rock={Math.sin(f * 0.1) * 2} />
            <rect x={0} y={GROUND - 30} width={1080} height={160} fill="#CDBB98" />
            <g transform={`translate(540 ${GROUND - 420}) rotate(${swing(f, 0.06, -3, 3)} 0 -280) scale(0.9)`}><Coat /></g>
            {roles.map((r, i) => (
              <g key={r} opacity={fin(f, wDye + i * 8, 8)} transform={`translate(0 ${f < wDye + i * 8 + 16 ? hop(f, i, 16) : 0})`}>
                <Mini x={140 + i * 200} y={GROUND} col={["#3D4A63", "#86593A", "#5E7FA8", "#C3923F", "#7C8C5A"][i]} s={1.2} />
                <text x={140 + i * 200} y={GROUND + 50} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={C.ink2}>{r}</text>
              </g>
            ))}
          </g>
        )}
      </Stage>
      {p0 > 0 && <T y={400} size={44} serif style={{ opacity: p0 }}>最早富起来的地方：<span style={{ color: STEP[0] }}>海边、大河边</span></T>}
      {p0 > 0 && f >= wNile - 8 && <T y={480} size={42} serif color={C.ink2} style={{ opacity: fin(f, wNile - 8, 8) * p0 }}>比如尼罗河边的古埃及：水路运得又远又便宜</T>}
      {p1 > 0 && <T y={400} size={44} serif style={{ opacity: p1 }}>小县城：<span style={{ color: C.mute }}>开不起只卖螺丝的店</span></T>}
      {p1 > 0 && f >= wNet - 8 && <T y={480} size={46} serif style={{ opacity: fin(f, wNet - 8, 8) * p1 }}>放到网上卖给全国：<span style={{ color: STEP[0], opacity: fin(f, wOne - 8, 8) }}>有人只做一种螺丝</span></T>}
      {p2 > 0 && <T y={340} size={42} serif style={{ opacity: p2 }}>光是把外套的<span style={{ color: C.red }}>染料</span>运过来</T>}
      {p2 > 0 && f >= wNone - 10 && <T y={1000} size={44} serif color={C.red} style={{ opacity: fin(f, wNone - 10, 8) }}>没有大市场，这些人一个都养不活</T>}
      {p3 > 0 && <StepConclusion n={1} text="分工让东西越造越多；能卖给的人越多，分工越细" at={wEnd} y={420} />}
      <Sfx at={wNile} name="pop" v={0.28} />
      <Sfx at={wCheap} name="ding" v={0.3} />
      <Sfx at={wTown} name="tick" v={0.28} />
      <Sfx at={wNet} name="pop" v={0.3} />
      <Sfx at={wOne} name="ding" v={0.3} />
      {roles.map((_, i) => <Sfx key={i} at={wDye + i * 8} name="pop" v={0.2} />)}
      <Sfx at={wRope} name="pop" v={0.2} />
      <Sfx at={wNone} name="boom" v={0.35} />
      <Sfx at={wEnd} name="boom" v={0.45} />
    </Shell>
  );
};

// ================================================================ ② 钱的样子：牛盐贝壳烟草钉子 → 小满 → 打印成铸币 → 一镑银子缩到三分之一 → 当代：手机里的数字
export const SMoney2: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("money2");
  const W = useWordAt("money2");
  const M = useMouth("money2");
  const wOx = W(0, "牛"), wSalt = W(0, "盐"), wShell = W(0, "贝壳"), wTob = W(0, "烟草"), wNail = W(0, "钉子"), wWeigh = W(2, "称重"), wStamp = W(2, "打个印"), wCoin = W(2, "铸币"), wPound = W(3, "一磅重的银子"), wLess = W(3, "少放银子"), w3 = W(3, "三分之一"), wPhone = W(4, "手机里的数字"), wBaker = W(4, "面包师");
  const p01 = ph(f, L, 0, 2), p2 = ph(f, L, 2, 3), p3 = ph(f, L, 3, 4), p4 = ph(f, L, 4);
  const items = [{ t: "牛", at: wOx }, { t: "盐", at: wSalt }, { t: "贝壳", at: wShell }, { t: "烟草", at: wTob }, { t: "钉子", at: wNail }];
  return (
    <Shell dur={L.dur} enter="page" cam="panR" zoom={0.05} kicks={[wNail, L.s(1), wCoin, wPound, w3, wPhone]}>
      <Paper />
      <Modern scene="money2" i={4} />
      <Stage>
        <Ground />
        {p01 > 0 && (
          <g opacity={p01}>
            <Village dim={0.55} />
            <g opacity={fin(f, wOx - 6, 8)}><Ox x={620} y={GROUND} s={0.75} /></g>
            <g transform={`translate(800 ${GROUND - 10}) scale(${pop(f, fps, wSalt - 6, 11)})`}><SaltPile s={0.9} /></g>
            <g transform={`translate(900 ${GROUND - 10}) scale(${pop(f, fps, wShell - 6, 11)})`}><Cowrie s={0.9} /></g>
            <g transform={`translate(990 ${GROUND - 10}) scale(${pop(f, fps, wTob - 6, 11)})`}><Tobacco s={0.9} /></g>
            {f >= wNail - 6 && Array.from({ length: 6 }).map((_, i) => <g key={i} transform={`translate(${470 + i * 26} ${GROUND - 8}) scale(${pop(f, fps, wNail - 6 + i * 2, 11)})`}><Nail rot={88} /></g>)}
            <Xiaoman x={300} s={1.1} mood={M("小满", f, "wow")} />
            <HeadMark x={340} y={GROUND - 430} text="！" at={L.s(1)} />
          </g>
        )}
        {p2 > 0 && (
          <g opacity={p2}>
            <Forge x={950} s={0.7} fire={0.8} />
            <Smith x={300} s={0.85} mood={f >= wStamp ? "happy" : "flat"} armR={[f >= wStamp - 10 && f < wStamp + 20 ? keys(f - wStamp, [[-10, 130], [-2, 40], [10, 130]]) : 40, 30]} />
            <g transform={`translate(540 ${GROUND - 240}) scale(${2.4 * pop(f, fps, wStamp - 6, 11) * (f < wStamp - 6 ? 1 : Math.cos((Math.min(f - wStamp + 6, 24) / 24) * Math.PI * 2))} ${2.4 * pop(f, fps, wStamp - 6, 11)})`}><Coin /></g>
            <g transform={`translate(${540 + 160} ${GROUND - 420 + keys(f - wStamp, [[-12, -60], [-2, 0], [10, -40]])})`} opacity={fin(f, wWeigh, 8)}><rect x={-30} y={-90} width={60} height={90} rx={8} fill="#86593A" stroke={C.ink} strokeWidth={4} /><rect x={-50} y={0} width={100} height={24} rx={6} fill="#5A4636" stroke={C.ink} strokeWidth={4} /></g>
          </g>
        )}
        {p3 > 0 && (
          <g opacity={p3}>
            <VBar x={540} y={GROUND - 20} v={f >= w3 - 4 ? 0.3 : 0.9} col="#B8BEC6" label="一镑里的银子" val={f >= w3 - 4 ? "约 1/3" : "1 磅"} w={180} />
          </g>
        )}
        {p4 > 0 && (
          <g opacity={p4}>
            <Butcher x={200} s={0.85} mood="happy" holdR={<Meat s={0.7} />} armR={[60, 20]} />
            <Person x={880} y={GROUND} s={0.85} hat="chef" shirt="#E9DFCB" apron seed={402} flip mood="happy" holdR={<Bread s={0.8} />} armR={[60, 20]} />
            <g transform={`translate(540 ${GROUND - 300}) scale(${1 + 0.04 * Math.sin(f * 0.2)})`}><Phone s={1.4}><text x={0} y={-10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={STEP[1]}>¥</text></Phone></g>
          </g>
        )}
      </Stage>
      {p01 > 0 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 380, display: "flex", justifyContent: "center", gap: 18, fontFamily: SERIF, fontWeight: 900, opacity: p01 }}>
          {items.map((it) => <span key={it.t} style={{ fontSize: 46, padding: "8px 22px", borderRadius: 999, border: `4px solid ${STEP[1]}`, background: it.t === "钉子" ? STEP[1] : "#FBF7EF", color: it.t === "钉子" ? C.paper : C.ink, opacity: fin(f, it.at - 6, 6), scale: String(pop(f, fps, it.at - 6, 11)) }}>{it.t}</span>)}
        </div>
      )}
      {p01 > 0 && f < L.s(1) && <T y={480} size={40} serif color={C.ink2} style={{ opacity: fin(f, wNail - 6, 8) }}>都当过钱：还有村子，工人揣着钉子买面包</T>}
      {f >= L.s(1) - 2 && f < L.s(2) && <Bubble x={440} y={720} size={36} o={fin(f, L.s(1) - 2, 5)}>那我打的钉子，也能当钱花？</Bubble>}
      {p2 > 0 && (
        <Box o={p2}>
          <div style={{ fontSize: 44 }}>每次都得<span style={{ color: C.mute }}>称重、验成色</span></div>
          <Row f={f} at={wStamp} size={46}>打个印：写明多重、多纯</Row>
          <Row f={f} at={wCoin} size={56}><span style={{ color: STEP[1] }}>= 铸币</span></Row>
        </Box>
      )}
      {p3 > 0 && <T y={400} size={44} serif style={{ opacity: p3 }}>最早的一镑，真是<span style={{ color: STEP[1] }}>一磅重的银子</span></T>}
      {p3 > 0 && f >= wLess - 8 && <T y={480} size={44} serif style={{ opacity: fin(f, wLess - 8, 8) * p3 }}>君主们一次次少放银子：<span style={{ color: C.red, opacity: fin(f, w3 - 6, 8) }}>只剩约三分之一</span></T>}
      {p4 > 0 && <T y={400} size={44} serif style={{ opacity: p4 }}>今天的钱：纸和手机里的数字</T>}
      {p4 > 0 && f >= wBaker - 14 && <T y={480} size={42} serif color={STEP[1]} style={{ opacity: fin(f, wBaker - 14, 8) }}>干的还是同一件活：不用找正好想要肉的面包师</T>}
      {items.map((it, i) => <Sfx key={i} at={it.at} name="pop" v={0.22} />)}
      <Sfx at={wWeigh} name="tick" v={0.28} />
      <Sfx at={wStamp} name="hammer" v={0.35} />
      <Sfx at={wPound} name="ding" v={0.3} />
      <Sfx at={w3} name="boom" v={0.4} />
      <Sfx at={wPhone} name="pop" v={0.3} />
    </Shell>
  );
};

// ================================================================ ② 值多少：拿什么量 → 水和钻石 → 两种“值钱” → 富不富看能享受多少，靠别人的劳动
export const SValue: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("value");
  const W = useWordAt("value");
  const wWorth = W(0, "真正值多少"), wWater = W(1, "水最有用"), wDia = W(1, "钻石"), wPile = W(1, "一大堆东西"), wUse = W(2, "用处大不大"), wBook = W(2, "书里要讲的"), wRich = W(3, "富不富"), wOther = W(3, "别人的劳动");
  const p1 = ph(f, L, 1, 3), p2 = fin(f, L.s(2) - 6, 12), p3 = ph(f, L, 3);
  return (
    <Shell dur={L.dur} enter={{ ink: [540, 800] }} cam="still" kicks={[wWorth, wDia, wPile, wBook, wOther]}>
      <Paper dusk={0.35} />
      <Stage>
        <rect x={0} y={GROUND} width={1080} height={130} fill="#C4B796" />
        {p1 > 0 && (
          <g opacity={p1}>
            <You x={540} s={0.8} mood={f >= wPile ? "wow" : "flat"} tilt={swing(f, 0.08, -8, 8)} />
            <g transform={`translate(300 ${GROUND - 200 + Math.sin(f * 0.12) * 8}) scale(${1.6 * pop(f, fps, wWater - 6, 11)})`}><path d="M 0 -90 Q 50 -20 50 20 A 50 50 0 0 1 -50 20 Q -50 -20 0 -90 Z" fill="#7FB3D5" stroke={C.ink} strokeWidth={4} /></g>
            <g transform={`translate(780 ${GROUND - 200}) rotate(${swing(f, 0.1, -8, 8)}) scale(${1.6 * pop(f, fps, wDia - 6, 11)})`}><path d="M -50 -30 L -25 -60 L 25 -60 L 50 -30 L 0 50 Z" fill="#DDEFF7" stroke={C.ink} strokeWidth={4} /><path d="M -50 -30 L 50 -30 M -25 -60 L 0 -30 L 25 -60 M 0 -30 L 0 50" stroke={C.ink} strokeWidth={2} fill="none" /></g>
            {f >= wPile - 6 && [0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${700 + i * 50} ${GROUND - 40}) scale(${pop(f, fps, wPile - 6 + i * 3, 11)})`}><Coin /></g>)}
          </g>
        )}
        {p3 > 0 && <g opacity={p3}><WeaveStreet dim={0.6} /><You x={540} s={0.85} mood="happy" holdR={<Bread s={0.7} />} armR={[60, 20]} />{Array.from({ length: 9 }).map((_, i) => <Mini key={i} x={120 + i * 105} y={GROUND} col={["#7C8C5A", "#5E7FA8", "#C3923F"][i % 3]} s={1.0} o={fin(f, wOther - 10 + i * 2, 8)} />)}</g>}
      </Stage>
      {f < L.s(1) && <T y={420} size={50} serif>拿什么量一样东西<span style={{ color: C.red }}>真正值多少</span>？</T>}
      {p1 > 0 && (
        <Box o={p1 * (1 - p2)}>
          <div style={{ fontSize: 46 }}>水<span style={{ color: STEP[0] }}>最有用</span>，几乎换不来什么</div>
          <Row f={f} at={wDia} size={46}>钻石<span style={{ color: C.mute }}>几乎没用</span>，<span style={{ opacity: fin(f, wPile - 6, 8) }}>却能换一大堆</span></Row>
        </Box>
      )}
      {p2 > 0 && p3 < 1 && (
        <Box o={p2 * (1 - p3)}>
          <div style={{ fontSize: 44 }}>“值钱”有两种意思</div>
          <Row f={f} at={wUse} size={46}><span style={{ color: C.mute }}>用处大不大</span>　·　<span style={{ color: STEP[1] }}>能换来多少</span></Row>
          <Row f={f} at={wBook} size={44}>书里要讲的：<span style={{ color: STEP[1] }}>能换来多少</span></Row>
        </Box>
      )}
      {p3 > 0 && (
        <Box o={p3}>
          <div style={{ fontSize: 44 }}>一个人<span style={{ color: C.red }}>富不富</span>：能享受多少吃的、用的、玩的</div>
          <Row f={f} at={wOther} size={46}>分工以后，大多靠<span style={{ color: STEP[1] }}>别人的劳动</span>换来</Row>
        </Box>
      )}
      <Sfx at={wWorth} name="tick" v={0.3} />
      <Sfx at={wWater} name="pop" v={0.28} />
      <Sfx at={wDia} name="ding" v={0.3} />
      <Sfx at={wBook} name="boom" v={0.35} />
      <Sfx at={wOther} name="pop" v={0.3} />
    </Shell>
  );
};

// ================================================================ ② 价钱分给谁：打猎年代只看力气（海狸换两只鹿）→ 有了本钱和地主，才多出利润和地租
const Beaver: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={-40} rx={60} ry={40} fill="#8C5A40" stroke={C.ink} strokeWidth={4} />
    <ellipse cx={-70} cy={-14} rx={36} ry={14} fill="#5A4636" stroke={C.ink} strokeWidth={3} />
    <circle cx={50} cy={-62} r={24} fill="#8C5A40" stroke={C.ink} strokeWidth={4} />
    <circle cx={58} cy={-68} r={3.5} fill={C.ink} />
    <rect x={64} y={-52} width={8} height={10} fill="#F3EBDD" stroke={C.ink} strokeWidth={1.5} />
  </g>
);
const Deer: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={-90} rx={60} ry={28} fill="#B98A5A" stroke={C.ink} strokeWidth={4} />
    {[-40, -20, 25, 45].map((lx) => <rect key={lx} x={lx - 5} y={-70} width={10} height={70} rx={4} fill="#B98A5A" stroke={C.ink} strokeWidth={3} />)}
    <path d="M 50 -105 L 70 -150" stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
    <path d="M 50 -105 L 70 -150" stroke="#B98A5A" strokeWidth={8} strokeLinecap="round" />
    <circle cx={78} cy={-158} r={18} fill="#B98A5A" stroke={C.ink} strokeWidth={4} />
    <path d="M 72 -174 L 64 -200 M 68 -190 L 56 -196 M 84 -174 L 92 -200 M 88 -190 L 100 -196" stroke={C.ink} strokeWidth={3} />
  </g>
);
export const SHunt: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("hunt");
  const W = useWordAt("hunt");
  const wWho = W(0, "分给了谁"), wForce = W(1, "费了多少力气"), wBeaver = W(1, "海狸"), wTwo = W(1, "两倍"), wDeer = W(1, "两只鹿"), wNew = W(2, "利润和地租"), wSow = W(2, "没播种");
  const p1 = ph(f, L, 1, 2), p2 = ph(f, L, 2);
  return (
    <Shell dur={L.dur} enter={{ ink: [540, 700] }} cam="pull" zoom={0.05} kicks={[wWho, wTwo, wDeer, wNew, wSow]}>
      <Paper />
      <Stage>
        <Ground />
        {p1 > 0 && (
          <g opacity={p1}>
            <Village dim={0.4} />
            <Amu x={160} s={0.85} mood={f >= wDeer ? "happy" : "smile"} armR={[keys(f - wForce, [[0, 12], [12, 100]]), 30]} />
            <g transform={`translate(${keys(f - wBeaver, [[-6, 300], [20, 380]])} ${GROUND + hop(f, 0, 6)})`} opacity={fin(f, wBeaver - 6, 8)}><Beaver s={1.3} /></g>
            <text x={560} y={GROUND - 80} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={80} fill={C.ink} opacity={fin(f, wDeer - 8, 8)}>=</text>
            {[0, 1].map((i) => <g key={i} transform={`translate(${keys(f - wDeer, [[-8 + i * 4, 1100], [16 + i * 4, 720 + i * 190]])} ${GROUND + (f < wDeer + 20 + i * 4 ? hop(f, i, 10) : 0)})`} opacity={fin(f, wDeer - 8 + i * 4, 8)}><Deer s={1.0} /></g>)}
          </g>
        )}
        {p2 > 0 && (
          <g opacity={p2}>
            <Farm dim={0.2} />
            <Landlord x={keys(f - L.s(2), [[0, 60], [30, 200]])} s={1.05} mood={f >= wSow ? "smirk" : "smile"} legs={f < L.s(2) + 30 ? walkLegs(f) : [0, 0]} armR={f >= wSow ? [swing(f, 0.2, 40, 90), 20] : [12, 10]} />
            <HeadMark x={240} y={GROUND - 420} text="♪" at={wSow} col={C.ink2} />
          </g>
        )}
      </Stage>
      {f < L.s(1) && <T y={430} size={50} serif>一样东西的价钱，最后都<span style={{ color: C.red }}>分给了谁</span>？</T>}
      {p1 > 0 && <T y={400} size={44} serif style={{ opacity: p1 }}>最早打猎的年代：价钱只看<span style={{ color: STEP[1] }}>费了多少力气</span></T>}
      {p1 > 0 && f >= wTwo - 8 && <T y={480} size={50} serif style={{ opacity: fin(f, wTwo - 8, 8) * p1, scale: String(pop(f, fps, wDeer - 8, 10)) }}>力气花两倍：<span style={{ color: STEP[1] }}>1 只海狸 = 2 只鹿</span></T>}
      {p2 > 0 && <T y={400} size={44} serif style={{ opacity: p2 }}>有了本钱、有了地主，才多出<span style={{ color: PART.profit }}>利润</span>和<span style={{ color: PART.rent }}>地租</span></T>}
      {p2 > 0 && f >= wSow - 14 && <T y={480} size={42} serif color={C.ink2} style={{ opacity: fin(f, wSow - 14, 8) }}>地主和所有人一样，喜欢在<span style={{ color: C.red }}>没播种的地方</span>收割</T>}
      <Sfx at={wWho} name="tick" v={0.3} />
      <Sfx at={wBeaver} name="pop" v={0.28} />
      <Sfx at={wDeer} name="boom" v={0.4} />
      <Sfx at={wNew} name="ding" v={0.3} />
      <Sfx at={wSow} name="pop" v={0.3} />
    </Shell>
  );
};

// ================================================================ ② 当代：口罩涨了又跌 → 独占的最高价、自由竞争的最低价 → 第二步结论
export const SCenter2: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("center2");
  const W = useWordAt("center2");
  const wMask = W(0, "口罩"), wUp = W(0, "翻了好几倍"), wSwitch = W(0, "转产"), wBack = W(0, "跌回去"), wMono = W(1, "独占"), wHigh = W(1, "最高价"), wLow = W(1, "最低价"), wEnd = W(2, "第二步的结论");
  const p0 = ph(f, L, 0, 1), p1 = ph(f, L, 1, 2), p2 = ph(f, L, 2);
  const amp = f < wUp - 6 ? 0.1 : f < wSwitch ? 0.42 : interpolate(f, [wSwitch, wBack + 20], [0.42, 0.05], CL);
  return (
    <Shell dur={L.dur} enter="fade" cam="panL" zoom={0.05} kicks={[wUp, wBack, wHigh, wLow, wEnd]}>
      <Paper dusk={0.2} />
      <Modern scene="center2" i={0} />
      <Stage>
        {p0 > 0 && (
          <g opacity={p0}>
            {[0, 1, 2].map((i) => <g key={i} transform={`translate(${200 + i * 340} ${GROUND})`} opacity={fin(f, wSwitch - 6 + i * 6, 10)}><FactoryB s={1.2} k={fin(f, wSwitch - 6 + i * 6, 14)} /></g>)}
            <g transform={`translate(540 ${GROUND - 420}) scale(${1.2 * pop(f, fps, wMask - 6, 11)})`}><Mask s={1.4} /></g>
            <PriceSwing x={540} y={760} amp={amp} t={f} />
            {f >= wSwitch - 6 && [0, 1, 2].map((i) => <Mini key={i} x={keys(f - wSwitch, [[-6, 1120], [24, 720 + i * 100]])} y={GROUND} col="#5E7FA8" s={1.0} />)}
          </g>
        )}
        {p1 > 0 && (
          <g opacity={p1}>
            <VBar x={340} y={GROUND - 20} v={0.85 * fin(f, wHigh - 8, 12)} col={C.red} label="独占" w={160} />
            <VBar x={740} y={GROUND - 20} v={0.4 * fin(f, wLow - 8, 12)} col={STEP[1]} label="自由竞争" w={160} />
          </g>
        )}
      </Stage>
      {p0 > 0 && <T y={400} size={44} serif style={{ opacity: p0 }}>有一年<span style={{ color: C.red }}>口罩</span>紧缺：<span style={{ opacity: fin(f, wUp - 6, 8) }}>价格翻了好几倍</span></T>}
      {p0 > 0 && f >= wSwitch - 8 && <T y={480} size={44} serif style={{ opacity: fin(f, wSwitch - 8, 8) * p0 }}>好多工厂转产，<span style={{ color: STEP[1], opacity: fin(f, wBack - 8, 8) }}>价格又跌回去</span></T>}
      {p1 > 0 && (
        <Box o={p1}>
          <div style={{ fontSize: 44 }}>要是一门生意被<span style={{ color: C.red }}>独占</span>：</div>
          <Row f={f} at={wHigh} size={44}>独占的价格：每次都是<span style={{ color: C.red }}>能要到的最高价</span></Row>
          <Row f={f} at={wLow} size={44}>自由竞争：长期看是<span style={{ color: STEP[1] }}>能接受的最低价</span></Row>
        </Box>
      )}
      {p2 > 0 && <StepConclusion n={2} text="钱是为了方便交换；价格背后有个中心；贵了有人进来，贱了有人离开" at={wEnd} y={400} />}
      <Sfx at={wMask} name="pop" v={0.28} />
      <Sfx at={wUp} name="boom" v={0.35} />
      <Sfx at={wBack} name="ding" v={0.3} />
      <Sfx at={wHigh} name="pop" v={0.3} />
      <Sfx at={wLow} name="pop" v={0.3} />
      <Sfx at={wEnd} name="boom" v={0.45} />
    </Shell>
  );
};

// ================================================================ ③ 当代：招工难 → 平时谁更急（老板人少、有积蓄）→ 工钱的底 → 大多数人穷苦的社会不会繁荣
export const SWage2: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("wage2");
  const W = useWordAt("wage2");
  const wHard = W(0, "招工难"), wTalk = W(1, "谈出来的"), wFew = W(1, "老板人少"), wSave = W(1, "积蓄"), wHungry = W(1, "没饭吃"), wFloor = W(2, "有个底"), wSelf = W(2, "养活自己"), wFam = W(2, "养不起一家人"), wFlour = W(3, "繁荣"), wMore = W(3, "更卖力");
  const p0 = ph(f, L, 0, 1), p1 = ph(f, L, 1, 2), p2 = ph(f, L, 2, 3), p3 = ph(f, L, 3);
  return (
    <Shell dur={L.dur} enter="page" cam="push" zoom={0.05} kicks={[wHard, wSave, wHungry, wFam, wFlour, wMore]}>
      <Paper />
      <Modern scene="wage2" i={0} />
      <Stage>
        <Ground />
        {p0 > 0 && <g opacity={p0}>{[0, 1, 2].map((i) => <g key={i} opacity={fin(f, L.s(0) + i * 10, 8)} transform={`translate(${200 + i * 340} ${GROUND + (1 - fin(f, L.s(0) + i * 10, 10)) * 60})`}><FactoryB s={1.5} k={fin(f, L.s(0) + i * 10, 14)} /></g>)}
          {f >= wHard - 6 && [0, 1, 2].map((i) => <Hop key={`r${i}`} f={f} ph={i} a={8}><Mini x={keys(f - wHard, [[-6 + i * 4, -60], [30 + i * 4, 260 + i * 260]])} y={GROUND} col="#B98A45" s={1.0} /></Hop>)}</g>}
        {p1 > 0 && (
          <g opacity={p1}>
            <WeaveStreet dim={0.5} />
            <LaoQian x={180} s={0.8} mood="smirk" /><Master2 x={320} s={0.8} mood="smile" />
            <g transform={`translate(240 ${GROUND - 300})`} opacity={fin(f, wSave - 6, 8)}><CoinStack h={8} s={1.2} /></g>
            {[0, 1, 2, 3].map((i) => <Hop key={`w${i}`} f={f} ph={i} a={6} on={f >= wHungry - 6}><Mini x={560 + i * 120} y={GROUND} col={["#B98A45", "#A8764C", "#C49A52", "#9C7A4A"][i]} s={1.3} /></Hop>)}
            <HeadMark x={700} y={GROUND - 260} text="…" at={wHungry} col={C.ink2} />
          </g>
        )}
        {p2 > 0 && <g opacity={p2}><House x={860} y={GROUND} s={1.2} /><Ahe x={330} s={0.85} mood="flat" holdR={<Bowl s={0.8} />} armR={[60, 20]} />{[0, 1, 2].map((i) => <Mini key={i} x={470 + i * 110} y={GROUND} col={["#C3923F", "#6E8FA8", "#7C8C5A"][i]} s={[1.4, 1.0, 0.9][i]} o={fin(f, wFam - 10 + i * 3, 8)} />)}</g>}
        {p3 > 0 && <g opacity={p3}><WeaveStreet dim={0.35} />{Array.from({ length: 8 }).map((_, i) => <Hop key={i} f={f} ph={i * 0.7} a={10} on={f >= wMore - 10}><Mini x={120 + i * 120} y={GROUND} col={["#B98A45", "#5E7FA8", "#7C8C5A", "#C3923F"][i % 4]} s={1.1} /></Hop>)}</g>}
      </Stage>
      {p0 > 0 && <T y={400} size={44} serif style={{ opacity: p0 }}>一个地方正在快速发展，工厂一家家开</T>}
      {p0 > 0 && f >= wHard - 8 && <T y={480} size={50} serif style={{ opacity: fin(f, wHard - 8, 8) * p0, scale: String(pop(f, fps, wHard - 8, 10)) }}><span style={{ color: C.red }}>招工难</span>，工资往上走</T>}
      {p1 > 0 && (
        <Box o={p1}>
          <div style={{ fontSize: 44 }}>那平时呢？工钱是<span style={{ color: PART.wage }}>谈出来的</span></div>
          <Row f={f} at={wFew} size={42}>老板：人少，好商量；<span style={{ opacity: fin(f, wSave - 6, 8) }}>有积蓄，能多撑</span></Row>
          <Row f={f} at={wHungry} size={42}>工人：不干活，很快<span style={{ color: C.red }}>没饭吃，更急</span></Row>
        </Box>
      )}
      {p2 > 0 && <T y={400} size={46} serif style={{ opacity: p2 }}>可再低也<span style={{ color: PART.wage }}>有个底</span></T>}
      {p2 > 0 && f >= wSelf - 8 && <T y={480} size={42} serif style={{ opacity: fin(f, wSelf - 8, 8) * p2 }}>至少够养活自己，<span style={{ opacity: fin(f, wFam - 14, 8) }}>多数时候还要够养家</span></T>}
      {p3 > 0 && <Seal x={540} y={520} text="大多数人又穷又苦的社会，不会真正繁荣" size={42} rot={-3} style={{ opacity: p3 * fin(f, wFlour - 14, 6), scale: String(interpolate(fin(f, wFlour - 14, 8), [0, 1], [1.4, 1])) }} />}
      {p3 > 0 && f >= wMore - 14 && <T y={660} size={46} serif style={{ opacity: fin(f, wMore - 14, 8) }}>工钱给得大方，<span style={{ color: PART.wage }}>干活也更卖力</span></T>}
      <Sfx at={wHard} name="boom" v={0.35} />
      <Sfx at={wFew} name="pop" v={0.28} />
      <Sfx at={wHungry} name="tick" v={0.3} />
      <Sfx at={wFloor} name="ding" v={0.3} />
      <Sfx at={wFlour} name="boom" v={0.4} />
      <Sfx at={wMore} name="ding" v={0.3} />
    </Shell>
  );
};

// ================================================================ ③ 补偿的例子：铁匠 12 小时 vs 挖煤 8 小时 → 学做鞋 vs 学法律（二十个成一个）→ 当代：夜班、医生
export const SJobs2: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("jobs2");
  const W = useWordAt("jobs2");
  const wSmith = W(0, "铁匠"), w12 = W(0, "十二个小时"), w8 = W(0, "八个小时"), wDirty = W(0, "又脏又危险"), wUnder = W(0, "地底下"), wShoe = W(1, "学做鞋"), wLaw = W(1, "学法律"), w20 = W(1, "二十个"), wNight = W(2, "夜班"), wDoc = W(2, "医生"), wComp = W(2, "补偿");
  const p0 = ph(f, L, 0, 1), p1 = ph(f, L, 1, 2), p2 = ph(f, L, 2);
  return (
    <Shell dur={L.dur} enter="page" cam="panR" zoom={0.05} kicks={[w8, wUnder, wLaw, w20, wComp]}>
      <Paper />
      <Modern scene="jobs2" i={2} />
      <Stage>
        <Ground />
        {p0 > 0 && (
          <g opacity={p0}>
            <Forge x={90} s={0.6} fire={0.8} />
            <CoalPit x={960} s={0.9} />
            <Smith x={260} s={1.1} mood="flat" o={fin(f, wSmith - 6, 8)} armR={[swing(f, 0.3, 30, 110), 20]} />
            <Collier x={780} s={1.1} mood="tired" o={fin(f, w8 - 10, 8)} armR={[swing(f, 0.25, 20, 120), 20]} armL={[swing(f, 0.25, 20, 120), 20]} sweat={f >= wDirty} bob={f >= wUnder ? keys(f - wUnder, [[0, 0], [16, 60]]) : 0} />
            <rect x={600} y={GROUND} width={360} height={130} fill="#3A3F48" opacity={fin(f, wUnder - 8, 10)} />
          </g>
        )}
        {p1 > 0 && (
          <g opacity={p1}>
            <Shoemaker x={140} s={0.8} mood="happy" holdR={<Shoe s={0.9} />} armR={[60, 20]} />
            <Lawyer x={330} s={0.8} mood={f >= w20 ? "tired" : "smile"} o={fin(f, wLaw - 6, 8)} holdR={<Scroll s={0.8} />} armR={[60, 20]} />
            {Array.from({ length: 20 }).map((_, i) => <circle key={i} cx={480 + (i % 10) * 52} cy={GROUND - 300 + Math.floor(i / 10) * 60} r={20} fill={i === 0 ? C.red : "#E3D9C6"} stroke={C.ink} strokeWidth={3} opacity={fin(f, w20 - 8 + i, 6)} />)}
          </g>
        )}
        {p2 > 0 && <g opacity={p2}><Collier x={300} s={1.05} mood="smile" /><Doctor x={760} s={1.05} mood="smile" /></g>}
      </Stage>
      {p0 > 0 && (
        <Box o={p0}>
          <div style={{ fontSize: 44 }}>铁匠干 <span style={{ color: C.mute }}>12 小时</span>，<span style={{ opacity: fin(f, w8 - 8, 8) }}>不如挖煤的干 <span style={{ color: PART.wage }}>8 小时</span>挣得多</span></div>
          <Row f={f} at={wDirty} size={42}>挖煤：又脏又危险，还在地底下</Row>
        </Box>
      )}
      {p1 > 0 && (
        <Box o={p1}>
          <div style={{ fontSize: 44 }}>学做鞋：<span style={{ color: STEP[2] }}>准能学会</span></div>
          <Row f={f} at={wLaw} size={44}>学法律：<span style={{ color: C.red, opacity: fin(f, w20 - 6, 8) }}>二十个里一个能靠它吃饭</span></Row>
        </Box>
      )}
      {p2 > 0 && <T y={400} size={44} serif style={{ opacity: p2 }}>夜班、高空作业；<span style={{ opacity: fin(f, wDoc - 6, 8) }}>医生、律师学很多年</span></T>}
      {p2 > 0 && f >= wComp - 10 && <T y={480} size={50} serif style={{ opacity: fin(f, wComp - 10, 8) }}>多出来的钱，很多是在<span style={{ color: PART.wage }}>补偿</span></T>}
      <Sfx at={w12} name="tick" v={0.28} />
      <Sfx at={w8} name="pop" v={0.3} />
      <Sfx at={wUnder} name="boom" v={0.35} />
      <Sfx at={wShoe} name="pop" v={0.28} />
      <Sfx at={w20} name="boom" v={0.4} />
      <Sfx at={wNight} name="pop" v={0.28} />
      <Sfx at={wComp} name="ding" v={0.35} />
    </Shell>
  );
};
