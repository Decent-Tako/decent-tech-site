import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCircularText from '../../vendor/text-animations/circular-text/CircularText';
import { CIRCULAR_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './circular-text.css';

export type CircularTextProps = {
  text?: string;
  spinDuration?: number;
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
  reducedMotion?: ReducedMotionMode;
};

export function CircularText({
  text = CIRCULAR_TEXT_DEFAULTS.text,
  spinDuration = CIRCULAR_TEXT_DEFAULTS.spinDuration,
  onHover = CIRCULAR_TEXT_DEFAULTS.onHover,
  reducedMotion = CIRCULAR_TEXT_DEFAULTS.reducedMotion,
}: CircularTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Circular Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Letters sit on a circle and spin with a linear rotate over{' '}
              <code>{spinDuration}</code> seconds. Hover uses <code>{onHover}</code>.
            </>
          }
          controls="Pause stops the rotation. Replay remounts the ring."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The letters are the Week 0 kicker and title from src/pages/content.ts. className and paused are not controls. paused is local."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="circular-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamCircularText
        key={run}
        text={text}
        spinDuration={reduce ? 0 : spinDuration}
        onHover={onHover}
        paused={paused || reduce}
      />
    </ReactBitsFrame>
  );
}
