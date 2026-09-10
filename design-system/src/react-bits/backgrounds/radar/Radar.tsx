import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamRadar from '../../vendor/backgrounds/radar/Radar';
import { RADAR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './radar.css';

export type RadarProps = {
  speed?: number;
  scale?: number;
  ringCount?: number;
  spokeCount?: number;
  ringThickness?: number;
  spokeThickness?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  sweepLobes?: number;
  color?: string;
  backgroundColor?: string;
  falloff?: number;
  brightness?: number;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
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

export function Radar({
  speed = RADAR_DEFAULTS.speed,
  scale = RADAR_DEFAULTS.scale,
  ringCount = RADAR_DEFAULTS.ringCount,
  spokeCount = RADAR_DEFAULTS.spokeCount,
  ringThickness = RADAR_DEFAULTS.ringThickness,
  spokeThickness = RADAR_DEFAULTS.spokeThickness,
  sweepSpeed = RADAR_DEFAULTS.sweepSpeed,
  sweepWidth = RADAR_DEFAULTS.sweepWidth,
  sweepLobes = RADAR_DEFAULTS.sweepLobes,
  color = RADAR_DEFAULTS.color,
  backgroundColor = RADAR_DEFAULTS.backgroundColor,
  falloff = RADAR_DEFAULTS.falloff,
  brightness = RADAR_DEFAULTS.brightness,
  enableMouseInteraction = RADAR_DEFAULTS.enableMouseInteraction,
  mouseInfluence = RADAR_DEFAULTS.mouseInfluence,
  lightMode = RADAR_DEFAULTS.lightMode,
  reducedMotion = RADAR_DEFAULTS.reducedMotion,
}: RadarProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;
  const motionSweep = reduce ? 0 : sweepSpeed;

  return (
    <ReactBitsFrame
      title="Radar"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl radar of {ringCount} rings and {spokeCount} spokes. A
              sweep at speed {sweepSpeed} lights the disc. The pointer can
              warp the field.
            </>
          }
          controls="Pause holds uTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed and sweepSpeed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour default is brand accent-blue #0035B1 (upstream #9f29ff). backgroundColor is brand ink #212121 (upstream #000000). The caption is the Tools card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="radar-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-mouse': enableMouseInteraction ? 'true' : 'false',
      }}
    >
      <div className="radar-fill">
        <UpstreamRadar
          key={run}
          speed={motionSpeed}
          scale={scale}
          ringCount={ringCount}
          spokeCount={spokeCount}
          ringThickness={ringThickness}
          spokeThickness={spokeThickness}
          sweepSpeed={motionSweep}
          sweepWidth={sweepWidth}
          sweepLobes={sweepLobes}
          color={color}
          backgroundColor={backgroundColor}
          falloff={falloff}
          brightness={brightness}
          enableMouseInteraction={enableMouseInteraction}
          mouseInfluence={mouseInfluence}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="radar__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
