import React from "react";
import { Episode } from "../Episode";
import type { Timeline } from "../kit";
import { Roadmap, RoadItem } from "../story";
import timeline from "./timeline.json";
import { SCenter, SHook, SMarket, SMoney, SParts, SPin, SReal, STrade } from "./scenesA";
import { SCard, SEnding, SGate, SJobs, SProfit, SRecap, SRent, SWage } from "./scenesB";
import { SCenter2, SHunt, SJobs2, SMarket2, SMoney2, SPin2, STrade2, SValue, SWage2 } from "./scenesC";

export const TL15S = timeline as Timeline;

/** 第一篇汇总（详细讲解版）：开头给核心结论 + 三步路线图；顶部常驻“三步”进度条 */
const ROAD: RoadItem[] = [
  { ids: ["pin", "pin2", "trade", "trade2", "market", "market2"], label: "越造越多" },
  { ids: ["money", "money2", "value", "real", "hunt", "parts", "center", "center2"], label: "怎么换、怎么定价" },
  { ids: ["wage", "wage2", "profit", "jobs", "jobs2", "gate", "rent"], label: "怎么分" },
];

const SCENES: Record<string, React.FC> = {
  hook: SHook, pin: SPin, pin2: SPin2, trade: STrade, trade2: STrade2, market: SMarket, market2: SMarket2,
  money: SMoney, money2: SMoney2, value: SValue, real: SReal, hunt: SHunt, parts: SParts, center: SCenter, center2: SCenter2,
  wage: SWage, wage2: SWage2, profit: SProfit, jobs: SJobs, jobs2: SJobs2, gate: SGate, rent: SRent,
  ending: SEnding, card: SCard, recap: SRecap,
};

export const EP15S: React.FC = () => <Episode tl={TL15S} scenes={SCENES} progressAt="bottom" mix="v3" cold overlay={<Roadmap items={ROAD} from={{ scene: "hook", line: 3 }} />} />;
