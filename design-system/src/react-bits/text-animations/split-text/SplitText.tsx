import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { ARTICLE } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSplitText from '../../vendor/text-animations/split-text/SplitText';
import {
  REACT_BITS_SOURCE,
  SPLIT_EASES,
  SPLIT_TAGS,
  SPLIT_TEXT_DEFAULTS,
  SPLIT_TYPES,
} from './source';

import './split-text.css';

export type SplitTextProps = {
  delay?: number;
  duration?: number;
  ease?: (typeof SPLIT_EASES)[number];
  splitType?: (typeof SPLIT_TYPES)[number];
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: (typeof SPLIT_TAGS)[number];
  reducedMotion?: ReducedMotionMode;
};

export type SplitState = 'pending' | 'done';

export function SplitText({
  delay = SPLIT_TEXT_DEFAULTS.delay,
  duration = SPLIT_TEXT_DEFAULTS.duration,
  ease = SPLIT_TEXT_DEFAULTS.ease,
  splitType = SPLIT_TEXT_DEFAULTS.splitType,
  threshold = SPLIT_TEXT_DEFAULTS.threshold,
  rootMargin = SPLIT_TEXT_DEFAULTS.rootMargin,
  textAlign = SPLIT_TEXT_DEFAULTS.textAlign,
  tag = SPLIT_TEXT_DEFAULTS.tag,
  reducedMotion = SPLIT_TEXT_DEFAULTS.reducedMotion,
}: SplitTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [state, setState] = useState<SplitState>('pending');
  const reduce = useReduce(reducedMotion);

  // The upstream file keeps its tween private. Pause holds the gsap global
  // timeline instead; one story renders at a time. Unmount resumes it.
  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  // Reduced motion: no stagger and a zero duration, so every piece lands
  // at once.
  const timing = reduce ? { delay: 0, duration: 0 } : { delay, duration };

  return (
    <ReactBitsFrame
      title="Split Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              The gsap <code>SplitText</code> plugin splits the text by{' '}
              <code>splitType {splitType}</code>, then <code>gsap.fromTo</code> tweens each
              piece from opacity 0 and y 40 to opacity 1 and y 0 over{' '}
              <code>duration {duration}</code> s with ease <code>{ease}</code>, staggered by{' '}
              <code>delay {delay}</code> ms. A <code>ScrollTrigger</code> at{' '}
              <code>top {Math.round((1 - threshold) * 100)}%</code> plus{' '}
              <code>rootMargin {rootMargin}</code> starts it once.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the upstream component, so the split and the tween run again."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The text is the Academy article title from src/pages/content.ts. The from and to keyframes stay upstream and the wrapper owns the completion callback, which writes data-state onto the stage. className is not a control."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setState('pending');
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="split-text__stage"
      stageTestId="split-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': state,
      }}
    >
      <div className="split-text__box" data-testid="split-text-box">
        <UpstreamSplitText
          key={run}
          text={ARTICLE.title}
          className="split-text__copy"
          delay={timing.delay}
          duration={timing.duration}
          ease={ease}
          splitType={splitType}
          threshold={threshold}
          rootMargin={rootMargin}
          textAlign={textAlign}
          tag={tag}
          onLetterAnimationComplete={() => setState('done')}
        />
      </div>
    </ReactBitsFrame>
  );
}
