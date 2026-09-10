import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCursorGrid from '../../vendor/animations/cursor-grid/CursorGrid';
import { CURSOR_GRID_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './cursor-grid.css';

export type CursorGridProps = {
  cellSize?: (typeof CURSOR_GRID_DEFAULTS)['cellSize'];
  color?: (typeof CURSOR_GRID_DEFAULTS)['color'];
  radius?: (typeof CURSOR_GRID_DEFAULTS)['radius'];
  falloff?: (typeof CURSOR_GRID_DEFAULTS)['falloff'];
  holdTime?: (typeof CURSOR_GRID_DEFAULTS)['holdTime'];
  fadeDuration?: (typeof CURSOR_GRID_DEFAULTS)['fadeDuration'];
  lineWidth?: (typeof CURSOR_GRID_DEFAULTS)['lineWidth'];
  maxOpacity?: (typeof CURSOR_GRID_DEFAULTS)['maxOpacity'];
  fillOpacity?: (typeof CURSOR_GRID_DEFAULTS)['fillOpacity'];
  gridOpacity?: (typeof CURSOR_GRID_DEFAULTS)['gridOpacity'];
  cellRadius?: (typeof CURSOR_GRID_DEFAULTS)['cellRadius'];
  clickPulse?: (typeof CURSOR_GRID_DEFAULTS)['clickPulse'];
  pulseSpeed?: (typeof CURSOR_GRID_DEFAULTS)['pulseSpeed'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function CursorGrid({
  cellSize = CURSOR_GRID_DEFAULTS.cellSize,
  color = CURSOR_GRID_DEFAULTS.color,
  radius = CURSOR_GRID_DEFAULTS.radius,
  falloff = CURSOR_GRID_DEFAULTS.falloff,
  holdTime = CURSOR_GRID_DEFAULTS.holdTime,
  fadeDuration = CURSOR_GRID_DEFAULTS.fadeDuration,
  lineWidth = CURSOR_GRID_DEFAULTS.lineWidth,
  maxOpacity = CURSOR_GRID_DEFAULTS.maxOpacity,
  fillOpacity = CURSOR_GRID_DEFAULTS.fillOpacity,
  gridOpacity = CURSOR_GRID_DEFAULTS.gridOpacity,
  cellRadius = CURSOR_GRID_DEFAULTS.cellRadius,
  clickPulse = CURSOR_GRID_DEFAULTS.clickPulse,
  pulseSpeed = CURSOR_GRID_DEFAULTS.pulseSpeed,
  reducedMotion = CURSOR_GRID_DEFAULTS.reducedMotion,
}: CursorGridProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Cursor Grid"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas lattice lights cells inside radius <code>{radius}</code> px
              of the pointer with falloff <code>{falloff}</code>. Click sends a pulse
              at <code>{pulseSpeed}</code> px/s. Colour is brand accent blue; upstream
              was <code>#D946EF</code>.
            </>
          }
          controls="Pause ignores the pointer and keeps the last frame. Replay remounts the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused is local. The caption is the Week 0 card from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="cursor-grid-stage"
      stageTestId="cursor-grid-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-falloff': falloff,
      }}
    >
      <UpstreamCursorGrid
        key={run}
        cellSize={cellSize}
        color={color}
        radius={radius}
        falloff={falloff}
        holdTime={holdTime}
        fadeDuration={fadeDuration}
        lineWidth={lineWidth}
        maxOpacity={maxOpacity}
        fillOpacity={fillOpacity}
        gridOpacity={reduce ? Math.max(gridOpacity, 0.25) : gridOpacity}
        cellRadius={cellRadius}
        clickPulse={reduce ? false : clickPulse}
        pulseSpeed={pulseSpeed}
        paused={paused || reduce}
      />
      <p className="cursor-grid-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
