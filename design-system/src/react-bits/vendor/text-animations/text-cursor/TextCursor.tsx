/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TextCursor/TextCursor.tsx
 * Page: https://reactbits.dev/text-animations/text-cursor
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. `paused` skips new trail points and the removal interval.
 * 3. `reduced` keeps the trail empty.
 * 4. `onTrailChange` reports the trail length.
 * 5. Pointer listeners bind to the container, including pointermove so play helpers reach it.
 * 6. The host carries data-testid="text-cursor-host".
 * 7. `React.FC` became a plain function.
 * 8. Trail items are aria-hidden. They are decorative copies.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './TextCursor.css';

interface TextCursorProps {
  text: string;
  spacing?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  maxPoints?: number;
  paused?: boolean;
  reduced?: boolean;
  onTrailChange?: (count: number) => void;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  angle: number;
  randomX?: number;
  randomY?: number;
  randomRotate?: number;
}

const TextCursor = ({
  text = '⚛️',
  spacing = 100,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 5,
  paused = false,
  reduced = false,
  onTrailChange
}: TextCursorProps) => {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMoveTimeRef = useRef<number>(Date.now());
  const idCounter = useRef<number>(0);
  const pausedRef = useRef(paused);
  const reducedRef = useRef(reduced);
  const onTrailChangeRef = useRef(onTrailChange);
  pausedRef.current = paused;
  reducedRef.current = reduced;
  onTrailChangeRef.current = onTrailChange;

  const handleMouseMove = (e: MouseEvent | PointerEvent) => {
    if (!containerRef.current || pausedRef.current || reducedRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTrail(prev => {
      const newTrail = [...prev];

      const createRandomData = () =>
        randomFloat
          ? {
              randomX: Math.random() * 10 - 5,
              randomY: Math.random() * 10 - 5,
              randomRotate: Math.random() * 10 - 5
            }
          : {};

      if (newTrail.length === 0) {
        newTrail.push({
          id: idCounter.current++,
          x: mouseX,
          y: mouseY,
          angle: 0,
          ...createRandomData()
        });
      } else {
        const last = newTrail[newTrail.length - 1];
        const dx = mouseX - last.x;
        const dy = mouseY - last.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= spacing) {
          let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

          const computedAngle = followMouseDirection ? rawAngle : 0;
          const steps = Math.floor(distance / spacing);

          for (let i = 1; i <= steps; i++) {
            const t = (spacing * i) / distance;
            const newX = last.x + dx * t;
            const newY = last.y + dy * t;

            newTrail.push({
              id: idCounter.current++,
              x: newX,
              y: newY,
              angle: computedAngle,
              ...createRandomData()
            });
          }
        }
      }

      const next = newTrail.length > maxPoints ? newTrail.slice(newTrail.length - maxPoints) : newTrail;
      onTrailChangeRef.current?.(next.length);
      return next;
    });

    lastMoveTimeRef.current = Date.now();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('pointermove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('pointermove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current || reducedRef.current) return;
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail(prev => {
          const next = prev.length > 0 ? prev.slice(1) : prev;
          if (next !== prev) onTrailChangeRef.current?.(next.length);
          return next;
        });
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    <div ref={containerRef} className="text-cursor-container" data-testid="text-cursor-host">
      <div className="text-cursor-inner">
        <AnimatePresence>
          {trail.map(item => (
            <motion.div
              key={item.id}
              initial={{ scale: 0.85, rotate: item.angle }}
              animate={{
                scale: 1,
                x: randomFloat ? [0, item.randomX || 0, 0] : 0,
                y: randomFloat ? [0, item.randomY || 0, 0] : 0,
                rotate: randomFloat ? [item.angle, item.angle + (item.randomRotate || 0), item.angle] : item.angle
              }}
              exit={{ scale: 0 }}
              transition={{
                scale: { duration: exitDuration, ease: 'easeOut' },
                ...(randomFloat && {
                  x: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
                  y: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
                  rotate: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }
                })
              }}
              className="text-cursor-item"
              style={{ left: item.x, top: item.y }}
              aria-hidden="true"
            >
              {text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TextCursor;
