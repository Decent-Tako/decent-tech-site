import { motionValue, type MotionValue } from 'motion/react';
import { useEffect } from 'react';

const pointerX = motionValue(0);
const pointerY = motionValue(0);
let pointerListeners = 0;

function onPointerMove(event: PointerEvent) {
  pointerX.set(event.clientX);
  pointerY.set(event.clientY);
}

/**
 * Shared pointer Motion values. motion-plus usePointerPosition is one store
 * that many callers read. Each ColorDot must not attach its own window listener.
 */
export function usePointerPosition(): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  useEffect(() => {
    if (pointerListeners === 0) {
      window.addEventListener('pointermove', onPointerMove);
    }
    pointerListeners += 1;
    return () => {
      pointerListeners -= 1;
      if (pointerListeners === 0) {
        window.removeEventListener('pointermove', onPointerMove);
      }
    };
  }, []);
  return { x: pointerX, y: pointerY };
}
