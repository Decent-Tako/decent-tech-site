import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { PHOTOS } from '../../pages/content';
import { STATE_DEFAULTS } from './defaults';
import { KeyframeFrame } from './Frame';
import {
  KEYFRAME_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type AnimateStateProps = {
  x?: number;
  y?: number;
  rotate?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function StateRun({
  x,
  y,
  rotate,
  caption,
  skip,
}: {
  x: number;
  y: number;
  rotate: number;
  caption: string;
  skip: boolean;
}) {
  const [localX, setLocalX] = useState(skip ? x : 0);
  const [localY, setLocalY] = useState(skip ? y : 0);
  const [localRotate, setLocalRotate] = useState(skip ? rotate : 0);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setLocalX(x);
      setLocalY(y);
      setLocalRotate(rotate);
    });
    return () => cancelAnimationFrame(id);
  }, [rotate, x, y]);

  return (
    <div className="kf-state">
      <div className="kf-state__stage">
        <motion.div
          className="kf-state__card"
          animate={{ x: localX, y: localY, rotate: localRotate }}
          transition={skip ? { duration: 0 } : { type: 'spring' }}
        >
          <img
            data-photo=""
            className="kf-state__photo"
            src={PHOTOS.hero.src}
            alt={PHOTOS.hero.alt}
          />
        </motion.div>
      </div>
      <div className="kf-state__inputs">
        <p className="kf__caption">{caption}</p>
        <Input label="x" value={localX} set={setLocalX} />
        <Input label="y" value={localY} set={setLocalY} />
        <Input
          label="rotate"
          value={localRotate}
          set={setLocalRotate}
          min={-180}
          max={180}
        />
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  set,
  min = -200,
  max = 200,
}: {
  label: string;
  value: number;
  set: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="kf-state__label">
      <code>{label}</code>
      <input
        value={value}
        type="range"
        min={min}
        max={max}
        aria-label={label}
        onChange={(event) => set(parseFloat(event.target.value))}
      />
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        aria-label={`${label} value`}
        onChange={(event) => set(parseFloat(event.target.value) || 0)}
      />
    </label>
  );
}

export function AnimateState({
  x = STATE_DEFAULTS.x,
  y = STATE_DEFAULTS.y,
  rotate = STATE_DEFAULTS.rotate,
  caption = STATE_DEFAULTS.caption,
  reducedMotion = STATE_DEFAULTS.reducedMotion,
  replayNonce = STATE_DEFAULTS.replayNonce,
}: AnimateStateProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = KEYFRAME_EXAMPLES.state;

  return (
    <KeyframeFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-transitions"
      fixedNote="The card stays 200 by 200 pixels with a 5 px dotted border, as upstream. x and y range −200 to 200. rotate ranges −180 to 180. Spring options stay at Motion defaults because the example passes only type spring. The stage is 28 rem tall so a 200 px travel remains in view. Replay remounts so the card springs from 0, 0, 0 to the current target."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="kf-state"
      running={!reduce}
      runId={runId + replayNonce}
      stageClass="kf__stage--state"
    >
      <StateRun
        key={`${replayNonce}-${runId}`}
        x={x}
        y={y}
        rotate={rotate}
        caption={caption}
        skip={reduce}
      />
    </KeyframeFrame>
  );
}
