import { MotionConfig } from 'motion/react';
import type { CSSProperties, ReactNode, Ref } from 'react';

import type { ReducedMotionMode } from '../types';

import './react-bits.css';

export type WebglState = 'ready' | 'pending' | 'unavailable';

// The shared shell of every React Bits story. Heading, attribution,
// runtime line, fixed note, Pause and Replay buttons, and a stage that
// carries the state a play function asserts on.
export function ReactBitsFrame({
  title,
  attribution,
  extraRuntime,
  fixedNote,
  pauseLabel,
  onPause,
  replay,
  onReplay,
  reducedMotion,
  paused,
  webgl,
  stageClassName,
  stageTestId,
  stageStyle,
  stageRef,
  stageData,
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
  reducedMotion: ReducedMotionMode;
  // Mirrored on the stage as data-paused.
  paused?: boolean;
  // Mirrored on the stage as data-webgl. 'unavailable' replaces the children
  // with a fallback paragraph so the story still passes without a context.
  webgl?: WebglState;
  stageClassName?: string;
  stageTestId?: string;
  stageStyle?: CSSProperties;
  stageRef?: Ref<HTMLDivElement>;
  stageData?: Record<`data-${string}`, string | undefined>;
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion={reducedMotion}>
      <article className="rb-frame">
        <div className="rb-frame__head">
          <h2 className="rb-frame__title">{title}</h2>
          <div className="rb-frame__actions">
            {pauseLabel && onPause ? (
              <button type="button" className="rb-frame__button" onClick={onPause}>
                {pauseLabel}
              </button>
            ) : null}
            {replay && onReplay ? (
              <button type="button" className="rb-frame__button" onClick={onReplay}>
                Replay
              </button>
            ) : null}
          </div>
        </div>
        <p className="rb-frame__meta">{attribution}</p>
        {extraRuntime ? <p className="rb-frame__meta">{extraRuntime}</p> : null}
        <p className="rb-frame__fixed">{fixedNote}</p>
        <div
          className={stageClassName ? `rb-frame__stage ${stageClassName}` : 'rb-frame__stage'}
          data-testid={stageTestId}
          data-paused={paused === undefined ? undefined : paused ? 'true' : 'false'}
          data-webgl={webgl}
          style={stageStyle}
          ref={stageRef}
          {...stageData}
        >
          {webgl === 'unavailable' ? (
            <p className="rb-frame__fallback" data-webgl="unavailable">
              WebGL is not available in this browser. The effect cannot render here.
            </p>
          ) : (
            children
          )}
        </div>
      </article>
    </MotionConfig>
  );
}
