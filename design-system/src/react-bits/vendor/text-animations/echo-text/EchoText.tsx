/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/EchoText/EchoText.tsx
 * Page: https://reactbits.dev/text-animations/echo-text
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. `paused` holds the frame loop at the last snapshot.
 * 3. `reduced` drops the ghost copies so reduced-motion stories show one word.
 * 4. Pointer listeners bind to the root span, not window or document.
 * 5. `onActivity` reports the trail amount for the story stage.
 * 6. The front copy carries data-testid="echo-text-copy".
 * 7. `React.FC` became a plain function.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import './EchoText.css';

type Direction = 'right' | 'left' | 'up' | 'down' | 'diagonal';
type Mode = 'entrance' | 'pointer' | 'both';
type Ease = 'linear' | 'ease-out' | 'ease-in-out' | 'snappy';

type Vector = { x: number; y: number };
type Position = { x: number; y: number };

type AnimationState = {
  targetX: number;
  targetY: number;
  lastTargetX: number;
  lastTargetY: number;
  activity: number;
  positions: Position[];
  startTime: number;
};

export interface EchoTextProps {
  text?: string;
  echoes?: number;
  lag?: number;
  offset?: number;
  direction?: Direction;
  fade?: number;
  blur?: number;
  tint?: string | false;
  mode?: Mode;
  cursorRadius?: number;
  duration?: number;
  ease?: Ease;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  paused?: boolean;
  reduced?: boolean;
  onActivity?: (activity: number) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const directionVectors: Record<Direction, Vector> = {
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  diagonal: { x: 0.72, y: 0.72 },
};

const easing: Record<Ease, (t: number) => number> = {
  linear: (t) => t,
  'ease-out': (t) => 1 - Math.pow(1 - t, 3),
  'ease-in-out': (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  snappy: (t) => 1 - Math.pow(1 - t, 5),
};

const EchoText = ({
  text = 'Motion Echo',
  echoes = 12,
  lag = 0.24,
  offset = 36,
  direction = 'right',
  fade = 0.72,
  blur = 3,
  tint = '#7dd3fc',
  mode = 'both',
  cursorRadius = 320,
  duration = 900,
  ease = 'ease-out',
  fontSize = 'clamp(3rem, 9vw, 7rem)',
  fontWeight = 800,
  color = '#f8fafc',
  className = '',
  style,
  paused = false,
  reduced = false,
  onActivity,
}: EchoTextProps) => {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const copyRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const stateRef = useRef<AnimationState | null>(null);
  const pausedRef = useRef(paused);
  const onActivityRef = useRef(onActivity);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(reduced);
  pausedRef.current = paused;
  onActivityRef.current = onActivity;

  const echoCount = prefersReducedMotion || reduced ? 0 : clamp(Math.round(echoes), 0, 24);
  const copyIndexes = useMemo(
    () => Array.from({ length: echoCount + 1 }, (_, index) => index),
    [echoCount],
  );

  useEffect(() => {
    if (reduced) {
      setPrefersReducedMotion(true);
      return;
    }
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(media.matches);
    updateMotionPreference();

    media.addEventListener?.('change', updateMotionPreference);
    return () => media.removeEventListener?.('change', updateMotionPreference);
  }, [reduced]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion || reduced) {
      onActivityRef.current?.(0);
      return;
    }

    const vector = directionVectors[direction] || directionVectors.right;
    const safeOffset = clamp(Number(offset) || 0, 0, 120);
    const safeCursorRadius = clamp(Number(cursorRadius) || 320, 40, 1200);
    const safeLag = clamp(Number(lag) || 0.16, 0.02, 0.5);
    const safeFade = clamp(Number(fade) || 0.64, 0.1, 0.95);
    const safeBlur = clamp(Number(blur) || 0, 0, 16);
    const safeDuration = Math.max(0, Number(duration) || 0);
    const easeFn = easing[ease] || easing['ease-out'];
    const entranceEnabled = mode === 'entrance' || mode === 'both';
    const pointerEnabled = mode === 'pointer' || mode === 'both';
    const positions = Array.from({ length: echoCount + 1 }, (_, index) => {
      const entranceAmount = entranceEnabled ? safeOffset * (index + 0.35) : 0;
      return { x: vector.x * entranceAmount, y: vector.y * entranceAmount };
    });

    stateRef.current = {
      targetX: 0,
      targetY: 0,
      lastTargetX: 0,
      lastTargetY: 0,
      activity: entranceEnabled ? 1 : 0,
      positions,
      startTime: performance.now(),
    };

    const handlePointerMove = (event: PointerEvent) => {
      const state = stateRef.current;
      if (!state) return;

      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const reach = distance > 0 ? clamp(distance / safeCursorRadius, 0, 1) : 0;
      const dirX = distance > 0 ? deltaX / distance : 0;
      const dirY = distance > 0 ? deltaY / distance : 0;

      state.targetX = dirX * reach * safeOffset;
      state.targetY = dirY * reach * safeOffset * 0.72;
    };

    const handlePointerLeave = () => {
      const state = stateRef.current;
      if (!state) return;
      state.targetX = 0;
      state.targetY = 0;
    };

    if (pointerEnabled) {
      root.addEventListener('pointermove', handlePointerMove);
      root.addEventListener('pointerleave', handlePointerLeave);
    }

    const renderFrame = (now: number) => {
      const state = stateRef.current;
      if (!state) return;

      if (pausedRef.current) {
        frameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const elapsed = now - state.startTime;
      const entranceProgress = entranceEnabled && safeDuration > 0 ? clamp(elapsed / safeDuration, 0, 1) : 1;
      const easedEntrance = easeFn(entranceProgress);
      const entranceRest = entranceEnabled ? 1 - easedEntrance : 0;
      const targetVelocity = Math.hypot(state.targetX - state.lastTargetX, state.targetY - state.lastTargetY);

      state.lastTargetX = state.targetX;
      state.lastTargetY = state.targetY;

      let maxSeparation = 0;

      for (let index = 0; index <= echoCount; index += 1) {
        const copy = copyRefs.current[index];
        const current = state.positions[index];
        if (!copy || !current) continue;

        const entranceAmount = entranceRest * safeOffset * (index + 0.35);
        const desiredX = state.targetX + vector.x * entranceAmount;
        const desiredY = state.targetY + vector.y * entranceAmount;
        const lerp = clamp(0.34 / (1 + index * safeLag * 4.2), 0.018, 0.36);

        current.x += (desiredX - current.x) * lerp;
        current.y += (desiredY - current.y) * lerp;

        copy.style.transform = `translate3d(${current.x.toFixed(3)}px, ${current.y.toFixed(3)}px, 0)`;

        if (index > 0) {
          const front = state.positions[0];
          const separation = front ? Math.hypot(current.x - front.x, current.y - front.y) : 0;
          maxSeparation = Math.max(maxSeparation, separation);
          const depth = echoCount ? index / echoCount : 0;
          copy.style.filter = safeBlur > 0 ? `blur(${(safeBlur * depth).toFixed(2)}px)` : 'none';
        }
      }

      const separationActivity = safeOffset > 0 ? clamp(maxSeparation / (safeOffset * 2.25), 0, 1) : 0;
      const targetActivity = safeOffset > 0 ? clamp(targetVelocity / (safeOffset * 0.35), 0, 1) : 0;
      const nextActivity = Math.max(entranceRest, separationActivity, targetActivity);
      state.activity += (nextActivity - state.activity) * 0.18;
      onActivityRef.current?.(state.activity);

      for (let index = 1; index <= echoCount; index += 1) {
        const copy = copyRefs.current[index];
        if (!copy) continue;
        copy.style.opacity = String(Math.pow(safeFade, index) * state.activity);
      }

      const stillMoving =
        state.activity > 0.002 ||
        Math.abs(state.targetX) > 0.01 ||
        Math.abs(state.targetY) > 0.01 ||
        entranceProgress < 1 ||
        pointerEnabled;

      if (stillMoving) {
        frameRef.current = requestAnimationFrame(renderFrame);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (pointerEnabled) {
        root.removeEventListener('pointermove', handlePointerMove);
        root.removeEventListener('pointerleave', handlePointerLeave);
      }
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      stateRef.current = null;
    };
  }, [
    blur,
    cursorRadius,
    direction,
    duration,
    ease,
    echoCount,
    fade,
    lag,
    mode,
    offset,
    prefersReducedMotion,
    reduced,
  ]);

  const rootStyle: CSSProperties = {
    fontSize,
    fontWeight,
    color,
    ...style,
  };

  return (
    <span ref={rootRef} className={`echo-text ${className}`.trim()} style={rootStyle} data-testid="echo-text-root">
      {copyIndexes
        .slice(1)
        .reverse()
        .map((index) => (
          <span
            aria-hidden="true"
            className="echo-text__echo"
            data-echo-index={index}
            key={`echo-${index}`}
            ref={(element) => {
              copyRefs.current[index] = element;
            }}
            style={{
              color: tint ? `color-mix(in srgb, ${tint} ${Math.min(72, 18 + index * 5)}%, ${color})` : color,
              opacity: 0,
            }}
          >
            {text}
          </span>
        ))}
      <span
        className="echo-text__echo echo-text__echo--front"
        data-echo-index="0"
        data-testid="echo-text-copy"
        ref={(element) => {
          copyRefs.current[0] = element;
        }}
      >
        {text}
      </span>
    </span>
  );
};

export default EchoText;
