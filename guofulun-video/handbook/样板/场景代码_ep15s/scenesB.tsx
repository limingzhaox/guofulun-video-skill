// 第一篇汇总 · 第三步（怎么分：工钱、利润、工作差别、地租[暗场]）→ 结尾（回到外套）→ 公式卡 → 15 集合集条
import React from "react";
import { Farm } from "../ep12/world";
import { LaoQian } from "../ep06s/world";
import { Master2, WeaveStreet, Ahe } from "../ep08/world";
import { Buyer } from "../ep07/world";
import { Square, Xiaoman } from "../ep10/world";
import { Tycoon } from "../ep13/world";
import { interpolate, useCurrentFrame } from "remotion";
import { C, fin, keys, Paper, pop, Seal, Sfx, Shell, Stage, swing, T, useFps, useLines, useWordAt, SERIF } from "../kit";
import { FormulaCard, HeadMark } from "../story";
import { Bubble, FiveList, Ticket } from "../ep10/world";
import { Ashi, TownGate } from "../ep11/world";
import { useMouth } from "../ep11/scenesA";
import { KelpRock, Landlord, Lease, Notice, Shopfront, VBar, Wheat } from "../ep12/world";
import { ShopRow, Level } from "../ep09/world";
import { PriceFlag, RARE, RAISE, MADE } from "../ep15/world";
import { Coat, Crowd, GROUND, Mini, Modern, PART, RecapGrid, STEP, StepConclusion } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NIGHT = "#E9E1CF";
const ph = (f: number, L: { s: (i: number) => number }, a: number, b?: number) => fin(f, L.s(a) - 6, 12) * (b === undefined ? 1 : 1 - fin(f, L.s(b) - 6, 12));

// ================================================================ ③ 工钱：越有钱的地方工钱越高？→ 英国更富、北美工钱更高 → 看是不是还在变富：老板抢人
export const SWage: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("wage");
  const W = useWordAt("wage");
  const wEng = W(1, "英国"), wRich = W(1, "富得多"), wHigh = W(1, "工钱却高得多"), wNow = W(2, "已经有多富"), wGrow = W(2, "一直变富"), wGrab = W(2, "老板抢人"), wUp = W(2, "往上走");
  const p1 = ph(f, L, 1, 2), p2 = ph(f, L, 2);
  return (
    <Shell dur={L.dur} enter={{ ink: [540, 700] }} cam="push" zoom={0.05} kicks={[wRich, wHigh, wGrow, wGrab]}>
      <Paper />
      <Stage>
        <WeaveStreet dim={0.65} />
        {p1 > 0 && (
          <g opacity={p1}>
            <VBar x={200} y={GROUND - 20} v={fin(f, wEng - 6, 14) * 0.9} col={C.ink2} label="英国" w={110} />
            <VBar x={340} y={GROUND - 20} v={fin(f, wRich - 6, 14) * 0.45} col={C.mute} label="北美" w={110} />
            <VBar x={680} y={GROUND - 20} v={fin(f, wHigh - 10, 14) * 0.45} col={PART.wage} label="英国" w={110} />
            <VBar x={820} y={GROUND - 20} v={fin(f, wHigh - 4, 14) * 0.9} col={PART.wage} label="北美" w={110} />
            <text x={270} y={GROUND - 420} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={C.ink}>有多富</text>
            <text x={750} y={GROUND - 420} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={PART.wage} opacity={fin(f, wHigh - 10, 8)}>工钱</text>
          </g>
        )}
        {p2 > 0 && (
          <g opacity={p2}>
            <LaoQian x={keys(f - wGrab, [[-6, 180], [16, 400]])} s={0.85} mood={f >= wGrab ? "wow" : "smile"} armR={f >= wGrab ? [100, 40] : [12, 10]} legs={f < wGrab + 16 && f >= wGrab - 6 ? [swing(f, 0.4, -20, 20), swing(f, 0.4, 20, -20)] : [0, 0]} />
            <Master2 x={keys(f - wGrab, [[-6, 900], [16, 680]])} s={0.85} flip mood={f >= wGrab ? "wow" : "smile"} armR={f >= wGrab ? [100, 40] : [12, 10]} legs={f < wGrab + 16 && f >= wGrab - 6 ? [swing(f, 0.4, -20, 20), swing(f, 0.4, 20, -20)] : [0, 0]} />
            <Ahe x={540} s={0.85} mood={f >= wUp - 4 ? "happy" : "smile"} tilt={f >= wGrab ? swing(f, 0.3, -6, 6) : 0} />
            <HeadMark x={560} y={GROUND - 260} text="！" at={wGrab} />
          </g>
        )}
      </Stage>
      {f < L.s(1) && <T y={430} size={52} serif>越有钱的地方，<span style={{ color: PART.wage }}>工钱</span>越高？</T>}
      {p1 > 0 && <T y={420} size={44} serif style={{ opacity: p1 }}>书里说不是：<span style={{ opacity: fin(f, wEng - 6, 8) }}>英国更富</span>，<span style={{ color: PART.wage, opacity: fin(f, wHigh - 6, 8) }}>北美工钱更高</span></T>}
      {p2 > 0 && <Notice x={540} y={600} title="招工" amount={f >= wUp - 4 ? "工钱 ↑↑" : f >= wGrab - 4 ? "工钱 ↑" : "急招"} col={PART.wage} k={pop(f, fps, wGrow - 6, 11)} o={p2} />}
      {p2 > 0 && <T y={400} size={44} serif style={{ opacity: p2 }}>不看<span style={{ color: C.mute, opacity: fin(f, wNow - 6, 8) }}>已经有多富</span>，看是不是<span style={{ color: STEP[2], opacity: fin(f, wGrow - 6, 8) }}>还在一直变富</span></T>}
      {p2 > 0 && f >= wGrab - 6 && <T y={480} size={46} serif style={{ opacity: fin(f, wGrab - 6, 8) }}>活儿越来越多，老板抢人，<span style={{ color: PART.wage, opacity: fin(f, wUp - 6, 8) }}>工钱往上走</span></T>}
      <Sfx at={wEng} name="pop" v={0.3} />
      <Sfx at={wHigh} name="boom" v={0.4} />
      <Sfx at={wGrow} name="ding" v={0.3} />
      <Sfx at={wGrab} name="pop" v={0.35} />
    </Shell>
  );
};

