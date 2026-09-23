import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

type FadeThroughBlackProps = Record<string, never>;

// The outgoing scene fades out during the first half, the incoming one fades
// in during the second half. The black background of the video shows between.
const FadeThroughBlack: React.FC<
  TransitionPresentationComponentProps<FadeThroughBlackProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const opacity =
    presentationDirection === "exiting"
      ? interpolate(presentationProgress, [0, 0.5], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(presentationProgress, [0.5, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const fadeThroughBlack = (): TransitionPresentation<FadeThroughBlackProps> => ({
  component: FadeThroughBlack,
  props: {},
});
