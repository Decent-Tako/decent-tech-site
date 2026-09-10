import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamScrollVelocity from '../../vendor/text-animations/scroll-velocity/ScrollVelocity';
import { SCROLL_VELOCITY_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './scroll-velocity.css';

export type ScrollVelocityProps = {
  texts?: string[];
  velocity?: number;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: (typeof SCROLL_VELOCITY_DEFAULTS)['velocityMapping'];
  parallaxClassName?: string;
  scrollerClassName?: string;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollVelocity({
  texts = SCROLL_VELOCITY_DEFAULTS.texts,
  velocity = SCROLL_VELOCITY_DEFAULTS.velocity,
  damping = SCROLL_VELOCITY_DEFAULTS.damping,
  stiffness = SCROLL_VELOCITY_DEFAULTS.stiffness,
  numCopies = SCROLL_VELOCITY_DEFAULTS.numCopies,
  velocityMapping = SCROLL_VELOCITY_DEFAULTS.velocityMapping,
  parallaxClassName = SCROLL_VELOCITY_DEFAULTS.parallaxClassName,
  scrollerClassName = SCROLL_VELOCITY_DEFAULTS.scrollerClassName,
  reducedMotion = SCROLL_VELOCITY_DEFAULTS.reducedMotion,
}: ScrollVelocityProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Scroll Velocity"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Two looping rows move at <code>{velocity}</code> px per second.
              Scroll velocity maps <code>{velocityMapping.input.join('..')}</code> to{' '}
              <code>{velocityMapping.output.join('..')}</code> through a spring
              of damping <code>{damping}</code>.
            </>
          }
          controls="Pause holds the frame loop. Replay remounts the rows."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The rows are the Week 0 and Six weeks titles from src/pages/content.ts. scrollContainerRef, className, paused, reduced, onOffset, and style props are not controls. The scroller is the window."
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
      stageTestId="scroll-velocity-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-offset': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamScrollVelocity
        key={run}
        texts={texts}
        velocity={reduce ? 0 : velocity}
        damping={damping}
        stiffness={stiffness}
        numCopies={numCopies}
        velocityMapping={velocityMapping}
        parallaxClassName={parallaxClassName}
        scrollerClassName={scrollerClassName}
        paused={paused}
        reduced={reduce}
        onOffset={(offset) => {
          stageRef.current?.setAttribute('data-offset', offset.toFixed(1));
        }}
      />
    </ReactBitsFrame>
  );
}
