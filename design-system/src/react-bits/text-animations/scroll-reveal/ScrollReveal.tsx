import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamScrollReveal from '../../vendor/text-animations/scroll-reveal/ScrollReveal';
import { SCROLL_REVEAL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './scroll-reveal.css';

export type ScrollRevealProps = {
  text?: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollReveal({
  text = SCROLL_REVEAL_DEFAULTS.text,
  enableBlur = SCROLL_REVEAL_DEFAULTS.enableBlur,
  baseOpacity = SCROLL_REVEAL_DEFAULTS.baseOpacity,
  baseRotation = SCROLL_REVEAL_DEFAULTS.baseRotation,
  blurStrength = SCROLL_REVEAL_DEFAULTS.blurStrength,
  containerClassName = SCROLL_REVEAL_DEFAULTS.containerClassName,
  textClassName = SCROLL_REVEAL_DEFAULTS.textClassName,
  rotationEnd = SCROLL_REVEAL_DEFAULTS.rotationEnd,
  wordAnimationEnd = SCROLL_REVEAL_DEFAULTS.wordAnimationEnd,
  reducedMotion = SCROLL_REVEAL_DEFAULTS.reducedMotion,
}: ScrollRevealProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Scroll Reveal"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              The block starts at <code>{baseRotation}</code> degrees. Each word
              fades from opacity <code>{baseOpacity}</code>
              {enableBlur ? (
                <>
                  {' '}
                  and blur <code>{blurStrength}</code> px
                </>
              ) : null}{' '}
              as ScrollTrigger scrubs to <code>{wordAnimationEnd}</code>.
            </>
          }
          controls="Pause disables the ScrollTriggers. Replay remounts the heading."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 card from src/pages/content.ts. children, scrollContainerRef, paused, reduced, and onProgress are not controls. The scroller is a tall stage, not the window."
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
      stageTestId="scroll-reveal-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-progress': reduce ? '1' : '0',
        'data-copy': FEATURES[0].copy,
        'data-blur': enableBlur ? 'true' : 'false',
      }}
    >
      <div
        ref={scrollerRef}
        className="scroll-reveal__scroller"
        data-testid="scroll-reveal-scroller"
      >
        <div className="scroll-reveal__spacer" aria-hidden="true" />
        <UpstreamScrollReveal
          key={run}
          scrollContainerRef={scrollerRef}
          enableBlur={enableBlur}
          baseOpacity={baseOpacity}
          baseRotation={baseRotation}
          blurStrength={blurStrength}
          containerClassName={containerClassName}
          textClassName={textClassName}
          rotationEnd={rotationEnd}
          wordAnimationEnd={wordAnimationEnd}
          paused={paused}
          reduced={reduce}
          onProgress={(progress) => {
            stageRef.current?.setAttribute('data-progress', progress.toFixed(2));
          }}
        >
          {text}
        </UpstreamScrollReveal>
        <div className="scroll-reveal__spacer" aria-hidden="true" />
      </div>
    </ReactBitsFrame>
  );
}
