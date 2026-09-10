import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSplitFlapText from '../../vendor/text-animations/split-flap-text/SplitFlapText';
import { SPLIT_FLAP_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './split-flap-text.css';

export type SplitFlapTextProps = {
  words?: string[];
  flipDuration?: number;
  stagger?: number;
  cycleDelay?: number;
  charset?: (typeof SPLIT_FLAP_TEXT_DEFAULTS)['charset'];
  flipsPerChar?: number;
  tileColor?: string;
  textColor?: string;
  tileRadius?: number | string;
  gap?: number | string;
  fontSize?: number | string;
  loop?: boolean;
  padTo?: number;
  reducedMotion?: ReducedMotionMode;
};

export function SplitFlapText({
  words = SPLIT_FLAP_TEXT_DEFAULTS.words,
  flipDuration = SPLIT_FLAP_TEXT_DEFAULTS.flipDuration,
  stagger = SPLIT_FLAP_TEXT_DEFAULTS.stagger,
  cycleDelay = SPLIT_FLAP_TEXT_DEFAULTS.cycleDelay,
  charset = SPLIT_FLAP_TEXT_DEFAULTS.charset,
  flipsPerChar = SPLIT_FLAP_TEXT_DEFAULTS.flipsPerChar,
  tileColor = SPLIT_FLAP_TEXT_DEFAULTS.tileColor,
  textColor = SPLIT_FLAP_TEXT_DEFAULTS.textColor,
  tileRadius = SPLIT_FLAP_TEXT_DEFAULTS.tileRadius,
  gap = SPLIT_FLAP_TEXT_DEFAULTS.gap,
  fontSize = SPLIT_FLAP_TEXT_DEFAULTS.fontSize,
  loop = SPLIT_FLAP_TEXT_DEFAULTS.loop,
  padTo = SPLIT_FLAP_TEXT_DEFAULTS.padTo,
  reducedMotion = SPLIT_FLAP_TEXT_DEFAULTS.reducedMotion,
}: SplitFlapTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [index, setIndex] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Split Flap Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each glyph sits on a split-flap tile. Tiles flip through{' '}
              <code>{flipsPerChar}</code> random characters from{' '}
              <code>{charset}</code> with stagger <code>{stagger}</code> s, then
              land on the next phrase after <code>{cycleDelay}</code> ms.
            </>
          }
          controls="Pause holds the cycle timer and the flip frames. Replay remounts the board."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The phrases are the first three feature titles from src/pages/content.ts. text, className, style, paused, reduced, and onPhraseChange are not controls. paused is local. tileColor is ink; upstream default #111827. textColor is paper; upstream default #f8fafc."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setIndex(0);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="split-flap-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-index': String(index),
        'data-copy': words[index] ?? FEATURES[0].title,
      }}
    >
      <UpstreamSplitFlapText
        key={run}
        className="split-flap-text-copy"
        words={words}
        flipDuration={flipDuration}
        stagger={stagger}
        cycleDelay={cycleDelay}
        charset={charset}
        flipsPerChar={reduce ? 0 : flipsPerChar}
        tileColor={tileColor}
        textColor={textColor}
        tileRadius={tileRadius}
        gap={gap}
        fontSize={fontSize}
        loop={reduce ? false : loop}
        padTo={padTo}
        paused={paused}
        reduced={reduce}
        onPhraseChange={(nextIndex) => setIndex(nextIndex)}
      />
    </ReactBitsFrame>
  );
}
