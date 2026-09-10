/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GridMotion/GridMotion.tsx
 * Page: https://reactbits.dev/backgrounds/grid-motion
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. paused and onReady props so the story can hold the rows and prove paint.
 * 2. Pointer listeners bind to the grid root, not window.
 * 3. Treat local image paths (not only http URLs) as photographs.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import './GridMotion.css';

interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
  paused?: boolean;
  onReady?: () => void;
}

function isImageSrc(value: string): boolean {
  return /^(https?:)?\//.test(value) || /\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(value);
}

const GridMotion = ({
  items = [],
  gradientColor = 'black',
  paused = false,
  onReady,
}: GridMotionProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef(0.5);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    const root = gridRef.current;
    if (!root) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const rect = root.getBoundingClientRect();
      const width = rect.width || 1;
      mouseXRef.current = (e.clientX - rect.left) / width;
    };

    const updateMotion = (): void => {
      if (pausedRef.current) return;
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = (mouseXRef.current * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    root.addEventListener('mousemove', handleMouseMove);
    readyRef.current?.();

    return () => {
      root.removeEventListener('mousemove', handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  return (
    <div className="noscroll loading" ref={gridRef}>
      <section
        className="intro"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div className="gridMotion-container">
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="row"
              ref={el => {
                rowRefs.current[rowIndex] = el;
              }}
            >
              {Array.from({ length: 7 }, (_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} className="row__item">
                    <div className="row__item-inner" style={{ backgroundColor: '#111' }}>
                      {typeof content === 'string' && isImageSrc(content) ? (
                        <div
                          className="row__item-img"
                          style={{
                            backgroundImage: `url(${content})`
                          }}
                        ></div>
                      ) : (
                        <div className="row__item-content">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="fullview"></div>
      </section>
    </div>
  );
};

export default GridMotion;
