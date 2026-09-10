import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamStrands from '../../vendor/animations/strands/Strands';
import { REACT_BITS_SOURCE, STRANDS_DEFAULTS } from './source';

import './strands.css';

export type StrandsProps = {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  hueShift?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  glass?: boolean;
  refraction?: number;
  dispersion?: number;
  glassSize?: number;
  reducedMotion?: ReducedMotionMode;
};

// Probe once, before anything mounts. The upstream file asks ogl for a
// WebGL 2 context and throws when the browser has none.
function probeWebgl(): WebglState {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return 'unavailable';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return 'pending';
}

export function Strands({
  colors = STRANDS_DEFAULTS.colors,
  count = STRANDS_DEFAULTS.count,
  speed = STRANDS_DEFAULTS.speed,
  amplitude = STRANDS_DEFAULTS.amplitude,
  waviness = STRANDS_DEFAULTS.waviness,
  thickness = STRANDS_DEFAULTS.thickness,
  glow = STRANDS_DEFAULTS.glow,
  taper = STRANDS_DEFAULTS.taper,
  spread = STRANDS_DEFAULTS.spread,
  hueShift = STRANDS_DEFAULTS.hueShift,
  intensity = STRANDS_DEFAULTS.intensity,
  saturation = STRANDS_DEFAULTS.saturation,
  opacity = STRANDS_DEFAULTS.opacity,
  scale = STRANDS_DEFAULTS.scale,
  glass = STRANDS_DEFAULTS.glass,
  refraction = STRANDS_DEFAULTS.refraction,
  dispersion = STRANDS_DEFAULTS.dispersion,
  glassSize = STRANDS_DEFAULTS.glassSize,
  reducedMotion = STRANDS_DEFAULTS.reducedMotion,
}: StrandsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Strands"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A WebGL 2 fragment shader draws <code>count {count}</code> glowing ribbons
              across a transparent canvas. Each ribbon is a sine pair at{' '}
              <code>speed {speed}</code>, <code>amplitude {amplitude}</code>, and{' '}
              <code>waviness {waviness}</code>, then glow <code>{glow}</code> and saturation{' '}
              <code>{saturation}</code> colour it. With <code>glass</code> a second pass
              refracts that scene through a sphere of size <code>{glassSize}</code>.
            </>
          }
          controls="Pause holds the time step and the render through the local paused prop. Replay remounts the upstream component, so time starts at zero."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className and style are not controls: the wrapper owns the stage. With WebGL 2 missing the frame shows the fallback paragraph and nothing mounts. Reduced motion mounts the sketch paused at speed 0, so it paints one still frame. The canvas draws every frame while running, so the play function samples its pixels without preserveDrawingBuffer; the reduced-motion story asserts the ready state instead, because the buffer clears after the one still frame shows. Colours are brand accent blue, accent yellow, paper, and ink. Upstream default was #FF4242, #7C3AED, #06B6D4, #EAB308."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl((state) => (state === 'unavailable' ? state : 'pending'));
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink strands__stage"
      stageTestId="strands-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-glass': glass ? 'true' : 'false',
      }}
    >
      <div className="strands__fill">
        <UpstreamStrands
          key={run}
          colors={colors}
          count={count}
          speed={reduce ? 0 : speed}
          amplitude={amplitude}
          waviness={waviness}
          thickness={thickness}
          glow={glow}
          taper={taper}
          spread={spread}
          hueShift={hueShift}
          intensity={intensity}
          saturation={saturation}
          opacity={opacity}
          scale={scale}
          glass={glass}
          refraction={refraction}
          dispersion={dispersion}
          glassSize={glassSize}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
        />
      </div>
      <p className="strands__caption">{HERO.kicker}</p>
    </ReactBitsFrame>
  );
}
