import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamTrueFocus from '../../vendor/text-animations/true-focus/TrueFocus';
import { TRUE_FOCUS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './true-focus.css';

export type TrueFocusProps = {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  reducedMotion?: ReducedMotionMode;
};

export function TrueFocus({
  sentence = TRUE_FOCUS_DEFAULTS.sentence,
  separator = TRUE_FOCUS_DEFAULTS.separator,
  manualMode = TRUE_FOCUS_DEFAULTS.manualMode,
  blurAmount = TRUE_FOCUS_DEFAULTS.blurAmount,
  borderColor = TRUE_FOCUS_DEFAULTS.borderColor,
  glowColor = TRUE_FOCUS_DEFAULTS.glowColor,
  animationDuration = TRUE_FOCUS_DEFAULTS.animationDuration,
  pauseBetweenAnimations = TRUE_FOCUS_DEFAULTS.pauseBetweenAnimations,
  reducedMotion = TRUE_FOCUS_DEFAULTS.reducedMotion,
}: TrueFocusProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);
  const blur = reduce ? 0 : blurAmount;

  return (
    <ReactBitsFrame
      title="True Focus"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Words take a <code>{blurAmount}</code> px blur in turn. A corner
              frame follows the sharp word every{' '}
              <code>{animationDuration + pauseBetweenAnimations}</code> s.
              Manual mode is <code>{String(manualMode)}</code>.
            </>
          }
          controls="Pause holds the word interval. Replay remounts the sentence."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The sentence is the first three FEATURES titles from src/pages/content.ts. paused, reduced, and onIndex are local. borderColor is accent blue #0035B1; upstream default green. glowColor is accent blue at 0.6; upstream default rgba(0, 255, 0, 0.6)."
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
      stageTestId="true-focus-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-index': '0',
        'data-blur': String(blur),
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamTrueFocus
        key={run}
        sentence={sentence}
        separator={separator}
        manualMode={manualMode}
        blurAmount={blur}
        borderColor={borderColor}
        glowColor={glowColor}
        animationDuration={reduce ? 0 : animationDuration}
        pauseBetweenAnimations={pauseBetweenAnimations}
        paused={paused}
        reduced={reduce}
        onIndex={(index) => {
          stageRef.current?.setAttribute('data-index', String(index));
        }}
      />
    </ReactBitsFrame>
  );
}
