import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import {
  MOTION_LICENCE,
  MOTION_PACKAGE,
  MOTION_REPO,
  MOTION_VERSION,
  type ReducedMotionMode,
} from './source';
import './svg.css';

export function SvgFrame({
  title,
  mechanism,
  docs,
  example,
  live,
  extraDocs,
  extraRuntime,
  priorNote,
  fixedNote,
  controlKind,
  paused,
  onPause,
  onReplay,
  reducedMotion,
  testId,
  running,
  runId,
  stageClassName,
  children,
}: {
  title: string;
  mechanism: string;
  docs: string;
  example: string;
  live: string;
  extraDocs?: string;
  extraRuntime?: string;
  priorNote?: string;
  fixedNote: string;
  controlKind: 'replay' | 'pause';
  paused?: boolean;
  onPause?: () => void;
  onReplay?: () => void;
  reducedMotion: ReducedMotionMode;
  testId: string;
  running: boolean;
  runId: number;
  stageClassName?: string;
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
        className="academy-svg"
        data-testid={testId}
        data-running={running ? 'true' : 'false'}
        data-run={String(runId)}
      >
        <div className="academy-svg__bar">
          <h2 className="academy-svg__title">{title}</h2>
          {controlKind === 'pause' && onPause ? (
            <button type="button" className="academy-svg__action" onClick={onPause}>
              {paused ? 'Resume' : 'Pause'}
            </button>
          ) : null}
          {controlKind === 'replay' && onReplay ? (
            <button
              type="button"
              className="academy-svg__action"
              onClick={onReplay}
            >
              Replay
            </button>
          ) : null}
        </div>
        <p className="academy-svg__intro">
          Package <code>{MOTION_PACKAGE}</code> {MOTION_VERSION}. Licence{' '}
          {MOTION_LICENCE}. Mechanism: {mechanism} Docs{' '}
          <a href={docs}>{docs}</a>
          {extraDocs ? (
            <>
              . Also <a href={extraDocs}>{extraDocs}</a>
            </>
          ) : null}
          . Example <a href={example}>{example}</a>. Live <a href={live}>{live}</a>
          . Source <a href={MOTION_REPO}>{MOTION_REPO}</a>.{' '}
          {extraRuntime ?? 'No extra animation runtime.'}{' '}
          {priorNote ?? 'No earlier Academy experiment used this example.'}
        </p>
        <p className="academy-svg__fixed">{fixedNote}</p>
        <div
          className={
            stageClassName
              ? `academy-svg__stage ${stageClassName}`
              : 'academy-svg__stage'
          }
        >
          {children}
        </div>
      </article>
    </MotionConfig>
  );
}
