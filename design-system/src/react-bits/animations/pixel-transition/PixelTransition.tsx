import { useState } from 'react';

import { FEATURES, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPixelTransition from '../../vendor/animations/pixel-transition/PixelTransition';
import { PIXEL_TRANSITION_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './pixel-transition.css';

export type PixelTransitionProps = {
  gridSize?: (typeof PIXEL_TRANSITION_DEFAULTS)['gridSize'];
  pixelColor?: (typeof PIXEL_TRANSITION_DEFAULTS)['pixelColor'];
  animationStepDuration?: (typeof PIXEL_TRANSITION_DEFAULTS)['animationStepDuration'];
  once?: (typeof PIXEL_TRANSITION_DEFAULTS)['once'];
  aspectRatio?: (typeof PIXEL_TRANSITION_DEFAULTS)['aspectRatio'];
  reducedMotion?: ReducedMotionMode;
};

const FIRST = FEATURES[3];
const SECOND = FEATURES[4];

export function PixelTransition({
  gridSize = PIXEL_TRANSITION_DEFAULTS.gridSize,
  pixelColor = PIXEL_TRANSITION_DEFAULTS.pixelColor,
  animationStepDuration = PIXEL_TRANSITION_DEFAULTS.animationStepDuration,
  once = PIXEL_TRANSITION_DEFAULTS.once,
  aspectRatio = PIXEL_TRANSITION_DEFAULTS.aspectRatio,
  reducedMotion = PIXEL_TRANSITION_DEFAULTS.reducedMotion,
}: PixelTransitionProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Pixel Transition"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A <code>{gridSize}</code> by <code>{gridSize}</code> overlay of
              brand-yellow pixels staggers in with gsap, then reveals the second
              photograph.
            </>
          }
          controls="Pause skips new swaps. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="firstContent and secondContent are Academy photographs from src/pages/content.ts. paused, reduced, and onActive are local. pixelColor default is brand accent yellow #DEF54F (upstream currentColor)."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setActive(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="pixel-transition-stage"
      stageTestId="pixel-transition-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': active || reduce ? 'true' : 'false',
      }}
    >
      <UpstreamPixelTransition
        key={run}
        firstContent={
          <img className="pixel-transition-photo" src={PHOTOS.night.src} alt={PHOTOS.night.alt} />
        }
        secondContent={
          <>
            <img className="pixel-transition-photo" src={PHOTOS.run.src} alt={PHOTOS.run.alt} />
            <p className="pixel-transition-label">{SECOND.title}</p>
          </>
        }
        gridSize={gridSize}
        pixelColor={pixelColor}
        animationStepDuration={reduce ? 0 : animationStepDuration}
        once={once}
        aspectRatio={aspectRatio}
        paused={paused || reduce}
        reduced={reduce}
        onActive={setActive}
      />
      <p className="pixel-transition-copy">
        {FIRST.kicker}. {FIRST.title}. {SECOND.kicker}. {SECOND.title}.
      </p>
    </ReactBitsFrame>
  );
}
