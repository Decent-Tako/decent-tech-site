import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamTextType from '../../vendor/text-animations/text-type/TextType';
import { TEXT_TYPE_DEFAULTS, TEXT_TYPE_PHRASES, REACT_BITS_SOURCE } from './source';

import './text-type.css';

export type TextTypeProps = {
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorBlinkDuration?: number;
  textColor?: string;
  startOnVisible?: boolean;
  reverseMode?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function TextType({
  typingSpeed = TEXT_TYPE_DEFAULTS.typingSpeed,
  initialDelay = TEXT_TYPE_DEFAULTS.initialDelay,
  pauseDuration = TEXT_TYPE_DEFAULTS.pauseDuration,
  deletingSpeed = TEXT_TYPE_DEFAULTS.deletingSpeed,
  loop = TEXT_TYPE_DEFAULTS.loop,
  showCursor = TEXT_TYPE_DEFAULTS.showCursor,
  hideCursorWhileTyping = TEXT_TYPE_DEFAULTS.hideCursorWhileTyping,
  cursorCharacter = TEXT_TYPE_DEFAULTS.cursorCharacter,
  cursorBlinkDuration = TEXT_TYPE_DEFAULTS.cursorBlinkDuration,
  textColor = TEXT_TYPE_DEFAULTS.textColor,
  startOnVisible = TEXT_TYPE_DEFAULTS.startOnVisible,
  reverseMode = TEXT_TYPE_DEFAULTS.reverseMode,
  reducedMotion = TEXT_TYPE_DEFAULTS.reducedMotion,
}: TextTypeProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Text Type"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Timeouts append one glyph every <code>{typingSpeed}</code> ms, then
              delete at <code>{deletingSpeed}</code> ms after a{' '}
              <code>{pauseDuration}</code> ms hold. gsap blinks the cursor.
              Reverse is <code>{String(reverseMode)}</code>.
            </>
          }
          controls="Pause holds the timeouts and the cursor tween. Replay remounts the typewriter."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The phrases are the five FEATURES titles from src/pages/content.ts. as, className, cursorClassName, variableSpeed, and onSentenceComplete are not controls. paused, reduced, and onTyped are local. textColor is ink; upstream textColors default []."
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
      stageTestId="text-type-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-length': '0',
        'data-index': '0',
        'data-deleting': 'false',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamTextType
        key={run}
        text={TEXT_TYPE_PHRASES}
        typingSpeed={typingSpeed}
        initialDelay={initialDelay}
        pauseDuration={pauseDuration}
        deletingSpeed={deletingSpeed}
        loop={loop}
        showCursor={showCursor}
        hideCursorWhileTyping={hideCursorWhileTyping}
        cursorCharacter={cursorCharacter}
        cursorBlinkDuration={cursorBlinkDuration}
        textColors={[textColor]}
        startOnVisible={startOnVisible}
        reverseMode={reverseMode}
        paused={paused}
        reduced={reduce}
        onTyped={(progress) => {
          const stage = stageRef.current;
          if (!stage) return;
          stage.setAttribute('data-length', String(progress.length));
          stage.setAttribute('data-index', String(progress.index));
          stage.setAttribute('data-deleting', progress.deleting ? 'true' : 'false');
        }}
      />
    </ReactBitsFrame>
  );
}
