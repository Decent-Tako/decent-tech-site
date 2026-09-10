import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLightning from '../../vendor/backgrounds/lightning/Lightning';
import { LIGHTNING_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './lightning.css';

export type LightningProps = {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
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

const CARD = FEATURES[3];

export function Lightning({
  hue = LIGHTNING_DEFAULTS.hue,
  xOffset = LIGHTNING_DEFAULTS.xOffset,
  speed = LIGHTNING_DEFAULTS.speed,
  intensity = LIGHTNING_DEFAULTS.intensity,
  size = LIGHTNING_DEFAULTS.size,
  reducedMotion = LIGHTNING_DEFAULTS.reducedMotion,
}: LightningProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Lightning"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A raw WebGL fragment shader. Fractal Brownian motion warps UV,
              then a thin bolt lights at hue <code>{hue}</code>.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Hue 230 is a blue near brand accent-blue #0035B1 (hue about 221). The caption is the Challenge week card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas. No extra runtime package: the sketch uses the browser WebGL context."
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
      stageTestId="lightning-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="lightning-fill">
        <UpstreamLightning
          key={run}
          hue={hue}
          xOffset={xOffset}
          speed={speed}
          intensity={intensity}
          size={size}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="lightning__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
