import React from "react";
import { drawHero, walkFrame } from "../pixel/characters";
import { Ctx, isBlinking } from "../pixel/draw";
import { blockWipe, PixelCanvas, wipeProgress } from "../pixel/PixelCanvas";
import { TextBox } from "../pixel/TextBox";
import { drawTown, TOWN_FEET, TOWN_WIDTH } from "../pixel/world";

const DOOR_X = 670;

// 28–36s: running through the town, the camera follows him sideways.
const draw = (ctx: Ctx, f: number) => {
  const heroX = Math.min(DOOR_X, 40 + f * 4);
  const cam = Math.max(0, Math.min(TOWN_WIDTH - 320, heroX - 120));
  drawTown(ctx, cam, f);
  const running = heroX < DOOR_X;
  drawHero(ctx, {
    x: heroX - cam - 16,
    y: TOWN_FEET - 31,
    pose: "side",
    walk: running ? walkFrame(f, 3) : 1,
    blink: !running && isBlinking(f, 50, 4),
  });
  blockWipe(ctx, wipeProgress(f, 232));
};

export const Scene5Cidade: React.FC = () => (
  <PixelCanvas draw={draw}>
    <TextBox from={156} lines={["Talvez alguém aqui", "saiba explicar..."]} />
  </PixelCanvas>
);
