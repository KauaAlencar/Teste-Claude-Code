import React from "react";
import { StableBack, StableFront, HayBale } from "./Barn";
import { GrassTufts, LAND, Landscape, Tree } from "./Scenery";

// Close-up of the stable at dusk. Scenes 6 and 7 share this exact framing,
// so the crossfade between them lines up.
export const STABLE_HERO = { x: 1180, y: 792, scale: 0.85 };

export const StableSetBack: React.FC = () => (
  <g>
    <Landscape palette={LAND.dusk} horizon={520} ground={640} />
    <Tree x={120} y={660} scale={0.8} leaf="#7F7A4E" leafDark="#666340" />
    <Tree x={1800} y={650} scale={0.7} leaf="#7F7A4E" leafDark="#666340" />
    <StableBack x={260} y={800} width={1120} scale={1.25} />
  </g>
);

export const StableSetFront: React.FC = () => (
  <g>
    <StableFront x={260} y={800} width={1120} scale={1.25} />
    <HayBale x={1790} y={830} scale={0.9} />
    <GrassTufts seed="estabulo" count={30} y={820} height={260} color="#666340" />
  </g>
);