// ================================================================ ③ 利润：本钱越多，抢同样的生意，利润越薄 → 当代奶茶街 → 利息的两倍 → 工钱往上、利润往下 → 新开发的地方两样都高
export const SProfit: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("profit");
  const W = useWordAt("profit");
  const wMore = W(1, "本钱越多"), wGrab = W(1, "抢同样的生意"), wThin = W(1, "越薄"), wTea = W(2, "奶茶店"), wTwo = W(3, "两倍"), wWage = W(4, "工钱往上走"), wProf = W(4, "利润往下走"), wNew = W(5, "刚开发"), wBoth = W(5, "同时都高");
  const shops = f < L.s(2) - 6 ? Math.floor(interpolate(f, [wMore - 6, wGrab + 20], [2, 4], CL)) : Math.floor(interpolate(f, [L.s(2) - 6, wTea + 30], [4, 6], CL));
  const p01 = 1 - fin(f, L.s(3) - 6, 12), p3 = ph(f, L, 3, 4), p4 = ph(f, L, 4, 5), p5 = ph(f, L, 5);
  return (
    <Shell dur={L.dur} enter="page" cam="panL" zoom={0.05} kicks={[wGrab, wThin, wTwo, wProf, wBoth]}>
      <Paper />
      <Modern scene="profit" i={2} />
      <Stage>
        {p01 > 0 && <g opacity={p01}><rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" /><ShopRow n={shops} y={1000} />{[0, 1, 2].map((i) => <Buyer key={i} x={keys((f + i * 60) % 180, [[0, -60], [180, 1140]])} s={0.6} col={["#5E7FA8", "#7C8C5A", "#A8764C"][i]} legs={[swing(f, 0.35, -20, 20, i), swing(f, 0.35, 20, -20, i)]} />)}<LaoQian x={540} s={0.75} mood={f >= wThin ? "sad" : "smile"} /></g>}
        {p3 > 0 && (
          <g opacity={p3}>
            <VBar x={360} y={GROUND - 20} v={0.3} col={C.mute} label="利息" w={150} />
            <VBar x={720} y={GROUND - 20} v={0.6 * fin(f, wTwo - 6, 12)} col={PART.profit} label="利润" val={f >= wTwo - 4 ? "×2" : ""} w={150} />
          </g>
        )}
        {p4 > 0 && (
          <g opacity={p4}>
            <Level x={330} y={1100} v={interpolate(f, [wWage - 6, wWage + 20], [0.4, 0.8], CL)} label="工钱" col={PART.wage} />
            <Level x={750} y={1100} v={interpolate(f, [wProf - 6, wProf + 20], [0.8, 0.35], CL)} label="利润" col={PART.profit} />
          </g>
        )}
        {p5 > 0 && <g opacity={p5 * 0.6}><Farm dim={0.3} manor={false} /></g>}
        {p5 > 0 && (
          <g opacity={p5}>
            <Level x={330} y={1100} v={interpolate(f, [wBoth - 10, wBoth + 16], [0.4, 0.8], CL)} label="工钱" col={PART.wage} />
            <Level x={750} y={1100} v={interpolate(f, [wBoth - 10, wBoth + 16], [0.4, 0.8], CL)} label="利润" col={PART.profit} />
          </g>
        )}
      </Stage>
      {f < L.s(1) && <T y={430} size={50} serif>钱越多的地方，<span style={{ color: PART.profit }}>生意反倒越难做</span>？</T>}
      {f >= L.s(1) - 6 && f < L.s(2) - 6 && <T y={420} size={46} serif style={{ opacity: fin(f, L.s(1) - 6, 8) }}>本钱越多，店越开越多，抢同样的生意</T>}
      {f >= wThin - 8 && p01 > 0 && <T y={510} size={56} serif color={PART.profit} style={{ opacity: fin(f, wThin - 8, 8) * p01 }}>利润越来越薄</T>}
      {f >= L.s(2) - 6 && p01 > 0 && <T y={420} size={44} serif style={{ opacity: fin(f, L.s(2) - 6, 8) * p01 }}>一条街上<span style={{ color: PART.profit }}>奶茶店</span>越开越多，每家客人变少</T>}
      {p3 > 0 && <T y={420} size={44} serif style={{ opacity: p3 }}>当时的说法：利润做到利息的<span style={{ color: PART.profit }}>两倍</span>，就算不错</T>}
      {p4 > 0 && <T y={420} size={48} serif style={{ opacity: p4 }}>本钱增加：<span style={{ color: PART.wage }}>工钱 ↑</span>　<span style={{ color: PART.profit, opacity: fin(f, wProf - 6, 8) }}>利润 ↓</span></T>}
      {p5 > 0 && <T y={420} size={44} serif style={{ opacity: p5 }}>刚开发的新地方：地多、人少、本钱少</T>}
      {p5 > 0 && f >= wBoth - 8 && <T y={500} size={50} serif style={{ opacity: fin(f, wBoth - 8, 8), scale: String(pop(f, fps, wBoth - 8, 10)) }}><span style={{ color: PART.wage }}>工钱</span>和<span style={{ color: PART.profit }}>利润</span>能同时都高</T>}
      <Sfx at={wMore} name="pop" v={0.3} />
      <Sfx at={wThin} name="boom" v={0.4} />
      <Sfx at={wTea} name="pop" v={0.28} />
      <Sfx at={wTwo} name="ding" v={0.3} />
      <Sfx at={wWage} name="pop" v={0.3} />
      <Sfx at={wProf} name="pop" v={0.3} />
      <Sfx at={wBoth} name="ding" v={0.35} />
    </Shell>
  );
};

