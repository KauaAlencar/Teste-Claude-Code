import React from "react";
import {
  AbsoluteFill,
  Easing,
  getStaticFiles,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Bedroom, LAMP_SWITCH } from "../illustrated/Bedroom";
import { HeroBust } from "../illustrated/HeroBust";
import { HeroInBed, LIE_ANGLE } from "../illustrated/HeroInBed";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) } as const;

// Shot A (0–4s): brushing his teeth in front of the mirror.
const Brushing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <HeroBust
        brush={Math.sin((frame / fps) * Math.PI * 2 * 3.2) * 16}
        blink={frame >= 50 && frame < 55 ? 1 : 0}
        foam={interpolate(frame, [0, 60], [0.3, 1], clamp)}
      />
    </AbsoluteFill>
  );
};

// Shot B (4–12s): lies down, pulls the blanket, switches off the lamp.
const GoingToBed: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const angle = interpolate(f, [22, 62], [0, LIE_ANGLE], smooth);
  const blanketEdge = interpolate(f, [70, 108], [430, 640], smooth);
  const lamp = interpolate(f, [142, 147], [1, 0], clamp);

  // Where his left hand goes, frame by frame
  const lying = { x: 420, y: 546 };
  const rest = { x: 470, y: 522 };
  const lampSwitch = { x: LAMP_SWITCH.x - 4, y: LAMP_SWITCH.y + 12 };
  let hand = { x: 340, y: 560 };
  let bend: "up" | "down" = "down";
  if (f >= 22 && f < 70) {
    const t = interpolate(f, [22, 62], [0, 1], smooth);
    hand = { x: 340 + (lying.x - 340) * t, y: 560 + (lying.y - 560) * t };
    bend = t > 0.5 ? "up" : "down";
  } else if (f >= 70 && f < 112) {
    hand = { x: blanketEdge - 14, y: 546 - ((blanketEdge - 430) / 210) * 48 };
    bend = "up";
  } else if (f >= 112) {
    const reach = interpolate(f, [112, 138], [0, 1], smooth);
    const back = interpolate(f, [152, 184], [0, 1], smooth);
    const start = { x: 626, y: 498 };
    hand = {
      x: start.x + (lampSwitch.x - start.x) * reach + (rest.x - lampSwitch.x) * back,
      y: start.y + (lampSwitch.y - start.y) * reach + (rest.y - lampSwitch.y) * back,
    };
    // The arm is straight at the switch, so the elbow can change side unnoticed.
    bend = f < 146 ? "up" : "down";
  }

  const blink = (f >= 12 && f < 16) || (f >= 90 && f < 94);
  const eyesClosed = f > 186 || blink ? 1 : 0;
  const breath = angle > 60 ? Math.sin((f / fps) * Math.PI * 2 * 0.3) * 4 : 0;

  return (
    <AbsoluteFill>
      <Bedroom lamp={lamp} night={1} sun={0} clock="23:00">
        <HeroInBed
          angle={angle}
          blanketEdge={blanketEdge}
          hand={hand}
          bend={bend}
          eyesClosed={eyesClosed}
          breath={breath}
        />
      </Bedroom>
    </AbsoluteFill>
  );
};

export const Scene1Quarto: React.FC = () => {
  const frame = useCurrentFrame();
  // Optional: a real clip replaces the illustration when public/dormindo.mp4 exists.
  const hasClip = getStaticFiles().some((file) => file.name === "dormindo.mp4");
  if (hasClip) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000000" }}>
        <OffthreadVideo src={staticFile("dormindo.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1030" }}>
      <Sequence name="Escovando os dentes" durationInFrames={128} layout="none">
        <Brushing />
      </Sequence>
      <Sequence name="Indo dormir" from={112} durationInFrames={248}>
        <AbsoluteFill style={{ opacity: interpolate(frame, [112, 128], [0, 1], clamp) }}>
          <GoingToBed />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
