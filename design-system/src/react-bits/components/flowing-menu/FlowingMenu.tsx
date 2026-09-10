import { useState } from 'react';

import { DESTINATIONS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFlowingMenu from '../../vendor/components/flowing-menu/FlowingMenu';
import { FLOWING_MENU_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './flowing-menu.css';

export type FlowingMenuProps = {
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = DESTINATIONS.map((item) => ({
  link: `#${item.id}`,
  text: item.title,
  image: item.photo.src,
}));

export function FlowingMenu({
  speed = FLOWING_MENU_DEFAULTS.speed,
  textColor = FLOWING_MENU_DEFAULTS.textColor,
  bgColor = FLOWING_MENU_DEFAULTS.bgColor,
  marqueeBgColor = FLOWING_MENU_DEFAULTS.marqueeBgColor,
  marqueeTextColor = FLOWING_MENU_DEFAULTS.marqueeTextColor,
  borderColor = FLOWING_MENU_DEFAULTS.borderColor,
  reducedMotion = FLOWING_MENU_DEFAULTS.reducedMotion,
}: FlowingMenuProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState('');
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0.01 : speed;

  return (
    <ReactBitsFrame
      title="Flowing Menu"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Hover slides a photograph marquee from the nearest edge. The
              marquee loops in <code>{motionSpeed}</code> s with gsap ease expo.
            </>
          }
          controls="Pause holds the marquee tween. Replay remounts the menu."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The five rows are DESTINATIONS from src/pages/content.ts with photographs through publicAsset(). items, paused, and onHover are not controls. Colour defaults use brand paper and ink. Upstream bg #120F17, text #fff."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setHover('');
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="flowing-menu-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-hover': hover,
        'data-speed': String(motionSpeed),
      }}
    >
      <UpstreamFlowingMenu
        key={run}
        items={ITEMS}
        speed={motionSpeed}
        textColor={textColor}
        bgColor={bgColor}
        marqueeBgColor={marqueeBgColor}
        marqueeTextColor={marqueeTextColor}
        borderColor={borderColor}
        paused={paused}
        onHover={(text) => setHover(text ?? '')}
      />
    </ReactBitsFrame>
  );
}
