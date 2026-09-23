import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, starPath, useSvgId } from "../theme";

export type HorseVariant = "hero" | "friend" | "mother";

type Palette = {
  body: string;
  far: string;
  mane: string;
  hoof: string;
  muzzle: string;
  outline: string;
};

export const HORSE_PALETTES: Record<HorseVariant, Palette> = {
  hero: {
    body: "#9A5B34",
    far: "#7C4526",
    mane: "#4A2A1A",
    hoof: "#3B2417",
    muzzle: "#B87C52",
    outline: "#3E2415",
  },
  friend: {
    body: "#A6A5AA",
    far: "#88878E",
    mane: "#5F5E68",
    hoof: "#46454C",
    muzzle: "#C2C1C6",
    outline: "#4B4A52",
  },
  mother: {
    body: "#C07A48",
    far: "#9C5E34",
    mane: "#6B3B20",
    hoof: "#3B2417",
    muzzle: "#D6A070",
    outline: "#52301A",
  },
};

// Horse geometry, in local units (facing right, origin on the ground between the hooves).
const NECK_PIVOT = { x: 85, y: -225 };
const HEAD_OFFSET = { x: 80, y: -120 };
const HEAD_TILT = 30;
export const HEAD_CENTER = { x: 45, y: 0 };
export const HEAD_STAR = { x: 44, y: -16 };

const rotate = (p: { x: number; y: number }, deg: number) => {
  const r = (deg * Math.PI) / 180;
  return {
    x: p.x * Math.cos(r) - p.y * Math.sin(r),
    y: p.x * Math.sin(r) + p.y * Math.cos(r),
  };
};

type Placement = {
  x: number;
  y: number;
  scale?: number;
  facing?: number;
  headAngle?: number;
};

// World position of a point in head coordinates (used to aim glows, waves and bubbles).
export const horseHeadPoint = (
  { x, y, scale = 1, facing = 1, headAngle = 0 }: Placement,
  local: { x: number; y: number } = HEAD_CENTER,
) => {
  const inHead = rotate(local, HEAD_TILT);
  const inNeck = rotate(
    { x: HEAD_OFFSET.x + inHead.x, y: HEAD_OFFSET.y + inHead.y },
    headAngle,
  );
  return {
    x: x + facing * scale * (NECK_PIVOT.x + inNeck.x),
    y: y + scale * (NECK_PIVOT.y + inNeck.y),
  };
};

export type HorseProps = Placement & {
  variant?: HorseVariant;
  palette?: Partial<Palette>;
  walkPhase?: number;
  walkAmount?: number;
  eyeWide?: number;
  eyeLid?: number;
  glow?: number;
  showStar?: boolean;
  breathOffset?: number;
  blink?: boolean;
  opacity?: number;
};

const Leg: React.FC<{
  lx: number;
  angle: number;
  width: number;
  fill: string;
  hoof: string;
  outline: string;
}> = ({ lx, angle, width, fill, hoof, outline }) => (
  <g transform={`rotate(${angle} ${lx} -175)`}>
    <rect
      x={lx - width / 2}
      y={-190}
      width={width}
      height={172}
      rx={width / 2}
      fill={fill}
      stroke={outline}
      strokeWidth={5}
    />
    <rect
      x={lx - width / 2 - 3}
      y={-30}
      width={width + 6}
      height={30}
      rx={9}
      fill={hoof}
      stroke={outline}
      strokeWidth={5}
    />
  </g>
);

