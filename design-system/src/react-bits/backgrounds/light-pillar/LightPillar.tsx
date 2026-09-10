import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLightPillar from '../../vendor/backgrounds/light-pillar/LightPillar';
import { LIGHT_PILLAR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './light-pillar.css';

export type LightPillarProps = {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: typeof LIGHT_PILLAR_DEFAULTS.mixBlendMode;
  pillarRotation?: number;
  quality?: 'low' | 'medium' | 'high';
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

export function LightPillar({
  topColor = LIGHT_PILLAR_DEFAULTS.topColor,
  bottomColor = LIGHT_PILLAR_DEFAULTS.bottomColor,
  intensity = LIGHT_PILLAR_DEFAULTS.intensity,
  rotationSpeed = LIGHT_PILLAR_DEFAULTS.rotationSpeed,
  interactive = LIGHT_PILLAR_DEFAULTS.interactive,
  glowAmount = LIGHT_PILLAR_DEFAULTS.glowAmount,
  pillarWidth = LIGHT_PILLAR_DEFAULTS.pillarWidth,
  pillarHeight = LIGHT_PILLAR_DEFAULTS.pillarHeight,
  noiseIntensity = LIGHT_PILLAR_DEFAULTS.noiseIntensity,
  mixBlendMode = LIGHT_PILLAR_DEFAULTS.mixBlendMode,
  pillarRotation = LIGHT_PILLAR_DEFAULTS.pillarRotation,
  quality = LIGHT_PILLAR_DEFAULTS.quality,
  lightMode = LIGHT_PILLAR_DEFAULTS.lightMode,
  reducedMotion = LIGHT_PILLAR_DEFAULTS.reducedMotion,
}: LightPillarProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : rotationSpeed;

  return (
    <ReactBitsFrame
      title="Light Pillar"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js shader raymarches a noise pillar. Time rotates the
              field. Pointer yaw is optional.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets rotationSpeed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onReady, and onError are not controls. Colour defaults are brand tokens: topColor accent-blue #0035B1 (upstream #5227FF), bottomColor accent-yellow #DEF54F (upstream #FF9FFC). The caption is the Tools card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="light-pillar-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="light-pillar-fill">
        <UpstreamLightPillar
          key={run}
          topColor={topColor}
          bottomColor={bottomColor}
          intensity={intensity}
          rotationSpeed={motionSpeed}
          interactive={interactive}
          glowAmount={glowAmount}
          pillarWidth={pillarWidth}
          pillarHeight={pillarHeight}
          noiseIntensity={noiseIntensity}
          mixBlendMode={mixBlendMode}
          pillarRotation={pillarRotation}
          quality={quality}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="light-pillar__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
