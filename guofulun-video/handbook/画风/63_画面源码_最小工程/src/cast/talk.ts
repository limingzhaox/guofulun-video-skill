// 角色说话时张嘴：按 TTS 逐字时间戳，每个字张合一次
import { useTL } from "../kit";

/** 返回 (who, 场景内帧) → 张嘴程度 0–1；who 用剧本里的“狗”“猫” */
export const useTalk = (sceneId: string) => {
  const TL = useTL();
  const sc = TL.scenes.find((s) => s.id === sceneId)!;
  const ls = TL.lines.filter((l) => l.scene === sceneId && l.who);
  return (who: string, f: number) => {
    const abs = f + sc.from;
    for (const l of ls) {
      if (l.who !== who || abs < l.from || abs >= l.from + l.dur) continue;
      const tt = (abs - l.from) / TL.fps;
      const w = l.words?.find((x) => tt >= x.s && tt <= x.e);
      if (!w) return 0.12;
      const ph = (tt - w.s) / Math.max(0.06, w.e - w.s);
      return 0.15 + 0.85 * Math.sin(Math.min(1, ph) * Math.PI);
    }
    return 0;
  };
};

/** 某个角色的第 n 句（场景内）从哪一帧开始说；找不到返回 -1 */
export const useWhoLine = (sceneId: string) => {
  const TL = useTL();
  const sc = TL.scenes.find((s) => s.id === sceneId)!;
  const ls = TL.lines.filter((l) => l.scene === sceneId);
  return (i: number) => (ls[i] ? ls[i].from - sc.from : -1);
};
