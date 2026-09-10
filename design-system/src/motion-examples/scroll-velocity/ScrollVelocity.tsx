import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import {
  DEMO_DURATION,
  DEMO_SCROLL,
  PERSPECTIVE,
  PLANE_HEIGHT,
  ROTATE_Y,
  SCRAMBLE_CHARS,
  VELOCITY_DEFAULTS,
  VELOCITY_LABELS,
  VELOCITY_PHOTOS,
  type ReducedMotionMode,
} from './scrollVelocityData';
import './scroll-velocity.css';

export type ScrollVelocityProps = {
  stiffness?: number;
  damping?: number;
  mass?: number;
  waveStiffness?: number;
  waveDamping?: number;
  waveMass?: number;
  waveDivisor?: number;
  waveAmount?: number;
  hoverStiffness?: number;
  hoverDamping?: number;
  planeWidth?: number;
  planeGap?: number;
  totalPlanes?: number;
  reducedMotion?: ReducedMotionMode;
};

function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

function ScrambleLabel({
  active,
  text,
}: {
  active: boolean;
  text: string;
}) {
  const [shown, setShown] = useState(text);
  const visible = active ? shown : text;

  useEffect(() => {
    if (!active) return;

    const controls = animate(0, 1, {
      duration: 0.4,
      onUpdate: (value) => {
        const settled = value * text.length;
        setShown(
          text
            .split('')
            .map((char, index) => {
              if (index < settled - 1) return char;
              return (
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ] ?? char
              );
            })
            .join(''),
        );
      },
      onComplete: () => setShown(text),
    });

    return () => controls.stop();
  }, [active, text]);

  return (
    <span className="scroll-velocity__label" aria-label={text}>
      <span aria-hidden="true">{visible}</span>
    </span>
  );
}

