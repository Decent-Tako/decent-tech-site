import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPlasmaWave from '../../vendor/backgrounds/plasma-wave/PlasmaWave';
import { PLASMA_WAVE_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './plasma-wave.css';

export type PlasmaWaveProps = {
  xOffset?: number;
  yOffset?: number;
  rotationDeg?: number;
  focalLength?: number;
  speed1?: number;
  speed2?: number;
  dir2?: number;
  bend1?: number;
  bend2?: number;
  colors?: [string, string];
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

export function PlasmaWave({
  xOffset = PLASMA_WAVE_DEFAULTS.xOffset,
  yOffset = PLASMA_WAVE_DEFAULTS.yOffset,
  rotationDeg = PLASMA_WAVE_DEFAULTS.rotationDeg,
  focalLength = PLASMA_WAVE_DEFAULTS.focalLength,
  speed1 = PLASMA_WAVE_DEFAULTS.speed1,
  speed2 = PLASMA_WAVE_DEFAULTS.speed2,
  dir2 = PLASMA_WAVE_DEFAULTS.dir2,
  bend1 = PLASMA_WAVE_DEFAULTS.bend1,
  bend2 = PLASMA_WAVE_DEFAULTS.bend2,
  colors = PLASMA_WAVE_DEFAULTS.colors,
  lightMode = PLASMA_WAVE_DEFAULTS.lightMode,
  reducedMotion = PLASMA_WAVE_DEFAULTS.reducedMotion,
}: PlasmaWaveProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed1 = reduce ? 0 : speed1;
  const motionSpeed2 = reduce ? 0 : speed2;

  return (
    <ReactBitsFrame
      title="Plasma Wave"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl raymarch of two bent tubes. Each tube takes a colour stop
              and a speed. Rotation and offset move the view.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets both speeds to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour defaults are brand tokens: #0035B1 and #DEF54F (upstream #A855F7, #06B6D4). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="plasma-wave-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed1),
        'data-rotation': String(rotationDeg),
      }}
    >
      <div className="plasma-wave-fill">
        <UpstreamPlasmaWave
          key={run}
          xOffset={xOffset}
          yOffset={yOffset}
          rotationDeg={rotationDeg}
          focalLength={focalLength}
          speed1={motionSpeed1}
          speed2={motionSpeed2}
          dir2={dir2}
          bend1={bend1}
          bend2={bend2}
          colors={colors}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="plasma-wave__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
