import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDecayCard from '../../vendor/components/decay-card/DecayCard';
import { DECAY_CARD_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './decay-card.css';

export type DecayCardProps = {
  width?: number;
  height?: number;
  baseFrequency?: number;
  numOctaves?: number;
  seed?: number;
  maxDisplacement?: number;
  movementBound?: number;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function DecayCard({
  width = DECAY_CARD_DEFAULTS.width,
  height = DECAY_CARD_DEFAULTS.height,
  baseFrequency = DECAY_CARD_DEFAULTS.baseFrequency,
  numOctaves = DECAY_CARD_DEFAULTS.numOctaves,
  seed = DECAY_CARD_DEFAULTS.seed,
  maxDisplacement = DECAY_CARD_DEFAULTS.maxDisplacement,
  movementBound = DECAY_CARD_DEFAULTS.movementBound,
  reducedMotion = DECAY_CARD_DEFAULTS.reducedMotion,
}: DecayCardProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [scale, setScale] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Decay Card"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Pointer travel drives an SVG <code>feDisplacementMap</code> up to{' '}
              <code>{maxDisplacement}</code> and a gsap tilt inside{' '}
              <code>{movementBound}</code> px.
            </>
          }
          controls="Pause holds the rAF loop. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="image, children, paused, instant, and onScale are not controls. The photograph and caption are the Week 0 card from FEATURES. The default remote picsum image is not used."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
      replay
      onReplay={() => {
        setRun((current) => current + 1);
        setScale(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="decay-card-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-scale': String(Math.round(scale)),
      }}
    >
      <UpstreamDecayCard
        key={run}
        width={width}
        height={height}
        image={CARD.photo.src}
        baseFrequency={baseFrequency}
        numOctaves={numOctaves}
        seed={seed}
        maxDisplacement={maxDisplacement}
        movementBound={movementBound}
        paused={paused}
        instant={reduce}
        onScale={setScale}
      >
        {CARD.title}
        <br />
        {CARD.kicker}
      </UpstreamDecayCard>
    </ReactBitsFrame>
  );
}
