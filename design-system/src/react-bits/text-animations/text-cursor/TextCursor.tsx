import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamTextCursor from '../../vendor/text-animations/text-cursor/TextCursor';
import { TEXT_CURSOR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './text-cursor.css';

export type TextCursorProps = {
  text?: string;
  spacing?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  maxPoints?: number;
  reducedMotion?: ReducedMotionMode;
};

export function TextCursor({
  text = TEXT_CURSOR_DEFAULTS.text,
  spacing = TEXT_CURSOR_DEFAULTS.spacing,
  followMouseDirection = TEXT_CURSOR_DEFAULTS.followMouseDirection,
  randomFloat = TEXT_CURSOR_DEFAULTS.randomFloat,
  exitDuration = TEXT_CURSOR_DEFAULTS.exitDuration,
  removalInterval = TEXT_CURSOR_DEFAULTS.removalInterval,
  maxPoints = TEXT_CURSOR_DEFAULTS.maxPoints,
  reducedMotion = TEXT_CURSOR_DEFAULTS.reducedMotion,
}: TextCursorProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Text Cursor"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Pointer motion drops the word along the path every{' '}
              <code>{spacing}</code> px, up to <code>{maxPoints}</code> points.
              Points fade after idle. Random float is <code>{String(randomFloat)}</code>.
            </>
          }
          controls="Pause skips new points and the removal interval. Replay remounts the stage."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. paused, reduced, and onTrailChange are not controls. paused is local. The pointer listeners bind to the host, not window."
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
      stageTestId="text-cursor-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-count': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamTextCursor
        key={run}
        text={text}
        spacing={spacing}
        followMouseDirection={followMouseDirection}
        randomFloat={reduce ? false : randomFloat}
        exitDuration={exitDuration}
        removalInterval={removalInterval}
        maxPoints={maxPoints}
        paused={paused}
        reduced={reduce}
        onTrailChange={(count) => {
          stageRef.current?.setAttribute('data-count', String(count));
        }}
      />
    </ReactBitsFrame>
  );
}
