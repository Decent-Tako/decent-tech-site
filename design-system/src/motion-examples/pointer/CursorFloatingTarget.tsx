import {
  motion,
  transform,
  useAnimate,
  useSpring,
  useTransform,
} from 'motion/react';
import { useEffect, useState } from 'react';

import { PHOTOS } from '../../pages/content';
import { PointerFrame } from './PointerFrame';
import { Cursor } from './plusAdapter';
import { usePointerPosition } from './usePointerPosition';
import { useReduce } from './reduce';
import {
  CURSOR_DEFAULTS,
  CURSOR_SOURCE,
  MOTION_RUNTIME,
  PLUS_ADAPTER,
  type ReducedMotionMode,
} from './source';

export type CursorFloatingTargetProps = {
  damping?: number;
  stiffness?: number;
  rotateDuration?: number;
  offset?: number;
  magneticSnap?: number;
  reticuleStiffness?: number;
  reticuleDamping?: number;
  reducedMotion?: ReducedMotionMode;
};

const RING_COPY = 'Start now • $3,000 • Buddy • Team • ';

export function CursorFloatingTarget({
  damping = CURSOR_DEFAULTS.damping,
  stiffness = CURSOR_DEFAULTS.stiffness,
  rotateDuration = CURSOR_DEFAULTS.rotateDuration,
  offset = CURSOR_DEFAULTS.offset,
  magneticSnap = CURSOR_DEFAULTS.magneticSnap,
  reticuleStiffness = CURSOR_DEFAULTS.reticuleStiffness,
  reticuleDamping = CURSOR_DEFAULTS.reticuleDamping,
  reducedMotion = CURSOR_DEFAULTS.reducedMotion,
}: CursorFloatingTargetProps) {
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0);

  return (
    <PointerFrame
      title="Cursor floating target"
      attribution={
        <>
          Package <code>{MOTION_RUNTIME.package}</code> {MOTION_RUNTIME.version}.
          Licence {MOTION_RUNTIME.licence}. Mechanism:{' '}
          <code>usePointerPosition</code> feeds <code>useTransform</code> then{' '}
          <code>useSpring</code> for the target <code>x</code>/<code>y</code>.{' '}
          <code>useAnimate</code> rotates the label 0 to 360 degrees with{' '}
          <code>repeat: Infinity</code>. Two <code>Cursor</code> nodes: a 5 px
          dot and a magnetic reticule. Docs{' '}
          <a href={MOTION_RUNTIME.springDocs}>{MOTION_RUNTIME.springDocs}</a>.
          Example <a href={CURSOR_SOURCE.example}>{CURSOR_SOURCE.example}</a>.
          Live <a href={CURSOR_SOURCE.live}>{CURSOR_SOURCE.live}</a>.
          View-source chunk{' '}
          <a href={CURSOR_SOURCE.chunk}>{CURSOR_SOURCE.chunk}</a>. Source{' '}
          <a href={MOTION_RUNTIME.repo}>{MOTION_RUNTIME.repo}</a>. Continuous
          rotate plus pointer follow. Pause stops both. Speed is rotate{' '}
          <code>duration</code>. No earlier Academy experiment used this
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
      fixedNote="The target stays 150 by 150 pixels because the circular label is authored for that radius. The offset range stays the mapped pointer window, not a layout size."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      stageClassName="pointer-frame__stage--tall cursor-target-stage"
      stageTestId="cursor-stage"
    >
      <CursorTargetView
        key={`${runId}-${rotateDuration}-${stiffness}-${damping}-${offset}`}
        damping={damping}
        stiffness={stiffness}
        rotateDuration={rotateDuration}
        offset={offset}
        magneticSnap={magneticSnap}
        reticuleStiffness={reticuleStiffness}
        reticuleDamping={reticuleDamping}
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </PointerFrame>
  );
}

