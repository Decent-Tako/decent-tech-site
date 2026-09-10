import {
  animate,
  motion,
  progress as calcProgress,
  clamp,
  mix,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionStyle,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { IosFrame } from './Frame';
import {
  EXAMPLES,
  SLIDER_DEFAULTS,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type IosSliderProps = {
  maxPull?: number;
  maxSquish?: number;
  maxStretch?: number;
  keyboardStep?: number;
  keyboardStiffness?: number;
  keyboardDamping?: number;
  initialProgress?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
};

function invertScale(scale: number) {
  return scale === 0 ? 1 : 1 / scale;
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#212121"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ios-slider__icon"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" stroke="#212121" fill="#212121" />
      <path d="M12 3v1" />
      <path d="M12 20v1" />
      <path d="M3 12h1" />
      <path d="M20 12h1" />
      <path d="m18.364 5.636-.707.707" />
      <path d="m6.343 17.657-.707.707" />
      <path d="m5.636 5.636.707.707" />
      <path d="m17.657 17.657.707.707" />
    </svg>
  );
}

function SliderRun({
  maxPull,
  maxSquish,
  maxStretch,
  keyboardStep,
  keyboardStiffness,
  keyboardDamping,
  initialProgress,
  caption,
  skip,
}: {
  maxPull: number;
  maxSquish: number;
  maxStretch: number;
  keyboardStep: number;
  keyboardStiffness: number;
  keyboardDamping: number;
  initialProgress: number;
  caption: string;
  skip: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const initialDragY = useRef(0);
  const initialProgressY = useRef(0);
  const size = useRef<{ top: number; bottom: number }>({ top: 0, bottom: 0 });
  const progress = useMotionValue(skip ? 1 : initialProgress);
  const [shown, setShown] = useState(skip ? 1 : initialProgress);
  const brightness = useTransform(() => clamp(0, 1, progress.get()));
  const y = useTransform(progress, [-1, 0, 1, 2], [maxPull, 0, 0, -maxPull]);
  const { scaleX, scaleY } = useTransform(y, [-maxPull, 0, 0, maxPull], {
    scaleX: [maxSquish, 1, 1, maxSquish],
    scaleY: [maxStretch, 1, 1, maxStretch],
  });
  const invertScaleX = useTransform(() => invertScale(scaleX.get()));
  const invertScaleY = useTransform(() => invertScale(scaleY.get()));

  useMotionValueEvent(progress, 'change', (latest) => {
    setShown(clamp(0, 1, latest));
  });

  useEffect(() => {
    if (skip) {
      progress.set(1);
      return;
    }
    const controls = animate(progress, [initialProgress, 1.12, 0.72], {
      duration: 0.9,
    });
    return () => controls.stop();
  }, [initialProgress, progress, skip]);

  const updateProgress = (clientY: number) => {
    const { top, bottom } = size.current;
    progress.set(calcProgress(bottom, top, clientY));
  };

  const updateProgressWithKeyboard = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    let current = clamp(0, 1, progress.get());
    if (current <= 0.04) current = 0;
    if (current >= 0.96) current = 1;
    const newProgress =
      current + (event.key === 'ArrowUp' ? keyboardStep : -keyboardStep);
    const keyboardSpring = {
      stiffness: keyboardStiffness,
      damping: keyboardDamping,
    };
    if (newProgress > 1) {
      animate(progress, 1, {
        velocity: 20,
        type: 'spring',
        ...keyboardSpring,
      });
    } else if (newProgress < 0) {
      animate(progress, 0, {
        velocity: -20,
        type: 'spring',
        ...keyboardSpring,
      });
    } else {
      progress.jump(clamp(0, 1, newProgress));
    }
  };

  const percent = Math.round(shown * 100);
  const sliderStyle = {
    y,
    scaleX,
    scaleY,
  } as MotionStyle;

  return (
    <>
      <div className="ios-slider">
        <motion.div
          ref={ref}
          className="ios-slider__track"
          style={sliderStyle}
          role="slider"
          tabIndex={0}
          aria-label={caption}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          data-progress={shown.toFixed(2)}
          onTapStart={(event) => {
            if (!ref.current) return;
            const clientY =
              'clientY' in event ? event.clientY : event.touches[0]?.clientY;
            if (clientY == null) return;
            const { top, bottom } = ref.current.getBoundingClientRect();
            size.current = { top, bottom };
            initialDragY.current = clientY;
            initialProgressY.current = mix(bottom, top, progress.get());
          }}
          onPan={(event) => {
            const dragOffset = event.clientY - initialDragY.current;
            updateProgress(initialProgressY.current + dragOffset);
          }}
          onPanEnd={() => {
            const finalProgress = progress.get();
            if (finalProgress < 0) animate(progress, 0);
            else if (finalProgress > 1) animate(progress, 1);
          }}
          onFocus={() => {
            document.addEventListener('keydown', updateProgressWithKeyboard);
          }}
          onBlur={() => {
            document.removeEventListener('keydown', updateProgressWithKeyboard);
          }}
          transition={{ duration: 0.15 }}
          initial={{ boxShadow: '0px 0px 0px 4px #0035B100' }}
          whileFocus={{ boxShadow: '0px 0px 0px 4px #0035B1ff' }}
        >
          <motion.div
            className="ios-slider__fill"
            style={{ scaleY: brightness }}
          />
          <motion.div style={{ scaleX: invertScaleX, scaleY: invertScaleY }}>
            <SunIcon />
          </motion.div>
        </motion.div>
      </div>
      <p className="ios-example__caption">
        {caption} · {percent}%
      </p>
    </>
  );
}

export function IosSlider({
  maxPull = SLIDER_DEFAULTS.maxPull,
  maxSquish = SLIDER_DEFAULTS.maxSquish,
  maxStretch = SLIDER_DEFAULTS.maxStretch,
  keyboardStep = SLIDER_DEFAULTS.keyboardStep,
  keyboardStiffness = SLIDER_DEFAULTS.keyboardStiffness,
  keyboardDamping = SLIDER_DEFAULTS.keyboardDamping,
  initialProgress = SLIDER_DEFAULTS.initialProgress,
  caption = SLIDER_DEFAULTS.caption,
  reducedMotion = SLIDER_DEFAULTS.reducedMotion,
}: IosSliderProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);

  return (
    <IosFrame
      title="iOS slider"
      mechanism={
        <>
          <code>useMotionValue</code> holds progress. <code>onPan</code> adds
          the drag offset so the fill does not snap to the pointer.{' '}
          <code>useTransform</code> maps progress to pull, squish, and stretch.{' '}
          <code>onPanEnd</code> springs values back into 0–1.
        </>
      }
      docs={EXAMPLES.slider.docs}
      example={EXAMPLES.slider.page}
      live={EXAMPLES.slider.live}
      extraRuntime="The sun mark is inline SVG. lucide-react is not required."
      fixedNote="The track stays 100 by 225 pixels with radius 40 because that is the iOS Control Centre proportion. The stage is 400 by 300. Replay remounts and plays a pull past 1, then settles at 72 percent toward $3,000. Focus ring uses Academy blue #0035B1. Fill uses yellow #DEF54F."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="ios-slider"
      running={!reduce}
      runId={runId}
    >
      <div className="ios-example__stage ios-example__stage--slider">
        <SliderRun
          key={`${runId}-${maxPull}-${maxSquish}-${maxStretch}-${reduce}`}
          maxPull={maxPull}
          maxSquish={maxSquish}
          maxStretch={maxStretch}
          keyboardStep={keyboardStep}
          keyboardStiffness={keyboardStiffness}
          keyboardDamping={keyboardDamping}
          initialProgress={initialProgress}
          caption={caption}
          skip={reduce}
        />
      </div>
    </IosFrame>
  );
}
