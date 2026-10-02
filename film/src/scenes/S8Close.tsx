import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Tag, usePop, useBeat } from "../kit";
import { CastRow } from "./S2Promise";
import { C, DISPLAY } from "../theme";

export const S8Close: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(6, 12);
  const free = usePop(60, 11);
  const os = usePop(80, 11);
  const link = usePop(102, 11);
  const beat = useBeat(0.03);
  const out = interpolate(frame, [215, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.teal }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ transform: `scale(${logo * beat})` }}>
          <Img src={staticFile("logo.png")} style={{ height: 230, borderRadius: 40 }} />
        </div>
        <div style={{ fontFamily: DISPLAY, color: C.white, fontSize: 150, transform: `scale(${logo})` }}>Office Buddies</div>
        <div style={{ display: "flex", gap: 24, marginTop: 6 }}>
          <div style={{ transform: `scale(${free})` }}><Tag bg={C.paper} fg={C.ink} style={{ fontSize: 46 }}>Free</Tag></div>
          <div style={{ transform: `scale(${os})` }}><Tag bg={C.paper} fg={C.ink} style={{ fontSize: 46 }}>Open source</Tag></div>
        </div>
        <div style={{ transform: `scale(${link})`, marginTop: 14 }}>
          <Tag bg={C.ink} fg={C.white} style={{ fontSize: 44 }}>github.com/kadmielp/Office-Buddies</Tag>
        </div>
      </div>
      <CastRow y={800} scaleTo={190} shift={100} />
      <AbsoluteFill style={{ background: C.ink, opacity: out }} />
    </AbsoluteFill>
  );
};
