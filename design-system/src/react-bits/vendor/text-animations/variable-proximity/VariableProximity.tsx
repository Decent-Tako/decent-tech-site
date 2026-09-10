/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/VariableProximity/VariableProximity.tsx
 * Page: https://reactbits.dev/text-animations/variable-proximity
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. Named CSSProperties import. The file used the React namespace without an import.
 * 3. Brand Sans replaces Roboto Flex. The Google Fonts import is gone. The
 *    repository cannot load a remote face. Brand Sans is a static face, so
 *    nearby glyphs also set font-weight from the interpolated wght.
 * 4. Pointer listeners bind to the container, not window. pointermove is
 *    accepted so play helpers reach the sketch.
 * 5. `paused` holds the frame loop.
 * 6. `reduced` freezes variation at the from settings.
 * 7. `onProximity` reports the peak interpolated weight.
 * 8. The host carries data-testid="variable-proximity-copy".
 */

import {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
  type CSSProperties,
  type RefObject,
  type HTMLAttributes,
} from 'react';
import { motion } from 'motion/react';
import './VariableProximity.css';

type Callback = () => void;

function useAnimationFrame(callback: Callback, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback, enabled]);
}

function usePointerPositionRef(containerRef: RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const node = containerRef?.current;
    if (!node) return;

    const updatePosition = (x: number, y: number) => {
      const rect = node.getBoundingClientRect();
      positionRef.current = { x: x - rect.left, y: y - rect.top };
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handlePointerMove = (ev: PointerEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (!touch) return;
      updatePosition(touch.clientX, touch.clientY);
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('touchmove', handleTouchMove);
    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

interface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  paused?: boolean;
  reduced?: boolean;
  onProximity?: (weight: number) => void;
}

const parseWeight = (settingsStr: string, fallback: number) => {
  const match = settingsStr.match(/['"]?wght['"]?\s+([0-9.]+)/);
  if (!match) return fallback;
  const value = Number.parseFloat(match[1]);
  return Number.isFinite(value) ? value : fallback;
};

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    paused = false,
    reduced = false,
    onProximity,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = usePointerPositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const fromWeight = parseWeight(fromFontVariationSettings, 400);
  const toWeight = parseWeight(toFontVariationSettings, 700);

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map((s) => s.trim())
          .map((s) => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)] as const;
          }),
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }
    lastPositionRef.current = { x, y };
    const containerRect = containerRef.current.getBoundingClientRect();
    let peak = fromWeight;

    letterRefs.current.forEach((letterRef) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(
        mousePositionRef.current.x,
        mousePositionRef.current.y,
        letterCenterX,
        letterCenterY,
      );

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        letterRef.style.fontWeight = String(fromWeight);
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');
      const weight = Math.round(fromWeight + (toWeight - fromWeight) * falloffValue);
      peak = Math.max(peak, weight);

      letterRef.style.fontVariationSettings = newSettings;
      letterRef.style.fontWeight = String(weight);
    });

    onProximity?.(peak);
  }, !paused && !reduced);

  useEffect(() => {
    if (!reduced) return;
    letterRefs.current.forEach((letterRef) => {
      if (!letterRef) return;
      letterRef.style.fontVariationSettings = fromFontVariationSettings;
      letterRef.style.fontWeight = String(fromWeight);
    });
    onProximity?.(fromWeight);
  }, [reduced, fromFontVariationSettings, fromWeight, onProximity]);

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      data-testid="variable-proximity-copy"
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={(el) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex],
                  fontWeight: fromWeight,
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}
      <span className="variable-proximity__sr">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
