import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { LayoutFrame } from './Frame';
import {
  EXAMPLES,
  MOTION_RUNTIME,
  REORDER_ITEM_TILES,
  REORDER_ITEMS_DEFAULTS,
  shouldReduce,
  shuffleTiles,
  type LayoutMode,
  type ReducedMotionMode,
  type ReorderTileId,
} from './source';

export type ReorderItemsProps = {
  intervalMs?: number;
  stiffness?: number;
  damping?: number;
  layout?: LayoutMode;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const INITIAL_IDS = REORDER_ITEM_TILES.map((tile) => tile.id);

function tileFor(id: ReorderTileId) {
  const tile = REORDER_ITEM_TILES.find((entry) => entry.id === id);
  if (!tile) {
    throw new Error(`Unknown reorder tile: ${id}`);
  }
  return tile;
}

export function ReorderItems({
  intervalMs = REORDER_ITEMS_DEFAULTS.intervalMs,
  stiffness = REORDER_ITEMS_DEFAULTS.stiffness,
  damping = REORDER_ITEMS_DEFAULTS.damping,
  layout = REORDER_ITEMS_DEFAULTS.layout,
  paused: pausedProp = REORDER_ITEMS_DEFAULTS.paused,
  reducedMotion = REORDER_ITEMS_DEFAULTS.reducedMotion,
}: ReorderItemsProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [order, setOrder] = useState<ReorderTileId[]>([...INITIAL_IDS]);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const running = !paused && !reduce;

  useEffect(() => {
    if (paused || reduce) return undefined;
    const timeout = window.setTimeout(() => {
      setOrder((current) => shuffleTiles(current));
    }, intervalMs);
    return () => window.clearTimeout(timeout);
  }, [order, paused, reduce, intervalMs]);

  const spring = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, damping, stiffness };

  return (
    <LayoutFrame
      title="Reorder items"
      mechanism={
        <>
          This is not <code>Reorder.Group</code>. Each <code>motion.li</code>{' '}
          has <code>layout</code>. A timeout calls shuffle every interval. The
          tile keeps <code>key</code> so React reorders the nodes and the
          projection node FLIP-animates them.
        </>
      }
      docs={MOTION_RUNTIME.docsLayout}
      example={EXAMPLES.reorderItems.page}
      live={EXAMPLES.reorderItems.live}
      fixedNote="Upstream tiles are 100 by 100 colour squares in a 300 pixel wrap with gap 10. These tiles are 8.75 rem so a photograph and Start, Learn, Tools, or Challenge week stay readable. The wrap width stays 18.75 rem (300 px). This loop is continuous, so Pause and Speed (interval) are the controls. Replay remounts the original order."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((value) => !value)}
      onReplay={() => {
        setOrder([...INITIAL_IDS]);
        setPaused(false);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="reorder-items"
      running={running}
      runId={runId}
    >
      <div className="layout-example__stage">
        <ul
          key={runId}
          className="layout-tiles"
          aria-label="Academy week tiles"
          data-order={order.join(',')}
        >
          {order.map((id) => {
            const tile = tileFor(id);
            return (
              <motion.li
                key={id}
                className="layout-tiles__item"
                layout={layout}
                transition={spring}
              >
                <img
                  data-photo=""
                  className="layout-tiles__photo"
                  src={tile.photo.src}
                  alt={tile.photo.alt}
                />
                <p className="layout-tiles__label">{tile.label}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </LayoutFrame>
  );
}
