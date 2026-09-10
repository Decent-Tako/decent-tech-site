import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPixelTrail from '../../vendor/animations/pixel-trail/PixelTrail';
import { PIXEL_TRAIL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './pixel-trail.css';

export type PixelTrailProps = {
  gridSize?: (typeof PIXEL_TRAIL_DEFAULTS)['gridSize'];
  trailSize?: (typeof PIXEL_TRAIL_DEFAULTS)['trailSize'];
  maxAge?: (typeof PIXEL_TRAIL_DEFAULTS)['maxAge'];
  interpolate?: (typeof PIXEL_TRAIL_DEFAULTS)['interpolate'];
  color?: (typeof PIXEL_TRAIL_DEFAULTS)['color'];
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[4];

export function PixelTrail({
  gridSize = PIXEL_TRAIL_DEFAULTS.gridSize,
  trailSize = PIXEL_TRAIL_DEFAULTS.trailSize,
  maxAge = PIXEL_TRAIL_DEFAULTS.maxAge,
  interpolate = PIXEL_TRAIL_DEFAULTS.interpolate,
  color = PIXEL_TRAIL_DEFAULTS.color,
  reducedMotion = PIXEL_TRAIL_DEFAULTS.reducedMotion,
}: PixelTrailProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Pixel Trail"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js shader samples a pointer trail texture onto a{' '}
              <code>{gridSize}</code> pixel grid in brand paper.
            </>
          }
          controls="Pause skips new trail stamps. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="easingFunction, canvasProps, glProps, and gooeyFilter are not controls. paused, seedCenter, onReady, and onUnavailable are local. preserveDrawingBuffer is on so the play can read pixels. Colour default is brand paper #FFFFFF (upstream #ffffff). The caption is the Street card from src/pages/content.ts. The local copy drives three.js directly because @react-three/fiber leaks JSX types into Motion stories."
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
      stageClassName="rb-frame__stage--ink pixel-trail-stage"
      stageTestId="pixel-trail-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <UpstreamPixelTrail
        key={run}
        gridSize={gridSize}
        trailSize={reduce ? 0.35 : trailSize}
        maxAge={reduce ? 60000 : maxAge}
        interpolate={interpolate}
        color={color}
        paused={paused || reduce}
        seedCenter={reduce}
        onReady={() => setWebgl('ready')}
        onUnavailable={() => setWebgl('unavailable')}
      />
      <p className="pixel-trail-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
