import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import { MOTION_RUNTIME, type ReducedMotionMode } from './source';
import './ios.css';

export function IosFrame({
  title,
  mechanism,
  docs,
  example,
  live,
  extraRuntime,
  priorNote,
  fixedNote,
  onReplay,
  reducedMotion = 'user',
  testId,
  running,
  runId,
  children,
}: {
  title: string;
  mechanism: ReactNode;
  docs: string;
  example: string;
  live: string;
  extraRuntime?: string;
  priorNote?: string;
  fixedNote: string;
  onReplay: () => void;
  reducedMotion?: ReducedMotionMode;
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
        className="ios-example"
        data-testid={testId}
        data-running={running ? 'true' : 'false'}
        data-run={String(runId)}
      >
        <div className="ios-example__bar">
          <div>
            <h2 className="ios-example__title">{title}</h2>
            <p className="ios-example__intro">
              Package <code>{MOTION_RUNTIME.package}</code>{' '}
              {MOTION_RUNTIME.version}. Licence {MOTION_RUNTIME.licence}.
              Mechanism: {mechanism} Docs <a href={docs}>{docs}</a>. Example{' '}
              <a href={example}>{example}</a>. Live <a href={live}>{live}</a>.
              Source{' '}
              <a href={MOTION_RUNTIME.repository}>
                {MOTION_RUNTIME.repository}
              </a>
              . {extraRuntime ?? 'No extra animation runtime.'}{' '}
              {priorNote ?? 'No earlier Academy experiment used this example.'}
            </p>
          </div>
          <button
            type="button"
            className="ios-example__action"
            onClick={onReplay}
          >
            Replay
          </button>
        </div>
        <p className="ios-example__fixed">{fixedNote}</p>
        {children}
      </article>
    </MotionConfig>
  );
}
