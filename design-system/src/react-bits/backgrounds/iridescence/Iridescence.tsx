import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamIridescence from '../../vendor/backgrounds/iridescence/Iridescence';
import { IRIDESCENCE_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './iridescence.css';

export type IridescenceProps = {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
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

const CARD = FEATURES[3];

export function Iridescence({
  color = IRIDESCENCE_DEFAULTS.color,
  speed = IRIDESCENCE_DEFAULTS.speed,
  amplitude = IRIDESCENCE_DEFAULTS.amplitude,
  mouseReact = IRIDESCENCE_DEFAULTS.mouseReact,
  reducedMotion = IRIDESCENCE_DEFAULTS.reducedMotion,
}: IridescenceProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Iridescence"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl full-screen triangle. Cosine interference in the fragment
              shader tints with <code>uColor</code>. The pointer offsets UV.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour is RGB 0-1. Default is brand accent-blue #0035B1 as [0, 0.208, 0.694] (upstream [1, 1, 1]). The caption is the Challenge week card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="iridescence-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="iridescence-fill">
        <UpstreamIridescence
          key={run}
          color={color}
          speed={motionSpeed}
          amplitude={amplitude}
          mouseReact={mouseReact}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="iridescence__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
