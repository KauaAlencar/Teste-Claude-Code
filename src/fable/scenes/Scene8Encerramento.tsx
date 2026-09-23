import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Branches, GroundFront, HoleBack } from "../components/Hole";
import { Horse } from "../components/Horse";
import { NewStar } from "../components/NewStar";
import {
  GrassTufts,
  LAND,
  Landscape,
  Night,
  Sky,
  Stars,
  Tree,
} from "../components/Scenery";
import { clamp, SKY } from "../theme";
import { SKY_STAR } from "./Scene7Estrela";

const HOLE = { x: 700, y: 770, rx: 190, ry: 42 };

// 70–75s: the friend comes out of the hole and looks at the new star.
export const Scene8Encerramento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({ frame: frame - 18, fps, config: { damping: 15, mass: 1.1 } });
  const lookUp = interpolate(frame, [66, 108], [32, -44], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1230" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Sky stops={SKY.night} />
        <Stars count={130} seed="ceu-final" y={-100} height={1300} />
        <NewStar
          x={SKY_STAR.x}
          y={SKY_STAR.y}
          size={20}
          glow={1}
          rays={interpolate(frame, [100, 118, 140], [1, 1.6, 1], clamp)}
        />

        <Night>
          <Landscape palette={LAND.day} horizon={560} ground={680} />
          <Tree x={220} y={690} scale={0.8} />
          <Tree x={1740} y={684} scale={0.7} />

          <HoleBack {...HOLE} />
          <Horse
            x={HOLE.x}
            y={HOLE.y + interpolate(rise, [0, 1], [440, 0])}
            scale={0.9}
            variant="friend"
            headAngle={lookUp}
            eyeLid={interpolate(frame, [70, 100], [0.45, 0], clamp)}
            eyeWide={interpolate(frame, [100, 116], [0, 0.35], clamp)}
            breathOffset={60}
          />
          <GroundFront {...HOLE} fill={LAND.day.grass} />
          <Branches x={1000} y={800} scale={0.8} />
          <GrassTufts seed="final" count={36} y={800} height={280} />
        </Night>

        {/* Starlight on the friend */}
        <rect x={0} y={0} width={1920} height={1080} fill="#FFE6A8" opacity={0.04} />
      </svg>

      <AbsoluteFill
        style={{
          backgroundColor: "#000000",
          opacity: interpolate(frame, [122, 160], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
