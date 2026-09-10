import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLiquidEther from '../../vendor/backgrounds/liquid-ether/LiquidEther';
import { LIQUID_ETHER_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './liquid-ether.css';

export type LiquidEtherProps = {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
  backgroundColor?: string;
  lightMode?: boolean;
  reducedMotion?: ReducedMotionMode;
};

// Probe once, before anything mounts. The upstream file creates a three.js
// renderer, which throws when the browser has no WebGL context.
function probeWebgl(): WebglState {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return 'unavailable';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return 'pending';
}

export function LiquidEther({
  mouseForce = LIQUID_ETHER_DEFAULTS.mouseForce,
  cursorSize = LIQUID_ETHER_DEFAULTS.cursorSize,
  isViscous = LIQUID_ETHER_DEFAULTS.isViscous,
  viscous = LIQUID_ETHER_DEFAULTS.viscous,
  iterationsViscous = LIQUID_ETHER_DEFAULTS.iterationsViscous,
  iterationsPoisson = LIQUID_ETHER_DEFAULTS.iterationsPoisson,
  dt = LIQUID_ETHER_DEFAULTS.dt,
  BFECC = LIQUID_ETHER_DEFAULTS.BFECC,
  resolution = LIQUID_ETHER_DEFAULTS.resolution,
  isBounce = LIQUID_ETHER_DEFAULTS.isBounce,
  colors = LIQUID_ETHER_DEFAULTS.colors,
  autoDemo = LIQUID_ETHER_DEFAULTS.autoDemo,
  autoSpeed = LIQUID_ETHER_DEFAULTS.autoSpeed,
  autoIntensity = LIQUID_ETHER_DEFAULTS.autoIntensity,
  takeoverDuration = LIQUID_ETHER_DEFAULTS.takeoverDuration,
  autoResumeDelay = LIQUID_ETHER_DEFAULTS.autoResumeDelay,
  autoRampDuration = LIQUID_ETHER_DEFAULTS.autoRampDuration,
  backgroundColor = LIQUID_ETHER_DEFAULTS.backgroundColor,
  lightMode = LIQUID_ETHER_DEFAULTS.lightMode,
  reducedMotion = LIQUID_ETHER_DEFAULTS.reducedMotion,
}: LiquidEtherProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Liquid Ether"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A fluid solver in three.js render targets: the pointer adds velocity with{' '}
              <code>mouseForce {mouseForce}</code> over <code>cursorSize {cursorSize}</code>{' '}
              pixels, the field advects and diffuses at <code>dt {dt}</code>, and a colour pass
              maps speed onto the <code>colors</code> palette. With <code>autoDemo</code> a
              driver moves the pointer by itself and hands over on the first real move.
            </>
          }
          controls="Pause stops the frame loop through the local paused prop. Replay remounts the upstream component, so the field starts empty."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The box is the stage; style and className are not controls. With WebGL missing the frame shows the fallback paragraph and nothing mounts. Reduced motion mounts the sketch paused, so it draws one still frame. The canvas draws every frame, so the play function samples its pixels without preserveDrawingBuffer."
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
      stageClassName="rb-frame__stage--ink liquid-ether__stage"
      stageTestId="liquid-ether-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <div className="liquid-ether__fill">
        <UpstreamLiquidEther
          key={run}
          mouseForce={mouseForce}
          cursorSize={cursorSize}
          isViscous={isViscous}
          viscous={viscous}
          iterationsViscous={iterationsViscous}
          iterationsPoisson={iterationsPoisson}
          dt={dt}
          BFECC={BFECC}
          resolution={resolution}
          isBounce={isBounce}
          colors={colors}
          autoDemo={autoDemo}
          autoSpeed={autoSpeed}
          autoIntensity={autoIntensity}
          takeoverDuration={takeoverDuration}
          autoResumeDelay={autoResumeDelay}
          autoRampDuration={autoRampDuration}
          backgroundColor={backgroundColor}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
        />
      </div>
      <p className="liquid-ether__caption">{HERO.kicker}</p>
    </ReactBitsFrame>
  );
}
