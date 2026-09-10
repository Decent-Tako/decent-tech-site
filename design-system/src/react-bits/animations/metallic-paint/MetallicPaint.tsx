import { useState } from 'react';

import { FEATURES, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMetallicPaint from '../../vendor/animations/metallic-paint/MetallicPaint';
import { METALLIC_PAINT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './metallic-paint.css';

export type MetallicPaintProps = {
  seed?: (typeof METALLIC_PAINT_DEFAULTS)['seed'];
  scale?: (typeof METALLIC_PAINT_DEFAULTS)['scale'];
  refraction?: (typeof METALLIC_PAINT_DEFAULTS)['refraction'];
  blur?: (typeof METALLIC_PAINT_DEFAULTS)['blur'];
  liquid?: (typeof METALLIC_PAINT_DEFAULTS)['liquid'];
  speed?: (typeof METALLIC_PAINT_DEFAULTS)['speed'];
  brightness?: (typeof METALLIC_PAINT_DEFAULTS)['brightness'];
  contrast?: (typeof METALLIC_PAINT_DEFAULTS)['contrast'];
  angle?: (typeof METALLIC_PAINT_DEFAULTS)['angle'];
  fresnel?: (typeof METALLIC_PAINT_DEFAULTS)['fresnel'];
  lightColor?: (typeof METALLIC_PAINT_DEFAULTS)['lightColor'];
  darkColor?: (typeof METALLIC_PAINT_DEFAULTS)['darkColor'];
  patternSharpness?: (typeof METALLIC_PAINT_DEFAULTS)['patternSharpness'];
  waveAmplitude?: (typeof METALLIC_PAINT_DEFAULTS)['waveAmplitude'];
  noiseScale?: (typeof METALLIC_PAINT_DEFAULTS)['noiseScale'];
  chromaticSpread?: (typeof METALLIC_PAINT_DEFAULTS)['chromaticSpread'];
  mouseAnimation?: (typeof METALLIC_PAINT_DEFAULTS)['mouseAnimation'];
  distortion?: (typeof METALLIC_PAINT_DEFAULTS)['distortion'];
  contour?: (typeof METALLIC_PAINT_DEFAULTS)['contour'];
  tintColor?: (typeof METALLIC_PAINT_DEFAULTS)['tintColor'];
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

export function MetallicPaint({
  seed = METALLIC_PAINT_DEFAULTS.seed,
  scale = METALLIC_PAINT_DEFAULTS.scale,
  refraction = METALLIC_PAINT_DEFAULTS.refraction,
  blur = METALLIC_PAINT_DEFAULTS.blur,
  liquid = METALLIC_PAINT_DEFAULTS.liquid,
  speed = METALLIC_PAINT_DEFAULTS.speed,
  brightness = METALLIC_PAINT_DEFAULTS.brightness,
  contrast = METALLIC_PAINT_DEFAULTS.contrast,
  angle = METALLIC_PAINT_DEFAULTS.angle,
  fresnel = METALLIC_PAINT_DEFAULTS.fresnel,
  lightColor = METALLIC_PAINT_DEFAULTS.lightColor,
  darkColor = METALLIC_PAINT_DEFAULTS.darkColor,
  patternSharpness = METALLIC_PAINT_DEFAULTS.patternSharpness,
  waveAmplitude = METALLIC_PAINT_DEFAULTS.waveAmplitude,
  noiseScale = METALLIC_PAINT_DEFAULTS.noiseScale,
  chromaticSpread = METALLIC_PAINT_DEFAULTS.chromaticSpread,
  mouseAnimation = METALLIC_PAINT_DEFAULTS.mouseAnimation,
  distortion = METALLIC_PAINT_DEFAULTS.distortion,
  contour = METALLIC_PAINT_DEFAULTS.contour,
  tintColor = METALLIC_PAINT_DEFAULTS.tintColor,
  reducedMotion = METALLIC_PAINT_DEFAULTS.reducedMotion,
}: MetallicPaintProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Metallic Paint"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A WebGL 2 liquid-metal shader maps a depth field from the Academy
              photograph. Tint is brand accent yellow. Speed is <code>{speed}</code>.
            </>
          }
          controls="Pause holds the clock and keeps the last frame. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="imageSrc is the Week 0 photograph from src/pages/content.ts, so it is not a control. paused, onReady, and onUnavailable are local. preserveDrawingBuffer is on so the play can read pixels. lightColor is brand paper (upstream #ffffff). darkColor is brand ink (upstream #000000). tintColor is brand accent yellow (upstream #feb3ff)."
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
      stageClassName="metallic-paint-stage"
      stageTestId="metallic-paint-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <UpstreamMetallicPaint
        key={run}
        imageSrc={PHOTOS.hero.src}
        seed={seed}
        scale={scale}
        refraction={refraction}
        blur={blur}
        liquid={liquid}
        speed={reduce ? 0 : speed}
        brightness={brightness}
        contrast={contrast}
        angle={angle}
        fresnel={fresnel}
        lightColor={lightColor}
        darkColor={darkColor}
        patternSharpness={patternSharpness}
        waveAmplitude={waveAmplitude}
        noiseScale={noiseScale}
        chromaticSpread={chromaticSpread}
        mouseAnimation={reduce ? false : mouseAnimation}
        distortion={distortion}
        contour={contour}
        tintColor={tintColor}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onUnavailable={() => setWebgl('unavailable')}
      />
      <p className="metallic-paint-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
