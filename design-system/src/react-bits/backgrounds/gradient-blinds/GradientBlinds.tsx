import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGradientBlinds from '../../vendor/backgrounds/gradient-blinds/GradientBlinds';
import {
  GRADIENT_BLINDS_DEFAULTS,
  REACT_BITS_SOURCE,
  type ShineDirection,
} from './source';

import './gradient-blinds.css';

export type GradientBlindsProps = {
  gradientColors?: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  mouseDampening?: number;
  mirrorGradient?: boolean;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  distortAmount?: number;
  shineDirection?: ShineDirection;
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

const CARD = FEATURES[4];

export function GradientBlinds({
  gradientColors = GRADIENT_BLINDS_DEFAULTS.gradientColors,
  angle = GRADIENT_BLINDS_DEFAULTS.angle,
  noise = GRADIENT_BLINDS_DEFAULTS.noise,
  blindCount = GRADIENT_BLINDS_DEFAULTS.blindCount,
  blindMinWidth = GRADIENT_BLINDS_DEFAULTS.blindMinWidth,
  mouseDampening = GRADIENT_BLINDS_DEFAULTS.mouseDampening,
  mirrorGradient = GRADIENT_BLINDS_DEFAULTS.mirrorGradient,
  spotlightRadius = GRADIENT_BLINDS_DEFAULTS.spotlightRadius,
  spotlightSoftness = GRADIENT_BLINDS_DEFAULTS.spotlightSoftness,
  spotlightOpacity = GRADIENT_BLINDS_DEFAULTS.spotlightOpacity,
  distortAmount = GRADIENT_BLINDS_DEFAULTS.distortAmount,
  shineDirection = GRADIENT_BLINDS_DEFAULTS.shineDirection,
  lightMode = GRADIENT_BLINDS_DEFAULTS.lightMode,
  reducedMotion = GRADIENT_BLINDS_DEFAULTS.reducedMotion,
}: GradientBlindsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Gradient Blinds"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl striped gradient. A pointer spotlight reveals the blinds.
              Noise and a shine direction travel the stripes.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion holds the blinds."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, className, dpr, and mixBlendMode are not controls. Colour defaults are brand tokens: accent-blue #0035B1 and accent-yellow #DEF54F (upstream #FF9FFC and #5227FF). The caption is the Street card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="gradient-blinds-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': reduce ? '0' : '1',
      }}
    >
      <div className="gradient-blinds-fill">
        <UpstreamGradientBlinds
          key={run}
          gradientColors={gradientColors}
          angle={angle}
          noise={noise}
          blindCount={blindCount}
          blindMinWidth={blindMinWidth}
          mouseDampening={mouseDampening}
          mirrorGradient={mirrorGradient}
          spotlightRadius={spotlightRadius}
          spotlightSoftness={spotlightSoftness}
          spotlightOpacity={spotlightOpacity}
          distortAmount={distortAmount}
          shineDirection={shineDirection}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="gradient-blinds__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
