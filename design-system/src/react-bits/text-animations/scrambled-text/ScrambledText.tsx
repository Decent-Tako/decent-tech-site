import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamScrambledText from '../../vendor/text-animations/scrambled-text/ScrambledText';
import { SCRAMBLED_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './scrambled-text.css';

export type ScrambledTextProps = {
  text?: string;
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  reducedMotion?: ReducedMotionMode;
};

export function ScrambledText({
  text = SCRAMBLED_TEXT_DEFAULTS.text,
  radius = SCRAMBLED_TEXT_DEFAULTS.radius,
  duration = SCRAMBLED_TEXT_DEFAULTS.duration,
  speed = SCRAMBLED_TEXT_DEFAULTS.speed,
  scrambleChars = SCRAMBLED_TEXT_DEFAULTS.scrambleChars,
  reducedMotion = SCRAMBLED_TEXT_DEFAULTS.reducedMotion,
}: ScrambledTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [scrambles, setScrambles] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Scrambled Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              SplitText breaks the paragraph into glyphs. Pointer glyphs inside{' '}
              <code>{radius}</code> px scramble through <code>{scrambleChars}</code>{' '}
              for up to <code>{duration}</code> s.
            </>
          }
          controls="Pause skips pointer scramble and kills live tweens. Replay remounts the paragraph."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 card from src/pages/content.ts. children, className, style, paused, reduced, and onScramble are not controls. paused is local."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setScrambles(0);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageTestId="scrambled-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-scrambles': String(scrambles),
        'data-copy': FEATURES[0].copy,
      }}
    >
      <UpstreamScrambledText
        key={run}
        className="scrambled-text"
        radius={radius}
        duration={duration}
        speed={speed}
        scrambleChars={scrambleChars}
        paused={paused}
        reduced={reduce}
        onScramble={() => {
          setScrambles((value) => value + 1);
          const stage = stageRef.current;
          if (!stage) return;
          const next = Number(stage.getAttribute('data-scrambles') ?? '0') + 1;
          stage.setAttribute('data-scrambles', String(next));
        }}
      >
        {text}
      </UpstreamScrambledText>
    </ReactBitsFrame>
  );
}
