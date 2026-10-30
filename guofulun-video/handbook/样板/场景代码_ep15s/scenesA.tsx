// 第一篇汇总 · 开头（外套）+ 第一步（越造越多：针、交换、市场）+ 第二步（怎么换、怎么定价：钱、真正的尺子、三份、中心）
import React from "react";
import { Landlord } from "../ep12/world";
import { Farmer } from "../ep11/world";
import { TeaShop } from "../ep09/world";
import { MilkTea } from "../ep06/props06";
import { Person } from "../kit";
import { Farm } from "../ep12/world";
import { Workshop, Village } from "../ep06s/world";
import { Worker, WeaveStreet, Ahe } from "../ep08/world";
import { Street, Coach } from "../ep07/world";
import { interpolate, useCurrentFrame } from "remotion";
import { C, fin, keys, Paper, pop, Seal, Sfx, Shell, Stage, swing, T, useFps, useLines, useWordAt, SERIF } from "../kit";
import { HeadMark } from "../story";
import { Barrel, Bread, Coin, Horse, Meat, Ship } from "../props";
import { Anvil, Bubble, Butcher, Cart, Xiaoman } from "../ep10/world";
import { Forge } from "../ep11/world";
import { useMouth } from "../ep11/scenesA";
import { FarTown, Notice, Sea, Sheaf, SplitBar, VBar } from "../ep12/world";
import { Bone, Coat, Crowd, Dog, GROUND, Mini, Modern, PART, Pin, PriceSwing, STEP } from "./world";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ph = (f: number, L: { s: (i: number) => number }, a: number, b?: number) => fin(f, L.s(a) - 6, 12) * (b === undefined ? 1 : 1 - fin(f, L.s(b) - 6, 12));

// ================================================================ 开头：一件外套背后的一大群人 → 不认识你也不是好心 → 核心结论 → 三步路线图
export const SHook: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("hook");
  const W = useWordAt("hook");
  const wSheep = W(0, "放羊的"), wShip = W(0, "开船的"), wMany = W(0, "成千上万"), wNot = W(1, "不认识你"), wKind = W(1, "好心");
  const wDiv = W(2, "靠的是分工"), wW = W(2, "工钱"), wP = W(2, "利润"), wR = W(2, "地租"), r1 = W(3, "越造越多"), r2 = W(3, "怎么换"), r3 = W(3, "怎么分");
  const crowdK = interpolate(f, [wSheep - 10, wShip + 10], [0, 1], CL);
  const p2 = fin(f, L.s(2) - 6, 12), p3 = fin(f, L.s(3) - 6, 12);
  const steps = [{ t: "东西为什么越造越多", at: r1 }, { t: "东西怎么换、怎么定价", at: r2 }, { t: "造出来的东西，怎么分", at: r3 }];
  return (
    <Shell dur={L.dur} enter="none" zoom={0.05} cam="pull" kicks={[wShip, wMany, wKind, wDiv, wR, r3]}>
      <Paper />
      <Stage>
        <g opacity={1 - p2}>
          <FarTown x={140} y={GROUND - 120} s={1.1} o={0.35} /><FarTown x={940} y={GROUND - 120} s={1.0} o={0.3} />
          <rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" />
          <g transform={`translate(540 ${GROUND - 380 + (1 - fin(f, 0, 12)) * 20}) scale(${1.3 - crowdK * 0.35})`}><Coat /></g>
          <Crowd k={crowdK} extra={fin(f, wMany - 10, 30)} />
        </g>
        {p2 > 0 && p3 < 1 && (
          <g opacity={p2 * (1 - p3)}>
            <g transform="translate(0 120)"><Farm dim={0.6} /></g>
            <g transform={`translate(540 ${GROUND - 20})`}>
              {[{ c: PART.wage, at: wW, x: -300 }, { c: PART.profit, at: wP, x: 0 }, { c: PART.rent, at: wR, x: 300 }].map((b) => (
                <g key={b.x} transform={`translate(${b.x} 0) scale(${pop(f, fps, b.at - 6, 11)})`}><rect x={-110} y={-160} width={220} height={160} rx={16} fill={b.c} stroke={C.ink} strokeWidth={4} /></g>
              ))}
            </g>
          </g>
        )}
      </Stage>
      <T y={330} size={60} serif style={{ opacity: 1 - fin(f, L.s(1) - 6, 10) }}>一件外套，<span style={{ color: C.red }}>多少人</span>在干活？</T>
      {f >= L.s(1) - 6 && p2 < 1 && <T y={330} size={52} serif style={{ opacity: fin(f, L.s(1) - 6, 8) * (1 - p2) }}>不认识你，<span style={{ color: C.red, opacity: fin(f, wKind - 6, 8) }}>也不是因为好心</span></T>}
      {p2 > 0 && p3 < 1 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 330, textAlign: "center", fontFamily: SERIF, fontWeight: 900, opacity: p2 * (1 - p3) }}>
          <div style={{ fontSize: 40, color: C.ink2 }}>第一篇的答案就一句话：</div>
          <div style={{ fontSize: 54, marginTop: 30, opacity: fin(f, wDiv - 10, 8) }}>国家越来越富，靠的是<span style={{ color: STEP[0] }}>分工</span></div>
          <div style={{ fontSize: 48, marginTop: 24, opacity: fin(f, wW - 12, 8) }}>富出来的东西分三份：<span style={{ color: PART.wage }}>工钱</span>、<span style={{ color: PART.profit, opacity: fin(f, wP - 6, 6) }}>利润</span>、<span style={{ color: PART.rent, opacity: fin(f, wR - 6, 6) }}>地租</span></div>
        </div>
      )}
      {p3 > 0 && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 340, fontFamily: SERIF, fontWeight: 900, opacity: p3 }}>
          <div style={{ fontSize: 40, textAlign: "center", marginBottom: 10 }}><span style={{ background: C.red, color: C.paper, padding: "4px 16px", borderRadius: 6 }}>《国富论》第一篇 · 总结</span></div>
          <div style={{ fontSize: 46, textAlign: "center", marginBottom: 26 }}>十一章的内容，分<span style={{ color: C.red }}>三步</span>讲</div>
          {steps.map((s, i) => (
            <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 18, height: 106, opacity: fin(f, s.at - 6, 8), translate: `${(1 - fin(f, s.at - 6, 8)) * 40}px 0` }}>
              <span style={{ width: 66, height: 66, borderRadius: 33, background: STEP[i], color: C.paper, fontSize: 42, display: "grid", placeItems: "center", flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 46, whiteSpace: "nowrap" }}>{s.t}</span>
            </div>
          ))}
        </div>
      )}
      <Sfx at={2} name="pop" v={0.3} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <Sfx key={i} at={wSheep + i * 8} name="pop" v={0.18} />)}
      <Sfx at={wMany} name="ding" v={0.35} />
      <Sfx at={wKind} name="tick" v={0.3} />
      <Sfx at={wDiv} name="boom" v={0.4} />
      {[wW, wP, wR].map((a, i) => <Sfx key={`p${i}`} at={a} name="pop" v={0.3} />)}
      {[r1, r2, r3].map((a, i) => <Sfx key={`r${i}`} at={a} name="pop" v={0.3} />)}
    </Shell>
  );
};

