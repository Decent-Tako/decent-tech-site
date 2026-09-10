import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSilk from '../../vendor/backgrounds/silk/Silk';
import { REACT_BITS_SOURCE, SILK_DEFAULTS } from './source';

import './silk.css';

export type SilkProps = {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
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

const CARD = FEATURES[0];

export function Silk({
  speed = SILK_DEFAULTS.speed,
  scale = SILK_DEFAULTS.scale,
  color = SILK_DEFAULTS.color,
  noiseIntensity = SILK_DEFAULTS.noiseIntensity,
  rotation = SILK_DEFAULTS.rotation,
  lightMode = SILK_DEFAULTS.lightMode,
  reducedMotion = SILK_DEFAULTS.reducedMotion,
}: SilkProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Silk"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js silk noise plane. Speed {speed} and scale {scale} drift
              the folds. Rotation {rotation} turns the grain.
            </>
          }
          controls="Pause holds uTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. Colour default is brand charcoal #4A4A4A (upstream #7B7481). The local copy drives three.js directly because @react-three/fiber leaks JSX types into Motion stories. The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="silk-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-light': lightMode ? 'true' : 'false',
      }}
    >
      <div className="silk-fill">
        <UpstreamSilk
          key={run}
          speed={motionSpeed}
          scale={scale}
          color={color}
          noiseIntensity={noiseIntensity}
          rotation={rotation}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="silk__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