export const Horse: React.FC<HorseProps> = ({
  x,
  y,
  scale = 1,
  facing = 1,
  headAngle = 0,
  variant = "hero",
  palette,
  walkPhase = 0,
  walkAmount = 0,
  eyeWide = 0,
  eyeLid = 0,
  glow = 0,
  showStar,
  breathOffset = 0,
  blink = true,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = { ...HORSE_PALETTES[variant], ...palette };
  const sick = variant === "friend";
  const hasStar = showStar ?? variant === "hero";

  const glowId = useSvgId("horse-glow");
  const eyeClipId = useSvgId("horse-eye");

  const t = (frame + breathOffset) / fps;
  const breath = Math.sin((t * 2 * Math.PI) / (sick ? 3.4 : 2.6));
  const bodyScaleY = 1 + breath * (sick ? 0.028 : 0.016);
  const neckBob = breath * (sick ? 3.5 : 2.5);
  const bob = -Math.abs(Math.sin(walkPhase)) * 7 * walkAmount;
  const tail =
    Math.sin((t * 2 * Math.PI) / 3.1) * 4 +
    Math.sin(walkPhase) * 7 * walkAmount;
  const leg = (offset: number) =>
    walkAmount * 18 * Math.sin(walkPhase + offset);

  const blinkCycle = (frame + breathOffset * 7) % 118;
  const blinkLid =
    blink && blinkCycle < 7 ? Math.sin((blinkCycle / 7) * Math.PI) : 0;
  const lid = Math.min(1, Math.max(eyeLid, blinkLid));

  const pulse = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 1.3);

  const bodyRx = sick ? 126 : 136;
  const bodyRy = sick ? 50 : 62;
  const legW = sick ? 19 : 24;

  const neckPath =
    "M -52 22 C -44 -48 -4 -104 42 -132 L 102 -112 C 86 -70 62 -22 54 26 Z";
  const headShapes = (
    <>
      <circle cx={0} cy={4} r={40} />
      <ellipse cx={48} cy={0} rx={72} ry={33} />
      <ellipse cx={104} cy={6} rx={30} ry={28} />
    </>
  );
  const earPath = "M -36 -14 L -44 -70 L -6 -30 Z";

  const eyeR = 7 + 6 * eyeWide;

  return (
    <g
      transform={`translate(${x} ${y + bob * scale}) scale(${facing * scale} ${scale})`}
      opacity={opacity}
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#B8ECFF" stopOpacity={0.95} />
          <stop offset="45%" stopColor={COLORS.glow} stopOpacity={0.55} />
          <stop offset="100%" stopColor={COLORS.glow} stopOpacity={0} />
        </radialGradient>
        <clipPath id={eyeClipId}>
          <circle cx={0} cy={0} r={eyeR} />
        </clipPath>
      </defs>

      {/* Far legs */}
      <Leg lx={-62} angle={leg(0)} width={legW} fill={p.far} hoof={p.hoof} outline={p.outline} />
      <Leg lx={104} angle={leg(Math.PI)} width={legW} fill={p.far} hoof={p.hoof} outline={p.outline} />

      {/* Tail */}
      <g transform={`rotate(${tail} -128 -235)`}>
        <path
          d="M -126 -238 C -178 -232 -198 -170 -184 -108"
          stroke={p.mane}
          strokeWidth={30}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -124 -226 C -158 -210 -168 -160 -156 -122"
          stroke={p.mane}
          strokeWidth={18}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Glow halo, behind the head */}
      {glow > 0 ? (
        <g transform={`translate(${NECK_PIVOT.x} ${NECK_PIVOT.y + neckBob}) rotate(${headAngle})`}>
          <g transform={`translate(${HEAD_OFFSET.x} ${HEAD_OFFSET.y}) rotate(${HEAD_TILT})`}>
            <circle
              cx={HEAD_CENTER.x}
              cy={HEAD_CENTER.y}
              r={150 + 18 * pulse}
              fill={`url(#${glowId})`}
              opacity={glow * (0.7 + 0.3 * pulse)}
            />
          </g>
        </g>
      ) : null}

      {/* Silhouette outline pass: body, neck and head share one clean outline */}
      <g stroke={p.outline} strokeWidth={10} strokeLinejoin="round" fill={p.outline}>
        <g transform={`translate(0 -205) scale(1 ${bodyScaleY}) translate(0 205)`}>
          <ellipse cx={0} cy={-205} rx={bodyRx} ry={bodyRy} />
        </g>
        <g transform={`translate(${NECK_PIVOT.x} ${NECK_PIVOT.y + neckBob}) rotate(${headAngle})`}>
          <path d={neckPath} />
          <g transform={`translate(${HEAD_OFFSET.x} ${HEAD_OFFSET.y}) rotate(${HEAD_TILT})`}>
            <path d={earPath} />
            {headShapes}
          </g>
        </g>
      </g>

      {/* Near legs (their tops get covered by the body fill) */}
      <Leg lx={-92} angle={leg(Math.PI)} width={legW} fill={p.body} hoof={p.hoof} outline={p.outline} />
      <Leg lx={74} angle={leg(0)} width={legW} fill={p.body} hoof={p.hoof} outline={p.outline} />

      {/* Body fill */}
      <g transform={`translate(0 -205) scale(1 ${bodyScaleY}) translate(0 205)`}>
        <ellipse cx={0} cy={-205} rx={bodyRx} ry={bodyRy} fill={p.body} />
        {sick ? (
          <g stroke={p.far} strokeWidth={5} strokeLinecap="round" fill="none">
            <path d="M -20 -238 q 14 22 2 48" />
            <path d="M 4 -240 q 14 22 2 48" />
            <path d="M 28 -238 q 14 22 2 46" />
          </g>
        ) : null}
      </g>

      {/* Neck and head */}
      <g transform={`translate(${NECK_PIVOT.x} ${NECK_PIVOT.y + neckBob}) rotate(${headAngle})`}>
        <path d={neckPath} fill={p.body} />
        <path
          d="M -46 6 C -36 -52 0 -102 44 -134"
          stroke={p.mane}
          strokeWidth={30}
          strokeLinecap="round"
          fill="none"
        />
        <g transform={`translate(${HEAD_OFFSET.x} ${HEAD_OFFSET.y}) rotate(${HEAD_TILT})`}>
          <path d={earPath} fill={p.body} strokeLinejoin="round" />
          <path d="M -32 -22 L -37 -56 L -14 -30 Z" fill={p.far} />
          <g fill={p.body}>
            <circle cx={0} cy={4} r={40} />
            <ellipse cx={48} cy={0} rx={72} ry={33} />
          </g>
          <ellipse cx={104} cy={6} rx={30} ry={28} fill={p.muzzle} />
          <ellipse cx={114} cy={-4} rx={6} ry={4.5} fill={p.outline} />
          <path
            d="M 98 24 Q 110 30 122 22"
            stroke={p.outline}
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M -22 -30 C -4 -44 14 -38 22 -24"
            stroke={p.mane}
            strokeWidth={16}
            strokeLinecap="round"
            fill="none"
          />

          {/* Eye */}
          <g transform="translate(16 -8)">
            {eyeWide > 0 ? (
              <circle r={eyeR} fill="#FFFFFF" stroke={p.outline} strokeWidth={3} />
            ) : null}
            <circle r={7} fill={COLORS.dirtDark} />
            <circle cx={-2.2} cy={-2.4} r={2.3} fill="#FFFFFF" />
            {lid > 0.02 ? (
              <>
                <rect
                  x={-eyeR - 2}
                  y={-eyeR - 2}
                  width={eyeR * 2 + 4}
                  height={(eyeR * 2 + 4) * lid}
                  fill={p.body}
                  clipPath={`url(#${eyeClipId})`}
                />
                {lid > 0.85 ? (
                  <path
                    d={`M ${-eyeR - 1} 0 Q 0 ${eyeR * 0.8} ${eyeR + 1} 0`}
                    stroke={p.outline}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    fill="none"
                  />
                ) : (
                  <line
                    x1={-eyeR}
                    x2={eyeR}
                    y1={-eyeR - 2 + (eyeR * 2 + 4) * lid}
                    y2={-eyeR - 2 + (eyeR * 2 + 4) * lid}
                    stroke={p.outline}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                )}
              </>
            ) : null}
          </g>

          {hasStar ? (
            <path
              d={starPath(15, 7)}
              transform={`translate(${HEAD_STAR.x} ${HEAD_STAR.y}) rotate(-30)`}
              fill={COLORS.star}
              stroke={COLORS.star}
              strokeWidth={3}
              strokeLinejoin="round"
            />
          ) : null}

          {glow > 0 ? (
            <g fill="none" stroke="#A8E6FF" strokeWidth={5}>
              {[0, 0.5].map((k) => {
                const ring = (t * 1.1 + k) % 1;
                return (
                  <circle
                    key={k}
                    cx={HEAD_CENTER.x}
                    cy={HEAD_CENTER.y}
                    r={80 + 70 * ring}
                    opacity={glow * (1 - ring) * 0.85}
                  />
                );
              })}
            </g>
          ) : null}
        </g>
      </g>
    </g>
  );
};
