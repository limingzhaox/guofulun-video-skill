import React from "react";
import { BookPoster, BookPosterWide } from "../BookPoster";
import { CrayonDefs } from "../cast/crayon";
import { Emote, Sprite } from "../v16/Sprite";
import { Farm, GREEN, IcoSack, Town } from "./world";

/**
 * 封面：“问题在上”版式，照 10-29 ★★★★ 第 8 条——书放大到 0.64；右下场景里放开头那个角色（农夫，约 240px + 一个感叹号），占比小。
 * 两行 = 片子开头那个问题（两行合起来主谓齐全）：“城里人和乡下人，到底谁养活谁？”
 * 腰封只吊一个悬念，不给答案；右下画本集的矛盾：左边一片田和粮袋，右边一个镇子。彩蛋只藏一只长毛猫、一只金币狗。
 */
const P = {
  ep: 23,
  title: [<>城里人和<span style={{ color: "#E8604C" }}>乡下人</span>，</>, <>到底<span style={{ color: GREEN }}>谁养活谁</span>？</>],
  chapter: "第三篇 第1章 · 财富的自然进步",
  obi: "城里一粒粮也不长",
  motif: (
    <g>
      <CrayonDefs />
      <g transform="translate(-210 0)"><Farm w={200} lush={0.8} /></g>
      <g transform="translate(-210 -120) scale(0.9)"><IcoSack /></g>
      <g transform="translate(200 0) scale(0.45)"><Town n={4} /></g>
    </g>
  ),
  peek: {
    front: (
      <>
        <Sprite id="cat" view="front" x={250} y={854} h={72} seed={9} shadow={false} />
        <Sprite id="dog" view="front" x={130} y={1330} h={84} seed={13} shadow={false} />
        {/* 开头那个角色：农夫，不服气 */}
        <Sprite id="folk_farmer" view="front" x={690} y={1340} h={240} seed={61} shadow={false} />
        <Emote x={760} y={1090} kind="!" at={-20} dur={100000} s={0.8} />
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

export const Cover: React.FC = () => <BookPoster {...P} layout="question" bookS={0.64} />;
export const CoverWide: React.FC = () => <BookPosterWide {...P} />;
