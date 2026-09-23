import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Barn, HayBale, Sign, StableBack, StableFront } from "../components/Barn";
import { Horse } from "../components/Horse";
import { Narration } from "../components/Narration";
import {
  Birds,
  Cloud,
  Fence,
  GrassTufts,
  LAND,
  Landscape,
  Sky,
  Sun,
  Tree,
} from "../components/Scenery";
import { clamp, SKY } from "../theme";

// 8–18s: the Chihuahua family farm at dawn.
export const Scene2Fazenda: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 330], [1, 1.07], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const sunY = interpolate(frame, [0, 220], [700, 470], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#F8C28F" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <g transform={`translate(1000 560) scale(${push}) translate(-1000 -560)`}>
          <Sky stops={SKY.dawn} />
          <Sun x={1560} y={sunY} r={80} color="#FFE3A0" />
          <Cloud x={380 + frame * 0.25} y={210} scale={1.1} color="#FFE6D6" opacity={0.8} />
          <Cloud x={1150 + frame * 0.18} y={150} scale={0.8} color="#FFE6D6" opacity={0.7} />
          <Birds y={230} speed={3.2} opacity={0.7} />
          <Landscape palette={LAND.dawn} horizon={600} ground={725} />

          <Tree x={150} y={742} scale={0.95} />
          <Tree x={1840} y={732} scale={0.75} />

          {/* Dirt path from the barn */}
          <path
            d="M 450 735 C 420 830 330 930 200 1100 L 500 1100 C 550 960 580 840 640 735 Z"
            fill="#D9B47A"
          />

          <Fence x1={1440} x2={1940} y={748} spacing={150} height={110} />

          <Barn x={540} y={736} scale={0.9} />
          <StableBack x={774} y={736} width={700} scale={0.9} />

          {/* The family, inside the stable */}
          <Horse x={930} y={728} scale={0.6} variant="mother" breathOffset={23} />
          <Horse
            x={1062}
            y={728}
            scale={0.36}
            variant="mother"
            facing={-1}
            headAngle={-6}
            breathOffset={51}
            palette={{ body: "#D08A56", muzzle: "#E3B083" }}
          />
          <Horse x={1276} y={728} scale={0.58} variant="hero" facing={-1} breathOffset={0} />

          <StableFront x={774} y={736} width={700} scale={0.9} />
          <HayBale x={1470} y={780} scale={0.7} />

          <Sign x={1690} y={850} scale={0.75} />

          <GrassTufts seed="fazenda" count={36} y={780} height={300} />

          {/* Warm morning light */}
          <rect
            x={-200}
            y={-200}
            width={2320}
            height={1480}
            fill="#FFB27A"
            opacity={interpolate(frame, [0, 200], [0.18, 0.04], clamp)}
            style={{ mixBlendMode: "soft-light" }}
          />
        </g>
      </svg>

      <Narration from={30} to={318}>
        Ele vivia com sua família no estábulo da fazenda da família Chihuahua.
      </Narration>
    </AbsoluteFill>
  );
};
