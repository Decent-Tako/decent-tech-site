import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLightfall from '../../vendor/backgrounds/lightfall/Lightfall';
import { LIGHTFALL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './lightfall.css';

export type LightfallProps = {
  colors?: string[];
  backgroundColor?: string;
  speed?: number;
  streakCount?: number;
  streakWidth?: number;
  streakLength?: number;
  glow?: number;
  density?: number;
  twinkle?: number;
  zoom?: number;
  backgroundGlow?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
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

export function Lightfall({
  colors = LIGHTFALL_DEFAULTS.colors,
  backgroundColor = LIGHTFALL_DEFAULTS.backgroundColor,
  speed = LIGHTFALL_DEFAULTS.speed,
  streakCount = LIGHTFALL_DEFAULTS.streakCount,
  streakWidth = LIGHTFALL_DEFAULTS.streakWidth,
  streakLength = LIGHTFALL_DEFAULTS.streakLength,
  glow = LIGHTFALL_DEFAULTS.glow,
  density = LIGHTFALL_DEFAULTS.density,
  twinkle = LIGHTFALL_DEFAULTS.twinkle,
  zoom = LIGHTFALL_DEFAULTS.zoom,
  backgroundGlow = LIGHTFALL_DEFAULTS.backgroundGlow,
  opacity = LIGHTFALL_DEFAULTS.opacity,
  mouseInteraction = LIGHTFALL_DEFAULTS.mouseInteraction,
  mouseStrength = LIGHTFALL_DEFAULTS.mouseStrength,
  mouseRadius = LIGHTFALL_DEFAULTS.mouseRadius,
  mouseDampening = LIGHTFALL_DEFAULTS.mouseDampening,
  lightMode = LIGHTFALL_DEFAULTS.lightMode,
  reducedMotion = LIGHTFALL_DEFAULTS.reducedMotion,
}: LightfallProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Lightfall"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl full-screen triangle. A raymarch loop draws falling
              streaks from the colour list. The pointer adds a local glow.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, dpr, mixBlendMode, paused, onReady, and onError are not controls. Colour defaults are brand tokens: #0035B1, #DEF54F, #FFFFFF (upstream #A6C8FF, #5227FF, #FF9FFC). backgroundColor is ink #212121 (upstream #0A29FF). The caption is the Tools card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="lightfall-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="lightfall-fill">
        <UpstreamLightfall
          key={run}
          colors={colors}
          backgroundColor={backgroundColor}
          speed={motionSpeed}
          streakCount={streakCount}
          streakWidth={streakWidth}
          streakLength={streakLength}
          glow={glow}
          density={density}
          twinkle={twinkle}
          zoom={zoom}
          backgroundGlow={backgroundGlow}
          opacity={opacity}
          mouseInteraction={mouseInteraction}
          mouseStrength={mouseStrength}
          mouseRadius={mouseRadius}
          mouseDampening={mouseDampening}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="lightfall__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
