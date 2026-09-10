import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import './primitives.css';

const MOTION_RUNTIME_INLINE = 'Default runtime motion 13.2.0.';

export function PrimitiveFrame({
  title,
  docs,
  registry,
  extraRuntime,
  fixedNote,
  replay,
  onReplay,
  pauseLabel,
  onPause,
  children,
}: {
  title: string;
  docs: string;
  registry: string;
  extraRuntime?: string;
  fixedNote?: string;
  replay?: boolean;
  onReplay?: () => void;
  pauseLabel?: string;
  onPause?: () => void;
  children: ReactNode;
}) {
  return (
    <article className="mp-frame">
      <div className="mp-frame__head">
        <h2 className="mp-frame__title">{title}</h2>
        <div className="mp-frame__actions">
          {pauseLabel && onPause ? (
            <button type="button" className="mp-frame__button" onClick={onPause}>
              {pauseLabel}
            </button>
          ) : null}
          {replay && onReplay ? (
            <button type="button" className="mp-frame__button" onClick={onReplay}>
              Replay
            </button>
          ) : null}
        </div>
      </div>
      <p className="mp-frame__meta">
        Motion Primitives registry copy. {MOTION_RUNTIME_INLINE} Licence MIT.
        Last source push 2026-03-19. Docs <a href={docs}>{docs}</a>. Registry{' '}
        <a href={registry}>{registry}</a>. Source{' '}
        <a href="https://github.com/ibelick/motion-primitives">
          https://github.com/ibelick/motion-primitives
        </a>
        .
      </p>
      {extraRuntime ? <p className="mp-frame__meta">{extraRuntime}</p> : null}
      {fixedNote ? <p className="mp-frame__meta">{fixedNote}</p> : null}
      <MotionConfig reducedMotion="never">
        <div className="mp-frame__stage">{children}</div>
      </MotionConfig>
    </article>
  );
}
