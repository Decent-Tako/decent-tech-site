import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { THREE_DOTS_PULSE_DEFAULTS } from './defaults';
import { LoadingFrame } from './Frame';
import {
  LOADING_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type ThreeDotsPulseProps = {
  duration?: number;
  speed?: number;
  scaleTo?: number;
  staggerChildren?: number;
  staggerDirection?: -1 | 1;
  ease?: 'easeInOut' | 'easeOut' | 'linear';
  count?: number;
  size?: number;
  gap?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function ThreeDotsPulse({
  duration = THREE_DOTS_PULSE_DEFAULTS.duration,
  speed = THREE_DOTS_PULSE_DEFAULTS.speed,
  scaleTo = THREE_DOTS_PULSE_DEFAULTS.scaleTo,
  staggerChildren = THREE_DOTS_PULSE_DEFAULTS.staggerChildren,
  staggerDirection: staggerDirectionProp = THREE_DOTS_PULSE_DEFAULTS.staggerDirection,
  ease = THREE_DOTS_PULSE_DEFAULTS.ease,
  count = THREE_DOTS_PULSE_DEFAULTS.count,
  size = THREE_DOTS_PULSE_DEFAULTS.size,
  gap = THREE_DOTS_PULSE_DEFAULTS.gap,
  caption = THREE_DOTS_PULSE_DEFAULTS.caption,
  paused: pausedProp = THREE_DOTS_PULSE_DEFAULTS.paused,
  reducedMotion = THREE_DOTS_PULSE_DEFAULTS.reducedMotion,
  replayNonce = THREE_DOTS_PULSE_DEFAULTS.replayNonce,
}: ThreeDotsPulseProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const running = !paused && !reduce;
  const example = LOADING_EXAMPLES.threeDotsPulse;
  const dots = Math.max(1, Math.round(count));
  const effectiveDuration = duration / Math.max(speed, 0.1);
  const staggerDirection = Number(staggerDirectionProp) === 1 ? 1 : -1;

  const dotVariants: Variants = {
    rest: { scale: 1 },
    pulse: {
      scale: [1, scaleTo, 1],
      transition: {
        duration: effectiveDuration,
        repeat: Infinity,
        ease,
      },
    },
  };

  return (
    <LoadingFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      fixedNote="Three 20 px dots and a 20 px gap are the upstream default. The rest variant is catalogue-only so Pause can sit the dots at scale 1. This loop is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="loading-three-dots-pulse"
      running={running}
      runId={replayNonce}
    >
      <motion.div
        role="status"
        aria-label={caption}
        className="loading__dots"
        animate={running ? 'pulse' : 'rest'}
        transition={{ staggerChildren, staggerDirection }}
        style={
          {
            '--loading-size': `${size}px`,
            '--loading-gap': `${gap}px`,
          } as CSSProperties
        }
      >
        {Array.from({ length: dots }, (_, index) => (
          <motion.div
            key={index}
            className="loading__dot"
            variants={dotVariants}
            aria-hidden="true"
          />
        ))}
      </motion.div>
      <p className="loading__caption">{caption}</p>
    </LoadingFrame>
  );
}
