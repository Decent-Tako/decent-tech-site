import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamTopography from '../../vendor/backgrounds/topography/Topography';
import {
  REACT_BITS_SOURCE,
  TOPOGRAPHY_DEFAULTS,
  type TopographyColorMode,
} from './source';

import './topography.css';

export type TopographyProps = {
  lowColor?: string;
  midColor?: string;
  highColor?: string;
  speed?: number;
  morphAmount?: number;
  morphSpeed?: number;
  bands?: number;
  thickness?: number;
  scale?: number;
  pixelSize?: number;
  glow?: number;
  colorMode?: TopographyColorMode;
  contrast?: number;
  brightness?: number;
  fillBands?: boolean;
  opacity?: number;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseStrength?: number;
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

const CARD = FEATURES[3];

export function Topography({
  lowColor = TOPOGRAPHY_DEFAULTS.lowColor,
  midColor = TOPOGRAPHY_DEFAULTS.midColor,
  highColor = TOPOGRAPHY_DEFAULTS.highColor,
  speed = TOPOGRAPHY_DEFAULTS.speed,
  morphAmount = TOPOGRAPHY_DEFAULTS.morphAmount,
  morphSpeed = TOPOGRAPHY_DEFAULTS.morphSpeed,
  bands = TOPOGRAPHY_DEFAULTS.bands,
  thickness = TOPOGRAPHY_DEFAULTS.thickness,
  scale = TOPOGRAPHY_DEFAULTS.scale,
  pixelSize = TOPOGRAPHY_DEFAULTS.pixelSize,
  glow = TOPOGRAPHY_DEFAULTS.glow,
  colorMode = TOPOGRAPHY_DEFAULTS.colorMode,
  contrast = TOPOGRAPHY_DEFAULTS.contrast,
  brightness = TOPOGRAPHY_DEFAULTS.brightness,
  fillBands = TOPOGRAPHY_DEFAULTS.fillBands,
  opacity = TOPOGRAPHY_DEFAULTS.opacity,
  grain = TOPOGRAPHY_DEFAULTS.grain,
  grainIntensity = TOPOGRAPHY_DEFAULTS.grainIntensity,
  mouseInteraction = TOPOGRAPHY_DEFAULTS.mouseInteraction,
  mouseRadius = TOPOGRAPHY_DEFAULTS.mouseRadius,
  mouseStrength = TOPOGRAPHY_DEFAULTS.mouseStrength,
  lightMode = TOPOGRAPHY_DEFAULTS.lightMode,
  reducedMotion = TOPOGRAPHY_DEFAULTS.reducedMotion,
}: TopographyProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Topography"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Morphing ogl contour bands. Speed {speed} and morph amount {morphAmount}{' '}
              warp the field. Colour mode {colorMode} tints the lines. The pointer
              bumps elevation when mouse interaction is on.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. Colour defaults are brand tokens: lowColor accent-blue #0035B1 (upstream #5227FF), midColor accent-yellow #DEF54F (upstream #FF9FFC), highColor paper #FFFFFF. The caption is the Challenge week card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas. WebGL 2 is required."
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
      stageTestId="topography-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-mode': colorMode,
      }}
    >
      <div className="topography-fill">
        <UpstreamTopography
          key={run}
          lowColor={lowColor}
          midColor={midColor}
          highColor={highColor}
          speed={motionSpeed}
          morphAmount={morphAmount}
          morphSpeed={morphSpeed}
          bands={bands}
          thickness={thickness}
          scale={scale}
          pixelSize={pixelSize}
          glow={glow}
          colorMode={colorMode}
          contrast={contrast}
          brightness={brightness}
          fillBands={fillBands}
          opacity={opacity}
          grain={grain}
          grainIntensity={grainIntensity}
          mouseInteraction={mouseInteraction}
          mouseRadius={mouseRadius}
          mouseStrength={mouseStrength}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="topography__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
