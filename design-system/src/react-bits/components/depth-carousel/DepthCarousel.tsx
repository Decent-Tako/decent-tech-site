import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDepthCarousel from '../../vendor/components/depth-carousel/DepthCarousel';
import { DEPTH_CAROUSEL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './depth-carousel.css';

export type DepthCarouselProps = {
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: (typeof DEPTH_CAROUSEL_DEFAULTS)['tiltDirection'];
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = FEATURES.map((feature) => ({
  image: feature.photo.src,
  alt: feature.photo.alt,
}));

export function DepthCarousel({
  cardWidth = DEPTH_CAROUSEL_DEFAULTS.cardWidth,
  cardHeight = DEPTH_CAROUSEL_DEFAULTS.cardHeight,
  radius = DEPTH_CAROUSEL_DEFAULTS.radius,
  tint = DEPTH_CAROUSEL_DEFAULTS.tint,
  depth = DEPTH_CAROUSEL_DEFAULTS.depth,
  spread = DEPTH_CAROUSEL_DEFAULTS.spread,
  tilt = DEPTH_CAROUSEL_DEFAULTS.tilt,
  tiltDirection = DEPTH_CAROUSEL_DEFAULTS.tiltDirection,
  perspective = DEPTH_CAROUSEL_DEFAULTS.perspective,
  visibleCards = DEPTH_CAROUSEL_DEFAULTS.visibleCards,
  falloff = DEPTH_CAROUSEL_DEFAULTS.falloff,
  blur = DEPTH_CAROUSEL_DEFAULTS.blur,
  duration = DEPTH_CAROUSEL_DEFAULTS.duration,
  ease = DEPTH_CAROUSEL_DEFAULTS.ease,
  autoplay = DEPTH_CAROUSEL_DEFAULTS.autoplay,
  autoplayDelay = DEPTH_CAROUSEL_DEFAULTS.autoplayDelay,
  loop = DEPTH_CAROUSEL_DEFAULTS.loop,
  showControls = DEPTH_CAROUSEL_DEFAULTS.showControls,
  showIndicators = DEPTH_CAROUSEL_DEFAULTS.showIndicators,
  reducedMotion = DEPTH_CAROUSEL_DEFAULTS.reducedMotion,
}: DepthCarouselProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [index, setIndex] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Depth Carousel"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A gsap tween recedes cards on a 3D rail: <code>translateZ</code>{' '}
              <code>{depth}</code>, spread <code>{spread}</code>, tilt{' '}
              <code>{tilt}</code>. Arrows, dots, drag, and optional autoplay
              change the front card.
            </>
          }
          controls="Pause kills the rail tween and autoplay. Replay remounts the stack."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items, onChange, className, paused, and instant are not controls. The five photographs are from FEATURES through publicAsset(). tint default is brand ink #212121 (upstream #05060a)."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
      replay
      onReplay={() => {
        setRun((current) => current + 1);
        setIndex(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="depth-carousel-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-index': String(index),
        'data-tilt': tiltDirection,
        'data-loop': loop ? 'true' : 'false',
      }}
    >
      <UpstreamDepthCarousel
        key={run}
        items={ITEMS}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        radius={radius}
        tint={tint}
        depth={depth}
        spread={spread}
        tilt={tilt}
        tiltDirection={tiltDirection}
        perspective={perspective}
        visibleCards={visibleCards}
        falloff={falloff}
        blur={blur}
        duration={reduce ? 0 : duration}
        ease={ease}
        autoplay={reduce ? false : autoplay}
        autoplayDelay={autoplayDelay}
        loop={loop}
        showControls={showControls}
        showIndicators={showIndicators}
        paused={paused}
        instant={reduce}
        onChange={setIndex}
      />
    </ReactBitsFrame>
  );
}
