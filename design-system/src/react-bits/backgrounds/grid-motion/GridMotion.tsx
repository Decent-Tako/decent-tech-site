import { useState } from 'react';

import { FEATURES, HERO, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGridMotion from '../../vendor/backgrounds/grid-motion/GridMotion';
import { GRID_MOTION_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './grid-motion.css';

export type GridMotionProps = {
  gradientColor?: string;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[1];

const GRID_ITEMS = [
  PHOTOS.hero.src,
  FEATURES[0].title,
  PHOTOS.crowd.src,
  FEATURES[1].title,
  PHOTOS.community.src,
  FEATURES[2].title,
  PHOTOS.run.src,
  FEATURES[3].title,
  PHOTOS.night.src,
  FEATURES[4].title,
  FEATURES[0].kicker,
  PHOTOS.hero.src,
  FEATURES[1].kicker,
  PHOTOS.crowd.src,
  FEATURES[2].kicker,
  PHOTOS.community.src,
  FEATURES[3].kicker,
  PHOTOS.run.src,
  FEATURES[4].kicker,
  PHOTOS.night.src,
  HERO.facts[0].value,
  PHOTOS.hero.src,
  HERO.facts[1].value,
  PHOTOS.crowd.src,
  HERO.facts[2].value,
  PHOTOS.community.src,
  FEATURES[0].copy.slice(0, 24),
  PHOTOS.run.src,
];

export function GridMotion({
  gradientColor = GRID_MOTION_DEFAULTS.gradientColor,
  reducedMotion = GRID_MOTION_DEFAULTS.reducedMotion,
}: GridMotionProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Grid Motion"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Four gsap rows inertia-slide from pointer X. Odd rows move the
              other way. Cells hold Academy photographs and copy.
            </>
          }
          controls="Pause holds the gsap ticker updates. Replay remounts the grid. Reduced motion holds the rows."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items, paused, and onReady are not controls. Photographs come from public/photos/ through publicAsset(). Copy comes from src/pages/content.ts. Colour default is brand ink #212121 (upstream black). Pointer listeners bind to the grid, not window."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setReady(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="grid-motion-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-ready': ready ? 'true' : 'false',
        'data-speed': reduce ? '0' : '1',
      }}
    >
      <div className="grid-motion-fill">
        <UpstreamGridMotion
          key={run}
          items={GRID_ITEMS}
          gradientColor={gradientColor}
          paused={paused || reduce}
          onReady={() => setReady(true)}
        />
      </div>
      <p className="grid-motion__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
