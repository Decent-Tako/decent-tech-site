import { useEffect, useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCounter from '../../vendor/components/counter/Counter';
import { COUNTER_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './counter.css';

export type CounterProps = {
  value?: number;
  fontSize?: number;
  padding?: number;
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: number;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  reducedMotion?: ReducedMotionMode;
};

export function Counter({
  value = COUNTER_DEFAULTS.value,
  fontSize = COUNTER_DEFAULTS.fontSize,
  padding = COUNTER_DEFAULTS.padding,
  gap = COUNTER_DEFAULTS.gap,
  borderRadius = COUNTER_DEFAULTS.borderRadius,
  horizontalPadding = COUNTER_DEFAULTS.horizontalPadding,
  textColor = COUNTER_DEFAULTS.textColor,
  fontWeight = COUNTER_DEFAULTS.fontWeight,
  gradientHeight = COUNTER_DEFAULTS.gradientHeight,
  gradientFrom = COUNTER_DEFAULTS.gradientFrom,
  gradientTo = COUNTER_DEFAULTS.gradientTo,
  reducedMotion = COUNTER_DEFAULTS.reducedMotion,
}: CounterProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [ticked, setTicked] = useState(0);
  const reduce = useReduce(reducedMotion);
  const shown = reduce ? value : ticked;

  useEffect(() => {
    if (reduce || paused) return;
    if (ticked >= value) return;
    const step = Math.max(1, Math.round(value / 40));
    const id = window.setInterval(() => {
      setTicked((current) => Math.min(current + step, value));
    }, 80);
    return () => window.clearInterval(id);
  }, [paused, reduce, ticked, value]);

  return (
    <ReactBitsFrame
      title="Counter"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each digit is a motion spring reel. The wrapper counts from 0 to{' '}
              <code>{value}</code>, the Academy goal. Pause freezes the interval and
              the springs.
            </>
          }
          controls="Pause holds the count and the digit springs. Replay remounts from 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="places, containerStyle, counterStyle, digitStyle, topGradientStyle, bottomGradientStyle, and paused are not controls. The caption is the Goal fact from HERO in src/pages/content.ts. textColor default is brand ink #212121 (upstream inherit). gradientFrom default is brand paper #FFFFFF (upstream black)."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((current) => current + 1);
        setTicked(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="counter-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-value': String(shown),
        'data-target': String(value),
      }}
    >
      <UpstreamCounter
        key={run}
        value={shown}
        fontSize={fontSize}
        padding={padding}
        gap={gap}
        borderRadius={borderRadius}
        horizontalPadding={horizontalPadding}
        textColor={textColor}
        fontWeight={fontWeight}
        gradientHeight={gradientHeight}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        paused={paused}
      />
      <p className="counter__caption">
        {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
