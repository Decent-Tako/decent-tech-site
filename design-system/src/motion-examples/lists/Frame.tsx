import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import { MOTION_RUNTIME, type ReducedMotionMode } from './source';
import './lists.css';

export function ListsFrame({
  title,
  mechanism,
  docs,
  example,
  live,
  chunk,
  extraRuntime,
  priorNote,
  fixedNote,
  controlKind,
  paused,
  onPause,
  onReplay,
  reducedMotion = 'user',
  testId,
  running,
  runId,
  extraData,
  children,
}: {
  title: string;
  mechanism: ReactNode;
  docs: string;
  example: string;
  live: string;
  chunk: string;
  extraRuntime?: ReactNode;
  priorNote?: string;
  fixedNote: string;
  controlKind: 'replay' | 'pause';
  paused?: boolean;
  onPause?: () => void;
  onReplay?: () => void;
  reducedMotion?: ReducedMotionMode;
  testId: string;
  running: boolean;
  runId: number;
  extraData?: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <MotionConfig
      reducedMotion={
        reducedMotion === 'never'
          ? 'never'
          : reducedMotion === 'always'
            ? 'always'
            : 'user'
      }
    >
      <article
        className="lists-example"
        data-testid={testId}
        data-running={running ? 'true' : 'false'}
        data-run={String(runId)}
        {...extraData}
      >
        <div className="lists-example__bar">
          <div>
            <h2 className="lists-example__title">{title}</h2>
            <p className="lists-example__intro">
              Package <code>{MOTION_RUNTIME.package}</code>{' '}
              {MOTION_RUNTIME.version}. Licence {MOTION_RUNTIME.licence}.
              Mechanism: {mechanism} Docs <a href={docs}>{docs}</a>. Example{' '}
              <a href={example}>{example}</a>. Live <a href={live}>{live}</a>.
              View-source chunk <a href={chunk}>{chunk}</a>. Source{' '}
              <a href={MOTION_RUNTIME.repository}>
                {MOTION_RUNTIME.repository}
              </a>
              .{' '}
              {extraRuntime ?? 'No extra animation runtime.'}{' '}
              {priorNote ?? 'No earlier Academy experiment used this example.'}
            </p>
          </div>
          <div className="lists-example__actions">
            {controlKind === 'pause' && onPause ? (
              <button
                type="button"
                className="lists-example__action"
                onClick={onPause}
              >
                {paused ? 'Resume' : 'Pause'}
              </button>
            ) : null}
            {onReplay ? (
              <button
                type="button"
                className="lists-example__action"
                onClick={onReplay}
              >
                Replay
              </button>
            ) : null}
          </div>
        </div>
        <p className="lists-example__fixed">{fixedNote}</p>
        {children}
      </article>
    </MotionConfig>
  );
}
