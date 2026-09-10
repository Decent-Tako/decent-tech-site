import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSideRays from '../../vendor/backgrounds/side-rays/SideRays';
import { REACT_BITS_SOURCE, SIDE_RAYS_DEFAULTS, type SideRaysOrigin } from './source';

import './side-rays.css';

export type SideRaysProps = {
  speed?: number;
  rayColor1?: string;
  rayColor2?: string;
  intensity?: number;
  spread?: number;
  origin?: SideRaysOrigin;
  tilt?: number;
  saturation?: number;
  blend?: number;
  falloff?: number;
  opacity?: number;
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

export function SideRays({
  speed = SIDE_RAYS_DEFAULTS.speed,
  rayColor1 = SIDE_RAYS_DEFAULTS.rayColor1,
  rayColor2 = SIDE_RAYS_DEFAULTS.rayColor2,
  intensity = SIDE_RAYS_DEFAULTS.intensity,
  spread = SIDE_RAYS_DEFAULTS.spread,
  origin = SIDE_RAYS_DEFAULTS.origin,
  tilt = SIDE_RAYS_DEFAULTS.tilt,
  saturation = SIDE_RAYS_DEFAULTS.saturation,
  blend = SIDE_RAYS_DEFAULTS.blend,
  falloff = SIDE_RAYS_DEFAULTS.falloff,
  opacity = SIDE_RAYS_DEFAULTS.opacity,
  reducedMotion = SIDE_RAYS_DEFAULTS.reducedMotion,
}: SideRaysProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Side Rays"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl pair of rays from {origin}. Speed {speed} and intensity{' '}
              {intensity} drive the beam. Tilt and spread shape the cone.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. rayColor1 default is brand accent-yellow #DEF54F (upstream #EAB308). rayColor2 is brand paper #FFFFFF (upstream #96c8ff). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="side-rays-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-origin': origin,
      }}
    >
      <div className="side-rays-fill">
        <UpstreamSideRays
          key={run}
          speed={motionSpeed}
          rayColor1={rayColor1}
          rayColor2={rayColor2}
          intensity={intensity}
          spread={spread}
          origin={origin}
          tilt={tilt}
          saturation={saturation}
          blend={blend}
          falloff={falloff}
          opacity={opacity}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="side-rays__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
