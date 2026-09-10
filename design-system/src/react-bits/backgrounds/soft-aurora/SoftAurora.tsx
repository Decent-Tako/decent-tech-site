import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSoftAurora from '../../vendor/backgrounds/soft-aurora/SoftAurora';
import { REACT_BITS_SOURCE, SOFT_AURORA_DEFAULTS } from './source';

import './soft-aurora.css';

export type SoftAuroraProps = {
  speed?: number;
  scale?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  noiseFrequency?: number;
  noiseAmplitude?: number;
  bandHeight?: number;
  bandSpread?: number;
  octaveDecay?: number;
  layerOffset?: number;
  colorSpeed?: number;
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

export function SoftAurora({
  speed = SOFT_AURORA_DEFAULTS.speed,
  scale = SOFT_AURORA_DEFAULTS.scale,
  brightness = SOFT_AURORA_DEFAULTS.brightness,
  color1 = SOFT_AURORA_DEFAULTS.color1,
  color2 = SOFT_AURORA_DEFAULTS.color2,
  noiseFrequency = SOFT_AURORA_DEFAULTS.noiseFrequency,
  noiseAmplitude = SOFT_AURORA_DEFAULTS.noiseAmplitude,
  bandHeight = SOFT_AURORA_DEFAULTS.bandHeight,
  bandSpread = SOFT_AURORA_DEFAULTS.bandSpread,
  octaveDecay = SOFT_AURORA_DEFAULTS.octaveDecay,
  layerOffset = SOFT_AURORA_DEFAULTS.layerOffset,
  colorSpeed = SOFT_AURORA_DEFAULTS.colorSpeed,
  enableMouseInteraction = SOFT_AURORA_DEFAULTS.enableMouseInteraction,
  mouseInfluence = SOFT_AURORA_DEFAULTS.mouseInfluence,
  lightMode = SOFT_AURORA_DEFAULTS.lightMode,
  reducedMotion = SOFT_AURORA_DEFAULTS.reducedMotion,
}: SoftAuroraProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Soft Aurora"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Two ogl Perlin-noise bands. Speed {speed} and band height {bandHeight}{' '}
              shape the glow. The pointer shifts the sample when mouse interaction
              is on.
            </>
          }
          controls="Pause holds uTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. Colour defaults are brand tokens: color1 paper #FFFFFF (upstream #f7f7f7), color2 accent-blue #0035B1 (upstream #e100ff). The caption is the Tools card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="soft-aurora-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-mouse': enableMouseInteraction ? 'true' : 'false',
      }}
    >
      <div className="soft-aurora-fill">
        <UpstreamSoftAurora
          key={run}
          speed={motionSpeed}
          scale={scale}
          brightness={brightness}
          color1={color1}
          color2={color2}
          noiseFrequency={noiseFrequency}
          noiseAmplitude={noiseAmplitude}
          bandHeight={bandHeight}
          bandSpread={bandSpread}
          octaveDecay={octaveDecay}
          layerOffset={layerOffset}
          colorSpeed={colorSpeed}
          enableMouseInteraction={enableMouseInteraction}
          mouseInfluence={mouseInfluence}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="soft-aurora__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
