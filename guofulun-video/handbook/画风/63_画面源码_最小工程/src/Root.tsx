import React from "react";
import { AbsoluteFill, Composition, Still } from "remotion";
import { episode } from "./ep25";

// 最小工程只登记一集样板（ep25）。新的一集：照 src/ep25/ 建 src/epXX/，在这里 import 进 EPISODES。
const EPISODES = [episode];

// 抖音主页按 3:4 居中裁（上下各裁 240px），封面内容都放在 y 240–1680
const crop34 = (Cover: React.FC) => () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: -240, width: 1080, height: 1920 }}><Cover /></div>
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <>
    {EPISODES.map((e) => <Composition key={e.id} id={e.id} component={e.Video} durationInFrames={e.tl.total} fps={e.tl.fps} width={1080} height={1920} />)}
    {EPISODES.map((e) => <Still key={`${e.id}-c`} id={`${e.id}-Cover`} component={e.Cover} width={1080} height={1920} />)}
    {EPISODES.map((e) => <Still key={`${e.id}-c34`} id={`${e.id}-Cover34`} component={crop34(e.Cover)} width={1080} height={1440} />)}
    {EPISODES.map((e) => ("CoverWide" in e && e.CoverWide ? <Still key={`${e.id}-c43`} id={`${e.id}-Cover43`} component={e.CoverWide as React.FC} width={1440} height={1080} /> : null))}
  </>
);
