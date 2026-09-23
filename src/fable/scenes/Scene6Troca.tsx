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
import { Barn, StableBack, StableFront } from "../components/Barn";
import { Farmer } from "../components/Farmer";
import { Branches, GroundFront, HoleBack } from "../components/Hole";
import { Horse } from "../components/Horse";
import { Narration } from "../components/Narration";
import {
  GrassTufts,
  LAND,
  Landscape,
  mixSky,
  Sky,
  Sun,
  Tree,
} from "../components/Scenery";
import { STABLE_HERO, StableSetBack, StableSetFront } from "../components/StableSet";
import { clamp, SKY } from "../theme";

// 50–62s: the plan, in three beats.
export const Scene6Troca: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#A95E7C" }}>
    <Sequence name="Espiando atrás do celeiro" durationInFrames={142} layout="none">
      <Spying />
    </Sequence>
    <Sequence name="Escondendo o amigo" from={128} durationInFrames={144} layout="none">
      <Hiding />
    </Sequence>
    <Sequence name="Tomando o lugar" from={258} durationInFrames={132} layout="none">
      <TakingPlace />
    </Sequence>

    <Narration from={20} to={150}>
      Então ele bolou um plano.
    </Narration>
    <Narration from={158} to={386}>
      Escondeu o amigo no buraco e tomou o seu lugar.
    </Narration>
  </AbsoluteFill>
);

const Spying: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const peek = spring({ frame: frame - 8, fps, config: { damping: 16 } });
  const farmerX = interpolate(frame, [40, 142], [640, -140], clamp);

  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [125, 142], [1, 0], clamp) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Sky stops={mixSky(SKY.afternoon, SKY.dusk, 0.3)} />
        <Sun x={900} y={470} r={80} color="#FFD08A" />
        <Landscape palette={LAND.afternoon} horizon={540} ground={650} />
        <Tree x={760} y={668} scale={0.6} />

        {/* In the distance: the sick friend in his stall, and the man walking away */}
        <StableBack x={160} y={700} width={520} scale={0.6} />
        <Horse x={330} y={696} scale={0.38} variant="friend" headAngle={34} eyeLid={0.5} breathOffset={60} />
        <StableFront x={160} y={700} width={520} scale={0.6} />
        <Farmer
          x={farmerX}
          y={712}
          scale={0.6}
          facing={-1}
          walkPhase={frame * 0.28}
          walkAmount={interpolate(frame, [36, 46], [0, 1], clamp)}
        />

        {/* He peeks from behind the barn */}
        <Horse
          x={interpolate(peek, [0, 1], [1640, 1400])}
          y={880}
          facing={-1}
          headAngle={Math.sin(frame / 14) * 3}
          eyeWide={0.3}
          breathOffset={5}
        />
        <Barn x={1600} y={900} scale={1.3} />
        <GrassTufts seed="celeiro" count={30} y={760} height={320} />
      </svg>
    </AbsoluteFill>
  );
};

const HOLE = { x: 1080, y: 740, rx: 180, ry: 38 };

const Hiding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const turn = spring({ frame: frame - 88, fps, config: { damping: 18 } });
  const heroX = interpolate(frame, [0, 86], [80, 1460], {
    ...clamp,
    easing: Easing.bezier(0.3, 0, 0.5, 1),
  });
  const friendX = interpolate(frame, [8, 100], [-320, 1080], {
    ...clamp,
    easing: Easing.bezier(0.3, 0, 0.5, 1),
  });
  const sink = interpolate(frame, [106, 130], [0, 440], {
    ...clamp,
    easing: Easing.bezier(0.5, 0, 0.75, 0.3),
  });
  const cover = interpolate(frame, [126, 140], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 17, 127, 144], [0, 1, 1, 0], clamp),
      }}
    >
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Sky stops={mixSky(SKY.afternoon, SKY.dusk, 0.65)} />
        <Sun x={560} y={500} r={80} color="#FFC98A" opacity={0.9} />
        <Landscape palette={LAND.dusk} horizon={530} ground={640} />
        <Tree x={300} y={650} scale={0.7} leaf="#7F7A4E" leafDark="#666340" />

        {/* Back lane: the friend, following slowly, then down into the hole */}
        <HoleBack {...HOLE} />
        <Horse
          x={friendX}
          y={HOLE.y + sink}
          scale={0.78}
          variant="friend"
          headAngle={32}
          eyeLid={0.45}
          walkPhase={frame * 0.2}
          walkAmount={interpolate(frame, [8, 14, 94, 102], [0, 1, 1, 0], clamp)}
          breathOffset={60}
        />
        <GroundFront {...HOLE} fill={LAND.dusk.grass} />
        <Branches
          x={HOLE.x}
          y={HOLE.y - 220 * (1 - cover)}
          scale={0.95}
          opacity={cover}
        />

        {/* Front lane: our horse leads the way, then turns to watch */}
        <Horse
          x={heroX}
          y={830}
          scale={0.9}
          facing={interpolate(turn, [0, 1], [1, -1])}
          walkPhase={frame * 0.3}
          walkAmount={interpolate(frame, [0, 6, 78, 90], [0, 1, 1, 0], clamp)}
          breathOffset={5}
        />
        <GrassTufts seed="esconder" count={34} y={780} height={300} color="#666340" />
      </svg>
    </AbsoluteFill>
  );
};

const TakingPlace: React.FC = () => {
  const frame = useCurrentFrame();

  const x = interpolate(frame, [4, 72], [-320, STABLE_HERO.x], {
    ...clamp,
    easing: Easing.bezier(0.25, 0, 0.45, 1),
  });

  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 17], [0, 1], clamp) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Sky stops={SKY.dusk} />
        <StableSetBack />
        <Horse
          {...STABLE_HERO}
          x={x}
          walkPhase={frame * 0.3}
          walkAmount={interpolate(frame, [4, 10, 62, 74], [0, 1, 1, 0], clamp)}
          headAngle={interpolate(frame, [80, 110], [0, 32], {
            ...clamp,
            easing: Easing.bezier(0.45, 0, 0.55, 1),
          })}
          eyeLid={interpolate(frame, [86, 112], [0, 0.45], clamp)}
          breathOffset={5}
        />
        <StableSetFront />
      </svg>
    </AbsoluteFill>
  );
};
