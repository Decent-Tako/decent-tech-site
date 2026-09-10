/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DecayCard/DecayCard.tsx
 * Page: https://reactbits.dev/components/decay-card
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. Pointer and resize listeners on the card, not window.
 * 2. Unique filter id so two stories can mount at once.
 * 3. paused skips the rAF update so Pause can freeze the decay.
 * 4. onScale reports displacement so the story can assert.
 * 5. Default image is empty. The wrapper supplies an Academy photograph.
 */
import React, { useEffect, useId, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import './DecayCard.css';

interface DecayCardProps {
  width?: number;
  height?: number;
  image?: string;
  baseFrequency?: number;
  numOctaves?: number;
  seed?: number;
  maxDisplacement?: number;
  movementBound?: number;
  children?: ReactNode;
  paused?: boolean;
  instant?: boolean;
  onScale?: (scale: number) => void;
}

const DecayCard: React.FC<DecayCardProps> = ({
  width = 300,
  height = 400,
  image = '',
  baseFrequency = 0.015,
  numOctaves = 5,
  seed = 4,
  maxDisplacement = 400,
  movementBound = 50,
  children,
  paused = false,
  instant = false,
  onScale
}) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const pausedRef = useRef(paused);
  const instantRef = useRef(instant);
  const onScaleRef = useRef(onScale);
  pausedRef.current = paused;
  instantRef.current = instant;
  onScaleRef.current = onScale;
  const filterId = `decay-filter-${useId().replace(/:/g, '')}`;
  const cursor = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cachedCursor = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const size = useRef<{ width: number; height: number }>({ width, height });

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

    const map = (x: number, a: number, b: number, c: number, d: number): number => ((x - a) * (d - c)) / (b - a) + c;

    const distance = (x1: number, x2: number, y1: number, y2: number): number => {
      const a = x1 - x2;
      const b = y1 - y2;
      return Math.hypot(a, b);
    };

    const syncSize = (): void => {
      const rect = el.getBoundingClientRect();
      size.current = { width: rect.width || width, height: rect.height || height };
      cursor.current = { x: size.current.width / 2, y: size.current.height / 2 };
      cachedCursor.current = { ...cursor.current };
    };

    const handlePointerMove = (ev: PointerEvent): void => {
      const rect = el.getBoundingClientRect();
      cursor.current = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    };

    syncSize();
    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(el);
    el.addEventListener('pointermove', handlePointerMove);

    const imgValues = {
      imgTransforms: { x: 0, y: 0, rz: 0 },
      displacementScale: 0
    };

    const render = () => {
      if (!pausedRef.current && !instantRef.current) {
        let targetX = lerp(imgValues.imgTransforms.x, map(cursor.current.x, 0, size.current.width, -120, 120), 0.1);
        let targetY = lerp(imgValues.imgTransforms.y, map(cursor.current.y, 0, size.current.height, -120, 120), 0.1);
        let targetRz = lerp(imgValues.imgTransforms.rz, map(cursor.current.x, 0, size.current.width, -10, 10), 0.1);

        if (targetX > movementBound) targetX = movementBound + (targetX - movementBound) * 0.2;
        if (targetX < -movementBound) targetX = -movementBound + (targetX + movementBound) * 0.2;
        if (targetY > movementBound) targetY = movementBound + (targetY - movementBound) * 0.2;
        if (targetY < -movementBound) targetY = -movementBound + (targetY + movementBound) * 0.2;

        imgValues.imgTransforms.x = targetX;
        imgValues.imgTransforms.y = targetY;
        imgValues.imgTransforms.rz = targetRz;

        if (svgRef.current) {
          gsap.set(svgRef.current, {
            x: imgValues.imgTransforms.x,
            y: imgValues.imgTransforms.y,
            rotateZ: imgValues.imgTransforms.rz
          });
        }

        const cursorTravelledDistance = distance(
          cachedCursor.current.x,
          cursor.current.x,
          cachedCursor.current.y,
          cursor.current.y
        );
        imgValues.displacementScale = lerp(
          imgValues.displacementScale,
          map(cursorTravelledDistance, 0, 200, 0, maxDisplacement),
          0.06
        );

        if (displacementMapRef.current) {
          gsap.set(displacementMapRef.current, {
            attr: { scale: imgValues.displacementScale }
          });
        }

        onScaleRef.current?.(imgValues.displacementScale);
        cachedCursor.current = { ...cursor.current };
      }

      rafId = requestAnimationFrame(render);
    };

    let rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      el.removeEventListener('pointermove', handlePointerMove);
    };
  }, [maxDisplacement, movementBound, width, height]);

  return (
    <div className="content" style={{ width: `${width}px`, height: `${height}px` }} ref={svgRef}>
      <svg viewBox="-60 -75 720 900" preserveAspectRatio="xMidYMid slice" className="svg">
        <filter id={filterId}>
          <feTurbulence
            type="turbulence"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            seed={seed}
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence1"
          />
          <feDisplacementMap
            ref={displacementMapRef}
            in="SourceGraphic"
            in2="turbulence1"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="B"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="displacementMap3"
          />
        </filter>
        <g>
          <image
            href={image}
            x="0"
            y="0"
            width="600"
            height="750"
            filter={`url(#${filterId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </svg>
      <div className="card-text">{children}</div>
    </div>
  );
};

export default DecayCard;
