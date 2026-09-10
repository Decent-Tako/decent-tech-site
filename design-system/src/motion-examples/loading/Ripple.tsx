import { motion, useReducedMotion, type Transition } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { RIPPLE_DEFAULTS } from './defaults';
import { LoadingFrame } from './Frame';
import {
  LOADING_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type RippleProps = {
  duration?: number;
  speed?: number;
  delayStep?: number;
  count?: number;
  size?: number;
  borderWidth?: number;
  ease?: 'easeOut' | 'easeInOut' | 'linear';
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function Ripple({
  duration = RIPPLE_DEFAULTS.duration,
  speed = RIPPLE_DEFAULTS.speed,
  delayStep = RIPPLE_DEFAULTS.delayStep,
  count = RIPPLE_DEFAULTS.count,
  size = RIPPLE_DEFAULTS.size,
  borderWidth = RIPPLE_DEFAULTS.borderWidth,
  ease = RIPPLE_DEFAULTS.ease,
  caption = RIPPLE_DEFAULTS.caption,
  paused: pausedProp = RIPPLE_DEFAULTS.paused,
  reducedMotion = RIPPLE_DEFAULTS.reducedMotion,
  replayNonce = RIPPLE_DEFAULTS.replayNonce,
}: RippleProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const running = !paused && !reduce;
  const example = LOADING_EXAMPLES.ripple;
  const ripples = Math.max(1, Math.round(count));
  const effectiveDuration = duration / Math.max(speed, 0.1);

  const animation = running
    ? {
        transform: ['scale(0)', 'scale(1)'],
        opacity: [1, 0],
      }
    : {
        transform: 'scale(0)',
        opacity: 0,
      };

  const transition: Transition = {
    duration: effectiveDuration,
    repeat: running ? Infinity : 0,
    ease,
  };

  return (
    <LoadingFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      fixedNote="The ripple box stays 100 by 100 pixels at the upstream default so the 5 px ring stays a ring. Delays are 0, delayStep, and 2 × delayStep. This loop is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="loading-ripple"
      running={running}
      runId={replayNonce}
    >
      <div
        role="status"
        aria-label={caption}
        className="loading__ripple-wrap"
        style={
          {
            '--loading-size': `${size}px`,
            '--loading-border': `${borderWidth}px`,
          } as CSSProperties
        }
      >
        {Array.from({ length: ripples }, (_, index) => (
          <motion.div
            key={index}
            className="loading__ripple"
            aria-hidden="true"
            animate={animation}
            transition={{
              ...transition,
              delay: index * delayStep,
            }}
          />
        ))}
      </div>
      <p className="loading__caption">{caption}</p>
    </LoadingFrame>
  );
}
