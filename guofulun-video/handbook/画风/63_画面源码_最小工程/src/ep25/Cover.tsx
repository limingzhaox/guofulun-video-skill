import React from "react";
import { BookPoster, BookPosterWide } from "../BookPoster";
import { CrayonDefs } from "../cast/crayon";
import { Sprite } from "../v16/Sprite";
import { CityWall, GREEN, Purse } from "./world";

/**
 * 封面：10-30 起的书海报版式（CLAUDE.md ★★★★★ 第 3 条）——书居中、bookS 0.8，两行标题在书下面，封面不放本集角色。
 * 两行 = 本集的问题（两行合起来主谓齐全）：“几百年前的农奴，/为何要把钱带进城？”
 * 腰封吊一个书里的说法，不给答案；书脚右边画本集的城门和钱袋。彩蛋只藏一只长毛猫、一只金币狗。
 */
const P = {
  ep: 25,
  title: [<>几百年前的<span style={{ color: "#E8604C" }}>农奴</span>，</>, <>为何要把<span style={{ color: GREEN }}>钱带进城</span>？</>],
  chapter: "第三篇 第3章 · 城市怎样兴起",
  obi: "躲过老爷一年，就永远自由",
  motif: (
    <g>
      <CrayonDefs />
      <g transform="translate(40 0) scale(0.3)"><CityWall gate={0.8} flag={1} /></g>
      <g transform="translate(-90 0) scale(0.8)"><Purse full={1} /></g>
    </g>
  ),
  peek: {
    front: (
      <>
        <Sprite id="cat" view="front" x={620} y={478} h={72} seed={9} shadow={false} />
        <Sprite id="dog" view="front" x={300} y={1078} h={84} seed={13} shadow={false} />
      </>
    ),
  },
  peekWide: {
    front: (
      <>
        <Sprite id="cat" view="front" x={560} y={156} h={64} seed={9} shadow={false} />
        <Sprite id="dog" view="front" x={560} y={968} h={74} seed={13} shadow={false} />
      </>
    ),
  },
};

/** 横屏：版式不变；道具放在书脚右边，不压腰封 */
const motifWide = (
  <g>
    <CrayonDefs />
    <g transform="translate(150 0) scale(0.42)"><CityWall gate={0.8} flag={1} /></g>
    <g transform="translate(380 0)"><Purse full={1} /></g>
  </g>
);

export const Cover: React.FC = () => <BookPoster {...P} bookS={0.8} />;
export const CoverWide: React.FC = () => <BookPosterWide {...P} motif={motifWide} titleSize={62} />;
