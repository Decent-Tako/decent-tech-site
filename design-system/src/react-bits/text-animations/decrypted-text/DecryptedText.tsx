import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDecryptedText from '../../vendor/text-animations/decrypted-text/DecryptedText';
import { DECRYPTED_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './decrypted-text.css';

export type DecryptedTextProps = {
  text?: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click';
  clickMode?: 'once' | 'toggle';
  reducedMotion?: ReducedMotionMode;
};

export function DecryptedText({
  text = DECRYPTED_TEXT_DEFAULTS.text,
  speed = DECRYPTED_TEXT_DEFAULTS.speed,
  maxIterations = DECRYPTED_TEXT_DEFAULTS.maxIterations,
  sequential = DECRYPTED_TEXT_DEFAULTS.sequential,
  revealDirection = DECRYPTED_TEXT_DEFAULTS.revealDirection,
  useOriginalCharsOnly = DECRYPTED_TEXT_DEFAULTS.useOriginalCharsOnly,
  characters = DECRYPTED_TEXT_DEFAULTS.characters,
  parentClassName = DECRYPTED_TEXT_DEFAULTS.parentClassName,
  encryptedClassName = DECRYPTED_TEXT_DEFAULTS.encryptedClassName,
  animateOn = DECRYPTED_TEXT_DEFAULTS.animateOn,
  clickMode = DECRYPTED_TEXT_DEFAULTS.clickMode,
  reducedMotion = DECRYPTED_TEXT_DEFAULTS.reducedMotion,
}: DecryptedTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Decrypted Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Characters scramble through a glyph set at <code>{speed}</code> ms
              per tick. Trigger <code>{animateOn}</code>. Sequential reveal is{' '}
              <code>{String(sequential)}</code> from <code>{revealDirection}</code>.
            </>
          }
          controls="Pause clears the scramble interval. Replay remounts the span."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. className, paused, and onAnimatingChange are not controls. paused is local. Reduced motion shows the plain title."
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
      stageTestId="decrypted-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-animating': 'false',
        'data-copy': FEATURES[0].title,
      }}
    >
      {reduce ? (
        <span className="decrypted-text">{text}</span>
      ) : (
        <UpstreamDecryptedText
          key={run}
          text={text}
          speed={speed}
          maxIterations={maxIterations}
          sequential={sequential}
          revealDirection={revealDirection}
          useOriginalCharsOnly={useOriginalCharsOnly}
          characters={characters}
          parentClassName={parentClassName}
          encryptedClassName={encryptedClassName}
          animateOn={animateOn}
          clickMode={clickMode}
          paused={paused}
          onAnimatingChange={(animating) => {
            stageRef.current?.setAttribute('data-animating', animating ? 'true' : 'false');
          }}
        />
      )}
    </ReactBitsFrame>
  );
}
