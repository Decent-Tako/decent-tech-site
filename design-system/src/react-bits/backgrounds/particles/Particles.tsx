import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamParticles from '../../vendor/backgrounds/particles/Particles';
import { PARTICLES_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './particles.css';

export type ParticlesProps = {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
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

const CARD = FEATURES[2];

export function Particles({
  particleCount = PARTICLES_DEFAULTS.particleCount,
  particleSpread = PARTICLES_DEFAULTS.particleSpread,
  speed = PARTICLES_DEFAULTS.speed,
  particleColors = PARTICLES_DEFAULTS.particleColors,
  moveParticlesOnHover = PARTICLES_DEFAULTS.moveParticlesOnHover,
  particleHoverFactor = PARTICLES_DEFAULTS.particleHoverFactor,
  alphaParticles = PARTICLES_DEFAULTS.alphaParticles,
  particleBaseSize = PARTICLES_DEFAULTS.particleBaseSize,
  sizeRandomness = PARTICLES_DEFAULTS.sizeRandomness,
  cameraDistance = PARTICLES_DEFAULTS.cameraDistance,
  disableRotation = PARTICLES_DEFAULTS.disableRotation,
  pixelRatio = PARTICLES_DEFAULTS.pixelRatio,
  reducedMotion = PARTICLES_DEFAULTS.reducedMotion,
}: ParticlesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Particles"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl point cloud. Each vertex drifts with a sine of time and a
              random seed. Optional hover shifts the mesh.
            </>
          }
          controls="Pause holds uTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onReady, and onError are not controls. Colour defaults are brand tokens: #FFFFFF, #0035B1, #DEF54F (upstream all #ffffff). The caption is the Tools card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="particles-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-hover': moveParticlesOnHover ? 'true' : 'false',
      }}
    >
      <div className="particles-fill">
        <UpstreamParticles
          key={run}
          particleCount={particleCount}
          particleSpread={particleSpread}
          speed={motionSpeed}
          particleColors={particleColors}
          moveParticlesOnHover={moveParticlesOnHover}
          particleHoverFactor={particleHoverFactor}
          alphaParticles={alphaParticles}
          particleBaseSize={particleBaseSize}
          sizeRandomness={sizeRandomness}
          cameraDistance={cameraDistance}
          disableRotation={disableRotation}
          pixelRatio={pixelRatio}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="particles__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
