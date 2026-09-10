import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSlicedWaves from '../../vendor/backgrounds/sliced-waves/SlicedWaves';
import {
  REACT_BITS_SOURCE,
  SLICED_WAVES_DEFAULTS,
  type SlicedWavesOrientation,
} from './source';

import './sliced-waves.css';

export type SlicedWavesProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  columns?: number;
  rows?: number;
  barThickness?: number;
  speed?: number;
  travel?: number;
  waveSpread?: number;
  rowOffset?: number;
  softness?: number;
  glow?: number;
  brightness?: number;
  contrast?: number;
  opacity?: number;
  orientation?: SlicedWavesOrientation;
  alternate?: boolean;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  grain?: boolean;
  grainIntensity?: number;
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

const CARD = FEATURES[1];

export function SlicedWaves({
  color1 = SLICED_WAVES_DEFAULTS.color1,
  color2 = SLICED_WAVES_DEFAULTS.color2,
  color3 = SLICED_WAVES_DEFAULTS.color3,
  columns = SLICED_WAVES_DEFAULTS.columns,
  rows = SLICED_WAVES_DEFAULTS.rows,
  barThickness = SLICED_WAVES_DEFAULTS.barThickness,
  speed = SLICED_WAVES_DEFAULTS.speed,
  travel = SLICED_WAVES_DEFAULTS.travel,
  waveSpread = SLICED_WAVES_DEFAULTS.waveSpread,
  rowOffset = SLICED_WAVES_DEFAULTS.rowOffset,
  softness = SLICED_WAVES_DEFAULTS.softness,
  glow = SLICED_WAVES_DEFAULTS.glow,
  brightness = SLICED_WAVES_DEFAULTS.brightness,
  contrast = SLICED_WAVES_DEFAULTS.contrast,
  opacity = SLICED_WAVES_DEFAULTS.opacity,
  orientation = SLICED_WAVES_DEFAULTS.orientation,
  alternate = SLICED_WAVES_DEFAULTS.alternate,
  mouseInteraction = SLICED_WAVES_DEFAULTS.mouseInteraction,
  mouseStrength = SLICED_WAVES_DEFAULTS.mouseStrength,
  mouseRadius = SLICED_WAVES_DEFAULTS.mouseRadius,
  grain = SLICED_WAVES_DEFAULTS.grain,
  grainIntensity = SLICED_WAVES_DEFAULTS.grainIntensity,
  lightMode = SLICED_WAVES_DEFAULTS.lightMode,
  reducedMotion = SLICED_WAVES_DEFAULTS.reducedMotion,
}: SlicedWavesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Sliced Waves"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl grid of {orientation} bars. Speed {speed} and travel {travel}{' '}
              move the slices. The pointer thickens a local band when mouse
              interaction is on.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. Colour defaults are brand tokens: color1 accent-yellow #DEF54F (upstream #FF9FFC), color2 accent-blue #0035B1 (upstream #5227FF), color3 paper #FFFFFF (upstream #B497CF). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas. WebGL 2 is required."
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
      stageTestId="sliced-waves-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-orientation': orientation,
      }}
    >
      <div className="sliced-waves-fill">
        <UpstreamSlicedWaves
          key={run}
          color1={color1}
          color2={color2}
          color3={color3}
          columns={columns}
          rows={rows}
          barThickness={barThickness}
          speed={motionSpeed}
          travel={travel}
          waveSpread={waveSpread}
          rowOffset={rowOffset}
          softness={softness}
          glow={glow}
          brightness={brightness}
          contrast={contrast}
          opacity={opacity}
          orientation={orientation}
          alternate={alternate}
          mouseInteraction={mouseInteraction}
          mouseStrength={mouseStrength}
          mouseRadius={mouseRadius}
          grain={grain}
          grainIntensity={grainIntensity}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="sliced-waves__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
