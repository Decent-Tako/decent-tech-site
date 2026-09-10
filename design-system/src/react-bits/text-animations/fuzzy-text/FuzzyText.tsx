import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFuzzyText from '../../vendor/text-animations/fuzzy-text/FuzzyText';
import { FUZZY_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './fuzzy-text.css';

export type FuzzyTextProps = {
  text?: string;
  fontSize?: string;
  fontWeight?: number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRange?: number;
  fps?: number;
  direction?: (typeof FUZZY_TEXT_DEFAULTS)['direction'];
  transitionDuration?: number;
  clickEffect?: boolean;
  glitchMode?: boolean;
  glitchInterval?: number;
  glitchDuration?: number;
  gradient?: string[] | null;
  letterSpacing?: number;
  reducedMotion?: ReducedMotionMode;
};

export function FuzzyText({
  text = FUZZY_TEXT_DEFAULTS.text,
  fontSize = FUZZY_TEXT_DEFAULTS.fontSize,
  fontWeight = FUZZY_TEXT_DEFAULTS.fontWeight,
  fontFamily = FUZZY_TEXT_DEFAULTS.fontFamily,
  color = FUZZY_TEXT_DEFAULTS.color,
  enableHover = FUZZY_TEXT_DEFAULTS.enableHover,
  baseIntensity = FUZZY_TEXT_DEFAULTS.baseIntensity,
  hoverIntensity = FUZZY_TEXT_DEFAULTS.hoverIntensity,
  fuzzRange = FUZZY_TEXT_DEFAULTS.fuzzRange,
  fps = FUZZY_TEXT_DEFAULTS.fps,
  direction = FUZZY_TEXT_DEFAULTS.direction,
  transitionDuration = FUZZY_TEXT_DEFAULTS.transitionDuration,
  clickEffect = FUZZY_TEXT_DEFAULTS.clickEffect,
  glitchMode = FUZZY_TEXT_DEFAULTS.glitchMode,
  glitchInterval = FUZZY_TEXT_DEFAULTS.glitchInterval,
  glitchDuration = FUZZY_TEXT_DEFAULTS.glitchDuration,
  gradient = FUZZY_TEXT_DEFAULTS.gradient,
  letterSpacing = FUZZY_TEXT_DEFAULTS.letterSpacing,
  reducedMotion = FUZZY_TEXT_DEFAULTS.reducedMotion,
}: FuzzyTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Fuzzy Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas slices the glyphs into rows and shifts each row by a
              random amount. Base intensity <code>{baseIntensity}</code>. Direction{' '}
              <code>{direction}</code>.
            </>
          }
          controls="Pause holds the draw loop. Replay remounts the canvas."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. children, className, paused, reduced, and onReady are not controls. color is ink; upstream default #fff. fontFamily is Brand Sans; upstream default inherit. fontWeight is 700; upstream default 900."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setReady(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageTestId="fuzzy-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-ready': ready ? 'true' : 'false',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamFuzzyText
        key={run}
        className="fuzzy-text__canvas"
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        color={color}
        enableHover={reduce ? false : enableHover}
        baseIntensity={reduce ? 0 : baseIntensity}
        hoverIntensity={hoverIntensity}
        fuzzRange={fuzzRange}
        fps={fps}
        direction={direction}
        transitionDuration={transitionDuration}
        clickEffect={clickEffect}
        glitchMode={reduce ? false : glitchMode}
        glitchInterval={glitchInterval}
        glitchDuration={glitchDuration}
        gradient={gradient}
        letterSpacing={letterSpacing}
        paused={paused}
        reduced={reduce}
        onReady={() => setReady(true)}
      >
        {text}
      </UpstreamFuzzyText>
    </ReactBitsFrame>
  );
}
