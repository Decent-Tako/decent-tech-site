import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGridDistortion from '../../vendor/backgrounds/grid-distortion/GridDistortion';
import { GRID_DISTORTION_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './grid-distortion.css';

export type GridDistortionProps = {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
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

export function GridDistortion({
  grid = GRID_DISTORTION_DEFAULTS.grid,
  mouse = GRID_DISTORTION_DEFAULTS.mouse,
  strength = GRID_DISTORTION_DEFAULTS.strength,
  relaxation = GRID_DISTORTION_DEFAULTS.relaxation,
  reducedMotion = GRID_DISTORTION_DEFAULTS.reducedMotion,
}: GridDistortionProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Grid Distortion"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js plane samples a data texture. Pointer motion writes
              offsets that warp the Academy photograph.
            </>
          }
          controls="Pause holds the offset field. Replay remounts the sketch. Reduced motion holds the field."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="imageSrc, className, paused, onReady, and onError are not controls. The image is the Week 0 photograph from src/pages/content.ts through publicAsset(). preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="grid-distortion-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': reduce ? '0' : '1',
      }}
    >
      <div className="grid-distortion-fill">
        <UpstreamGridDistortion
          key={run}
          grid={grid}
          mouse={reduce ? 0 : mouse}
          strength={reduce ? 0 : strength}
          relaxation={relaxation}
          imageSrc={CARD.photo.src}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="grid-distortion__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
