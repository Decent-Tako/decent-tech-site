import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDarkVeil from '../../vendor/backgrounds/dark-veil/DarkVeil';
import { DARK_VEIL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './dark-veil.css';

export type DarkVeilProps = {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
  lightMode?: boolean;
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

const CARD = FEATURES[1];

export function DarkVeil({
  hueShift = DARK_VEIL_DEFAULTS.hueShift,
  noiseIntensity = DARK_VEIL_DEFAULTS.noiseIntensity,
  scanlineIntensity = DARK_VEIL_DEFAULTS.scanlineIntensity,
  speed = DARK_VEIL_DEFAULTS.speed,
  scanlineFrequency = DARK_VEIL_DEFAULTS.scanlineFrequency,
  warpAmount = DARK_VEIL_DEFAULTS.warpAmount,
  resolutionScale = DARK_VEIL_DEFAULTS.resolutionScale,
  lightMode = DARK_VEIL_DEFAULTS.lightMode,
  reducedMotion = DARK_VEIL_DEFAULTS.reducedMotion,
}: DarkVeilProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Dark Veil"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl CPPN field. Time, hue shift, warp, noise, and scanlines mix a
              dark colour veil across the stage.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. There is no colour prop; the shader generates the field. The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="dark-veil-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="dark-veil-fill">
        <UpstreamDarkVeil
          key={run}
          hueShift={hueShift}
          noiseIntensity={noiseIntensity}
          scanlineIntensity={scanlineIntensity}
          speed={motionSpeed}
          scanlineFrequency={scanlineFrequency}
          warpAmount={warpAmount}
          resolutionScale={resolutionScale}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="dark-veil__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
