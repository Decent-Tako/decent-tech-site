import { useEffect, useState } from 'react';

import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamBlurText from '../../vendor/text-animations/blur-text/BlurText';
import { BLUR_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './blur-text.css';

export type BlurTextProps = {
  text?: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
  reducedMotion?: ReducedMotionMode;
};

export function BlurText({
  text = BLUR_TEXT_DEFAULTS.text,
  delay = BLUR_TEXT_DEFAULTS.delay,
  animateBy = BLUR_TEXT_DEFAULTS.animateBy,
  direction = BLUR_TEXT_DEFAULTS.direction,
  threshold = BLUR_TEXT_DEFAULTS.threshold,
  rootMargin = BLUR_TEXT_DEFAULTS.rootMargin,
  stepDuration = BLUR_TEXT_DEFAULTS.stepDuration,
  reducedMotion = BLUR_TEXT_DEFAULTS.reducedMotion,
}: BlurTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [state, setState] = useState<'pending' | 'done'>('pending');
  const reduce = useReduce(reducedMotion);
  const timing = reduce ? { delay: 0, stepDuration: 0 } : { delay, stepDuration };

  useEffect(() => {
    if (reduce) setState('done');
  }, [reduce]);

  return (
    <ReactBitsFrame
      title="Blur Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each {animateBy === 'words' ? 'word' : 'letter'} starts at blur 10px
              and opacity 0, then eases to sharp type. The stagger is{' '}
              <code>{timing.delay}</code> ms. Direction <code>{direction}</code>.
            </>
          }
          controls="Pause holds remaining delays at the last snapshot. Replay remounts the paragraph."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 card from src/pages/content.ts. animationFrom, animationTo, easing, onAnimationComplete, className, and paused are not controls. paused is local."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setState('pending');
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="blur-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': state,
      }}
    >
      <UpstreamBlurText
        key={run}
        className="blur-text__copy"
        text={text}
        delay={timing.delay}
        animateBy={animateBy}
        direction={direction}
        threshold={threshold}
        rootMargin={rootMargin}
        stepDuration={timing.stepDuration}
        paused={paused || reduce}
        onAnimationComplete={() => setState('done')}
      />
    </ReactBitsFrame>
  );
}
