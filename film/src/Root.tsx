import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS, H, TOTAL, W } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{ withAudio: false }} />
  </>
);
