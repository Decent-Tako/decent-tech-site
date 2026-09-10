import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSpotlightCard from '../../vendor/components/spotlight-card/SpotlightCard';
import { REACT_BITS_SOURCE, SPOTLIGHT_CARD_DEFAULTS } from './source';

import './spotlight-card.css';

export type SpotlightCardProps = {
  spotlightColor?: string;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[1];

export function SpotlightCard({
  spotlightColor = SPOTLIGHT_CARD_DEFAULTS.spotlightColor,
  reducedMotion = SPOTLIGHT_CARD_DEFAULTS.reducedMotion,
}: SpotlightCardProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [spot, setSpot] = useState('50,50');
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Spotlight Card"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Mouse motion on the card sets <code>--mouse-x</code> and{' '}
              <code>--mouse-y</code>. A radial gradient uses spotlight colour{' '}
              <code>{spotlightColor}</code>.
            </>
          }
          controls="Pause ignores pointer moves. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="children and className are not controls. Copy is FEATURES[1] from src/pages/content.ts. spotlightColor is accent blue. Upstream default was rgba(255, 255, 255, 0.25)."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setSpot('50,50');
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="spotlight-card-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-spot': spot,
      }}
    >
      <div
        onMouseMove={(event) => {
          const card = (event.currentTarget as HTMLElement).querySelector('.card-spotlight');
          if (!(card instanceof HTMLElement)) return;
          const x = card.style.getPropertyValue('--mouse-x');
          const y = card.style.getPropertyValue('--mouse-y');
          if (x && y) setSpot(`${parseInt(x, 10)},${parseInt(y, 10)}`);
        }}
      >
        <UpstreamSpotlightCard
          key={run}
          spotlightColor={spotlightColor}
          paused={paused || reduce}
        >
          <div className="spotlight-card__copy">
            <p className="spotlight-card__kicker">{CARD.kicker}</p>
            <p className="spotlight-card__title">{CARD.title}</p>
            <p className="spotlight-card__body">{CARD.copy}</p>
          </div>
        </UpstreamSpotlightCard>
      </div>
    </ReactBitsFrame>
  );
}
