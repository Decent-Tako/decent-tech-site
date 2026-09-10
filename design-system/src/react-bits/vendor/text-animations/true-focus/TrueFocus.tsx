/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TrueFocus/TrueFocus.tsx
 * Page: https://reactbits.dev/text-animations/true-focus
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. Named type imports. The file used the React namespace without an import.
 * 3. `paused` holds the word interval.
 * 4. `reduced` sets blur to 0 and skips the interval.
 * 5. `onIndex` reports the active word.
 * 6. The host carries data-testid="true-focus-copy". Each word carries
 *    data-testid="true-focus-word-{i}" and data-active.
 * 7. pointerenter is accepted so play helpers reach the word.
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import './TrueFocus.css';

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  paused?: boolean;
  reduced?: boolean;
  onIndex?: (index: number) => void;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TrueFocus = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  paused = false,
  reduced = false,
  onIndex,
}: TrueFocusProps) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const blur = reduced ? 0 : blurAmount;

  useEffect(() => {
    onIndex?.(currentIndex);
  }, [currentIndex, onIndex]);

  useEffect(() => {
    if (manualMode || paused || reduced) return;
    const interval = setInterval(
      () => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      },
      (animationDuration + pauseBetweenAnimations) * 1000,
    );

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length, paused, reduced]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;

    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0);
    }
  };

  return (
    <div className="focus-container" ref={containerRef} data-testid="true-focus-copy">
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => {
              if (el) {
                wordRefs.current[index] = el;
              }
            }}
            className={`focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
            data-testid={`true-focus-word-${index}`}
            data-active={isActive ? 'true' : 'false'}
            style={
              {
                filter: isActive ? 'blur(0px)' : `blur(${blur}px)`,
                transition: `filter ${animationDuration}s ease`,
                '--border-color': borderColor,
                '--glow-color': glowColor,
              } as CSSProperties
            }
            onMouseEnter={() => handleEnter(index)}
            onPointerEnter={() => handleEnter(index)}
            onMouseLeave={handleLeave}
            onPointerLeave={handleLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{
          duration: reduced ? 0 : animationDuration,
        }}
        style={
          {
            '--border-color': borderColor,
            '--glow-color': glowColor,
          } as CSSProperties
        }
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;
