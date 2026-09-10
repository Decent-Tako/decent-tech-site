import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDotGrid from '../../vendor/backgrounds/dot-grid/DotGrid';
import { DOT_GRID_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './dot-grid.css';

export type DotGridProps = {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  reducedMotion?: ReducedMotionMode;
};

function probeCanvas(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return ctx ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[4];

export function DotGrid({
  dotSize = DOT_GRID_DEFAULTS.dotSize,
  gap = DOT_GRID_DEFAULTS.gap,
  baseColor = DOT_GRID_DEFAULTS.baseColor,
  activeColor = DOT_GRID_DEFAULTS.activeColor,
  proximity = DOT_GRID_DEFAULTS.proximity,
  speedTrigger = DOT_GRID_DEFAULTS.speedTrigger,
  shockRadius = DOT_GRID_DEFAULTS.shockRadius,
  shockStrength = DOT_GRID_DEFAULTS.shockStrength,
  maxSpeed = DOT_GRID_DEFAULTS.maxSpeed,
  resistance = DOT_GRID_DEFAULTS.resistance,
  returnDuration = DOT_GRID_DEFAULTS.returnDuration,
  reducedMotion = DOT_GRID_DEFAULTS.reducedMotion,
}: DotGridProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeCanvas);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Dot Grid"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas grid of dots. Fast pointer motion and click run a gsap
              inertia tween that pushes nearby dots and returns them.
            </>
          }
          controls="Pause holds the gsap timeline. Replay remounts the grid. Reduced motion holds the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, paused, onReady, and onError are not controls. Colour defaults are brand tokens: baseColor accent-blue #0035B1 and activeColor accent-yellow #DEF54F (upstream both #5227FF). The caption is the Street card from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeCanvas());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="dot-grid-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': reduce ? '0' : '1',
      }}
    >
      <div className="dot-grid-fill">
        <UpstreamDotGrid
          key={run}
          dotSize={dotSize}
          gap={gap}
          baseColor={baseColor}
          activeColor={activeColor}
          proximity={proximity}
          speedTrigger={speedTrigger}
          shockRadius={shockRadius}
          shockStrength={shockStrength}
          maxSpeed={maxSpeed}
          resistance={resistance}
          returnDuration={returnDuration}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="dot-grid__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
