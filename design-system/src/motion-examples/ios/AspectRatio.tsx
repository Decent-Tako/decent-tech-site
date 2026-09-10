import { delay } from 'motion';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { IosFrame } from './Frame';
import {
  ASPECT_DEFAULTS,
  EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type AspectRatioProps = {
  aspectRatio?: number;
  width?: number;
  debounceDuration?: number;
  borderRadius?: number;
  heading?: string;
  photoSrc?: string;
  photoAlt?: string;
  reducedMotion?: ReducedMotionMode;
};

function useDebouncedState<T>(value: T, duration: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const cancel = delay(() => setDebouncedValue(value), duration);
    return () => {
      if (typeof cancel === 'function') cancel();
    };
  }, [duration, value]);
  return debouncedValue;
}

function AspectInput({
  label,
  value,
  set,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  set: (next: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="ios-aspect__label">
      <span>{label}</span>
      <input
        value={value}
        type="range"
        min={min}
        max={max}
        step={step}
        aria-label={label}
        onChange={(event) => set(parseFloat(event.target.value))}
      />
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={`${label} number`}
        onChange={(event) => set(parseFloat(event.target.value) || 0)}
      />
    </label>
  );
}

function AspectRun({
  aspectRatio,
  width,
  debounceDuration,
  borderRadius,
  heading,
  photoSrc,
  photoAlt,
  skip,
}: {
  aspectRatio: number;
  width: number;
  debounceDuration: number;
  borderRadius: number;
  heading: string;
  photoSrc: string;
  photoAlt: string;
  skip: boolean;
}) {
  const [aspect, setAspect] = useState(aspectRatio);
  const [boxWidth, setBoxWidth] = useState(width);
  const debouncedAspect = useDebouncedState(
    aspect,
    skip ? 0 : debounceDuration,
  );
  const debouncedWidth = useDebouncedState(
    boxWidth,
    skip ? 0 : debounceDuration,
  );

  useEffect(() => {
    if (skip) return;
    const cancel = delay(() => {
      setAspect(1.6);
      setBoxWidth(240);
    }, 0.35);
    return () => {
      if (typeof cancel === 'function') cancel();
    };
  }, [skip]);

  return (
    <div className="ios-aspect">
      <p className="ios-example__caption">{heading}</p>
      <div className="ios-aspect__box-wrap">
        <motion.div
          layout={!skip}
          className="ios-aspect__box"
          data-aspect={debouncedAspect.toFixed(2)}
          data-width={String(Math.round(debouncedWidth))}
          style={{
            aspectRatio: debouncedAspect,
            width: debouncedWidth,
            borderRadius,
          }}
        >
          <img
            className="ios-aspect__photo"
            src={photoSrc}
            alt={photoAlt}
            data-photo=""
          />
        </motion.div>
      </div>
      <div className="ios-aspect__controls">
        <AspectInput
          label="Aspect ratio"
          value={aspect}
          set={setAspect}
          min={ASPECT_DEFAULTS.minAspect}
          max={ASPECT_DEFAULTS.maxAspect}
          step={ASPECT_DEFAULTS.aspectStep}
        />
        <AspectInput
          label="Width"
          value={boxWidth}
          set={setBoxWidth}
          min={ASPECT_DEFAULTS.minWidth}
          max={ASPECT_DEFAULTS.maxWidth}
          step={ASPECT_DEFAULTS.widthStep}
        />
      </div>
    </div>
  );
}

export function AspectRatio({
  aspectRatio = ASPECT_DEFAULTS.aspectRatio,
  width = ASPECT_DEFAULTS.width,
  debounceDuration = ASPECT_DEFAULTS.debounceDuration,
  borderRadius = ASPECT_DEFAULTS.borderRadius,
  heading = ASPECT_DEFAULTS.heading,
  photoSrc = ASPECT_DEFAULTS.photoSrc,
  photoAlt = ASPECT_DEFAULTS.photoAlt,
  reducedMotion = ASPECT_DEFAULTS.reducedMotion,
}: AspectRatioProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);

  return (
    <IosFrame
      title="Aspect ratio"
      mechanism={
        <>
          The box is <code>motion.div layout</code>. Range inputs write aspect
          ratio and width. <code>delay()</code> from <code>motion</code>{' '}
          debounces those values so layout projection runs once per settle.
        </>
      }
      docs={EXAMPLES.aspect.docs}
      example={EXAMPLES.aspect.page}
      live={EXAMPLES.aspect.live}
      extraRuntime="delay() is from the motion package, not an extra runtime."
      fixedNote="The measure stage stays 300 by 300 pixels so a 1000 px width still clips in view. Debounce default is 0.2 s. Border radius default is 20. Replay remounts at the control values, then sets 1.6 / 240 so the layout animation runs."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="ios-aspect-ratio"
      running={!reduce}
      runId={runId}
    >
      <div className="ios-example__stage ios-example__stage--aspect">
        <AspectRun
          key={`${runId}-${aspectRatio}-${width}-${debounceDuration}-${reduce}`}
          aspectRatio={aspectRatio}
          width={width}
          debounceDuration={debounceDuration}
          borderRadius={borderRadius}
          heading={heading}
          photoSrc={photoSrc}
          photoAlt={photoAlt}
          skip={reduce}
        />
      </div>
    </IosFrame>
  );
}
