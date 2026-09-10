import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCardSwap, { Card } from '../../vendor/components/card-swap/CardSwap';
import { CARD_SWAP_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './card-swap.css';

export type CardSwapProps = {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  skewAmount?: number;
  easing?: (typeof CARD_SWAP_DEFAULTS)['easing'];
  reducedMotion?: ReducedMotionMode;
};

const STACK = FEATURES.slice(0, 3);

export function CardSwap({
  width = CARD_SWAP_DEFAULTS.width,
  height = CARD_SWAP_DEFAULTS.height,
  cardDistance = CARD_SWAP_DEFAULTS.cardDistance,
  verticalDistance = CARD_SWAP_DEFAULTS.verticalDistance,
  delay = CARD_SWAP_DEFAULTS.delay,
  pauseOnHover = CARD_SWAP_DEFAULTS.pauseOnHover,
  skewAmount = CARD_SWAP_DEFAULTS.skewAmount,
  easing = CARD_SWAP_DEFAULTS.easing,
  reducedMotion = CARD_SWAP_DEFAULTS.reducedMotion,
}: CardSwapProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [front, setFront] = useState(0);
  const [cycle, setCycle] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Card Swap"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A gsap timeline drops the front card and promotes the stack every{' '}
              <code>{delay}</code> ms with easing <code>{easing}</code>. Cards sit
              on a 3D stack with distance <code>{cardDistance}</code> and skew{' '}
              <code>{skewAmount}</code>.
            </>
          }
          controls="Pause freezes the swap timeline and clears the interval. Replay remounts the stack."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The three cards are Start, Learn, and Tools from FEATURES in src/pages/content.ts. children, onCardClick, paused, and onSwap are not controls. paused is a local prop so Pause can freeze the interval."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setFront(0);
        setCycle(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="card-swap-stage"
      stageClassName="rb-frame__stage--tall"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-front': String(front),
        'data-cycle': String(cycle),
        'data-easing': easing,
      }}
    >
      <UpstreamCardSwap
        key={run}
        width={width}
        height={height}
        cardDistance={cardDistance}
        verticalDistance={verticalDistance}
        delay={delay}
        pauseOnHover={pauseOnHover}
        skewAmount={skewAmount}
        easing={easing}
        paused={paused || reduce}
        onSwap={(index) => {
          setFront(index);
          setCycle((value) => value + 1);
        }}
      >
        {STACK.map((feature) => (
          <Card key={feature.id}>
            <img
              className="card-swap__photo"
              src={feature.photo.src}
              alt={feature.photo.alt}
              width={640}
              height={400}
            />
            <p className="card-swap__kicker">{feature.kicker}</p>
            <p className="card-swap__title">{feature.title}</p>
            <p className="card-swap__copy">{feature.copy}</p>
          </Card>
        ))}
      </UpstreamCardSwap>
    </ReactBitsFrame>
  );
}
