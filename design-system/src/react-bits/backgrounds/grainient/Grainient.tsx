import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGrainient from '../../vendor/backgrounds/grainient/Grainient';
import { GRAINIENT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './grainient.css';

export type GrainientProps = {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  lightMode?: boolean;
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

const CARD = FEATURES[1];

export function Grainient({
  timeSpeed = GRAINIENT_DEFAULTS.timeSpeed,
  colorBalance = GRAINIENT_DEFAULTS.colorBalance,
  warpStrength = GRAINIENT_DEFAULTS.warpStrength,
  warpFrequency = GRAINIENT_DEFAULTS.warpFrequency,
  warpSpeed = GRAINIENT_DEFAULTS.warpSpeed,
  warpAmplitude = GRAINIENT_DEFAULTS.warpAmplitude,
  blendAngle = GRAINIENT_DEFAULTS.blendAngle,
  blendSoftness = GRAINIENT_DEFAULTS.blendSoftness,
  rotationAmount = GRAINIENT_DEFAULTS.rotationAmount,
  noiseScale = GRAINIENT_DEFAULTS.noiseScale,
  grainAmount = GRAINIENT_DEFAULTS.grainAmount,
  grainScale = GRAINIENT_DEFAULTS.grainScale,
  grainAnimated = GRAINIENT_DEFAULTS.grainAnimated,
  contrast = GRAINIENT_DEFAULTS.contrast,
  gamma = GRAINIENT_DEFAULTS.gamma,
  saturation = GRAINIENT_DEFAULTS.saturation,
  centerX = GRAINIENT_DEFAULTS.centerX,
  centerY = GRAINIENT_DEFAULTS.centerY,
  zoom = GRAINIENT_DEFAULTS.zoom,
  color1 = GRAINIENT_DEFAULTS.color1,
  color2 = GRAINIENT_DEFAULTS.color2,
  color3 = GRAINIENT_DEFAULTS.color3,
  lightMode = GRAINIENT_DEFAULTS.lightMode,
  reducedMotion = GRAINIENT_DEFAULTS.reducedMotion,
}: GrainientProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : timeSpeed;

  return (
    <ReactBitsFrame
      title="Grainient"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 warped three-stop gradient. Time rotates and warps
              the blend. Optional grain sits on top.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets timeSpeed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. Colour defaults are brand tokens: color1 accent-yellow #DEF54F (upstream #FF9FFC), color2 accent-blue #0035B1 (upstream #5227FF), color3 paper #FFFFFF (upstream #B497CF). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="grainient-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="grainient-fill">
        <UpstreamGrainient
          key={run}
          timeSpeed={motionSpeed}
          colorBalance={colorBalance}
          warpStrength={warpStrength}
          warpFrequency={warpFrequency}
          warpSpeed={warpSpeed}
          warpAmplitude={warpAmplitude}
          blendAngle={blendAngle}
          blendSoftness={blendSoftness}
          rotationAmount={rotationAmount}
          noiseScale={noiseScale}
          grainAmount={grainAmount}
          grainScale={grainScale}
          grainAnimated={grainAnimated}
          contrast={contrast}
          gamma={gamma}
          saturation={saturation}
          centerX={centerX}
          centerY={centerY}
          zoom={zoom}
          color1={color1}
          color2={color2}
          color3={color3}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="grainient__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
