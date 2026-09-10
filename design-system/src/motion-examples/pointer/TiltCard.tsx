import { motion, useMotionValueEvent, useSpring } from 'motion/react';
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

import { PHOTOS } from '../../pages/content';
import { PointerFrame } from './PointerFrame';
import { useReduce } from './reduce';
import {
  MOTION_RUNTIME,
  TILT_DEFAULTS,
  TILT_SOURCE,
  type ReducedMotionMode,
} from './source';

export type TiltCardProps = {
  maxTilt?: number;
  src?: string;
  alt?: string;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
};

export function TiltCard({
  maxTilt = TILT_DEFAULTS.maxTilt,
  src = PHOTOS.night.src,
  alt = PHOTOS.night.alt,
  caption = 'Challenge week 19–28 October 2026. Aim for $3,000.',
  reducedMotion = TILT_DEFAULTS.reducedMotion,
}: TiltCardProps) {
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0);

  return (
    <PointerFrame
      title="Tilt card"
      attribution={
        <>
          Package <code>{MOTION_RUNTIME.package}</code> {MOTION_RUNTIME.version}.
          Licence {MOTION_RUNTIME.licence}. Mechanism: <code>useSpring(0)</code>{' '}
          for <code>rotateX</code>, <code>rotateY</code>, and <code>z</code>.{' '}
          <code>onPointerMove</code> maps the pointer percent in the card to{' '}
          <code>maxTilt * (0.5 - yPercent)</code>. Docs{' '}
          <a href={MOTION_RUNTIME.springDocs}>{MOTION_RUNTIME.springDocs}</a>.
          Example <a href={TILT_SOURCE.example}>{TILT_SOURCE.example}</a>. Live{' '}
          <a href={TILT_SOURCE.live}>{TILT_SOURCE.live}</a>. View-source chunk{' '}
          <a href={TILT_SOURCE.chunk}>{TILT_SOURCE.chunk}</a>. Source{' '}
          <a href={MOTION_RUNTIME.repo}>{MOTION_RUNTIME.repo}</a>. No extra
          runtime. The article page is Motion+ and prints a stub. The live
          source uses only <code>motion/react</code>. Pause stops tracking.
          Replay jumps the springs to 0. No earlier Academy experiment used
          this example.
        </>
      }
      fixedNote="The card stays 340 by 340 pixels because that is the upstream photograph frame. transformPerspective stays 500. Those values are the tilt geometry."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      stageTestId="tilt-stage"
    >
      <TiltCardView
        key={runId}
        maxTilt={maxTilt}
        src={src}
        alt={alt}
        caption={caption}
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </PointerFrame>
  );
}

function TiltCardView({
  maxTilt,
  src,
  alt,
  caption,
  paused,
  reducedMotion,
}: Required<TiltCardProps> & { paused: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);
  const z = useSpring(0);
  const rotateX = useSpring(0);
  const rotateY = useSpring(0);
  const freeze = paused || reduce;

  useMotionValueEvent(rotateX, 'change', (value) => {
    const node = cardRef.current;
    if (node) node.dataset.rx = value.toFixed(2);
  });
  useMotionValueEvent(rotateY, 'change', (value) => {
    const node = cardRef.current;
    if (node) node.dataset.ry = value.toFixed(2);
  });

  const calculateTilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return { rotateX: 0, rotateY: 0 };

    const rect = cardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    return {
      rotateX: maxTilt * (0.5 - yPercent),
      rotateY: maxTilt * (xPercent - 0.5),
    };
  };

  return (
    <motion.div
      ref={cardRef}
      className="tilt-card"
      data-testid="tilt-card"
      data-paused={freeze ? 'true' : 'false'}
      style={{
        z,
        rotateX,
        rotateY,
        transformPerspective: 500,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onPointerMove={(event) => {
        if (freeze) return;
        const tilt = calculateTilt(event);
        rotateX.set(tilt.rotateX);
        rotateY.set(tilt.rotateY);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
        z.set(0);
      }}
      onPointerEnter={() => {
        if (freeze) return;
        z.set(-10);
      }}
    >
      <img
        className="tilt-card__image"
        data-photo
        src={src}
        alt={alt}
        draggable={false}
      />
      <div className="tilt-card__overlay" />
      <p className="tilt-card__caption">{caption}</p>
    </motion.div>
  );
}
