import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamTextLoop from '../../vendor/text-animations/text-loop/TextLoop';
import { TEXT_LOOP_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './text-loop.css';

export type TextLoopProps = {
  text?: string;
  shape?: (typeof TEXT_LOOP_DEFAULTS)['shape'];
  speed?: number;
  direction?: (typeof TEXT_LOOP_DEFAULTS)['direction'];
  separator?: string;
  curviness?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function TextLoop({
  text = TEXT_LOOP_DEFAULTS.text,
  shape = TEXT_LOOP_DEFAULTS.shape,
  speed = TEXT_LOOP_DEFAULTS.speed,
  direction = TEXT_LOOP_DEFAULTS.direction,
  separator = TEXT_LOOP_DEFAULTS.separator,
  curviness = TEXT_LOOP_DEFAULTS.curviness,
  fontSize = TEXT_LOOP_DEFAULTS.fontSize,
  fontWeight = TEXT_LOOP_DEFAULTS.fontWeight,
  letterSpacing = TEXT_LOOP_DEFAULTS.letterSpacing,
  uppercase = TEXT_LOOP_DEFAULTS.uppercase,
  color = TEXT_LOOP_DEFAULTS.color,
  ribbon = TEXT_LOOP_DEFAULTS.ribbon,
  ribbonColor = TEXT_LOOP_DEFAULTS.ribbonColor,
  ribbonWidth = TEXT_LOOP_DEFAULTS.ribbonWidth,
  pauseOnHover = TEXT_LOOP_DEFAULTS.pauseOnHover,
  reducedMotion = TEXT_LOOP_DEFAULTS.reducedMotion,
}: TextLoopProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Text Loop"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Repeated copy rides an SVG <code>{shape}</code> path. gsap advances
              startOffset at <code>{speed}</code> px/s, <code>{direction}</code>.
            </>
          }
          controls="Pause holds the offset tween. Replay remounts the path."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. path, className, style, paused, reduced, and onOffset are not controls. paused is local. color is ink; upstream default #ffffff. ribbonColor is accent blue; upstream default #5227FF."
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
      stageTestId="text-loop-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-offset': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamTextLoop
        key={run}
        className="text-loop-copy"
        text={text}
        shape={shape}
        speed={reduce ? 0 : speed}
        direction={direction}
        separator={separator}
        curviness={curviness}
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        uppercase={uppercase}
        color={color}
        ribbon={ribbon}
        ribbonColor={ribbonColor}
        ribbonWidth={ribbonWidth}
        pauseOnHover={pauseOnHover}
        paused={paused}
        reduced={reduce}
        onOffset={(offset) => {
          stageRef.current?.setAttribute('data-offset', offset.toFixed(1));
        }}
      />
    </ReactBitsFrame>
  );
}
