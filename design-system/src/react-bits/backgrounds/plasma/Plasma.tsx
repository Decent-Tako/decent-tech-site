import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPlasma from '../../vendor/backgrounds/plasma/Plasma';
import { PLASMA_DEFAULTS, REACT_BITS_SOURCE, type PlasmaDirection } from './source';

import './plasma.css';

export type PlasmaProps = {
  color?: string;
  speed?: number;
  direction?: PlasmaDirection;
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
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Plasma"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 raymarch. A tube field bends with time. Pointer
              offset warps the march origin.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour default is brand accent-blue #0035B1 (upstream #ffffff). The caption is the Start card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="plasma-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-direction': direction,
      }}
    >
      <div className="plasma-fill">
        <UpstreamPlasma
          key={run}
          color={color}
          speed={motionSpeed}
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
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="plasma__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
