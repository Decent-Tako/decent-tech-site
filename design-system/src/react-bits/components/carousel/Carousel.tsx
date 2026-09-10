import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCarousel from '../../vendor/components/carousel/Carousel';
import { CAROUSEL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './carousel.css';

export type CarouselProps = {
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = FEATURES.map((feature, index) => ({
  id: index + 1,
  title: feature.title,
  description: feature.copy,
  icon: (
    <span className="carousel-icon" aria-hidden="true">
      {feature.index}
    </span>
  ),
}));

export function Carousel({
  baseWidth = CAROUSEL_DEFAULTS.baseWidth,
  autoplay = CAROUSEL_DEFAULTS.autoplay,
  autoplayDelay = CAROUSEL_DEFAULTS.autoplayDelay,
  pauseOnHover = CAROUSEL_DEFAULTS.pauseOnHover,
  loop = CAROUSEL_DEFAULTS.loop,
  round = CAROUSEL_DEFAULTS.round,
  reducedMotion = CAROUSEL_DEFAULTS.reducedMotion,
}: CarouselProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [index, setIndex] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Carousel"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A motion spring slides the track on <code>x</code> and tilts each card
              on <code>rotateY</code>. Drag, dots, and optional autoplay change the
              active slide. Width <code>{baseWidth}</code> px.
            </>
          }
          controls="Pause clears the autoplay interval. Replay remounts the track."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The five slides are Start, Learn, Tools, Challenge week, and Street from FEATURES in src/pages/content.ts. items, paused, instant, and onIndexChange are not controls. instant is a local prop for reduced motion."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setIndex(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="carousel-stage"
      stageClassName="rb-frame__stage--ink"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-index': String(index),
        'data-loop': loop ? 'true' : 'false',
        'data-round': round ? 'true' : 'false',
      }}
    >
      <UpstreamCarousel
        key={run}
        items={ITEMS}
        baseWidth={baseWidth}
        autoplay={reduce ? false : autoplay}
        autoplayDelay={autoplayDelay}
        pauseOnHover={pauseOnHover}
        loop={loop}
        round={round}
        paused={paused || reduce}
        instant={reduce}
        onIndexChange={setIndex}
      />
    </ReactBitsFrame>
  );
}
