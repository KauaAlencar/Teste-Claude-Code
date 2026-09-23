import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThoughtBubble } from "../components/Bubbles";
import { Farmer, farmerHeadPoint } from "../components/Farmer";
import { Horse, horseHeadPoint } from "../components/Horse";
import { MindWaves } from "../components/MindWaves";
import { Narration } from "../components/Narration";
import {
  Cloud,
  Fence,
  GrassTufts,
  LAND,
  Landscape,
  Sky,
  Tree,
} from "../components/Scenery";
import { clamp, COLORS, SERIF, SKY } from "../theme";

const GROUND = 760;

// 18–26s: he can't read the other horse's mind, but reads the farmer's.
export const Scene3Tentativa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // First attempt, on the mother: the glow flickers and dies out.
  const failGlow = interpolate(
    frame,
    [45, 62, 92, 97, 101, 105, 110, 118],
    [0, 1, 1, 0.35, 0.85, 0.2, 0.55, 0],
    clamp,
  );
  const failWaves = interpolate(frame, [52, 66, 92, 112], [0, 1, 1, 0], clamp);

  const question = spring({ frame: frame - 110, fps, config: { damping: 11 } });
  const questionOut = interpolate(frame, [168, 184], [1, 0], clamp);
  const puzzled = interpolate(frame, [112, 128, 150, 162], [0, -9, -9, 0], clamp);

  // He turns to the farmer: this time it works.
  const turn = spring({ frame: frame - 148, fps, config: { damping: 18 } });
  const facing = interpolate(turn, [0, 1], [1, -1]);
  const okGlow = interpolate(frame, [176, 192], [0, 1], clamp);
  const okWaves = interpolate(frame, [184, 198], [0, 1], clamp);
  const thought = interpolate(frame, [206, 236], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const hero = { x: 760, y: GROUND, scale: 0.95, facing, headAngle: puzzled };
  const mother = { x: 1560, y: GROUND, scale: 0.95, facing: -1 };
  const farmer = { x: 250, y: GROUND, scale: 0.95, facing: 1 };

  const heroHead = horseHeadPoint(hero);
  const motherHead = horseHeadPoint(mother);
  const farmerHead = farmerHeadPoint(farmer);

  return (
    <AbsoluteFill style={{ backgroundColor: "#F3DDAE" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Sky stops={SKY.day} />
        <Cloud x={560 + frame * 0.2} y={170} scale={1} opacity={0.85} />
        <Cloud x={1450 + frame * 0.15} y={120} scale={0.75} opacity={0.75} />
        <Landscape palette={LAND.day} horizon={560} ground={680} />
        <Tree x={1120} y={690} scale={0.7} />
        <Tree x={1780} y={690} scale={0.85} />
        <Fence x1={-20} x2={1940} y={700} spacing={170} height={100} />
        <GrassTufts seed="tentativa" count={40} y={720} height={360} />

        <Farmer {...farmer} breathOffset={12} />
        <Horse {...mother} variant="mother" breathOffset={31} />
        <Horse
          {...hero}
          glow={frame < 150 ? failGlow : okGlow}
          eyeWide={interpolate(frame, [100, 112, 150, 160], [0, 0.5, 0.5, 0], clamp)}
        />

        <MindWaves
          fromX={heroHead.x}
          fromY={heroHead.y}
          toX={motherHead.x}
          toY={motherHead.y}
          intensity={failWaves}
          reach={0.55}
        />
        <MindWaves
          fromX={heroHead.x}
          fromY={heroHead.y}
          toX={farmerHead.x}
          toY={farmerHead.y}
          intensity={okWaves}
        />

        {/* "?" floating over his head */}
        <g
          transform={`translate(${heroHead.x + 20} ${heroHead.y - 150 - question * 20}) scale(${question})`}
          opacity={questionOut}
        >
          <circle r={62} fill={COLORS.cream} stroke={COLORS.outline} strokeWidth={6} />
          <text
            y={34}
            textAnchor="middle"
            fontFamily={SERIF}
            fontSize={104}
            fontWeight={700}
            fill="#3E7FB0"
          >
            ?
          </text>
        </g>

        {/* The farmer is thinking about carrots */}
        <ThoughtBubble
          x={440}
          y={190}
          rx={140}
          ry={92}
          fromX={farmerHead.x + 40}
          fromY={farmerHead.y - 70}
          progress={thought}
        >
          <g transform="rotate(-30)">
            <path
              d="M -60 -14 L 58 -4 Q 70 0 58 4 L -60 14 Q -72 0 -60 -14 Z"
              fill="#EE8A3A"
              stroke={COLORS.outline}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            <path
              d="M -20 -10 l 0 8 M 10 -7 l 0 7 M 34 -5 l 0 6"
              stroke="#C96A24"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <g fill="#7FA046" stroke={COLORS.outline} strokeWidth={4} strokeLinejoin="round">
              <path d="M -62 -6 C -90 -40 -100 -20 -96 -8 Z" />
              <path d="M -62 0 C -104 -6 -104 12 -94 18 Z" />
              <path d="M -62 6 C -90 30 -76 42 -66 34 Z" />
            </g>
          </g>
        </ThoughtBubble>
      </svg>

      <Narration from={25} to={262}>
        Mas ele só conseguia ler a mente dos humanos, nunca a dos cavalos.
      </Narration>
    </AbsoluteFill>
  );
};
