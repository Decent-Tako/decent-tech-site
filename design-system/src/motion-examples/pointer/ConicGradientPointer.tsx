import { motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type RefObject } from 'react';

import { PointerFrame } from './PointerFrame';
import { useReduce } from './reduce';
import {
  CONIC_DEFAULTS,
  CONIC_SOURCE,
  MOTION_RUNTIME,
  type ReducedMotionMode,
} from './source';

export type ConicGradientPointerProps = {
  width?: number;
  height?: number;
  radius?: number;
  reducedMotion?: ReducedMotionMode;
};

export function ConicGradientPointer({
  width = CONIC_DEFAULTS.width,
  height = CONIC_DEFAULTS.height,
  radius = CONIC_DEFAULTS.radius,
  reducedMotion = CONIC_DEFAULTS.reducedMotion,
}: ConicGradientPointerProps) {
  const [paused, setPaused] = useState(false);

  return (
    <PointerFrame
      title="Conic gradient pointer"
      attribution={
        <>
          Package <code>{MOTION_RUNTIME.package}</code> {MOTION_RUNTIME.version}.
          Licence {MOTION_RUNTIME.licence}. Mechanism: <code>useMotionValue</code>{' '}
          for <code>gradientX</code> and <code>gradientY</code>.{' '}
          <code>useTransform</code> builds a <code>conic-gradient</code> at the
          pointer. <code>onPointerMove</code> sets those values as{' '}
          <code>clientX / width</code>. Docs{' '}
          <a href={MOTION_RUNTIME.motionValueDocs}>
            {MOTION_RUNTIME.motionValueDocs}
          </a>
          . Example <a href={CONIC_SOURCE.example}>{CONIC_SOURCE.example}</a>.
          Live <a href={CONIC_SOURCE.live}>{CONIC_SOURCE.live}</a>. Source{' '}
          <a href={MOTION_RUNTIME.repo}>{MOTION_RUNTIME.repo}</a>. No extra
          runtime. Continuous pointer tracking. Pause ignores later moves. No
          earlier Academy experiment used this example.
        </>
      }
      fixedNote={`The box stays ${width} by ${height} pixels because the upstream demo is a 400 pixel rounded square. useElementDimensions does not track resize; that is the upstream note.`}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      reducedMotion={reducedMotion}
      stageClassName="pointer-frame__stage--tall"
      stageTestId="conic-stage"
    >
      <ConicBox
        width={width}
        height={height}
        radius={radius}
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </PointerFrame>
  );
}

function ConicBox({
  width,
  height,
  radius,
  paused,
  reducedMotion,
}: Required<ConicGradientPointerProps> & { paused: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);
  const [{ width: boxWidth, height: boxHeight, top, left }, measure] =
    useElementDimensions(ref);
  const gradientX = useMotionValue(0.5);
  const gradientY = useMotionValue(0.5);
  const background = useTransform(
    () =>
      `conic-gradient(from 0deg at calc(${
        gradientX.get() * 100
      }% - ${left}px) calc(${
        gradientY.get() * 100
      }% - ${top}px), #0035B1, #212121, #DEF54F, #0035B1)`,
  );
  const pausedRef = useRef(paused || reduce);
  useEffect(() => {
    pausedRef.current = paused || reduce;
  }, [paused, reduce]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPointerMove={(event) => {
        if (pausedRef.current) return;
        gradientX.set(event.clientX / (boxWidth || width));
        gradientY.set(event.clientY / (boxHeight || height));
        const node = ref.current;
        if (node) {
          node.dataset.gx = gradientX.get().toFixed(3);
          node.dataset.gy = gradientY.get().toFixed(3);
        }
      }}
    >
      <motion.div
        ref={ref}
        className="conic-box"
        data-testid="conic-box"
        data-paused={paused ? 'true' : 'false'}
        role="img"
        aria-label="Challenge week spotlight"
        style={{
          background,
          width,
          height,
          borderRadius: radius,
        }}
        onPointerEnter={() => measure()}
      />
    </div>
  );
}

function useElementDimensions(
  ref: RefObject<HTMLDivElement | null>,
): [
  { width: number; height: number; top: number; left: number },
  () => void,
] {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  function measure() {
    if (!ref.current) return;
    setSize(ref.current.getBoundingClientRect());
  }

  useEffect(() => {
    measure();
    // Upstream measures once. Resize is not tracked.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only, same as the live source
  }, []);

  return [size, measure];
}
