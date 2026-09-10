import { useState } from 'react';

import { PAGE_NAV } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLineSidebar from '../../vendor/components/line-sidebar/LineSidebar';
import {
  LINE_SIDEBAR_DEFAULTS,
  type LineSidebarFalloff,
  REACT_BITS_SOURCE,
} from './source';

import './line-sidebar.css';

export type LineSidebarProps = {
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: LineSidebarFalloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number | null;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = PAGE_NAV.map((item) => item.label);

export function LineSidebar({
  accentColor = LINE_SIDEBAR_DEFAULTS.accentColor,
  textColor = LINE_SIDEBAR_DEFAULTS.textColor,
  markerColor = LINE_SIDEBAR_DEFAULTS.markerColor,
  showIndex = LINE_SIDEBAR_DEFAULTS.showIndex,
  showMarker = LINE_SIDEBAR_DEFAULTS.showMarker,
  proximityRadius = LINE_SIDEBAR_DEFAULTS.proximityRadius,
  maxShift = LINE_SIDEBAR_DEFAULTS.maxShift,
  falloff = LINE_SIDEBAR_DEFAULTS.falloff,
  markerLength = LINE_SIDEBAR_DEFAULTS.markerLength,
  markerGap = LINE_SIDEBAR_DEFAULTS.markerGap,
  tickScale = LINE_SIDEBAR_DEFAULTS.tickScale,
  scaleTick = LINE_SIDEBAR_DEFAULTS.scaleTick,
  itemGap = LINE_SIDEBAR_DEFAULTS.itemGap,
  fontSize = LINE_SIDEBAR_DEFAULTS.fontSize,
  smoothing = LINE_SIDEBAR_DEFAULTS.smoothing,
  defaultActive = LINE_SIDEBAR_DEFAULTS.defaultActive,
  reducedMotion = LINE_SIDEBAR_DEFAULTS.reducedMotion,
}: LineSidebarProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState<number | null>(defaultActive);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Line Sidebar"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Pointer proximity on the list drives a rAF lerp of{' '}
              <code>--effect</code> with falloff <code>{falloff}</code>. Colour,
              marker scale, and a <code>{maxShift}</code> px shift share that
              value.
            </>
          }
          controls="Pause holds the rAF loop. Replay remounts the list on the default item."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items, onItemClick, and className are not controls. Labels are PAGE_NAV from src/pages/content.ts. accentColor, textColor, and markerColor map to brand tokens. Upstream colours were #A855F7, #c4c4c4, and #6c6c6c."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setActive(defaultActive);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="line-sidebar-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': active === null ? '' : String(active),
        'data-falloff': falloff,
        'data-index': showIndex ? 'true' : 'false',
      }}
    >
      <UpstreamLineSidebar
        key={run}
        items={ITEMS}
        accentColor={accentColor}
        textColor={textColor}
        markerColor={markerColor}
        showIndex={showIndex}
        showMarker={showMarker}
        proximityRadius={proximityRadius}
        maxShift={maxShift}
        falloff={falloff}
        markerLength={markerLength}
        markerGap={markerGap}
        tickScale={tickScale}
        scaleTick={scaleTick}
        itemGap={itemGap}
        fontSize={fontSize}
        smoothing={reduce ? 1 : smoothing}
        defaultActive={defaultActive}
        paused={paused}
        onItemClick={(index) => setActive(index)}
      />
    </ReactBitsFrame>
  );
}
