import {
  animate,
  clamp,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { IosFrame } from './Frame';
import {
  EXAMPLES,
  REVEAL_DEFAULTS,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type ImageRevealSliderProps = {
  src?: string;
  alt?: string;
  overlayAlt?: string;
  step?: number;
  dragElastic?: number;
  keyboardStiffness?: number;
  keyboardDamping?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
};

function useSliderColor(x: MotionValue<number>, boundary: number) {
  return useTransform(
    x,
    [-boundary + 20, -boundary + 60, boundary - 60, boundary - 20],
    [
      'rgba(255, 255, 255, 0)',
      'rgba(255, 255, 255, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(255, 255, 255, 0)',
    ],
  );
}

function useKeyboard(
  x: MotionValue<number>,
  boundary: number,
  step: number,
  stiffness: number,
  damping: number,
) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const moveBy = event.key === 'ArrowLeft' ? -step : step;
    animate(x, clamp(-boundary, boundary, x.get() + moveBy), {
      type: 'spring',
      stiffness,
      damping,
      velocity: moveBy * 10,
    });
  };
  return {
    start: () => document.addEventListener('keydown', handleKeyDown),
    stop: () => document.removeEventListener('keydown', handleKeyDown),
  };
}

function LeftRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m18 8 4 4-4 4" />
      <path d="m6 8-4 4 4 4" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function RevealRun({
  src,
  alt,
  overlayAlt,
  step,
  dragElastic,
  keyboardStiffness,
  keyboardDamping,
  caption,
  skip,
}: {
  src: string;
  alt: string;
  overlayAlt: string;
  step: number;
  dragElastic: number;
  keyboardStiffness: number;
  keyboardDamping: number;
  caption: string;
  skip: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [boundary, setBoundary] = useState(300);
  const [shown, setShown] = useState(0);
  const clipPath = useTransform(
    x,
    [-boundary, boundary],
    ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 100%)'],
  );
  const lineBackgroundColor = useSliderColor(x, boundary);
  const keyboard = useKeyboard(
    x,
    boundary,
    step,
    keyboardStiffness,
    keyboardDamping,
  );

  useMotionValueEvent(x, 'change', (latest) => {
    setShown(latest);
  });

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const update = () => setBoundary(node.clientWidth / 2);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (skip) {
      x.set(0);
      return;
    }
    const target = Math.min(120, boundary * 0.4);
    const controls = animate(x, [0, target, 40], { duration: 0.9 });
    return () => controls.stop();
  }, [boundary, skip, x]);

  const percent = boundary
    ? Math.round(((shown + boundary) / (boundary * 2)) * 100)
    : 50;

  return (
    <div ref={containerRef} className="ios-reveal">
      <div className="ios-reveal__image">
        <motion.img
          src={src}
          alt={alt}
          className="ios-reveal__photo"
          data-photo=""
        />
        <motion.img
          style={{ clipPath }}
          src={src}
          alt={overlayAlt}
          className="ios-reveal__photo ios-reveal__overlay"
        />
      </div>
      <motion.div
        className="ios-reveal__slider"
        drag="x"
        dragElastic={dragElastic}
        dragConstraints={containerRef}
        style={{ x, backgroundColor: lineBackgroundColor }}
        tabIndex={0}
        role="slider"
        aria-label={caption}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        data-reveal={shown.toFixed(1)}
        onFocus={keyboard.start}
        onBlur={keyboard.stop}
      >
        <div className="ios-reveal__handle">
          <LeftRightIcon />
        </div>
      </motion.div>
      <p className="ios-example__caption" style={{ marginTop: '0.75rem' }}>
        {caption}
      </p>
    </div>
  );
}

export function ImageRevealSlider({
  src = REVEAL_DEFAULTS.src,
  alt = REVEAL_DEFAULTS.alt,
  overlayAlt = REVEAL_DEFAULTS.overlayAlt,
  step = REVEAL_DEFAULTS.step,
  dragElastic = REVEAL_DEFAULTS.dragElastic,
  keyboardStiffness = REVEAL_DEFAULTS.keyboardStiffness,
  keyboardDamping = REVEAL_DEFAULTS.keyboardDamping,
  caption = REVEAL_DEFAULTS.caption,
  reducedMotion = REVEAL_DEFAULTS.reducedMotion,
}: ImageRevealSliderProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);

  return (
    <IosFrame
      title="Image reveal slider"
      mechanism={
        <>
          <code>drag=&quot;x&quot;</code> on the handle.{' '}
          <code>dragConstraints</code> is the photograph box.{' '}
          <code>useTransform</code> maps <code>x</code> to overlay{' '}
          <code>clipPath inset</code>. Keyboard arrows spring <code>x</code>.
        </>
      }
      docs={EXAMPLES.reveal.docs}
      example={EXAMPLES.reveal.page}
      live={EXAMPLES.reveal.live}
      extraRuntime="The handle icon is inline SVG."
      fixedNote="The photograph box is 4:3 at 300 px tall (200 px below 500 px). dragElastic stays 0.05 unless the control changes it. The greyscale overlay is the reveal mechanism. The colour photograph keeps data-photo and stays full colour. Replay remounts and pulls the handle right."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="ios-image-reveal"
      running={!reduce}
      runId={runId}
    >
      <div className="ios-example__stage ios-example__stage--reveal">
        <RevealRun
          key={`${runId}-${step}-${dragElastic}-${reduce}`}
          src={src}
          alt={alt}
          overlayAlt={overlayAlt}
          step={step}
          dragElastic={dragElastic}
          keyboardStiffness={keyboardStiffness}
          keyboardDamping={keyboardDamping}
          caption={caption}
          skip={reduce}
        />
      </div>
    </IosFrame>
  );
}
