import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLightRays, { type RaysOrigin } from '../../vendor/backgrounds/light-rays/LightRays';
import { LIGHT_RAYS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './light-rays.css';

export type LightRaysProps = {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
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

const CARD = FEATURES[0];

export function LightRays({
  raysOrigin = LIGHT_RAYS_DEFAULTS.raysOrigin,
  raysColor = LIGHT_RAYS_DEFAULTS.raysColor,
  raysSpeed = LIGHT_RAYS_DEFAULTS.raysSpeed,
  lightSpread = LIGHT_RAYS_DEFAULTS.lightSpread,
  rayLength = LIGHT_RAYS_DEFAULTS.rayLength,
  pulsating = LIGHT_RAYS_DEFAULTS.pulsating,
  fadeDistance = LIGHT_RAYS_DEFAULTS.fadeDistance,
  saturation = LIGHT_RAYS_DEFAULTS.saturation,
  followMouse = LIGHT_RAYS_DEFAULTS.followMouse,
  mouseInfluence = LIGHT_RAYS_DEFAULTS.mouseInfluence,
  noiseAmount = LIGHT_RAYS_DEFAULTS.noiseAmount,
  distortion = LIGHT_RAYS_DEFAULTS.distortion,
  lightMode = LIGHT_RAYS_DEFAULTS.lightMode,
  reducedMotion = LIGHT_RAYS_DEFAULTS.reducedMotion,
}: LightRaysProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : raysSpeed;

  return (
    <ReactBitsFrame
      title="Light Rays"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl full-screen triangle. Two ray fields fan from{' '}
              <code>{raysOrigin}</code> and tint with <code>raysColor</code>.
              Time pulses the strength. The pointer can steer the direction.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets raysSpeed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onReady, and onError are not controls. Colour default is brand accent-yellow #DEF54F (upstream #ffffff). The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="light-rays-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="light-rays-fill">
        <UpstreamLightRays
          key={run}
          raysOrigin={raysOrigin}
          raysColor={raysColor}
          raysSpeed={motionSpeed}
          lightSpread={lightSpread}
          rayLength={rayLength}
          pulsating={pulsating}
          fadeDistance={fadeDistance}
          saturation={saturation}
          followMouse={followMouse}
          mouseInfluence={mouseInfluence}
          noiseAmount={noiseAmount}
          distortion={distortion}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="light-rays__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
