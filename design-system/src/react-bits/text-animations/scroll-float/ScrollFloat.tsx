import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamScrollFloat from '../../vendor/text-animations/scroll-float/ScrollFloat';
import { SCROLL_FLOAT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './scroll-float.css';

export type ScrollFloatProps = {
  text?: string;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollFloat({
  text = SCROLL_FLOAT_DEFAULTS.text,
  containerClassName = SCROLL_FLOAT_DEFAULTS.containerClassName,
  textClassName = SCROLL_FLOAT_DEFAULTS.textClassName,
  animationDuration = SCROLL_FLOAT_DEFAULTS.animationDuration,
  ease = SCROLL_FLOAT_DEFAULTS.ease,
  scrollStart = SCROLL_FLOAT_DEFAULTS.scrollStart,
  scrollEnd = SCROLL_FLOAT_DEFAULTS.scrollEnd,
  stagger = SCROLL_FLOAT_DEFAULTS.stagger,
  reducedMotion = SCROLL_FLOAT_DEFAULTS.reducedMotion,
}: ScrollFloatProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Scroll Float"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each glyph starts at <code>yPercent 120</code> with a squash, then
              ScrollTrigger scrubs it to rest from <code>{scrollStart}</code> to{' '}
              <code>{scrollEnd}</code> with ease <code>{ease}</code>.
            </>
          }
          controls="Pause disables the ScrollTrigger. Replay remounts the heading."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The word is the Week 0 title from src/pages/content.ts. children, scrollContainerRef, paused, reduced, and onProgress are not controls. The scroller is a tall stage, not the window."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageTestId="scroll-float-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-progress': reduce ? '1' : '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <div
        ref={scrollerRef}
        className="scroll-float__scroller"
        data-testid="scroll-float-scroller"
      >
        <div className="scroll-float__spacer" aria-hidden="true" />
        <UpstreamScrollFloat
          key={run}
          scrollContainerRef={scrollerRef}
          containerClassName={containerClassName}
          textClassName={textClassName}
          animationDuration={animationDuration}
          ease={ease}
          scrollStart={scrollStart}
          scrollEnd={scrollEnd}
          stagger={stagger}
          paused={paused}
          reduced={reduce}
          onProgress={(progress) => {
            stageRef.current?.setAttribute('data-progress', progress.toFixed(2));
          }}
        >
          {text}
        </UpstreamScrollFloat>
        <div className="scroll-float__spacer" aria-hidden="true" />
      </div>
    </ReactBitsFrame>
  );
}