function Plane({
  index,
  scrollX,
  scrollVelocity,
  isHovered,
  onHoverStart,
  onHoverEnd,
  planeWidth,
  planeGap,
  totalPlanes,
  waveStiffness,
  waveDamping,
  waveMass,
  waveDivisor,
  waveAmount,
  hoverStiffness,
  hoverDamping,
}: {
  index: number;
  scrollX: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  planeWidth: number;
  planeGap: number;
  totalPlanes: number;
  waveStiffness: number;
  waveDamping: number;
  waveMass: number;
  waveDivisor: number;
  waveAmount: number;
  hoverStiffness: number;
  hoverDamping: number;
}) {
  const hoverOffset = useSpring(0, {
    stiffness: hoverStiffness,
    damping: hoverDamping,
  });
  const waveOffset = useSpring(0, {
    stiffness: waveStiffness,
    damping: waveDamping,
    mass: waveMass,
  });
  const step = planeWidth + planeGap;
  const totalWidth = step * totalPlanes;
  const startPosition = index * step;
  const photo = VELOCITY_PHOTOS[index % VELOCITY_PHOTOS.length];
  const label = VELOCITY_LABELS[index % VELOCITY_LABELS.length];

  useMotionValueEvent(scrollVelocity, 'change', (velocity) => {
    const pos = startPosition + scrollX.get();
    const centered = wrap(-totalWidth / 2, totalWidth / 2, pos);
    const normalizedPos = centered / (totalWidth / 2);
    const wavePhase = Math.sin(normalizedPos * Math.PI * 2);
    waveOffset.set((velocity / waveDivisor) * wavePhase * waveAmount);
  });

  useEffect(() => {
    hoverOffset.set(isHovered ? -30 : 0);
  }, [isHovered, hoverOffset]);

  const transform = useTransform(() => {
    const pos = startPosition + scrollX.get();
    const centered = wrap(-totalWidth / 2, totalWidth / 2, pos);
    const yOffset = centered * -0.35 + waveOffset.get() + hoverOffset.get();
    const zOffset = centered * -1.2;
    return `translate3d(${centered}px, ${yOffset}px, ${zOffset}px) rotateY(${ROTATE_Y}deg)`;
  });

  return (
    <motion.div
      className="scroll-velocity__plane"
      data-plane=""
      style={{
        width: planeWidth,
        height: PLANE_HEIGHT,
        transform,
        zIndex: isHovered ? 100 : 1,
        filter: isHovered ? 'brightness(1.15)' : 'brightness(1)',
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <div className="scroll-velocity__image-wrap">
        <img
          data-photo=""
          className="scroll-velocity__image"
          src={photo.src}
          alt={`${label}. ${photo.alt}`}
          draggable={false}
        />
      </div>
      <div className="scroll-velocity__index">
        {String(index).padStart(2, '0')}
      </div>
      <AnimatePresence>
        {isHovered ? (
          <motion.div
            className="scroll-velocity__label-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="scroll-velocity__label-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            <ScrambleLabel active={isHovered} text={label} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function ScrollVelocity(props: ScrollVelocityProps) {
  const stiffness = props.stiffness ?? VELOCITY_DEFAULTS.stiffness;
  const damping = props.damping ?? VELOCITY_DEFAULTS.damping;
  const mass = props.mass ?? VELOCITY_DEFAULTS.mass;
  const waveStiffness = props.waveStiffness ?? VELOCITY_DEFAULTS.waveStiffness;
  const waveDamping = props.waveDamping ?? VELOCITY_DEFAULTS.waveDamping;
  const waveMass = props.waveMass ?? VELOCITY_DEFAULTS.waveMass;
  const waveDivisor = props.waveDivisor ?? VELOCITY_DEFAULTS.waveDivisor;
  const waveAmount = props.waveAmount ?? VELOCITY_DEFAULTS.waveAmount;
  const hoverStiffness =
    props.hoverStiffness ?? VELOCITY_DEFAULTS.hoverStiffness;
  const hoverDamping = props.hoverDamping ?? VELOCITY_DEFAULTS.hoverDamping;
  const planeWidth = props.planeWidth ?? VELOCITY_DEFAULTS.planeWidth;
  const planeGap = props.planeGap ?? VELOCITY_DEFAULTS.planeGap;
  const totalPlanes = props.totalPlanes ?? VELOCITY_DEFAULTS.totalPlanes;
  const reducedMotion =
    props.reducedMotion ?? VELOCITY_DEFAULTS.reducedMotion;
  const [runId, setRunId] = useState(0);

  return (
    <MotionConfig
      reducedMotion={
        reducedMotion === 'always'
          ? 'always'
          : reducedMotion === 'never'
            ? 'never'
            : 'user'
      }
    >
      <figure className="scroll-velocity">
        <div className="scroll-velocity__bar">
          <div>
            <h2 className="scroll-velocity__title">Scroll velocity</h2>
            <p className="scroll-velocity__intro">
              Package <code>motion</code> 13.2.0. Licence MIT. Mechanism:{' '}
              <code>useMotionValue</code> holds wheel offset,{' '}
              <code>useSpring</code> smooths it, <code>useVelocity</code> drives
              a wave spring, and <code>wrap</code> plus <code>useTransform</code>{' '}
              write the 3D plane. Docs{' '}
              <a href="https://motion.dev/docs/react-use-velocity">
                https://motion.dev/docs/react-use-velocity
              </a>
              . Example{' '}
              <a href="https://motion.dev/examples/react-scroll-velocity-linked-offset">
                https://motion.dev/examples/react-scroll-velocity-linked-offset
              </a>
              . Live{' '}
              <a href="https://examples.motion.dev/react/scroll-velocity-linked-offset">
                https://examples.motion.dev/react/scroll-velocity-linked-offset
              </a>
              . Source{' '}
              <a href="https://github.com/motiondivision/motion">
                https://github.com/motiondivision/motion
              </a>
              . No extra package.{' '}
              <code>motion-plus</code> <code>ScrambleText</code> is paid.
              Motion <code>animate()</code> scrambles the hover label. Prior
              Academy use: none.
            </p>
          </div>
          <button
            type="button"
            className="scroll-velocity__replay"
            onClick={() => setRunId((value) => value + 1)}
          >
            Replay
          </button>
        </div>
        <p className="scroll-velocity__fixed">
          Plane height stays {PLANE_HEIGHT}px, rotateY stays {ROTATE_Y}deg, and
          perspective stays {PERSPECTIVE}px because those values are the camera
          of the example. Intended viewport 900px and above. Replay runs a{' '}
          {DEMO_DURATION}s offset sweep so the wave is visible on mount.
        </p>
        <VelocityStage
          key={`${runId}-${stiffness}-${damping}-${mass}-${waveStiffness}-${waveDamping}-${waveMass}-${waveDivisor}-${waveAmount}-${hoverStiffness}-${hoverDamping}-${planeWidth}-${planeGap}-${totalPlanes}-${reducedMotion}`}
          runId={runId}
          stiffness={stiffness}
          damping={damping}
          mass={mass}
          waveStiffness={waveStiffness}
          waveDamping={waveDamping}
          waveMass={waveMass}
          waveDivisor={waveDivisor}
          waveAmount={waveAmount}
          hoverStiffness={hoverStiffness}
          hoverDamping={hoverDamping}
          planeWidth={planeWidth}
          planeGap={planeGap}
          totalPlanes={totalPlanes}
          reducedMotion={reducedMotion}
        />
      </figure>
    </MotionConfig>
  );
}

function VelocityStage({
  runId,
  stiffness,
  damping,
  mass,
  waveStiffness,
  waveDamping,
  waveMass,
  waveDivisor,
  waveAmount,
  hoverStiffness,
  hoverDamping,
  planeWidth,
  planeGap,
  totalPlanes,
  reducedMotion,
}: Required<
  Omit<ScrollVelocityProps, 'reducedMotion'>
> & {
  runId: number;
  reducedMotion: ReducedMotionMode;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const rawScrollX = useMotionValue(0);
  const scrollX = useSpring(rawScrollX, { stiffness, damping, mass });
  const scrollVelocity = useVelocity(scrollX);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollShown, setScrollShown] = useState(0);

  useMotionValueEvent(scrollX, 'change', (value) => {
    setScrollShown(Math.round(value));
  });

  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, DEMO_SCROLL, {
      duration: DEMO_DURATION,
      ease: 'easeInOut',
      onUpdate: (value) => rawScrollX.set(value),
    });
    return () => controls.stop();
  }, [reduce, rawScrollX, runId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduce) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY;
      rawScrollX.set(rawScrollX.get() - delta);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [rawScrollX, reduce]);

  if (reduce) {
    return (
      <div
        className="scroll-velocity__stage"
        tabIndex={0}
        aria-label="Scroll velocity example"
        data-testid="scroll-velocity-stage"
        data-run-id={String(runId)}
        data-scroll-x="0"
        data-reduced="true"
      >
        <div className="scroll-velocity__grid" tabIndex={0} aria-label="Academy weeks">
          {VELOCITY_LABELS.map((label, index) => {
            const photo = VELOCITY_PHOTOS[index % VELOCITY_PHOTOS.length];
            return (
              <div className="scroll-velocity__grid-card" key={label}>
                <img data-photo="" src={photo.src} alt={`${label}. ${photo.alt}`} />
                <p>{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="scroll-velocity__stage"
      tabIndex={0}
      aria-label="Scroll velocity example"
      data-testid="scroll-velocity-stage"
      data-run-id={String(runId)}
      data-scroll-x={String(scrollShown)}
      data-reduced="false"
      style={{ perspective: PERSPECTIVE }}
      onPan={(_, info) => {
        rawScrollX.set(rawScrollX.get() + info.delta.x * 2.5);
      }}
    >
      <header className="scroll-velocity__header">
        <p className="scroll-velocity__kicker">Uncomfortable Academy</p>
        <p className="scroll-velocity__collection">
          Six weeks
          <sup className="scroll-velocity__count">
            ({VELOCITY_PHOTOS.length})
          </sup>
        </p>
      </header>
      <p className="scroll-velocity__hint">scroll to surf</p>
      <div className="scroll-velocity__viewport">
        <div className="scroll-velocity__planes">
          {Array.from({ length: totalPlanes }, (_, index) => (
            <Plane
              key={index}
              index={index}
              scrollX={scrollX}
              scrollVelocity={scrollVelocity}
              isHovered={hoveredIndex === index}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              planeWidth={planeWidth}
              planeGap={planeGap}
              totalPlanes={totalPlanes}
              waveStiffness={waveStiffness}
              waveDamping={waveDamping}
              waveMass={waveMass}
              waveDivisor={waveDivisor}
              waveAmount={waveAmount}
              hoverStiffness={hoverStiffness}
              hoverDamping={hoverDamping}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
