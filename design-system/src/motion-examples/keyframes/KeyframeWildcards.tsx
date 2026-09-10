import { motion, useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { WILDCARDS_DEFAULTS } from './defaults';
import { KeyframeFrame } from './Frame';
import {
  KEYFRAME_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
  type TweenEase,
} from './source';

export type KeyframeWildcardsProps = {
  hoverScaleMid?: number;
  hoverScaleTo?: number;
  hoverDuration?: number;
  hoverMidTime?: number;
  restDuration?: number;
  restEase?: TweenEase;
  size?: number;
  label?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function KeyframeWildcards({
  hoverScaleMid = WILDCARDS_DEFAULTS.hoverScaleMid,
  hoverScaleTo = WILDCARDS_DEFAULTS.hoverScaleTo,
  hoverDuration = WILDCARDS_DEFAULTS.hoverDuration,
  hoverMidTime = WILDCARDS_DEFAULTS.hoverMidTime,
  restDuration = WILDCARDS_DEFAULTS.restDuration,
  restEase = WILDCARDS_DEFAULTS.restEase,
  size = WILDCARDS_DEFAULTS.size,
  label = WILDCARDS_DEFAULTS.label,
  reducedMotion = WILDCARDS_DEFAULTS.reducedMotion,
  replayNonce = WILDCARDS_DEFAULTS.replayNonce,
}: KeyframeWildcardsProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = KEYFRAME_EXAMPLES.wildcards;
  const hoverEase: [TweenEase, TweenEase] = ['easeInOut', 'easeOut'];
  const hover = reduce
    ? undefined
    : {
        scale: [null, hoverScaleMid, hoverScaleTo],
        transition: {
          duration: hoverDuration,
          times: [0, hoverMidTime, 1],
          ease: hoverEase,
        },
      };

  return (
    <KeyframeFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The first keyframe stays null. That is the wildcard. The box stays 100 by 100 pixels so a 1.6 scale still fits the stage. Hover ease [easeInOut, easeOut] stays the upstream pair. This animation is hover-triggered, so Replay remounts the node."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="kf-wildcards"
      running={!reduce}
      runId={runId + replayNonce}
    >
      <motion.button
        key={`${replayNonce}-${runId}`}
        type="button"
        className="kf__box kf__box--yellow kf__box--hover"
        style={{ '--kf-size': `${size}px` } as CSSProperties}
        whileHover={hover}
        whileFocus={hover}
        transition={{ duration: restDuration, ease: restEase }}
      >
        {label}
      </motion.button>
    </KeyframeFrame>
  );
}
