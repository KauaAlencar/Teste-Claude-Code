import React from "react";
import { drawHero, walkFrame } from "../pixel/characters";
import { Ctx, isBlinking, sprite } from "../pixel/draw";
import { blockWipe, PixelCanvas, wipeProgress } from "../pixel/PixelCanvas";
import { SPRITES } from "../pixel/sprites";
import { TextBox } from "../pixel/TextBox";
import { drawLab, LAB_FEET } from "../pixel/world";

export const HERO_IN_LAB = { x: 52, y: LAB_FEET - 31 };
export const PROF_IN_LAB = { x: 230, y: LAB_FEET - 4 - 27 };

// 36–44s: inside the laboratory, the professor points at three capsules.
const draw = (ctx: Ctx, f: number) => {
  drawLab(ctx, f);
  sprite(ctx, f < 58 ? SPRITES.PROF_IDLE : SPRITES.PROF_POINT, PROF_IN_LAB.x, PROF_IN_LAB.y, {
    blink: isBlinking(f, 80, 4, 20),
  });
  const x = Math.min(HERO_IN_LAB.x, -32 + f * 2);
  const walking = x < HERO_IN_LAB.x;
  drawHero(ctx, {
    x,
    y: HERO_IN_LAB.y,
    pose: "side",
    walk: walking ? walkFrame(f, 4) : 1,
    blink: !walking && isBlinking(f, 60, 4, 10),
  });
  blockWipe(ctx, 1 - wipeProgress(f, 0));
};

export const Scene6Laboratorio: React.FC = () => (
  <PixelCanvas draw={draw}>
    <TextBox from={72} lines={["Escolha seu primeiro", "parceiro."]} />
  </PixelCanvas>
);
