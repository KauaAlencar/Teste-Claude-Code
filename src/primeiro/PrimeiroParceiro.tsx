import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1Quarto } from "./scenes/Scene1Quarto";
import { Scene2Relogio } from "./scenes/Scene2Relogio";
import { Scene3Transicao } from "./scenes/Scene3Transicao";
import { Scene4Acorda } from "./scenes/Scene4Acorda";
import { Scene5Cidade } from "./scenes/Scene5Cidade";
import { Scene6Laboratorio } from "./scenes/Scene6Laboratorio";
import { Scene7Escolha } from "./scenes/Scene7Escolha";
import { Scene8Fumaca } from "./scenes/Scene8Fumaca";
import { Scene9Continua } from "./scenes/Scene9Continua";

// Part 1 (0–16s) is soft illustration, scene 3 (16–20s) turns it into pixels,
// part 2 (20–60s) is pixel art on a 320x180 grid. 1800 frames at 30 fps.
export const PrimeiroParceiro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000000" }}>
    <Series>
      <Series.Sequence name="1 Quarto à noite" durationInFrames={360}>
        <Scene1Quarto />
      </Series.Sequence>
      <Series.Sequence name="2 Relógio" durationInFrames={120}>
        <Scene2Relogio />
      </Series.Sequence>
      <Series.Sequence name="3 Pixelização" durationInFrames={120}>
        <Scene3Transicao />
      </Series.Sequence>
      <Series.Sequence name="4 Acordando" durationInFrames={240}>
        <Scene4Acorda />
      </Series.Sequence>
      <Series.Sequence name="5 Cidade" durationInFrames={240}>
        <Scene5Cidade />
      </Series.Sequence>
      <Series.Sequence name="6 Laboratório" durationInFrames={240}>
        <Scene6Laboratorio />
      </Series.Sequence>
      <Series.Sequence name="7 A escolha" durationInFrames={240}>
        <Scene7Escolha />
      </Series.Sequence>
      <Series.Sequence name="8 Fumacinha" durationInFrames={150}>
        <Scene8Fumaca />
      </Series.Sequence>
      <Series.Sequence name="9 Continua" durationInFrames={90}>
        <Scene9Continua />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
