import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import {
  MOTION_LICENCE,
  MOTION_PACKAGE,
  MOTION_REPO,
  MOTION_VERSION,
  type ReducedMotionMode,
} from './source';
import './presence.css';

export function PresenceFrame({
  title,
  mechanism,
  docs,
  example,
  live,
  extraDocs,
  fixedNote,
  onReplay,
  reducedMotion,
  testId,
  runId,
  extraData,
  children,
}: {
  title: string;
  mechanism: string;
  docs: string;
  example: string;
  live: string;
  extraDocs?: string;
  fixedNote: string;
  onReplay: () => void;
  reducedMotion: ReducedMotionMode;
  testId: string;
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
        className="presence"
        data-testid={testId}
        data-run={String(runId)}
        {...extraData}
      >
        <div className="presence__bar">
          <h2 className="presence__title">{title}</h2>
          <button type="button" className="presence__action" onClick={onReplay}>
            Replay
          </button>
        </div>
        <p className="presence__intro">
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
          <a href={MOTION_REPO}>{MOTION_REPO}</a>. No extra animation runtime.
          Pages/Navigation and Motion examples/App Store already use{' '}
          <code>AnimatePresence</code> for a different composition. No earlier
          Academy experiment used this example.
        </p>
        <p className="presence__fixed">{fixedNote}</p>
        <div className="presence__stage">{children}</div>
      </article>
    </MotionConfig>
  );
}
