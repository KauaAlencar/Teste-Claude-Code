import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SpeechBubble } from "../components/Bubbles";
import { GroundFront, HoleBack, HoleCover } from "../components/Hole";
import { Horse } from "../components/Horse";
import { Narration } from "../components/Narration";
import {
  Cloud,
  GrassTufts,
  LAND,
  Landscape,
  mixSky,
  Moon,
  Night,
  Sky,
  Stars,
  Tree,
} from "../components/Scenery";
import { clamp, COLORS, SKY, useSvgId } from "../theme";

const GROUND = 760;
const HOLE = { x: 1080, y: GROUND, rx: 210, ry: 46 };

// 26–38s: he falls into a hole, calls for help, and climbs out alone.
export const Scene4Buraco: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1C110B" }}>
    <Sequence name="Passeio e queda" durationInFrames={180} layout="none">
      <Walk />
    </Sequence>
    <Sequence name="Dentro do buraco" from={162} durationInFrames={153} layout="none">
      <InsideHole />
    </Sequence>
    <Sequence name="Saída" from={296} durationInFrames={94} layout="none">
      <ClimbOut />
    </Sequence>

    <Narration from={15} to={160}>
      Um dia caiu num buraco.
    </Narration>
    <Narration from={168} to={292}>
      Chamou por ajuda, mas ninguém veio.
    </Narration>
    <Narration from={300} to={386}>
      Depois de muito tempo, conseguiu sair sozinho.
    </Narration>
  </AbsoluteFill>
);

