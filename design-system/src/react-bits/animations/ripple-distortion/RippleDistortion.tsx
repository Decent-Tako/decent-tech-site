import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamRippleDistortion from '../../vendor/animations/ripple-distortion/RippleDistortion';
import { RIPPLE_DISTORTION_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './ripple-distortion.css';

export type RippleDistortionProps = {
  brushSize?: (typeof RIPPLE_DISTORTION_DEFAULTS)['brushSize'];
  strength?: (typeof RIPPLE_DISTORTION_DEFAULTS)['strength'];
  swirl?: (typeof RIPPLE_DISTORTION_DEFAULTS)['swirl'];
  rings?: (typeof RIPPLE_DISTORTION_DEFAULTS)['rings'];
  spread?: (typeof RIPPLE_DISTORTION_DEFAULTS)['spread'];
  fade?: (typeof RIPPLE_DISTORTION_DEFAULTS)['fade'];
  spacing?: (typeof RIPPLE_DISTORTION_DEFAULTS)['spacing'];
  dispersion?: (typeof RIPPLE_DISTORTION_DEFAULTS)['dispersion'];
  glint?: (typeof RIPPLE_DISTORTION_DEFAULTS)['glint'];
  tint?: (typeof RIPPLE_DISTORTION_DEFAULTS)['tint'];
  tintAmount?: (typeof RIPPLE_DISTORTION_DEFAULTS)['tintAmount'];
  grayscale?: (typeof RIPPLE_DISTORTION_DEFAULTS)['grayscale'];
  highlightColor?: (typeof RIPPLE_DISTORTION_DEFAULTS)['highlightColor'];
  trigger?: (typeof RIPPLE_DISTORTION_DEFAULTS)['trigger'];
  clickStrength?: (typeof RIPPLE_DISTORTION_DEFAULTS)['clickStrength'];
  quality?: (typeof RIPPLE_DISTORTION_DEFAULTS)['quality'];
  enabled?: (typeof RIPPLE_DISTORTION_DEFAULTS)['enabled'];
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

const CARD = FEATURES[1];

export function RippleDistortion({
  brushSize = RIPPLE_DISTORTION_DEFAULTS.brushSize,
  strength = RIPPLE_DISTORTION_DEFAULTS.strength,
  swirl = RIPPLE_DISTORTION_DEFAULTS.swirl,
  rings = RIPPLE_DISTORTION_DEFAULTS.rings,
  spread = RIPPLE_DISTORTION_DEFAULTS.spread,
  fade = RIPPLE_DISTORTION_DEFAULTS.fade,
  spacing = RIPPLE_DISTORTION_DEFAULTS.spacing,
  dispersion = RIPPLE_DISTORTION_DEFAULTS.dispersion,
  glint = RIPPLE_DISTORTION_DEFAULTS.glint,
  tint = RIPPLE_DISTORTION_DEFAULTS.tint,
  tintAmount = RIPPLE_DISTORTION_DEFAULTS.tintAmount,
  grayscale = RIPPLE_DISTORTION_DEFAULTS.grayscale,
  highlightColor = RIPPLE_DISTORTION_DEFAULTS.highlightColor,
  trigger = RIPPLE_DISTORTION_DEFAULTS.trigger,
  clickStrength = RIPPLE_DISTORTION_DEFAULTS.clickStrength,
  quality = RIPPLE_DISTORTION_DEFAULTS.quality,
  enabled = RIPPLE_DISTORTION_DEFAULTS.enabled,
  reducedMotion = RIPPLE_DISTORTION_DEFAULTS.reducedMotion,
}: RippleDistortionProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Ripple Distortion"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl displacement field pushes the Learn photograph. Hover or
              click drops waves of size <code>{brushSize}</code> with strength{' '}
              <code>{strength}</code> and <code>{rings}</code> rings.
            </>
          }
          controls="Pause freezes the waves. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="src is the Learn photograph from src/pages/content.ts, so it is not a control. className and style are not controls. paused, seedRipple, onReady, and onUnavailable are local. preserveDrawingBuffer is on so the play can read pixels. Tint default is brand blue #0035B1 (upstream #a855f7). Highlight default is brand paper #FFFFFF (upstream #ffffff)."
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
      stageClassName="rb-frame__stage--ink ripple-distortion-stage"
      stageTestId="ripple-distortion-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-trigger': trigger,
        'data-grayscale': grayscale ? 'true' : 'false',
      }}
    >
      <UpstreamRippleDistortion
        key={run}
        src={CARD.photo.src}
        brushSize={brushSize}
        strength={strength}
        swirl={swirl}
        rings={rings}
        spread={spread}
        fade={fade}
        spacing={spacing}
        dispersion={dispersion}
        glint={glint}
        tint={tint}
        tintAmount={tintAmount}
        grayscale={grayscale}
        highlightColor={highlightColor}
        trigger={trigger}
        clickStrength={clickStrength}
        quality={quality}
        enabled={enabled}
        paused={paused || reduce}
        seedRipple
        onReady={() => setWebgl('ready')}
        onUnavailable={() => setWebgl('unavailable')}
      />
      <p className="ripple-distortion-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
