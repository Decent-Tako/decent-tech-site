import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamShapeBlur from '../../vendor/animations/shape-blur/ShapeBlur';
import { SHAPE_BLUR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './shape-blur.css';

export type ShapeBlurProps = {
  variation?: (typeof SHAPE_BLUR_DEFAULTS)['variation'];
  pixelRatioProp?: (typeof SHAPE_BLUR_DEFAULTS)['pixelRatioProp'];
  shapeSize?: (typeof SHAPE_BLUR_DEFAULTS)['shapeSize'];
  roundness?: (typeof SHAPE_BLUR_DEFAULTS)['roundness'];
  borderSize?: (typeof SHAPE_BLUR_DEFAULTS)['borderSize'];
  circleSize?: (typeof SHAPE_BLUR_DEFAULTS)['circleSize'];
  circleEdge?: (typeof SHAPE_BLUR_DEFAULTS)['circleEdge'];
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

export function ShapeBlur({
  variation = SHAPE_BLUR_DEFAULTS.variation,
  pixelRatioProp = SHAPE_BLUR_DEFAULTS.pixelRatioProp,
  shapeSize = SHAPE_BLUR_DEFAULTS.shapeSize,
  roundness = SHAPE_BLUR_DEFAULTS.roundness,
  borderSize = SHAPE_BLUR_DEFAULTS.borderSize,
  circleSize = SHAPE_BLUR_DEFAULTS.circleSize,
  circleEdge = SHAPE_BLUR_DEFAULTS.circleEdge,
  reducedMotion = SHAPE_BLUR_DEFAULTS.reducedMotion,
}: ShapeBlurProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Shape Blur"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js signed-distance field draws variation <code>{variation}</code>.
              The pointer softens the edge with circle size <code>{circleSize}</code>.
            </>
          }
          controls="Pause holds the damped pointer. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className is not a control. paused, seedCenter, onReady, and onUnavailable are local. preserveDrawingBuffer is on so the play can read pixels. The caption is the Challenge week card from src/pages/content.ts."
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
      stageClassName="rb-frame__stage--ink shape-blur-stage"
      stageTestId="shape-blur-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-variation': String(variation),
      }}
    >
      <UpstreamShapeBlur
        key={run}
        variation={variation}
        pixelRatioProp={pixelRatioProp}
        shapeSize={shapeSize}
        roundness={roundness}
        borderSize={borderSize}
        circleSize={circleSize}
        circleEdge={circleEdge}
        paused={paused || reduce}
        seedCenter
        onReady={() => setWebgl('ready')}
        onUnavailable={() => setWebgl('unavailable')}
      />
      <p className="shape-blur-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
