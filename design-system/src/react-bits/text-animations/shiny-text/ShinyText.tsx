import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamShinyText from '../../vendor/text-animations/shiny-text/ShinyText';
import { SHINY_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './shiny-text.css';

export type ShinyTextProps = {
  text?: string;
  disabled?: boolean;
  speed?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: (typeof SHINY_TEXT_DEFAULTS)['direction'];
  delay?: number;
  reducedMotion?: ReducedMotionMode;
};

export function ShinyText({
  text = SHINY_TEXT_DEFAULTS.text,
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
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Shiny Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A clipped linear shine sweeps <code>{direction}</code> across the
              word in <code>{speed}</code> s. Spread <code>{spread}</code> deg.
              Yoyo <code>{String(yoyo)}</code>.
            </>
          }
          controls="Pause holds the frame loop. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. className, paused, reduced, and onProgress are not controls. color is ink; upstream default #b5b5b5. shineColor is accent yellow; upstream default #ffffff."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageTestId="shiny-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-progress': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamShinyText
        key={run}
        text={text}
        disabled={disabled}
        speed={speed}
        color={color}
        shineColor={shineColor}
        spread={spread}
        yoyo={yoyo}
        pauseOnHover={pauseOnHover}
        direction={direction}
        delay={delay}
        paused={paused}
        reduced={reduce}
        onProgress={(progress) => {
          stageRef.current?.setAttribute('data-progress', progress.toFixed(2));
        }}
      />
    </ReactBitsFrame>
  );
}
