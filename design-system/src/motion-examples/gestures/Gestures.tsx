import { motion } from 'motion/react';
import { useState } from 'react';

import { GestureFrame } from './Frame';
import {
  EXAMPLES,
  GESTURES_DEFAULTS,
  MOTION_RUNTIME,
  type ReducedMotionMode,
} from './source';

export type GesturesProps = {
  hoverScale?: number;
  tapScale?: number;
  hoverRotate?: number;
  tapRotate?: number;
  hoverDuration?: number;
  springStiffness?: number;
  springDamping?: number;
  label?: string;
  reducedMotion?: ReducedMotionMode;
};

export function Gestures({
  hoverScale = GESTURES_DEFAULTS.hoverScale,
  tapScale = GESTURES_DEFAULTS.tapScale,
  hoverRotate = GESTURES_DEFAULTS.hoverRotate,
  tapRotate = GESTURES_DEFAULTS.tapRotate,
  hoverDuration = GESTURES_DEFAULTS.hoverDuration,
  springStiffness = GESTURES_DEFAULTS.springStiffness,
  springDamping = GESTURES_DEFAULTS.springDamping,
  label = GESTURES_DEFAULTS.label,
  reducedMotion = GESTURES_DEFAULTS.reducedMotion,
}: GesturesProps) {
  const [runId, setRunId] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <GestureFrame
      title="Gestures"
      mechanism={
        <>
          <code>whileHover</code> and <code>whileTap</code> set target
          keyframes. Hover uses a tween. Rest and tap use a spring. Pages/Pressable
          already uses these props for a different composition.
        </>
      }
      docs={MOTION_RUNTIME.docsGestures}
      example={EXAMPLES.gestures.page}
      live={EXAMPLES.gestures.live}
      priorNote="Pages/Pressable already uses whileHover and whileTap for a different composition."
      fixedNote="The tile is 160 px so RSVP copy stays legible. Upstream was a 100 px square with no text. Rest colour is ink. Hover is blue. Press is yellow."
      onReplay={() => {
        setHovering(false);
        setPressed(false);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
    >
      <div className="gesture-example__stage">
        <motion.button
          key={runId}
          type="button"
          className="gesture-press"
          whileHover={{
            scale: hoverScale,
            rotate: hoverRotate,
            backgroundColor: '#0035B1',
            color: '#FFFFFF',
            transition: { duration: hoverDuration },
          }}
          whileTap={{
            scale: tapScale,
            rotate: tapRotate,
            backgroundColor: '#DEF54F',
            color: '#212121',
          }}
          whileFocus={{
            scale: hoverScale,
            backgroundColor: '#0035B1',
            color: '#FFFFFF',
          }}
          transition={{
            type: 'spring',
            stiffness: springStiffness,
            damping: springDamping,
          }}
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
          onTapStart={() => setPressed(true)}
          onTap={() => setPressed(false)}
          onTapCancel={() => setPressed(false)}
          data-hovering={hovering ? 'true' : 'false'}
          data-pressed={pressed ? 'true' : 'false'}
        >
          {label}
        </motion.button>
      </div>
    </GestureFrame>
  );
}
