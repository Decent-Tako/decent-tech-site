import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { Wordmark } from '../../../brand/Wordmark';
import { DESTINATIONS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCardNav from '../../vendor/components/card-nav/CardNav';
import { CARD_NAV_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './card-nav.css';

export type CardNavProps = {
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = [
  {
    label: DESTINATIONS[0].title,
    bgColor: '#0035B1',
    textColor: '#FFFFFF',
    links: [
      { label: DESTINATIONS[0].cta, href: '#start', ariaLabel: DESTINATIONS[0].cta },
      { label: DESTINATIONS[0].kicker, href: '#start-setup', ariaLabel: DESTINATIONS[0].kicker },
    ],
  },
  {
    label: DESTINATIONS[1].title,
    bgColor: '#212121',
    textColor: '#FFFFFF',
    links: [
      { label: DESTINATIONS[1].cta, href: '#learn', ariaLabel: DESTINATIONS[1].cta },
      { label: DESTINATIONS[1].kicker, href: '#learn-weeks', ariaLabel: DESTINATIONS[1].kicker },
    ],
  },
  {
    label: DESTINATIONS[2].title,
    bgColor: '#DEF54F',
    textColor: '#212121',
    links: [
      { label: DESTINATIONS[2].cta, href: '#tools', ariaLabel: DESTINATIONS[2].cta },
      { label: DESTINATIONS[2].kicker, href: '#tools-plan', ariaLabel: DESTINATIONS[2].kicker },
    ],
  },
];

export function CardNav({
  ease = CARD_NAV_DEFAULTS.ease,
  baseColor = CARD_NAV_DEFAULTS.baseColor,
  menuColor = CARD_NAV_DEFAULTS.menuColor,
  buttonBgColor = CARD_NAV_DEFAULTS.buttonBgColor,
  buttonTextColor = CARD_NAV_DEFAULTS.buttonTextColor,
  reducedMotion = CARD_NAV_DEFAULTS.reducedMotion,
}: CardNavProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  return (
    <ReactBitsFrame
      title="Card Nav"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              The hamburger plays a paused gsap timeline that grows the bar to
              260px and fades three cards in with ease <code>{ease}</code>. Reverse
              closes it.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the bar closed."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The logo is the Wordmark. The three cards are Start, Learn, and Tools from DESTINATIONS in src/pages/content.ts. logo, logoAlt, items, className, duration, and buttonLabel are not controls. Colour defaults use brand tokens. Upstream baseColor #fff."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="card-nav-stage"
      stageClassName="rb-frame__stage--tall"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <UpstreamCardNav
        key={run}
        logo={<Wordmark size="tiny" href={null} />}
        items={ITEMS}
        ease={ease}
        baseColor={baseColor}
        menuColor={menuColor}
        buttonBgColor={buttonBgColor}
        buttonTextColor={buttonTextColor}
        duration={reduce ? 0 : 0.4}
        buttonLabel={DESTINATIONS[0].cta}
      />
    </ReactBitsFrame>
  );
}
