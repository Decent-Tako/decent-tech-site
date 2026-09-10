import { motion, useReducedMotion } from 'motion/react';
import { useState, type KeyboardEvent } from 'react';

import { FormsFrame } from './Frame';
import {
  EXAMPLES,
  MOTION_RUNTIME,
  shouldReduce,
  TAB_SELECT_DEFAULTS,
  type ReducedMotionMode,
} from './source';

export type TabSelectProps = {
  tapScale?: number;
  tabs?: string[];
  initialIndex?: number;
  reducedMotion?: ReducedMotionMode;
};

export function TabSelect({
  tapScale = TAB_SELECT_DEFAULTS.tapScale,
  tabs = TAB_SELECT_DEFAULTS.tabs,
  initialIndex = TAB_SELECT_DEFAULTS.initialIndex,
  reducedMotion = TAB_SELECT_DEFAULTS.reducedMotion,
}: TabSelectProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);

  return (
    <FormsFrame
      title="Tab select"
      mechanism={
        <>
          The selected tab renders <code>layoutId=&quot;selected-indicator&quot;</code>.
          The projection stack moves that pill. <code>onTapStart</code> is
          keyboard-accessible. <code>whileTap</code> and <code>whileFocus</code>{' '}
          set the press and focus targets.
        </>
      }
      docs={MOTION_RUNTIME.docsLayout}
      extraDocs={MOTION_RUNTIME.docsGestures}
      example={EXAMPLES.tabSelect.page}
      live={EXAMPLES.tabSelect.live}
      extraRuntime={`Live source ${EXAMPLES.tabSelect.sourceChunk}. The article page prints the Get started stub.`}
      priorNote="Shared layout animation in this catalogue already uses layoutId for week tabs. That is a different example."
      fixedNote="layoutId stays the string selected-indicator. The bar is content-sized so Start, Learn, Tools, and Challenge stay readable. Replay returns to the first tab."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="tab-select"
      running={!reduce}
      runId={runId}
    >
      <div className="forms-stage forms-stage--tabs">
        <TabSelectRun
          key={`${runId}-${initialIndex}`}
          tapScale={tapScale}
          tabs={tabs}
          initialIndex={initialIndex}
          reduce={reduce}
        />
      </div>
    </FormsFrame>
  );
}

function TabSelectRun({
  tapScale,
  tabs,
  initialIndex,
  reduce,
}: {
  tapScale: number;
  tabs: string[];
  initialIndex: number;
  reduce: boolean;
}) {
  const [selectedTab, setSelectedTab] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(tabs.length - 1, 0)),
  );
  const transition = reduce ? { duration: 0 } : undefined;

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    if (tabs.length === 0) return;
    const dir = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + dir + tabs.length) % tabs.length;
    setSelectedTab(nextIndex);
    const node = event.currentTarget.parentElement?.querySelector(
      `#forms-tab-${nextIndex}`,
    );
    if (node instanceof HTMLElement) node.focus();
  };

  return (
    <div className="forms-tabs" role="tablist" aria-label="Academy weeks">
      {tabs.map((name, index) => {
        const isSelected = selectedTab === index;
        return (
          <motion.button
            key={`${name}-${index}`}
            type="button"
            id={`forms-tab-${index}`}
            className="forms-tabs__tab"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onTapStart={() => setSelectedTab(index)}
            onClick={() => setSelectedTab(index)}
            onKeyDown={(event) => onTabKey(event, index)}
            whileTap={{ scale: tapScale }}
            whileFocus={{
              backgroundColor: 'var(--forms-accent-transparent)',
            }}
          >
            {isSelected ? (
              <motion.div
                layoutId="selected-indicator"
                className="forms-tabs__indicator"
                transition={transition}
                aria-hidden="true"
              />
            ) : null}
            <span className="forms-tabs__label">{name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
