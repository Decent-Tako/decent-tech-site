import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamShinyText from '../../vendor/text-animations/shiny-text/ShinyText';
import { REACT_BITS_SOURCE, SHINE_DIRECTIONS, SHINY_TEXT_DEFAULTS } from './source';

import './shiny-text.css';

export type ShinyTextProps = {
  disabled?: boolean;
  speed?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: (typeof SHINE_DIRECTIONS)[number];
  delay?: number;
  reducedMotion?: ReducedMotionMode;
};

export function ShinyText({
  disabled = SHINY_TEXT_DEFAULTS.disabled,
  speed = SHINY_TEXT_DEFAULTS.speed,
  color = SHINY_TEXT_DEFAULTS.color,
  shineColor = SHINY_TEXT_DEFAULTS.shineColor,
  spread = SHINY_TEXT_DEFAULTS.spread,
  yoyo = SHINY_TEXT_DEFAULTS.yoyo,
  pauseOnHover = SHINY_TEXT_DEFAULTS.pauseOnHover,
  direction = SHINY_TEXT_DEFAULTS.direction,
  delay = SHINY_TEXT_DEFAULTS.delay,
  reducedMotion = SHINY_TEXT_DEFAULTS.reducedMotion,
}: ShinyTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Shiny Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A <code>useAnimationFrame</code> loop advances a progress value from 0 to 100
              over <code>speed {speed}</code> s, waits <code>delay {delay}</code> s, and
              repeats; <code>yoyo</code> runs it back. <code>useTransform</code> maps progress
              to the background position of a <code>{spread}</code> degree gradient from{' '}
              <code>color</code> to <code>shineColor</code>, clipped to the text.
            </>
          }
          controls="Pause sets the upstream disabled prop, which stops the frame loop. Replay remounts the upstream component, so progress starts at zero."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The text is the Academy hero kicker from src/pages/content.ts on the ink stage; className is not a control. Reduced motion sets disabled, so the shine holds its first position. The play function reads the inline background position, which the loop rewrites every frame."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink shiny-text__stage"
      stageTestId="shiny-text-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <p className="shiny-text__copy" data-testid="shiny-text-copy">
        <UpstreamShinyText
          key={run}
          text={HERO.kicker}
          disabled={disabled || paused || reduce}
          speed={speed}
          color={color}
          shineColor={shineColor}
          spread={spread}
          yoyo={yoyo}
          pauseOnHover={pauseOnHover}
          direction={direction}
          delay={delay}
        />
      </p>
    </ReactBitsFrame>
  );
}
