import { useState } from 'react';

import { DESTINATIONS, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamWebThreads from '../../vendor/backgrounds/web-threads/WebThreads';
import {
  REACT_BITS_SOURCE,
  WEB_THREADS_DEFAULTS,
  type WebThreadsFanMode,
} from './source';

import './web-threads.css';

export type WebThreadsProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  threadCount?: number;
  frequency?: number;
  spread?: number;
  taper?: number;
  position?: number;
  fanMode?: WebThreadsFanMode;
  glow?: number;
  falloff?: number;
  thickness?: number;
  brightness?: number;
  opacity?: number;
  mirror?: boolean;
  shimmer?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  backgroundColor?: string;
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

const CARD = DESTINATIONS[1];

export function WebThreads({
  color1 = WEB_THREADS_DEFAULTS.color1,
  color2 = WEB_THREADS_DEFAULTS.color2,
  color3 = WEB_THREADS_DEFAULTS.color3,
  speed = WEB_THREADS_DEFAULTS.speed,
  threadCount = WEB_THREADS_DEFAULTS.threadCount,
  frequency = WEB_THREADS_DEFAULTS.frequency,
  spread = WEB_THREADS_DEFAULTS.spread,
  taper = WEB_THREADS_DEFAULTS.taper,
  position = WEB_THREADS_DEFAULTS.position,
  fanMode = WEB_THREADS_DEFAULTS.fanMode,
  glow = WEB_THREADS_DEFAULTS.glow,
  falloff = WEB_THREADS_DEFAULTS.falloff,
  thickness = WEB_THREADS_DEFAULTS.thickness,
  brightness = WEB_THREADS_DEFAULTS.brightness,
  opacity = WEB_THREADS_DEFAULTS.opacity,
  mirror = WEB_THREADS_DEFAULTS.mirror,
  shimmer = WEB_THREADS_DEFAULTS.shimmer,
  grain = WEB_THREADS_DEFAULTS.grain,
  grainIntensity = WEB_THREADS_DEFAULTS.grainIntensity,
  mouseInteraction = WEB_THREADS_DEFAULTS.mouseInteraction,
  mouseStrength = WEB_THREADS_DEFAULTS.mouseStrength,
  backgroundColor = WEB_THREADS_DEFAULTS.backgroundColor,
  lightMode = WEB_THREADS_DEFAULTS.lightMode,
  reducedMotion = WEB_THREADS_DEFAULTS.reducedMotion,
}: WebThreadsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Web Threads"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl fan of {threadCount} sine threads from {fanMode}. Speed {speed}{' '}
              and spread {spread} shape the web. The pointer pinches the fan when
              mouse interaction is on.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. Colour defaults are brand tokens: color1 accent-blue #0035B1 (upstream #5227FF), color2 accent-yellow #DEF54F (upstream #FF9FFC), color3 paper #FFFFFF, backgroundColor paper #FFFFFF. The caption is the Learn destination from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas. WebGL 2 is required."
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
      stageTestId="web-threads-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-fan': fanMode,
      }}
    >
      <div className="web-threads-fill">
        <UpstreamWebThreads
          key={run}
          color1={color1}
          color2={color2}
          color3={color3}
          speed={motionSpeed}
          threadCount={threadCount}
          frequency={frequency}
          spread={spread}
          taper={taper}
          position={position}
          fanMode={fanMode}
          glow={glow}
          falloff={falloff}
          thickness={thickness}
          brightness={brightness}
          opacity={opacity}
          mirror={mirror}
          shimmer={shimmer}
          grain={grain}
          grainIntensity={grainIntensity}
          mouseInteraction={mouseInteraction}
          mouseStrength={mouseStrength}
          backgroundColor={backgroundColor}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="web-threads__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
