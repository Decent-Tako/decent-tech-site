import { motion, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { PointerFrame } from './PointerFrame';
import { usePointerPosition } from './usePointerPosition';
import { useReduce } from './reduce';
import {
  FILINGS_DEFAULTS,
  FILINGS_SOURCE,
  MOTION_RUNTIME,
  PLUS_ADAPTER,
  type ReducedMotionMode,
} from './source';

export type MagneticFilingsProps = {
  size?: number;
  reducedMotion?: ReducedMotionMode;
};

export function MagneticFilings({
  size = FILINGS_DEFAULTS.size,
  reducedMotion = FILINGS_DEFAULTS.reducedMotion,
}: MagneticFilingsProps) {
  const [paused, setPaused] = useState(false);

  return (
    <PointerFrame
      title="Magnetic filings"
      attribution={
        <>
          Package <code>{MOTION_RUNTIME.package}</code> {MOTION_RUNTIME.version}.
          Licence {MOTION_RUNTIME.licence}. Mechanism: each filing reads{' '}
          <code>usePointerPosition</code>, then <code>useTransform</code>{' '}
          returns <code>atan2</code> as <code>rotate</code>. Example{' '}
          <a href={FILINGS_SOURCE.example}>{FILINGS_SOURCE.example}</a>. Live{' '}
          <a href={FILINGS_SOURCE.live}>{FILINGS_SOURCE.live}</a>. View-source
          chunk <a href={FILINGS_SOURCE.chunk}>{FILINGS_SOURCE.chunk}</a>.
          Source <a href={MOTION_RUNTIME.repo}>{MOTION_RUNTIME.repo}</a>.
          Continuous pointer tracking. Pause freezes the last angle. Size is
          the real upstream prop. No earlier Academy experiment used this
          example.
        </>
      }
      extraRuntime={
        <>
          Extra runtime {PLUS_ADAPTER.name}. {PLUS_ADAPTER.unpackedKb} KB.{' '}
          {PLUS_ADAPTER.why} The article page is Motion+ and prints a stub. The
          live chunk publishes the full source.
        </>
      }
      fixedNote="The grid stays 500 by 500 pixels (300 below 499 px) because that is the upstream square. Filing height stays 2 px. Those are the metal-filing geometry."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      reducedMotion={reducedMotion}
      stageTestId="filings-stage"
    >
      <p className="filings-label">Inner circle. Map 100 people.</p>
      <MagneticGrid
        size={size}
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </PointerFrame>
  );
}

function MagneticGrid({
  size,
  paused,
  reducedMotion,
}: {
  size: number;
  paused: boolean;
  reducedMotion: ReducedMotionMode;
}) {
  const reduce = useReduce(reducedMotion);
  const freeze = paused || reduce;

  return (
    <div
      className="filings-square"
      data-testid="filings-grid"
      data-paused={freeze ? 'true' : 'false'}
      aria-hidden="true"
      style={
        {
          '--grid-size': size,
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        } as CSSProperties
      }
    >
      {Array.from({ length: size * size }).map((_, index) => (
        <Filing key={index} paused={freeze} />
      ))}
    </div>
  );
}

function Filing({ paused }: { paused: boolean }) {
  const pointer = usePointerPosition();
  const filingRef = useRef<HTMLDivElement>(null);
  const [centerX, setCenterX] = useState<number | null>(null);
  const [centerY, setCenterY] = useState<number | null>(null);
  const last = useRef(0);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (filingRef.current) {
      const rect = filingRef.current.getBoundingClientRect();
      setCenterX(rect.left + rect.width / 2);
      setCenterY(rect.top + rect.height / 2);
    }
  }, []);

  const rotate = useTransform(() => {
    if (pausedRef.current) return last.current;
    if (centerX === null || centerY === null) return 0;
    const pointerX = pointer.x.get();
    const pointerY = pointer.y.get();
    const angle =
      Math.atan2(pointerY - centerY, pointerX - centerX) * (180 / Math.PI);
    last.current = angle;
    return angle;
  });

  return (
    <motion.div
      ref={filingRef}
      className="filing"
      data-testid="filing"
      style={{ rotate }}
    />
  );
}
