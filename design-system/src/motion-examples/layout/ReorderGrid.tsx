import { Reorder, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { LayoutFrame } from './Frame';
import {
  EXAMPLES,
  GRID_ITEMS,
  MOTION_RUNTIME,
  REORDER_GRID_DEFAULTS,
  shouldReduce,
  type GridItemId,
  type ReducedMotionMode,
  type ReorderAxis,
} from './source';

export type ReorderGridProps = {
  dragScale?: number;
  stiffness?: number;
  damping?: number;
  axis?: ReorderAxis;
  reducedMotion?: ReducedMotionMode;
};

const INITIAL_IDS = GRID_ITEMS.map((item) => item.id);

function labelFor(id: GridItemId): string {
  return GRID_ITEMS.find((item) => item.id === id)?.label ?? id;
}

export function ReorderGrid({
  dragScale = REORDER_GRID_DEFAULTS.dragScale,
  stiffness = REORDER_GRID_DEFAULTS.stiffness,
  damping = REORDER_GRID_DEFAULTS.damping,
  axis = REORDER_GRID_DEFAULTS.axis,
  reducedMotion = REORDER_GRID_DEFAULTS.reducedMotion,
}: ReorderGridProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [items, setItems] = useState<GridItemId[]>([...INITIAL_IDS]);
  const spring = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness, damping };

  return (
    <LayoutFrame
      title="Reorder grid"
      mechanism={
        <>
          <code>Reorder.Group</code> plus <code>Reorder.Item</code>. This is
          not a plain <code>layout</code> shuffle. Item drag writes{' '}
          <code>x</code>/<code>y</code>. <code>checkReorder</code> moves the
          value when the dragged centre is closer to another cell. Item{' '}
          <code>layout</code> then FLIP-animates neighbours. Axis is detected
          as <code>xy</code> for this 4-column grid.
        </>
      }
      docs={MOTION_RUNTIME.docsReorder}
      example={EXAMPLES.reorderGrid.page}
      live={EXAMPLES.reorderGrid.live}
      fixedNote="Upstream is 16 numbered cells, 4 columns, width min(76vw, 420px), gap 8. Those layout values stay fixed so each Week 0 action stays a square you can grab. dragSnapToOrigin stays true because Reorder.Item sets it. Reorder is pointer-drag only. Keyboard cannot move a cell. Replay restores the original order."
      controlKind="replay"
      onReplay={() => {
        setItems([...INITIAL_IDS]);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="reorder-grid"
      running={!reduce}
      runId={runId}
    >
      <div className="layout-example__stage">
        <Reorder.Group
          key={runId}
          as="div"
          values={items}
          onReorder={setItems}
          axis={axis === 'auto' ? undefined : axis}
          className="layout-grid"
          role="list"
          aria-label="Week 0 and Challenge week actions"
          data-order={items.join(',')}
        >
          {items.map((id, index) => (
            <Reorder.Item
              as="div"
              key={id}
              value={id}
              className="layout-grid__item"
              role="listitem"
              transition={spring}
              whileDrag={{ scale: dragScale, backgroundColor: '#DEF54F' }}
              aria-label={`${labelFor(id)}. Position ${index + 1} of ${items.length}. Drag to reorder.`}
            >
              {labelFor(id)}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </LayoutFrame>
  );
}
