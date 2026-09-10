import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState, type KeyboardEvent } from 'react';

import { LayoutFrame } from './Frame';
import {
  EXAMPLES,
  MOTION_RUNTIME,
  SHARED_LAYOUT_DEFAULTS,
  SHARED_LAYOUT_TABS,
  shouldReduce,
  type PresenceMode,
  type ReducedMotionMode,
  type SharedTabId,
} from './source';

export type SharedLayoutAnimationProps = {
  presenceMode?: PresenceMode;
  duration?: number;
  yFrom?: number;
  heading?: string;
  reducedMotion?: ReducedMotionMode;
};

export function SharedLayoutAnimation({
  presenceMode = SHARED_LAYOUT_DEFAULTS.presenceMode,
  duration = SHARED_LAYOUT_DEFAULTS.duration,
  yFrom = SHARED_LAYOUT_DEFAULTS.yFrom,
  heading = SHARED_LAYOUT_DEFAULTS.heading,
  reducedMotion = SHARED_LAYOUT_DEFAULTS.reducedMotion,
}: SharedLayoutAnimationProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [selectedId, setSelectedId] = useState<SharedTabId>(
    SHARED_LAYOUT_TABS[0].id,
  );
  const selected =
    SHARED_LAYOUT_TABS.find((tab) => tab.id === selectedId) ??
    SHARED_LAYOUT_TABS[0];
  const panelTransition = reduce ? { duration: 0 } : { duration };

  return (
    <LayoutFrame
      title="Shared layout animation"
      mechanism={
        <>
          The selected tab renders <code>layoutId=&quot;underline&quot;</code>.
          The projection stack moves that underline from the old tab box to the
          new one. Panel copy is a second loop: <code>AnimatePresence</code>{' '}
          with <code>mode</code> default <code>wait</code>.
        </>
      }
      docs={MOTION_RUNTIME.docsLayout}
      example={EXAMPLES.sharedLayout.page}
      live={EXAMPLES.sharedLayout.live}
      priorNote="App Store in this catalogue already uses layoutId for a card overlay. That is a different example."
      fixedNote="Upstream container is 480 by 360 pixels with Tomato, Lettuce, and Cheese. This card is 30 rem by 22.5 rem so Start, Learn, and Challenge week stay readable with a full-colour photograph. layoutId stays the string underline. Replay remounts on Start."
      controlKind="replay"
      onReplay={() => {
        setSelectedId(SHARED_LAYOUT_TABS[0].id);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="shared-layout-animation"
      running={!reduce}
      runId={runId}
    >
      <div className="layout-example__stage">
        <div key={runId} className="layout-tabs">
          <p className="layout-tabs__kicker" style={{ padding: '0.75rem 1rem 0' }}>
            {heading}
          </p>
          <div className="layout-tabs__list" role="tablist" aria-label={heading}>
            {SHARED_LAYOUT_TABS.map((tab, index) => {
              const isSelected = tab.id === selectedId;
              const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
                if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
                  return;
                }
                event.preventDefault();
                const dir = event.key === 'ArrowRight' ? 1 : -1;
                const nextIndex =
                  (index + dir + SHARED_LAYOUT_TABS.length) %
                  SHARED_LAYOUT_TABS.length;
                const next = SHARED_LAYOUT_TABS[nextIndex];
                setSelectedId(next.id);
                const node = event.currentTarget.parentElement?.querySelector(
                  `#layout-tab-${next.id}`,
                );
                if (node instanceof HTMLElement) node.focus();
              };
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`layout-tab-${tab.id}`}
                  aria-controls={`layout-panel-${tab.id}`}
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  className="layout-tabs__tab"
                  onClick={() => setSelectedId(tab.id)}
                  onKeyDown={onTabKey}
                >
                  {tab.label}
                  {isSelected ? (
                    <motion.div
                      className="layout-tabs__underline"
                      layoutId="underline"
                      transition={panelTransition}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode={presenceMode}>
            <motion.div
              key={selected.id}
              role="tabpanel"
              id={`layout-panel-${selected.id}`}
              aria-labelledby={`layout-tab-${selected.id}`}
              className="layout-tabs__panel"
              data-selected={selected.id}
              initial={reduce ? false : { y: yFrom, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: -yFrom, opacity: 0 }}
              transition={panelTransition}
            >
              <img
                data-photo=""
                className="layout-tabs__photo"
                src={selected.photo.src}
                alt={selected.photo.alt}
              />
              <p className="layout-tabs__kicker">{selected.kicker}</p>
              <p className="layout-tabs__copy">{selected.copy}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </LayoutFrame>
  );
}
