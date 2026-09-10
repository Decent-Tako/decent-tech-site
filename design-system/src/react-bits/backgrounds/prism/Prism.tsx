import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPrism from '../../vendor/backgrounds/prism/Prism';
import { PRISM_DEFAULTS, REACT_BITS_SOURCE, type PrismAnimationType } from './source';

import './prism.css';

export type PrismProps = {
  height?: number;
  baseWidth?: number;
  animationType?: PrismAnimationType;
  glow?: number;
  offset?: { x?: number; y?: number };
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  suspendWhenOffscreen?: boolean;
  timeScale?: number;
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

export function Prism({
  height = PRISM_DEFAULTS.height,
  baseWidth = PRISM_DEFAULTS.baseWidth,
  animationType = PRISM_DEFAULTS.animationType,
  glow = PRISM_DEFAULTS.glow,
  offset = PRISM_DEFAULTS.offset,
  noise = PRISM_DEFAULTS.noise,
  transparent = PRISM_DEFAULTS.transparent,
  scale = PRISM_DEFAULTS.scale,
  hueShift = PRISM_DEFAULTS.hueShift,
  colorFrequency = PRISM_DEFAULTS.colorFrequency,
  hoverStrength = PRISM_DEFAULTS.hoverStrength,
  inertia = PRISM_DEFAULTS.inertia,
  bloom = PRISM_DEFAULTS.bloom,
  suspendWhenOffscreen = PRISM_DEFAULTS.suspendWhenOffscreen,
  timeScale = PRISM_DEFAULTS.timeScale,
  lightMode = PRISM_DEFAULTS.lightMode,
  reducedMotion = PRISM_DEFAULTS.reducedMotion,
}: PrismProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionScale = reduce ? 0 : timeScale;

  return (
    <ReactBitsFrame
      title="Prism"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl raymarch of a glowing prism. Time scale{' '}
              <code>{timeScale}</code> drives rotate or 3drotate. Hover tilts
              the solid from the pointer.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets timeScale to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. hueShift is a rotation in degrees, not a colour token. The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="prism-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-time-scale': String(motionScale),
        'data-animation': animationType,
      }}
    >
      <div className="prism-fill">
        <UpstreamPrism
          key={run}
          height={height}
          baseWidth={baseWidth}
          animationType={animationType}
          glow={glow}
          offset={offset}
          noise={noise}
          transparent={transparent}
          scale={scale}
          hueShift={hueShift}
          colorFrequency={colorFrequency}
          hoverStrength={hoverStrength}
          inertia={inertia}
          bloom={bloom}
          suspendWhenOffscreen={suspendWhenOffscreen}
          timeScale={motionScale}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="prism__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
