import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPrismaticBurst from '../../vendor/backgrounds/prismatic-burst/PrismaticBurst';
import {
  PRISMATIC_BURST_DEFAULTS,
  REACT_BITS_SOURCE,
  type PrismaticBurstAnimationType,
  type PrismaticBurstBlendMode,
} from './source';

import './prismatic-burst.css';

export type PrismaticBurstProps = {
  intensity?: number;
  speed?: number;
  animationType?: PrismaticBurstAnimationType;
  colors?: string[];
  distort?: number;
  offset?: { x?: number; y?: number };
  hoverDampness?: number;
  rayCount?: number;
  mixBlendMode?: PrismaticBurstBlendMode;
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

const CARD = FEATURES[1];

export function PrismaticBurst({
  intensity = PRISMATIC_BURST_DEFAULTS.intensity,
  speed = PRISMATIC_BURST_DEFAULTS.speed,
  animationType = PRISMATIC_BURST_DEFAULTS.animationType,
  colors = PRISMATIC_BURST_DEFAULTS.colors,
  distort = PRISMATIC_BURST_DEFAULTS.distort,
  offset = PRISMATIC_BURST_DEFAULTS.offset,
  hoverDampness = PRISMATIC_BURST_DEFAULTS.hoverDampness,
  rayCount = PRISMATIC_BURST_DEFAULTS.rayCount,
  mixBlendMode = PRISMATIC_BURST_DEFAULTS.mixBlendMode,
  lightMode = PRISMATIC_BURST_DEFAULTS.lightMode,
  reducedMotion = PRISMATIC_BURST_DEFAULTS.reducedMotion,
}: PrismaticBurstProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Prismatic Burst"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A WebGL 2 burst of rays on ogl. Intensity {intensity} and speed{' '}
              {speed} drive {animationType}. Optional colours tint the ramp.
            </>
          }
          controls="Pause holds uTime after a short warm-up through the upstream paused prop. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour default is brand accent-blue, accent-yellow, and paper (upstream leaves colors unset). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="prismatic-burst-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-animation': animationType,
      }}
    >
      <div className="prismatic-burst-fill">
        <UpstreamPrismaticBurst
          key={run}
          intensity={intensity}
          speed={motionSpeed}
          animationType={animationType}
          colors={colors}
          distort={distort}
          offset={offset}
          hoverDampness={hoverDampness}
          rayCount={rayCount}
          mixBlendMode={mixBlendMode}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="prismatic-burst__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
