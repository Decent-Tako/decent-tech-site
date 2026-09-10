import { frame, motion, useMotionValueEvent, useSpring } from 'motion/react';
import { useEffect, useRef, useState, type RefObject } from 'react';

import { PointerFrame } from './PointerFrame';
import { useReduce } from './reduce';
import {
  FOLLOW_DEFAULTS,
  FOLLOW_SOURCE,
  MOTION_RUNTIME,
  type ReducedMotionMode,
} from './source';

export type FollowPointerProps = {
  damping?: number;
  stiffness?: number;
  restDelta?: number;
  size?: number;
  reducedMotion?: ReducedMotionMode;
};

export function FollowPointer({
  damping = FOLLOW_DEFAULTS.damping,
  stiffness = FOLLOW_DEFAULTS.stiffness,
  restDelta = FOLLOW_DEFAULTS.restDelta,
  size = FOLLOW_DEFAULTS.size,
  reducedMotion = FOLLOW_DEFAULTS.reducedMotion,
}: FollowPointerProps) {
  const [paused, setPaused] = useState(false);

  return (
    <PointerFrame
      title="Follow pointer with spring"
      attribution={
        <>
          Package <code>{MOTION_RUNTIME.package}</code> {MOTION_RUNTIME.version}.
          Licence {MOTION_RUNTIME.licence}. Mechanism: <code>useSpring</code> on{' '}
          <code>x</code> and <code>y</code>. <code>pointermove</code> runs{' '}
          <code>frame.read</code>, then <code>x.set</code> / <code>y.set</code>{' '}
          to the pointer minus half the ball. Docs{' '}
          <a href={MOTION_RUNTIME.springDocs}>{MOTION_RUNTIME.springDocs}</a>.
          Example <a href={FOLLOW_SOURCE.example}>{FOLLOW_SOURCE.example}</a>.
          Live <a href={FOLLOW_SOURCE.live}>{FOLLOW_SOURCE.live}</a>. Source{' '}
          <a href={MOTION_RUNTIME.repo}>{MOTION_RUNTIME.repo}</a>. No extra
          runtime. Continuous pointer tracking. Pause stops the listener. Speed
          is <code>stiffness</code>. No earlier Academy experiment used this
          example.
        </>
      }
      fixedNote={`The ball stays ${size} by ${size} pixels because the upstream demo is a 100 pixel circle. offsetLeft/offsetTop stay as written: they are the follow math, not a visual control.`}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      reducedMotion={reducedMotion}
      stageClassName="pointer-frame__stage--tall"
      stageTestId="follow-stage"
    >
      <FollowBall
        key={`${damping}-${stiffness}-${restDelta}`}
        damping={damping}
        stiffness={stiffness}
        restDelta={restDelta}
        size={size}
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </PointerFrame>
  );
}

function FollowBall({
  damping,
  stiffness,
  restDelta,
  size,
  paused,
  reducedMotion,
}: Required<FollowPointerProps> & { paused: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useFollowPointer(ref, {
    damping,
    stiffness,
    restDelta,
    paused,
    reducedMotion,
  });

  useMotionValueEvent(x, 'change', (value) => {
    const node = ref.current;
    if (node) node.dataset.x = String(Math.round(value));
  });
  useMotionValueEvent(y, 'change', (value) => {
    const node = ref.current;
    if (node) node.dataset.y = String(Math.round(value));
  });

  return (
    <motion.div
      ref={ref}
      className="follow-ball"
      data-testid="follow-ball"
      data-paused={paused ? 'true' : 'false'}
      role="img"
      aria-label="Participant goal $3,000"
      style={{
        width: size,
        height: size,
        backgroundColor: '#DEF54F',
        borderRadius: '50%',
        x,
        y,
      }}
    >
      $3k
    </motion.div>
  );
}

function useFollowPointer(
  ref: RefObject<HTMLDivElement | null>,
  options: {
    damping: number;
    stiffness: number;
    restDelta: number;
    paused: boolean;
    reducedMotion: ReducedMotionMode;
  },
) {
  const reduce = useReduce(options.reducedMotion);
  const spring = {
    damping: options.damping,
    stiffness: options.stiffness,
    restDelta: options.restDelta,
  };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const pausedRef = useRef(options.paused || reduce);
  useEffect(() => {
    pausedRef.current = options.paused || reduce;
  }, [options.paused, reduce]);

  useEffect(() => {
    if (!ref.current) return;

    const handlePointerMove = ({ clientX, clientY }: PointerEvent) => {
      if (pausedRef.current) return;
      const element = ref.current;
      if (!element) return;

      frame.read(() => {
        x.set(clientX - element.offsetLeft - element.offsetWidth / 2);
        y.set(clientY - element.offsetTop - element.offsetHeight / 2);
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [ref, x, y]);

  return { x, y };
}
