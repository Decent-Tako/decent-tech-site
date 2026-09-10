import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCRTWarp from '../../vendor/backgrounds/crt-warp/CRTWarp';
import { CRT_WARP_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './crt-warp.css';

export type CRTWarpProps = {
  color?: string;
  backgroundColor?: string;
  speed?: number;
  curvature?: number;
  scanlineStrength?: number;
  scanlineFrequency?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  bloom?: number;
  bloomRadius?: number;
  noise?: number;
  vignette?: number;
  brightness?: number;
  pixelation?: number;
  rgbShift?: number;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  fps?: number;
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

export function CRTWarp({
  color = CRT_WARP_DEFAULTS.color,
  backgroundColor = CRT_WARP_DEFAULTS.backgroundColor,
  speed = CRT_WARP_DEFAULTS.speed,
  curvature = CRT_WARP_DEFAULTS.curvature,
  scanlineStrength = CRT_WARP_DEFAULTS.scanlineStrength,
  scanlineFrequency = CRT_WARP_DEFAULTS.scanlineFrequency,
  waveAmplitude = CRT_WARP_DEFAULTS.waveAmplitude,
  waveFrequency = CRT_WARP_DEFAULTS.waveFrequency,
  bloom = CRT_WARP_DEFAULTS.bloom,
  bloomRadius = CRT_WARP_DEFAULTS.bloomRadius,
  noise = CRT_WARP_DEFAULTS.noise,
  vignette = CRT_WARP_DEFAULTS.vignette,
  brightness = CRT_WARP_DEFAULTS.brightness,
  pixelation = CRT_WARP_DEFAULTS.pixelation,
  rgbShift = CRT_WARP_DEFAULTS.rgbShift,
  mouseReact = CRT_WARP_DEFAULTS.mouseReact,
  mouseStrength = CRT_WARP_DEFAULTS.mouseStrength,
  dpr = CRT_WARP_DEFAULTS.dpr,
  fps = CRT_WARP_DEFAULTS.fps,
  reducedMotion = CRT_WARP_DEFAULTS.reducedMotion,
}: CRTWarpProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="CRT Warp"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js full-screen CRT plasma. Curvature, scanlines, bloom, and the
              pointer bend a discrete wave field.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, paused, onReady, and onError are not controls. Colour defaults are brand tokens: plasma accent-yellow #DEF54F (upstream #c755f7), background ink #212121 (upstream #05010a). The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="crt-warp-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="crt-warp-fill">
        <UpstreamCRTWarp
          key={run}
          color={color}
          backgroundColor={backgroundColor}
          speed={motionSpeed}
          curvature={curvature}
          scanlineStrength={scanlineStrength}
          scanlineFrequency={scanlineFrequency}
          waveAmplitude={waveAmplitude}
          waveFrequency={waveFrequency}
          bloom={bloom}
          bloomRadius={bloomRadius}
          noise={noise}
          vignette={vignette}
          brightness={brightness}
          pixelation={pixelation}
          rgbShift={rgbShift}
          mouseReact={mouseReact}
          mouseStrength={mouseStrength}
          dpr={dpr}
          fps={fps}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="crt-warp__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
