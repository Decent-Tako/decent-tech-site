import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState, type ReactNode } from 'react';

import {
  DEFAULT_EASE,
  MODES_DEFAULTS,
  WAIT_ENTER_EASE,
  WAIT_EXIT_EASE,
} from './defaults';
import { PresenceFrame } from './Frame';
import {
  PRESENCE_EXAMPLES,
  shouldReduce,
  type PresenceMode,
  type ReducedMotionMode,
} from './source';

export type AnimatePresenceModesProps = {
  duration?: number;
  enterScale?: number;
  restScale?: number;
  exitScale?: number;
  tapScale?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function ModeExample({
  mode,
  icon,
  state,
  duration,
  enterScale,
  restScale,
  exitScale,
  reduce,
}: {
  mode: PresenceMode;
  icon: ReactNode;
  state: boolean;
  duration: number;
  enterScale: number;
  restScale: number;
  exitScale: number;
  reduce: boolean;
}) {
  const ease = mode === 'wait' ? WAIT_ENTER_EASE : DEFAULT_EASE;
  const exitEase = mode === 'wait' ? WAIT_EXIT_EASE : DEFAULT_EASE;
  const durationMs = reduce ? 0 : duration;

  return (
    <div className="presence-modes__item">
      <div className="presence-modes__slot">
        <AnimatePresence mode={mode}>
          <motion.div
            key={String(state)}
            className="presence-modes__circle"
            data-on={state ? 'true' : 'false'}
            data-mode={mode}
            initial={reduce ? false : { opacity: 0, scale: enterScale }}
            animate={{
              opacity: 1,
              scale: restScale,
              transition: { duration: durationMs, ease },
            }}
            exit={{
              opacity: 0,
              scale: exitScale,
              transition: { duration: durationMs, ease: exitEase },
            }}
          >
            {icon}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="presence-modes__name">{mode}</p>
    </div>
  );
}

function SyncIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function WaitIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

function PopLayoutIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
      <path d="m21 3-9 9" />
      <path d="M15 3h6v6" />
    </svg>
  );
}

function ModesRun({
  duration,
  enterScale,
  restScale,
  exitScale,
  tapScale,
  caption,
  reduce,
}: {
  duration: number;
  enterScale: number;
  restScale: number;
  exitScale: number;
  tapScale: number;
  caption: string;
  reduce: boolean;
}) {
  const [state, setState] = useState(true);

  return (
    <>
      <div className="presence-modes" data-state={state ? 'on' : 'off'}>
        <div className="presence-modes__row">
          <ModeExample
            mode="sync"
            icon={<SyncIcon />}
            state={state}
            duration={duration}
            enterScale={enterScale}
            restScale={restScale}
            exitScale={exitScale}
            reduce={reduce}
          />
          <ModeExample
            mode="wait"
            icon={<WaitIcon />}
            state={state}
            duration={duration}
            enterScale={enterScale}
            restScale={restScale}
            exitScale={exitScale}
            reduce={reduce}
          />
          <ModeExample
            mode="popLayout"
            icon={<PopLayoutIcon />}
            state={state}
            duration={duration}
            enterScale={enterScale}
            restScale={restScale}
            exitScale={exitScale}
            reduce={reduce}
          />
        </div>
        <motion.button
          type="button"
          className="presence__trigger presence-modes__switch"
          onClick={() => setState((current) => !current)}
          whileTap={reduce ? undefined : { scale: tapScale }}
        >
          Switch
        </motion.button>
      </div>
      <p className="presence__caption">{caption}</p>
    </>
  );
}

export function AnimatePresenceModes({
  duration = MODES_DEFAULTS.duration,
  enterScale = MODES_DEFAULTS.enterScale,
  restScale = MODES_DEFAULTS.restScale,
  exitScale = MODES_DEFAULTS.exitScale,
  tapScale = MODES_DEFAULTS.tapScale,
  caption = MODES_DEFAULTS.caption,
  reducedMotion = MODES_DEFAULTS.reducedMotion,
  replayNonce = MODES_DEFAULTS.replayNonce,
}: AnimatePresenceModesProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = PRESENCE_EXAMPLES.modes;

  return (
    <PresenceFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The three 80 by 80 pixel circles stay at the upstream size so sync, wait, and popLayout can be compared side by side. wait enter and exit cubic-beziers stay as upstream wrote them; Motion 13.2.0 types ease on transition, so they sit on animate.transition and exit.transition. SVG icons stay because they name the three modes. This animation is one-shot per switch, so Replay remounts. Switch is the live trigger."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="presence-modes"
      runId={runId}
    >
      <ModesRun
        key={`${runId}-${replayNonce}-${duration}-${reduce}`}
        duration={duration}
        enterScale={enterScale}
        restScale={restScale}
        exitScale={exitScale}
        tapScale={tapScale}
        caption={caption}
        reduce={reduce}
      />
    </PresenceFrame>
  );
}
