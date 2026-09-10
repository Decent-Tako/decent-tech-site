import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamPixelCard from '../../vendor/components/pixel-card/PixelCard';
import { PIXEL_CARD_DEFAULTS, PIXEL_CARD_VARIANTS, REACT_BITS_SOURCE } from './source';

import './pixel-card.css';

export type PixelCardProps = {
  variant?: (typeof PIXEL_CARD_VARIANTS)[number];
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function PixelCard({
  variant = PIXEL_CARD_DEFAULTS.variant,
  gap = PIXEL_CARD_DEFAULTS.gap,
  speed = PIXEL_CARD_DEFAULTS.speed,
  colors = PIXEL_CARD_DEFAULTS.colors,
  noFocus = PIXEL_CARD_DEFAULTS.noFocus,
  reducedMotion = PIXEL_CARD_DEFAULTS.reducedMotion,
}: PixelCardProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Pixel Card"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Hover or focus fills a 2D canvas with pixels on a{' '}
              <code>{gap}</code> px grid at speed <code>{speed}</code>. Leave
              the card and the pixels shrink. Variant <code>{variant}</code>{' '}
              supplies the fallback gap and speed when those props are omitted.
            </>
          }
          controls="Pause skips pixel updates. Replay remounts the card, so the canvas is empty again."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="children and className are not controls. Copy is FEATURES[0] from src/pages/content.ts. colors uses ink, accent blue, and charcoal. Upstream default was #f8fafc,#f1f5f9,#cbd5e1. The canvas is clear until hover, so the play function samples pixels after mouseenter."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setReady(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="pixel-card-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-ready': ready ? 'true' : 'false',
        'data-variant': variant,
        'data-gap': String(gap),
      }}
    >
      <div className="pixel-card-stage">
        <UpstreamPixelCard
          key={run}
          variant={variant}
          gap={gap}
          speed={reduce ? 0 : speed}
          colors={colors}
          noFocus={noFocus}
          paused={paused}
          reducedMotion={reduce}
          onReady={() => setReady(true)}
        >
          <div className="pixel-card__copy">
            <p className="pixel-card__kicker">{CARD.kicker}</p>
            <p className="pixel-card__title">{CARD.title}</p>
            <p className="pixel-card__body">{CARD.copy}</p>
          </div>
        </UpstreamPixelCard>
      </div>
    </ReactBitsFrame>
  );
}
