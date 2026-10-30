import React from "react";
import { Episode } from "../Episode";
import type { Timeline } from "../kit";
import { Avatar16 } from "../v16/Sprite";
import timeline from "./timeline.json";
import { SHook, SMenu, SPoor } from "./scenesA";
import { SFree } from "./scenesB";
import { SCta, SEnding, SRich } from "./scenesC";
import { PartBar, PARTS, TOPS } from "./world";

export const TL25 = timeline as Timeline;

const SCENES: Record<string, React.FC> = { hook: SHook, menu: SMenu, poor: SPoor, free: SFree, rich: SRich, ending: SEnding, cta: SCta };

/** 字幕里的名字 → v16 角色（小头像从正面图裁脸）；地主由银行家演大领主 */
const WHO: Record<string, string> = { 小满: "xiaoman3", 小雪: "female2", 农夫: "folk_farmer", 地主: "folk_banker", 阿禾: "ahe" };

const sc = (id: string) => TL25.scenes.find((s) => s.id === id)!;
const line = (id: string, i: number) => TL25.lines.filter((l) => l.scene === id)[i].from;
const lastLine = (id: string) => { const ls = TL25.lines.filter((l) => l.scene === id); return ls[ls.length - 1].from; };

/** 三问那句起顶部挂三格进度（同一个问题的三步）；10-31 用户：页眉和三格往上靠（TOPS） */
const BAR = (
  <PartBar
    parts={PARTS}
    from={line("menu", 1)}
    to={sc("cta").from}
    ticks={[lastLine("poor"), lastLine("free"), lastLine("rich")]}
    spans={[[sc("poor").from, sc("free").from], [sc("free").from, sc("rich").from], [sc("rich").from, sc("ending").from]]}
    top={TOPS.bar}
  />
);

export const EP25: React.FC = () => (
  <Episode tl={TL25} scenes={SCENES} progressAt="none" mix="v3" cold look="paper" overlay={BAR} headerY={TOPS.header} badge={(who) => (WHO[who] ? <Avatar16 id={WHO[who]} /> : null)} />
);
