import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTime,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef, useState, type CSSProperties } from 'react';

import {
  TIME_SMALL_LABELS,
  TIME_TINY_LABELS,
  USE_TIME_DEFAULTS,
} from './defaults';
import { HookFrame } from './Frame';
import {
  HOOK_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type UseTimeProps = {
  cycleMs?: number;
  speed?: number;
  tinyFactor?: number;
  smallFactor?: number;
  clamp?: boolean;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function TimeLayers({
  caption,
  rotate,
  tinyRotate,
  smallRotate,
}: {
  caption: string;
  rotate?: MotionValue<number>;
  tinyRotate?: MotionValue<number>;
  smallRotate?: MotionValue<number>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const zero = useMotionValue(0);

  useMotionValueEvent(rotate ?? zero, 'change', (latest) => {
    if (rootRef.current) {
      rootRef.current.dataset.rotate = latest.toFixed(1);
    }
  });

  return (
    <div ref={rootRef} className="hk-time" data-rotate="0.0">
      <div className="hk-time__layer hk-time__layer--far">
        <div
          className="hk-time__row"
          style={
            { '--hk-time-width': '500px', '--hk-time-gap': '80px' } as CSSProperties
          }
        >
          {TIME_TINY_LABELS.map((label, index) => (
            <motion.div
              key={`tiny-${label}-${index}`}
              className="hk-time__box hk-time__box--tiny"
              style={tinyRotate ? { rotate: tinyRotate } : undefined}
            >
              {label}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="hk-time__layer hk-time__layer--mid">
        <div
          className="hk-time__row"
          style={{ '--hk-time-width': '300px' } as CSSProperties}
        >
          {TIME_SMALL_LABELS.map((label) => (
            <motion.div
              key={label}
              className="hk-time__box hk-time__box--small"
              style={smallRotate ? { rotate: smallRotate } : undefined}
            >
              {label}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="hk-time__layer">
        <div className="hk-time__row">
          <motion.div
            className="hk-time__box hk-time__box--main"
            role="img"
            aria-label={caption}
            style={rotate ? { rotate } : undefined}
          >
            {caption}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TimeLive({
  cycleMs,
  speed,
  tinyFactor,
  smallFactor,
  clamp,
  caption,
}: {
  cycleMs: number;
  speed: number;
  tinyFactor: number;
  smallFactor: number;
  clamp: boolean;
  caption: string;
}) {
  const time = useTime();
  const cycle = cycleMs / Math.max(speed, 0.1);
  const rotate = useTransform(time, [0, cycle], [0, 360], { clamp });
  const tinyRotate = useTransform(() => rotate.get() * tinyFactor);
  const smallRotate = useTransform(() => rotate.get() * smallFactor);

  return (
    <TimeLayers
      caption={caption}
      rotate={rotate}
      tinyRotate={tinyRotate}
      smallRotate={smallRotate}
    />
  );
}

function TimeRun({
  cycleMs,
  speed,
  tinyFactor,
  smallFactor,
  clamp,
  caption,
  running,
}: {
  cycleMs: number;
  speed: number;
  tinyFactor: number;
  smallFactor: number;
  clamp: boolean;
  caption: string;
  running: boolean;
}) {
  if (!running) return <TimeLayers caption={caption} />;
  return (
    <TimeLive
      cycleMs={cycleMs}
      speed={speed}
      tinyFactor={tinyFactor}
      smallFactor={smallFactor}
      clamp={clamp}
      caption={caption}
    />
  );
}

export function UseTime({
  cycleMs = USE_TIME_DEFAULTS.cycleMs,
  speed = USE_TIME_DEFAULTS.speed,
  tinyFactor = USE_TIME_DEFAULTS.tinyFactor,
  smallFactor = USE_TIME_DEFAULTS.smallFactor,
  clamp = USE_TIME_DEFAULTS.clamp,
  caption = USE_TIME_DEFAULTS.caption,
  paused: pausedProp = USE_TIME_DEFAULTS.paused,
  reducedMotion = USE_TIME_DEFAULTS.reducedMotion,
  replayNonce = USE_TIME_DEFAULTS.replayNonce,
}: UseTimeProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const running = !paused && !reduce;
  const example = HOOK_EXAMPLES.useTime;

  return (
    <HookFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-use-transform"
      fixedNote="Box sizes stay 40, 80, and 100 pixels at the upstream default. Rear layers keep blur 4px and 2px because that is the depth stack, not a photograph. Sixteen tiny labels and four small labels stay fixed counts. Pause unmounts useTime, so the boxes rest at 0. Resume starts a new elapsed clock. This loop is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="hk-use-time"
      running={running}
      runId={replayNonce}
      stageClass="hk__stage--time"
    >
      <TimeRun
        key={`${replayNonce}-${cycleMs}-${clamp}`}
        cycleMs={cycleMs}
        speed={speed}
        tinyFactor={tinyFactor}
        smallFactor={smallFactor}
        clamp={clamp}
        caption={caption}
        running={running}
      />
    </HookFrame>
  );
}