// ================================================================ ③ 工作差别：钱多往往在补偿你什么（五样）
export const SJobs: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("jobs");
  const W = useWordAt("jobs");
  const w1 = W(1, "苦不苦"), w5 = W(1, "能不能成");
  const p1 = fin(f, L.s(1) - 6, 12);
  const k5 = interpolate(f, [w1 - 8, w5 + 4], [0.2, 1], CL);
  return (
    <Shell dur={L.dur} enter="fade" cam="rise" zoom={0.05} kicks={[w1, w5]}>
      <Paper />
      <Stage><Square dim={0.45} banner={false} /><Xiaoman x={900} s={0.8} mood={f >= w5 ? "wow" : "smile"} tilt={swing(f, 0.08, -5, 5)} /></Stage>
      {f < L.s(1) && <T y={430} size={50} serif>为什么有的工作<span style={{ color: PART.wage }}>钱多</span>，有的钱少？</T>}
      {p1 > 0 && <T y={340} size={40} serif style={{ opacity: p1 }}>能自由挑工作时，钱多往往是在<span style={{ color: PART.wage }}>补偿你</span>：</T>}
      {p1 > 0 && <FiveList y={420} k={k5} o={p1} labels={["活儿苦不苦", "学艺难不难", "活儿稳不稳", "担的责任大不大", "能不能成"]} />}
      <Sfx at={w1} name="pop" v={0.25} />
      <Sfx at={w5} name="ding" v={0.3} />
    </Shell>
  );
};

