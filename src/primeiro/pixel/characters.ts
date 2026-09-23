import { Ctx, sprite } from "./draw";
import { SPRITES } from "./sprites";

export type HeroPose = "front" | "handsUp" | "hold" | "laugh" | "laughHold" | "side";

const WALK = [
  SPRITES.HERO_SIDE_WALK0,
  SPRITES.HERO_SIDE_WALK1,
  SPRITES.HERO_SIDE_WALK2,
  SPRITES.HERO_SIDE_WALK3,
];

// 4-frame walk: returns the frame index for a walk that changes pose every `hold` frames.
export const walkFrame = (frame: number, hold = 4) => Math.floor(frame / hold) % 4;

// (x, y) is the top-left corner of the 32x32 sprite.
export const drawHero = (
  ctx: Ctx,
  {
    x,
    y,
    pose,
    walk = 0,
    flip = false,
    blink = false,
  }: {
    x: number;
    y: number;
    pose: HeroPose;
    walk?: number;
    flip?: boolean;
    blink?: boolean;
  },
) => {
  if (pose === "side") {
    const bob = walk % 2 === 1 ? -1 : 0;
    sprite(ctx, SPRITES.HERO_SIDE_HEAD, x, y + bob, { flip, blink });
    sprite(ctx, WALK[walk % 4], x, y + 18 + bob, { flip });
    return;
  }
  const head =
    pose === "laugh" || pose === "laughHold" ? SPRITES.HERO_LAUGH_HEAD : SPRITES.HERO_FRONT_HEAD;
  const body =
    pose === "handsUp"
      ? SPRITES.HERO_FRONT_HANDSUP
      : pose === "hold" || pose === "laughHold"
        ? SPRITES.HERO_FRONT_HOLD
        : SPRITES.HERO_FRONT_BODY;
  sprite(ctx, head, x, y, { flip, blink });
  sprite(ctx, body, x, y + 16, { flip });
};

export type BrasaMood = "idle" | "blink" | "lookLeft" | "happy" | "puff" | "cough" | "shy";

const BODIES: Record<BrasaMood, readonly string[]> = {
  idle: SPRITES.BRASA_BODY,
  blink: SPRITES.BRASA_BLINK,
  lookLeft: SPRITES.BRASA_LOOKL,
  happy: SPRITES.BRASA_HAPPY,
  puff: SPRITES.BRASA_PUFF,
  cough: SPRITES.BRASA_COUGH,
  shy: SPRITES.BRASA_SHY,
};
const FLAMES = [SPRITES.FLAME_A, SPRITES.FLAME_B, SPRITES.FLAME_C];

// Brasinha, 24x24 (the top 6 rows are empty). The flame tuft flickers through three frames.
export const drawBrasa = (
  ctx: Ctx,
  {
    x,
    y,
    mood = "idle",
    frame,
    flip = false,
    flicker = 4,
  }: {
    x: number;
    y: number;
    mood?: BrasaMood;
    frame: number;
    flip?: boolean;
    flicker?: number;
  },
) => {
  const flame = FLAMES[Math.floor(frame / flicker) % 3];
  sprite(ctx, flame, x, y + 6, { flip });
  sprite(ctx, BODIES[mood], x, y + 12, { flip });
};