function usePointerReaction(
  axis: 'x' | 'y',
  measurement: 'innerWidth' | 'innerHeight',
  spring: { damping: number; stiffness: number },
  offset: number,
  paused: boolean,
) {
  const pointer = usePointerPosition();
  const [size] = useState(() =>
    typeof window === 'undefined' ? 0 : window[measurement],
  );
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const onMove = () => {
      setHasMoved(true);
      removeOnMove();
    };

    window.addEventListener('mousemove', onMove);

    const removeOnMove = () => {
      window.removeEventListener('mousemove', onMove);
    };

    return removeOnMove;
  }, []);

  const value = useTransform(() => {
    if (paused) return 0;
    const pointerPosition = pointer[axis].get();
    if (!size || !hasMoved) return 0;
    return transform([0, size], [offset, -offset])(pointerPosition);
  });

  return useSpring(value, spring);
}

function CursorTargetView({
  damping,
  stiffness,
  rotateDuration,
  offset,
  magneticSnap,
  reticuleStiffness,
  reticuleDamping,
  paused,
  reducedMotion,
}: Required<CursorFloatingTargetProps> & { paused: boolean }) {
  const [textRef, animate] = useAnimate();
  const reduce = useReduce(reducedMotion);
  const freeze = paused || reduce;
  const spring = { damping, stiffness };
  const x = usePointerReaction('x', 'innerWidth', spring, offset, freeze);
  const y = usePointerReaction('y', 'innerHeight', spring, offset, freeze);
  const originX = useTransform(x, [20, -20], [0, 1]);
  const originY = useTransform(y, [20, -20], [0, 1]);
  const chars = RING_COPY.split('');

  useEffect(() => {
    if (freeze || !textRef.current) return;
    const controls = animate(
      textRef.current,
      { transform: ['rotate(0deg)', 'rotate(360deg)'] },
      {
        duration: rotateDuration,
        ease: 'linear',
        repeat: Infinity,
      },
    );
    return () => {
      controls.stop();
    };
  }, [animate, freeze, rotateDuration, textRef]);

  return (
    <>
      <img
        className="cursor-wallpaper"
        data-photo
        src={PHOTOS.hero.src}
        alt={PHOTOS.hero.alt}
      />
      <div className="cursor-scrim" />
      <p className="cursor-title">Week 0</p>
      <motion.button
        type="button"
        className="cursor-target"
        data-magnetic=""
        data-testid="cursor-target"
        data-paused={freeze ? 'true' : 'false'}
        aria-label="Start now. Set the goal to $3,000."
        initial={false}
        animate="idle"
        whileTap="pressed"
        whileHover="hover"
        style={{ x, y }}
      >
        <motion.div
          className="cursor-target-circle"
          variants={{ pressed: { scale: 0.9 } }}
        >
          <motion.div
            className="cursor-fill"
            variants={{
              hover: { scale: 1.1 },
              idle: { scale: 0 },
            }}
            style={{ originX, originY }}
          />
        </motion.div>
        <motion.div
          ref={textRef}
          className="cursor-text"
          aria-hidden="true"
          variants={{
            hover: { letterSpacing: '1px' },
            idle: { letterSpacing: '7px' },
          }}
        >
          {chars.map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="cursor-char"
              style={{
                transform: `rotate(${
                  (index * 360) / chars.length
                }deg) translateY(-90px)`,
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      </motion.button>
      {freeze ? null : (
        <>
          <Cursor
            style={{ width: 5, height: 5 }}
            className="plus-cursor-dot"
          />
          <Cursor
            follow
            center={{ x: 0.5, y: 0.5 }}
            spring={{
              stiffness: reticuleStiffness,
              damping: reticuleDamping,
            }}
            magnetic={{ snap: magneticSnap, padding: 0 }}
            style={{ width: 40, height: 40, borderRadius: 200 }}
            variants={{
              magnetic: { opacity: 0 },
              idle: { opacity: 1 },
            }}
            className="plus-cursor-ring"
          />
        </>
      )}
    </>
  );
}
