import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamTextPressure from '../../vendor/text-animations/text-pressure/TextPressure';
import { TEXT_PRESSURE_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './text-pressure.css';

export type TextPressureProps = {
  text?: string;
  fontFamily?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  minFontSize?: number;
  reducedMotion?: ReducedMotionMode;
};

export function TextPressure({
  text = TEXT_PRESSURE_DEFAULTS.text,
  fontFamily = TEXT_PRESSURE_DEFAULTS.fontFamily,
  width = TEXT_PRESSURE_DEFAULTS.width,
  weight = TEXT_PRESSURE_DEFAULTS.weight,
  italic = TEXT_PRESSURE_DEFAULTS.italic,
  alpha = TEXT_PRESSURE_DEFAULTS.alpha,
  flex = TEXT_PRESSURE_DEFAULTS.flex,
  stroke = TEXT_PRESSURE_DEFAULTS.stroke,
  scale = TEXT_PRESSURE_DEFAULTS.scale,
  textColor = TEXT_PRESSURE_DEFAULTS.textColor,
  strokeColor = TEXT_PRESSURE_DEFAULTS.strokeColor,
  minFontSize = TEXT_PRESSURE_DEFAULTS.minFontSize,
  reducedMotion = TEXT_PRESSURE_DEFAULTS.reducedMotion,
}: TextPressureProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Text Pressure"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each glyph maps pointer distance to weight, width, and italic
              axes. Weight is <code>{String(weight)}</code>. Width is{' '}
              <code>{String(width)}</code>. Italic is <code>{String(italic)}</code>.
            </>
          }
          controls="Pause holds the frame loop. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. fontUrl, className, paused, reduced, and onPressure are not controls. fontUrl is omitted because the repository cannot load a remote face. fontFamily is Brand Sans; upstream default Roboto Flex. textColor is ink; upstream default #FFFFFF. strokeColor is accent blue; upstream default #FF0000. The title is a paragraph so it does not nest under the frame heading."
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
      stageTestId="text-pressure-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-pressure': '400',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamTextPressure
        key={run}
        className="text-pressure-copy"
        text={text}
        fontFamily={fontFamily}
        fontUrl=""
        width={width}
        weight={weight}
        italic={italic}
        alpha={alpha}
        flex={flex}
        stroke={stroke}
        scale={scale}
        textColor={textColor}
        strokeColor={strokeColor}
        minFontSize={minFontSize}
        paused={paused}
        reduced={reduce}
        onPressure={(value) => {
          stageRef.current?.setAttribute('data-pressure', String(value));
        }}
      />
    </ReactBitsFrame>
  );
}
