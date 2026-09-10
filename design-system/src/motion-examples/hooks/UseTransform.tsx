import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { useState, type CSSProperties, type KeyboardEvent } from 'react';

import { USE_TRANSFORM_DEFAULTS } from './defaults';
import { HookFrame } from './Frame';
import {
  HOOK_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type UseTransformProps = {
  dragElastic?: number;
  tickStart?: number;
  tickEnd?: number;
  crossStart?: number;
  crossAEnd?: number;
  crossBEnd?: number;
  boxSize?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

const X_INPUT = [-100, 0, 100] as const;

function TransformRun({
  dragElastic,
  tickStart,
  tickEnd,
  crossStart,
  crossAEnd,
  crossBEnd,
  boxSize,
  caption,
  reduce,
}: {
  dragElastic: number;
  tickStart: number;
  tickEnd: number;
  crossStart: number;
  crossAEnd: number;
  crossBEnd: number;
  boxSize: number;
  caption: string;
  reduce: boolean;
}) {
  const x = useMotionValue(0);
  const background = useTransform(x, [...X_INPUT], [
    'linear-gradient(180deg, #212121 0%, #4A4A4A 100%)',
    'linear-gradient(180deg, #0035B1 0%, #212121 100%)',
    'linear-gradient(180deg, #DEF54F 0%, #FFFFFF 100%)',
  ]);
  const color = useTransform(x, [...X_INPUT], [
    'rgb(222, 245, 79)',
    'rgb(255, 255, 255)',
    'rgb(33, 33, 33)',
  ]);
  const tickPath = useTransform(x, [tickStart, tickEnd], [0, 1]);
  const crossPathA = useTransform(x, [crossStart, crossAEnd], [0, 1]);
  const crossPathB = useTransform(x, [-50, crossBEnd], [0, 1]);
  const [offset, setOffset] = useState(0);

  useMotionValueEvent(x, 'change', (latest) => {
    setOffset(Math.round(latest));
  });

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      x.set(tickEnd);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      x.set(crossBEnd);
    }
    if (event.key === 'Home' || event.key === 'Escape') {
      event.preventDefault();
      x.set(0);
    }
  }

  return (
    <motion.div className="hk-drag" style={{ background }}>
      <motion.button
        type="button"
        className="hk-drag__box"
        style={
          {
            '--hk-drag-size': `${boxSize}px`,
            x: reduce ? 0 : x,
          } as CSSProperties
        }
        drag={reduce ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={dragElastic}
        onKeyDown={onKeyDown}
        data-x={offset}
        aria-label={`${caption}. Drag right to confirm. Drag left to wait. Arrow keys do the same.`}
      >
        <svg className="hk-drag__icon" viewBox="0 0 50 50" aria-hidden="true">
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
            style={{ x: 5, y: 5 }}
          />
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M14,26 L 22,33 L 35,16"
            strokeDasharray="0 1"
            style={{ pathLength: tickPath }}
          />
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M17,17 L33,33"
            strokeDasharray="0 1"
            style={{ pathLength: crossPathA }}
          />
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M33,17 L17,33"
            strokeDasharray="0 1"
            style={{ pathLength: crossPathB }}
          />
        </svg>
      </motion.button>
    </motion.div>
  );
}

export function UseTransform({
  dragElastic = USE_TRANSFORM_DEFAULTS.dragElastic,
  tickStart = USE_TRANSFORM_DEFAULTS.tickStart,
  tickEnd = USE_TRANSFORM_DEFAULTS.tickEnd,
  crossStart = USE_TRANSFORM_DEFAULTS.crossStart,
  crossAEnd = USE_TRANSFORM_DEFAULTS.crossAEnd,
  crossBEnd = USE_TRANSFORM_DEFAULTS.crossBEnd,
  boxSize = USE_TRANSFORM_DEFAULTS.boxSize,
  caption = USE_TRANSFORM_DEFAULTS.caption,
  reducedMotion = USE_TRANSFORM_DEFAULTS.reducedMotion,
  replayNonce = USE_TRANSFORM_DEFAULTS.replayNonce,
}: UseTransformProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = HOOK_EXAMPLES.useTransform;

  return (
    <HookFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-drag"
      fixedNote="The container stays 500 by 300 pixels at the upstream default so a 140 pixel card has room to rubber-band. SVG path d strings stay fixed because they are the tick and cross geometry. xInput stays [-100, 0, 100] because those stops are the map, not a colour. Upstream magenta and green are not Academy colours. Left is ink, centre is blue, right is yellow. This animation is drag-driven, so Replay remounts x to 0."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="hk-use-transform"
      running={!reduce}
      runId={runId}
      stageClass="hk__stage--drag"
    >
      <TransformRun
        key={`${runId}-${replayNonce}-${tickStart}-${tickEnd}-${crossStart}-${crossAEnd}-${crossBEnd}`}
        dragElastic={dragElastic}
        tickStart={tickStart}
        tickEnd={tickEnd}
        crossStart={crossStart}
        crossAEnd={crossAEnd}
        crossBEnd={crossBEnd}
        boxSize={boxSize}
        caption={caption}
        reduce={reduce}
      />
      <p className="hk__caption">{caption}</p>
    </HookFrame>
  );
}
