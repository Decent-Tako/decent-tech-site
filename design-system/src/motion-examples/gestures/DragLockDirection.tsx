import { motion } from 'motion/react';
import { useState } from 'react';

import { GestureFrame } from './Frame';
import {
  DRAG_LOCK_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  type ReducedMotionMode,
} from './source';

export type DragLockDirectionProps = {
  dragDirectionLock?: boolean;
  bounceStiffness?: number;
  bounceDamping?: number;
  dragElastic?: number;
  reducedMotion?: ReducedMotionMode;
};

export function DragLockDirection({
  dragDirectionLock = DRAG_LOCK_DEFAULTS.dragDirectionLock,
  bounceStiffness = DRAG_LOCK_DEFAULTS.bounceStiffness,
  bounceDamping = DRAG_LOCK_DEFAULTS.bounceDamping,
  dragElastic = DRAG_LOCK_DEFAULTS.dragElastic,
  reducedMotion = DRAG_LOCK_DEFAULTS.reducedMotion,
}: DragLockDirectionProps) {
  const [runId, setRunId] = useState(0);
  const [activeDirection, setActiveDirection] = useState<'x' | 'y' | null>(
    null,
  );

  return (
    <GestureFrame
      title="Drag lock direction"
      mechanism={
        <>
          <code>dragDirectionLock</code> picks the first axis that passes the
          pan threshold. <code>onDirectionLock</code> names it.{' '}
          <code>dragConstraints</code> at 0 rubber-bands back.{' '}
          <code>dragTransition</code> sets bounce stiffness and damping.
        </>
      }
      docs={MOTION_RUNTIME.docsDrag}
      example={EXAMPLES.lock.page}
      live={EXAMPLES.lock.live}
      fixedNote="Constraints stay {{ top: 0, right: 0, bottom: 0, left: 0 }} because that origin is the rubber-band. The box is 72 px so the Tracker label fits. Upstream was 52 px with no text. Axis lines stay 300 px."
      onReplay={() => {
        setActiveDirection(null);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
    >
      <div className="gesture-example__stage gesture-example__stage--lock">
        <p className="gesture-lock__caption gesture-lock__caption--x">Week</p>
        <p className="gesture-lock__caption gesture-lock__caption--y">Team</p>
        <Line direction="x" activeDirection={activeDirection} />
        <Line direction="y" activeDirection={activeDirection} />
        <motion.button
          key={runId}
          type="button"
          className="gesture-lock__box"
          drag
          dragDirectionLock={dragDirectionLock}
          onDirectionLock={(direction) => setActiveDirection(direction)}
          onDragEnd={() => setActiveDirection(null)}
          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
          dragTransition={{ bounceStiffness, bounceDamping }}
          dragElastic={dragElastic}
          whileDrag={{ cursor: 'grabbing' }}
          data-lock-axis={activeDirection ?? 'none'}
          data-lock-enabled={dragDirectionLock ? 'true' : 'false'}
          aria-label="100-person tracker. Drag to lock to Week or Team."
        >
          Tracker
        </motion.button>
      </div>
    </GestureFrame>
  );
}

function Line({
  direction,
  activeDirection,
}: {
  direction: 'x' | 'y';
  activeDirection: 'x' | 'y' | null;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: activeDirection === direction ? 1 : 0.3 }}
      transition={{ duration: 0.1 }}
      className="gesture-lock__line"
      style={{ rotate: direction === 'y' ? 90 : 0 }}
      aria-hidden="true"
    />
  );
}
