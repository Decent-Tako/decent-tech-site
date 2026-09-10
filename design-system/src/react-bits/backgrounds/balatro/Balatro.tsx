import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamBalatro from '../../vendor/backgrounds/balatro/Balatro';
import { BALATRO_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './balatro.css';

export type BalatroProps = {
  spinRotation?: number;
  spinSpeed?: number;
  offset?: [number, number];
  color1?: string;
  color2?: string;
  color3?: string;
  contrast?: number;
  lighting?: number;
  spinAmount?: number;
  pixelFilter?: number;
  spinEase?: number;
  isRotate?: boolean;
  mouseInteraction?: boolean;
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

export function Balatro({
  spinRotation = BALATRO_DEFAULTS.spinRotation,
  spinSpeed = BALATRO_DEFAULTS.spinSpeed,
  offset = BALATRO_DEFAULTS.offset,
  color1 = BALATRO_DEFAULTS.color1,
  color2 = BALATRO_DEFAULTS.color2,
  color3 = BALATRO_DEFAULTS.color3,
  contrast = BALATRO_DEFAULTS.contrast,
  lighting = BALATRO_DEFAULTS.lighting,
  spinAmount = BALATRO_DEFAULTS.spinAmount,
  pixelFilter = BALATRO_DEFAULTS.pixelFilter,
  spinEase = BALATRO_DEFAULTS.spinEase,
  isRotate = BALATRO_DEFAULTS.isRotate,
  mouseInteraction = BALATRO_DEFAULTS.mouseInteraction,
  reducedMotion = BALATRO_DEFAULTS.reducedMotion,
}: BalatroProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : spinSpeed;

  return (
    <ReactBitsFrame
      title="Balatro"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl full-screen spin shader. Time, <code>uSpinAmount</code>, and the pointer
              twist a three-colour pixel field.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets spinSpeed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour defaults are brand tokens: color1 accent-yellow #DEF54F (upstream #DE443B), color2 accent-blue #0035B1 (upstream #006BB4), color3 ink #212121 (upstream #162325). The caption is the Challenge week card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="balatro-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="balatro-fill">
        <UpstreamBalatro
          key={run}
          spinRotation={spinRotation}
          spinSpeed={motionSpeed}
          offset={offset}
          color1={color1}
          color2={color2}
          color3={color3}
          contrast={contrast}
          lighting={lighting}
          spinAmount={spinAmount}
          pixelFilter={pixelFilter}
          spinEase={spinEase}
          isRotate={isRotate}
          mouseInteraction={mouseInteraction}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="balatro__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
