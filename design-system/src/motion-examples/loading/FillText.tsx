import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import { FILL_TEXT_DEFAULTS } from './defaults';
import { LoadingFrame } from './Frame';
import {
  LOADING_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type FillTextProps = {
  intervalMs?: number;
  increment?: number;
  text?: string;
  caption?: string;
  fontSize?: number;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function FillTextRun({
  intervalMs,
  increment,
  text,
  caption,
  fontSize,
  skip,
}: {
  intervalMs: number;
  increment: number;
  text: string;
  caption: string;
  fontSize: number;
  skip: boolean;
}) {
  const progress = useSpring(skip ? 1 : 0);
  const clipPath = useTransform(
    progress,
    [0, 1],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
  );
  const [shown, setShown] = useState(skip ? 1 : 0);

  useMotionValueEvent(progress, 'change', (latest) => {
    setShown(latest);
  });

  useEffect(() => {
    if (skip) {
      progress.set(1);
      return;
    }

    const interval = setInterval(() => {
      const newProgress = progress.get() + Math.random() * increment;

      if (newProgress >= 1) {
        clearInterval(interval);
      }

      progress.set(newProgress);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [increment, intervalMs, progress, skip]);

  return (
    <>
      <div
        role="status"
        aria-label={caption}
        className="loading__text-wrap"
        data-progress={shown.toFixed(2)}
        style={{ '--loading-font-size': `${fontSize}px` } as CSSProperties}
      >
        <div className="loading__text loading__text-bg" aria-hidden>
          {text}
        </div>
        <motion.div className="loading__text loading__text-fill" style={{ clipPath }}>
          {text}
        </motion.div>
      </div>
      <p className="loading__caption">{caption}</p>
    </>
  );
}

export function FillText({
  intervalMs = FILL_TEXT_DEFAULTS.intervalMs,
  increment = FILL_TEXT_DEFAULTS.increment,
  text = FILL_TEXT_DEFAULTS.text,
  caption = FILL_TEXT_DEFAULTS.caption,
  fontSize = FILL_TEXT_DEFAULTS.fontSize,
  reducedMotion = FILL_TEXT_DEFAULTS.reducedMotion,
  replayNonce = FILL_TEXT_DEFAULTS.replayNonce,
}: FillTextProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = LOADING_EXAMPLES.fillText;

  return (
    <LoadingFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      extraDocs="https://motion.dev/docs/react-use-transform"
      example={example.example}
      live={example.live}
      fixedNote="useSpring is called with no options, matching upstream. Unbounded 900 is replaced by Brand Sans 700 because this catalogue ships Brand Sans at 400 and 700. clip-path strings stay the fill geometry. This animation is one-shot, so Replay remounts the spring."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="loading-fill-text"
      running={!reduce}
      runId={runId}
    >
      <FillTextRun
        key={`${runId}-${replayNonce}-${text}-${intervalMs}-${increment}-${reduce}`}
        intervalMs={intervalMs}
        increment={increment}
        text={text}
        caption={caption}
        fontSize={fontSize}
        skip={reduce}
      />
    </LoadingFrame>
  );
}
