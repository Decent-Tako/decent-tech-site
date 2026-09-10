import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { Wordmark } from '../../../brand/Wordmark';
import { PAGE_NAV } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamBubbleMenu from '../../vendor/components/bubble-menu/BubbleMenu';
import { BUBBLE_MENU_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './bubble-menu.css';

export type BubbleMenuProps = {
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = PAGE_NAV.map((item, index) => ({
  label: item.label,
  href: `#${item.id}`,
  ariaLabel: item.label,
  rotation: index % 2 === 0 ? -8 : 8,
  hoverStyles: { bgColor: '#0035B1', textColor: '#FFFFFF' },
}));

export function BubbleMenu({
  menuAriaLabel = BUBBLE_MENU_DEFAULTS.menuAriaLabel,
  menuBg = BUBBLE_MENU_DEFAULTS.menuBg,
  menuContentColor = BUBBLE_MENU_DEFAULTS.menuContentColor,
  useFixedPosition = BUBBLE_MENU_DEFAULTS.useFixedPosition,
  animationEase = BUBBLE_MENU_DEFAULTS.animationEase,
  animationDuration = BUBBLE_MENU_DEFAULTS.animationDuration,
  staggerDelay = BUBBLE_MENU_DEFAULTS.staggerDelay,
  reducedMotion = BUBBLE_MENU_DEFAULTS.reducedMotion,
}: BubbleMenuProps) {
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
      title="Bubble Menu"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              The toggle scales overlay pills from 0 with ease{' '}
              <code>{animationEase}</code> over <code>{animationDuration}</code>s
              and a stagger of <code>{staggerDelay}</code>s. Labels fade up after
              each pill.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the menu closed."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The logo is the Wordmark. The five pills are PAGE_NAV from src/pages/content.ts. logo, items, onMenuClick, className, and style are not controls. useFixedPosition stays in the stage so the overlay does not cover Storybook. Colour defaults use brand tokens. Upstream menuBg #fff, menuContentColor #111."
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
      stageTestId="bubble-menu-stage"
      stageClassName="rb-frame__stage--tall"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-open': open ? 'true' : 'false',
      }}
    >
      <UpstreamBubbleMenu
        key={run}
        logo={<Wordmark size="tiny" href={null} />}
        items={ITEMS}
        menuAriaLabel={menuAriaLabel}
        menuBg={menuBg}
        menuContentColor={menuContentColor}
        useFixedPosition={useFixedPosition}
        animationEase={animationEase}
        animationDuration={reduce ? 0 : animationDuration}
        staggerDelay={reduce ? 0 : staggerDelay}
        onMenuClick={(next) => setOpen(next)}
      />
    </ReactBitsFrame>
  );
}
