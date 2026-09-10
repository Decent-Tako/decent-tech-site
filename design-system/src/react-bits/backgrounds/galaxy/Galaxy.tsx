import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGalaxy from '../../vendor/backgrounds/galaxy/Galaxy';
import { GALAXY_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './galaxy.css';

export type GalaxyProps = {
  focal?: [number, number];
  rotation?: [number, number];
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  disableAnimation?: boolean;
  speed?: number;
  mouseInteraction?: boolean;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  autoCenterRepulsion?: number;
  transparent?: boolean;
  lightMode?: boolean;
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

export function Galaxy({
  focal = GALAXY_DEFAULTS.focal,
  rotation = GALAXY_DEFAULTS.rotation,
  starSpeed = GALAXY_DEFAULTS.starSpeed,
  density = GALAXY_DEFAULTS.density,
  hueShift = GALAXY_DEFAULTS.hueShift,
  disableAnimation = GALAXY_DEFAULTS.disableAnimation,
  speed = GALAXY_DEFAULTS.speed,
  mouseInteraction = GALAXY_DEFAULTS.mouseInteraction,
  glowIntensity = GALAXY_DEFAULTS.glowIntensity,
  saturation = GALAXY_DEFAULTS.saturation,
  mouseRepulsion = GALAXY_DEFAULTS.mouseRepulsion,
  repulsionStrength = GALAXY_DEFAULTS.repulsionStrength,
  twinkleIntensity = GALAXY_DEFAULTS.twinkleIntensity,
  rotationSpeed = GALAXY_DEFAULTS.rotationSpeed,
  autoCenterRepulsion = GALAXY_DEFAULTS.autoCenterRepulsion,
  transparent = GALAXY_DEFAULTS.transparent,
  lightMode = GALAXY_DEFAULTS.lightMode,
  reducedMotion = GALAXY_DEFAULTS.reducedMotion,
}: GalaxyProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Galaxy"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              One fragment shader hashes four layers of stars around <code>focal</code>, scaled
              by <code>density {density}</code>, tinted by <code>hueShift {hueShift}</code> and{' '}
              <code>saturation {saturation}</code>, and drifted by{' '}
              <code>starSpeed {starSpeed}</code> and <code>rotationSpeed {rotationSpeed}</code>.
              With <code>mouseInteraction</code> the pointer pulls the field and with{' '}
              <code>mouseRepulsion</code> it pushes the stars away at{' '}
              <code>repulsionStrength {repulsionStrength}</code>.
            </>
          }
          controls="Pause skips the render through the local paused prop. Replay remounts the upstream component, so time starts at zero."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The stars have no colour prop; the stage behind the transparent canvas is brand ink. With WebGL missing the frame shows the fallback paragraph and nothing mounts. Reduced motion mounts the sketch paused, so it draws one still frame. The canvas draws every frame, so the play function samples its pixels without preserveDrawingBuffer."
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
      stageClassName="rb-frame__stage--ink galaxy__stage"
      stageTestId="galaxy-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <div className="galaxy__fill">
        <UpstreamGalaxy
          key={run}
          focal={focal}
          rotation={rotation}
          starSpeed={starSpeed}
          density={density}
          hueShift={hueShift}
          disableAnimation={disableAnimation}
          speed={speed}
          mouseInteraction={mouseInteraction}
          glowIntensity={glowIntensity}
          saturation={saturation}
          mouseRepulsion={mouseRepulsion}
          repulsionStrength={repulsionStrength}
          twinkleIntensity={twinkleIntensity}
          rotationSpeed={rotationSpeed}
          autoCenterRepulsion={autoCenterRepulsion}
          transparent={transparent}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
        />
      </div>
      <p className="galaxy__caption">{HERO.kicker}</p>
    </ReactBitsFrame>
  );
}
