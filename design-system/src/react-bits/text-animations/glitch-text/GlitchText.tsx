import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGlitchText from '../../vendor/text-animations/glitch-text/GlitchText';
import { GLITCH_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './glitch-text.css';

export type GlitchTextProps = {
  text?: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function GlitchText({
  text = GLITCH_TEXT_DEFAULTS.text,
  speed = GLITCH_TEXT_DEFAULTS.speed,
  enableShadows = GLITCH_TEXT_DEFAULTS.enableShadows,
  enableOnHover = GLITCH_TEXT_DEFAULTS.enableOnHover,
  reducedMotion = GLITCH_TEXT_DEFAULTS.reducedMotion,
}: GlitchTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Glitch Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Two pseudo copies clip through the word on a CSS keyframe loop.
              Speed <code>{speed}</code>. Shadows are{' '}
              <code>{String(enableShadows)}</code>. Hover-only is{' '}
              <code>{String(enableOnHover)}</code>.
            </>
          }
          controls="Pause holds the keyframes. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. children, className, paused, and reduced are not controls. The stage is ink so the word uses paper."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="glitch-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-copy': FEATURES[0].title,
        'data-hover': enableOnHover ? 'true' : 'false',
      }}
    >
      <UpstreamGlitchText
        key={run}
        speed={speed}
        enableShadows={enableShadows}
        enableOnHover={enableOnHover}
        paused={paused}
        reduced={reduce}
      >
        {text}
      </UpstreamGlitchText>
    </ReactBitsFrame>
  );
}
