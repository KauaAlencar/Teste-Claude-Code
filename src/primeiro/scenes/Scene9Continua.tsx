import React from "react";
import { Interactive, useCurrentFrame } from "remotion";
import { drawBrasa, drawHero, walkFrame } from "../pixel/characters";
import { Ctx } from "../pixel/draw";
import { blockWipe, PixelCanvas, wipeProgress } from "../pixel/PixelCanvas";
import { PAL } from "../pixel/palette";
import { drawSunriseRoad } from "../pixel/world";
import { PIXEL_FONT } from "../theme";

// 57–60s: wide shot, both of them heading for the road and the sunrise.
const draw = (ctx: Ctx, f: number) => {
  drawSunriseRoad(ctx, f);
  const x = 60 + Math.floor(f * 0.6);
  drawBrasa(ctx, {
    x: x - 22,
    y: 168 - 23 - (Math.floor(f / 6) % 2 === 0 ? 2 : 0),
    mood: "happy",
    frame: f,
  });
  drawHero(ctx, { x, y: 168 - 31, pose: "side", walk: walkFrame(f, 5) });
  blockWipe(ctx, 1 - wipeProgress(f, 0));
};

const Continua: React.FC = () => {
  const frame = useCurrentFrame();
  const text = "CONTINUA...";
  const typed = Math.max(0, Math.min(text.length, Math.floor((frame - 30) / 3) + 1));
  return (
    <Interactive.Div
      name="CONTINUA"
      style={{
        position: "absolute",
        left: 432,
        top: 204,
        fontFamily: PIXEL_FONT,
        fontSize: 96,
        lineHeight: "96px",
        color: PAL.W,
        textShadow: `12px 12px 0 ${PAL.K}`,
        whiteSpace: "pre",
      }}
    >
      {frame >= 30 ? text.slice(0, typed) : ""}
    </Interactive.Div>
  );
};

export const Scene9Continua: React.FC = () => (
  <PixelCanvas draw={draw}>
    <Continua />
  </PixelCanvas>
);
