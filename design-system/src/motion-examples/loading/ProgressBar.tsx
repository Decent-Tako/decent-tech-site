import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import { PROGRESS_BAR_DEFAULTS } from './defaults';
import { LoadingFrame } from './Frame';
import {
  LOADING_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type ProgressBarProps = {
  intervalMs?: number;
  increment?: number;
  trackWidth?: number;
  trackHeight?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function ProgressBarRun({
  intervalMs,
  increment,
  trackWidth,
  trackHeight,
  caption,
  skip,
}: {
  intervalMs: number;
  increment: number;
  trackWidth: number;
  trackHeight: number;
  caption: string;
  skip: boolean;
}) {
  const progress = useSpring(skip ? 1 : 0);
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

  const percent = Math.max(0, Math.min(100, Math.round(shown * 100)));

  return (
    <>
      <div
        className="loading__progress"
        role="progressbar"
        aria-label={caption}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        data-progress={shown.toFixed(2)}
        style={
          {
            '--loading-track-width': `${trackWidth}px`,
            '--loading-track-height': `${trackHeight}px`,
          } as CSSProperties
        }
      >
        <div className="loading__progress-track">
          <motion.div
            className="loading__progress-bar"
            style={{ scaleX: progress }}
          />
        </div>
      </div>
      <p className="loading__caption">
        {caption} · {percent}%
      </p>
    </>
  );
}

export function ProgressBar({
  intervalMs = PROGRESS_BAR_DEFAULTS.intervalMs,
  increment = PROGRESS_BAR_DEFAULTS.increment,
  trackWidth = PROGRESS_BAR_DEFAULTS.trackWidth,
  trackHeight = PROGRESS_BAR_DEFAULTS.trackHeight,
  caption = PROGRESS_BAR_DEFAULTS.caption,
  reducedMotion = PROGRESS_BAR_DEFAULTS.reducedMotion,
  replayNonce = PROGRESS_BAR_DEFAULTS.replayNonce,
}: ProgressBarProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = LOADING_EXAMPLES.progressBar;

  return (
    <LoadingFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      fixedNote="useSpring is called with no options, matching upstream. transform-origin 0% 50% stays fixed because that is how the bar grows from the left. The track is 300 by 10 pixels at the upstream default. This animation is one-shot, so Replay remounts the spring."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="loading-progress-bar"
      running={!reduce}
      runId={runId}
    >
      <ProgressBarRun
        key={`${runId}-${replayNonce}-${intervalMs}-${increment}-${reduce}`}
        intervalMs={intervalMs}
        increment={increment}
        trackWidth={trackWidth}
        trackHeight={trackHeight}
        caption={caption}
        skip={reduce}
      />
    </LoadingFrame>
  );
}
