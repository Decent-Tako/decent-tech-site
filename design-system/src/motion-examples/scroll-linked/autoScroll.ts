import { useEffect, type RefObject } from 'react';

export function useAutoScroll(
  ref: RefObject<HTMLElement | null>,
  speed: number,
  paused: boolean,
) {
  useEffect(() => {
    const node = ref.current;
    if (!node || paused || speed <= 0) return;

    let direction = 1;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const max = node.scrollHeight - node.clientHeight;
      if (max > 0) {
        const next = node.scrollTop + direction * speed * ((now - last) / 1000);
        if (next >= max) {
          node.scrollTop = max;
          direction = -1;
        } else if (next <= 0) {
          node.scrollTop = 0;
          direction = 1;
        } else {
          node.scrollTop = next;
        }
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, ref, speed]);
}
