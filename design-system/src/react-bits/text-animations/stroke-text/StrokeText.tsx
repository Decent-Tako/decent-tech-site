import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamStrokeText from '../../vendor/text-animations/stroke-text/StrokeText';
import { STROKE_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './stroke-text.css';

export type StrokeTextProps = {
  text?: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: (typeof STROKE_TEXT_DEFAULTS)['trigger'];
  fillMode?: (typeof STROKE_TEXT_DEFAULTS)['fillMode'];
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  reverse?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function StrokeText({
  text = STROKE_TEXT_DEFAULTS.text,
  strokeColor = STROKE_TEXT_DEFAULTS.strokeColor,
  fillColor = STROKE_TEXT_DEFAULTS.fillColor,
  strokeWidth = STROKE_TEXT_DEFAULTS.strokeWidth,
  drawDuration = STROKE_TEXT_DEFAULTS.drawDuration,
  fillDelay = STROKE_TEXT_DEFAULTS.fillDelay,
  stagger = STROKE_TEXT_DEFAULTS.stagger,
  ease = STROKE_TEXT_DEFAULTS.ease,
  trigger = STROKE_TEXT_DEFAULTS.trigger,
  fillMode = STROKE_TEXT_DEFAULTS.fillMode,
  fontSize = STROKE_TEXT_DEFAULTS.fontSize,
  fontWeight = STROKE_TEXT_DEFAULTS.fontWeight,
  letterSpacing = STROKE_TEXT_DEFAULTS.letterSpacing,
  reverse = STROKE_TEXT_DEFAULTS.reverse,
  reducedMotion = STROKE_TEXT_DEFAULTS.reducedMotion,
}: StrokeTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [state, setState] = useState<'pending' | 'drawn'>('pending');
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Stroke Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each glyph is an SVG stroke. A gsap timeline draws the outline over{' '}
              <code>{drawDuration}</code> s, then {fillMode === 'none' ? 'leaves the fill off' : `${fillMode}s the fill`}.
              Trigger <code>{trigger}</code>.
            </>
          }
          controls="Pause holds the gsap timeline. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. className, style, paused, reduced, and onComplete are not controls. paused is local. strokeColor is accent blue; upstream default #A78BFA. fillColor is ink; upstream default #F8FAFC."
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
      stageTestId="stroke-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': state,
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamStrokeText
        key={run}
        className="stroke-text-copy"
        text={text}
        strokeColor={strokeColor}
        fillColor={fillColor}
        strokeWidth={strokeWidth}
        drawDuration={reduce ? 0.01 : drawDuration}
        fillDelay={reduce ? 0 : fillDelay}
        stagger={reduce ? 0 : stagger}
        ease={ease}
        trigger={trigger}
        fillMode={fillMode}
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        reverse={reverse}
        paused={paused}
        reduced={reduce}
        onComplete={() => setState('drawn')}
      />
    </ReactBitsFrame>
  );
}
