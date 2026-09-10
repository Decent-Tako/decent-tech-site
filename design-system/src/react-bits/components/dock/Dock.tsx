import { useState } from 'react';

import { PAGE_NAV } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDock from '../../vendor/components/dock/Dock';
import { DOCK_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './dock.css';

export type DockProps = {
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  springMass?: number;
  springStiffness?: number;
  springDamping?: number;
  reducedMotion?: ReducedMotionMode;
};

export function Dock({
  distance = DOCK_DEFAULTS.distance,
  panelHeight = DOCK_DEFAULTS.panelHeight,
  baseItemSize = DOCK_DEFAULTS.baseItemSize,
  dockHeight = DOCK_DEFAULTS.dockHeight,
  magnification = DOCK_DEFAULTS.magnification,
  springMass = DOCK_DEFAULTS.springMass,
  springStiffness = DOCK_DEFAULTS.springStiffness,
  springDamping = DOCK_DEFAULTS.springDamping,
  reducedMotion = DOCK_DEFAULTS.reducedMotion,
}: DockProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState('');
  const reduce = useReduce(reducedMotion);
  const motionMagnification = reduce ? baseItemSize : magnification;

  const items = PAGE_NAV.map((item) => ({
    icon: <span className="dock-story__glyph">{item.label.slice(0, 1)}</span>,
    label: item.label,
    onClick: () => setActive(item.id),
  }));

  return (
    <ReactBitsFrame
      title="Dock"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each item springs toward <code>{motionMagnification}</code> px
              when the pointer is within <code>{distance}</code> px. The panel
              grows from <code>{panelHeight}</code> px on hover.
            </>
          }
          controls="Pause ignores the pointer and returns items to rest. Replay remounts the dock."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The five items are PAGE_NAV from src/pages/content.ts. items, className, spring, and paused are not controls. spring is mass, stiffness, and damping. Magnification matches baseItemSize when reduced motion is on."
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
      stageClassName="rb-frame__stage--ink"
      stageTestId="dock-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': active,
        'data-magnify': String(motionMagnification),
      }}
    >
      <UpstreamDock
        key={run}
        items={items}
        distance={distance}
        panelHeight={panelHeight}
        baseItemSize={baseItemSize}
        dockHeight={dockHeight}
        magnification={motionMagnification}
        spring={{ mass: springMass, stiffness: springStiffness, damping: springDamping }}
        paused={paused || reduce}
      />
    </ReactBitsFrame>
  );
}
