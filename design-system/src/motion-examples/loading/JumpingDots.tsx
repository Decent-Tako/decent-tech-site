import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { JUMPING_DOTS_DEFAULTS } from './defaults';
import { LoadingFrame } from './Frame';
import {
  LOADING_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type JumpingDotsProps = {
  duration?: number;
  speed?: number;
  jump?: number;
  staggerChildren?: number;
  staggerDirection?: -1 | 1;
  ease?: 'easeInOut' | 'easeOut' | 'linear';
  repeatType?: 'mirror' | 'reverse' | 'loop';
  count?: number;
  size?: number;
  gap?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function JumpingDots({
  duration = JUMPING_DOTS_DEFAULTS.duration,
  speed = JUMPING_DOTS_DEFAULTS.speed,
  jump = JUMPING_DOTS_DEFAULTS.jump,
  staggerChildren = JUMPING_DOTS_DEFAULTS.staggerChildren,
  staggerDirection: staggerDirectionProp = JUMPING_DOTS_DEFAULTS.staggerDirection,
  ease = JUMPING_DOTS_DEFAULTS.ease,
  repeatType = JUMPING_DOTS_DEFAULTS.repeatType,
  count = JUMPING_DOTS_DEFAULTS.count,
  size = JUMPING_DOTS_DEFAULTS.size,
  gap = JUMPING_DOTS_DEFAULTS.gap,
  caption = JUMPING_DOTS_DEFAULTS.caption,
  paused: pausedProp = JUMPING_DOTS_DEFAULTS.paused,
  reducedMotion = JUMPING_DOTS_DEFAULTS.reducedMotion,
  replayNonce = JUMPING_DOTS_DEFAULTS.replayNonce,
}: JumpingDotsProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const running = !paused && !reduce;
  const example = LOADING_EXAMPLES.jumpingDots;
  const dots = Math.max(1, Math.round(count));
  const effectiveDuration = duration / Math.max(speed, 0.1);
  const staggerDirection = Number(staggerDirectionProp) === 1 ? 1 : -1;

  const dotVariants: Variants = {
    rest: { transform: 'translateY(0px)' },
    jump: {
      transform: `translateY(${jump}px)`,
      transition: {
        duration: effectiveDuration,
        repeat: Infinity,
        repeatType,
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
      fixedNote="Three 20 px dots and a 10 px gap are the upstream default. The rest variant is catalogue-only so Pause can sit the dots on the baseline. This loop is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="loading-jumping-dots"
      running={running}
      runId={replayNonce}
    >
      <motion.div
        role="status"
        aria-label={caption}
        className="loading__dots"
        animate={running ? 'jump' : 'rest'}
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
