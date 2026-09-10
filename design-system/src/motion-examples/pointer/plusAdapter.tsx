import {
  motion,
  useAnimationFrame,
  useSpring,
  type SpringOptions,
} from 'motion/react';
import { useRef, useState, type CSSProperties } from 'react';

import { usePointerPosition } from './usePointerPosition';

export type CursorMagnetic = {
  snap: number;
  padding: number;
};

export type CursorCenter = {
  x: number;
  y: number;
};

export type CursorProps = {
  follow?: boolean;
  center?: CursorCenter;
  spring?: SpringOptions;
  magnetic?: CursorMagnetic;
  style?: CSSProperties;
  className?: string;
  variants?: {
    magnetic?: { opacity?: number; scale?: number };
    idle?: { opacity?: number; scale?: number };
  };
};

function readSize(style: CSSProperties | undefined, axis: 'width' | 'height') {
  const value = style?.[axis];
  return typeof value === 'number' ? value : 20;
}

export function Cursor({
  follow = false,
  center = { x: 0.5, y: 0.5 },
  spring = { stiffness: 500, damping: 40 },
  magnetic,
  style,
  className,
  variants,
}: CursorProps) {
  const pointer = usePointerPosition();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const [snapped, setSnapped] = useState(false);
  const snappedRef = useRef(false);
  const width = readSize(style, 'width');
  const height = readSize(style, 'height');

  useAnimationFrame(() => {
    const px = pointer.x.get();
    const py = pointer.y.get();
    let tx = px - width * center.x;
    let ty = py - height * center.y;
    let nextSnapped = false;

    if (magnetic) {
      const target = document.querySelector<HTMLElement>('[data-magnetic]');
      if (target) {
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const radius =
          Math.max(rect.width, rect.height) / 2 + magnetic.padding;
        const dist = Math.hypot(px - cx, py - cy);
        if (dist <= radius) {
          tx = tx + (cx - width * center.x - tx) * magnetic.snap;
          ty = ty + (cy - height * center.y - ty) * magnetic.snap;
          nextSnapped = true;
        }
      }
    }

    if (follow || nextSnapped) {
      x.set(tx);
      y.set(ty);
    } else {
      x.jump(tx);
      y.jump(ty);
    }

    if (nextSnapped !== snappedRef.current) {
      snappedRef.current = nextSnapped;
      setSnapped(nextSnapped);
    }
  });

  return (
    <motion.div
      aria-hidden="true"
      data-testid="plus-cursor"
      data-magnetic-active={snapped ? 'true' : 'false'}
      className={className}
      variants={variants}
      initial={false}
      animate={snapped ? 'magnetic' : 'idle'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        pointerEvents: 'none',
        zIndex: 30,
        x,
        y,
        ...style,
      }}
    />
  );
}
