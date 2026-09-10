import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDither from '../../vendor/backgrounds/dither/Dither';
import { DITHER_DEFAULTS, REACT_BITS_SOURCE, type DitherRgb } from './source';

import './dither.css';

export type DitherProps = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: DitherRgb;
  backgroundColor?: DitherRgb;
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
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

const CARD = FEATURES[2];

export function Dither({
  waveSpeed = DITHER_DEFAULTS.waveSpeed,
  waveFrequency = DITHER_DEFAULTS.waveFrequency,
  waveAmplitude = DITHER_DEFAULTS.waveAmplitude,
  waveColor = DITHER_DEFAULTS.waveColor,
  backgroundColor = DITHER_DEFAULTS.backgroundColor,
  colorNum = DITHER_DEFAULTS.colorNum,
  pixelSize = DITHER_DEFAULTS.pixelSize,
  disableAnimation = DITHER_DEFAULTS.disableAnimation,
  enableMouseInteraction = DITHER_DEFAULTS.enableMouseInteraction,
  mouseRadius = DITHER_DEFAULTS.mouseRadius,
  reducedMotion = DITHER_DEFAULTS.reducedMotion,
}: DitherProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce || disableAnimation ? 0 : waveSpeed;

  return (
    <ReactBitsFrame
      title="Dither"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js noise wave, then a Bayer dither pass. Time, wave frequency,
              and the pointer dent the field. <code>colorNum</code> and{' '}
              <code>pixelSize</code> set the dither.
            </>
          }
          controls="Pause holds time. Replay remounts the sketch. Reduced motion freezes the wave."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. The local copy drives three.js and postprocessing directly because @react-three/fiber leaks JSX types into Motion stories. Colour defaults are brand tokens as 0–1 RGB: wave accent-blue #0035B1 (upstream 0.5,0.5,0.5), background ink #212121 (upstream 0,0,0). The caption is the Tools card from src/pages/content.ts."
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
      stageTestId="dither-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="dither-fill">
        <UpstreamDither
          key={run}
          waveSpeed={waveSpeed}
          waveFrequency={waveFrequency}
          waveAmplitude={waveAmplitude}
          waveColor={waveColor}
          backgroundColor={backgroundColor}
          colorNum={colorNum}
          pixelSize={pixelSize}
          disableAnimation={disableAnimation || reduce}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="dither__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
