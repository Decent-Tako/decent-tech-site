import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamHalftoneReveal from '../../vendor/animations/halftone-reveal/HalftoneReveal';
import { HALFTONE_REVEAL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './halftone-reveal.css';

export type HalftoneRevealProps = {
  inkColor?: (typeof HALFTONE_REVEAL_DEFAULTS)['inkColor'];
  paperColor?: (typeof HALFTONE_REVEAL_DEFAULTS)['paperColor'];
  mode?: (typeof HALFTONE_REVEAL_DEFAULTS)['mode'];
  dotSize?: (typeof HALFTONE_REVEAL_DEFAULTS)['dotSize'];
  dotDensity?: (typeof HALFTONE_REVEAL_DEFAULTS)['dotDensity'];
  angle?: (typeof HALFTONE_REVEAL_DEFAULTS)['angle'];
  shape?: (typeof HALFTONE_REVEAL_DEFAULTS)['shape'];
  contrast?: (typeof HALFTONE_REVEAL_DEFAULTS)['contrast'];
  invert?: (typeof HALFTONE_REVEAL_DEFAULTS)['invert'];
  revealRadius?: (typeof HALFTONE_REVEAL_DEFAULTS)['revealRadius'];
  edge?: (typeof HALFTONE_REVEAL_DEFAULTS)['edge'];
  follow?: (typeof HALFTONE_REVEAL_DEFAULTS)['follow'];
  idleReveal?: (typeof HALFTONE_REVEAL_DEFAULTS)['idleReveal'];
  trigger?: (typeof HALFTONE_REVEAL_DEFAULTS)['trigger'];
  borderRadius?: (typeof HALFTONE_REVEAL_DEFAULTS)['borderRadius'];
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[0];

export function HalftoneReveal({
  inkColor = HALFTONE_REVEAL_DEFAULTS.inkColor,
  paperColor = HALFTONE_REVEAL_DEFAULTS.paperColor,
  mode = HALFTONE_REVEAL_DEFAULTS.mode,
  dotSize = HALFTONE_REVEAL_DEFAULTS.dotSize,
  dotDensity = HALFTONE_REVEAL_DEFAULTS.dotDensity,
  angle = HALFTONE_REVEAL_DEFAULTS.angle,
  shape = HALFTONE_REVEAL_DEFAULTS.shape,
  contrast = HALFTONE_REVEAL_DEFAULTS.contrast,
  invert = HALFTONE_REVEAL_DEFAULTS.invert,
  revealRadius = HALFTONE_REVEAL_DEFAULTS.revealRadius,
  edge = HALFTONE_REVEAL_DEFAULTS.edge,
  follow = HALFTONE_REVEAL_DEFAULTS.follow,
  idleReveal = HALFTONE_REVEAL_DEFAULTS.idleReveal,
  trigger = HALFTONE_REVEAL_DEFAULTS.trigger,
  borderRadius = HALFTONE_REVEAL_DEFAULTS.borderRadius,
  reducedMotion = HALFTONE_REVEAL_DEFAULTS.reducedMotion,
}: HalftoneRevealProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Halftone Reveal"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL2 sketch prints the photograph as a {shape} halftone in
              mode <code>{mode}</code>. Pointer hover opens a loupe of radius{' '}
              <code>{revealRadius}</code> that shows the sharp image. Ink is brand
              ink; upstream was <code>#141414</code>. Paper is brand paper; upstream
              was <code>#fff7e6</code>.
            </>
          }
          controls="Pause stops the frame loop and keeps the last frame. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="src is the Week 0 photograph from src/pages/content.ts, so it is not a control. paused, onReady, and onUnavailable are local. preserveDrawingBuffer is on so the play can read pixels. The remote picsum default is not used."
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
      stageClassName="halftone-reveal-stage"
      stageTestId="halftone-reveal-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-mode': mode,
        'data-shape': shape,
        'data-trigger': reduce ? 'off' : trigger,
      }}
    >
      <div className="halftone-reveal-host">
        <UpstreamHalftoneReveal
          key={run}
          src={CARD.photo.src}
          inkColor={inkColor}
          paperColor={paperColor}
          mode={mode}
          dotSize={dotSize}
          dotDensity={dotDensity}
          angle={angle}
          shape={shape}
          contrast={contrast}
          invert={invert}
          revealRadius={revealRadius}
          edge={edge}
          follow={follow}
          idleReveal={reduce ? 1 : idleReveal}
          trigger={reduce ? 'off' : trigger}
          borderRadius={borderRadius}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onUnavailable={() => setWebgl('unavailable')}
        />
      </div>
      <p className="halftone-reveal-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
