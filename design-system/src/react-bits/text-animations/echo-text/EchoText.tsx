import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamEchoText from '../../vendor/text-animations/echo-text/EchoText';
import { ECHO_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './echo-text.css';

export type EchoTextProps = {
  text?: string;
  echoes?: number;
  lag?: number;
  offset?: number;
  direction?: (typeof ECHO_TEXT_DEFAULTS)['direction'];
  fade?: number;
  blur?: number;
  tint?: string;
  mode?: (typeof ECHO_TEXT_DEFAULTS)['mode'];
  cursorRadius?: number;
  duration?: number;
  ease?: (typeof ECHO_TEXT_DEFAULTS)['ease'];
  fontSize?: string;
  fontWeight?: number;
  color?: string;
  reducedMotion?: ReducedMotionMode;
};

export function EchoText({
  text = ECHO_TEXT_DEFAULTS.text,
  echoes = ECHO_TEXT_DEFAULTS.echoes,
  lag = ECHO_TEXT_DEFAULTS.lag,
  offset = ECHO_TEXT_DEFAULTS.offset,
  direction = ECHO_TEXT_DEFAULTS.direction,
  fade = ECHO_TEXT_DEFAULTS.fade,
  blur = ECHO_TEXT_DEFAULTS.blur,
  tint = ECHO_TEXT_DEFAULTS.tint,
  mode = ECHO_TEXT_DEFAULTS.mode,
  cursorRadius = ECHO_TEXT_DEFAULTS.cursorRadius,
  duration = ECHO_TEXT_DEFAULTS.duration,
  ease = ECHO_TEXT_DEFAULTS.ease,
  fontSize = ECHO_TEXT_DEFAULTS.fontSize,
  fontWeight = ECHO_TEXT_DEFAULTS.fontWeight,
  color = ECHO_TEXT_DEFAULTS.color,
  reducedMotion = ECHO_TEXT_DEFAULTS.reducedMotion,
}: EchoTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Echo Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Ghost copies lag behind the word along <code>{direction}</code>. Entrance
              lasts <code>{duration}</code> ms. Pointer pull uses a{' '}
              <code>{cursorRadius}</code> px radius. Mode <code>{mode}</code>.
            </>
          }
          controls="Pause holds the frame loop. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. className, style, paused, reduced, and onActivity are not controls. paused is local. color is paper; tint is accent blue. Upstream color #f8fafc and tint #7dd3fc. fontWeight is 700 for Brand Sans; upstream default 800."
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
      stageClassName="rb-frame__stage--ink"
      stageTestId="echo-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-activity': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamEchoText
        key={run}
        text={text}
        echoes={echoes}
        lag={lag}
        offset={offset}
        direction={direction}
        fade={fade}
        blur={blur}
        tint={tint}
        mode={mode}
        cursorRadius={cursorRadius}
        duration={reduce ? 0 : duration}
        ease={ease}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        paused={paused}
        reduced={reduce}
        onActivity={(activity) => {
          stageRef.current?.setAttribute('data-activity', activity.toFixed(3));
        }}
      />
    </ReactBitsFrame>
  );
}
