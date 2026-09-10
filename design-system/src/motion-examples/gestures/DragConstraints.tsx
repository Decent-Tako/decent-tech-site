import { motion } from 'motion/react';
import { useRef, useState } from 'react';

import { GestureFrame } from './Frame';
import {
  CONSTRAINT_SIZE,
  DRAG_CONSTRAINTS_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  type ConstraintMode,
  type ReducedMotionMode,
} from './source';

export type DragConstraintsProps = {
  constraintMode?: ConstraintMode;
  dragElastic?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  heading?: string;
  kicker?: string;
  photoSrc?: string;
  photoAlt?: string;
  reducedMotion?: ReducedMotionMode;
};

export function DragConstraints({
  constraintMode = DRAG_CONSTRAINTS_DEFAULTS.constraintMode,
  dragElastic = DRAG_CONSTRAINTS_DEFAULTS.dragElastic,
  top = DRAG_CONSTRAINTS_DEFAULTS.top,
  left = DRAG_CONSTRAINTS_DEFAULTS.left,
  right = DRAG_CONSTRAINTS_DEFAULTS.right,
  bottom = DRAG_CONSTRAINTS_DEFAULTS.bottom,
  heading = DRAG_CONSTRAINTS_DEFAULTS.heading,
  kicker = DRAG_CONSTRAINTS_DEFAULTS.kicker,
  photoSrc = DRAG_CONSTRAINTS_DEFAULTS.photoSrc,
  photoAlt = DRAG_CONSTRAINTS_DEFAULTS.photoAlt,
  reducedMotion = DRAG_CONSTRAINTS_DEFAULTS.reducedMotion,
}: DragConstraintsProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const useRefBounds = constraintMode === 'ref';

  return (
    <GestureFrame
      title="Drag constraints"
      mechanism={
        <>
          <code>dragConstraints</code> is a parent ref or a pixel box.{' '}
          <code>dragElastic</code> lets the card travel past the edge, then
          spring back. Upstream default for this example is 0.2. Motion default
          is 0.35.
        </>
      }
      docs={MOTION_RUNTIME.docsDrag}
      example={EXAMPLES.constraints.page}
      live={EXAMPLES.constraints.live}
      fixedNote={`The board is ${CONSTRAINT_SIZE} px so the Challenge week card stays inside a visible frame. Upstream was 300 px with a 100 px square. Pixel constraints stay unused when constraintMode is ref.`}
      onReplay={() => {
        setOffset({ x: 0, y: 0 });
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
    >
      <div className="gesture-example__stage">
        <motion.div
          ref={constraintsRef}
          className="gesture-constraints"
          style={{ width: CONSTRAINT_SIZE, height: CONSTRAINT_SIZE }}
          data-constraint-mode={constraintMode}
        >
          <motion.button
            key={runId}
            type="button"
            className="gesture-card"
            drag
            dragConstraints={
              useRefBounds
                ? constraintsRef
                : { top, left, right, bottom }
            }
            dragElastic={dragElastic}
            onUpdate={(latest) => {
              setOffset({
                x: Math.round(typeof latest.x === 'number' ? latest.x : 0),
                y: Math.round(typeof latest.y === 'number' ? latest.y : 0),
              });
            }}
            data-offset-x={offset.x}
            data-offset-y={offset.y}
            aria-label={`${kicker}. ${heading} Drag inside the board.`}
          >
            <img
              data-photo=""
              className="gesture-card__photo"
              src={photoSrc}
              alt={photoAlt}
            />
            <p className="gesture-card__kicker">{kicker}</p>
            <p className="gesture-card__title">{heading}</p>
          </motion.button>
        </motion.div>
      </div>
    </GestureFrame>
  );
}