// ================================================================ ① 针：一个人一天做不出二十根 → 十个人十八道工序 → 四万八千根 → 小满 → 三个原因
export const SPin: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("pin");
  const W = useWordAt("pin");
  const M = useMouth("pin");
  const wNone = W(0, "一根针都做不出来"), w20 = W(0, "二十根"), wTen = W(1, "十个人分工"), w18 = W(1, "十八道工序"), w48 = W(2, "四万八千多根"), w4800 = W(2, "四千八百根");
  const c1 = W(4, "手越来越熟"), c2 = W(4, "省下了时间"), c3 = W(4, "发明工具");
  const p0 = ph(f, L, 0, 1), p12 = ph(f, L, 1, 3), p3 = ph(f, L, 3, 4), p4 = ph(f, L, 4);
  const pins = Math.floor(interpolate(f, [w48 - 20, w48 + 30], [0, 40], CL));
  const big = Math.floor(interpolate(f, [w48 - 10, w48 + 20], [0, 48000], CL));
  return (
    <Shell dur={L.dur} enter={{ ink: [540, 900] }} cam="push" zoom={0.05} kicks={[w20, w18, w48, L.s(3), c3]}>
      <Paper />
      <Stage>
        <rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" />
        {p0 > 0 && <g opacity={p0}><Workshop x={860} k={1} /><rect x={380} y={GROUND - 120} width={320} height={22} rx={6} fill={C.wood} stroke={C.ink} strokeWidth={3} /><rect x={400} y={GROUND - 100} width={16} height={100} fill={C.wood} /><rect x={664} y={GROUND - 100} width={16} height={100} fill={C.wood} /><Worker x={460} s={0.85} col="#6E8FA8" mood={f >= w20 - 6 ? "tired" : "flat"} sweat={f >= w20 - 6} armR={[swing(f, 0.25, 40, 80), 30]} /><g transform={`translate(600 ${GROUND - 140}) rotate(${swing(f, 0.3, -20, 20)})`}><Pin s={1.4} /></g></g>}
        {p12 > 0 && (
          <g opacity={p12}>
            <rect x={30} y={GROUND - 130} width={1020} height={20} rx={6} fill={C.wood} stroke={C.ink} strokeWidth={3} />
            {Array.from({ length: 10 }).map((_, i) => <Worker key={i} x={70 + i * 104} s={0.6} col={["#5E7FA8", "#7C8C5A", "#B98A45", "#A8764C", "#86593A"][i % 5]} seed={300 + i} mood={f >= w48 ? "happy" : "flat"} armR={[swing(f, 0.4, 30, 90, i), 30]} o={fin(f, wTen - 10 + i * 3, 6)} />)}
            {Array.from({ length: pins }).map((_, i) => <g key={i} transform={`translate(${80 + (i % 20) * 48} ${GROUND - 200 - Math.floor(i / 20) * 70})`}><Pin s={0.6} rot={(i * 37) % 30 - 15} /></g>)}
          </g>
        )}
        {p3 > 0 && (
          <g opacity={p3}>
            <Forge x={200} s={0.9} fire={0.7 + 0.3 * Math.sin(f * 0.3)} />
            <g transform={`translate(600 ${GROUND})`}><Anvil s={0.9} /></g>
            <Xiaoman x={460} s={1.15} mood={M("小满", f, "happy")} armR={[swing(f, 0.45, 20, 130), 20]} />
            <HeadMark x={500} y={GROUND - 430} text="！" at={L.s(3)} />
          </g>
        )}
      </Stage>
      {p0 > 0 && <T y={420} size={48} serif style={{ opacity: p0 }}>一个没学过的人，一天做针</T>}
      {p0 > 0 && f >= w20 - 10 && <T y={520} size={60} serif color={C.red} style={{ opacity: fin(f, w20 - 10, 8) * p0, scale: String(pop(f, fps, w20 - 10, 10)) }}>二十根？做不到</T>}
      {p12 > 0 && <T y={420} size={46} serif style={{ opacity: p12 }}>十个人分工：拉丝、拉直、切断、磨尖……</T>}
      {p12 > 0 && f >= w18 - 6 && f < L.s(2) - 6 && <T y={510} size={50} serif color={STEP[0]} style={{ opacity: fin(f, w18 - 6, 8) }}>一根针，十八道工序</T>}
      {p12 > 0 && f >= L.s(2) - 6 && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 480, textAlign: "center", fontFamily: SERIF, fontWeight: 900, opacity: fin(f, L.s(2) - 6, 8) * p12 }}>
          <div style={{ fontSize: 92, color: STEP[0] }}>{big.toLocaleString("en-US")}+ 根 / 天</div>
          <div style={{ fontSize: 44, marginTop: 10, opacity: fin(f, w4800 - 6, 8) }}>一个人摊下来 <span style={{ color: C.red }}>4800</span> 根</div>
        </div>
      )}
      {f >= L.s(3) - 2 && f < L.s(4) + 6 && <Bubble x={460} y={760} size={36} o={fin(f, L.s(3) - 2, 5)}>我一天打的刀，比我师傅那会儿多多了！</Bubble>}
      {p4 > 0 && (
        <div style={{ position: "absolute", left: 90, right: 90, top: 400, fontFamily: SERIF, fontWeight: 900, opacity: p4 }}>
          <div style={{ fontSize: 46, textAlign: "center", marginBottom: 24 }}>分工让东西越造越多，三个原因</div>
          {[{ t: "手越来越熟", at: c1 }, { t: "省下换来换去的时间", at: c2 }, { t: "琢磨一件事，就会发明工具", at: c3 }].map((r, i) => (
            <div key={r.t} style={{ display: "flex", alignItems: "center", gap: 18, height: 96, fontSize: 46, opacity: fin(f, r.at - 6, 8), translate: `${(1 - fin(f, r.at - 6, 8)) * 40}px 0` }}>
              <span style={{ width: 60, height: 60, borderRadius: 30, background: STEP[0], color: C.paper, fontSize: 38, display: "grid", placeItems: "center" }}>{i + 1}</span>{r.t}
            </div>
          ))}
        </div>
      )}
      {p4 > 0 && <Stage><g opacity={p4}><Xiaoman x={540} s={1.1} mood="happy" armR={[swing(f, 0.45, 20, 130), 20]} /></g></Stage>}
      <Sfx at={w20} name="buzz" v={0.25} />
      <Sfx at={wTen} name="pop" v={0.3} />
      <Sfx at={w18} name="tick" v={0.3} />
      <Sfx at={w48} name="boom" v={0.45} />
      <Sfx at={L.s(3)} name="hammer" v={0.3} />
      {[c1, c2, c3].map((a, i) => <Sfx key={i} at={a} name="pop" v={0.3} />)}
    </Shell>
  );
};

