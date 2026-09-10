import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMorphSlider from '../../vendor/components/morph-slider/MorphSlider';
import {
  MORPH_SLIDER_DEFAULTS,
  type MorphTransition,
  REACT_BITS_SOURCE,
} from './source';

import './morph-slider.css';

export type MorphSliderProps = {
  startIndex?: number;
  transition?: MorphTransition;
  duration?: number;
  ease?: string;
  intensity?: number;
  scale?: number;
  aberration?: number;
  drift?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  radius?: number;
  overlayColor?: string;
  showCaptions?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = FEATURES.map((feature) => ({
  image: feature.photo.src,
  caption: `${feature.kicker}. ${feature.title}.`,
}));

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function MorphSlider({
  startIndex = MORPH_SLIDER_DEFAULTS.startIndex,
  transition = MORPH_SLIDER_DEFAULTS.transition,
  duration = MORPH_SLIDER_DEFAULTS.duration,
  ease = MORPH_SLIDER_DEFAULTS.ease,
  intensity = MORPH_SLIDER_DEFAULTS.intensity,
  scale = MORPH_SLIDER_DEFAULTS.scale,
  aberration = MORPH_SLIDER_DEFAULTS.aberration,
  drift = MORPH_SLIDER_DEFAULTS.drift,
  autoplay = MORPH_SLIDER_DEFAULTS.autoplay,
  autoplayDelay = MORPH_SLIDER_DEFAULTS.autoplayDelay,
  loop = MORPH_SLIDER_DEFAULTS.loop,
  radius = MORPH_SLIDER_DEFAULTS.radius,
  overlayColor = MORPH_SLIDER_DEFAULTS.overlayColor,
  showCaptions = MORPH_SLIDER_DEFAULTS.showCaptions,
  showControls = MORPH_SLIDER_DEFAULTS.showControls,
  showIndicators = MORPH_SLIDER_DEFAULTS.showIndicators,
  reducedMotion = MORPH_SLIDER_DEFAULTS.reducedMotion,
}: MorphSliderProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [index, setIndex] = useState(startIndex);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Morph Slider"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl shader morphs one photograph into the next with transition{' '}
              <code>{transition}</code> over <code>{duration}</code> s.
            </>
          }
          controls="Pause holds the rAF loop. Replay remounts the slider on the first slide."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items is not a control. Photographs are FEATURES through publicAsset(). overlayColor is ink. Upstream default #000000. preserveDrawingBuffer is on so play can sample the canvas."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setIndex(startIndex);
        setPaused(false);
        setWebgl(probeWebgl());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="morph-slider-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-index': String(index),
        'data-transition': transition,
      }}
    >
      {webgl === 'unavailable' ? null : (
        <UpstreamMorphSlider
          key={run}
          items={ITEMS}
          startIndex={startIndex}
          transition={transition}
          duration={reduce ? 0.01 : duration}
          ease={ease}
          intensity={intensity}
          scale={scale}
          aberration={aberration}
          drift={reduce ? 0 : drift}
          autoplay={!paused && !reduce && autoplay}
          autoplayDelay={autoplayDelay}
          loop={loop}
          radius={radius}
          overlayColor={overlayColor}
          showCaptions={showCaptions}
          showControls={showControls}
          showIndicators={showIndicators}
          paused={paused}
          reducedMotion={reduce}
          onReady={() => setWebgl('ready')}
          onIndexChange={setIndex}
        />
      )}
    </ReactBitsFrame>
  );
}
