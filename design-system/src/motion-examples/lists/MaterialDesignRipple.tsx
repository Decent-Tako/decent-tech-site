import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

import { ListsFrame } from './Frame';
import {
  EXAMPLES,
  MATERIAL_RIPPLE_DEFAULTS,
  MOTION_RUNTIME,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export type MaterialDesignRippleProps = {
  enterDuration?: number;
  exitDuration?: number;
  hoverDuration?: number;
  label?: string;
  reducedMotion?: ReducedMotionMode;
};

export function MaterialDesignRipple({
  enterDuration = MATERIAL_RIPPLE_DEFAULTS.enterDuration,
  exitDuration = MATERIAL_RIPPLE_DEFAULTS.exitDuration,
  hoverDuration = MATERIAL_RIPPLE_DEFAULTS.hoverDuration,
  label = MATERIAL_RIPPLE_DEFAULTS.label,
  reducedMotion = MATERIAL_RIPPLE_DEFAULTS.reducedMotion,
}: MaterialDesignRippleProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const createRipple = useCallback((originX: number, originY: number) => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const localX = originX - rect.left;
    const localY = originY - rect.top;
    const dx = Math.max(localX, rect.width - localX);
    const dy = Math.max(localY, rect.height - localY);
    const radius = Math.sqrt(dx * dx + dy * dy);
    const size = radius * 2;
    const id = (idRef.current += 1);
    setRipples((prev) => [...prev, { id, x: localX, y: localY, size }]);
  }, []);

  const removeLastRipple = useCallback(() => {
    setRipples((prev) => (prev.length ? prev.slice(0, prev.length - 1) : prev));
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.isPrimary) {
        createRipple(event.clientX, event.clientY);
      }
    },
    [createRipple],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.repeat) return;
      if (event.key === ' ' || event.key === 'Enter') {
        const button = buttonRef.current;
        if (!button) return;
        const rect = button.getBoundingClientRect();
        createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    },
    [createRipple],
  );

  const onKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === ' ' || event.key === 'Enter') {
        removeLastRipple();
      }
    },
    [removeLastRipple],
  );

  const replay = () => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
      window.setTimeout(removeLastRipple, reduce ? 0 : 320);
    }
    setRunId((value) => value + 1);
  };

  return (
    <ListsFrame
      title="Material Design ripple"
      mechanism={
        <>
          <code>onPointerDown</code> (primary only) and Space/Enter create a
          ripple at the local origin. Size is twice the hypot to the farthest
          corner. <code>AnimatePresence</code> mounts a <code>motion.span</code>{' '}
          from <code>scale(0)</code> to <code>scale(1)</code>. Pointer up,
          leave, cancel, blur, and keyup remove the last ripple so the exit
          fade can run. Loading/Ripple is a different example: concentric
          loading rings, not a press ink.
        </>
      }
      docs={MOTION_RUNTIME.docsPresence}
      example={EXAMPLES.materialRipple.page}
      live={EXAMPLES.materialRipple.live}
      chunk={EXAMPLES.materialRipple.chunk}
      priorNote="Loading/Ripple is motion.dev react-loading-ripple, a concentric loading loop. This is the Material press ink."
      fixedNote="The button is inline so the RSVP label stays readable. Ripple geometry is always 2 × hypot to the farthest corner. That size is not a control because it is the Material formula, not a Motion prop. Replay fires a centre ripple. Press the button to place one at the pointer."
      controlKind="replay"
      onReplay={replay}
      reducedMotion={reducedMotion}
      testId="material-design-ripple"
      running={ripples.length > 0}
      runId={runId}
      extraData={{ 'data-ripples': String(ripples.length) }}
    >
      <div className="lists-example__stage">
        <motion.button
          ref={buttonRef}
          type="button"
          className="lists-ripple__button"
          onPointerDown={onPointerDown}
          onPointerUp={removeLastRipple}
          onPointerCancel={removeLastRipple}
          onPointerLeave={removeLastRipple}
          onBlur={removeLastRipple}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          whileHover={
            reduce
              ? undefined
              : {
                  borderColor: '#0035B1',
                  backgroundColor: '#0035B1',
                  color: '#FFFFFF',
                }
          }
          transition={{
            duration: reduce ? 0 : hoverDuration,
            ease: 'linear',
          }}
        >
          {label}
          <span className="lists-ripple__layer" aria-hidden="true">
            <AnimatePresence>
              {ripples.map((ripple) => (
                <motion.span
                  key={ripple.id}
                  className="lists-ripple__span"
                  data-ripple="true"
                  style={{
                    width: ripple.size,
                    height: ripple.size,
                    left: ripple.x - ripple.size / 2,
                    top: ripple.y - ripple.size / 2,
                  }}
                  initial={
                    reduce
                      ? { opacity: 0.4, transform: 'scale(1)' }
                      : { opacity: 0, transform: 'scale(0)' }
                  }
                  animate={{
                    opacity: 0.4,
                    transform: 'scale(1)',
                    transition: { duration: reduce ? 0 : enterDuration },
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduce ? 0 : exitDuration,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </AnimatePresence>
          </span>
        </motion.button>
      </div>
    </ListsFrame>
  );
}
