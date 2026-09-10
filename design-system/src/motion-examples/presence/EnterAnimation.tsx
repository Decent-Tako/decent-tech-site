import { motion, useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { ENTER_DEFAULTS } from './defaults';
import { PresenceFrame } from './Frame';
import {
  PRESENCE_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type EnterAnimationProps = {
  opacityFrom?: number;
  opacityTo?: number;
  scaleFrom?: number;
  scaleTo?: number;
  duration?: number;
  visualDuration?: number;
  bounce?: number;
  size?: number;
  label?: string;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function EnterRun({
  opacityFrom,
  opacityTo,
  scaleFrom,
  scaleTo,
  duration,
  visualDuration,
  bounce,
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
  visualDuration: number;
  bounce: number;
  size: number;
  label: string;
  caption: string;
  reduce: boolean;
}) {
  return (
    <>
      <motion.div
        className="presence__disc"
        data-testid="presence-enter-disc"
        style={{ '--presence-size': `${size}px` } as CSSProperties}
        initial={reduce ? false : { opacity: opacityFrom, scale: scaleFrom }}
        animate={{ opacity: opacityTo, scale: scaleTo }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration,
                scale: { type: 'spring', visualDuration, bounce },
              }
        }
      >
        {label}
      </motion.div>
      <p className="presence__caption">{caption}</p>
    </>
  );
}

export function EnterAnimation({
  opacityFrom = ENTER_DEFAULTS.opacityFrom,
  opacityTo = ENTER_DEFAULTS.opacityTo,
  scaleFrom = ENTER_DEFAULTS.scaleFrom,
  scaleTo = ENTER_DEFAULTS.scaleTo,
  duration = ENTER_DEFAULTS.duration,
  visualDuration = ENTER_DEFAULTS.visualDuration,
  bounce = ENTER_DEFAULTS.bounce,
  size = ENTER_DEFAULTS.size,
  label = ENTER_DEFAULTS.label,
  caption = ENTER_DEFAULTS.caption,
  reducedMotion = ENTER_DEFAULTS.reducedMotion,
  replayNonce = ENTER_DEFAULTS.replayNonce,
}: EnterAnimationProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = PRESENCE_EXAMPLES.enter;

  return (
    <PresenceFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      fixedNote="The disc stays 100 by 100 pixels at the upstream default so the enter scale from 0 is readable. Nested scale spring visualDuration and bounce are the upstream enter, not a second runtime. This animation is one-shot, so Replay remounts the disc."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="presence-enter"
      runId={runId}
    >
      <EnterRun
        key={`${runId}-${replayNonce}-${duration}-${visualDuration}-${bounce}-${reduce}`}
        opacityFrom={opacityFrom}
        opacityTo={opacityTo}
        scaleFrom={scaleFrom}
        scaleTo={scaleTo}
        duration={duration}
        visualDuration={visualDuration}
        bounce={bounce}
        size={size}
        label={label}
        caption={caption}
        reduce={reduce}
      />
    </PresenceFrame>
  );
}