// ================================================================ ① 交换：人天生爱交换 → 晚饭不靠好心 → 让他觉得换给你有好处
export const STrade: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("trade");
  const W = useWordAt("trade");
  const wSwap = W(0, "爱交换"), wDog = W(1, "两条狗"), wBone = W(1, "另一根骨头"), wB = W(2, "屠夫"), wBr = W(2, "酿酒师"), wBa = W(2, "面包师"), wSelf = W(2, "自己利益"), wGood = W(3, "对他有好处");
  const pDog = ph(f, L, 1, 2);
  return (
    <Shell dur={L.dur} enter="page" cam="panR" zoom={0.05} kicks={[wSwap, wDog, wSelf, wGood]}>
      <Paper />
      <Stage>
        <rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" />
        <g opacity={fin(f, L.s(2) - 6, 12)}><Street dim={0.5} /></g>
        {pDog > 0 && <Village dim={0.4} />}
        {pDog > 0 && (
          <g opacity={pDog}>
            <Dog x={330} s={1.3} /><Dog x={750} s={1.3} flip />
            <g transform={`translate(430 ${GROUND - 60})`}><Bone /></g><g transform={`translate(650 ${GROUND - 60})`}><Bone /></g>
            {f >= wBone - 4 && <text x={540} y={GROUND - 200} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={120} fill={C.red} opacity={fin(f, wBone - 4, 6)}>✕</text>}
          </g>
        )}
        {f >= L.s(2) - 6 && <g opacity={fin(f, L.s(2) - 6, 10)}>
        <g opacity={fin(f, wB - 6, 8)}><Butcher x={200} s={1.05} mood="smile" holdR={<Meat s={0.8} />} armR={[60, 20]} /></g>
        <g opacity={fin(f, wBr - 6, 8)}><Person x={540} y={GROUND} s={0.8} hat="kerchief" shirt="#86593A" apron seed={401} mood={f >= wSelf ? "smirk" : "smile"} /><g transform={`translate(630 ${GROUND - 10})`}><Barrel s={1.0} /></g></g>
        <g opacity={fin(f, wBa - 6, 8)}><Person x={860} y={GROUND} s={0.8} hat="chef" shirt="#E9DFCB" apron seed={402} mood={f >= wSelf ? "smirk" : "smile"} flip /><g transform={`translate(950 ${GROUND - 10})`}><Bread s={1.0} /></g></g>
        </g>}
        {f >= wSwap - 6 && f < L.s(1) && [0, 1].map((i) => <g key={i} transform={`translate(${interpolate(f, [wSwap - 6, wSwap + 30], i ? [860, 200] : [200, 860], CL)} ${900 - Math.sin(interpolate(f, [wSwap - 6, wSwap + 30], [0, Math.PI], CL)) * 80})`}><Coin s={1.2} /></g>)}
      </Stage>
      <T y={420} size={48} serif style={{ opacity: 1 - fin(f, L.s(1) - 6, 8) }}>人天生<span style={{ color: STEP[0] }}>爱交换</span>：你给我这个，我给你那个</T>
      {pDog > 0 && <T y={420} size={46} serif style={{ opacity: pDog }}>这种本事只有人有：<span style={{ color: C.red, opacity: fin(f, wDog - 6, 8) }}>狗不会公平地换骨头</span></T>}
      {f >= L.s(2) - 6 && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 380, textAlign: "center", fontFamily: SERIF, fontWeight: 900, opacity: fin(f, L.s(2) - 6, 8) }}>
          <div style={{ fontSize: 44, color: C.ink2 }}>我们的晚饭，不是来自</div>
          <div style={{ fontSize: 48, marginTop: 14 }}>屠夫、酿酒师、面包师的<span style={{ color: C.mute, textDecoration: f >= wSelf - 10 ? "line-through" : "none" }}>好心</span></div>
          <div style={{ fontSize: 56, marginTop: 24, color: C.red, opacity: fin(f, wSelf - 10, 8), scale: String(pop(f, fps, wSelf - 10, 10)) }}>而是他们对自己利益的关心</div>
        </div>
      )}
      {f >= wGood - 10 && <Seal x={540} y={760} text="让他觉得：换给你，对他有好处" size={44} rot={-3} style={{ scale: String(interpolate(fin(f, wGood - 10, 8), [0, 1], [1.6, 1])), opacity: fin(f, wGood - 10, 6) }} />}
      <Sfx at={wSwap} name="ding" v={0.3} />
      <Sfx at={wBone} name="buzz" v={0.25} />
      {[wB, wBr, wBa].map((a, i) => <Sfx key={i} at={a} name="pop" v={0.28} />)}
      <Sfx at={wSelf} name="boom" v={0.45} />
      <Sfx at={wGood} name="ding" v={0.35} />
    </Shell>
  );
};

