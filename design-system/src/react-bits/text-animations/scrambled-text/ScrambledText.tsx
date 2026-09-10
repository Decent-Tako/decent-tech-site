import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { ARTICLE } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamScrambledText from '../../vendor/text-animations/scrambled-text/ScrambledText';
import { REACT_BITS_SOURCE, SCRAMBLED_TEXT_DEFAULTS } from './source';

import './scrambled-text.css';

export type ScrambledTextProps = {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  reducedMotion?: ReducedMotionMode;
};

export function ScrambledText({
  radius = SCRAMBLED_TEXT_DEFAULTS.radius,
  duration = SCRAMBLED_TEXT_DEFAULTS.duration,
  speed = SCRAMBLED_TEXT_DEFAULTS.speed,
  scrambleChars = SCRAMBLED_TEXT_DEFAULTS.scrambleChars,
  reducedMotion = SCRAMBLED_TEXT_DEFAULTS.reducedMotion,
}: ScrambledTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  // The upstream file starts one tween per letter. Pause holds the gsap
  // global timeline and blocks new tweens through the local paused prop.
  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  return (
    <ReactBitsFrame
      title="Scrambled Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              The gsap <code>SplitText</code> plugin splits the text into letters. On every
              pointer move, each letter within <code>radius {radius}</code> pixels gets a{' '}
              <code>scrambleText</code> tween back to itself over up to{' '}
              <code>duration {duration}</code> s, cycling through <code>scrambleChars</code> at{' '}
              <code>speed {speed}</code>. Letters nearer the pointer scramble longer.
            </>
          }
          controls="Pause holds the gsap global timeline and ignores pointer moves through the local paused prop. Replay remounts the upstream component, so the split runs again."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The text is the Academy article title from src/pages/content.ts; className and style are not controls. Reduced motion mounts the component paused, so the letters stay as they are. The play function reads the block text, which the tweens rewrite letter by letter. The split runs with aria none (local change 4): the gsap default writes aria-label on the paragraph, which axe forbids on an element with no role."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="scrambled-text__stage"
      stageTestId="scrambled-text-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <div className="scrambled-text__box" data-testid="scrambled-text-box">
        <UpstreamScrambledText
          key={run}
          radius={radius}
          duration={duration}
          speed={speed}
          scrambleChars={scrambleChars}
          className="scrambled-text__copy"
          paused={paused || reduce}
          aria="none"
        >
          {ARTICLE.title}
        </UpstreamScrambledText>
      </div>
    </ReactBitsFrame>
  );
}
