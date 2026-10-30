import React from "react";
import { C } from "../kit";
import { BookPoster, BookPosterWide } from "../BookPoster";
import { Coat } from "./world";

/** 封面：统一书海报模板；书脚放那件外套（串场道具） */
const P = {
  ep: "第一篇汇总",
  title: [<>一件外套背后，</>, <>有<span style={{ color: C.red }}>多少人</span>在干活？</>],
  chapter: "第一篇汇总 · 第1–11章",
  obi: "答案分三步讲完",
  motif: <g transform="translate(20 60) scale(0.7)"><Coat /></g>,
};

export const Cover: React.FC = () => <BookPoster {...P} />;
export const CoverWide: React.FC = () => <BookPosterWide {...P} />;
