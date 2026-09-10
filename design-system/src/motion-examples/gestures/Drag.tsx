import { motion } from 'motion/react';
import { useState } from 'react';

import { GestureFrame } from './Frame';
import {
  DRAG_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  type DragAxis,
  type ReducedMotionMode,
} from './source';

export type DragProps = {
  drag?: DragAxis;
  dragMomentum?: boolean;
  whileDragScale?: number;
  heading?: string;
  kicker?: string;
  photoSrc?: string;
  photoAlt?: string;
  reducedMotion?: ReducedMotionMode;
};

export function Drag({
  drag = DRAG_DEFAULTS.drag,
  dragMomentum = DRAG_DEFAULTS.dragMomentum,
  whileDragScale = DRAG_DEFAULTS.whileDragScale,
  heading = DRAG_DEFAULTS.heading,
  kicker = DRAG_DEFAULTS.kicker,
  photoSrc = DRAG_DEFAULTS.photoSrc,
  photoAlt = DRAG_DEFAULTS.photoAlt,
  reducedMotion = DRAG_DEFAULTS.reducedMotion,
}: DragProps) {
  const [runId, setRunId] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <GestureFrame
      title="Drag"
      mechanism={
        <>
          <code>drag</code> starts a <code>PanSession</code> on pointer down.
          After 3 px it writes <code>x</code> and <code>y</code>. Release runs
          inertia when <code>dragMomentum</code> is true.
        </>
      }
      docs={MOTION_RUNTIME.docsDrag}
      example={EXAMPLES.drag.page}
      live={EXAMPLES.drag.live}
      fixedNote="The card is 220 by 148 pixels so Week 0 copy stays legible. Upstream used a 100 px colour square with no text. Replay remounts the card at the origin. The stage is 22 rem so a free drag stays in view."
      onReplay={() => {
        setOffset({ x: 0, y: 0 });
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
    >
      <div className="gesture-example__stage">
        <motion.button
          key={runId}
          type="button"
          className="gesture-card"
          drag={drag}
          dragMomentum={dragMomentum}
          whileDrag={
            whileDragScale === 1 ? undefined : { scale: whileDragScale }
          }
          onUpdate={(latest) => {
            setOffset({
              x: Math.round(typeof latest.x === 'number' ? latest.x : 0),
              y: Math.round(typeof latest.y === 'number' ? latest.y : 0),
            });
          }}
          data-offset-x={offset.x}
          data-offset-y={offset.y}
          aria-label={`${kicker}. ${heading} Drag to move.`}
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
      </div>
    </GestureFrame>
  );
}
