import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPixelSnow from '../../vendor/backgrounds/pixel-snow/PixelSnow';
import { PIXEL_SNOW_DEFAULTS, REACT_BITS_SOURCE, type PixelSnowVariant } from './source';

import './pixel-snow.css';

export type PixelSnowProps = {
  color?: string;
  flakeSize?: number;
  minFlakeSize?: number;
  pixelResolution?: number;
  speed?: number;
  depthFade?: number;
  farPlane?: number;
  brightness?: number;
  gamma?: number;
  density?: number;
  variant?: PixelSnowVariant;
  direction?: number;
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

const CARD = FEATURES[4];

export function PixelSnow({
  color = PIXEL_SNOW_DEFAULTS.color,
  flakeSize = PIXEL_SNOW_DEFAULTS.flakeSize,
  minFlakeSize = PIXEL_SNOW_DEFAULTS.minFlakeSize,
  pixelResolution = PIXEL_SNOW_DEFAULTS.pixelResolution,
  speed = PIXEL_SNOW_DEFAULTS.speed,
  depthFade = PIXEL_SNOW_DEFAULTS.depthFade,
  farPlane = PIXEL_SNOW_DEFAULTS.farPlane,
  brightness = PIXEL_SNOW_DEFAULTS.brightness,
  gamma = PIXEL_SNOW_DEFAULTS.gamma,
  density = PIXEL_SNOW_DEFAULTS.density,
  variant = PIXEL_SNOW_DEFAULTS.variant,
  direction = PIXEL_SNOW_DEFAULTS.direction,
  reducedMotion = PIXEL_SNOW_DEFAULTS.reducedMotion,
}: PixelSnowProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Pixel Snow"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js voxel raymarch. Cells spawn flakes that fall along a
              wind heading. Shape is square, round, or a snowflake SDF.
            </>
          }
          controls="Pause holds uTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, paused, onReady, and onError are not controls. Colour default is brand paper #FFFFFF (upstream #ffffff). The caption is the Street card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="pixel-snow-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-variant': variant,
      }}
    >
      <div className="pixel-snow-fill">
        <UpstreamPixelSnow
          key={run}
          color={color}
          flakeSize={flakeSize}
          minFlakeSize={minFlakeSize}
          pixelResolution={pixelResolution}
          speed={motionSpeed}
          depthFade={depthFade}
          farPlane={farPlane}
          brightness={brightness}
          gamma={gamma}
          density={density}
          variant={variant}
          direction={direction}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="pixel-snow__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
