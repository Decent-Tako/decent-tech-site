import {
  animate,
  clamp,
  frame,
  mix,
  motion,
  progress,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { IosFrame } from './Frame';
import { Carousel } from './plusCarousel';
import {
  useCarousel,
  useTicker,
  useTickerItem,
} from './plusCarouselHooks';
import {
  EXAMPLES,
  EXPOSURE_DEFAULTS,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type CarouselIosExposureSliderProps = {
  initialExposure?: number;
  notchStep?: number;
  bounce?: number;
  duration?: number;
  gap?: number;
  snap?: boolean;
  loop?: boolean;
  overflow?: boolean;
  photoSrc?: string;
  photoAlt?: string;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
};

type NotchState = 'ACTIVE' | 'WAS_ACTIVE' | 'INACTIVE';

function ExposureNotch({
  baseOpacity,
  index,
  totalItems,
  bounce,
  duration,
}: {
  value: number;
  baseOpacity: number;
  index: number;
  totalItems: number;
  bounce: number;
  duration: number;
}) {
  const { offset } = useTickerItem();
  const { isMeasured } = useTicker();
  const [state, setState] = useState<NotchState>('INACTIVE');
  const prevOffset = useRef(offset.get());

  useEffect(() => {
    if (!isMeasured) return;
    frame.postRender(() => {
      frame.postRender(() => {
        const currentOffset = offset.get();
        const threshold = 6.5;
        const edgeThreshold = 1;
        const isActive =
          index === 0
            ? currentOffset >= -edgeThreshold
            : index === totalItems - 1
              ? currentOffset <= edgeThreshold
              : Math.abs(currentOffset) < threshold;
        if (isActive) setState('ACTIVE');
      });
    });
  }, [index, isMeasured, offset, totalItems]);

  useMotionValueEvent(offset, 'change', (latest) => {
    const prev = prevOffset.current;
    prevOffset.current = latest;
    const threshold = 6.5;
    const edgeThreshold = 1;
    const isCurrentlyActive =
      index === 0
        ? latest >= -edgeThreshold
        : index === totalItems - 1
          ? latest <= edgeThreshold
          : Math.abs(latest) < threshold;
    const crossedActiveZone =
      index === 0
        ? prev < -edgeThreshold && latest >= -edgeThreshold
        : index === totalItems - 1
          ? prev > edgeThreshold && latest <= edgeThreshold
          : (() => {
              const wasInside = Math.abs(prev) < threshold;
              const signChanged = prev * latest <= 0;
              return (wasInside || signChanged) && !isCurrentlyActive;
            })();
    let nextState: NotchState | null = null;
    if (isCurrentlyActive) nextState = 'ACTIVE';
    else if (state === 'ACTIVE') nextState = 'WAS_ACTIVE';
    else if (crossedActiveZone) {
      frame.postRender(() => {
        setState('ACTIVE');
        frame.postRender(() => setState('WAS_ACTIVE'));
      });
      return;
    }
    if (nextState && state !== nextState) {
      frame.postRender(() => setState(nextState!));
    }
  });

  return (
    <div className="ios-exposure__notch-wrap">
      <motion.div
        className="ios-exposure__notch"
        data-notch-state={state}
        initial={{ clipPath: 'inset(50% 0 0 0)', opacity: baseOpacity }}
        animate={{
          clipPath: state === 'ACTIVE' ? 'inset(0% 0 0 0)' : 'inset(50% 0 0 0)',
          opacity: state === 'ACTIVE' ? 1 : baseOpacity,
        }}
        transition={
          state === 'ACTIVE'
            ? { type: false }
            : { type: 'spring', bounce, duration }
        }
        onAnimationComplete={() => {
          if (state === 'WAS_ACTIVE') setState('INACTIVE');
        }}
        style={{
          backgroundColor: state === 'ACTIVE' ? 'var(--accent-yellow)' : '#fff',
        }}
      />
    </div>
  );
}

function getColor(value: number) {
  if (value > 0) return 'var(--accent-yellow)';
  return '#fff';
}

function ProgressIndicator({ value }: { value: MotionValue<number> }) {
  const [color, setColor] = useState(getColor(value.get()));
  const displayValue = useTransform(() => Math.round(value.get() * 100));
  const positiveProgress = useTransform(displayValue, [0, 100], [0, 1]);
  const negativeProgress = useTransform(displayValue, [-100, 0], [1, 0]);

  useMotionValueEvent(displayValue, 'change', (latest) => {
    setColor(getColor(latest));
  });

  const radius = 48;

  return (
    <motion.div
      className="ios-exposure__progress"
      animate={{ '--color': color } as never}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} className="ios-exposure__border" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          className="ios-exposure__indicator ios-exposure__indicator--positive"
          style={{ pathLength: positiveProgress, rotate: -90 }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          className="ios-exposure__indicator ios-exposure__indicator--negative"
          style={{ pathLength: negativeProgress, rotate: -90, scaleX: -1 }}
        />
      </svg>
      <motion.div className="ios-exposure__value" style={{ color: 'var(--color)' }}>
        {displayValue}
      </motion.div>
    </motion.div>
  );
}

function UpdateExposure({
  value,
  initialExposure = 0,
}: {
  value: MotionValue<number>;
  initialExposure?: number;
}) {
  const { renderedOffset, maxInset, isMeasured } = useTicker();
  const { targetOffset } = useCarousel();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isMeasured || !maxInset || hasInitialized.current) return;
    hasInitialized.current = true;
    const initialOffset = mix(0, -maxInset, (initialExposure + 1) / 2);
    targetOffset.jump(initialOffset);
    value.set(initialExposure);
    const introOffset = mix(
      0,
      -maxInset,
      (clamp(-1, 1, initialExposure + 0.35) + 1) / 2,
    );
    const controls = animate(targetOffset, introOffset, { duration: 0.7 });
    return () => controls.stop();
  }, [initialExposure, isMeasured, maxInset, targetOffset, value]);

  useMotionValueEvent(renderedOffset, 'change', (latest) => {
    if (!maxInset) return;
    value.set(clamp(-1, 1, mix(-1, 1, progress(0, -maxInset, latest))));
  });

  return null;
}

