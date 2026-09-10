import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import {
  MOTION_LICENCE,
  MOTION_PACKAGE,
  MOTION_REPO,
  MOTION_VERSION,
  type ReducedMotionMode,
} from './source';
import './text.css';

export function TextFrame({
  title,
  mechanism,
  docs,
  example,
  live,
  extraDocs,
  extraRuntime,
  priorNote,
  fixedNote,
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
  onReplay: () => void;
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
        className="text-example"
        data-testid={testId}
        data-running={running ? 'true' : 'false'}
        data-run={String(runId)}
      >
        <div className="text-example__bar">
          <h2 className="text-example__title">{title}</h2>
          <button type="button" className="text-example__action" onClick={onReplay}>
            Replay
          </button>
        </div>
        <p className="text-example__intro">
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
          <a href={MOTION_REPO}>{MOTION_REPO}</a>.{' '}
          {extraRuntime ?? 'No extra animation runtime.'}{' '}
          {priorNote ?? 'No earlier Academy experiment used this example.'}
        </p>
        <p className="text-example__fixed">{fixedNote}</p>
        <div
          className={
            stageClassName
              ? `text-example__stage ${stageClassName}`
              : 'text-example__stage'
          }
        >
          {children}
        </div>
      </article>
    </MotionConfig>
  );
}
