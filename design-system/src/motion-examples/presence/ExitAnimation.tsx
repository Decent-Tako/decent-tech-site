import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { EXIT_DEFAULTS } from './defaults';
import { PresenceFrame } from './Frame';
import {
  PRESENCE_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type ExitAnimationProps = {
  presenceInitial?: boolean;
  opacityFrom?: number;
  opacityTo?: number;
  scaleFrom?: number;
  scaleTo?: number;
  whileTapY?: number;
  size?: number;
  label?: string;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function ExitRun({
  presenceInitial,
  opacityFrom,
  opacityTo,
  scaleFrom,
  scaleTo,
  whileTapY,
  size,
  label,
  caption,
  reduce,
}: {
  presenceInitial: boolean;
  opacityFrom: number;
  opacityTo: number;
  scaleFrom: number;
  scaleTo: number;
  whileTapY: number;
  size: number;
  label: string;
  caption: string;
  reduce: boolean;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const instant = reduce ? { duration: 0 } : undefined;

  return (
    <>
      <div
        className="presence-exit"
        data-visible={isVisible ? 'true' : 'false'}
        style={{ '--presence-size': `${size}px` } as CSSProperties}
      >
        <AnimatePresence initial={presenceInitial}>
          {isVisible ? (
            <motion.div
              key="box"
              className="presence-exit__box"
              data-testid="presence-exit-box"
              initial={
                reduce ? false : { opacity: opacityFrom, scale: scaleFrom }
              }
              animate={{ opacity: opacityTo, scale: scaleTo }}
              exit={{
                opacity: opacityFrom,
                scale: scaleFrom,
                transition: instant,
              }}
              transition={instant}
            >
              {label}
            </motion.div>
          ) : null}
        </AnimatePresence>
        <motion.button
          type="button"
          className="presence__trigger presence-exit__trigger"
          onClick={() => setIsVisible((current) => !current)}
          whileTap={reduce ? undefined : { y: whileTapY }}
        >
          {isVisible ? 'Hide' : 'Show'}
        </motion.button>
      </div>
      <p className="presence__caption">{caption}</p>
    </>
  );
}

export function ExitAnimation({
  presenceInitial = EXIT_DEFAULTS.presenceInitial,
  opacityFrom = EXIT_DEFAULTS.opacityFrom,
  opacityTo = EXIT_DEFAULTS.opacityTo,
  scaleFrom = EXIT_DEFAULTS.scaleFrom,
  scaleTo = EXIT_DEFAULTS.scaleTo,
  whileTapY = EXIT_DEFAULTS.whileTapY,
  size = EXIT_DEFAULTS.size,
  label = EXIT_DEFAULTS.label,
  caption = EXIT_DEFAULTS.caption,
  reducedMotion = EXIT_DEFAULTS.reducedMotion,
  replayNonce = EXIT_DEFAULTS.replayNonce,
}: ExitAnimationProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = PRESENCE_EXAMPLES.exit;

  return (
    <PresenceFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The box stays 100 by 100 pixels and the stage 100 by 160 at the upstream default so Hide/Show keeps the button under the exiting square. AnimatePresence initial is false so the first paint does not play enter. This animation is one-shot, so Replay remounts with the box present. Hide and Show are the live trigger."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="presence-exit"
      runId={runId}
    >
      <ExitRun
        key={`${runId}-${replayNonce}-${presenceInitial}-${reduce}`}
        presenceInitial={presenceInitial}
        opacityFrom={opacityFrom}
        opacityTo={opacityTo}
        scaleFrom={scaleFrom}
        scaleTo={scaleTo}
        whileTapY={whileTapY}
        size={size}
        label={label}
        caption={caption}
        reduce={reduce}
      />
    </PresenceFrame>
  );
}
