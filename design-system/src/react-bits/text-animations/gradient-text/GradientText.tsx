import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGradientText from '../../vendor/text-animations/gradient-text/GradientText';
import { GRADIENT_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './gradient-text.css';

export type GradientTextProps = {
  text?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: (typeof GRADIENT_TEXT_DEFAULTS)['direction'];
  pauseOnHover?: boolean;
  yoyo?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function GradientText({
  text = GRADIENT_TEXT_DEFAULTS.text,
  colors = GRADIENT_TEXT_DEFAULTS.colors,
  animationSpeed = GRADIENT_TEXT_DEFAULTS.animationSpeed,
  showBorder = GRADIENT_TEXT_DEFAULTS.showBorder,
  direction = GRADIENT_TEXT_DEFAULTS.direction,
  pauseOnHover = GRADIENT_TEXT_DEFAULTS.pauseOnHover,
  yoyo = GRADIENT_TEXT_DEFAULTS.yoyo,
  reducedMotion = GRADIENT_TEXT_DEFAULTS.reducedMotion,
}: GradientTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Gradient Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A clipped linear gradient sweeps across the word. Direction{' '}
              <code>{direction}</code>. Cycle <code>{animationSpeed}</code> s. Yoyo{' '}
              <code>{String(yoyo)}</code>.
            </>
          }
          controls="Pause holds the frame loop. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. children, className, paused, reduced, and onProgress are not controls. colors are ink, accent blue, and accent yellow. Upstream default #5227FF, #FF9FFC, #B497CF."
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
      stageTestId="gradient-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-progress': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamGradientText
        key={run}
        colors={colors}
        animationSpeed={animationSpeed}
        showBorder={showBorder}
        direction={direction}
        pauseOnHover={pauseOnHover}
        yoyo={yoyo}
        paused={paused}
        reduced={reduce}
        onProgress={(progress) => {
          stageRef.current?.setAttribute('data-progress', progress.toFixed(2));
        }}
      >
        {text}
      </UpstreamGradientText>
    </ReactBitsFrame>
  );
}
