import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamScanner from '../../vendor/backgrounds/scanner/Scanner';
import { REACT_BITS_SOURCE, SCANNER_DEFAULTS, type ScanDirection } from './source';

import './scanner.css';

export type ScannerProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  sweepFalloff?: number;
  scale?: number;
  frequency?: number;
  ripple?: number;
  bandDensity?: number;
  lineSharpness?: number;
  glow?: number;
  scanDirection?: ScanDirection;
  colorSpread?: number;
  brightness?: number;
  contrast?: number;
  softness?: number;
  vignette?: number;
  scanline?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseStrength?: number;
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

const CARD = FEATURES[4];

export function Scanner({
  color1 = SCANNER_DEFAULTS.color1,
  color2 = SCANNER_DEFAULTS.color2,
  color3 = SCANNER_DEFAULTS.color3,
  speed = SCANNER_DEFAULTS.speed,
  sweepSpeed = SCANNER_DEFAULTS.sweepSpeed,
  sweepWidth = SCANNER_DEFAULTS.sweepWidth,
  sweepFalloff = SCANNER_DEFAULTS.sweepFalloff,
  scale = SCANNER_DEFAULTS.scale,
  frequency = SCANNER_DEFAULTS.frequency,
  ripple = SCANNER_DEFAULTS.ripple,
  bandDensity = SCANNER_DEFAULTS.bandDensity,
  lineSharpness = SCANNER_DEFAULTS.lineSharpness,
  glow = SCANNER_DEFAULTS.glow,
  scanDirection = SCANNER_DEFAULTS.scanDirection,
  colorSpread = SCANNER_DEFAULTS.colorSpread,
  brightness = SCANNER_DEFAULTS.brightness,
  contrast = SCANNER_DEFAULTS.contrast,
  softness = SCANNER_DEFAULTS.softness,
  vignette = SCANNER_DEFAULTS.vignette,
  scanline = SCANNER_DEFAULTS.scanline,
  grain = SCANNER_DEFAULTS.grain,
  grainIntensity = SCANNER_DEFAULTS.grainIntensity,
  opacity = SCANNER_DEFAULTS.opacity,
  mouseInteraction = SCANNER_DEFAULTS.mouseInteraction,
  mouseRadius = SCANNER_DEFAULTS.mouseRadius,
  mouseStrength = SCANNER_DEFAULTS.mouseStrength,
  reducedMotion = SCANNER_DEFAULTS.reducedMotion,
}: ScannerProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;
  const motionSweep = reduce ? 0 : sweepSpeed;

  return (
    <ReactBitsFrame
      title="Scanner"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A WebGL 2 scan field on ogl. Direction {scanDirection} with
              speed {speed} and a sweep at {sweepSpeed}. The pointer can
              warp the bands.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed and sweepSpeed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, onError, and className are not controls. Colour defaults are brand accent-blue, accent-yellow, and paper (upstream #5227FF, #FF9FFC, #FFFFFF). The caption is the Street card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="scanner-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-direction': scanDirection,
      }}
    >
      <div className="scanner-fill">
        <UpstreamScanner
          key={run}
          color1={color1}
          color2={color2}
          color3={color3}
          speed={motionSpeed}
          sweepSpeed={motionSweep}
          sweepWidth={sweepWidth}
          sweepFalloff={sweepFalloff}
          scale={scale}
          frequency={frequency}
          ripple={ripple}
          bandDensity={bandDensity}
          lineSharpness={lineSharpness}
          glow={glow}
          scanDirection={scanDirection}
          colorSpread={colorSpread}
          brightness={brightness}
          contrast={contrast}
          softness={softness}
          vignette={vignette}
          scanline={scanline}
          grain={grain}
          grainIntensity={grainIntensity}
          opacity={opacity}
          mouseInteraction={mouseInteraction}
          mouseRadius={mouseRadius}
          mouseStrength={mouseStrength}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="scanner__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