// ================================================================ ① 市场：分工有限度 → 小村子 vs 大城市挑夫 → 大车四吨 vs 船两百吨 → 第一步结论
export const SMarket: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("market");
  const W = useWordAt("market");
  const wHow = W(0, "卖给多少人"), wVill = W(1, "小村子"), wAll = W(1, "什么都干"), wPort = W(1, "挑夫"), wCity = W(1, "大城市"), wFarm = W(2, "屠夫"), wCarp = W(3, "木匠"), wCart = W(4, "一辆大车"), w4 = W(4, "四吨"), wShip = W(4, "一条船"), w200 = W(4, "两百吨");
  const p1 = ph(f, L, 1, 4), p2 = ph(f, L, 4), p23 = fin(f, L.s(2) - 6, 12);
  return (
    <Shell dur={L.dur} enter="fade" cam="panL" zoom={0.05} kicks={[wAll, wCity, wFarm, wCarp, w4, w200]}>
      <Paper />
      <Stage>
        {p1 > 0 && (
          <g opacity={p1}>
            <rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" />
            <path d={`M 0 ${GROUND} L 0 960 L 180 860 L 360 980 L 460 ${GROUND} Z`} fill="#A9B08E" stroke={C.ink2} strokeWidth={3} />
            <Mini x={260} y={GROUND} col="#7C8C5A" s={1.4} o={fin(f, wVill - 6, 8)} />
            <FarTown x={800} y={GROUND} s={1.6} />
            {f >= wPort - 6 && <Mini x={keys(f - wPort, [[-6, 700], [30, 860]])} y={GROUND} col="#86593A" s={1.3} />}
            {p23 > 0 && <g opacity={p23}><HeadMark x={290} y={GROUND - 230} text="…" at={wFarm} col={C.ink2} /></g>}
          </g>
        )}
        {p2 > 0 && (
          <g opacity={p2}>
            <Sea x={0} w={1080} t={f} />
            <rect x={0} y={GROUND - 170} width={1080} height={20} fill="#CDBB98" />
            <g transform={`translate(${interpolate(f, [wCart - 10, wCart + 80], [100, 300], CL)} ${GROUND - 180})`} opacity={fin(f, wCart - 6, 8)}>
              {[0, 1, 2, 3].map((i) => <Horse key={i} x={160 + (i % 2) * 70} y={-(i >> 1) * 20} s={0.4} phase={f * 0.3 + i} />)}
              <Cart s={1.0} />
            </g>
            <Ship x={interpolate(f, [wShip - 10, wShip + 80], [520, 780], CL)} y={GROUND - 20} s={0.9} rock={Math.sin(f * 0.1) * 2} />
          </g>
        )}
      </Stage>
      {f < L.s(1) && <T y={430} size={50} serif>分工有个限度：看东西能<span style={{ color: STEP[0] }}>卖给多少人</span></T>}
      {p1 > 0 && <T y={420} size={44} serif style={{ opacity: p1 }}>山里小村：一个人<span style={{ color: C.mute }}>什么都干</span></T>}
      {p23 > 0 && p1 > 0 && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 500, fontFamily: SERIF, fontWeight: 900, opacity: p23 * p1 }}>
          <div style={{ fontSize: 40, opacity: fin(f, wFarm - 10, 8), whiteSpace: "nowrap" }}>农民：自家的<span style={{ color: STEP[0] }}>屠夫、面包师、酿酒师</span>一肩挑</div>
          <div style={{ fontSize: 40, marginTop: 18, opacity: fin(f, wCarp - 6, 8), whiteSpace: "nowrap" }}>木匠：家具、雕花、车轮、大车全包</div>
        </div>
      )}
      {p1 > 0 && p23 < 1 && f >= wPort - 6 && <T y={500} size={44} serif style={{ opacity: fin(f, wPort - 6, 8) * p1 * (1 - p23) }}>专门扛东西的挑夫：只有<span style={{ color: STEP[0] }}>大城市</span>养得起</T>}
      {p2 > 0 && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 400, fontFamily: SERIF, fontWeight: 900, opacity: p2 }}>
          <div style={{ fontSize: 44, textAlign: "center" }}>同样六个礼拜</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30, fontSize: 40, opacity: fin(f, wCart - 6, 8) }}>
            <span style={{ width: 340, color: C.ink2 }}>大车：2 人 8 匹马</span><span style={{ fontSize: 56 }}>≈ 4 吨</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, fontSize: 40, opacity: fin(f, wShip - 6, 8) }}>
            <span style={{ width: 340, color: C.ink2 }}>船：6–8 个人</span><span style={{ fontSize: 66, color: STEP[0], scale: String(pop(f, fps, w200 - 6, 10)) }}>200 吨</span>
          </div>
        </div>
      )}
      <Sfx at={wHow} name="tick" v={0.3} />
      <Sfx at={wAll} name="buzz" v={0.2} />
      <Sfx at={wCity} name="ding" v={0.3} />
      <Sfx at={w4} name="pop" v={0.3} />
      <Sfx at={wFarm} name="pop" v={0.28} />
      <Sfx at={wCarp} name="pop" v={0.28} />
      <Sfx at={w200} name="boom" v={0.45} />
    </Shell>
  );
};