// ================================================================ ③ 彩票稳赔 → 七年学徒，门一关 → 同行聚会 → 阿石
export const SGate: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("gate");
  const W = useWordAt("gate");
  const M = useMouth("gate");
  const wAll = W(0, "全买下来"), wLose = W(0, "稳赔"), wShut = W(1, "门被关上"), w7 = W(1, "七年"), wMeet = W(2, "聚在一起"), wPlot = W(2, "算计大家"), wRaise = W(2, "抬高价钱");
  const p0 = ph(f, L, 0, 1), p1 = fin(f, L.s(1) - 6, 12), p2 = ph(f, L, 2, 3);
  const tickets = Math.floor(interpolate(f, [wAll - 10, wAll + 24], [1, 18], CL));
  return (
    <Shell dur={L.dur} enter={{ ink: [540, 900] }} cam="push" zoom={0.05} kicks={[wAll, wLose, wShut, w7, wPlot]}>
      <Paper />
      <Stage>
        <rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" />
        {p0 > 0 && (
          <g opacity={p0}>
            {Array.from({ length: tickets }).map((_, i) => <g key={i} transform={`translate(${200 + (i % 6) * 130} ${GROUND - 80 - Math.floor(i / 6) * 90}) rotate(${(i * 23) % 20 - 10})`}><Ticket s={0.7} text="彩票" /></g>)}
          </g>
        )}
        {p1 > 0 && (
          <g opacity={p1}>
            <TownGate x={540} shut={fin(f, wShut - 6, 20)} />
            <Ashi x={160} s={1.05} mood={M("阿石", f, "sad")} />
            {p2 > 0 && <g opacity={p2}><rect x={740} y={GROUND - 120} width={300} height={20} rx={6} fill={C.wood} stroke={C.ink} strokeWidth={3} /><rect x={760} y={GROUND - 100} width={14} height={100} fill={C.wood} /><rect x={1006} y={GROUND - 100} width={14} height={100} fill={C.wood} /><LaoQian x={760} s={0.62} mood={f >= wPlot ? "smirk" : "happy"} armR={[swing(f, 0.2, 40, 90), 30]} /><Master2 x={890} s={0.62} mood={f >= wPlot ? "smirk" : "happy"} /><Tycoon x={1020} s={0.62} flip mood={f >= wPlot ? "smirk" : "happy"} armR={[swing(f, 0.2, 60, 100, 1), 30]} /></g>}
            <HeadMark x={200} y={GROUND - 400} text="…" at={L.s(3)} col={C.ink2} />
          </g>
        )}
      </Stage>
      {p0 > 0 && <T y={420} size={46} serif style={{ opacity: p0 }}>人总觉得<span style={{ color: C.mute }}>自己运气好</span></T>}
      {p0 > 0 && f >= wAll - 8 && <Seal x={540} y={600} text="一期彩票全买下来：稳赔" size={58} rot={-3} style={{ opacity: fin(f, wAll - 8, 6) * p0, scale: String(interpolate(fin(f, wLose - 8, 8), [0, 1], [1.4, 1])) }} />}
      {p1 > 0 && p2 < 1 && f < L.s(2) - 6 && <T y={420} size={46} serif style={{ opacity: p1 }}>还有一种钱多：<span style={{ color: C.red }}>门被关上了</span></T>}
      {p1 > 0 && f >= w7 - 8 && f < L.s(2) - 6 && <T y={510} size={70} serif color={C.red} style={{ opacity: fin(f, w7 - 8, 8), scale: String(pop(f, fps, w7 - 8, 10)) }}>学徒先熬满 7 年</T>}
      {p2 > 0 && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 380, textAlign: "center", fontFamily: SERIF, fontWeight: 900, opacity: p2 }}>
          <div style={{ fontSize: 42, color: C.ink2 }}>同一行的人难得<span style={{ color: C.ink }}>聚在一起</span>，聊到最后……</div>
          <div style={{ fontSize: 52, marginTop: 26, color: C.red, opacity: fin(f, wPlot - 8, 8), scale: String(pop(f, fps, wPlot - 8, 10)) }}>合起伙来算计大家<span style={{ opacity: fin(f, wRaise - 6, 8) }}>、抬高价钱</span></div>
        </div>
      )}
      {f >= L.s(3) - 2 && <Bubble x={300} y={760} size={36} o={fin(f, L.s(3) - 2, 5)}>门一关，城外的人就进不来了。</Bubble>}
      <Sfx at={wAll} name="pop" v={0.3} />
      <Sfx at={wLose} name="boom" v={0.4} />
      <Sfx at={wShut} name="hammer" v={0.35} />
      <Sfx at={w7} name="boom" v={0.4} />
      <Sfx at={wMeet} name="pop" v={0.28} />
      <Sfx at={wPlot} name="boom" v={0.4} />
    </Shell>
  );
};

