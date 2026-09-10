import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPixelBlast from '../../vendor/backgrounds/pixel-blast/PixelBlast';
import { PIXEL_BLAST_DEFAULTS, REACT_BITS_SOURCE, type PixelBlastVariant } from './source';

import './pixel-blast.css';

export type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
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

export function PixelBlast({
  variant = PIXEL_BLAST_DEFAULTS.variant,
  pixelSize = PIXEL_BLAST_DEFAULTS.pixelSize,
  color = PIXEL_BLAST_DEFAULTS.color,
  antialias = PIXEL_BLAST_DEFAULTS.antialias,
  patternScale = PIXEL_BLAST_DEFAULTS.patternScale,
  patternDensity = PIXEL_BLAST_DEFAULTS.patternDensity,
  liquid = PIXEL_BLAST_DEFAULTS.liquid,
  liquidStrength = PIXEL_BLAST_DEFAULTS.liquidStrength,
  liquidRadius = PIXEL_BLAST_DEFAULTS.liquidRadius,
  pixelSizeJitter = PIXEL_BLAST_DEFAULTS.pixelSizeJitter,
  enableRipples = PIXEL_BLAST_DEFAULTS.enableRipples,
  rippleIntensityScale = PIXEL_BLAST_DEFAULTS.rippleIntensityScale,
  rippleThickness = PIXEL_BLAST_DEFAULTS.rippleThickness,
  rippleSpeed = PIXEL_BLAST_DEFAULTS.rippleSpeed,
  liquidWobbleSpeed = PIXEL_BLAST_DEFAULTS.liquidWobbleSpeed,
  autoPauseOffscreen = PIXEL_BLAST_DEFAULTS.autoPauseOffscreen,
  speed = PIXEL_BLAST_DEFAULTS.speed,
  transparent = PIXEL_BLAST_DEFAULTS.transparent,
  edgeFade = PIXEL_BLAST_DEFAULTS.edgeFade,
  noiseAmount = PIXEL_BLAST_DEFAULTS.noiseAmount,
  reducedMotion = PIXEL_BLAST_DEFAULTS.reducedMotion,
}: PixelBlastProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Pixel Blast"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js GLSL3 pixel grid. Clicks drop ripples. Optional liquid
              and noise passes run through postprocessing.
            </>
          }
          controls="Pause holds uTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, paused, onReady, and onError are not controls. Colour default is brand accent-blue #0035B1 (upstream #B497CF). The caption is the Challenge week card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="pixel-blast-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-variant': variant,
      }}
    >
      <div className="pixel-blast-fill">
        <UpstreamPixelBlast
          key={run}
          variant={variant}
          pixelSize={pixelSize}
          color={color}
          antialias={antialias}
          patternScale={patternScale}
          patternDensity={patternDensity}
          liquid={liquid}
          liquidStrength={liquidStrength}
          liquidRadius={liquidRadius}
          pixelSizeJitter={pixelSizeJitter}
          enableRipples={enableRipples}
          rippleIntensityScale={rippleIntensityScale}
          rippleThickness={rippleThickness}
          rippleSpeed={rippleSpeed}
          liquidWobbleSpeed={liquidWobbleSpeed}
          autoPauseOffscreen={autoPauseOffscreen}
          speed={motionSpeed}
          transparent={transparent}
          edgeFade={edgeFade}
          noiseAmount={noiseAmount}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="pixel-blast__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
