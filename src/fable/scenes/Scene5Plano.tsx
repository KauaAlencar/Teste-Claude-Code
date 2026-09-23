import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Barn } from "../components/Barn";
import { ThoughtBubble } from "../components/Bubbles";
import { Farmer, farmerHeadPoint } from "../components/Farmer";
import { Horse, horseHeadPoint } from "../components/Horse";
import { MindWaves } from "../components/MindWaves";
import { Narration } from "../components/Narration";
import {
  Fence,
  GrassTufts,
  LAND,
  Landscape,
  Sky,
  Sun,
  Tree,
} from "../components/Scenery";
import { clamp, COLORS, SKY, useSvgId } from "../theme";

const GROUND = 770;

// 38–50s: he reads a man's mind and discovers the terrible plan.
export const Scene5Plano: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vignetteId = useSvgId("vignette");

  const farmerX = interpolate(frame, [10, 125], [2080, 1400], {
    ...clamp,
    easing: Easing.bezier(0.2, 0, 0.4, 1),
  });
  const glow = interpolate(frame, [122, 140, 300, 330], [0, 1, 1, 0], clamp);
  const waves = interpolate(frame, [130, 146, 296, 320], [0, 1, 1, 0], clamp);
  const thought = interpolate(frame, [158, 200], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const gloom = interpolate(frame, [170, 225], [0, 1], clamp);
  const shock = spring({ frame: frame - 224, fps, config: { damping: 10 } });

  const hero = {
    x: 520,
    y: GROUND,
    scale: 1,
    facing: 1,
    headAngle: interpolate(shock, [0, 1], [0, -10]),
  };
  const farmer = { x: farmerX, y: GROUND, scale: 1, facing: -1 };
  const heroHead = horseHeadPoint(hero);
  const farmerHead = farmerHeadPoint(farmer);

  return (
    <AbsoluteFill style={{ backgroundColor: "#E48C6C" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Sky stops={SKY.afternoon} />
        <Sun x={1690} y={500} r={100} color="#FFD98E" />
        <Landscape palette={LAND.afternoon} horizon={560} ground={690} />
        <Barn x={1560} y={640} scale={0.32} />
        <Tree x={140} y={700} scale={0.85} />
        <Tree x={960} y={680} scale={0.6} />
        <Fence x1={-20} x2={1940} y={712} spacing={170} height={96} />
        <GrassTufts seed="plano" count={40} y={730} height={350} />

        {/* The mood turns dark red once the thought appears */}
        <rect
          x={0}
          y={0}
          width={1920}
          height={1080}
          fill="#7A1E24"
          opacity={gloom * 0.55}
          style={{ mixBlendMode: "multiply" }}
        />

        <Horse
          {...hero}
          glow={glow}
          eyeWide={shock}
          blink={frame < 200}
        />
        <Farmer
          {...farmer}
          walkPhase={frame * 0.28}
          walkAmount={interpolate(frame, [105, 128], [1, 0], clamp)}
          breathOffset={8}
        />

        <MindWaves
          fromX={heroHead.x}
          fromY={heroHead.y}
          toX={farmerHead.x}
          toY={farmerHead.y}
          intensity={waves}
        />

        {/* Shock lines */}
        <g
          stroke={COLORS.cream}
          strokeWidth={7}
          strokeLinecap="round"
          opacity={interpolate(frame, [226, 234, 280, 300], [0, 1, 1, 0], clamp)}
          transform={`translate(${heroHead.x - 10} ${heroHead.y - 70})`}
        >
          <line x1={-60} y1={-20} x2={-84} y2={-50} />
          <line x1={0} y1={-44} x2={0} y2={-82} />
          <line x1={60} y1={-20} x2={84} y2={-50} />
        </g>

        {/* What the man is thinking: the sick friend, in a dark red dream */}
        <ThoughtBubble
          x={1170}
          y={200}
          rx={255}
          ry={150}
          fromX={farmerHead.x - 20}
          fromY={farmerHead.y - 80}
          progress={thought}
          fill="#5C1C1E"
          stroke="#F1C9B5"
        >
          <defs>
            <radialGradient id={vignetteId}>
              <stop offset="0%" stopColor="#A33A36" stopOpacity={0.9} />
              <stop offset="70%" stopColor="#5C1C1E" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#1E0708" stopOpacity={0.9} />
            </radialGradient>
          </defs>
          <rect x={-300} y={-200} width={600} height={400} fill={`url(#${vignetteId})`} />
          <g stroke="#3A0E10" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.8}>
            <path d="M -220 -60 C -180 -110 -120 -40 -160 -10" />
            <path d="M 150 -90 C 210 -120 240 -40 190 -30" />
            <path d="M -200 90 C -150 60 -120 120 -90 100" />
          </g>
          <ellipse cx={10} cy={122} rx={170} ry={18} fill="#2B0B0C" opacity={0.6} />
          <Horse
            x={-10}
            y={118}
            scale={0.5}
            variant="friend"
            headAngle={36}
            eyeLid={0.55}
            breathOffset={60}
            palette={{
              body: "#A08688",
              far: "#7E6668",
              mane: "#4E363A",
              hoof: "#3A2426",
              muzzle: "#B89EA0",
              outline: "#2B0B0C",
            }}
          />
        </ThoughtBubble>
      </svg>

      <Narration from={25} to={168}>
        Logo depois, leu a mente de um homem
      </Narration>
      <Narration from={176} to={380}>
        e descobriu um plano terrível: ele queria matar seu amigo, que estava doente.
      </Narration>
    </AbsoluteFill>
  );
};
