import React from "react";
import { drawBrasa, drawHero } from "../pixel/characters";
import { Ctx, isBlinking, px, sprite } from "../pixel/draw";
import { blockWipe, PixelCanvas, wipeProgress } from "../pixel/PixelCanvas";
import { SPRITES } from "../pixel/sprites";
import { TextBox } from "../pixel/TextBox";
import { drawLab, LAB_FEET } from "../pixel/world";
import { HERO_IN_LAB, PROF_IN_LAB } from "./Scene6Laboratorio";
import { BRASA_IN_ARMS } from "./Scene7Escolha";

const HOLD_HANDS = SPRITES.HERO_FRONT_HOLD.slice(5, 8);
const FLOOR_SPOT = { x: 90, y: LAB_FEET - 23 };

// 52–57s: Brasinha tries to breathe fire... and only a puff of smoke comes out.
const draw = (ctx: Ctx, f: number) => {
  drawLab(ctx, f, { eggs: [false, true, true] });
  sprite(ctx, SPRITES.PROF_IDLE, PROF_IN_LAB.x, PROF_IN_LAB.y, {
    blink: isBlinking(f, 80, 4, 20),
  });

  // Hero: holding, then free, then laughing (bouncing a pixel)
  const laughing = f >= 66;
  const bounce = laughing && Math.floor(f / 4) % 2 === 0 ? -1 : 0;
  drawHero(ctx, {
    x: HERO_IN_LAB.x,
    y: HERO_IN_LAB.y + bounce,
    pose: f < 10 ? "hold" : laughing ? "laugh" : "front",
    blink: !laughing && isBlinking(f, 50, 4, 30),
  });

  // Brasinha hops down in front of him
  let bx = FLOOR_SPOT.x;
  let by = FLOOR_SPOT.y;
  if (f < 12) {
    const t = Math.floor(f / 2) / 6;
    bx = Math.round(BRASA_IN_ARMS.x + (FLOOR_SPOT.x - BRASA_IN_ARMS.x) * t);
    by = Math.round(BRASA_IN_ARMS.y + (FLOOR_SPOT.y - BRASA_IN_ARMS.y) * t - Math.sin(t * Math.PI) * 12);
  }
  let mood: "happy" | "idle" | "puff" | "cough" | "shy" = "happy";
  let flicker = 4;
  if (f >= 20 && f < 50) {
    // Puffs up, proud, shaking with effort
    mood = "puff";
    flicker = 2;
    bx += Math.floor(f / 2) % 2 === 0 ? 1 : 0;
  } else if (f >= 50 && f < 84) {
    mood = "cough";
    by -= Math.floor(f / 4) % 2 === 0 ? 1 : 0;
  } else if (f >= 84) {
    mood = "shy";
  } else if (f >= 12) {
    mood = "idle";
  }
  drawBrasa(ctx, { x: bx, y: by, mood, frame: f, flicker });
  if (f < 10) {
    sprite(ctx, HOLD_HANDS, HERO_IN_LAB.x, HERO_IN_LAB.y + 21);
  }

  // ...only a little grey puff
  if (f >= 50 && f < 53) {
    sprite(ctx, SPRITES.SMOKE_1, bx + 10, by + 17);
  } else if (f >= 53 && f < 58) {
    sprite(ctx, SPRITES.SMOKE_2, bx + 8, by + 13);
  } else if (f >= 58 && f < 100 && !(f > 92 && Math.floor(f / 2) % 2 === 0)) {
    sprite(ctx, SPRITES.SMOKE_3, bx + 6, by + 6 - Math.floor((f - 58) / 3));
  }

  // Embarrassed: a sweat drop
  if (f >= 88) {
    px(ctx, bx + 20, by + 13, "L");
    px(ctx, bx + 20, by + 14, "L");
    px(ctx, bx + 19, by + 15, "L");
    px(ctx, bx + 20, by + 15, "W");
  }

  blockWipe(ctx, wipeProgress(f, 142));
};

export const Scene8Fumaca: React.FC = () => (
  <PixelCanvas draw={draw}>
    <TextBox from={88} lines={["...Vamos treinar isso."]} />
  </PixelCanvas>
);
