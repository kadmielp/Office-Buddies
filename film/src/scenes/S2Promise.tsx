import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Headline, Sprite, usePop, useBeat } from "../kit";
import { C, DISPLAY, SAFE } from "../theme";

export const CAST: { agent: string; fh: number; at: number; anim: string; scaleTo: number }[] = [
  { agent: "Clippy", fh: 93, at: 120, anim: "Wave", scaleTo: 190 },
  { agent: "Merlin", fh: 128, at: 135, anim: "Greet", scaleTo: 190 },
  { agent: "Bonzi", fh: 160, at: 150, anim: "Wave", scaleTo: 190 },
  { agent: "Genie", fh: 128, at: 165, anim: "Greet", scaleTo: 190 },
  { agent: "Peedy", fh: 128, at: 180, anim: "Greet", scaleTo: 190 },
  { agent: "Rover", fh: 80, at: 195, anim: "Greet", scaleTo: 190 },
  { agent: "Rocky", fh: 93, at: 210, anim: "Wave", scaleTo: 190 },
];

export const CastRow: React.FC<{ shift?: number; y?: number; scaleTo?: number; anim?: boolean }> = ({ y = 800, scaleTo = 190, anim = true, shift = 0 }) => {
  return (
    <div style={{ position: "absolute", left: SAFE, right: SAFE, top: y, display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: scaleTo }}>
      {CAST.map((c, i) => (
        <CastMember key={c.agent} c={{ ...c, at: c.at - shift }} i={i} scaleTo={scaleTo} anim={anim} />
      ))}
    </div>
  );
};

const CastMember: React.FC<{ c: (typeof CAST)[number]; i: number; scaleTo: number; anim: boolean }> = ({ c, i, scaleTo, anim }) => {
  const pop = usePop(c.at, 10);
  return (
    <div style={{ transform: `translateY(${(1 - pop) * 120}px) scale(${pop})`, transformOrigin: "50% 100%" }}>
      <Sprite agent={c.agent} anim={anim ? c.anim : "RestPose"} scale={scaleTo / c.fh} offset={i * 7} />
    </div>
  );
};

export const S2Promise: React.FC = () => {
  const logo = usePop(6, 13);
  const head = usePop(60, 14);
  const beat = useBeat(0.025);
  return (
    <AbsoluteFill style={{ background: C.teal }}>
      <div style={{ position: "absolute", left: SAFE, top: SAFE - 20, display: "flex", alignItems: "center", gap: 28, transform: `scale(${logo})`, transformOrigin: "0 50%" }}>
        <Img src={staticFile("logo.png")} style={{ height: 130, borderRadius: 24 }} />
        <div style={{ fontFamily: DISPLAY, color: C.white, fontSize: 84 }}>Office Buddies</div>
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 290, opacity: head, transform: `translateY(${(1 - head) * 60}px) scale(${beat})`, transformOrigin: "0 50%" }}>
        <Headline size={190}>Your AI,</Headline>
        <Headline size={190} color={C.paper}>with a face.</Headline>
      </div>
      <CastRow y={770} />
    </AbsoluteFill>
  );
};
