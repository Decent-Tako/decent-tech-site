import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLiquidChrome from '../../vendor/backgrounds/liquid-chrome/LiquidChrome';
import { LIQUID_CHROME_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './liquid-chrome.css';

export type LiquidChromeProps = {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[0];

export function LiquidChrome({
  baseColor = LIQUID_CHROME_DEFAULTS.baseColor,
  speed = LIQUID_CHROME_DEFAULTS.speed,
  amplitude = LIQUID_CHROME_DEFAULTS.amplitude,
  frequencyX = LIQUID_CHROME_DEFAULTS.frequencyX,
  frequencyY = LIQUID_CHROME_DEFAULTS.frequencyY,
  interactive = LIQUID_CHROME_DEFAULTS.interactive,
  reducedMotion = LIQUID_CHROME_DEFAULTS.reducedMotion,
}: LiquidChromeProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Liquid Chrome"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl full-screen triangle. Nested cosine waves fold UV into a
              chrome field tinted by <code>baseColor</code>. The pointer adds
              a ripple.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour is RGB 0-1. Default is brand ink #212121 as [0.129, 0.129, 0.129] (upstream [0.1, 0.1, 0.1]). The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeWebgl());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="liquid-chrome-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="liquid-chrome-fill">
        <UpstreamLiquidChrome
          key={run}
          baseColor={baseColor}
          speed={motionSpeed}
          amplitude={amplitude}
          frequencyX={frequencyX}
          frequencyY={frequencyY}
          interactive={interactive}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="liquid-chrome__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
