/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrambledText/ScrambledText.tsx
 * Page: https://reactbits.dev/text-animations/scrambled-text
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. `paused` skips pointer scramble and kills live tweens.
 * 3. `reduced` leaves the paragraph unsplit.
 * 4. `onScramble` reports a pointer scramble.
 * 5. The host carries data-testid="scrambled-text-copy".
 * 6. `React.FC` became a plain function.
 * 7. The original copy sits in a visually hidden span. The split paragraph
 *    is aria-hidden so SplitText cannot put aria-label on a `p`.
 */
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

import './ScrambledText.css';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  paused?: boolean;
  reduced?: boolean;
  onScramble?: () => void;
}

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children,
  paused = false,
  reduced = false,
  onScramble
}: ScrambledTextProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const pausedRef = useRef(paused);
  const onScrambleRef = useRef(onScramble);
  pausedRef.current = paused;
  onScrambleRef.current = onScramble;

  useEffect(() => {
    if (!rootRef.current) return;
    if (reduced) return;

    const paragraph = rootRef.current.querySelector('p');
    const split = SplitText.create(paragraph, {
      type: 'chars',
      charsClass: 'char'
    });
    charsRef.current = split.chars as HTMLElement[];
    paragraph?.removeAttribute('aria-label');
    paragraph?.setAttribute('aria-hidden', 'true');

    charsRef.current.forEach(c => {
      gsap.set(c, {
        display: 'inline-block',
        attr: { 'data-content': c.innerHTML }
      });
    });

    const handleMove = (e: PointerEvent) => {
      if (pausedRef.current) return;
      let scrambled = false;
      charsRef.current.forEach(c => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          scrambled = true;
          gsap.to(c, {
            overwrite: true,
            duration: duration * (1 - dist / radius),
            scrambleText: {
              text: (c as HTMLElement).dataset.content || '',
              chars: scrambleChars,
              speed
            },
            ease: 'none'
          });
        }
      });
      if (scrambled) onScrambleRef.current?.();
    };

    const el = rootRef.current;
    el.addEventListener('pointermove', handleMove);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      gsap.killTweensOf(charsRef.current);
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars, reduced]);

  useEffect(() => {
    if (paused) gsap.killTweensOf(charsRef.current);
  }, [paused]);

  return (
    <div
      ref={rootRef}
      className={`text-block ${className}`}
      style={style}
      data-testid="scrambled-text-copy"
    >
      <span className="scrambled-text__sr">{children}</span>
      <p>{children}</p>
    </div>
  );
};

export default ScrambledText;
