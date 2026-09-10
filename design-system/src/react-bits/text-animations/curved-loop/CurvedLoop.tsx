import { useState } from 'react';

import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCurvedLoop from '../../vendor/text-animations/curved-loop/CurvedLoop';
import { CURVED_LOOP_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './curved-loop.css';

export type CurvedLoopProps = {
  marqueeText?: string;
  speed?: number;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function CurvedLoop({
  marqueeText = CURVED_LOOP_DEFAULTS.marqueeText,
  speed = CURVED_LOOP_DEFAULTS.speed,
  curveAmount = CURVED_LOOP_DEFAULTS.curveAmount,
  direction = CURVED_LOOP_DEFAULTS.direction,
  interactive = CURVED_LOOP_DEFAULTS.interactive,
  reducedMotion = CURVED_LOOP_DEFAULTS.reducedMotion,
}: CurvedLoopProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Curved Loop"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An SVG textPath repeats the line on a quadratic curve. Each frame
              shifts <code>startOffset</code> by <code>{speed}</code> pixels
              toward <code>{direction}</code>. Drag reverses the heading when
              interactive.
            </>
          }
          controls="Pause holds the offset. Replay remounts the path."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The line is the hero lede from src/pages/content.ts. className and paused are not controls. paused is local. The jacket min-height is 10rem here, not 100vh."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="curved-loop-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <UpstreamCurvedLoop
        key={run}
        marqueeText={marqueeText}
        speed={reduce ? 0 : speed}
        curveAmount={curveAmount}
        direction={direction}
        interactive={interactive}
        paused={paused || reduce}
      />
    </ReactBitsFrame>
  );
}
