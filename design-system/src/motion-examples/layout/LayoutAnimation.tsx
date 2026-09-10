import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { LayoutFrame } from './Frame';
import {
  EXAMPLES,
  LAYOUT_ANIMATION_DEFAULTS,
  MOTION_RUNTIME,
  shouldReduce,
  type LayoutMode,
  type ReducedMotionMode,
} from './source';

export type LayoutAnimationProps = {
  layout?: LayoutMode;
  visualDuration?: number;
  bounce?: number;
  heading?: string;
  offLabel?: string;
  onLabel?: string;
  reducedMotion?: ReducedMotionMode;
};

export function LayoutAnimation({
  layout = LAYOUT_ANIMATION_DEFAULTS.layout,
  visualDuration = LAYOUT_ANIMATION_DEFAULTS.visualDuration,
  bounce = LAYOUT_ANIMATION_DEFAULTS.bounce,
  heading = LAYOUT_ANIMATION_DEFAULTS.heading,
  offLabel = LAYOUT_ANIMATION_DEFAULTS.offLabel,
  onLabel = LAYOUT_ANIMATION_DEFAULTS.onLabel,
  reducedMotion = LAYOUT_ANIMATION_DEFAULTS.reducedMotion,
}: LayoutAnimationProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [isOn, setIsOn] = useState(false);

  return (
    <LayoutFrame
      title="Layout animation"
      mechanism={
        <>
          A <code>button</code> switches <code>justifyContent</code> between{' '}
          <code>flex-end</code> and <code>flex-start</code>. The handle is{' '}
          <code>motion.div layout</code>. <code>MeasureLayout</code> snapshots
          the old box, then the projection node FLIP-animates a CSS{' '}
          <code>transform</code> to the new box.
        </>
      }
      docs={MOTION_RUNTIME.docsLayout}
      example={EXAMPLES.layoutAnimation.page}
      live={EXAMPLES.layoutAnimation.live}
      fixedNote="Upstream used a 100 by 50 pixel colour switch with no type. This track is 18 rem by 3.5 rem so Draft and Live stay readable. The handle is 2.8 rem. Replay remounts the switch off. This animation is one-shot on click, so Replay is the control."
      controlKind="replay"
      onReplay={() => {
        setIsOn(false);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="layout-animation"
      running={!reduce}
      runId={runId}
    >
      <div className="layout-example__stage">
        <div key={runId} className="layout-toggle-wrap">
          <p className="layout-toggle__copy">{heading}</p>
          <button
            type="button"
            className="layout-toggle"
            style={{
              justifyContent: isOn ? 'flex-start' : 'flex-end',
            }}
            onClick={() => setIsOn((value) => !value)}
            aria-pressed={isOn}
            data-on={isOn ? 'true' : 'false'}
            aria-label={`${heading} ${isOn ? onLabel : offLabel}.`}
          >
            <motion.div
              className="layout-toggle__handle"
              layout={layout}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: 'spring', visualDuration, bounce }
              }
            />
          </button>
          <p className="layout-toggle__status">{isOn ? onLabel : offLabel}</p>
        </div>
      </div>
    </LayoutFrame>
  );
}
