import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGradientWaves from '../../vendor/backgrounds/gradient-waves/GradientWaves';
import {
  GRADIENT_WAVES_DEFAULTS,
  REACT_BITS_SOURCE,
  type WaveDetail,
} from './source';

import './gradient-waves.css';

export type GradientWavesProps = {
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  tilt?: number;
  zoom?: number;
  height?: number;
  fogDepth?: number;
  detail?: WaveDetail;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
  grain?: boolean;
  grainIntensity?: number;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl2(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[0];

export function GradientWaves({
  horizonColor = GRADIENT_WAVES_DEFAULTS.horizonColor,
  waveColor = GRADIENT_WAVES_DEFAULTS.waveColor,
  crestColor = GRADIENT_WAVES_DEFAULTS.crestColor,
  speed = GRADIENT_WAVES_DEFAULTS.speed,
  amplitude = GRADIENT_WAVES_DEFAULTS.amplitude,
  waveScale = GRADIENT_WAVES_DEFAULTS.waveScale,
  waveRatio = GRADIENT_WAVES_DEFAULTS.waveRatio,
  swell = GRADIENT_WAVES_DEFAULTS.swell,
  turbulence = GRADIENT_WAVES_DEFAULTS.turbulence,
  tilt = GRADIENT_WAVES_DEFAULTS.tilt,
  zoom = GRADIENT_WAVES_DEFAULTS.zoom,
  height = GRADIENT_WAVES_DEFAULTS.height,
  fogDepth = GRADIENT_WAVES_DEFAULTS.fogDepth,
  detail = GRADIENT_WAVES_DEFAULTS.detail,
  brightness = GRADIENT_WAVES_DEFAULTS.brightness,
  opacity = GRADIENT_WAVES_DEFAULTS.opacity,
  mouseInteraction = GRADIENT_WAVES_DEFAULTS.mouseInteraction,
  parallaxStrength = GRADIENT_WAVES_DEFAULTS.parallaxStrength,
  grain = GRADIENT_WAVES_DEFAULTS.grain,
  grainIntensity = GRADIENT_WAVES_DEFAULTS.grainIntensity,
  reducedMotion = GRADIENT_WAVES_DEFAULTS.reducedMotion,
}: GradientWavesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Gradient Waves"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 raymarched plasma sea. Horizon, body, and crest
              colours mix through fog. The pointer tilts the camera.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. Colour defaults are brand tokens: horizon accent-blue #0035B1 (upstream #5227FF), wave accent-yellow #DEF54F (upstream #FF9FFC), crest paper #FFFFFF. The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeWebgl2());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="gradient-waves-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="gradient-waves-fill">
        <UpstreamGradientWaves
          key={run}
          horizonColor={horizonColor}
          waveColor={waveColor}
          crestColor={crestColor}
          speed={motionSpeed}
          amplitude={amplitude}
          waveScale={waveScale}
          waveRatio={waveRatio}
          swell={swell}
          turbulence={turbulence}
          tilt={tilt}
          zoom={zoom}
          height={height}
          fogDepth={fogDepth}
          detail={detail}
          brightness={brightness}
          opacity={opacity}
          mouseInteraction={mouseInteraction}
          parallaxStrength={parallaxStrength}
          grain={grain}
          grainIntensity={grainIntensity}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="gradient-waves__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
