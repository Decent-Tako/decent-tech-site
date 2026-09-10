import { useRef, useState } from 'react';

import { DESTINATIONS, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCrosshair from '../../vendor/animations/crosshair/Crosshair';
import { CROSSHAIR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './crosshair.css';

export type CrosshairProps = {
  color?: (typeof CROSSHAIR_DEFAULTS)['color'];
  reducedMotion?: ReducedMotionMode;
};

export function Crosshair({
  color = CROSSHAIR_DEFAULTS.color,
  reducedMotion = CROSSHAIR_DEFAULTS.reducedMotion,
}: CrosshairProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Crosshair"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Two 1px lines lerp to the pointer inside the stage. Hovering a link
              plays an SVG turbulence burst on the lines. Colour is brand paper;
              upstream was <code>white</code>.
            </>
          }
          controls="Pause stops the lerp loop and keeps the last lines. Replay remounts the crosshair."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="containerRef is bound to the stage, not window. Filter ids are unique per mount. The links are DESTINATIONS from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink crosshair-stage"
      stageTestId="crosshair-stage"
      stageRef={stageRef}
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <div className="crosshair-links">
        {DESTINATIONS.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.title}
          </a>
        ))}
      </div>
      <p className="crosshair-note">
        {HERO.lede} {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
      <UpstreamCrosshair key={run} color={color} containerRef={stageRef} paused={paused || reduce} />
    </ReactBitsFrame>
  );
}