// ================================================================ ③ 地租（暗场）：海草也收租 → 付得起的最高价、是结果不是原因 → 三种东西 → 提醒 → 第三步结论
export const SRent: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("rent");
  const W = useWordAt("rent");
  const wKelp = W(0, "海草"), wTop = W(1, "最高价"), wCause = W(1, "原因"), wEffect = W(1, "结果");
  const wGrain = W(2, "种粮食的地"), wLeft = W(2, "还总有剩"), wFat = W(2, "越肥"), wNear = W(2, "离城越近"), wShop = W(3, "铺面"), wSell = W(3, "卖得上价");
  const s1 = W(4, "越来越贵"), s2 = W(4, "划算为止"), s3 = W(4, "越来越便宜"), wNote = W(5, "提醒"), wCare = W(5, "非常小心"), wEnd = W(6, "第三步的结论");
  const p01 = ph(f, L, 0, 2), p1 = fin(f, L.s(1) - 6, 12), pG = ph(f, L, 2, 3), pS = ph(f, L, 3, 4), p2 = ph(f, L, 4, 5), p3 = ph(f, L, 5, 6), p4 = ph(f, L, 6);
  const rows = [
    { k: "造不出来的", v: "越来越贵", col: RARE, at: s1, dir: 1 as const },
    { k: "能养出来的", v: "贵到养它划算为止", col: RAISE, at: s2, dir: 1 as const },
    { k: "作坊里能多造的", v: "越来越便宜", col: MADE, at: s3, dir: -1 as const },
  ];
  return (
    <Shell dur={L.dur} enter={{ ink: [540, 900] }} cam="pull" zoom={0.06} kicks={[wKelp, wEffect, wLeft, wNear, wSell, s3, wCare, wEnd]}>
      <Paper dark={1} />
      <Modern scene="rent" i={3} />
      <Stage>
        <rect x={0} y={GROUND} width={1080} height={130} fill="#1E2430" />
        {p01 > 0 && (
          <g opacity={p01}>
            <KelpRock x={700} night t={f} glow={fin(f, wKelp - 6, 10)} />
            <Landlord x={280} s={1.0} mood="smirk" gray={0.2} holdR={<Lease s={0.8} amount="租" />} armR={[70, 20]} />
          </g>
        )}
      </Stage>
      {p01 > 0 && f < L.s(1) && <T y={420} size={48} serif color={C.paper} style={{ opacity: p01 }}>一锄头没动过的<span style={{ color: PART.rent }}>海草</span>，也能收租</T>}
      {p01 > 0 && p1 > 0 && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 360, textAlign: "center", fontFamily: SERIF, fontWeight: 900, color: C.paper, opacity: p1 * p01 }}>
          <div style={{ fontSize: 44 }}>地租 = 租地的人付得起的<span style={{ color: "#E07A62", opacity: fin(f, wTop - 6, 8) }}>最高价</span></div>
          <div style={{ display: "flex", justifyContent: "center", gap: 30, marginTop: 34, fontSize: 46 }}>
            <span style={{ padding: "10px 24px", border: `4px solid ${C.mute}`, borderRadius: 12, color: C.mute, textDecoration: f >= wEffect - 6 ? "line-through" : "none", opacity: fin(f, wCause - 8, 8) }}>价格贵的原因</span>
            <span style={{ padding: "10px 24px", border: `4px solid ${PART.rent}`, borderRadius: 12, background: PART.rent, opacity: fin(f, wEffect - 8, 8), scale: String(pop(f, fps, wEffect - 8, 10)) }}>价格贵的结果</span>
          </div>
        </div>
      )}
      {pG > 0 && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 380, textAlign: "center", fontFamily: SERIF, fontWeight: 900, color: C.paper, opacity: pG }}>
          <div style={{ fontSize: 44 }}>种粮食的地：养活种地的人，<span style={{ color: PART.rent, opacity: fin(f, wLeft - 8, 8) }}>还总有剩</span></div>
          <div style={{ fontSize: 46, marginTop: 30, opacity: fin(f, wFat - 6, 8) }}>越肥、<span style={{ opacity: fin(f, wNear - 6, 8) }}>离城越近，</span><span style={{ color: "#E07A62", opacity: fin(f, wNear + 10, 8) }}>地租越高</span></div>
        </div>
      )}
      {pG > 0 && <Stage><g opacity={pG}><Wheat x={140} w={800} night rich={fin(f, wLeft - 10, 20)} /></g></Stage>}
      {pS > 0 && <Stage><g opacity={pS}><Shopfront x={540} s={1.4} sign="市中心铺面" /></g></Stage>}
      {pS > 0 && <T y={400} size={46} serif color={C.paper} style={{ opacity: pS }}>租金贵，不是房东想要贵</T>}
      {pS > 0 && f >= wSell - 14 && <T y={480} size={50} serif color="#E07A62" style={{ opacity: fin(f, wSell - 14, 8) * pS }}>是开在那儿，东西卖得上价</T>}
      {p2 > 0 && (
        <div style={{ position: "absolute", left: 80, right: 60, top: 360, fontFamily: SERIF, fontWeight: 900, color: C.paper, opacity: p2 }}>
          <div style={{ fontSize: 44, marginBottom: 20 }}>社会越富：</div>
          {rows.map((r) => (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 16, height: 110, opacity: fin(f, r.at - 10, 8), translate: `${(1 - fin(f, r.at - 10, 8)) * 40}px 0` }}>
              <span style={{ fontSize: 40, color: NIGHT, whiteSpace: "nowrap" }}>{r.k}</span>
              <span style={{ fontSize: 42, background: r.col, padding: "8px 22px", borderRadius: 999, whiteSpace: "nowrap" }}>{r.v}</span>
            </div>
          ))}
        </div>
      )}
      {p2 > 0 && <Stage><g opacity={p2}>{rows.map((r, i) => <g key={i} transform={`translate(900 ${GROUND - 330 + i * 110})`}><PriceFlag dir={r.dir} s={0.7} k={fin(f, r.at - 6, 10)} /></g>)}</g></Stage>}
      {p3 > 0 && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 400, textAlign: "center", fontFamily: SERIF, fontWeight: 900, color: C.paper, opacity: p3 }}>
          <div style={{ fontSize: 42, color: NIGHT }}>第一篇最后的一句提醒</div>
          <div style={{ fontSize: 48, marginTop: 30 }}>做买卖、开工场的人提的新规矩</div>
          <div style={{ fontSize: 62, marginTop: 24, color: "#E07A62", opacity: fin(f, wCare - 8, 8), scale: String(pop(f, fps, wCare - 8, 10)) }}>要非常小心地听</div>
        </div>
      )}
      {p4 > 0 && <StepConclusion n={3} text="工钱：看社会还在不在变富；利润：看本钱多不多；地租：看东西卖不卖得上价" at={wEnd} y={380} dark />}
      <Sfx at={wKelp} name="tick" v={0.3} />
      <Sfx at={wTop} name="pop" v={0.3} />
      <Sfx at={wEffect} name="boom" v={0.45} />
      <Sfx at={wLeft} name="ding" v={0.3} />
      <Sfx at={wNear} name="pop" v={0.28} />
      <Sfx at={wSell} name="pop" v={0.3} />
      {[s1, s2, s3].map((a, i) => <Sfx key={i} at={a} name="pop" v={0.28} />)}
      <Sfx at={wNote} name="tick" v={0.3} />
      <Sfx at={wCare} name="boom" v={0.4} />
      <Sfx at={wEnd} name="boom" v={0.45} />
    </Shell>
  );
};

