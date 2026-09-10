import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { DESTINATIONS, PAGE_NAV, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamStaggeredMenu from '../../vendor/components/staggered-menu/StaggeredMenu';
import { REACT_BITS_SOURCE, STAGGERED_MENU_DEFAULTS } from './source';

import './staggered-menu.css';

export type StaggeredMenuProps = {
  position?: 'left' | 'right';
  colors?: string[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  accentColor?: string;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = PAGE_NAV.map((item) => ({
  label: item.label,
  ariaLabel: item.label,
  link: `#${item.id}`,
}));

const SOCIALS = DESTINATIONS.slice(3).map((item) => ({
  label: item.cta,
  link: `#${item.id}`,
}));

export function StaggeredMenu({
  position = STAGGERED_MENU_DEFAULTS.position,
  colors = STAGGERED_MENU_DEFAULTS.colors,
  displaySocials = STAGGERED_MENU_DEFAULTS.displaySocials,
  displayItemNumbering = STAGGERED_MENU_DEFAULTS.displayItemNumbering,
  menuButtonColor = STAGGERED_MENU_DEFAULTS.menuButtonColor,
  openMenuButtonColor = STAGGERED_MENU_DEFAULTS.openMenuButtonColor,
  changeMenuColorOnOpen = STAGGERED_MENU_DEFAULTS.changeMenuColorOnOpen,
  accentColor = STAGGERED_MENU_DEFAULTS.accentColor,
  isFixed = STAGGERED_MENU_DEFAULTS.isFixed,
  closeOnClickAway = STAGGERED_MENU_DEFAULTS.closeOnClickAway,
  reducedMotion = STAGGERED_MENU_DEFAULTS.reducedMotion,
}: StaggeredMenuProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [open, setOpen] = useState(false);
  const reduce = useReduce(reducedMotion);

  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  return (
    <ReactBitsFrame
      title="Staggered Menu"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Colour prelayers slide in from the <code>{position}</code>, then
              the panel follows. Labels rise from below with a stagger. Accent{' '}
              <code>{accentColor}</code>.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the menu closed."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items, socialItems, logoUrl, logoAlt, className, onMenuOpen, and onMenuClose are not controls. The five links are PAGE_NAV. Socials use the Events and Lounge calls to action from DESTINATIONS. The logo is PHOTOS.hero. Colour defaults use brand tokens. Upstream colors #B497CF and #5227FF, menuButtonColor #fff, accentColor #5227FF. isFixed stays false in the stage so the overlay does not cover Storybook."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setOpen(false);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink rb-frame__stage--tall"
      stageTestId="staggered-menu-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-open': open ? 'true' : 'false',
        'data-position': position,
        'data-numbering': displayItemNumbering ? 'true' : 'false',
      }}
    >
      <UpstreamStaggeredMenu
        key={run}
        position={position}
        colors={colors}
        items={ITEMS}
        socialItems={SOCIALS}
        displaySocials={displaySocials}
        displayItemNumbering={displayItemNumbering}
        logoUrl={PHOTOS.hero.src}
        logoAlt={PHOTOS.hero.alt}
        menuButtonColor={menuButtonColor}
        openMenuButtonColor={openMenuButtonColor}
        changeMenuColorOnOpen={changeMenuColorOnOpen}
        accentColor={accentColor}
        isFixed={isFixed}
        closeOnClickAway={closeOnClickAway}
        instant={reduce}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
      />
    </ReactBitsFrame>
  );
}
