import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamShuffle from '../../vendor/text-animations/shuffle/Shuffle';
import { SHUFFLE_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './shuffle.css';

export type ShuffleProps = {
  text?: string;
  shuffleDirection?: (typeof SHUFFLE_DEFAULTS)['shuffleDirection'];
  duration?: number;
  maxDelay?: number;
  ease?: string;
  threshold?: number;
  rootMargin?: string;
  tag?: (typeof SHUFFLE_DEFAULTS)['tag'];
  textAlign?: (typeof SHUFFLE_DEFAULTS)['textAlign'];
  shuffleTimes?: number;
  animationMode?: (typeof SHUFFLE_DEFAULTS)['animationMode'];
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function Shuffle({
  text = SHUFFLE_DEFAULTS.text,
  shuffleDirection = SHUFFLE_DEFAULTS.shuffleDirection,
  duration = SHUFFLE_DEFAULTS.duration,
  maxDelay = SHUFFLE_DEFAULTS.maxDelay,
  ease = SHUFFLE_DEFAULTS.ease,
  threshold = SHUFFLE_DEFAULTS.threshold,
  rootMargin = SHUFFLE_DEFAULTS.rootMargin,
  tag = SHUFFLE_DEFAULTS.tag,
  textAlign = SHUFFLE_DEFAULTS.textAlign,
  shuffleTimes = SHUFFLE_DEFAULTS.shuffleTimes,
  animationMode = SHUFFLE_DEFAULTS.animationMode,
  loop = SHUFFLE_DEFAULTS.loop,
  loopDelay = SHUFFLE_DEFAULTS.loopDelay,
  stagger = SHUFFLE_DEFAULTS.stagger,
  scrambleCharset = SHUFFLE_DEFAULTS.scrambleCharset,
  colorFrom = SHUFFLE_DEFAULTS.colorFrom,
  colorTo = SHUFFLE_DEFAULTS.colorTo,
  triggerOnce = SHUFFLE_DEFAULTS.triggerOnce,
  respectReducedMotion = SHUFFLE_DEFAULTS.respectReducedMotion,
  triggerOnHover = SHUFFLE_DEFAULTS.triggerOnHover,
  reducedMotion = SHUFFLE_DEFAULTS.reducedMotion,
}: ShuffleProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [state, setState] = useState<'pending' | 'done'>('pending');
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Shuffle"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              SplitText wraps each glyph in a strip. A gsap timeline slides the
              strip <code>{shuffleDirection}</code> for <code>{shuffleTimes}</code>{' '}
              extra copies, then lands on the real letter. Mode{' '}
              <code>{animationMode}</code>. Duration <code>{duration}</code> s.
            </>
          }
          controls="Pause holds the gsap timeline. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. className, style, onShuffleComplete, paused, and reduced are not controls. paused is local. colorFrom is ink; upstream has no default. colorTo is accent blue; upstream has no default. The host tag stays p so the frame heading stays unique."
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
      stageTestId="shuffle-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': state,
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamShuffle
        key={run}
        className="shuffle-copy"
        text={text}
        shuffleDirection={shuffleDirection}
        duration={reduce ? 0 : duration}
        maxDelay={maxDelay}
        ease={ease}
        threshold={threshold}
        rootMargin={rootMargin}
        tag={tag}
        textAlign={textAlign}
        shuffleTimes={shuffleTimes}
        animationMode={animationMode}
        loop={reduce ? false : loop}
        loopDelay={loopDelay}
        stagger={stagger}
        scrambleCharset={scrambleCharset}
        colorFrom={colorFrom}
        colorTo={colorTo}
        triggerOnce={triggerOnce}
        respectReducedMotion={respectReducedMotion}
        triggerOnHover={reduce ? false : triggerOnHover}
        paused={paused}
        reduced={reduce}
        onShuffleComplete={() => setState('done')}
      />
    </ReactBitsFrame>
  );
}
