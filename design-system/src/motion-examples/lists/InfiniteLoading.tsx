import { motion, stagger, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { ListsFrame } from './Frame';
import {
  ACADEMY_NEWS,
  EXAMPLES,
  INFINITE_LOADING_DEFAULTS,
  MOTION_RUNTIME,
  shouldReduce,
  type NewsItemData,
  type ReducedMotionMode,
} from './source';

export type InfiniteLoadingProps = {
  staggerDelay?: number;
  itemY?: number;
  itemDuration?: number;
  spinnerDuration?: number;
  batchSize?: number;
  fetchDelay?: number;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function useAcademyNews(
  batchSize: number,
  fetchDelay: number,
): [NewsItemData[], () => Promise<void>] {
  const [items, setItems] = useState(ACADEMY_NEWS.slice(0, batchSize));
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(batchSize);

  const fetchMoreItems = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await new Promise((resolve) => {
      window.setTimeout(resolve, fetchDelay);
    });
    const nextItems: NewsItemData[] = [];
    for (let index = 0; index < batchSize; index += 1) {
      nextItems.push(ACADEMY_NEWS[(currentIndex + index) % ACADEMY_NEWS.length]);
    }
    setItems((prev) => [...prev, ...nextItems]);
    setCurrentIndex((prev) => (prev + batchSize) % ACADEMY_NEWS.length);
    setIsLoading(false);
  };

  return [items, fetchMoreItems];
}

function NewsItem({
  headline,
  subtitle,
  itemY,
  itemDuration,
  reduce,
}: {
  headline: string;
  subtitle: string;
  itemY: number;
  itemDuration: number;
  reduce: boolean;
}) {
  return (
    <motion.article
      className="lists-news__item"
      variants={{
        hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : itemY },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: reduce ? 0 : itemDuration, ease: 'easeOut' }}
    >
      <h4>{headline}</h4>
      <p>{subtitle}</p>
    </motion.article>
  );
}

function LoadingSpinner({
  onInView,
  duration,
  running,
}: {
  onInView: () => void;
  duration: number;
  running: boolean;
}) {
  return (
    <motion.div
      className="lists-news__spinner"
      role="status"
      aria-label="Loading more Academy notes"
      animate={running ? { rotate: 360 } : { rotate: 0 }}
      transition={
        running
          ? { duration, repeat: Infinity, ease: 'linear' }
          : { duration: 0 }
      }
      onViewportEnter={onInView}
    >
      <div className="lists-news__spinner-ring" aria-hidden="true" />
    </motion.div>
  );
}

export function InfiniteLoading({
  staggerDelay = INFINITE_LOADING_DEFAULTS.staggerDelay,
  itemY = INFINITE_LOADING_DEFAULTS.itemY,
  itemDuration = INFINITE_LOADING_DEFAULTS.itemDuration,
  spinnerDuration = INFINITE_LOADING_DEFAULTS.spinnerDuration,
  batchSize = INFINITE_LOADING_DEFAULTS.batchSize,
  fetchDelay = INFINITE_LOADING_DEFAULTS.fetchDelay,
  paused: pausedProp = INFINITE_LOADING_DEFAULTS.paused,
  reducedMotion = INFINITE_LOADING_DEFAULTS.reducedMotion,
}: InfiniteLoadingProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }
  const running = !paused && !reduce;

  return (
    <ListsFrame
      title="Infinite loading"
      mechanism={
        <>
          Parent variants set <code>delayChildren: stagger(staggerDelay)</code>.
          Each <code>motion.article</code> moves from <code>y: itemY</code> and
          opacity 0 to rest. The spinner is a continuous <code>rotate: 360</code>{' '}
          loop. <code>onViewportEnter</code> loads the next batch. The spinner
          remounts with <code>key=items.length</code> so the next enter can
          fire.
        </>
      }
      docs={MOTION_RUNTIME.docsAnimation}
      example={EXAMPLES.infiniteLoading.page}
      live={EXAMPLES.infiniteLoading.live}
      chunk={EXAMPLES.infiniteLoading.chunk}
      fixedNote="The list is 34 rem wide so each Academy note stays readable. The stage is 16 rem tall so the spinner sits below the fold. Scroll to load the next batch. The spinner is 48 px. That loop is continuous, so Pause and Speed apply to it. Replay resets the list to the first batch."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      onReplay={() => {
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="infinite-loading"
      running={running}
      runId={runId}
    >
      <div
        className="lists-example__stage lists-example__stage--news"
        tabIndex={0}
        role="region"
        aria-label="Academy notes list"
      >
        <InfiniteRun
          key={runId}
          batchSize={batchSize}
          fetchDelay={fetchDelay}
          staggerDelay={staggerDelay}
          itemY={itemY}
          itemDuration={itemDuration}
          spinnerDuration={spinnerDuration}
          reduce={reduce}
          running={running}
        />
      </div>
    </ListsFrame>
  );
}

function InfiniteRun({
  batchSize,
  fetchDelay,
  staggerDelay,
  itemY,
  itemDuration,
  spinnerDuration,
  reduce,
  running,
}: {
  batchSize: number;
  fetchDelay: number;
  staggerDelay: number;
  itemY: number;
  itemDuration: number;
  spinnerDuration: number;
  reduce: boolean;
  running: boolean;
}) {
  const [items, fetchMoreItems] = useAcademyNews(batchSize, fetchDelay);
  return (
    <div className="lists-news" data-count={String(items.length)}>
      <header className="lists-news__header">
        <h3>Academy notes</h3>
        <p>Week 0 through Challenge week. Scroll for the next batch.</p>
      </header>
      <motion.div
        className="lists-news__list"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: reduce ? 0 : stagger(staggerDelay),
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <NewsItem
            key={`${item.headline}-${index}`}
            headline={item.headline}
            subtitle={item.subtitle}
            itemY={itemY}
            itemDuration={itemDuration}
            reduce={reduce}
          />
        ))}
      </motion.div>
      <LoadingSpinner
        key={items.length}
        onInView={fetchMoreItems}
        duration={spinnerDuration}
        running={running}
      />
    </div>
  );
}
