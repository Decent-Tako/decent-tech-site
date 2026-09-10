import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSplitText from '../../vendor/text-animations/split-text/SplitText';
import { SPLIT_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './split-text.css';

export type SplitTextProps = {
  text?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: (typeof SPLIT_TEXT_DEFAULTS)['splitType'];
  from?: Record<string, number>;
  to?: Record<string, number>;
  threshold?: number;
  rootMargin?: string;
  textAlign?: (typeof SPLIT_TEXT_DEFAULTS)['textAlign'];
  tag?: (typeof SPLIT_TEXT_DEFAULTS)['tag'];
  reducedMotion?: ReducedMotionMode;
};

export function SplitText({
  text = SPLIT_TEXT_DEFAULTS.text,
  delay = SPLIT_TEXT_DEFAULTS.delay,
  duration = SPLIT_TEXT_DEFAULTS.duration,
  ease = SPLIT_TEXT_DEFAULTS.ease,
  splitType = SPLIT_TEXT_DEFAULTS.splitType,
  from = SPLIT_TEXT_DEFAULTS.from,
  to = SPLIT_TEXT_DEFAULTS.to,
  threshold = SPLIT_TEXT_DEFAULTS.threshold,
  rootMargin = SPLIT_TEXT_DEFAULTS.rootMargin,
  textAlign = SPLIT_TEXT_DEFAULTS.textAlign,
  tag = SPLIT_TEXT_DEFAULTS.tag,
  reducedMotion = SPLIT_TEXT_DEFAULTS.reducedMotion,
}: SplitTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [state, setState] = useState<'pending' | 'done'>('pending');
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Split Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              SplitText breaks the paragraph into <code>{splitType}</code>. Each
              unit starts at opacity 0 and y 40, then eases to rest over{' '}
              <code>{duration}</code> s with stagger <code>{delay}</code> ms.
            </>
          }
          controls="Pause holds the gsap tween. Replay remounts the paragraph."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 card from src/pages/content.ts. className, onLetterAnimationComplete, paused, and reduced are not controls. paused is local. The host tag stays p so the frame heading stays unique."
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
      stageTestId="split-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': state,
        'data-copy': FEATURES[0].copy,
      }}
    >
      <UpstreamSplitText
        key={run}
        className="split-text-copy"
        text={text}
        delay={reduce ? 0 : delay}
        duration={reduce ? 0 : duration}
        ease={ease}
        splitType={splitType}
        from={from}
        to={to}
        threshold={threshold}
        rootMargin={rootMargin}
        textAlign={textAlign}
        tag={tag}
        paused={paused}
        reduced={reduce}
        onLetterAnimationComplete={() => setState('done')}
      />
    </ReactBitsFrame>
  );
}
