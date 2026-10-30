import React from "react";
import { AbsoluteFill } from "remotion";
import { C, Halftone, Hammer, Paper, Person, Pin, RegMark, Seal, SERIF } from "./kit";
import { Bar, Bread, BigCoin, Cat, House, Payslip } from "./props";
import { MilkTea } from "./ep06/props06";

/**
 * 头像 v2（2026-10-18）800×800：大头斯密，眨一只眼、咧嘴笑，金币当单片眼镜，右下角一只挥手的大手（看得见的手）。
 * 和主页背景图 v2 同色：藏青底、朱红圆环、米白。抖音裁成圆形，所有内容在半径 370 以内；缩到 100px 也要认得出。
 */
export const Avatar: React.FC = () => {
  const skin = "#F2CDA8", wig = "#F6F2EA", wigShade = "#DCD5C8", ink = "#141B28";
  const curls: [number, number, number][] = [[-196, -30, 70], [-210, 60, 66], [-188, 150, 60], [196, -30, 70], [210, 60, 66], [188, 150, 60]];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(100% 100% at 50% 40%, ${NAVY.bg} 0%, ${NAVY.bg2} 100%)` }}>
      <Halftone color={NAVY.cream} o={0.12} at="85% 15%" reach={45} size={16} />
      <svg width={800} height={800} viewBox="0 0 800 800" style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="avCircle"><circle cx={400} cy={400} r={348} /></clipPath></defs>
        <g clipPath="url(#avCircle)">
          <g transform="translate(400 390)">
            {/* 衣领 + 米白领结 */}
            <path d="M -230 420 Q -220 230 -60 200 L 60 200 Q 220 230 230 420 Z" fill="#2E4566" stroke={ink} strokeWidth={8} />
            <path d="M -60 200 Q -40 270 0 290 Q 40 270 60 200 Z" fill={NAVY.cream} stroke={ink} strokeWidth={6} />
            <path d="M -36 270 Q 0 330 36 270 Q 30 320 0 350 Q -30 320 -36 270 Z" fill={NAVY.cream} stroke={ink} strokeWidth={6} />
            {/* 假发卷 */}
            {curls.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={wig} stroke={ink} strokeWidth={8} />)}
            {curls.map(([x, y, r], i) => <path key={`s${i}`} d={`M ${x - r * 0.45} ${y + r * 0.1} q ${r * 0.45} ${r * 0.4} ${r * 0.9} 0`} stroke={wigShade} strokeWidth={8} fill="none" strokeLinecap="round" />)}
            {/* 脸 */}
            <ellipse cx={0} cy={30} rx={182} ry={190} fill={skin} stroke={ink} strokeWidth={9} />
            {/* 头顶假发 */}
            <path d="M -186 -40 Q -200 -210 0 -214 Q 200 -210 186 -40 Q 150 -120 70 -110 Q 0 -170 -70 -110 Q -150 -120 -186 -40 Z" fill={wig} stroke={ink} strokeWidth={9} strokeLinejoin="round" />
            <path d="M -110 -150 q 40 -30 80 -6 M 30 -156 q 44 -24 86 4" stroke={wigShade} strokeWidth={9} fill="none" strokeLinecap="round" />
            {/* 眉毛：一高一低，调皮 */}
            <path d="M -122 -46 Q -84 -76 -42 -54" stroke={ink} strokeWidth={14} fill="none" strokeLinecap="round" />
            <path d="M 44 -70 Q 86 -96 128 -72" stroke={ink} strokeWidth={14} fill="none" strokeLinecap="round" />
            {/* 左眼眨眼 */}
            <path d="M -122 6 Q -82 -20 -42 6" stroke={ink} strokeWidth={14} fill="none" strokeLinecap="round" />
            {/* 右眼 + 金币单片眼镜 */}
            <ellipse cx={86} cy={0} rx={22} ry={28} fill={ink} />
            <circle cx={94} cy={-10} r={8} fill="#FFFFFF" />
            <circle cx={86} cy={0} r={60} fill="#F6D27A" fillOpacity={0.18} stroke="#E2B54A" strokeWidth={16} />
            <circle cx={86} cy={0} r={60} fill="none" stroke={ink} strokeWidth={5} />
            <circle cx={86} cy={0} r={69} fill="none" stroke={ink} strokeWidth={4} />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
              <line key={a} x1={86 + Math.cos((a * Math.PI) / 180) * 61} y1={Math.sin((a * Math.PI) / 180) * 61} x2={86 + Math.cos((a * Math.PI) / 180) * 67} y2={Math.sin((a * Math.PI) / 180) * 67} stroke="#B8902E" strokeWidth={3} />
            ))}
            <path d="M 140 40 Q 170 130 150 210" stroke="#E2B54A" strokeWidth={6} fill="none" strokeDasharray="4 8" strokeLinecap="round" />
            {/* 腮红 */}
            <ellipse cx={-118} cy={70} rx={30} ry={18} fill="#E8826C" opacity={0.55} />
            <ellipse cx={134} cy={84} rx={26} ry={16} fill="#E8826C" opacity={0.55} />
            {/* 咧嘴大笑 */}
            <path d="M -86 82 Q 0 96 92 78 Q 70 186 0 188 Q -72 186 -86 82 Z" fill="#7A2E22" stroke={ink} strokeWidth={9} strokeLinejoin="round" />
            <path d="M -74 88 Q 0 102 80 86 L 76 108 Q 0 120 -72 110 Z" fill="#FFFFFF" />
            <path d="M -40 168 Q 0 136 44 166 Q 0 190 -40 168 Z" fill="#E36B5A" />
            {/* 鼻子 */}
            <path d="M -6 20 Q -22 56 2 64" stroke={ink} strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
          {/* 看得见的手：右下角挥手，红袖口 + 动感线 */}
          <g transform="translate(612 646) rotate(-10) scale(0.68)">
            <rect x={-62} y={40} width={124} height={70} rx={16} fill={NAVY.red} stroke={ink} strokeWidth={8} />
            <path d="M -58 10 Q -116 -20 -122 -66 Q -124 -94 -98 -88 Q -78 -60 -52 -40 Z" fill={skin} stroke={ink} strokeWidth={8} strokeLinejoin="round" />
            <path d="M -66 52 Q -86 -20 -60 -62 L -60 -132 Q -60 -158 -38 -158 Q -16 -158 -16 -132 L -16 -168 Q -16 -194 6 -194 Q 28 -194 28 -168 L 28 -150 Q 28 -176 50 -176 Q 72 -176 72 -150 L 72 -96 Q 74 -122 94 -120 Q 116 -118 112 -88 L 100 -10 Q 90 40 62 52 Z" fill={skin} stroke={ink} strokeWidth={8} strokeLinejoin="round" />
            <path d="M -16 -132 L -16 -60 M 28 -150 L 28 -60 M 72 -96 L 72 -50" stroke={ink} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
            <path d="M 136 -150 q 24 34 12 70 M 166 -122 q 16 26 6 52" stroke={NAVY.cream} strokeWidth={11} fill="none" strokeLinecap="round" />
          </g>
        </g>
        <circle cx={400} cy={400} r={360} fill="none" stroke={NAVY.red} strokeWidth={22} />
        <circle cx={400} cy={400} r={336} fill="none" stroke={NAVY.red} strokeWidth={4} />
      </svg>
    </AbsoluteFill>
  );
};

/** 头像 v1（米黄底 + 全身斯密），2026-10-18 换成 v2 后留档 */
export const AvatarV1: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <svg width={800} height={800} style={{ position: "absolute", inset: 0 }}>
      <circle cx={400} cy={400} r={372} fill="none" stroke={C.red} strokeWidth={14} />
      <circle cx={400} cy={400} r={350} fill="none" stroke={C.red} strokeWidth={3} />
      <g transform="translate(-140 -330)">
        <Person x={540} y={1250} s={2.35} hat="wig" shirt={C.navy} mood="smile" seed={1} armR={[118, 18]} />
      </g>
    </svg>
  </AbsoluteFill>
);

/**
 * 合集封面 1080×1440（3:4）。关键内容全部放在中间的正方形 y 180–1260 里，
 * 平台按 1:1 裁切也完整（同时导出 Collection11）。中间一本《国富论》，两侧是前六集的“信物”。
 */
const EP_ICONS: { n: string; t: string; x: number; y: number; icon: React.ReactNode }[] = [
  { n: "01", t: "分工", x: 175, y: 676, icon: <g transform="translate(-10 -40)">{[-24, 0, 24].map((d) => <Pin key={d} x={d} y={-34} len={88} rot={d * 0.6} color={C.steel} w={6} />)}</g> },
  { n: "02", t: "交换", x: 175, y: 884, icon: <g transform="translate(0 -6)"><Bread s={1.7} /></g> },
  { n: "03", t: "市场", x: 175, y: 1092, icon: <Cat x={0} y={18} s={0.62} /> },
  { n: "04", t: "货币", x: 905, y: 676, icon: <g transform="translate(0 -28)"><BigCoin s={0.5} face="币" /></g> },
  { n: "05", t: "真实价格", x: 905, y: 884, icon: <Payslip x={0} y={-28} s={0.26} year="" amount="¥8,000" up /> },
  { n: "06", t: "价格三分", x: 905, y: 1092, icon: <g transform="translate(0 30)"><MilkTea s={0.3} split={1} price="" /></g> },
];

export const CollectionCover: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <Halftone color={C.red} o={0.17} at="94% 8%" reach={46} />
    <Halftone color={C.navy} o={0.12} at="4% 96%" reach={42} size={12} />
    <RegMark x={60} y={60} /><RegMark x={1020} y={1380} />
    <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 26, color: C.mute, letterSpacing: "0.16em" }}>
      AN INQUIRY INTO THE WEALTH OF NATIONS
    </div>
    {/* 正方形安全区：y 180–1260 */}
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, fontFamily: SERIF }}>
      <div style={{ background: C.red, color: C.paper, fontWeight: 900, fontSize: 36, padding: "6px 16px", borderRadius: 4 }}>合集 · 连载中</div>
      <div style={{ fontWeight: 600, fontSize: 36, color: C.ink2 }}>按原著章节 · 一集一个道理</div>
    </div>
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, color: C.ink, lineHeight: 1.08, textShadow: "6px 6px 0 rgba(185,65,44,.22)" }}>
      <div style={{ fontSize: 100, letterSpacing: "0.12em" }}>一口气读懂</div>
      <div style={{ fontSize: 158, color: C.red }}>《国富论》</div>
    </div>
    {/* 书 */}
    <div style={{ position: "absolute", left: 375, top: 640, width: 330, height: 450, perspective: 1600 }}>
      <div style={{
        width: "100%", height: "100%", background: "linear-gradient(135deg,#7A2C24,#5A1E19)", borderRadius: "6px 16px 16px 6px",
        boxShadow: "0 30px 56px rgba(40,20,10,.34), inset 12px 0 0 rgba(0,0,0,.18)", rotate: "y -14deg", transformOrigin: "0% 50%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "#E9C98B",
        fontFamily: SERIF, fontWeight: 900, outline: "3px solid #C9A25E", outlineOffset: -18,
      }}>
        <div style={{ fontSize: 19, letterSpacing: "0.18em", fontWeight: 600 }}>AN INQUIRY INTO</div>
        <div style={{ fontSize: 31, textAlign: "center", lineHeight: 1.1 }}>THE WEALTH<br />OF NATIONS</div>
        <div style={{ width: 100, height: 2, background: "#C9A25E" }} />
        <div style={{ fontSize: 82 }}>国富论</div>
        <div style={{ fontSize: 30, fontWeight: 600 }}>1776</div>
      </div>
    </div>
    <svg width={1080} height={1440} style={{ position: "absolute", inset: 0 }}>
      {/* 书和每一集之间的引线 */}
      {EP_ICONS.map((e) => (
        <path key={e.n} d={`M ${e.x < 540 ? e.x + 78 : e.x - 78} ${e.y} L ${e.x < 540 ? 372 : 708} ${e.y * 0.55 + 865 * 0.45}`} stroke={C.ink2} strokeWidth={2.5} strokeDasharray="7 7" opacity={0.55} />
      ))}
      {EP_ICONS.map((e) => (
        <g key={e.n} transform={`translate(${e.x} ${e.y})`}>
          <circle r={74} fill="#FBF7EF" stroke={C.ink} strokeWidth={4} />
          <circle r={65} fill="none" stroke={C.ink} strokeOpacity={0.15} strokeWidth={2} />
          <g transform="translate(0 6) scale(0.8)">{e.icon}</g>
          <g transform="translate(-58 -56)">
            <circle r={26} fill={C.red} />
            <text y={10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={28} fill={C.paper}>{e.n}</text>
          </g>
          <text y={108} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={28} fill={C.ink2}>{e.t}</text>
        </g>
      ))}
    </svg>
    <Seal x={540} y={1200} text="看得见的手" size={48} rot={-3} />
    {/* 正方形以外：装饰信息 */}
    <div style={{ position: "absolute", top: 1300, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: C.ink2, letterSpacing: "0.04em" }}>
      250 年前的书，讲的是你今天的钱包
    </div>
  </AbsoluteFill>
);

/**
 * 主页背景图 v2（2026-10-18）1125×633：账号定位从“讲《国富论》”放宽到“经济学经典 + 你身边的钱”。
 * 不用米黄纸色，改藏青底；和头像对色：头像的藏青（斯密的衣服）做底、朱红双圆环、米白做字。
 * 关键内容放在 y 90–470：抖音主页下方会被头像和资料卡盖住一部分。
 */
const NAVY = { bg: "#1D2A40", bg2: "#131C2C", line: "rgba(241,234,219,0.06)", cream: "#F1EADB", red: "#D0533B" };
const ORBIT: { a: number; el: React.ReactNode }[] = [
  { a: -150, el: <g transform="translate(0 30)"><House x={0} y={0} s={0.36} /></g> },
  { a: -100, el: <g transform="translate(0 12)"><Bar metal="gold" s={0.62} /></g> },
  { a: -40, el: <Payslip x={0} y={0} s={0.13} year="" amount="¥8,000" up /> },
  { a: 20, el: <BigCoin s={0.3} face="¥" /> },
  { a: 155, el: <g transform="translate(0 30)"><MilkTea s={0.17} split={1} price="" /></g> },
];

export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 110% at 70% 40%, ${NAVY.bg} 0%, ${NAVY.bg2} 100%)` }}>
    {/* 坐标纸细格 + 网点：经济学图表的味道 */}
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${NAVY.line} 1px, transparent 1px), linear-gradient(90deg, ${NAVY.line} 1px, transparent 1px)`, backgroundSize: "45px 45px" }} />
    <Halftone color={NAVY.cream} o={0.1} at="96% 8%" reach={40} size={14} />
    <Halftone color={NAVY.red} o={0.16} at="2% 98%" reach={38} size={12} />
    <svg width={1125} height={633} style={{ position: "absolute", inset: 0 }}>
      {/* 背后一条起伏的走势线 */}
      <path d="M 0 520 C 120 500, 180 430, 280 450 S 430 540, 520 470 S 640 330, 720 360" stroke={NAVY.red} strokeOpacity={0.35} strokeWidth={4} fill="none" />
      {/* 和头像同款的朱红双圆环，里面是挥手的斯密 */}
      <g transform="translate(860 300)">
        <defs><clipPath id="bannerRing"><circle r={150} /></clipPath></defs>
        <circle r={150} fill={NAVY.cream} />
        <g clipPath="url(#bannerRing)">
          <Person x={-4} y={250} s={1.02} hat="wig" shirt={C.navy} mood="smile" seed={1} armR={[118, 18]} />
        </g>
        <circle r={168} fill="none" stroke={NAVY.red} strokeWidth={9} />
        <circle r={156} fill="none" stroke={NAVY.red} strokeWidth={2.5} />
        {/* 环外绕着几样“身边的钱”：房、金、工资、钱、奶茶 */}
        {ORBIT.map((o, i) => {
          const r = 222, x = Math.cos((o.a * Math.PI) / 180) * r, y = Math.sin((o.a * Math.PI) / 180) * r;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r={40} fill={NAVY.cream} stroke={NAVY.bg2} strokeWidth={3} />
              <g transform="translate(0 4)">{o.el}</g>
            </g>
          );
        })}
      </g>
    </svg>
    <div style={{ position: "absolute", left: 80, top: 96, fontFamily: SERIF, color: NAVY.cream }}>
      <div style={{ display: "inline-block", background: NAVY.red, color: NAVY.cream, fontWeight: 900, fontSize: 28, padding: "4px 14px", borderRadius: 4, letterSpacing: "0.08em" }}>看得见的手</div>
      <div style={{ marginTop: 20, fontWeight: 900, fontSize: 86, lineHeight: 1.14, textShadow: "5px 5px 0 rgba(208,83,59,.35)" }}>
        把经济学，<br />
        <span style={{ color: NAVY.red }}>画</span>给你看
      </div>
      <div style={{ marginTop: 22, fontWeight: 600, fontSize: 30, letterSpacing: "0.04em", opacity: 0.85 }}>读经济学经典，看懂你身边的钱</div>
      <div style={{ marginTop: 18, display: "flex", gap: 12, fontFamily: SERIF, fontWeight: 900, fontSize: 24 }}>
        {["工资", "房租", "金价", "物价"].map((t) => (
          <span key={t} style={{ border: `2px solid ${NAVY.cream}55`, color: NAVY.cream, padding: "3px 14px", borderRadius: 999 }}>{t}</span>
        ))}
        <span style={{ color: NAVY.red, padding: "5px 4px" }}>正在连载 ·《国富论》</span>
      </div>
    </div>
  </AbsoluteFill>
);

/** 主页背景图 v1（米黄纸 + 角色群像），2026-10-18 换成 v2 后留档 */
export const BannerV1: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <div style={{ position: "absolute", left: 90, top: 150, fontFamily: SERIF, color: C.ink }}>
      <div style={{ fontWeight: 900, fontSize: 84, lineHeight: 1.2 }}>
        把经济学，<br />
        <span style={{ color: C.red }}>画</span>给你看
      </div>
      <div style={{ marginTop: 26, fontWeight: 600, fontSize: 32, color: C.ink2, letterSpacing: "0.06em" }}>《国富论》连载中 · 每周更新</div>
    </div>
    <Seal x={930} y={150} text="看得见的手" size={44} rot={-6} />
    <svg width={1125} height={633} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(560 0)">
        <Person x={60} y={590} s={0.95} hat="wig" shirt={C.navy} mood="smile" seed={1} armR={[110, 20]} />
        <Person x={210} y={590} s={0.72} hat="cap" apron shirt={C.ochre} mood="happy" seed={2} armR={[50, 60]} holdR={<Hammer />} />
        <Person x={320} y={590} s={0.66} hat="kerchief" shirt={C.red} mood="smile" seed={3} armR={[30, 40]} />
        <Person x={420} y={590} s={0.6} hat="none" shirt={C.sage} mood="wow" seed={4} />
      </g>
    </svg>
  </AbsoluteFill>
);
