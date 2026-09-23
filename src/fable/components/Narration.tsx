import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { SERIF } from "../theme";

const Caption: React.FC<{ durationInFrames: number; children: React.ReactNode }> = ({
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 84 }}>
      <Interactive.Div
        name="Legenda"
        style={{
          opacity: interpolate(
            frame,
            [0, 22, durationInFrames - 16, durationInFrames],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 0, 0.2, 1),
            },
          ),
          translate: interpolate(frame, [0, 22], ["0px 16px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          maxWidth: 1580,
          padding: "22px 64px 28px",
          borderRadius: 30,
          backgroundColor: "rgba(30, 17, 10, 0.58)",
          boxShadow: "0 12px 40px rgba(20, 10, 5, 0.25)",
          color: "#FFF4E2",
          fontFamily: SERIF,
          fontSize: 58,
          fontWeight: 600,
          lineHeight: 1.25,
          textAlign: "center",
          textWrap: "balance",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
        }}
      >
        {children}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// A narration line shown between `from` and `to` (frames local to the scene).
export const Narration: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({
  from,
  to,
  children,
}) => (
  <Sequence name="Narração" from={from} durationInFrames={to - from} layout="none">
    <Caption durationInFrames={to - from}>{children}</Caption>
  </Sequence>
);
