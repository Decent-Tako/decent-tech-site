import { motion, useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { KEYFRAMES_DEFAULTS } from './defaults';
import { KeyframeFrame } from './Frame';
import {
  KEYFRAME_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
  type TweenEase,
} from './source';

export type KeyframesProps = {
  duration?: number;
  speed?: number;
  scaleTo?: number;
  rotateTo?: number;
  repeatDelay?: number;
  ease?: TweenEase;
  size?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function Keyframes({
  duration = KEYFRAMES_DEFAULTS.duration,
  speed = KEYFRAMES_DEFAULTS.speed,
  scaleTo = KEYFRAMES_DEFAULTS.scaleTo,
  rotateTo = KEYFRAMES_DEFAULTS.rotateTo,
  repeatDelay = KEYFRAMES_DEFAULTS.repeatDelay,
  ease = KEYFRAMES_DEFAULTS.ease,
  size = KEYFRAMES_DEFAULTS.size,
  caption = KEYFRAMES_DEFAULTS.caption,
  paused: pausedProp = KEYFRAMES_DEFAULTS.paused,
  reducedMotion = KEYFRAMES_DEFAULTS.reducedMotion,
  replayNonce = KEYFRAMES_DEFAULTS.replayNonce,
}: KeyframesProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const running = !paused && !reduce;
  const example = KEYFRAME_EXAMPLES.keyframes;
  const effectiveDuration = duration / Math.max(speed, 0.1);

  return (
    <KeyframeFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The box stays 100 by 100 pixels at the upstream default so the scale-2 keyframe still fits a 16 rem stage. times [0, 0.2, 0.5, 0.8, 1] stay fixed because they are the rhythm of the morph, not a visual colour. This loop is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="kf-keyframes"
      running={running}
      runId={replayNonce}
    >
      <motion.div
        className="kf__box kf__box--yellow"
        role="img"
        aria-label={caption}
        style={{ '--kf-size': `${size}px` } as CSSProperties}
        animate={
          running
            ? {
                scale: [1, scaleTo, scaleTo, 1, 1],
                rotate: [0, 0, rotateTo, rotateTo, 0],
                borderRadius: ['0%', '0%', '50%', '50%', '0%'],
              }
            : { scale: 1, rotate: 0, borderRadius: '0%' }
        }
        transition={
          running
            ? {
                duration: effectiveDuration,
                ease,
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay,
              }
            : { duration: 0 }
        }
      >
        {caption}
      </motion.div>
    </KeyframeFrame>
  );
}
