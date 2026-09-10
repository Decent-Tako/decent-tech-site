import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamBeams from '../../vendor/backgrounds/beams/Beams';
import { BEAMS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './beams.css';

export type BeamsProps = {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  beamColor?: string;
  backgroundColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
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

const CARD = FEATURES[2];

export function Beams({
  beamWidth = BEAMS_DEFAULTS.beamWidth,
  beamHeight = BEAMS_DEFAULTS.beamHeight,
  beamNumber = BEAMS_DEFAULTS.beamNumber,
  lightColor = BEAMS_DEFAULTS.lightColor,
  beamColor = BEAMS_DEFAULTS.beamColor,
  backgroundColor = BEAMS_DEFAULTS.backgroundColor,
  speed = BEAMS_DEFAULTS.speed,
  noiseIntensity = BEAMS_DEFAULTS.noiseIntensity,
  scale = BEAMS_DEFAULTS.scale,
  rotation = BEAMS_DEFAULTS.rotation,
  lightMode = BEAMS_DEFAULTS.lightMode,
  reducedMotion = BEAMS_DEFAULTS.reducedMotion,
}: BeamsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Beams"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Stacked three.js planes with a noise vertex offset. Time, speed, and
              scale travel the ribbons under a directional light.
            </>
          }
          controls="Pause holds the noise clock. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour defaults are brand tokens: beam accent-blue #0035B1 (upstream #000000), light paper #FFFFFF, background ink #212121 (upstream #000000). The local copy drives three.js directly because @react-three/fiber leaks JSX types into Motion stories. The caption is the Tools card from src/pages/content.ts."
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
      stageTestId="beams-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="beams-fill">
        <UpstreamBeams
          key={run}
          beamWidth={beamWidth}
          beamHeight={beamHeight}
          beamNumber={beamNumber}
          lightColor={lightColor}
          beamColor={beamColor}
          backgroundColor={backgroundColor}
          speed={motionSpeed}
          noiseIntensity={noiseIntensity}
          scale={scale}
          rotation={rotation}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="beams__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
