import { useState } from 'react';

import { PAGE_NAV } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGooeyNav from '../../vendor/components/gooey-nav/GooeyNav';
import { GOOEY_NAV_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './gooey-nav.css';

export type GooeyNavProps = {
  animationTime?: number;
  particleCount?: number;
  particleDistanceStart?: number;
  particleDistanceEnd?: number;
  particleR?: number;
  timeVariance?: number;
  initialActiveIndex?: number;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = PAGE_NAV.map((item) => ({
  label: item.label,
  href: `#${item.id}`,
}));

export function GooeyNav({
  animationTime = GOOEY_NAV_DEFAULTS.animationTime,
  particleCount = GOOEY_NAV_DEFAULTS.particleCount,
  particleDistanceStart = GOOEY_NAV_DEFAULTS.particleDistanceStart,
  particleDistanceEnd = GOOEY_NAV_DEFAULTS.particleDistanceEnd,
  particleR = GOOEY_NAV_DEFAULTS.particleR,
  timeVariance = GOOEY_NAV_DEFAULTS.timeVariance,
  initialActiveIndex = GOOEY_NAV_DEFAULTS.initialActiveIndex,
  reducedMotion = GOOEY_NAV_DEFAULTS.reducedMotion,
}: GooeyNavProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(initialActiveIndex);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Gooey Nav"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A click moves a gooey pill and spawns <code>{particleCount}</code>{' '}
              particles over <code>{animationTime}</code> ms. Distances{' '}
              <code>{particleDistanceStart}</code>/<code>{particleDistanceEnd}</code>.
            </>
          }
          controls="Pause holds particle CSS animations. Replay remounts the nav on the first item."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items and colors are not controls. Labels are PAGE_NAV from src/pages/content.ts. Particle colour indices stay at the upstream default and map to brand CSS variables. particleDistances is split into start and end. The wrapper calls preventDefault on the links so Storybook does not change the hash."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setActive(initialActiveIndex);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="gooey-nav-stage"
      stageClassName="rb-frame__stage--ink"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': String(active),
        'data-particles': String(reduce ? 0 : particleCount),
      }}
    >
      <div
        className={['gooey-nav-stage', paused ? 'gooey-nav-stage--paused' : '']
          .filter(Boolean)
          .join(' ')}
        onClickCapture={(event) => {
          const link = (event.target as HTMLElement).closest('a');
          if (!link) return;
          event.preventDefault();
          const label = link.textContent?.trim() ?? '';
          const index = ITEMS.findIndex((item) => item.label === label);
          if (index >= 0) setActive(index);
        }}
      >
        <UpstreamGooeyNav
          key={run}
          items={ITEMS}
          animationTime={reduce ? 0 : animationTime}
          particleCount={reduce ? 0 : particleCount}
          particleDistances={[particleDistanceStart, particleDistanceEnd]}
          particleR={particleR}
          timeVariance={reduce ? 0 : timeVariance}
          initialActiveIndex={initialActiveIndex}
        />
      </div>
    </ReactBitsFrame>
  );
}
