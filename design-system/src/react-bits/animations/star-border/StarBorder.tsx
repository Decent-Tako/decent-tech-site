import { useState } from 'react';

import { DESTINATIONS, FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamStarBorder from '../../vendor/animations/star-border/StarBorder';
import { STAR_BORDER_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './star-border.css';

export type StarBorderProps = {
  color?: (typeof STAR_BORDER_DEFAULTS)['color'];
  speed?: (typeof STAR_BORDER_DEFAULTS)['speed'];
  thickness?: (typeof STAR_BORDER_DEFAULTS)['thickness'];
  backgroundColor?: (typeof STAR_BORDER_DEFAULTS)['backgroundColor'];
  textColor?: (typeof STAR_BORDER_DEFAULTS)['textColor'];
  borderColor?: (typeof STAR_BORDER_DEFAULTS)['borderColor'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];
const ACTION = DESTINATIONS[0];

export function StarBorder({
  color = STAR_BORDER_DEFAULTS.color,
  speed = STAR_BORDER_DEFAULTS.speed,
  thickness = STAR_BORDER_DEFAULTS.thickness,
  backgroundColor = STAR_BORDER_DEFAULTS.backgroundColor,
  textColor = STAR_BORDER_DEFAULTS.textColor,
  borderColor = STAR_BORDER_DEFAULTS.borderColor,
  reducedMotion = STAR_BORDER_DEFAULTS.reducedMotion,
}: StarBorderProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Star Border"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Two radial gradients travel the top and bottom edges of a button
              over <code>{speed}</code> with colour <code>{color}</code>.
            </>
          }
          controls="Pause holds the star keyframes. Replay remounts the button."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="as stays button. children is the Week 0 call to action from src/pages/content.ts. className and rest are not controls. paused and reduced are local. Colour default is brand yellow #DEF54F (upstream white). Fill default is brand ink #212121 (upstream #000000)."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="star-border-stage"
      stageTestId="star-border-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(speed),
      }}
    >
      <UpstreamStarBorder
        key={run}
        type="button"
        color={color}
        speed={speed}
        thickness={thickness}
        backgroundColor={backgroundColor}
        textColor={textColor}
        borderColor={borderColor}
        paused={paused}
        reduced={reduce}
      >
        {ACTION.cta}
      </UpstreamStarBorder>
      <p className="star-border-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
