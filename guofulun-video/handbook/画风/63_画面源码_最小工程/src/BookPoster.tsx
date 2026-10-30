// 统一封面模板（EP06 起）：《国富论》这本书做海报主视觉 + 第几集 + 本集标题。
// 每集只换：集数、标题、章节、腰封上的一句话、书脚边的一个小道具。所有内容都在 y 240–1680（抖音 3:4 裁切）。
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, Halftone, Paper, RegMark, SERIF } from "./kit";
import { Avatar } from "./Brand";

const GOLD = "#E9C98B";
const goldText: React.CSSProperties = {
  background: "linear-gradient(180deg,#F6DFA8 0%,#D9AE62 55%,#B98A3E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
};

/** 立体的《国富论》：正面 + 书脊 + 腰封；ep 印在腰封上 */
export const Book3D: React.FC<{ x: number; y: number; w?: number; h?: number; d?: number; ep?: number | string; obi?: string; rot?: number; s?: number }> = ({ x, y, w = 520, h = 700, d = 74, ep, obi, rot = 24, s = 1 }) => {
  const obiTop = h * 0.64, obiH = h * 0.24;
  const obiFace = (width: number, children?: React.ReactNode) => (
    <div style={{ position: "absolute", left: 0, top: obiTop, width, height: obiH, background: "linear-gradient(180deg,#F7EFDD,#EADDC3)", boxShadow: "inset 0 3px 0 rgba(0,0,0,.08), inset 0 -3px 0 rgba(0,0,0,.08)" }}>{children}</div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 2400, transform: `scale(${s})`, transformOrigin: "0 0" }}>
      {/* 落地阴影 */}
      <div style={{ position: "absolute", left: -30, right: -60, bottom: -46, height: 70, borderRadius: "50%", background: "rgba(40,22,10,.30)", filter: "blur(18px)" }} />
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${rot}deg) rotateX(4deg)` }}>
        {/* 书脊 */}
        <div style={{
          position: "absolute", left: -d / 2, top: 0, width: d, height: h, transform: `rotateY(-90deg) translateZ(${d / 2}px)`,
          background: "linear-gradient(90deg,#3E1310,#5E1D18 45%,#42150F)", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 70,
        }}>
          {[0, 1].map((i) => <div key={i} style={{ width: d - 18, height: 3, background: GOLD, opacity: 0.8 }} />)}
          <div style={{ writingMode: "vertical-rl", fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: "0.2em", ...goldText }}>国富论</div>
          {obiFace(d)}
        </div>
        {/* 正面 */}
        <div style={{
          position: "absolute", inset: 0, transform: `translateZ(${d / 2}px)`, borderRadius: "4px 14px 14px 4px", overflow: "hidden",
          background: "radial-gradient(120% 90% at 35% 25%,#8A3329 0%,#6A231C 50%,#4E1914 100%)",
          boxShadow: "inset 10px 0 0 rgba(0,0,0,.22), inset -2px 0 0 rgba(255,255,255,.08)",
        }}>
          <div style={{ position: "absolute", inset: 22, border: `3px solid ${GOLD}`, opacity: 0.85 }} />
          <div style={{ position: "absolute", inset: 32, border: `1px solid ${GOLD}`, opacity: 0.5 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 74, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: SERIF, color: GOLD }}>
            <div style={{ fontSize: 17, letterSpacing: "0.2em", fontWeight: 600, opacity: 0.9, textAlign: "center", lineHeight: 1.5 }}>AN INQUIRY INTO THE NATURE<br />AND CAUSES OF</div>
            <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.08, marginTop: 10, ...goldText }}>THE WEALTH<br />OF NATIONS</div>
            <div style={{ width: 150, height: 2, background: GOLD, margin: "18px 0 6px", opacity: 0.8 }} />
            <div style={{ fontSize: 118, fontWeight: 900, lineHeight: 1.15, ...goldText }}>国富论</div>
            <div style={{ fontSize: 22, letterSpacing: "0.24em", fontWeight: 600, marginTop: 2 }}>ADAM SMITH · 1776</div>
          </div>
          {/* 腰封 */}
          {obiFace(w, (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: SERIF }}>
              {ep !== undefined && (
                <div style={{ background: C.red, color: C.paper, fontWeight: 900, fontSize: 34, padding: "4px 22px", borderRadius: 4, letterSpacing: "0.08em" }}>
                  {typeof ep === "string" ? ep : `第 ${String(ep).padStart(2, "0")} 集`}
                </div>
              )}
              {obi && <div style={{ fontWeight: 900, fontSize: 38, color: C.ink, letterSpacing: "0.02em" }}>{obi}</div>}
            </div>
          ))}
          {/* 封面光泽 */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,0) 38%,rgba(0,0,0,0) 70%,rgba(0,0,0,.18) 100%)" }} />
        </div>
      </div>
    </div>
  );
};

/** 账号头像（圆形，复用 Brand.tsx 的 Avatar） */
const AvatarDot: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, boxShadow: `0 0 0 4px ${C.paper}, 0 0 0 7px ${C.red}, 0 8px 18px rgba(40,22,10,.25)` }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 800, transform: `scale(${size / 800})`, transformOrigin: "0 0" }}><Avatar /></div>
  </div>
);

/** 账号名片：头像 + 账号名 + 一句定位 */
const AccountCard: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.2, fontFamily: SERIF }}>
    <AvatarDot size={size} />
    <div style={{ lineHeight: 1.15 }}>
      <div style={{ fontWeight: 900, fontSize: size * 0.42, color: C.ink, letterSpacing: "0.04em" }}>看得见的手</div>
      <div style={{ fontWeight: 600, fontSize: size * 0.27, color: C.ink2, marginTop: 4 }}>把经济学，画给你看</div>
    </div>
  </div>
);

/** 合集条：合集名 + 更新节奏 */
const SeriesStrip: React.FC<{ size?: number; short?: boolean }> = ({ size = 28, short }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: SERIF, fontSize: size, color: C.ink2 }}>
    <span style={{ background: C.red, color: C.paper, fontWeight: 900, padding: "3px 12px", borderRadius: 4 }}>合集</span>
    <span style={{ fontWeight: 900, color: C.ink }}>一口气读懂《国富论》</span>
    {!short && <span style={{ fontWeight: 600 }}>· 按原著章节连载</span>}
  </div>
);

/** 描边大号集数（2026-10-25 用户要求全改中文：原来的“EPISODE”“BOOK I” → “第 16 集”“第一篇 总结”） */
const EpNo: React.FC<{ ep: number | string; size: number }> = ({ ep, size }) => {
  const sum = typeof ep === "string";
  const book = sum ? (ep.match(/第.篇/)?.[0] ?? ep) : "";
  const small: React.CSSProperties = { fontSize: size * 0.3, color: C.red, marginBottom: size * 0.1 };
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: size * 0.05, fontFamily: SERIF, fontWeight: 900, lineHeight: 0.86, whiteSpace: "nowrap" }}>
      {!sum && <div style={small}>第</div>}
      {/* 汉字笔画密，描边字在这个字号会糊成一团：汇总集的“第一篇”用实心红字 */}
      <div style={sum ? { fontSize: size * 0.56, color: C.red, letterSpacing: "0.04em" } : { fontSize: size, color: "transparent", WebkitTextStroke: `${Math.max(3, size / 60)}px ${C.red}`, letterSpacing: "-0.02em" }}>{sum ? book : String(ep).padStart(2, "0")}</div>
      <div style={small}>{sum ? "总结" : "集"}</div>
    </div>
  );
};

/** 封面边角“藏”的角色（v16 起，10-25 用户要求：小猫小狗 + 本集角色从书后、画边探出来点缀）：back 画在书后面，front 画在最上层 */
type Peek = { back?: React.ReactNode; front?: React.ReactNode };
type PosterProps = { ep: number | string; // 字符串 = 汇总集（腰封印这串字，右上印“第一篇 总结”）
  title: React.ReactNode[]; chapter: string; obi: string; motif?: React.ReactNode; peek?: Peek; peekWide?: Peek;
  /** "question"（EP20 起试做，10-28 用户定）：问题上移到集数下面，书缩小放左下当系列标识，右下画本集场景（motif 原点在 (700,1310)）；不填 = 原来的书海报 */
  layout?: "book" | "question";
  /** 书的大小。question 版式：默认 0.58（EP19、EP20 已出片的样子）；10-29 用户“书本再大一点点”，EP21 起传 0.64。
   *  书海报版式（不填 layout）：默认 0.98；传小一点书仍然居中（10-30 用户：EP23 封面换回书居中、标题在下，书再缩小一点） */
  bookS?: number;
  /** 标题字号：不填 = 竖屏 question 版 112、横屏 72；问题一行超过 9 个字时传小一号（EP21 第四版“银行存款利息越来越低，”11 个字传 90） */
  titleSize?: number };

/**
 * 单集封面（竖屏 9:16，3:4 裁切安全区 y 240–1680）：书约占画面宽度一半（2026-10-23 用户反馈书太大挤占标题，从 60% 缩回），标题放大到 104 号。
 * 顶部：账号名片（头像 + 账号名 + 定位）和描边集数；中间：立体书 + 腰封；下方：两行标题、章节名、合集条。
 * title 每一项是一行，可以用 <span style={{ color: C.red }}> 标重点；motif 画在书右下角（SVG，原点在道具底部中心）。
 */
export const BookPoster: React.FC<PosterProps> = (p) => (p.layout === "question" ? <QuestionPoster {...p} /> : <BookFirstPoster {...p} />);

/**
 * 问题在上的版式（10-28 用户：封面要改，但不要完全照外部意见——书缩小、问题上移，取个平衡）：
 * 顶部账号名片 + 描边集数照旧；下面就是两行问题（112 号）；书缩到约 0.58 倍放左下当系列标识（腰封只印 obi 小字，集数只在右上出现一次）；
 * 右下画本集的矛盾场景（motif 原点 (700,1310)）；章节名、合集条照旧。所有内容仍在 y 240–1680。
 * 10-29 起（EP21 之后）：书传 bookS={0.64}；右下场景里可以放一个有表情的本集角色（身高约 240px + 一个 Emote，放在 peek.front 里），占比要小。
 */
const QuestionPoster: React.FC<PosterProps> = ({ ep, title, chapter, obi, motif, peek, bookS = 0.58, titleSize = 112 }) => (
  <AbsoluteFill>
    <Paper />
    <Halftone color={C.red} o={0.16} at="92% 20%" reach={48} />
    <Halftone color={C.navy} o={0.12} at="6% 90%" reach={42} size={12} />
    <RegMark x={1010} y={1650} />
    <div style={{ position: "absolute", top: 262, left: 64 }}><AccountCard size={96} /></div>
    <div style={{ position: "absolute", top: 250, right: 56 }}><EpNo ep={ep} size={150} /></div>
    <div style={{ position: "absolute", top: 450, left: 30, right: 30, textAlign: "center", fontFamily: SERIF, fontWeight: 900, color: C.ink, lineHeight: 1.16, textShadow: "5px 5px 0 rgba(185,65,44,.22)" }}>
      {title.map((t, i) => <div key={i} style={{ fontSize: titleSize, whiteSpace: "nowrap" }}>{t}</div>)}
    </div>
    {peek?.back}
    {/* 书放大时稍往左上挪：0.64 时书在 x 58–391、y 836–1284，和章节名（1430）之间仍有空 */}
    <Book3D x={70 - (bookS - 0.58) * 200} y={860 - (bookS - 0.58) * 400} s={bookS} obi={obi} />
    {motif && (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(700 1310)">{motif}</g>
      </svg>
    )}
    <div style={{ position: "absolute", top: 1430, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, fontFamily: SERIF, fontWeight: 600, fontSize: 32, color: C.ink2 }}>
      <div style={{ width: 60, height: 2, background: C.ink2, opacity: 0.5 }} />
      {chapter}
      <div style={{ width: 60, height: 2, background: C.ink2, opacity: 0.5 }} />
    </div>
    <div style={{ position: "absolute", top: 1520, left: 0, right: 0, display: "flex", justifyContent: "center" }}><SeriesStrip size={30} /></div>
    {peek?.front}
  </AbsoluteFill>
);

const BookFirstPoster: React.FC<PosterProps> = ({ ep, title, chapter, obi, motif, peek, bookS = 0.98 }) => (
  <AbsoluteFill>
    <Paper />
    <Halftone color={C.red} o={0.16} at="92% 20%" reach={48} />
    <Halftone color={C.navy} o={0.12} at="6% 90%" reach={42} size={12} />
    <RegMark x={1010} y={1650} />
    <div style={{ position: "absolute", top: 262, left: 64 }}><AccountCard size={96} /></div>
    <div style={{ position: "absolute", top: 250, right: 56 }}><EpNo ep={ep} size={150} /></div>
    {peek?.back}
    {/* 书的中心固定在 (545, 753)：bookS 变小时书仍然居中，上下也居中在标题上面那块 */}
    <Book3D x={545 - 260 * bookS} y={753 - 350 * bookS} ep={ep} obi={obi} s={bookS} />
    {motif && (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(880 1100) scale(1.0)">{motif}</g>
      </svg>
    )}
    <div style={{ position: "absolute", top: 1150, left: 40, right: 40, textAlign: "center", fontFamily: SERIF, fontWeight: 900, color: C.ink, lineHeight: 1.14, textShadow: "5px 5px 0 rgba(185,65,44,.22)" }}>
      {title.map((t, i) => <div key={i} style={{ fontSize: 104 }}>{t}</div>)}
    </div>
    <div style={{ position: "absolute", top: 1430, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, fontFamily: SERIF, fontWeight: 600, fontSize: 32, color: C.ink2 }}>
      <div style={{ width: 60, height: 2, background: C.ink2, opacity: 0.5 }} />
      {chapter}
      <div style={{ width: 60, height: 2, background: C.ink2, opacity: 0.5 }} />
    </div>
    <div style={{ position: "absolute", top: 1520, left: 0, right: 0, display: "flex", justifyContent: "center" }}><SeriesStrip size={30} /></div>
    {peek?.front}
  </AbsoluteFill>
);

/**
 * 横屏封面 1440×1080（4:3，抖音横屏作品的封面比例）：左边一本大书，右边账号名片、集数、标题、章节名、腰封语、合集条。
 * 右栏只有 x 790–1380 这 590px 宽：标题字号 72、不换行，每行不超过 8 个字，章节名不加装饰线，合集条用短版。参数和竖屏版完全一样。
 */
export const BookPosterWide: React.FC<PosterProps> = ({ ep, title, chapter, obi, motif, peekWide, titleSize = 72 }) => (
  <AbsoluteFill>
    <Paper />
    <Halftone color={C.red} o={0.16} at="95% 10%" reach={42} />
    <Halftone color={C.navy} o={0.12} at="4% 95%" reach={38} size={12} />
    <RegMark x={50} y={50} /><RegMark x={1390} y={1030} />
    {peekWide?.back}
    <Book3D x={130} y={150} ep={ep} obi={obi} s={1.04} />
    {motif && (
      <svg width={1440} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(712 930) scale(1.02)">{motif}</g>
      </svg>
    )}
    <div style={{ position: "absolute", left: 790, top: 84 }}><AccountCard size={88} /></div>
    <div style={{ position: "absolute", right: 60, top: 64 }}><EpNo ep={ep} size={124} /></div>
    <div style={{ position: "absolute", left: 790, right: 50, top: 330, fontFamily: SERIF, fontWeight: 900, color: C.ink, lineHeight: 1.14, textShadow: "4px 4px 0 rgba(185,65,44,.22)" }}>
      {title.map((t, i) => <div key={i} style={{ fontSize: titleSize, whiteSpace: "nowrap" }}>{t}</div>)}
    </div>
    <div style={{ position: "absolute", left: 790, right: 50, top: 560, fontFamily: SERIF, fontWeight: 600, fontSize: 28, color: C.ink2 }}>{chapter}</div>
    <div style={{ position: "absolute", left: 790, right: 50, top: 630, fontFamily: SERIF, fontWeight: 900, fontSize: 36, color: C.red }}>{obi}</div>
    <div style={{ position: "absolute", left: 790, top: 975 }}><SeriesStrip size={26} short /></div>
    {peekWide?.front}
  </AbsoluteFill>
);