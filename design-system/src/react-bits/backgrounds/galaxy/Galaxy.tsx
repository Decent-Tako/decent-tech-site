import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
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
  twinkleIntensity?: number;
  rotationSpeed?: number;
  repulsionStrength?: number;
  autoCenterRepulsion?: number;
  transparent?: boolean;
  lightMode?: boolean;
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
  twinkleIntensity = GALAXY_DEFAULTS.twinkleIntensity,
  rotationSpeed = GALAXY_DEFAULTS.rotationSpeed,
  repulsionStrength = GALAXY_DEFAULTS.repulsionStrength,
  autoCenterRepulsion = GALAXY_DEFAULTS.autoCenterRepulsion,
  transparent = GALAXY_DEFAULTS.transparent,
  lightMode = GALAXY_DEFAULTS.lightMode,
  reducedMotion = GALAXY_DEFAULTS.reducedMotion,
}: GalaxyProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Galaxy"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl star field. Four layers of hashed stars twinkle and rotate.
              The pointer repels the field.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. There is no colour prop: hueShift and saturation tint the hashed stars. The caption is the Tools card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="galaxy-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="galaxy-fill">
        <UpstreamGalaxy
          key={run}
          focal={focal}
          rotation={rotation}
          starSpeed={starSpeed}
          density={density}
          hueShift={hueShift}
          disableAnimation={disableAnimation || reduce}
          speed={motionSpeed}
          mouseInteraction={mouseInteraction}
          glowIntensity={glowIntensity}
          saturation={saturation}
          mouseRepulsion={mouseRepulsion}
          twinkleIntensity={twinkleIntensity}
          rotationSpeed={reduce ? 0 : rotationSpeed}
          repulsionStrength={repulsionStrength}
          autoCenterRepulsion={autoCenterRepulsion}
          transparent={transparent}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="galaxy__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
