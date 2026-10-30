import React from "react";
import { Episode } from "../Episode";
import type { Timeline } from "../kit";
import { Avatar16 } from "../v16/Sprite";
import timeline from "./timeline.json";
import { SHook, SMenu, STrade } from "./scenesA";
import { SGrow, SLand } from "./scenesB";
import { SCta, SEnding } from "./scenesC";
import { PartBar, PARTS } from "./world";

export const TL23 = timeline as Timeline;

const SCENES: Record<string, React.FC> = { hook: SHook, menu: SMenu, trade: STrade, grow: SGrow, land: SLand, ending: SEnding, cta: SCta };

/** 字幕里的名字 → v16 角色（小头像从正面图裁脸） */
const WHO: Record<string, string> = { 小满: "xiaoman3", 小雪: "female2", 农夫: "folk_farmer", 阿禾: "ahe" };

const sc = (id: string) => TL23.scenes.find((s) => s.id === id)!;
const line = (id: string, i: number) => TL23.lines.filter((l) => l.scene === id)[i].from;
const lastLine = (id: string) => { const ls = TL23.lines.filter((l) => l.scene === id); return ls[ls.length - 1].from; };

/** 三问那句起顶部挂三格进度（同一个问题的三步），格子里从左往右涂色，结论一出来就打勾 */
const BAR = (
  <PartBar
    parts={PARTS}
    from={line("menu", 1)}
    to={sc("cta").from}
    ticks={[lastLine("trade"), lastLine("grow"), lastLine("land")]}
    spans={[[sc("trade").from, sc("grow").from], [sc("grow").from, sc("land").from], [sc("land").from, sc("ending").from]]}
  />
);

export const EP23: React.FC = () => (
  <Episode tl={TL23} scenes={SCENES} progressAt="none" mix="v3" cold look="paper" overlay={BAR} badge={(who) => (WHO[who] ? <Avatar16 id={WHO[who]} /> : null)} />
);
