import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import { MOTION_RUNTIME, type ReducedMotionMode } from './source';
import './gestures.css';

export function GestureFrame({
  title,
  mechanism,
  docs,
  example,
  live,
  extraRuntime,
  priorNote,
  fixedNote,
  onReplay,
  children,
  reducedMotion = 'user',
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
  children: ReactNode;
  reducedMotion?: ReducedMotionMode;
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
      <figure className="gesture-example">
        <div className="gesture-example__bar">
          <div>
            <h2 className="gesture-example__title">{title}</h2>
            <p className="gesture-example__intro">
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
            className="gesture-example__replay"
            onClick={onReplay}
          >
            Replay
          </button>
        </div>
        <p className="gesture-example__fixed">{fixedNote}</p>
        {children}
      </figure>
    </MotionConfig>
  );
}
