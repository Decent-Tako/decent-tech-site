import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFerrofluid from '../../vendor/backgrounds/ferrofluid/Ferrofluid';
import { FERROFLUID_DEFAULTS, type FlowDirection, REACT_BITS_SOURCE } from './source';

import './ferrofluid.css';

export type FerrofluidProps = {
  colors?: string[];
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  rimWidth?: number;
  sharpness?: number;
  shimmer?: number;
  glow?: number;
  flowDirection?: FlowDirection;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
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

const CARD = FEATURES[0];

export function Ferrofluid({
  colors = FERROFLUID_DEFAULTS.colors,
  speed = FERROFLUID_DEFAULTS.speed,
  scale = FERROFLUID_DEFAULTS.scale,
  turbulence = FERROFLUID_DEFAULTS.turbulence,
  fluidity = FERROFLUID_DEFAULTS.fluidity,
  rimWidth = FERROFLUID_DEFAULTS.rimWidth,
  sharpness = FERROFLUID_DEFAULTS.sharpness,
  shimmer = FERROFLUID_DEFAULTS.shimmer,
  glow = FERROFLUID_DEFAULTS.glow,
  flowDirection = FERROFLUID_DEFAULTS.flowDirection,
  opacity = FERROFLUID_DEFAULTS.opacity,
  mouseInteraction = FERROFLUID_DEFAULTS.mouseInteraction,
  mouseStrength = FERROFLUID_DEFAULTS.mouseStrength,
  mouseRadius = FERROFLUID_DEFAULTS.mouseRadius,
  mouseDampening = FERROFLUID_DEFAULTS.mouseDampening,
  reducedMotion = FERROFLUID_DEFAULTS.reducedMotion,
}: FerrofluidProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Ferrofluid"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl ferrofluid field. Time, flow, and a pointer glow warp a colour
              palette into rims and peaks.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. className, dpr, and mixBlendMode stay with the frame. Colour defaults are brand tokens: accent-blue #0035B1, accent-yellow #DEF54F, paper #FFFFFF (upstream #ffffff). The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="ferrofluid-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="ferrofluid-fill">
        <UpstreamFerrofluid
          key={run}
          colors={colors}
          speed={motionSpeed}
          scale={scale}
          turbulence={turbulence}
          fluidity={fluidity}
          rimWidth={rimWidth}
          sharpness={sharpness}
          shimmer={shimmer}
          glow={glow}
          flowDirection={flowDirection}
          opacity={opacity}
          mouseInteraction={mouseInteraction}
          mouseStrength={mouseStrength}
          mouseRadius={mouseRadius}
          mouseDampening={mouseDampening}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="ferrofluid__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
