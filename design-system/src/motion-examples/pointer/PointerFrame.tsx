import { MotionConfig } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';

import './pointer.css';

export function PointerFrame({
  title,
  attribution,
  extraRuntime,
  fixedNote,
  pauseLabel,
  onPause,
  replay,
  onReplay,
  reducedMotion,
  stageClassName,
  stageTestId,
  stageStyle,
  children,
}: {
  title: string;
  attribution: ReactNode;
  extraRuntime?: ReactNode;
  fixedNote: ReactNode;
  pauseLabel?: string;
  onPause?: () => void;
  replay?: boolean;
  onReplay?: () => void;
  reducedMotion: 'user' | 'always' | 'never';
  stageClassName?: string;
  stageTestId?: string;
  stageStyle?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <MotionConfig
      reducedMotion={
        reducedMotion === 'always'
          ? 'always'
          : reducedMotion === 'never'
            ? 'never'
            : 'user'
      }
    >
      <article className="pointer-frame">
        <div className="pointer-frame__head">
          <h2 className="pointer-frame__title">{title}</h2>
          <div className="pointer-frame__actions">
            {pauseLabel && onPause ? (
              <button
                type="button"
                className="pointer-frame__button"
                onClick={onPause}
              >
                {pauseLabel}
              </button>
            ) : null}
            {replay && onReplay ? (
              <button
                type="button"
                className="pointer-frame__button"
                onClick={onReplay}
              >
                Replay
              </button>
            ) : null}
          </div>
        </div>
        <p className="pointer-frame__meta">{attribution}</p>
        {extraRuntime ? (
          <p className="pointer-frame__meta">{extraRuntime}</p>
        ) : null}
        <p className="pointer-frame__fixed">{fixedNote}</p>
        <div
          className={
            stageClassName
              ? `pointer-frame__stage ${stageClassName}`
              : 'pointer-frame__stage'
          }
          data-testid={stageTestId}
          style={stageStyle}
        >
          {children}
        </div>
      </article>
    </MotionConfig>
  );
}
