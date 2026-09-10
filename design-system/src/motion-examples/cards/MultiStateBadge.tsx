import {
  animate,
  AnimatePresence,
  motion,
  useReducedMotion,
  useTime,
  useTransform,
  type Transition,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { CardsFrame } from './Frame';
import {
  BADGE_STATE_OPTIONS,
  EXAMPLES,
  MOTION_RUNTIME,
  MULTI_STATE_BADGE_DEFAULTS,
  shouldReduce,
  type BadgeState,
  type ReducedMotionMode,
} from './source';

export type MultiStateBadgeProps = {
  stiffness?: number;
  damping?: number;
  shake?: number;
  successScale?: number;
  pulseDuration?: number;
  loaderPeriod?: number;
  initialState?: BadgeState;
  idleLabel?: string;
  processingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function MultiStateBadge({
  stiffness = MULTI_STATE_BADGE_DEFAULTS.stiffness,
  damping = MULTI_STATE_BADGE_DEFAULTS.damping,
  shake = MULTI_STATE_BADGE_DEFAULTS.shake,
  successScale = MULTI_STATE_BADGE_DEFAULTS.successScale,
  pulseDuration = MULTI_STATE_BADGE_DEFAULTS.pulseDuration,
  loaderPeriod = MULTI_STATE_BADGE_DEFAULTS.loaderPeriod,
  initialState = MULTI_STATE_BADGE_DEFAULTS.initialState,
  idleLabel = MULTI_STATE_BADGE_DEFAULTS.idleLabel,
  processingLabel = MULTI_STATE_BADGE_DEFAULTS.processingLabel,
  successLabel = MULTI_STATE_BADGE_DEFAULTS.successLabel,
  errorLabel = MULTI_STATE_BADGE_DEFAULTS.errorLabel,
  reducedMotion = MULTI_STATE_BADGE_DEFAULTS.reducedMotion,
  replayNonce = MULTI_STATE_BADGE_DEFAULTS.replayNonce,
}: MultiStateBadgeProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const runKey = runId + replayNonce;
  const labels = {
    idle: idleLabel,
    processing: processingLabel,
    success: successLabel,
    error: errorLabel,
  };

  return (
    <CardsFrame
      title="Multi-state badge"
      mechanism={
        <>
          Click cycles idle, processing, success, error.{' '}
          <code>AnimatePresence</code> swaps icon and label with y and blur.{' '}
          <code>layout</code> springs the label width. <code>animate()</code>{' '}
          shakes x on error and pulses scale on success. Processing uses{' '}
          <code>useTime</code> plus <code>useTransform</code> to rotate the
          loader.
        </>
      }
      docs={MOTION_RUNTIME.docsPresence}
      example={EXAMPLES.multiStateBadge.page}
      live={EXAMPLES.multiStateBadge.live}
      source={EXAMPLES.multiStateBadge.source}
      fixedNote="The badge stays a pill with 12px 20px padding so the 20px icon width spring is visible. will-change is the upstream hint. Replay returns to idle. This animation is one-shot per state, so Replay is the control."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="multi-state-badge"
      running={!reduce}
      runId={runKey}
    >
      <BadgeRun
        key={runKey}
        stiffness={stiffness}
        damping={damping}
        shake={shake}
        successScale={successScale}
        pulseDuration={pulseDuration}
        loaderPeriod={loaderPeriod}
        initialState={initialState}
        labels={labels}
        reduce={reduce}
      />
    </CardsFrame>
  );
}

function BadgeRun({
  stiffness,
  damping,
  shake,
  successScale,
  pulseDuration,
  loaderPeriod,
  initialState,
  labels,
  reduce,
}: {
  stiffness: number;
  damping: number;
  shake: number;
  successScale: number;
  pulseDuration: number;
  loaderPeriod: number;
  initialState: BadgeState;
  labels: Record<BadgeState, string>;
  reduce: boolean;
}) {
  const [badgeState, setBadgeState] = useState<BadgeState>(initialState);
  const spring: Transition = reduce
    ? { duration: 0 }
    : { type: 'spring', stiffness, damping };

  return (
    <div
      className="cards-example__stage cards-example__stage--badge"
      data-state={badgeState}
    >
      <div className="badge-wrap">
        <button
          type="button"
          onClick={() => setBadgeState(nextState(badgeState))}
          aria-label={labels[badgeState]}
        >
          <Badge
            state={badgeState}
            labels={labels}
            spring={spring}
            shake={shake}
            successScale={successScale}
            pulseDuration={pulseDuration}
            loaderPeriod={loaderPeriod}
            reduce={reduce}
          />
        </button>
      </div>
    </div>
  );
}

function Badge({
  state,
  labels,
  spring,
  shake,
  successScale,
  pulseDuration,
  loaderPeriod,
  reduce,
}: {
  state: BadgeState;
  labels: Record<BadgeState, string>;
  spring: Transition;
  shake: number;
  successScale: number;
  pulseDuration: number;
  loaderPeriod: number;
  reduce: boolean;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!badgeRef.current || reduce) return;

    if (state === 'error') {
      animate(
        badgeRef.current,
        { x: [0, -shake, shake, -shake, 0] },
        {
          duration: pulseDuration,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1],
          repeat: 0,
          delay: 0.1,
        },
      );
    } else if (state === 'success') {
      animate(
        badgeRef.current,
        { scale: [1, successScale, 1] },
        {
          duration: pulseDuration,
          ease: 'easeInOut',
          times: [0, 0.5, 1],
          repeat: 0,
        },
      );
    }
  }, [pulseDuration, reduce, shake, state, successScale]);

  return (
    <motion.div
      ref={badgeRef}
      className="badge"
      style={{ gap: state === 'idle' ? 0 : 8 }}
    >
      <Icon
        state={state}
        spring={spring}
        loaderPeriod={loaderPeriod}
        reduce={reduce}
      />
      <Label state={state} labels={labels} spring={spring} reduce={reduce} />
    </motion.div>
  );
}