const Walk: React.FC = () => {
  const frame = useCurrentFrame();

  const x = interpolate(frame, [0, 118], [240, 1060], {
    ...clamp,
    easing: Easing.bezier(0.3, 0, 0.45, 1),
  });
  const walkAmount = interpolate(frame, [104, 120], [1, 0], clamp);
  const fall = interpolate(frame, [128, 152], [0, 760], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const crack = interpolate(frame, [112, 124], [0, 1], clamp);
  const collapsed = frame >= 128;

  const shakeAmp = interpolate(frame, [126, 132, 170], [0, 16, 0], clamp);
  const shakeX = Math.sin(frame * 1.9) * shakeAmp;
  const shakeY = Math.cos(frame * 2.7) * shakeAmp * 0.7;

  const chunkT = interpolate(frame, [128, 152], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [150, 162], [1, 0], clamp) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <g transform={`translate(${shakeX} ${shakeY})`}>
          <Sky stops={SKY.day} />
          <Cloud x={400 + frame * 0.3} y={160} opacity={0.85} />
          <Cloud x={1300 + frame * 0.2} y={230} scale={0.7} opacity={0.75} />
          <Landscape palette={LAND.day} horizon={540} ground={660} />
          <Tree x={380} y={672} scale={0.75} />
          <Tree x={1650} y={668} scale={0.9} />

          {collapsed ? <HoleBack {...HOLE} /> : null}

          <Horse
            x={x}
            y={GROUND + fall}
            scale={0.9}
            walkPhase={frame * 0.3}
            walkAmount={walkAmount}
            eyeWide={interpolate(frame, [118, 126], [0, 1], clamp)}
            headAngle={interpolate(frame, [118, 128], [0, -14], clamp)}
          />

          {collapsed ? null : (
            <HoleCover {...HOLE} fill={LAND.day.grass} crack={crack} />
          )}
          {/* Chunks of turf falling in */}
          {collapsed
            ? [-150, -80, -10, 70, 140].map((dx, i) => (
                <ellipse
                  key={dx}
                  cx={HOLE.x + dx * (1 - chunkT * 0.3)}
                  cy={HOLE.y + chunkT * chunkT * (260 + i * 30)}
                  rx={34}
                  ry={14}
                  fill={LAND.day.grass}
                  stroke={COLORS.outline}
                  strokeWidth={5}
                  opacity={1 - chunkT * 0.4}
                  transform={`rotate(${chunkT * (i % 2 === 0 ? 70 : -60)} ${HOLE.x + dx} ${HOLE.y})`}
                />
              ))
            : null}

          <GroundFront {...HOLE} fill={LAND.day.grass} lip={collapsed} />

          {/* Dust */}
          {[-230, -120, 0, 120, 230].map((dx, i) => {
            const d = interpolate(frame, [130 + i * 2, 168 + i * 2], [0, 1], clamp);
            return (
              <circle
                key={dx}
                cx={HOLE.x + dx * (1 + d * 0.3)}
                cy={HOLE.y - 10 - d * 50}
                r={14 + d * 40}
                fill="#E4CFA4"
                opacity={d > 0 ? 0.7 * (1 - d) : 0}
              />
            );
          })}

          <GrassTufts seed="buraco" count={40} y={790} height={290} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const InsideHole: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clipId = useSvgId("opening");
  const lightId = useSvgId("light");

  const fadeIn = interpolate(frame, [0, 16], [0, 1], clamp);
  // Time passes: day -> dusk -> night, seen through the opening.
  const toDusk = interpolate(frame, [20, 70], [0, 1], clamp);
  const toNight = interpolate(frame, [70, 128], [0, 1], clamp);
  const sky = mixSky(mixSky(SKY.day, SKY.dusk, toDusk), SKY.night, toNight);

  const calls = [
    { at: 22, x: 1330, y: 420, s: 1, o: 1, tailX: -210, tailY: 70 },
    { at: 50, x: 1250, y: 292, s: 0.78, o: 0.8, tailX: -150, tailY: 110 },
    { at: 76, x: 1340, y: 196, s: 0.6, o: 0.6, tailX: -150, tailY: 120 },
    { at: 100, x: 1190, y: 130, s: 0.45, o: 0.42, tailX: -120, tailY: 120 },
  ];
  const callsOut = interpolate(frame, [118, 136], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <clipPath id={clipId}>
            <ellipse cx={960} cy={110} rx={400} ry={120} />
          </clipPath>
          <linearGradient id={lightId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE8B8" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#FFE8B8" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Earth walls */}
        <rect x={0} y={0} width={1920} height={1080} fill="#3A2519" />
        <path d="M 0 300 C 400 260 700 330 1000 300 C 1300 270 1600 320 1920 290 L 1920 1080 L 0 1080 Z" fill="#33201A" />
        <path d="M 0 560 C 500 520 900 600 1300 560 C 1600 530 1800 570 1920 555 L 1920 1080 L 0 1080 Z" fill="#2B1B14" />
        <g fill="#4A3122" stroke={COLORS.outline} strokeWidth={4}>
          <ellipse cx={220} cy={420} rx={34} ry={20} />
          <ellipse cx={1690} cy={640} rx={42} ry={24} />
          <ellipse cx={380} cy={700} rx={26} ry={16} />
          <ellipse cx={1520} cy={360} rx={24} ry={15} />
        </g>

        {/* The opening, where we watch time pass */}
        <g clipPath={`url(#${clipId})`}>
          <Sky stops={sky} y={-10} height={250} />
          <Stars count={40} seed="abertura-buraco" x={560} y={0} width={800} height={230} opacity={toNight} />
        </g>
        <ellipse cx={960} cy={110} rx={400} ry={120} fill="none" stroke={LAND.day.grass} strokeWidth={34} />
        <ellipse cx={960} cy={110} rx={418} ry={138} fill="none" stroke={COLORS.outline} strokeWidth={6} />

        {/* Roots */}
        <g stroke="#6B4630" strokeWidth={8} strokeLinecap="round" fill="none">
          <path d="M 640 190 C 630 260 660 300 640 360" />
          <path d="M 1270 200 C 1290 250 1260 300 1280 350" />
          <path d="M 800 228 C 790 270 810 290 800 320" />
        </g>

        {/* Light falling in, fading as night comes */}
        <path
          d="M 600 150 L 1320 150 L 1500 1080 L 420 1080 Z"
          fill={`url(#${lightId})`}
          opacity={1 - toNight * 0.85}
        />

        <ellipse cx={960} cy={790} rx={760} ry={90} fill="#24160F" />

        <Horse
          x={880}
          y={760}
          scale={0.8}
          headAngle={-26}
          breathOffset={17}
          eyeLid={interpolate(frame, [110, 135], [0, 0.4], clamp)}
        />

        {calls.map((c) => {
          const pop = spring({ frame: frame - c.at, fps, config: { damping: 12 } });
          return (
            <SpeechBubble
              key={c.at}
              x={c.x}
              y={c.y}
              scale={c.s * pop}
              opacity={c.o * Math.min(1, pop * 1.5) * callsOut}
              tailX={c.tailX}
              tailY={c.tailY}
            >
              Socorro!
            </SpeechBubble>
          );
        })}

        {/* Night darkens the hole */}
        <rect x={0} y={0} width={1920} height={1080} fill="#0B0A1A" opacity={toNight * 0.35} />
      </svg>
    </AbsoluteFill>
  );
};

const ClimbOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 16], [0, 1], clamp);
  const rise = spring({ frame: frame - 14, fps, config: { damping: 13, mass: 0.9 } });
  const x = interpolate(frame, [52, 94], [1060, 1330], {
    ...clamp,
    easing: Easing.bezier(0.3, 0, 0.6, 1),
  });
  const walkAmount = interpolate(frame, [50, 58], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Sky stops={SKY.night} />
        <Stars count={110} seed="saida" height={520} />
        <Moon x={360} y={170} r={54} />
        <Night>
          <Landscape palette={LAND.day} horizon={540} ground={660} />
          <Tree x={380} y={672} scale={0.75} />
          <Tree x={1650} y={668} scale={0.9} />

          <HoleBack {...HOLE} />
          <Horse
            x={x}
            y={GROUND + interpolate(rise, [0, 1], [420, 0])}
            scale={0.9}
            headAngle={interpolate(rise, [0, 1], [-20, 0])}
            walkPhase={frame * 0.3}
            walkAmount={walkAmount}
            breathOffset={40}
          />
          <GroundFront {...HOLE} fill={LAND.day.grass} />
          <GrassTufts seed="buraco" count={40} y={790} height={290} />
        </Night>

        {/* Soft moonlight */}
        <rect x={0} y={0} width={1920} height={1080} fill="#6C7BB8" opacity={0.08} />
      </svg>
    </AbsoluteFill>
  );
};
