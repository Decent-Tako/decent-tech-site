import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamOrb from '../../vendor/backgrounds/orb/Orb';
import { ORB_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './orb.css';

export type OrbProps = {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
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

const CARD = FEATURES[1];

export function Orb({
  hue = ORB_DEFAULTS.hue,
  hoverIntensity = ORB_DEFAULTS.hoverIntensity,
  rotateOnHover = ORB_DEFAULTS.rotateOnHover,
  forceHoverState = ORB_DEFAULTS.forceHoverState,
  backgroundColor = ORB_DEFAULTS.backgroundColor,
  reducedMotion = ORB_DEFAULTS.reducedMotion,
}: OrbProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionHover = reduce ? 0 : hoverIntensity;

  return (
    <ReactBitsFrame
      title="Orb"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl simplex-noise orb. Hue rotates the built-in three-stop
              palette. Hover warps UV and can spin the disc.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets hoverIntensity to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. hue is a rotation in degrees, not a colour token. backgroundColor is brand ink #212121 (upstream #000000). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="orb-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-hover': String(motionHover),
        'data-forced': forceHoverState ? 'true' : 'false',
      }}
    >
      <div className="orb-fill">
        <UpstreamOrb
          key={run}
          hue={hue}
          hoverIntensity={motionHover}
          rotateOnHover={rotateOnHover}
          forceHoverState={forceHoverState}
          backgroundColor={backgroundColor}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="orb__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
