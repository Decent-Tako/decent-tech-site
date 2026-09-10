import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';

import { ROLLING_EASE, ROLLING_TEXT_BUTTON_DEFAULTS } from './defaults';
import { TextFrame } from './Frame';
import {
  shouldReduce,
  TEXT_EXAMPLES,
  type ReducedMotionMode,
} from './source';

export type RollingTextButtonProps = {
  label?: string;
  duration?: number;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

const outgoingVariants = {
  rest: { transform: 'translateY(0%)' },
  active: { transform: 'translateY(100%)' },
};

const incomingVariants = {
  rest: { transform: 'translateY(-100%)' },
  active: { transform: 'translateY(0%)' },
};

function ChevronRightIcon() {
  return (
    <svg
      className="rolling-button__icon"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function RollingTextButtonRun({
  label,
  duration,
  skip,
}: {
  label: string;
  duration: number;
  skip: boolean;
}) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const animating = useRef(false);
  const pendingRequest = useRef<boolean | null>(null);
  const hovered = useRef(false);
  const focused = useRef(false);

  const updateActive = (next: boolean) => {
    activeRef.current = next;
    setActive(next);
  };

  const requestActive = (next: boolean) => {
    if (skip) return;

    if (next === activeRef.current) {
      pendingRequest.current = null;
      return;
    }

    if (animating.current) {
      pendingRequest.current = next;
      return;
    }

    animating.current = true;
    updateActive(next);
  };

  const completeAnimation = () => {
    if (!animating.current) return;
    animating.current = false;

    if (
      pendingRequest.current !== null &&
      pendingRequest.current !== activeRef.current
    ) {
      const next = pendingRequest.current;
      pendingRequest.current = null;
      animating.current = true;
      updateActive(next);
    } else {
      pendingRequest.current = null;
    }
  };

  const transition = {
    duration,
    ease: ROLLING_EASE,
  };

  return (
    <motion.button
      type="button"
      className="rolling-button"
      aria-label={label}
      data-active={active ? 'true' : 'false'}
      onHoverStart={() => {
        hovered.current = true;
        requestActive(true);
      }}
      onHoverEnd={() => {
        hovered.current = false;
        requestActive(focused.current);
      }}
      onFocus={() => {
        focused.current = true;
        requestActive(true);
      }}
      onBlur={() => {
        focused.current = false;
        requestActive(hovered.current);
      }}
    >
      <span className="rolling-button__window" aria-hidden="true">
        <motion.span
          className="rolling-button__copy"
          variants={outgoingVariants}
          initial="rest"
          animate={active ? 'active' : 'rest'}
          onAnimationComplete={completeAnimation}
          transition={transition}
        >
          {label}
        </motion.span>
        <motion.span
          className="rolling-button__copy rolling-button__copy--incoming"
          variants={incomingVariants}
          initial="rest"
          animate={active ? 'active' : 'rest'}
          transition={transition}
        >
          {label}
        </motion.span>
      </span>
      <ChevronRightIcon />
    </motion.button>
  );
}

export function RollingTextButton({
  label = ROLLING_TEXT_BUTTON_DEFAULTS.label,
  duration = ROLLING_TEXT_BUTTON_DEFAULTS.duration,
  reducedMotion = ROLLING_TEXT_BUTTON_DEFAULTS.reducedMotion,
  replayNonce = ROLLING_TEXT_BUTTON_DEFAULTS.replayNonce,
}: RollingTextButtonProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = TEXT_EXAMPLES.rollingTextButton;

  return (
    <TextFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      extraDocs={example.extraDocs}
      example={example.example}
      live={example.live}
      fixedNote="The cubic-bezier ease 0.338, 0.015, 0.395, 0.959 stays fixed because that curve is the roll. The label window stays overflow hidden because that clip is the geometry. Rest is paper and ink. Hover and focus are blue. Press is yellow."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="text-rolling-text-button"
      running={!reduce}
      runId={runId}
    >
      <RollingTextButtonRun
        key={`${runId}-${replayNonce}-${label}-${duration}-${reduce}`}
        label={label}
        duration={duration}
        skip={reduce}
      />
    </TextFrame>
  );
}
