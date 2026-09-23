import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";
import { AbsoluteFill } from "remotion";
import { fadeThroughBlack } from "./fadeThroughBlack";
import { Scene1Abertura } from "./scenes/Scene1Abertura";
import { Scene2Fazenda } from "./scenes/Scene2Fazenda";
import { Scene3Tentativa } from "./scenes/Scene3Tentativa";
import { Scene4Buraco } from "./scenes/Scene4Buraco";
import { Scene5Plano } from "./scenes/Scene5Plano";
import { Scene6Troca } from "./scenes/Scene6Troca";
import { Scene7Estrela } from "./scenes/Scene7Estrela";
import { Scene8Encerramento } from "./scenes/Scene8Encerramento";

// Every transition lasts 30 frames and is centred on the scene boundary from the
// script, so each scene is 15 frames longer on each side it shares a transition.
// Total: 2460 frames of scenes - 7 × 30 frames of overlap = 2250 frames (75 s).
export const Fable: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000000" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 Abertura" durationInFrames={255}>
        <Scene1Abertura />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="2 Fazenda" durationInFrames={330}>
        <Scene2Fazenda />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="3 Tentativa" durationInFrames={270}>
        <Scene3Tentativa />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fadeThroughBlack()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="4 Buraco" durationInFrames={390}>
        <Scene4Buraco />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fadeThroughBlack()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="5 Plano" durationInFrames={390}>
        <Scene5Plano />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="6 Troca" durationInFrames={390}>
        <Scene6Troca />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="7 Estrela" durationInFrames={270}>
        <Scene7Estrela />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence name="8 Encerramento" durationInFrames={165}>
        <Scene8Encerramento />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
