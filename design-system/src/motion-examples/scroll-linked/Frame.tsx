import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import './scroll.css';

export function ExampleChrome({
  title,
  intro,
  fixedNote,
  reducedMotion,
  pauseLabel,
  paused,
  onPause,
  replay,
  onReplay,
  children,
}: {
  title: string;
  intro: ReactNode;
  fixedNote: string;
  reducedMotion: 'user' | 'always' | 'never';
  pauseLabel?: string;
  paused?: boolean;
  onPause?: () => void;
  replay?: boolean;
  onReplay?: () => void;
  children: ReactNode;
}) {
  const motionReduced =
    reducedMotion === 'never'
      ? 'never'
      : reducedMotion === 'always'
        ? 'always'
        : 'user';

  return (
    <MotionConfig reducedMotion={motionReduced}>
      <article className="scroll-ex">
        <div className="scroll-ex__bar">
          <div>
            <h2 className="scroll-ex__title">{title}</h2>
            <p className="scroll-ex__intro">{intro}</p>
          </div>
          <div className="scroll-ex__actions">
            {pauseLabel && onPause ? (
              <button
                type="button"
                className="scroll-ex__button"
                aria-pressed={Boolean(paused)}
                onClick={onPause}
              >
                {paused ? 'Resume' : pauseLabel}
              </button>
            ) : null}
            {replay && onReplay ? (
              <button
                type="button"
                className="scroll-ex__button"
                onClick={onReplay}
              >
                Replay
              </button>
            ) : null}
          </div>
        </div>
        <p className="scroll-ex__fixed">{fixedNote}</p>
        {children}
      </article>
    </MotionConfig>
  );
}
