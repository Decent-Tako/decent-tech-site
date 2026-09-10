import { motion, useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { CIRCLE_SPINNER_DEFAULTS } from './defaults';
import { LoadingFrame } from './Frame';
import {
  LOADING_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type CircleSpinnerProps = {
  duration?: number;
  speed?: number;
  size?: number;
  borderWidth?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function CircleSpinner({
  duration = CIRCLE_SPINNER_DEFAULTS.duration,
  speed = CIRCLE_SPINNER_DEFAULTS.speed,
  size = CIRCLE_SPINNER_DEFAULTS.size,
  borderWidth = CIRCLE_SPINNER_DEFAULTS.borderWidth,
  caption = CIRCLE_SPINNER_DEFAULTS.caption,
  paused: pausedProp = CIRCLE_SPINNER_DEFAULTS.paused,
  reducedMotion = CIRCLE_SPINNER_DEFAULTS.reducedMotion,
  replayNonce = CIRCLE_SPINNER_DEFAULTS.replayNonce,
}: CircleSpinnerProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const running = !paused && !reduce;
  const example = LOADING_EXAMPLES.circleSpinner;

  return (
    <LoadingFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      fixedNote="The spinner stays 50 by 50 pixels at the upstream default so the 4 px top border reads as a stroke, not a filled disc. will-change: transform is the upstream performance hint. It is not a visual parameter. This loop is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="loading-circle-spinner"
      running={running}
      runId={replayNonce}
    >
      <div
        role="status"
        aria-label={caption}
        style={
          {
            '--loading-size': `${size}px`,
            '--loading-border': `${borderWidth}px`,
          } as CSSProperties
        }
      >
        <motion.div
          className="loading__spinner"
          aria-hidden="true"
          animate={
            running
              ? { transform: 'rotate(360deg)' }
              : { transform: 'rotate(0deg)' }
          }
          transition={
            running
              ? {
                  duration: duration / Math.max(speed, 0.1),
                  repeat: Infinity,
                  ease: 'linear',
                }
              : { duration: 0 }
          }
        />
      </div>
      <p className="loading__caption">{caption}</p>
    </LoadingFrame>
  );
}