function Icon({
  state,
  spring,
  loaderPeriod,
  reduce,
}: {
  state: BadgeState;
  spring: Transition;
  loaderPeriod: number;
  reduce: boolean;
}) {
  let icon = <></>;
  if (state === 'processing') icon = <Loader period={loaderPeriod} reduce={reduce} />;
  if (state === 'success') icon = <Check reduce={reduce} />;
  if (state === 'error') icon = <X reduce={reduce} />;

  return (
    <motion.span
      className="badge__icon"
      animate={{ width: state === 'idle' ? 0 : 20 }}
      transition={spring}
    >
      <AnimatePresence>
        <motion.span
          key={state}
          className="badge__icon-face"
          initial={
            reduce
              ? false
              : { y: -40, scale: 0.5, filter: 'blur(6px)' }
          }
          animate={{ y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={
            reduce
              ? undefined
              : { y: 40, scale: 0.5, filter: 'blur(6px)' }
          }
          transition={reduce ? { duration: 0 } : { duration: 0.15, ease: 'easeInOut' }}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

const ICON_SIZE = 20;
const svgProps = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Check({ reduce }: { reduce: boolean }) {
  const line = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 },
        transition: { type: 'spring' as const, stiffness: 150, damping: 20 },
      };
  return (
    <motion.svg {...svgProps} aria-hidden="true">
      <motion.polyline points="4 12 9 17 20 6" {...line} />
    </motion.svg>
  );
}

function Loader({
  period,
  reduce,
}: {
  period: number;
  reduce: boolean;
}) {
  const time = useTime();
  const rotate = useTransform(time, [0, period], [0, 360], { clamp: false });
  const line = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 },
        transition: { type: 'spring' as const, stiffness: 150, damping: 20 },
      };

  return (
    <motion.div
      style={{
        rotate: reduce ? 0 : rotate,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: ICON_SIZE,
        height: ICON_SIZE,
      }}
    >
      <motion.svg {...svgProps} aria-hidden="true">
        <motion.path d="M21 12a9 9 0 1 1-6.219-8.56" {...line} />
      </motion.svg>
    </motion.div>
  );
}

function X({ reduce }: { reduce: boolean }) {
  const line = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 },
        transition: { type: 'spring' as const, stiffness: 150, damping: 20 },
      };
  const second = reduce
    ? {}
    : {
        ...line,
        transition: {
          type: 'spring' as const,
          stiffness: 150,
          damping: 20,
          delay: 0.1,
        },
      };
  return (
    <motion.svg {...svgProps} aria-hidden="true">
      <motion.line x1="6" y1="6" x2="18" y2="18" {...line} />
      <motion.line x1="18" y1="6" x2="6" y2="18" {...second} />
    </motion.svg>
  );
}

function Label({
  state,
  labels,
  spring,
  reduce,
}: {
  state: BadgeState;
  labels: Record<BadgeState, string>;
  spring: Transition;
  reduce: boolean;
}) {
  const [labelWidth, setLabelWidth] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!measureRef.current) return;
    const { width } = measureRef.current.getBoundingClientRect();
    setLabelWidth(width);
  }, [state, labels]);

  return (
    <>
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {labels[state]}
      </div>
      <motion.span
        layout
        className="badge__label"
        animate={{ width: labelWidth }}
        transition={spring}
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={state}
            style={{ whiteSpace: 'nowrap' }}
            initial={
              reduce
                ? false
                : { y: -20, opacity: 0, filter: 'blur(10px)', position: 'absolute' }
            }
            animate={{
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              position: 'relative',
            }}
            exit={
              reduce
                ? undefined
                : { y: 20, opacity: 0, filter: 'blur(10px)', position: 'absolute' }
            }
            transition={reduce ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
          >
            {labels[state]}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    </>
  );
}

function nextState(state: BadgeState): BadgeState {
  const index = BADGE_STATE_OPTIONS.indexOf(state);
  return BADGE_STATE_OPTIONS[(index + 1) % BADGE_STATE_OPTIONS.length];
}
