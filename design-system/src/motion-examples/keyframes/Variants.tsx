import { useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { VARIANTS_DEFAULTS } from './defaults';
import { KeyframeFrame } from './Frame';
import {
  KEYFRAME_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';
import { VariantsNav } from './VariantsNav';

export type VariantsProps = {
  itemStagger?: number;
  itemStartDelay?: number;
  closeStagger?: number;
  itemY?: number;
  hoverScale?: number;
  tapScale?: number;
  openStiffness?: number;
  closeStiffness?: number;
  closeDamping?: number;
  closeDelay?: number;
  initialOpen?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function Variants({
  itemStagger = VARIANTS_DEFAULTS.itemStagger,
  itemStartDelay = VARIANTS_DEFAULTS.itemStartDelay,
  closeStagger = VARIANTS_DEFAULTS.closeStagger,
  itemY = VARIANTS_DEFAULTS.itemY,
  hoverScale = VARIANTS_DEFAULTS.hoverScale,
  tapScale = VARIANTS_DEFAULTS.tapScale,
  openStiffness = VARIANTS_DEFAULTS.openStiffness,
  closeStiffness = VARIANTS_DEFAULTS.closeStiffness,
  closeDamping = VARIANTS_DEFAULTS.closeDamping,
  closeDelay = VARIANTS_DEFAULTS.closeDelay,
  initialOpen = VARIANTS_DEFAULTS.initialOpen,
  reducedMotion = VARIANTS_DEFAULTS.reducedMotion,
  replayNonce = VARIANTS_DEFAULTS.replayNonce,
}: VariantsProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [open, setOpen] = useState(initialOpen);
  const example = KEYFRAME_EXAMPLES.variants;

  return (
    <KeyframeFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation#orchestration"
      fixedNote="The stage stays 500 by 400 pixels and the drawer stays 300 pixels wide because the clip-path circle is authored at 40px 40px. useDimensions is the upstream naive ref. It does not re-render on resize. Replay closes, then opens. Path stroke uses currentColor so hover and focus can switch to paper on blue."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="kf-variants"
      running={open && !reduce}
      runId={runId + replayNonce}
      stageClass="kf__stage--variants"
    >
      <VariantsNav
        itemStagger={itemStagger}
        itemStartDelay={itemStartDelay}
        closeStagger={closeStagger}
        itemY={itemY}
        hoverScale={hoverScale}
        tapScale={tapScale}
        openStiffness={openStiffness}
        closeStiffness={closeStiffness}
        closeDamping={closeDamping}
        closeDelay={closeDelay}
        initialOpen={initialOpen}
        skip={reduce}
        onOpenChange={setOpen}
        replayToken={runId + replayNonce}
      />
    </KeyframeFrame>
  );
}