// ================================================================ 结尾：回到外套 → 不是认识、不是好心（松口气）→ 三步台阶 → 下次先问一句 → 勾第四篇
export const SEnding: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("ending");
  const W = useWordAt("ending");
  const wKnow = W(1, "认识你"), wKind = W(1, "好心"), wGood = W(1, "各自都有好处"), s1 = W(2, "越造越多"), s2 = W(2, "中心转"), s3 = W(2, "工钱"), wAsk = W(3, "先问一句"), q1 = W(3, "多少人在分工"), q2 = W(3, "分给了谁"), wTie = W(4, "拧到了一起"), w4 = W(4, "第四篇");
  const p1 = ph(f, L, 1, 2), p2 = ph(f, L, 2, 3), p3 = ph(f, L, 3, 4), p4 = ph(f, L, 4);
  const coat = Math.max(1 - fin(f, L.s(2) - 6, 12), p4);
  const steps = [
    { k: "分工", v: "东西越造越多", col: STEP[0], at: s1 },
    { k: "价格", v: "围着中心转", col: STEP[1], at: s2 },
    { k: "分配", v: "工钱、利润、地租", col: STEP[2], at: s3 },
  ];
  return (
    <Shell dur={L.dur} enter={{ iris: [540, 900] }} cam="pull" zoom={0.06} kicks={[wGood, s3, wAsk, q2, wTie]}>
      <Paper />
      <Stage>
        <g opacity={Math.min(1, coat)}>
          <rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" />
          <g transform={`translate(540 ${GROUND - 260}) scale(0.95)`}><Coat /></g>
          <Crowd k={1} extra={1} labels={p4 < 0.5} />
          {p4 > 0 && Array.from({ length: 7 }).map((_, i) => (
            <path key={i} d={`M ${90 + i * 150} ${GROUND - 120} Q ${(90 + i * 150 + 540) / 2} ${GROUND - 480} 540 ${GROUND - 580}`} stroke={C.red} strokeWidth={3} strokeDasharray="10 8" fill="none" opacity={fin(f, wTie - 10 + i * 3, 10) * 0.8} />
          ))}
          {p4 > 0 && <text x={540} y={GROUND - 555} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={110} fill={C.red} opacity={fin(f, wTie, 10)}>？</text>}
        </g>
      </Stage>
      {f < L.s(1) && <T y={380} size={44} serif color={C.red}>第一篇的总结，就讲到这儿</T>}
      {f < L.s(1) && <T y={460} size={52} serif style={{ opacity: fin(f, W(0, "再看一眼") - 6, 8) }}>再看一眼你身上这件外套</T>}
      {p1 > 0 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 330, textAlign: "center", fontFamily: SERIF, fontWeight: 900, opacity: p1 }}>
          <div style={{ fontSize: 44, color: C.mute }}><span style={{ textDecoration: f >= wKnow + 6 ? "line-through" : "none" }}>认识你</span>　<span style={{ textDecoration: f >= wKind + 6 ? "line-through" : "none", opacity: fin(f, wKind - 6, 8) }}>好心</span></div>
          <div style={{ fontSize: 52, marginTop: 20, opacity: fin(f, wGood - 14, 8), scale: String(pop(f, fps, wGood - 14, 10)) }}>分工、交换，<span style={{ color: C.red }}>各自都有好处</span></div>
        </div>
      )}
      {p2 > 0 && (
        <div style={{ position: "absolute", left: 90, right: 60, top: 380, fontFamily: SERIF, fontWeight: 900, opacity: p2 }}>
          {steps.map((r, i) => (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 18, marginLeft: i * 50, height: 120, opacity: fin(f, r.at - 10, 10), translate: `${(1 - fin(f, r.at - 10, 10)) * 40}px 0` }}>
              <span style={{ fontSize: 46, color: r.col, whiteSpace: "nowrap" }}>{r.k}</span>
              <span style={{ fontSize: 46, background: r.col, color: C.paper, padding: "8px 24px", borderRadius: 999, whiteSpace: "nowrap" }}>{r.v}</span>
            </div>
          ))}
        </div>
      )}
      {p3 > 0 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 380, textAlign: "center", fontFamily: SERIF, fontWeight: 900, opacity: p3 }}>
          <div style={{ fontSize: 44, color: C.ink2 }}>下次买任何一样东西，<span style={{ color: C.ink }}>先问一句：</span></div>
          <div style={{ fontSize: 48, marginTop: 40, padding: "16px 24px", borderRadius: 18, border: `5px solid ${STEP[0]}`, background: "#FBF7EF", opacity: fin(f, q1 - 10, 8) }}>它背后有<span style={{ color: STEP[0] }}>多少人</span>在分工？</div>
          <div style={{ fontSize: 48, marginTop: 18, padding: "16px 24px", borderRadius: 18, border: `5px solid ${STEP[2]}`, background: "#FBF7EF", opacity: fin(f, q2 - 10, 8) }}>我付的这笔钱，又<span style={{ color: STEP[2] }}>分给了谁</span>？</div>
        </div>
      )}
      {p4 > 0 && <T y={380} size={46} serif style={{ opacity: p4 }}>这么多不认识的人，被什么<span style={{ color: C.red }}>拧到了一起</span>？</T>}
      {p4 > 0 && f >= w4 - 8 && <T y={460} size={40} serif color={C.ink2} style={{ opacity: fin(f, w4 - 8, 8) }}>书里起了个名字，要到<span style={{ color: C.red }}>第四篇</span>才说</T>}
      <Sfx at={wKnow} name="tick" v={0.25} />
      <Sfx at={wGood} name="ding" v={0.35} />
      {[s1, s2, s3].map((a, i) => <Sfx key={i} at={a} name="pop" v={0.3} />)}
      <Sfx at={wAsk} name="tick" v={0.3} />
      <Sfx at={q2} name="pop" v={0.3} />
      <Sfx at={wTie} name="boom" v={0.4} />
    </Shell>
  );
};

