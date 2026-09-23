import React from "react";
import { drawBrasa, drawHero } from "../pixel/characters";
import { Ctx, dither, isBlinking, rect, sprite } from "../pixel/draw";
import { PixelCanvas } from "../pixel/PixelCanvas";
import { SPRITES } from "../pixel/sprites";
import { TextBox } from "../pixel/TextBox";
import { drawLab, EGGS, LAB_FEET, TABLE_TOP } from "../pixel/world";
import { HERO_IN_LAB, PROF_IN_LAB } from "./Scene6Laboratorio";

const HOLD_HANDS = SPRITES.HERO_FRONT_HOLD.slice(5, 8);
const EGG_END = 112;
const BRASA_ON_TABLE = { x: 104, y: TABLE_TOP - 24 };
// Where Brasinha sits when held: flame tip below his eyes, body in his arms.
export const BRASA_IN_ARMS = { x: HERO_IN_LAB.x + 4, y: HERO_IN_LAB.y + 7 };

// Moves in whole pixels, updating every `every` frames: sprite-style motion.
const stepped = (f: number, every = 2) => Math.floor(f / every) * every;

export const drawHearts = (ctx: Ctx, f: number, start: number, cx: number, top: number) => {
  for (let k = 0; k * 12 <= f - start; k++) {
    const age = f - start - k * 12;
    if (age > 36 || (age > 28 && Math.floor(age / 2) % 2 === 0)) {
      continue;
    }
    const hx = cx - 12 + ((k * 13) % 26);
    sprite(ctx, SPRITES.HEART, hx, top - Math.floor(age / 2));
  }
};

// 44–52s: a capsule trembles, rolls, opens, and Brasinha jumps into his arms.
const draw = (ctx: Ctx, f: number) => {
  const opened = f >= 74;
  drawLab(ctx, f, { eggs: [false, true, true] });
  sprite(ctx, SPRITES.PROF_IDLE, PROF_IN_LAB.x, PROF_IN_LAB.y, {
    blink: isBlinking(f, 80, 4, 20),
  });
  if (f >= 78 && f < 100) {
    sprite(ctx, SPRITES.BANG_SMALL, PROF_IN_LAB.x + 8, PROF_IN_LAB.y - 10);
  }

  // The capsule: trembles, then rolls to the edge of the table
  if (!opened) {
    const shake = f < 46 ? (Math.floor(f / 2) % 2 === 0 ? 1 : -1) * (f > 20 || f % 8 < 4 ? 1 : 0) : 0;
    const roll = f >= 46 ? Math.min(EGGS[0] - EGG_END, Math.floor((f - 46) / 2)) : 0;
    const bob = f >= 46 && Math.floor(f / 4) % 2 === 0 ? -1 : 0;
    sprite(ctx, SPRITES.EGG, EGGS[0] - roll + shake, TABLE_TOP - 16 + bob);
  } else {
    sprite(ctx, SPRITES.EGG_BOTTOM, EGG_END, TABLE_TOP - 8);
    // The lid flies off and lands on the floor
    const t = stepped(f - 74);
    if (t < 30) {
      const lx = EGG_END - t;
      const ly = TABLE_TOP - 22 - Math.floor(t * 1.4) + Math.floor((t * t) / 7);
      sprite(ctx, SPRITES.EGG_TOP, lx, Math.min(ly, LAB_FEET - 6));
    } else {
      sprite(ctx, SPRITES.EGG_TOP, EGG_END - 30, LAB_FEET - 6);
    }
  }

  // Brasinha: appears, looks at him, blinks, jumps
  const landed = f >= 134;
  if (opened && !landed) {
    let x = BRASA_ON_TABLE.x;
    let y = BRASA_ON_TABLE.y;
    if (f >= 112) {
      const t = Math.min(1, stepped(f - 112) / 22);
      x = Math.round(BRASA_ON_TABLE.x + (BRASA_IN_ARMS.x - BRASA_ON_TABLE.x) * t);
      y = Math.round(BRASA_ON_TABLE.y + (BRASA_IN_ARMS.y - BRASA_ON_TABLE.y) * t - Math.sin(t * Math.PI) * 26);
    }
    const mood = f < 84 ? "idle" : f >= 98 && f < 103 ? "blink" : f < 112 ? "lookLeft" : "happy";
    drawBrasa(ctx, { x, y, mood, frame: f });
  }

  // Our hero: sideways until he catches Brasinha, then facing us, hugging it
  if (!landed) {
    drawHero(ctx, {
      ...HERO_IN_LAB,
      pose: "side",
      walk: 1,
      blink: isBlinking(f, 60, 4, 10),
    });
  } else {
    drawHero(ctx, { ...HERO_IN_LAB, pose: "hold", blink: isBlinking(f, 60, 4, 10) });
    drawBrasa(ctx, { ...BRASA_IN_ARMS, mood: "happy", frame: f });
    sprite(ctx, HOLD_HANDS, HERO_IN_LAB.x, HERO_IN_LAB.y + 21);
    drawHearts(ctx, f, 138, HERO_IN_LAB.x + 16, HERO_IN_LAB.y + 2);
  }

  // White flash when the capsule opens
  if (f >= 74 && f < 77) {
    rect(ctx, 0, 0, 320, 180, "W");
  } else if (f >= 77 && f < 81) {
    dither(ctx, 0, 0, 320, 180, "W", f % 2);
  }
};

export const Scene7Escolha: React.FC = () => (
  <PixelCanvas draw={draw}>
    <TextBox from={150} lines={["Parece que ELE", "escolheu VOCÊ."]} />
  </PixelCanvas>
);
