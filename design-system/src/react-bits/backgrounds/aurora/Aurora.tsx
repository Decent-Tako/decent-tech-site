import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamAurora from '../../vendor/backgrounds/aurora/Aurora';
import { AURORA_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './aurora.css';

export type AuroraProps = {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
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

const CARD = FEATURES[2];

export function Aurora({
  colorStops = AURORA_DEFAULTS.colorStops,
  amplitude = AURORA_DEFAULTS.amplitude,
  blend = AURORA_DEFAULTS.blend,
  speed = AURORA_DEFAULTS.speed,
  lightMode = AURORA_DEFAULTS.lightMode,
  reducedMotion = AURORA_DEFAULTS.reducedMotion,
}: AuroraProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Aurora"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 simplex-noise band. <code>uTime</code> and <code>uAmplitude</code>{' '}
              lift a three-stop colour ramp across the stage.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="time, paused, onReady, and onError are not controls. Colour stops are brand tokens accent-blue #0035B1 and accent-yellow #DEF54F (upstream #5227FF and #7cff67). The caption is the Tools card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="aurora-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="aurora-fill">
        <UpstreamAurora
          key={run}
          colorStops={colorStops}
          amplitude={amplitude}
          blend={blend}
          speed={motionSpeed}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="aurora__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