function ExposureRun({
  initialExposure,
  notchStep,
  bounce,
  duration,
  gap,
  snap,
  loop,
  overflow,
  photoSrc,
  photoAlt,
  caption,
}: {
  initialExposure: number;
  notchStep: number;
  bounce: number;
  duration: number;
  gap: number;
  snap: boolean;
  loop: boolean;
  overflow: boolean;
  photoSrc: string;
  photoAlt: string;
  caption: string;
}) {
  const exposure = useMotionValue(initialExposure);
  const [shown, setShown] = useState(initialExposure);
  const filter = useTransform(exposure, [-1, 1], ['brightness(0%)', 'brightness(200%)']);
  const exposureValues = useMemo(() => {
    const step = Math.max(1, Math.round(notchStep));
    const values: number[] = [];
    for (let value = -100; value <= 100; value += step) values.push(value);
    return values;
  }, [notchStep]);

  useMotionValueEvent(exposure, 'change', (latest) => {
    setShown(latest);
  });

  const percent = Math.round(shown * 100);

  return (
    <div className="ios-exposure">
      <div className="ios-exposure__image">
        <motion.img src={photoSrc} alt={photoAlt} style={{ filter }} />
      </div>
      <ProgressIndicator value={exposure} />
      <div
        className="ios-exposure__slider"
        role="slider"
        tabIndex={0}
        aria-label={caption}
        aria-valuemin={-100}
        aria-valuemax={100}
        aria-valuenow={percent}
        data-exposure={shown.toFixed(2)}
      >
        <Carousel
          className="ios-exposure__carousel"
          items={exposureValues.map((value, index) => (
            <ExposureNotch
              key={value}
              value={value}
              baseOpacity={value % 50 === 0 ? 0.6 : 0.3}
              index={index}
              totalItems={exposureValues.length}
              bounce={bounce}
              duration={duration}
            />
          ))}
          gap={gap}
          snap={snap}
          loop={loop}
          overflow={overflow}
        >
          <UpdateExposure value={exposure} initialExposure={initialExposure} />
        </Carousel>
      </div>
      <p className="ios-example__caption">
        {caption} · {percent > 0 ? '+' : ''}
        {percent}
      </p>
    </div>
  );
}

export function CarouselIosExposureSlider({
  initialExposure = EXPOSURE_DEFAULTS.initialExposure,
  notchStep = EXPOSURE_DEFAULTS.notchStep,
  bounce = EXPOSURE_DEFAULTS.bounce,
  duration = EXPOSURE_DEFAULTS.duration,
  gap = EXPOSURE_DEFAULTS.gap,
  snap = EXPOSURE_DEFAULTS.snap,
  loop = EXPOSURE_DEFAULTS.loop,
  overflow = EXPOSURE_DEFAULTS.overflow,
  photoSrc = EXPOSURE_DEFAULTS.photoSrc,
  photoAlt = EXPOSURE_DEFAULTS.photoAlt,
  caption = EXPOSURE_DEFAULTS.caption,
  reducedMotion = EXPOSURE_DEFAULTS.reducedMotion,
}: CarouselIosExposureSliderProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);

  return (
    <IosFrame
      title="Carousel: iOS exposure slider"
      mechanism={
        <>
          Local <code>Carousel</code> adapter of Motion+ <code>useTicker</code>.{' '}
          <code>renderedOffset</code> maps through <code>mix</code> to exposure
          [-1, 1]. <code>useTransform</code> writes <code>brightness()</code> on
          the photograph. Each notch reads <code>useTickerItem().offset</code>.
        </>
      }
      docs={EXAMPLES.exposure.docs}
      example={EXAMPLES.exposure.page}
      live={EXAMPLES.exposure.live}
      extraRuntime="Academy plusCarousel covers Motion+ Carousel, useCarousel, useTicker, and useTickerItem. npm cannot install motion-plus without membership. See Runtime additions."
      fixedNote="41 notches at step 5 match upstream. The carousel padding 50% minus 6.5 px centres the active notch. The brightness filter is the exposure mapping, not a brand wash, so the photograph does not use data-photo. Replay remounts at the initial exposure."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="ios-exposure-slider"
      running={!reduce}
      runId={runId}
    >
      <div className="ios-example__stage ios-example__stage--exposure">
        <ExposureRun
          key={`${runId}-${initialExposure}-${notchStep}-${gap}-${snap}-${loop}`}
          initialExposure={reduce ? 0 : initialExposure}
          notchStep={notchStep}
          bounce={bounce}
          duration={duration}
          gap={gap}
          snap={snap}
          loop={loop}
          overflow={overflow}
          photoSrc={photoSrc}
          photoAlt={photoAlt}
          caption={caption}
        />
      </div>
    </IosFrame>
  );
}
