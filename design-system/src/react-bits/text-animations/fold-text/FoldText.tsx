import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFoldText from '../../vendor/text-animations/fold-text/FoldText';
import { FOLD_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './fold-text.css';

export type FoldTextProps = {
  text?: string;
  splitBy?: (typeof FOLD_TEXT_DEFAULTS)['splitBy'];
  hinge?: (typeof FOLD_TEXT_DEFAULTS)['hinge'];
  duration?: number;
  stagger?: number;
  ease?: string;
  perspective?: number;
  creaseShading?: number;
  trigger?: (typeof FOLD_TEXT_DEFAULTS)['trigger'];
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  reducedMotion?: ReducedMotionMode;
};

export function FoldText({
  text = FOLD_TEXT_DEFAULTS.text,
  splitBy = FOLD_TEXT_DEFAULTS.splitBy,
  hinge = FOLD_TEXT_DEFAULTS.hinge,
  duration = FOLD_TEXT_DEFAULTS.duration,
  stagger = FOLD_TEXT_DEFAULTS.stagger,
  ease = FOLD_TEXT_DEFAULTS.ease,
  perspective = FOLD_TEXT_DEFAULTS.perspective,
  creaseShading = FOLD_TEXT_DEFAULTS.creaseShading,
  trigger = FOLD_TEXT_DEFAULTS.trigger,
  fontSize = FOLD_TEXT_DEFAULTS.fontSize,
  fontWeight = FOLD_TEXT_DEFAULTS.fontWeight,
  color = FOLD_TEXT_DEFAULTS.color,
  reducedMotion = FOLD_TEXT_DEFAULTS.reducedMotion,
}: FoldTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Fold Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each {splitBy} folds from the <code>{hinge}</code> hinge with gsap over{' '}
              <code>{duration}</code> s. Trigger <code>{trigger}</code>.
            </>
          }
          controls="Pause holds the gsap timeline. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. className, style, paused, reduced, and onComplete are not controls. color is ink; upstream default #f7f2e8. fontWeight is 700 for Brand Sans; upstream default 800."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        stageRef.current?.setAttribute('data-state', 'pending');
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageTestId="fold-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': reduce ? 'done' : 'pending',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamFoldText
        key={run}
        text={text}
        splitBy={splitBy}
        hinge={hinge}
        duration={duration}
        stagger={stagger}
        ease={ease}
        perspective={perspective}
        creaseShading={creaseShading}
        trigger={trigger}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        paused={paused}
        reduced={reduce}
        onComplete={() => {
          stageRef.current?.setAttribute('data-state', 'done');
        }}
      />
    </ReactBitsFrame>
  );
}
