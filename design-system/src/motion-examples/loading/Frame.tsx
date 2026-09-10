import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import {
  MOTION_LICENCE,
  MOTION_PACKAGE,
  MOTION_REPO,
  MOTION_VERSION,
  type ReducedMotionMode,
} from './source';
import './loading.css';

export function LoadingFrame({
  title,
  mechanism,
  docs,
  example,
  live,
  extraDocs,
  fixedNote,
  controlKind,
  paused,
  onPause,
  onReplay,
  reducedMotion,
  testId,
  running,
  runId,
  children,
}: {
  title: string;
  mechanism: string;
  docs: string;
  example: string;
  live: string;
  extraDocs?: string;
  fixedNote: string;
  controlKind: 'replay' | 'pause';
  paused?: boolean;
  onPause?: () => void;
  onReplay?: () => void;
  reducedMotion: ReducedMotionMode;
  testId: string;
  running: boolean;
  runId: number;
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
        className="loading"
        data-testid={testId}
        data-running={running ? 'true' : 'false'}
        data-run={String(runId)}
      >
        <div className="loading__bar">
          <h2 className="loading__title">{title}</h2>
          {controlKind === 'pause' && onPause ? (
            <button type="button" className="loading__action" onClick={onPause}>
              {paused ? 'Resume' : 'Pause'}
            </button>
          ) : null}
          {controlKind === 'replay' && onReplay ? (
            <button type="button" className="loading__action" onClick={onReplay}>
              Replay
            </button>
          ) : null}
        </div>
        <p className="loading__intro">
          Package <code>{MOTION_PACKAGE}</code> {MOTION_VERSION}. Licence{' '}
          {MOTION_LICENCE}. Mechanism: {mechanism} Docs{' '}
          <a href={docs}>{docs}</a>
          {extraDocs ? (
            <>
              . Also <a href={extraDocs}>{extraDocs}</a>
            </>
          ) : null}
          . Example <a href={example}>{example}</a>. Live{' '}
          <a href={live}>{live}</a>. Source{' '}
          <a href={MOTION_REPO}>{MOTION_REPO}</a>. No extra animation runtime. No
          earlier Academy experiment used this example.
        </p>
        <p className="loading__fixed">{fixedNote}</p>
        <div className="loading__stage">{children}</div>
      </article>
    </MotionConfig>
  );
}
