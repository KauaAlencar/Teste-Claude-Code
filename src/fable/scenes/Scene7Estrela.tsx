import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { HEAD_STAR, Horse, horseHeadPoint } from "../components/Horse";
import { Narration } from "../components/Narration";
import { NewStar } from "../components/NewStar";
import { Sky, Stars } from "../components/Scenery";
import { STABLE_HERO, StableSetBack, StableSetFront } from "../components/StableSet";
import { clamp } from "../theme";

// Final star position on screen, shared with the closing scene.
export const SKY_STAR = { x: 1180, y: 200 };
const PAN = 900;

// 62–70s: the light fades; only his star remains, and it rises into the sky.
export const Scene7Estrela: React.FC = () => {
  const frame = useCurrentFrame();

  const headAngle = interpolate(frame, [20, 120], [32, 40], clamp);
  const hero = { ...STABLE_HERO, facing: 1, headAngle };
  const forehead = horseHeadPoint(hero, HEAD_STAR);

  const dark = interpolate(frame, [20, 150], [0, 0.9], {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.67, 1),
  });
  const cam = interpolate(frame, [150, 238], [0, PAN], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const rise = interpolate(frame, [150, 236], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.3, 1),
  });
  const starX =
    forehead.x + (SKY_STAR.x - forehead.x) * rise + Math.sin(rise * Math.PI) * 70;
  const starY = forehead.y + (SKY_STAR.y - PAN - forehead.y) * rise;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1230" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <g transform={`translate(0 ${cam})`}>
          <Sky
            y={-1000}
            height={2080}
            stops={[
              [0, "#0D1230"],
              [0.25, "#18204A"],
              [0.4, "#2B2A5C"],
              [0.48, "#4F4474"],
              [0.714, "#A95E7C"],
              [0.885, "#E48C6C"],
              [1, "#F4B173"],
            ]}
          />
          <StableSetBack />
          <Horse
            {...hero}
            eyeLid={interpolate(frame, [30, 120], [0.45, 1], clamp)}
            blink={false}
            showStar={false}
            breathOffset={5}
          />
          <StableSetFront />

          {/* The light goes out */}
          <rect x={-100} y={-1100} width={2120} height={2300} fill="#060817" opacity={dark} />
          <Stars
            count={130}
            seed="ceu-final"
            y={-1000}
            height={1300}
            opacity={interpolate(frame, [70, 170], [0, 1], clamp)}
          />

          <NewStar
            x={starX}
            y={starY}
            size={interpolate(rise, [0, 1], [13, 20])}
            glow={interpolate(frame, [30, 150], [0.2, 1], clamp)}
            rays={interpolate(frame, [228, 250], [0, 1], clamp)}
            rotation={interpolate(rise, [0, 1], [headAngle, 0])}
          />
        </g>
      </svg>

      <Narration from={40} to={255}>
        E morreu no lugar do amigo.
      </Narration>
    </AbsoluteFill>
  );
};
