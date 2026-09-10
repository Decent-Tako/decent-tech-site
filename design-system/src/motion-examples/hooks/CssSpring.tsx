import { spring } from 'motion';
import { useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { CSS_SPRING_DEFAULTS } from './defaults';
import { HookFrame } from './Frame';
import {
  HOOK_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type CssSpringProps = {
  duration?: number;
  bounce?: number;
  size?: number;
  restLabel?: string;
  liveLabel?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function SpringRun({
  duration,
  bounce,
  size,
  restLabel,
  liveLabel,
  skip,
}: {
  duration: number;
  bounce: number;
  size: number;
  restLabel: string;
  liveLabel: string;
  skip: boolean;
}) {
  const [state, setState] = useState(false);
  const easing = skip ? '0s linear' : spring(duration, bounce);

  return (
    <div className="hk-spring">
      <div
        className="hk-spring__box"
        data-state={state}
        data-easing={String(easing).slice(0, 32)}
        style={
          {
            '--hk-spring-size': `${size}px`,
            transition: `transform ${easing}`,
          } as CSSProperties
        }
      >
        {state ? liveLabel : restLabel}
      </div>
      <button
        type="button"
        className="hk__action"
        onClick={() => setState((current) => !current)}
      >
        Toggle position
      </button>
    </div>
  );
}

export function CssSpring({
  duration = CSS_SPRING_DEFAULTS.duration,
  bounce = CSS_SPRING_DEFAULTS.bounce,
  size = CSS_SPRING_DEFAULTS.size,
  restLabel = CSS_SPRING_DEFAULTS.restLabel,
  liveLabel = CSS_SPRING_DEFAULTS.liveLabel,
  reducedMotion = CSS_SPRING_DEFAULTS.reducedMotion,
  replayNonce = CSS_SPRING_DEFAULTS.replayNonce,
}: CssSpringProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = HOOK_EXAMPLES.cssSpring;

  return (
    <HookFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The box stays 100 by 100 pixels at the upstream default. translateX(-100%) to translateX(100%) rotate(180deg) stays fixed because that is the CSS target pair the spring eases. The browser, not motion.div, runs the animation. This is toggle-driven, so Replay remounts to Week 0. Toggle position is the stated trigger."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="hk-css-spring"
      running={!reduce}
      runId={runId}
    >
      <SpringRun
        key={`${runId}-${replayNonce}-${duration}-${bounce}`}
        duration={duration}
        bounce={bounce}
        size={size}
        restLabel={restLabel}
        liveLabel={liveLabel}
        skip={reduce}
      />
    </HookFrame>
  );
}
