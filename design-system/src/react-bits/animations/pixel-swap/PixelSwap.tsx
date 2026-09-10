import { useState } from 'react';

import { FEATURES, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPixelSwap from '../../vendor/animations/pixel-swap/PixelSwap';
import { PIXEL_SWAP_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './pixel-swap.css';

export type PixelSwapProps = {
  pixelSize?: (typeof PIXEL_SWAP_DEFAULTS)['pixelSize'];
  gap?: (typeof PIXEL_SWAP_DEFAULTS)['gap'];
  pixelRadius?: (typeof PIXEL_SWAP_DEFAULTS)['pixelRadius'];
  pixelSpin?: (typeof PIXEL_SWAP_DEFAULTS)['pixelSpin'];
  pixelScale?: (typeof PIXEL_SWAP_DEFAULTS)['pixelScale'];
  fade?: (typeof PIXEL_SWAP_DEFAULTS)['fade'];
  duration?: (typeof PIXEL_SWAP_DEFAULTS)['duration'];
  pixelDuration?: (typeof PIXEL_SWAP_DEFAULTS)['pixelDuration'];
  pattern?: (typeof PIXEL_SWAP_DEFAULTS)['pattern'];
  randomness?: (typeof PIXEL_SWAP_DEFAULTS)['randomness'];
  easing?: (typeof PIXEL_SWAP_DEFAULTS)['easing'];
  trigger?: (typeof PIXEL_SWAP_DEFAULTS)['trigger'];
  initialActive?: (typeof PIXEL_SWAP_DEFAULTS)['initialActive'];
  aspectRatio?: (typeof PIXEL_SWAP_DEFAULTS)['aspectRatio'];
  reducedMotion?: ReducedMotionMode;
};

const FIRST = FEATURES[0];
const SECOND = FEATURES[1];

export function PixelSwap({
  pixelSize = PIXEL_SWAP_DEFAULTS.pixelSize,
  gap = PIXEL_SWAP_DEFAULTS.gap,
  pixelRadius = PIXEL_SWAP_DEFAULTS.pixelRadius,
  pixelSpin = PIXEL_SWAP_DEFAULTS.pixelSpin,
  pixelScale = PIXEL_SWAP_DEFAULTS.pixelScale,
  fade = PIXEL_SWAP_DEFAULTS.fade,
  duration = PIXEL_SWAP_DEFAULTS.duration,
  pixelDuration = PIXEL_SWAP_DEFAULTS.pixelDuration,
  pattern = PIXEL_SWAP_DEFAULTS.pattern,
  randomness = PIXEL_SWAP_DEFAULTS.randomness,
  easing = PIXEL_SWAP_DEFAULTS.easing,
  trigger = PIXEL_SWAP_DEFAULTS.trigger,
  initialActive = PIXEL_SWAP_DEFAULTS.initialActive,
  aspectRatio = PIXEL_SWAP_DEFAULTS.aspectRatio,
  reducedMotion = PIXEL_SWAP_DEFAULTS.reducedMotion,
}: PixelSwapProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(initialActive);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Pixel Swap"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A grid of pixel windows clones the incoming photograph with pattern{' '}
              <code>{pattern}</code> over <code>{duration}</code> ms.
            </>
          }
          controls="Pause skips new swaps. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="firstContent and secondContent are Academy photographs from src/pages/content.ts. active, onActiveChange, and onComplete are not controls. paused is local."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setActive(initialActive);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="pixel-swap-stage"
      stageTestId="pixel-swap-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': active || reduce ? 'true' : 'false',
      }}
    >
      <UpstreamPixelSwap
        key={run}
        firstContent={
          <img className="pixel-swap-photo" src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} />
        }
        secondContent={
          <img className="pixel-swap-photo" src={PHOTOS.crowd.src} alt={PHOTOS.crowd.alt} />
        }
        pixelSize={pixelSize}
        gap={gap}
        pixelRadius={pixelRadius}
        pixelSpin={pixelSpin}
        pixelScale={pixelScale}
        fade={fade}
        duration={reduce ? 0 : duration}
        pixelDuration={reduce ? 0 : pixelDuration}
        pattern={pattern}
        randomness={randomness}
        easing={easing}
        trigger={reduce ? 'manual' : trigger}
        initialActive={reduce ? true : initialActive}
        active={reduce ? true : undefined}
        aspectRatio={aspectRatio}
        paused={paused || reduce}
        onActiveChange={setActive}
      />
      <p className="pixel-swap-copy">
        {FIRST.kicker}. {FIRST.title}. {SECOND.kicker}. {SECOND.title}.
      </p>
    </ReactBitsFrame>
  );
}
