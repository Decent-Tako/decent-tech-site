import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMasonry from '../../vendor/components/masonry/Masonry';
import { MASONRY_DEFAULTS, type MasonryFrom, REACT_BITS_SOURCE } from './source';

import './masonry.css';

export type MasonryProps = {
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: MasonryFrom;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const HEIGHTS = [520, 720, 480, 640, 560];

const ITEMS = FEATURES.map((feature, index) => ({
  id: feature.id,
  img: feature.photo.src,
  url: `#${feature.id}`,
  height: HEIGHTS[index] ?? 500,
  label: feature.title,
}));

export function Masonry({
  ease = MASONRY_DEFAULTS.ease,
  duration = MASONRY_DEFAULTS.duration,
  stagger = MASONRY_DEFAULTS.stagger,
  animateFrom = MASONRY_DEFAULTS.animateFrom,
  scaleOnHover = MASONRY_DEFAULTS.scaleOnHover,
  hoverScale = MASONRY_DEFAULTS.hoverScale,
  blurToFocus = MASONRY_DEFAULTS.blurToFocus,
  colorShiftOnHover = MASONRY_DEFAULTS.colorShiftOnHover,
  reducedMotion = MASONRY_DEFAULTS.reducedMotion,
}: MasonryProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState('');
  const reduce = useReduce(reducedMotion);

  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  const motion = reduce
    ? { duration: 0, stagger: 0, blurToFocus: false, scaleOnHover: false }
    : { duration, stagger, blurToFocus, scaleOnHover };

  return (
    <ReactBitsFrame
      title="Masonry"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Tiles enter from <code>{animateFrom}</code> with gsap over{' '}
              <code>{duration}</code> s, stagger <code>{stagger}</code>. Hover
              scales to <code>{hoverScale}</code>.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items and onItemClick are not controls. Photographs are FEATURES through publicAsset(). Clicks do not open a new page. The color overlay uses accent blue and accent yellow."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setActive('');
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="masonry-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': active,
        'data-from': animateFrom,
        'data-color-shift': colorShiftOnHover ? 'true' : 'false',
      }}
    >
      <UpstreamMasonry
        key={run}
        items={ITEMS}
        ease={ease}
        duration={motion.duration}
        stagger={motion.stagger}
        animateFrom={animateFrom}
        scaleOnHover={motion.scaleOnHover}
        hoverScale={hoverScale}
        blurToFocus={motion.blurToFocus}
        colorShiftOnHover={colorShiftOnHover}
        onItemClick={(item) => setActive(item.id)}
      />
    </ReactBitsFrame>
  );
}
