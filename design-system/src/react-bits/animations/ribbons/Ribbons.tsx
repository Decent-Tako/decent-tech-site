import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamRibbons from '../../vendor/animations/ribbons/Ribbons';
import { REACT_BITS_SOURCE, RIBBONS_DEFAULTS } from './source';

import './ribbons.css';

export type RibbonsProps = {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
  backgroundColor?: number[];
  reducedMotion?: ReducedMotionMode;
};

// Probe once, before anything mounts. The ogl Renderer throws when the
// browser has no WebGL context.
function probeWebgl(): WebglState {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return 'unavailable';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return 'pending';
}

export function Ribbons({
  colors = RIBBONS_DEFAULTS.colors,
  baseSpring = RIBBONS_DEFAULTS.baseSpring,
  baseFriction = RIBBONS_DEFAULTS.baseFriction,
  baseThickness = RIBBONS_DEFAULTS.baseThickness,
  offsetFactor = RIBBONS_DEFAULTS.offsetFactor,
  maxAge = RIBBONS_DEFAULTS.maxAge,
  pointCount = RIBBONS_DEFAULTS.pointCount,
  speedMultiplier = RIBBONS_DEFAULTS.speedMultiplier,
  enableFade = RIBBONS_DEFAULTS.enableFade,
  enableShaderEffect = RIBBONS_DEFAULTS.enableShaderEffect,
  effectAmplitude = RIBBONS_DEFAULTS.effectAmplitude,
  backgroundColor = RIBBONS_DEFAULTS.backgroundColor,
  reducedMotion = RIBBONS_DEFAULTS.reducedMotion,
}: RibbonsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Ribbons"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              One ogl <code>Polyline</code> per entry in <code>colors</code>, each{' '}
              <code>pointCount {pointCount}</code> points long and{' '}
              <code>baseThickness {baseThickness}</code> pixels wide. Every frame the head
              springs to the pointer with <code>baseSpring {baseSpring}</code> and{' '}
              <code>baseFriction {baseFriction}</code>, and each point lerps to the one before
              it over <code>maxAge {maxAge}</code> ms. <code>enableFade</code> thins the tail
              and <code>enableShaderEffect</code> adds a sine wobble of{' '}
              <code>effectAmplitude {effectAmplitude}</code>.
            </>
          }
          controls="Pause holds the spring step and the render through the local paused prop. Replay remounts the upstream component, so the ribbons gather at the centre again."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="Pointer listeners live on the upstream container. With WebGL missing the frame shows the fallback paragraph and nothing mounts. Reduced motion mounts the sketch paused, so it draws the ribbons at rest. The canvas draws every frame while running, so the play function samples its pixels on a 32 by 32 grid without preserveDrawingBuffer; the reduced-motion story asserts the ready state instead, because the buffer clears after the one still frame shows."
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
      stageClassName="rb-frame__stage--ink ribbons__stage"
      stageTestId="ribbons-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <div className="ribbons__fill">
        <UpstreamRibbons
          key={run}
          colors={colors}
          baseSpring={baseSpring}
          baseFriction={baseFriction}
          baseThickness={baseThickness}
          offsetFactor={offsetFactor}
          maxAge={maxAge}
          pointCount={pointCount}
          speedMultiplier={speedMultiplier}
          enableFade={enableFade}
          enableShaderEffect={enableShaderEffect}
          effectAmplitude={effectAmplitude}
          backgroundColor={backgroundColor}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
        />
      </div>
      <p className="ribbons__caption">{HERO.kicker}</p>
    </ReactBitsFrame>
  );
}
