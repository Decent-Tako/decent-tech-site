import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { useState } from 'react';

import { FormsFrame } from './Frame';
import {
  EXAMPLES,
  HOLD_TO_CONFIRM_DEFAULTS,
  MOTION_RUNTIME,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type HoldToConfirmProps = {
  holdDuration?: number;
  releaseDuration?: number;
  holdScale?: number;
  strokeWidthTo?: number;
  label?: string;
  reducedMotion?: ReducedMotionMode;
};

export function HoldToConfirm({
  holdDuration = HOLD_TO_CONFIRM_DEFAULTS.holdDuration,
  releaseDuration = HOLD_TO_CONFIRM_DEFAULTS.releaseDuration,
  holdScale = HOLD_TO_CONFIRM_DEFAULTS.holdScale,
  strokeWidthTo = HOLD_TO_CONFIRM_DEFAULTS.strokeWidthTo,
  label = HOLD_TO_CONFIRM_DEFAULTS.label,
  reducedMotion = HOLD_TO_CONFIRM_DEFAULTS.reducedMotion,
}: HoldToConfirmProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);

  return (
    <FormsFrame
      title="Hold to confirm"
      mechanism={
        <>
          <code>progress</code> is a <code>useMotionValue</code>. Pointer down
          runs <code>animate(progress, 1)</code>. Pointer up and leave reverse
          it. <code>useTransform</code> maps that value to stroke, scale, and
          fill <code>x</code>. The SVG circle binds <code>pathLength</code>.
        </>
      }
      docs={MOTION_RUNTIME.docsMotionValue}
      extraDocs={MOTION_RUNTIME.docsTransform}
      example={EXAMPLES.holdToConfirm.page}
      live={EXAMPLES.holdToConfirm.live}
      extraRuntime={`Live source ${EXAMPLES.holdToConfirm.sourceChunk}. The article page prints the Get started stub.`}
      fixedNote="SVG stays 320 by 320 and the circle radius stays 120 so the ring is visible around the button. Rotation stays -90deg so the arc starts at 12 o'clock. Replay remounts progress at 0. Hold is a one-shot gesture."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="hold-to-confirm"
      running={!reduce}
      runId={runId}
    >
      <div className="forms-stage forms-stage--hold">
        <HoldToConfirmRun
          key={`${runId}-${holdDuration}-${releaseDuration}-${holdScale}-${strokeWidthTo}`}
          holdDuration={holdDuration}
          releaseDuration={releaseDuration}
          holdScale={holdScale}
          strokeWidthTo={strokeWidthTo}
          label={label}
          reduce={reduce}
        />
      </div>
    </FormsFrame>
  );
}

function HoldToConfirmRun({
  holdDuration,
  releaseDuration,
  holdScale,
  strokeWidthTo,
  label,
  reduce,
}: {
  holdDuration: number;
  releaseDuration: number;
  holdScale: number;
  strokeWidthTo: number;
  label: string;
  reduce: boolean;
}) {
  const progress = useMotionValue(0);
  const [shown, setShown] = useState(0);

  useMotionValueEvent(progress, 'change', (latest) => {
    setShown(latest);
  });

  const { circleStrokeWidth, circleRotation, circleColor, buttonScale, buttonProgressX } =
    useTransform(progress, [0, 1], {
      circleStrokeWidth: [0, strokeWidthTo],
      circleRotation: ['-90deg', '-90deg'],
      circleColor: ['#FFFFFF', '#DEF54F'],
      buttonScale: [1, holdScale],
      buttonProgressX: ['-200%', '0%'],
    });

  const hold = () => {
    progress.set(0);
    animate(progress, 1, {
      duration: reduce ? 0 : holdDuration,
      ease: 'easeOut',
    });
  };

  const release = () => {
    animate(progress, 0, { duration: reduce ? 0 : releaseDuration });
  };

  return (
    <div className="forms-hold">
      <motion.button
        type="button"
        className="forms-hold__button"
        style={{ scale: buttonScale }}
        onPointerDown={(event) => {
          event.preventDefault();
          hold();
        }}
        onPointerUp={release}
        onPointerLeave={release}
        aria-label={label}
        data-progress={shown.toFixed(2)}
      >
        <motion.div
          className="forms-hold__fill"
          style={{ x: buttonProgressX }}
        />
        <span className="forms-hold__label">{label}</span>
      </motion.button>
      <motion.svg
        className="forms-hold__ring"
        width="320"
        height="320"
        viewBox="0 0 320 320"
        aria-hidden="true"
      >
        <motion.circle
          cx="160"
          cy="160"
          r="120"
          fill="none"
          stroke="var(--charcoal)"
          strokeWidth="24"
          strokeLinecap="round"
          style={{
            rotate: circleRotation,
            transformOrigin: 'center',
            opacity: progress,
            strokeWidth: circleStrokeWidth,
            stroke: circleColor,
            pathLength: progress,
          }}
        />
      </motion.svg>
    </div>
  );
}
