import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamRotatingText from '../../vendor/text-animations/rotating-text/RotatingText';
import { ROTATING_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './rotating-text.css';

export type RotatingTextProps = {
  texts?: string[];
  animatePresenceMode?: (typeof ROTATING_TEXT_DEFAULTS)['animatePresenceMode'];
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: (typeof ROTATING_TEXT_DEFAULTS)['staggerFrom'];
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  reducedMotion?: ReducedMotionMode;
};

export function RotatingText({
  texts = ROTATING_TEXT_DEFAULTS.texts,
  animatePresenceMode = ROTATING_TEXT_DEFAULTS.animatePresenceMode,
  animatePresenceInitial = ROTATING_TEXT_DEFAULTS.animatePresenceInitial,
  rotationInterval = ROTATING_TEXT_DEFAULTS.rotationInterval,
  staggerDuration = ROTATING_TEXT_DEFAULTS.staggerDuration,
  staggerFrom = ROTATING_TEXT_DEFAULTS.staggerFrom,
  loop = ROTATING_TEXT_DEFAULTS.loop,
  auto = ROTATING_TEXT_DEFAULTS.auto,
  splitBy = ROTATING_TEXT_DEFAULTS.splitBy,
  mainClassName = ROTATING_TEXT_DEFAULTS.mainClassName,
  splitLevelClassName = ROTATING_TEXT_DEFAULTS.splitLevelClassName,
  elementLevelClassName = ROTATING_TEXT_DEFAULTS.elementLevelClassName,
  reducedMotion = ROTATING_TEXT_DEFAULTS.reducedMotion,
}: RotatingTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Rotating Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              AnimatePresence swaps the current word every{' '}
              <code>{rotationInterval}</code> ms. Split is <code>{splitBy}</code>.
              Stagger from <code>{String(staggerFrom)}</code> lasts{' '}
              <code>{staggerDuration}</code> s.
            </>
          }
          controls="Pause clears the rotation interval. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The rotating words are the first three feature titles from src/pages/content.ts. The lead is the Week 0 kicker. transition, initial, animate, exit, onNext, className, and paused are not controls. paused is local."
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
      stageTestId="rotating-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-index': '0',
        'data-copy': texts[0] ?? '',
      }}
    >
      <p className="rotating-text__line">
        <span className="rotating-text__lead">{FEATURES[0].kicker}</span>
        <UpstreamRotatingText
          key={run}
          texts={texts}
          animatePresenceMode={animatePresenceMode}
          animatePresenceInitial={animatePresenceInitial}
          rotationInterval={rotationInterval}
          staggerDuration={staggerDuration}
          staggerFrom={staggerFrom}
          loop={loop}
          auto={reduce ? false : auto}
          splitBy={splitBy}
          mainClassName={mainClassName}
          splitLevelClassName={splitLevelClassName}
          elementLevelClassName={elementLevelClassName}
          paused={paused || reduce}
          initial={reduce ? { y: 0, opacity: 1 } : undefined}
          animate={reduce ? { y: 0, opacity: 1 } : undefined}
          exit={reduce ? { y: 0, opacity: 1 } : undefined}
          onNext={(index) => {
            stageRef.current?.setAttribute('data-index', String(index));
            stageRef.current?.setAttribute('data-copy', texts[index] ?? '');
          }}
        />
      </p>
    </ReactBitsFrame>
  );
}
