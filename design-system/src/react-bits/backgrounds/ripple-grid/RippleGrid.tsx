import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamRippleGrid from '../../vendor/backgrounds/ripple-grid/RippleGrid';
import { REACT_BITS_SOURCE, RIPPLE_GRID_DEFAULTS } from './source';

import './ripple-grid.css';

export type RippleGridProps = {
  enableRainbow?: boolean;
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  gridThickness?: number;
  fadeDistance?: number;
  vignetteStrength?: number;
  glowIntensity?: number;
  opacity?: number;
  gridRotation?: number;
  mouseInteraction?: boolean;
  mouseInteractionRadius?: number;
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

const CARD = FEATURES[3];

export function RippleGrid({
  enableRainbow = RIPPLE_GRID_DEFAULTS.enableRainbow,
  gridColor = RIPPLE_GRID_DEFAULTS.gridColor,
  rippleIntensity = RIPPLE_GRID_DEFAULTS.rippleIntensity,
  gridSize = RIPPLE_GRID_DEFAULTS.gridSize,
  gridThickness = RIPPLE_GRID_DEFAULTS.gridThickness,
  fadeDistance = RIPPLE_GRID_DEFAULTS.fadeDistance,
  vignetteStrength = RIPPLE_GRID_DEFAULTS.vignetteStrength,
  glowIntensity = RIPPLE_GRID_DEFAULTS.glowIntensity,
  opacity = RIPPLE_GRID_DEFAULTS.opacity,
  gridRotation = RIPPLE_GRID_DEFAULTS.gridRotation,
  mouseInteraction = RIPPLE_GRID_DEFAULTS.mouseInteraction,
  mouseInteractionRadius = RIPPLE_GRID_DEFAULTS.mouseInteractionRadius,
  lightMode = RIPPLE_GRID_DEFAULTS.lightMode,
  reducedMotion = RIPPLE_GRID_DEFAULTS.reducedMotion,
}: RippleGridProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionRipple = reduce ? 0 : rippleIntensity;

  return (
    <ReactBitsFrame
      title="Ripple Grid"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl grid with ripple intensity {rippleIntensity}. The pointer
              can add a local wave. Rainbow mode tints the cells from time.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets rippleIntensity to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. gridColor default is brand paper #FFFFFF (upstream #ffffff). The caption is the Challenge week card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="ripple-grid-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-rainbow': enableRainbow ? 'true' : 'false',
      }}
    >
      <div className="ripple-grid-fill">
        <UpstreamRippleGrid
          key={run}
          enableRainbow={enableRainbow}
          gridColor={gridColor}
          rippleIntensity={motionRipple}
          gridSize={gridSize}
          gridThickness={gridThickness}
          fadeDistance={fadeDistance}
          vignetteStrength={vignetteStrength}
          glowIntensity={glowIntensity}
          opacity={opacity}
          gridRotation={gridRotation}
          mouseInteraction={mouseInteraction}
          mouseInteractionRadius={mouseInteractionRadius}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="ripple-grid__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
