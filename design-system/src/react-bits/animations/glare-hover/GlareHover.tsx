import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGlareHover from '../../vendor/animations/glare-hover/GlareHover';
import { GLARE_HOVER_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './glare-hover.css';

export type GlareHoverProps = {
  width?: (typeof GLARE_HOVER_DEFAULTS)['width'];
  height?: (typeof GLARE_HOVER_DEFAULTS)['height'];
  background?: (typeof GLARE_HOVER_DEFAULTS)['background'];
  borderRadius?: (typeof GLARE_HOVER_DEFAULTS)['borderRadius'];
  borderColor?: (typeof GLARE_HOVER_DEFAULTS)['borderColor'];
  glareColor?: (typeof GLARE_HOVER_DEFAULTS)['glareColor'];
  glareOpacity?: (typeof GLARE_HOVER_DEFAULTS)['glareOpacity'];
  glareAngle?: (typeof GLARE_HOVER_DEFAULTS)['glareAngle'];
  glareSize?: (typeof GLARE_HOVER_DEFAULTS)['glareSize'];
  transitionDuration?: (typeof GLARE_HOVER_DEFAULTS)['transitionDuration'];
  playOnce?: (typeof GLARE_HOVER_DEFAULTS)['playOnce'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[2];

export function GlareHover({
  width = GLARE_HOVER_DEFAULTS.width,
  height = GLARE_HOVER_DEFAULTS.height,
  background = GLARE_HOVER_DEFAULTS.background,
  borderRadius = GLARE_HOVER_DEFAULTS.borderRadius,
  borderColor = GLARE_HOVER_DEFAULTS.borderColor,
  glareColor = GLARE_HOVER_DEFAULTS.glareColor,
  glareOpacity = GLARE_HOVER_DEFAULTS.glareOpacity,
  glareAngle = GLARE_HOVER_DEFAULTS.glareAngle,
  glareSize = GLARE_HOVER_DEFAULTS.glareSize,
  transitionDuration = GLARE_HOVER_DEFAULTS.transitionDuration,
  playOnce = GLARE_HOVER_DEFAULTS.playOnce,
  reducedMotion = GLARE_HOVER_DEFAULTS.reducedMotion,
}: GlareHoverProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Glare Hover"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A CSS <code>::before</code> gradient sweeps from{' '}
              <code>-100% -100%</code> to <code>100% 100%</code> on hover, at
              angle <code>{glareAngle}</code> deg over <code>{transitionDuration}</code>{' '}
              ms. Background is brand ink; upstream was <code>#000</code>. Glare
              is paper; upstream was <code>#ffffff</code>.
            </>
          }
          controls="Pause freezes the sweep and ignores new pointer entry. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused is local. The card is Tools from src/pages/content.ts. Width 500px is the upstream default; the wrapper caps it to the stage."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setHover(false);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="glare-hover-stage"
      stageTestId="glare-hover-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-hover': hover ? 'true' : 'false',
        'data-play-once': playOnce ? 'true' : 'false',
      }}
    >
      <div
        onPointerEnter={() => {
          if (!paused) setHover(true);
        }}
        onPointerLeave={() => setHover(false)}
      >
        <UpstreamGlareHover
          key={run}
          width={width}
          height={height}
          background={background}
          borderRadius={borderRadius}
          borderColor={borderColor}
          glareColor={glareColor}
          glareOpacity={glareOpacity}
          glareAngle={glareAngle}
          glareSize={glareSize}
          transitionDuration={reduce ? 0 : transitionDuration}
          playOnce={playOnce}
          paused={paused}
        >
          <div className="glare-hover-copy">
            <img src={CARD.photo.src} alt={CARD.photo.alt} width={640} height={400} />
            <p className="glare-hover-kicker">{CARD.kicker}</p>
            <p className="glare-hover-title">{CARD.title}</p>
            <p>{CARD.copy}</p>
          </div>
        </UpstreamGlareHover>
      </div>
    </ReactBitsFrame>
  );
}
