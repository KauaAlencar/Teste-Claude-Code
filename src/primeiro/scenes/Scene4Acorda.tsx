import React from "react";
import { drawHero, walkFrame } from "../pixel/characters";
import { Ctx, isBlinking, px, rect, sprite } from "../pixel/draw";
import { PixelCanvas } from "../pixel/PixelCanvas";
import { SPRITES } from "../pixel/sprites";
import { TextBox } from "../pixel/TextBox";
import { drawRoom, drawWindowView } from "../pixel/world";

// 20–28s: he wakes up in the pixel world, looks at his hands, runs to the window.
const draw = (ctx: Ctx, f: number) => {
  if (f >= 172) {
    drawWindowView(ctx, f);
    return;
  }

  const blink = isBlinking(f, 70, 4, 30);
  if (f < 26) {
    drawRoom(ctx, f, { hero: "lying", eyesClosed: f < 16 || (f >= 20 && f < 23) });
  } else if (f < 30) {
    // Halfway up
    drawRoom(ctx, f, { hero: "sitting", heroDy: 5 });
  } else if (f < 56) {
    drawRoom(ctx, f, { hero: "sitting", blink });
  } else if (f < 124) {
    // Looking at his pixel hands, trembling a little
    const shake = f < 88 && Math.floor(f / 3) % 2 === 0 ? 1 : 0;
    drawRoom(ctx, f, { hero: "handsUp", heroDx: shake, blink });
  } else {
    drawRoom(ctx, f, { hero: "none" });
  }

  // Snoring "z"s while he sleeps
  if (f < 16) {
    for (let k = 0; k < 2; k++) {
      const age = (f + k * 8) % 16;
      const zx = 124 + k * 5 + Math.floor(age / 4);
      const zy = 80 - Math.floor(age / 2);
      rect(ctx, zx, zy, 3, 1, "N");
      px(ctx, zx + 1, zy + 1, "N");
      rect(ctx, zx, zy + 2, 3, 1, "N");
    }
  }

  // A huge "!" pops over his head, the old-game way
  if (f >= 88 && f < 124) {
    if (f < 91) {
      sprite(ctx, SPRITES.BANG_SMALL, 114, 60);
    } else {
      const bob = Math.floor((f - 91) / 5) % 2;
      sprite(ctx, SPRITES.BANG_BIG, 111, 54 - bob);
    }
  }

  // Jumps out of bed and runs to the window
  if (f >= 124) {
    const x = Math.min(198, 122 + Math.floor((f - 124) * 2.4));
    const running = x < 198;
    drawHero(ctx, {
      x,
      y: 132 - 31,
      pose: "side",
      walk: running ? walkFrame(f, 3) : 1,
      blink: !running && isBlinking(f, 40, 4),
    });
  }
};

export const Scene4Acorda: React.FC = () => (
  <PixelCanvas draw={draw}>
    <TextBox from={96} lines={["O QUE... ESTÁ", "ACONTECENDO?!"]} />
  </PixelCanvas>
);
