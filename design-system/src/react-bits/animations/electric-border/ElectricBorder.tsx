import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamElectricBorder from '../../vendor/animations/electric-border/ElectricBorder';
import { ELECTRIC_BORDER_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './electric-border.css';

export type ElectricBorderProps = {
  color?: (typeof ELECTRIC_BORDER_DEFAULTS)['color'];
  speed?: (typeof ELECTRIC_BORDER_DEFAULTS)['speed'];
  chaos?: (typeof ELECTRIC_BORDER_DEFAULTS)['chaos'];
  borderRadius?: (typeof ELECTRIC_BORDER_DEFAULTS)['borderRadius'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[1];

export function ElectricBorder({
  color = ELECTRIC_BORDER_DEFAULTS.color,
  speed = ELECTRIC_BORDER_DEFAULTS.speed,
  chaos = ELECTRIC_BORDER_DEFAULTS.chaos,
  borderRadius = ELECTRIC_BORDER_DEFAULTS.borderRadius,
  reducedMotion = ELECTRIC_BORDER_DEFAULTS.reducedMotion,
}: ElectricBorderProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Electric Border"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas walks the rounded-rect perimeter and displaces each
              sample with octaved noise. Speed <code>{speed}</code> scales the
              clock. Chaos <code>{chaos}</code> is the noise amplitude. Color is
              brand accent blue; upstream was <code>#5227FF</code>.
            </>
          }
          controls="Pause holds the last stroke. Replay remounts the canvas."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onTime are local. The stroke is one pixel, so stories assert the animation clock rather than sampled pixels. The card is Learn from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setReady(false);
        setTime(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="electric-border-stage"
      stageTestId="electric-border-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-ready': ready ? 'true' : 'false',
        'data-time': String(time),
      }}
    >
      <UpstreamElectricBorder
        key={run}
        color={color}
        speed={reduce ? 0 : speed}
        chaos={reduce ? 0 : chaos}
        borderRadius={borderRadius}
        paused={paused || reduce}
        onReady={() => setReady(true)}
        onTime={setTime}
      >
        <div className="electric-border-card">
          <img src={CARD.photo.src} alt={CARD.photo.alt} width={640} height={400} />
          <p className="electric-border-kicker">{CARD.kicker}</p>
          <p className="electric-border-title">{CARD.title}</p>
          <p>{CARD.copy}</p>
        </div>
      </UpstreamElectricBorder>
    </ReactBitsFrame>
  );
}
