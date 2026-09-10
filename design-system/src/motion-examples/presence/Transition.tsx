import { motion, useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { TRANSITION_DEFAULTS } from './defaults';
import { PresenceFrame } from './Frame';
import {
  PRESENCE_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type TransitionProps = {
  opacityFrom?: number;
  opacityTo?: number;
  scaleFrom?: number;
  scaleTo?: number;
  duration?: number;
  delay?: number;
  easeX1?: number;
  easeY1?: number;
  easeX2?: number;
  easeY2?: number;
  size?: number;
  label?: string;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function TransitionRun({
  opacityFrom,
  opacityTo,
  scaleFrom,
  scaleTo,
  duration,
  delay,
  ease,
  size,
  label,
  caption,
  reduce,
}: {
  opacityFrom: number;
  opacityTo: number;
  scaleFrom: number;
  scaleTo: number;
  duration: number;
  delay: number;
  ease: [number, number, number, number];
  size: number;
  label: string;
  caption: string;
  reduce: boolean;
}) {
  return (
    <>
      <motion.div
        className="presence__disc presence__disc--goal"
        data-testid="presence-transition-disc"
        style={{ '--presence-size': `${size}px` } as CSSProperties}
        initial={reduce ? false : { opacity: opacityFrom, scale: scaleFrom }}
        animate={{ opacity: opacityTo, scale: scaleTo }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration,
                delay,
                ease,
              }
        }
      >
        {label}
      </motion.div>
      <p className="presence__caption">{caption}</p>
    </>
  );
}

export function Transition({
  opacityFrom = TRANSITION_DEFAULTS.opacityFrom,
  opacityTo = TRANSITION_DEFAULTS.opacityTo,
  scaleFrom = TRANSITION_DEFAULTS.scaleFrom,
  scaleTo = TRANSITION_DEFAULTS.scaleTo,
  duration = TRANSITION_DEFAULTS.duration,
  delay = TRANSITION_DEFAULTS.delay,
  easeX1 = TRANSITION_DEFAULTS.easeX1,
  easeY1 = TRANSITION_DEFAULTS.easeY1,
  easeX2 = TRANSITION_DEFAULTS.easeX2,
  easeY2 = TRANSITION_DEFAULTS.easeY2,
  size = TRANSITION_DEFAULTS.size,
  label = TRANSITION_DEFAULTS.label,
  caption = TRANSITION_DEFAULTS.caption,
  reducedMotion = TRANSITION_DEFAULTS.reducedMotion,
  replayNonce = TRANSITION_DEFAULTS.replayNonce,
}: TransitionProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = PRESENCE_EXAMPLES.transition;
  const ease: [number, number, number, number] = [
    easeX1,
    easeY1,
    easeX2,
    easeY2,
  ];

  return (
    <PresenceFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The disc stays 200 by 200 pixels at the upstream default so the 0.5 scale enter is visible. Cubic-bezier [0, 0.71, 0.2, 1.01] is the upstream ease. Delay 0.5 s is part of the demo, not a second animation. This animation is one-shot, so Replay remounts the disc."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="presence-transition"
      runId={runId}
    >
      <TransitionRun
        key={`${runId}-${replayNonce}-${duration}-${delay}-${ease.join(',')}-${reduce}`}
        opacityFrom={opacityFrom}
        opacityTo={opacityTo}
        scaleFrom={scaleFrom}
        scaleTo={scaleTo}
        duration={duration}
        delay={delay}
        ease={ease}
        size={size}
        label={label}
        caption={caption}
        reduce={reduce}
      />
    </PresenceFrame>
  );
}
