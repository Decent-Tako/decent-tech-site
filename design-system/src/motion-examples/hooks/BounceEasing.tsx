import { motion, useReducedMotion, type Transition } from 'motion/react';
import { useState } from 'react';

import { BOUNCE_EASING_DEFAULTS } from './defaults';
import { HookFrame } from './Frame';
import {
  HOOK_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type BounceEasingProps = {
  bounceDuration?: number;
  stiffness?: number;
  damping?: number;
  initialOn?: boolean;
  onLabel?: string;
  offLabel?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

// From https://easings.net/#easeOutBounce
function bounceEase(progress: number) {
  const n1 = 7.5625;
  const d1 = 2.75;
  let x = progress;

  if (x < 1 / d1) {
    return n1 * x * x;
  }
  if (x < 2 / d1) {
    x -= 1.5 / d1;
    return n1 * x * x + 0.75;
  }
  if (x < 2.5 / d1) {
    x -= 2.25 / d1;
    return n1 * x * x + 0.9375;
  }
  x -= 2.625 / d1;
  return n1 * x * x + 0.984375;
}

function BounceRun({
  bounceDuration,
  stiffness,
  damping,
  initialOn,
  onLabel,
  offLabel,
  skip,
}: {
  bounceDuration: number;
  stiffness: number;
  damping: number;
  initialOn: boolean;
  onLabel: string;
  offLabel: string;
  skip: boolean;
}) {
  const [isOn, setIsOn] = useState(initialOn);

  const bounce: Transition = skip
    ? { duration: 0 }
    : { duration: bounceDuration, ease: bounceEase };
  const spring: Transition = skip
    ? { duration: 0 }
    : { type: 'spring', stiffness, damping };

  return (
    <div className="hk-bounce">
      <button
        type="button"
        className="hk-bounce__switch"
        data-is-on={isOn}
        aria-pressed={isOn}
        aria-label={`Challenge week. ${isOn ? onLabel : offLabel}.`}
        onClick={() => setIsOn((current) => !current)}
      >
        <motion.div
          className="hk-bounce__ball"
          layout
          transition={isOn ? spring : bounce}
        />
      </button>
      <p className="hk__caption">{isOn ? onLabel : offLabel}</p>
    </div>
  );
}

export function BounceEasing({
  bounceDuration = BOUNCE_EASING_DEFAULTS.bounceDuration,
  stiffness = BOUNCE_EASING_DEFAULTS.stiffness,
  damping = BOUNCE_EASING_DEFAULTS.damping,
  initialOn = BOUNCE_EASING_DEFAULTS.initialOn,
  onLabel = BOUNCE_EASING_DEFAULTS.onLabel,
  offLabel = BOUNCE_EASING_DEFAULTS.offLabel,
  reducedMotion = BOUNCE_EASING_DEFAULTS.reducedMotion,
  replayNonce = BOUNCE_EASING_DEFAULTS.replayNonce,
}: BounceEasingProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = HOOK_EXAMPLES.bounceEasing;

  return (
    <HookFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://easings.net/#easeOutBounce"
      fixedNote="The switch stays 80 by 200 pixels and the ball stays 80 by 80 at the upstream default so the layout travel is visible. bounceEase coefficients n1 7.5625 and d1 2.75 stay fixed because they are the easeOutBounce polynomial. This is toggle-driven, so Replay remounts to In the street."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="hk-bounce-easing"
      running={!reduce}
      runId={runId}
    >
      <BounceRun
        key={`${runId}-${replayNonce}-${bounceDuration}-${stiffness}-${damping}-${initialOn}`}
        bounceDuration={bounceDuration}
        stiffness={stiffness}
        damping={damping}
        initialOn={initialOn}
        onLabel={onLabel}
        offLabel={offLabel}
        skip={reduce}
      />
    </HookFrame>
  );
}
