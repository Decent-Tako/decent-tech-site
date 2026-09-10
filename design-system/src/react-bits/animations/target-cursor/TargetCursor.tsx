import { useRef, useState } from 'react';

import { DESTINATIONS, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamTargetCursor from '../../vendor/animations/target-cursor/TargetCursor';
import { REACT_BITS_SOURCE, TARGET_CURSOR_DEFAULTS } from './source';

import './target-cursor.css';

export type TargetCursorProps = {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
  reducedMotion?: ReducedMotionMode;
};

export function TargetCursor({
  targetSelector = TARGET_CURSOR_DEFAULTS.targetSelector,
  spinDuration = TARGET_CURSOR_DEFAULTS.spinDuration,
  hideDefaultCursor = TARGET_CURSOR_DEFAULTS.hideDefaultCursor,
  hoverDuration = TARGET_CURSOR_DEFAULTS.hoverDuration,
  parallaxOn = TARGET_CURSOR_DEFAULTS.parallaxOn,
  cursorColor = TARGET_CURSOR_DEFAULTS.cursorColor,
  cursorColorOnTarget = TARGET_CURSOR_DEFAULTS.cursorColorOnTarget,
  reducedMotion = TARGET_CURSOR_DEFAULTS.reducedMotion,
}: TargetCursorProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [locked, setLocked] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Target Cursor"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A four-corner cursor follows the pointer inside the stage with gsap
              and spins once every <code>{spinDuration}</code> s. Hovering an
              element that matches <code>{targetSelector}</code> stops the spin and
              locks the corners onto that box over <code>{hoverDuration}</code> s.
              Colour is brand paper; on a target it becomes brand accent yellow.
            </>
          }
          controls="Pause holds the spin timeline and new pointer tweens. Replay remounts the cursor at the centre of the stage."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="containerRef and onLock are not controls: the wrapper binds them to the stage. Pointer listeners live on the stage, not window. The cursor renders inside the stage, not in a page portal. Reduced motion mounts the cursor paused, so it does not spin. The links are DESTINATIONS from src/pages/content.ts. Colour default is brand paper #FFFFFF (upstream #ffffff). On-target colour default is brand accent yellow #DEF54F (upstream unset)."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setLocked(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink target-cursor-stage"
      stageTestId="target-cursor-stage"
      stageRef={stageRef}
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-locked': locked ? 'true' : 'false',
        'data-parallax': parallaxOn ? 'true' : 'false',
      }}
    >
      <div className="target-cursor-links">
        {DESTINATIONS.map((item) => (
          <a key={item.id} className="cursor-target" href={`#${item.id}`}>
            {item.title}
          </a>
        ))}
      </div>
      <p className="target-cursor-note">
        {HERO.lede} {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
      <UpstreamTargetCursor
        key={run}
        targetSelector={targetSelector}
        spinDuration={reduce ? 0 : spinDuration}
        hideDefaultCursor={hideDefaultCursor}
        hoverDuration={reduce ? 0 : hoverDuration}
        parallaxOn={parallaxOn}
        cursorColor={cursorColor}
        cursorColorOnTarget={cursorColorOnTarget}
        paused={paused || reduce}
        containerRef={stageRef}
        onLock={setLocked}
      />
    </ReactBitsFrame>
  );
}
