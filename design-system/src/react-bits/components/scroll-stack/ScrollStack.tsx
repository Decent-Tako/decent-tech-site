import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamScrollStack, {
  ScrollStackItem,
} from '../../vendor/components/scroll-stack/ScrollStack';
import { REACT_BITS_SOURCE, SCROLL_STACK_DEFAULTS } from './source';

import './scroll-stack.css';

export type ScrollStackProps = {
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollStack({
  itemDistance = SCROLL_STACK_DEFAULTS.itemDistance,
  itemScale = SCROLL_STACK_DEFAULTS.itemScale,
  itemStackDistance = SCROLL_STACK_DEFAULTS.itemStackDistance,
  stackPosition = SCROLL_STACK_DEFAULTS.stackPosition,
  scaleEndPosition = SCROLL_STACK_DEFAULTS.scaleEndPosition,
  baseScale = SCROLL_STACK_DEFAULTS.baseScale,
  scaleDuration = SCROLL_STACK_DEFAULTS.scaleDuration,
  rotationAmount = SCROLL_STACK_DEFAULTS.rotationAmount,
  blurAmount = SCROLL_STACK_DEFAULTS.blurAmount,
  reducedMotion = SCROLL_STACK_DEFAULTS.reducedMotion,
}: ScrollStackProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [complete, setComplete] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Scroll Stack"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Lenis smooths the inner scroller. Each card pins, scales toward{' '}
              <code>{baseScale}</code>, and stacks with gap{' '}
              <code>{itemStackDistance}</code> px.
            </>
          }
          controls="Pause stops Lenis. Replay remounts the scroller."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="children, className, and useWindowScroll are not controls. Cards are FEATURES from src/pages/content.ts. The scroller is the stage, not the window. scaleDuration is unused upstream and stays a control."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setComplete(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="scroll-stack-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-complete': complete ? 'true' : 'false',
        'data-rotate': String(rotationAmount),
      }}
    >
      <UpstreamScrollStack
        key={run}
        itemDistance={itemDistance}
        itemScale={reduce ? 0 : itemScale}
        itemStackDistance={itemStackDistance}
        stackPosition={stackPosition}
        scaleEndPosition={scaleEndPosition}
        baseScale={reduce ? 1 : baseScale}
        scaleDuration={reduce ? 0 : scaleDuration}
        rotationAmount={reduce ? 0 : rotationAmount}
        blurAmount={reduce ? 0 : blurAmount}
        useWindowScroll={false}
        paused={paused}
        onStackComplete={() => setComplete(true)}
      >
        {FEATURES.map((feature) => (
          <ScrollStackItem key={feature.id}>
            <p className="scroll-stack-card__kicker">{feature.kicker}</p>
            <p className="scroll-stack-card__title">{feature.title}</p>
            <p className="scroll-stack-card__copy">{feature.copy}</p>
          </ScrollStackItem>
        ))}
      </UpstreamScrollStack>
    </ReactBitsFrame>
  );
}
