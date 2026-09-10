import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import { Plasma as UpstreamPlasma } from '../../vendor/backgrounds/plasma/Plasma';
import { PLASMA_DEFAULTS, type PLASMA_DIRECTIONS, REACT_BITS_SOURCE } from './source';

import './plasma.css';

export type PlasmaProps = {
  color?: string;
  speed?: number;
  direction?: (typeof PLASMA_DIRECTIONS)[number];
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  renderScale?: number;
  maxDpr?: number;
  targetFps?: number;
  iterations?: number;
  lightMode?: boolean;
  reducedMotion?: ReducedMotionMode;
};

// Probe once, before anything mounts. The upstream file asks ogl for a
// WebGL 2 context and returns early without one, so nothing would draw.
function probeWebgl(): WebglState {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return 'unavailable';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return 'pending';
}

export function Plasma({
  color = PLASMA_DEFAULTS.color,
  speed = PLASMA_DEFAULTS.speed,
  direction = PLASMA_DEFAULTS.direction,
  scale = PLASMA_DEFAULTS.scale,
  opacity = PLASMA_DEFAULTS.opacity,
  mouseInteractive = PLASMA_DEFAULTS.mouseInteractive,
  renderScale = PLASMA_DEFAULTS.renderScale,
  maxDpr = PLASMA_DEFAULTS.maxDpr,
  targetFps = PLASMA_DEFAULTS.targetFps,
  iterations = PLASMA_DEFAULTS.iterations,
  lightMode = PLASMA_DEFAULTS.lightMode,
  reducedMotion = PLASMA_DEFAULTS.reducedMotion,
}: PlasmaProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Plasma"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              One WebGL 2 fragment shader raymarches <code>iterations {iterations}</code> steps
              through a twisted tube and tints the result with <code>color</code>. Time runs at{' '}
              <code>speed {speed}</code> in direction <code>{direction}</code>; the buffer is{' '}
              <code>renderScale {renderScale}</code> of the box, capped at{' '}
              <code>maxDpr {maxDpr}</code>, and the loop targets{' '}
              <code>targetFps {targetFps}</code>. With <code>mouseInteractive</code> the pointer
              bends the field.
            </>
          }
          controls="Pause stops the loop through the local paused prop and Resume restarts it. Replay remounts the upstream component, so time starts at zero."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="WebGL 2 only, as upstream. With it missing the frame shows the fallback paragraph and nothing mounts. Reduced motion mounts the sketch paused, so it paints one static frame; the upstream file also reads the operating system setting once at mount and stays still when that is on. The canvas draws every frame, so the play function samples its pixels without preserveDrawingBuffer."
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
      stageClassName="rb-frame__stage--ink plasma__stage"
      stageTestId="plasma-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <div className="plasma__fill">
        <UpstreamPlasma
          key={run}
          color={color}
          speed={speed}
          direction={direction}
          scale={scale}
          opacity={opacity}
          mouseInteractive={mouseInteractive}
          renderScale={renderScale}
          maxDpr={maxDpr}
          targetFps={targetFps}
          iterations={iterations}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
        />
      </div>
      <p className="plasma__caption">{HERO.kicker}</p>
    </ReactBitsFrame>
  );
}
