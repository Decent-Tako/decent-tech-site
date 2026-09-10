import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import {
  MOTION_LICENCE,
  MOTION_PACKAGE,
  MOTION_REPO,
  MOTION_VERSION,
  type ReducedMotionMode,
} from './source';
import './hooks.css';

export function HookFrame({
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
  stageClass,
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
  stageClass?: string;
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
        className="hk"
        data-testid={testId}
        data-running={running ? 'true' : 'false'}
        data-run={String(runId)}
      >
        <div className="hk__bar">
          <h2 className="hk__title">{title}</h2>
          {controlKind === 'pause' && onPause ? (
            <button type="button" className="hk__action" onClick={onPause}>
              {paused ? 'Resume' : 'Pause'}
            </button>
          ) : null}
          {controlKind === 'replay' && onReplay ? (
            <button type="button" className="hk__action" onClick={onReplay}>
              Replay
            </button>
          ) : null}
        </div>
        <p className="hk__intro">
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
        <p className="hk__fixed">{fixedNote}</p>
        <div className={stageClass ? `hk__stage ${stageClass}` : 'hk__stage'}>
          {children}
        </div>
      </article>
    </MotionConfig>
  );
}
