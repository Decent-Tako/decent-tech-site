import { motion, useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { ROTATE_DEFAULTS } from './defaults';
import { KeyframeFrame } from './Frame';
import {
  KEYFRAME_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
  type TweenEase,
} from './source';

export type RotateProps = {
  duration?: number;
  rotateTo?: number;
  ease?: TweenEase;
  size?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function RotateRun({
  duration,
  rotateTo,
  ease,
  size,
  caption,
  skip,
}: {
  duration: number;
  rotateTo: number;
  ease: TweenEase;
  size: number;
  caption: string;
  skip: boolean;
}) {
  const [complete, setComplete] = useState(skip);

  return (
    <motion.div
      className="kf__box kf__box--blue"
      role="img"
      aria-label={caption}
      data-complete={complete ? 'true' : 'false'}
      style={{ '--kf-size': `${size}px` } as CSSProperties}
      animate={{ rotate: skip ? 0 : rotateTo }}
      transition={skip ? { duration: 0 } : { duration, ease }}
      onAnimationComplete={() => setComplete(true)}
    >
      {caption}
    </motion.div>
  );
}

export function Rotate({
  duration = ROTATE_DEFAULTS.duration,
  rotateTo = ROTATE_DEFAULTS.rotateTo,
  ease = ROTATE_DEFAULTS.ease,
  size = ROTATE_DEFAULTS.size,
  caption = ROTATE_DEFAULTS.caption,
  reducedMotion = ROTATE_DEFAULTS.reducedMotion,
  replayNonce = ROTATE_DEFAULTS.replayNonce,
}: RotateProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = KEYFRAME_EXAMPLES.rotate;

  return (
    <KeyframeFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The box stays 100 by 100 pixels at the upstream default. There is no repeat. 360 degrees looks like 0 when it ends, so Replay remounts the node. The tutorial shows ease linear. The published complete source omits ease, so the control default is Motion tween easeOut."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="kf-rotate"
      running={!reduce}
      runId={runId + replayNonce}
    >
      <RotateRun
        key={`${replayNonce}-${runId}`}
        duration={duration}
        rotateTo={rotateTo}
        ease={ease}
        size={size}
        caption={caption}
        skip={reduce}
      />
    </KeyframeFrame>
  );
}
