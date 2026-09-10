import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGhostFibers from '../../vendor/backgrounds/ghost-fibers/GhostFibers';
import { GHOST_FIBERS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './ghost-fibers.css';

export type GhostFibersProps = {
  lineColor?: string;
  glowColor?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  rotationSpeed?: number;
  layers?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  layerSpeed?: number;
  twist?: number;
  twistFrequency?: number;
  twistSpeed?: number;
  lineFrequency?: number;
  lineSpacing?: number;
  lineSharpness?: number;
  glowFalloff?: number;
  glowIntensity?: number;
  brightness?: number;
  blueBoost?: number;
  vignette?: number;
  grain?: number;
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

const CARD = FEATURES[3];

export function GhostFibers({
  lineColor = GHOST_FIBERS_DEFAULTS.lineColor,
  glowColor = GHOST_FIBERS_DEFAULTS.glowColor,
  speed = GHOST_FIBERS_DEFAULTS.speed,
  scale = GHOST_FIBERS_DEFAULTS.scale,
  rotation = GHOST_FIBERS_DEFAULTS.rotation,
  rotationSpeed = GHOST_FIBERS_DEFAULTS.rotationSpeed,
  layers = GHOST_FIBERS_DEFAULTS.layers,
  waveAmplitude = GHOST_FIBERS_DEFAULTS.waveAmplitude,
  waveFrequency = GHOST_FIBERS_DEFAULTS.waveFrequency,
  waveSpeed = GHOST_FIBERS_DEFAULTS.waveSpeed,
  layerSpeed = GHOST_FIBERS_DEFAULTS.layerSpeed,
  twist = GHOST_FIBERS_DEFAULTS.twist,
  twistFrequency = GHOST_FIBERS_DEFAULTS.twistFrequency,
  twistSpeed = GHOST_FIBERS_DEFAULTS.twistSpeed,
  lineFrequency = GHOST_FIBERS_DEFAULTS.lineFrequency,
  lineSpacing = GHOST_FIBERS_DEFAULTS.lineSpacing,
  lineSharpness = GHOST_FIBERS_DEFAULTS.lineSharpness,
  glowFalloff = GHOST_FIBERS_DEFAULTS.glowFalloff,
  glowIntensity = GHOST_FIBERS_DEFAULTS.glowIntensity,
  brightness = GHOST_FIBERS_DEFAULTS.brightness,
  blueBoost = GHOST_FIBERS_DEFAULTS.blueBoost,
  vignette = GHOST_FIBERS_DEFAULTS.vignette,
  grain = GHOST_FIBERS_DEFAULTS.grain,
  lightMode = GHOST_FIBERS_DEFAULTS.lightMode,
  reducedMotion = GHOST_FIBERS_DEFAULTS.reducedMotion,
}: GhostFibersProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Ghost Fibers"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 polar fiber field. Layered sine lines twist and glow
              around the centre.
            </>
          }
          controls="Pause holds the fiber clock. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, className, dpr, and fps are not controls. Colour defaults are brand tokens: lineColor accent-blue #0035B1 (upstream #140E35), glowColor accent-yellow #DEF54F (upstream #3437A0). The caption is the Challenge week card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="ghost-fibers-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="ghost-fibers-fill">
        <UpstreamGhostFibers
          key={run}
          lineColor={lineColor}
          glowColor={glowColor}
          speed={motionSpeed}
          scale={scale}
          rotation={rotation}
          rotationSpeed={reduce ? 0 : rotationSpeed}
          layers={layers}
          waveAmplitude={waveAmplitude}
          waveFrequency={waveFrequency}
          waveSpeed={waveSpeed}
          layerSpeed={layerSpeed}
          twist={twist}
          twistFrequency={twistFrequency}
          twistSpeed={twistSpeed}
          lineFrequency={lineFrequency}
          lineSpacing={lineSpacing}
          lineSharpness={lineSharpness}
          glowFalloff={glowFalloff}
          glowIntensity={glowIntensity}
          brightness={brightness}
          blueBoost={blueBoost}
          vignette={vignette}
          grain={grain}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="ghost-fibers__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