// ================================================================ 公式卡（静止，可截图）
export const SCard: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("card");
  return (
    <Shell dur={L.dur} enter="page" cam="still">
      <Paper />
      <FormulaCard
        k={fin(f, 4, 14)}
        size={56}
        title="读懂《国富论》第一篇"
        lines={[<>分工：<span style={{ color: STEP[0] }}>东西越造越多</span></>, <>价格：<span style={{ color: STEP[1] }}>围着中心转</span></>, <>分配：<span style={{ color: STEP[2] }}>工钱、利润、地租</span></>]}
        foot="《国富论》第一篇 · 第1–11章 · 看得见的手"
      />
    </Shell>
  );
};

// ================================================================ 合集条：15 集回顾 + 下期
export const SRecap: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("recap");
  const W = useWordAt("recap");
  const wNext = W(0, "第二篇");
  return (
    <Shell dur={L.dur} enter="fade" cam="still">
      <Paper />
      <T y={320} size={46} serif>合集《一口气读懂国富论》· 第一篇</T>
      <RecapGrid k={interpolate(f, [4, wNext - 10], [0, 1], CL)} top={410} />
      <div style={{ position: "absolute", top: 1200, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fin(f, wNext - 8, 10) }}>
        <div style={{ background: C.ink, color: C.paper, padding: "12px 28px", borderRadius: 999, fontFamily: SERIF, fontWeight: 900, fontSize: 32, whiteSpace: "nowrap" }}>下期 · 第二篇：你手里那点钱，哪一部分在帮你挣钱？</div>
      </div>
      {Array.from({ length: 15 }).map((_, i) => <Sfx key={i} at={4 + Math.round(((wNext - 14) * i) / 15)} name="tick" v={0.12} />)}
      <Sfx at={wNext} name="ding" v={0.3} />
    </Shell>
  );
};
