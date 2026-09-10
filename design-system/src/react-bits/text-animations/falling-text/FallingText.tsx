import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFallingText from '../../vendor/text-animations/falling-text/FallingText';
import { FALLING_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './falling-text.css';

export type FallingTextProps = {
  text?: string;
  highlightWords?: string[];
  highlightClass?: string;
  trigger?: (typeof FALLING_TEXT_DEFAULTS)['trigger'];
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
  reducedMotion?: ReducedMotionMode;
};

export function FallingText({
  text = FALLING_TEXT_DEFAULTS.text,
  highlightWords = FALLING_TEXT_DEFAULTS.highlightWords,
  highlightClass = FALLING_TEXT_DEFAULTS.highlightClass,
  trigger = FALLING_TEXT_DEFAULTS.trigger,
  backgroundColor = FALLING_TEXT_DEFAULTS.backgroundColor,
  wireframes = FALLING_TEXT_DEFAULTS.wireframes,
  gravity = FALLING_TEXT_DEFAULTS.gravity,
  mouseConstraintStiffness = FALLING_TEXT_DEFAULTS.mouseConstraintStiffness,
  fontSize = FALLING_TEXT_DEFAULTS.fontSize,
  reducedMotion = FALLING_TEXT_DEFAULTS.reducedMotion,
}: FallingTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Falling Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each word becomes a Matter.js body. Gravity is <code>{gravity}</code>.
              Trigger <code>{trigger}</code>. Highlight class <code>{highlightClass}</code>.
            </>
          }
          controls="Pause holds the Matter runner. Replay remounts the world."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 card from src/pages/content.ts. The highlight words are Buddy and Team. paused, reduced, and onStarted are not controls. The Matter canvas is a physics helper with transparent fills, so stories assert word transforms, not canvas paint. fontSize is 1.25rem so Brand Sans stays readable; upstream default 1rem."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageClassName="rb-frame__stage--tall"
      stageTestId="falling-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-started': 'false',
        'data-copy': FEATURES[0].copy,
      }}
    >
      <UpstreamFallingText
        key={run}
        text={text}
        highlightWords={highlightWords}
        highlightClass={highlightClass}
        trigger={trigger}
        backgroundColor={backgroundColor}
        wireframes={wireframes}
        gravity={gravity}
        mouseConstraintStiffness={mouseConstraintStiffness}
        fontSize={fontSize}
        paused={paused}
        reduced={reduce}
        onStarted={(started) => {
          stageRef.current?.setAttribute('data-started', started ? 'true' : 'false');
        }}
      />
    </ReactBitsFrame>
  );
}
