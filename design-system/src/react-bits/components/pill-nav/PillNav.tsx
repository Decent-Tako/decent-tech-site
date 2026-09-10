import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { PAGE_NAV } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPillNav from '../../vendor/components/pill-nav/PillNav';
import { PILL_NAV_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './pill-nav.css';

const LOGO_URL = new URL('./logo.svg', import.meta.url).href;

export type PillNavProps = {
  logoAlt?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  initialLoadAnimation?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = PAGE_NAV.map((item) => ({
  label: item.label,
  href: `#${item.id}`,
}));

export function PillNav({
  logoAlt = PILL_NAV_DEFAULTS.logoAlt,
  ease = PILL_NAV_DEFAULTS.ease,
  baseColor = PILL_NAV_DEFAULTS.baseColor,
  pillColor = PILL_NAV_DEFAULTS.pillColor,
  hoveredPillTextColor = PILL_NAV_DEFAULTS.hoveredPillTextColor,
  pillTextColor = PILL_NAV_DEFAULTS.pillTextColor,
  initialLoadAnimation = PILL_NAV_DEFAULTS.initialLoadAnimation,
  reducedMotion = PILL_NAV_DEFAULTS.reducedMotion,
}: PillNavProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [activeHref, setActiveHref] = useState(ITEMS[0].href);
  const reduce = useReduce(reducedMotion);

  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  return (
    <ReactBitsFrame
      title="Pill Nav"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Hover plays a gsap circle wipe on each pill with ease{' '}
              <code>{ease}</code>. The logo spins once on enter.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the nav on the first item."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="logo, items, activeHref, className, and onMobileMenuClick are not controls. Labels are PAGE_NAV. Href values are hashes so the story uses a plain anchor, not a router Link. Colours map to paper and ink. Upstream pill was #120F17. The wrapper calls preventDefault on the links so Storybook does not change the hash."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setActiveHref(ITEMS[0].href);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="pill-nav-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': activeHref,
        'data-load': reduce ? 'false' : initialLoadAnimation ? 'true' : 'false',
      }}
    >
      <div
        className="pill-nav-stage"
        onClickCapture={(event) => {
          const link = (event.target as HTMLElement).closest('a');
          if (!link) return;
          event.preventDefault();
          const href = link.getAttribute('href');
          if (href) setActiveHref(href);
        }}
      >
        <UpstreamPillNav
          key={run}
          logo={LOGO_URL}
          logoAlt={logoAlt}
          items={ITEMS}
          activeHref={activeHref}
          ease={ease}
          baseColor={baseColor}
          pillColor={pillColor}
          hoveredPillTextColor={hoveredPillTextColor}
          pillTextColor={pillTextColor}
          initialLoadAnimation={!reduce && initialLoadAnimation}
        />
      </div>
    </ReactBitsFrame>
  );
}
