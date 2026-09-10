import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamColorBends from '../../vendor/backgrounds/color-bends/ColorBends';
import { COLOR_BENDS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './color-bends.css';

export type ColorBendsProps = {
  rotation?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  autoRotate?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  iterations?: number;
  intensity?: number;
  bandWidth?: number;
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

export function ColorBends({
  rotation = COLOR_BENDS_DEFAULTS.rotation,
  speed = COLOR_BENDS_DEFAULTS.speed,
  colors = COLOR_BENDS_DEFAULTS.colors,
  transparent = COLOR_BENDS_DEFAULTS.transparent,
  autoRotate = COLOR_BENDS_DEFAULTS.autoRotate,
  scale = COLOR_BENDS_DEFAULTS.scale,
  frequency = COLOR_BENDS_DEFAULTS.frequency,
  warpStrength = COLOR_BENDS_DEFAULTS.warpStrength,
  mouseInfluence = COLOR_BENDS_DEFAULTS.mouseInfluence,
  parallax = COLOR_BENDS_DEFAULTS.parallax,
  noise = COLOR_BENDS_DEFAULTS.noise,
  iterations = COLOR_BENDS_DEFAULTS.iterations,
  intensity = COLOR_BENDS_DEFAULTS.intensity,
  bandWidth = COLOR_BENDS_DEFAULTS.bandWidth,
  reducedMotion = COLOR_BENDS_DEFAULTS.reducedMotion,
}: ColorBendsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;
  const motionAutoRotate = reduce ? 0 : autoRotate;

  return (
    <ReactBitsFrame
      title="Color Bends"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js full-screen shader warps colour bands with time, frequency,
              and a pointer uniform. Rotation and auto-rotate turn the field.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets speed and autoRotate to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, paused, onReady, and onError are not controls. Colour default is brand tokens accent-blue #0035B1, accent-yellow #DEF54F, and paper #FFFFFF (upstream empty list). The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="color-bends-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="color-bends-fill">
        <UpstreamColorBends
          key={run}
          rotation={rotation}
          speed={motionSpeed}
          colors={colors}
          transparent={transparent}
          autoRotate={motionAutoRotate}
          scale={scale}
          frequency={frequency}
          warpStrength={warpStrength}
          mouseInfluence={mouseInfluence}
          parallax={parallax}
          noise={noise}
          iterations={iterations}
          intensity={intensity}
          bandWidth={bandWidth}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="color-bends__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