// ================================================================ ② 钱：屠夫换不出去 → 选中金属 → 钱就是这么来的
export const SMoney: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("money");
  const W = useWordAt("money");
  const wMeat = W(0, "屠夫肉多"), wNo = W(0, "面包师不缺肉"), wMetal = W(1, "金属"), wKeep = W(1, "不会坏"), wCut = W(1, "能切能分"), wMoney = W(1, "钱，就是");
  return (
    <Shell dur={L.dur} enter={{ iris: [540, 900] }} cam="still" kicks={[wNo, wMetal, wMoney]}>
      <Paper />
      <Stage>
        <rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" />
        <Street dim={0.45} />
        <Butcher x={260} s={1.1} mood={f >= wNo ? "sad" : "smile"} holdR={<Meat s={0.9} />} armR={[keys(f - wMeat, [[0, 20], [12, 70]]), 20]} />
        <Person x={820} y={GROUND} s={0.95} hat="chef" shirt="#E9DFCB" apron seed={402} flip mood={f >= wNo ? "flat" : "smile"} armL={f >= wNo ? [keys(f - wNo, [[0, 12], [10, 70]]), 40] : [12, 10]} tilt={f >= wNo ? -8 : 0} />
        <g transform={`translate(900 ${GROUND - 10})`}><Bread s={1.1} /></g>
        <HeadMark x={300} y={GROUND - 430} text="？" at={wNo} />
        {f >= wMetal - 6 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${440 + i * 100} ${GROUND - 260 - Math.sin(f * 0.1 + i) * 10}) scale(${pop(f, fps, wMetal - 6 + i * 4, 11) * 1.6})`}><Coin /></g>)}
      </Stage>
      {f < L.s(1) && <T y={420} size={46} serif>屠夫肉多吃不完，想换面包</T>}
      {f < L.s(1) && f >= wNo - 6 && <T y={500} size={46} serif color={C.red} style={{ opacity: fin(f, wNo - 6, 8) }}>可面包师不缺肉：换不成</T>}
      {f >= L.s(1) - 6 && <T y={420} size={46} serif style={{ opacity: fin(f, L.s(1) - 6, 8) }}>大家存一样人人都要的东西：<span style={{ color: STEP[1] }}>金属</span></T>}
      {f >= wKeep - 6 && <T y={500} size={42} serif color={C.ink2} style={{ opacity: fin(f, wKeep - 6, 8) }}>不会坏 · <span style={{ opacity: fin(f, wCut - 6, 8) }}>能切能分</span></T>}
      {f >= wMoney - 6 && <Seal x={540} y={620} text="钱，就是这么来的" size={60} rot={-4} style={{ scale: String(interpolate(fin(f, wMoney - 6, 8), [0, 1], [1.7, 1])), opacity: fin(f, wMoney - 6, 6) }} />}
      <Sfx at={wMeat} name="pop" v={0.3} />
      <Sfx at={wNo} name="buzz" v={0.25} />
      <Sfx at={wMetal} name="ding" v={0.35} />
      <Sfx at={wMoney} name="boom" v={0.45} />
    </Shell>
  );
};

// ================================================================ ② 真正的尺子：劳动 → 最早的价钱 → 涨薪不一定变富 → 当代：涨一成、涨两成 → 隔几百年看粮食、隔一两年看银子
export const SReal: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("real");
  const W = useWordAt("real");
  const wLabor = W(0, "劳动"), wName = W(0, "名义上"), wFirst = W(1, "最早的价钱"), wRich = W(2, "不一定就变富"), w10 = W(3, "一成"), w20 = W(3, "两成"), wLess = W(3, "反倒少了"), wCen = W(4, "几百年"), wCorn = W(4, "粮食"), wYear = W(4, "一两年");
  const p01 = ph(f, L, 0, 2), p2 = ph(f, L, 2, 3), p3 = ph(f, L, 3, 4), p4 = ph(f, L, 4);
  return (
    <Shell dur={L.dur} enter="page" cam="rise" zoom={0.05} kicks={[wLabor, wFirst, wRich, wLess, wCorn, wYear]}>
      <Paper dusk={0.35} />
      <Modern scene="real" i={3} />
      <Stage>
        <WeaveStreet dim={0.6} />
        {p01 > 0 && (
          <g opacity={p01}>
            <g transform={`translate(160 ${GROUND - 420})`} opacity={fin(f, wLabor - 10, 10)}>
              <rect x={0} y={0} width={760 * fin(f, wLabor - 10, 20)} height={56} rx={8} fill="#F3E3B8" stroke={C.ink} strokeWidth={3} />
              {Array.from({ length: 15 }).map((_, i) => i * 52 < 760 * fin(f, wLabor - 10, 20) && <line key={i} x1={14 + i * 52} y1={0} x2={14 + i * 52} y2={i % 2 ? 18 : 30} stroke={C.ink} strokeWidth={3} />)}
            </g>
            <Ahe x={540} s={0.9} mood="smile" armR={[keys(f - wLabor, [[0, 12], [12, 120]]), 30]} />
          </g>
        )}
        {p3 > 0 && (
          <g opacity={p3}>
            <VBar x={300} y={GROUND - 20} v={0.5 * (1 + 0.1 * fin(f, w10 - 6, 10))} col={STEP[1]} label="工资" val={f >= w10 - 4 ? "+10%" : ""} w={140} />
            <VBar x={700} y={GROUND - 20} v={0.5 * (1 + 0.2 * fin(f, w20 - 6, 10))} col={C.red} label="房租、菜价" val={f >= w20 - 4 ? "+20%" : ""} w={140} />
          </g>
        )}
        {p4 > 0 && (
          <g opacity={p4}>
            <g transform={`translate(300 ${GROUND - 40})`}><Sheaf s={2.2} /></g>
            <g transform={`translate(760 ${GROUND - 60}) scale(2)`}><Coin /></g>
          </g>
        )}
      </Stage>
      {p01 > 0 && <T y={420} size={56} serif style={{ opacity: p01 * fin(f, wLabor - 6, 8) }}>真正的尺子：<span style={{ color: STEP[1] }}>劳动</span></T>}
      {p01 > 0 && f >= wName - 8 && f < L.s(1) - 6 && <T y={510} size={40} serif color={C.ink2} style={{ opacity: fin(f, wName - 8, 8) }}>钱，只是名义上的价钱</T>}
      {p01 > 0 && f >= L.s(1) - 6 && <T y={510} size={44} serif style={{ opacity: fin(f, L.s(1) - 6, 8) * p01 }}>劳动是<span style={{ color: STEP[1] }}>最早的价钱</span>：一切东西最初都是拿劳动买的</T>}
      {p2 > 0 && (
        <>
          <Notice x={540} y={400} title="工资" amount="+" col={STEP[1]} k={pop(f, fps, L.s(2) - 6, 11)} o={p2} />
          <T y={640} size={52} serif style={{ opacity: fin(f, wRich - 8, 8) * p2 }}>工资涨了，<span style={{ color: C.red }}>不一定就变富了</span></T>
          <T y={720} size={40} serif color={C.ink2} style={{ opacity: fin(f, wRich + 10, 8) * p2 }}>要看同样的钱，能换来多少东西、多少别人的劳动</T>
        </>
      )}
      {p3 > 0 && <T y={420} size={46} serif style={{ opacity: p3 }}>到手的数变大了，<span style={{ color: C.red, opacity: fin(f, wLess - 8, 8) }}>能换的东西反倒少了</span></T>}
      {p4 > 0 && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 400, fontFamily: SERIF, fontWeight: 900, opacity: p4 }}>
          <div style={{ fontSize: 44, textAlign: "center", marginBottom: 26 }}>比价钱，换一把尺子</div>
          <div style={{ fontSize: 42, opacity: fin(f, wCen - 6, 8), whiteSpace: "nowrap" }}>隔几百年：看能换多少<span style={{ color: STEP[2] }}>粮食</span></div>
          <div style={{ fontSize: 42, marginTop: 18, opacity: fin(f, wYear - 6, 8), whiteSpace: "nowrap" }}>隔一两年：看<span style={{ color: STEP[1] }}>银子</span>反倒更准</div>
        </div>
      )}
      <Sfx at={wLabor} name="ding" v={0.35} />
      <Sfx at={wFirst} name="tick" v={0.3} />
      <Sfx at={wRich} name="boom" v={0.4} />
      <Sfx at={w10} name="pop" v={0.3} />
      <Sfx at={w20} name="pop" v={0.3} />
      <Sfx at={wCorn} name="pop" v={0.28} />
      <Sfx at={wYear} name="pop" v={0.28} />
    </Shell>
  );
};

// ================================================================ ② 三份：一袋麦子分给工钱、利润、地租 → 当代：一杯奶茶
export const SParts: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLines("parts");
  const W = useWordAt("parts");
  const wW = W(0, "工钱"), wP = W(0, "利润"), wR = W(0, "地租"), w3 = W(1, "三块"), wTea = W(2, "奶茶"), wUp = W(2, "一路往上追");
  const p2 = fin(f, L.s(2) - 6, 12);
  return (
    <Shell dur={L.dur} enter="fade" cam="push" zoom={0.05} kicks={[wW, wP, wR, w3, wTea]}>
      <Paper />
      <Modern scene="parts" i={2} />
      <Stage>
        <g opacity={1 - p2}>
          <Farm dim={0.5} />
          <Farmer x={200} s={0.75} mood="smile" o={fin(f, wW - 6, 8)} armR={[keys(f - wW, [[0, 12], [10, 100]]), 30]} />
          <Person x={540} y={GROUND} s={0.75} hat="cap" shirt="#3D4A63" seed={420} mood="smile" o={fin(f, wP - 6, 8)} armR={[keys(f - wP, [[0, 12], [10, 100]]), 30]} />
          <Landlord x={880} s={0.75} flip mood="smirk" o={fin(f, wR - 6, 8)} armR={[keys(f - wR, [[0, 12], [10, 100]]), 30]} />
        </g>
        {p2 > 0 && (
          <g opacity={p2}>
            <rect x={0} y={GROUND} width={1080} height={130} fill="#CDBB98" />
            <TeaShop x={760} s={1.1} />
            <Person x={300} y={GROUND} s={0.75} hat="none" shirt="#C3923F" seed={421} mood="happy" holdR={<MilkTea s={0.5} />} armR={[60, 20]} />
          </g>
        )}
      </Stage>
      <T y={420} size={44} serif style={{ opacity: 1 - p2 }}>拿一袋麦子来说</T>
      {p2 > 0 && <T y={420} size={44} serif style={{ opacity: p2 }}>你买的一杯<span style={{ color: STEP[1] }}>奶茶</span>，也一样</T>}
      <SplitBar x={100} y={520} f={f} title={f >= L.s(2) - 6 ? "一杯奶茶的钱" : "一袋麦子卖出去的钱"} segs={[
        { label: "工钱", v: 3.4, col: PART.wage, at: wW - 4 },
        { label: "利润", v: 3, col: PART.profit, at: wP - 4 },
        { label: f >= L.s(2) - 6 ? "房租" : "地租", v: 3, col: PART.rent, at: wR - 4 },
      ]} />
      {f >= wW - 6 && <T y={760} size={36} serif color={C.ink2} style={{ opacity: fin(f, wW - 6, 8) * (1 - p2) }}>种地的人 · <span style={{ opacity: fin(f, wP - 6, 8) }}>租地的老板 · </span><span style={{ opacity: fin(f, wR - 6, 8) }}>地主</span></T>}
      {p2 > 0 && <T y={760} size={36} serif color={C.ink2} style={{ opacity: p2 }}>店员 · 老板 · 铺面的房东<span style={{ opacity: fin(f, wUp - 6, 8) }}>　茶叶、牛奶往上追也一样</span></T>}
      {f >= w3 - 6 && <Seal x={540} y={860} text="几乎所有价钱，都分成这三块" size={50} rot={-3} style={{ scale: String(interpolate(fin(f, w3 - 6, 8), [0, 1], [1.6, 1])), opacity: fin(f, w3 - 6, 6) }} />}
      {[wW, wP, wR].map((a, i) => <Sfx key={i} at={a} name="pop" v={0.32} />)}
      <Sfx at={w3} name="boom" v={0.4} />
      <Sfx at={wTea} name="ding" v={0.3} />
    </Shell>
  );
};

// ================================================================ ② 中心：黑布、粮价 → 穷人想坐马车不算数 → 自然价格，市场价格围着它跳 → 贵了进来、贱了撤出
export const SCenter: React.FC = () => {
  const f = useCurrentFrame();
  const fps = useFps();
  const L = useLines("center");
  const W = useWordAt("center");
  const wCloth = W(0, "黑布"), wGrain = W(0, "粮价往下跌"), wCoach = W(1, "马车"), wNo = W(1, "不算数"), wPay = W(1, "出得起价"), wNat = W(2, "自然价格"), wJump = W(2, "上下跳"), wBack = W(2, "拉回去"), wIn = W(3, "挤进来"), wOut = W(3, "撤出去");
  const p1 = ph(f, L, 1, 2), p2 = fin(f, L.s(2) - 6, 12);
  const amp = interpolate(f, [wJump - 10, wBack + 30], [0.42, 0.06], CL);
  return (
    <Shell dur={L.dur} enter="page" cam="panR" zoom={0.05} kicks={[wCloth, wNo, wNat, wBack, wIn, wOut]}>
      <Paper dusk={0.2} />
      <Stage>
        <Street dim={0.55} />
        {p1 > 0 && (
          <g opacity={p1}>
            <Person x={220} y={GROUND} s={0.85} hat="none" shirt="#8C7A5A" pants="#5A4E40" seed={410} mood={f >= wNo ? "sad" : "happy"} armR={[keys(f - wCoach, [[0, 12], [10, 110]]), 30]} />
            <HeadMark x={300} y={GROUND - 260} text="♪" at={wCoach} col={C.ink2} />
            <g transform={`translate(${keys(f - wCoach, [[-6, 1200], [30, 760]])} ${GROUND})`} opacity={fin(f, wCoach - 6, 8)}><Coach /></g>
            {f >= wNo - 4 && <text x={640} y={GROUND - 220} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={110} fill={C.red} opacity={fin(f, wNo - 4, 6) * (1 - fin(f, wPay - 6, 8))}>✕</text>}
          </g>
        )}
        {p2 > 0 && <g opacity={p2}><PriceSwing x={540} y={980} amp={f < wNat ? 0.42 * Math.abs(Math.sin(f * 0.04)) : amp} t={f} /></g>}
        {f < L.s(1) - 6 && <PriceSwing x={540} y={980} amp={0.42 * Math.abs(Math.sin(f * 0.04))} t={f} />}
        {f >= wIn - 6 && [0, 1, 2].map((i) => <Mini key={i} x={keys(f - wIn, [[-6, 1120], [20, 760 + i * 90]])} y={GROUND} col="#5E7FA8" s={1.0} />)}
        {f >= wOut - 6 && [0, 1].map((i) => <Mini key={`o${i}`} x={keys(f - wOut, [[-6, 180 + i * 90], [20, -60]])} y={GROUND} col="#86593A" s={1.0} />)}
      </Stage>
      {f < L.s(1) && <T y={420} size={44} serif>国丧：<span style={{ color: C.red }}>黑布</span>一下子变贵　丰收：<span style={{ color: STEP[0], opacity: fin(f, wGrain - 6, 8) }}>粮价往下跌</span></T>}
      {p1 > 0 && <T y={420} size={44} serif style={{ opacity: p1 }}>很穷的人也想坐六匹马的马车：<span style={{ color: C.red, opacity: fin(f, wNo - 6, 8) }}>不算数</span></T>}
      {p1 > 0 && f >= wPay - 8 && <T y={500} size={46} serif style={{ opacity: fin(f, wPay - 8, 8) * p1 }}>只有<span style={{ color: STEP[1] }}>出得起价</span>的想要，才把东西招到市场上</T>}
      {p2 > 0 && <T y={420} size={46} serif style={{ opacity: p2 }}>每样东西都有个<span style={{ color: STEP[1] }}>自然价格</span>，刚好够付三份</T>}
      {f >= wJump - 6 && <T y={500} size={44} serif color={C.ink2} style={{ opacity: fin(f, wJump - 6, 8) }}>市场价格围着它跳，最后总被拉回去</T>}
      {f >= wIn - 6 && <T y={600} size={46} serif style={{ opacity: fin(f, wIn - 6, 8) }}>卖贵了，<span style={{ color: STEP[0] }}>人挤进来</span>；<span style={{ opacity: fin(f, wOut - 6, 8) }}>卖贱了，<span style={{ color: C.red }}>人撤出去</span></span></T>}
      <Sfx at={wCloth} name="pop" v={0.3} />
      <Sfx at={wNo} name="buzz" v={0.25} />
      <Sfx at={wNat} name="ding" v={0.35} />
      <Sfx at={wBack} name="tick" v={0.3} />
      <Sfx at={wIn} name="pop" v={0.3} />
      <Sfx at={wOut} name="pop" v={0.3} />
    </Shell>
  );
};
