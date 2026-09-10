import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCountUp from '../../vendor/text-animations/count-up/CountUp';
import { COUNT_UP_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './count-up.css';

export type CountUpProps = {
  to?: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  startWhen?: boolean;
  separator?: string;
  reducedMotion?: ReducedMotionMode;
};

export function CountUp({
  to = COUNT_UP_DEFAULTS.to,
  from = COUNT_UP_DEFAULTS.from,
  direction = COUNT_UP_DEFAULTS.direction,
  delay = COUNT_UP_DEFAULTS.delay,
  duration = COUNT_UP_DEFAULTS.duration,
  startWhen = COUNT_UP_DEFAULTS.startWhen,
  separator = COUNT_UP_DEFAULTS.separator,
  reducedMotion = COUNT_UP_DEFAULTS.reducedMotion,
}: CountUpProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [state, setState] = useState<'pending' | 'running' | 'done'>('pending');
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Count Up"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A motion spring counts {direction} from <code>{from}</code> to{' '}
              <code>{to}</code> over <code>{duration}</code> seconds once the
              span is in view.
            </>
          }
          controls="Pause holds the start. Replay remounts the span."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The target is the $3,000 participant goal from src/pages/content.ts. onStart, onEnd, className, and paused are not controls. paused is local. Duration 0 writes the final number at once."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setState('pending');
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="count-up-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': state,
      }}
    >
      <UpstreamCountUp
        key={run}
        className="count-up__value"
        to={to}
        from={from}
        direction={direction}
        delay={delay}
        duration={reduce ? 0 : duration}
        startWhen={startWhen && !paused}
        separator={separator}
        paused={paused}
        onStart={() => setState('running')}
        onEnd={() => setState('done')}
      />
      <p className="count-up__label">
        {HERO.facts[0].label} {HERO.facts[0].value}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
