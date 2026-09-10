import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamShapeGrid from '../../vendor/backgrounds/shape-grid/ShapeGrid';
import {
  REACT_BITS_SOURCE,
  SHAPE_GRID_DEFAULTS,
  type ShapeGridDirection,
  type ShapeGridShape,
} from './source';

import './shape-grid.css';

export type ShapeGridProps = {
  direction?: ShapeGridDirection;
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  shape?: ShapeGridShape;
  hoverTrailAmount?: number;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function ShapeGrid({
  direction = SHAPE_GRID_DEFAULTS.direction,
  speed = SHAPE_GRID_DEFAULTS.speed,
  borderColor = SHAPE_GRID_DEFAULTS.borderColor,
  squareSize = SHAPE_GRID_DEFAULTS.squareSize,
  hoverFillColor = SHAPE_GRID_DEFAULTS.hoverFillColor,
  shape = SHAPE_GRID_DEFAULTS.shape,
  hoverTrailAmount = SHAPE_GRID_DEFAULTS.hoverTrailAmount,
  reducedMotion = SHAPE_GRID_DEFAULTS.reducedMotion,
}: ShapeGridProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Shape Grid"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2d canvas grid of {shape} cells that scroll {direction} at
              speed {speed}. Hover fills a cell. A trail can follow the
              pointer.
            </>
          }
          controls="Pause holds the scroll after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused and onReady are not controls. borderColor default is brand quiet #A6A6A6 (upstream #999). hoverFillColor is brand ink #212121 (upstream #222). The caption is the Week 0 card from src/pages/content.ts. This sketch is a 2d canvas, so there is no WebGL fallback."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setReady(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="shape-grid-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-ready': ready ? 'true' : 'false',
        'data-speed': String(motionSpeed),
        'data-shape': shape,
        'data-direction': direction,
      }}
    >
      <div className="shape-grid-fill">
        <UpstreamShapeGrid
          key={run}
          direction={direction}
          speed={motionSpeed}
          borderColor={borderColor}
          squareSize={squareSize}
          hoverFillColor={hoverFillColor}
          shape={shape}
          hoverTrailAmount={hoverTrailAmount}
          paused={paused || reduce}
          onReady={() => setReady(true)}
        />
      </div>
      <p className="shape-grid__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
