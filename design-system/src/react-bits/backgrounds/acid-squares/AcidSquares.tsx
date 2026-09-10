import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamAcidSquares from '../../vendor/backgrounds/acid-squares/AcidSquares';
import { ACID_SQUARES_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './acid-squares.css';

export type AcidSquaresProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  detail?: (typeof ACID_SQUARES_DEFAULTS)['detail'];
  speed?: number;
  waveDepth?: number;
  zoom?: number;
  density?: number;
  glow?: number;
  exposure?: number;
  spread?: number;
  stepSize?: number;
  colorShift?: number;
  contrast?: number;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  blur?: number;
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

const CARD = FEATURES[0];

export function AcidSquares({
  color1 = ACID_SQUARES_DEFAULTS.color1,
  color2 = ACID_SQUARES_DEFAULTS.color2,
  color3 = ACID_SQUARES_DEFAULTS.color3,
  detail = ACID_SQUARES_DEFAULTS.detail,
  speed = ACID_SQUARES_DEFAULTS.speed,
  waveDepth = ACID_SQUARES_DEFAULTS.waveDepth,
  zoom = ACID_SQUARES_DEFAULTS.zoom,
  density = ACID_SQUARES_DEFAULTS.density,
  glow = ACID_SQUARES_DEFAULTS.glow,
  exposure = ACID_SQUARES_DEFAULTS.exposure,
  spread = ACID_SQUARES_DEFAULTS.spread,
  stepSize = ACID_SQUARES_DEFAULTS.stepSize,
  colorShift = ACID_SQUARES_DEFAULTS.colorShift,
  contrast = ACID_SQUARES_DEFAULTS.contrast,
  brightness = ACID_SQUARES_DEFAULTS.brightness,
  opacity = ACID_SQUARES_DEFAULTS.opacity,
  mouseInteraction = ACID_SQUARES_DEFAULTS.mouseInteraction,
  mouseStrength = ACID_SQUARES_DEFAULTS.mouseStrength,
  mouseRadius = ACID_SQUARES_DEFAULTS.mouseRadius,
  blur = ACID_SQUARES_DEFAULTS.blur,
  grain = ACID_SQUARES_DEFAULTS.grain,
  grainIntensity = ACID_SQUARES_DEFAULTS.grainIntensity,
  lightMode = ACID_SQUARES_DEFAULTS.lightMode,
  reducedMotion = ACID_SQUARES_DEFAULTS.reducedMotion,
}: AcidSquaresProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Acid Squares"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 ray-march stacks squares along a camera path. Time drives{' '}
              <code>uSpeed</code> and <code>uWaveDepth</code>. The pointer dents the field
              through <code>uMouse</code>.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onReady, and onError are not controls. Colour defaults are brand tokens: color1 accent-blue #0035B1 (upstream #5227FF), color2 accent-yellow #DEF54F (upstream #A855F7), color3 paper #FFFFFF. The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="acid-squares-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <UpstreamAcidSquares
        key={run}
        className="acid-squares-fill"
        color1={color1}
        color2={color2}
        color3={color3}
        detail={detail}
        speed={motionSpeed}
        waveDepth={waveDepth}
        zoom={zoom}
        density={density}
        glow={glow}
        exposure={exposure}
        spread={spread}
        stepSize={stepSize}
        colorShift={colorShift}
        contrast={contrast}
        brightness={brightness}
        opacity={opacity}
        mouseInteraction={mouseInteraction}
        mouseStrength={mouseStrength}
        mouseRadius={mouseRadius}
        blur={blur}
        grain={grain}
        grainIntensity={grainIntensity}
        lightMode={lightMode}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onError={() => setWebgl('unavailable')}
      />
      <p className="acid-squares__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
