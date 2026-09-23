import React from "react";
import { Interactive, useCurrentFrame } from "remotion";
import { PIXEL_FONT } from "../theme";
import { PAL } from "./palette";

// RPG dialogue box. Every size and position is a multiple of 6px, so the
// box and the Press Start 2P glyphs (48px = 8 grid pixels) sit on the art grid.
const BOX = { left: 36, top: 828, width: 1848, height: 216 };

export const TextBox: React.FC<{
  from: number;
  lines: string[];
  speed?: number;
}> = ({ from, lines, speed = 2 }) => {
  const frame = useCurrentFrame() - from;
  if (frame < 0) {
    return null;
  }

  // Opens in three steps, like an old console.
  const step = frame < 2 ? 1 : frame < 4 ? 2 : 3;
  const height = (BOX.height / 3) * step;
  const top = BOX.top + (BOX.height - height) / 2;

  const total = lines.reduce((sum, l) => sum + l.length, 0);
  const typed = Math.max(0, Math.floor((frame - 5) / speed) + 1);
  let remaining = typed;
  const visible = lines.map((line) => {
    const part = line.slice(0, Math.max(0, remaining));
    remaining -= line.length;
    return part;
  });
  const done = typed >= total;

  return (
    <Interactive.Div
      name="Caixa de texto"
      style={{
        position: "absolute",
        left: BOX.left,
        top,
        width: BOX.width,
        height,
        backgroundColor: PAL.K,
        padding: 6,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: PAL.W,
          padding: 6,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: PAL.N,
          }}
        >
          {step === 3
            ? visible.map((text, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 42,
                    top: 24 + i * 72,
                    fontFamily: PIXEL_FONT,
                    fontSize: 48,
                    lineHeight: "48px",
                    color: PAL.W,
                    whiteSpace: "pre",
                  }}
                >
                  {text}
                </div>
              ))
            : null}
          {step === 3 && done && Math.floor(frame / 8) % 2 === 0 ? (
            <svg
              width={30}
              height={18}
              viewBox="0 0 5 3"
              shapeRendering="crispEdges"
              style={{ position: "absolute", right: 30, bottom: 24 }}
            >
              <rect x={0} y={0} width={5} height={1} fill={PAL.W} />
              <rect x={1} y={1} width={3} height={1} fill={PAL.W} />
              <rect x={2} y={2} width={1} height={1} fill={PAL.W} />
            </svg>
          ) : null}
        </div>
      </div>
    </Interactive.Div>
  );
};
