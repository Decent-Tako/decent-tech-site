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
 * 2. `inline` prop. With it true the root is a `span` around a `span`, so the
 *    component can sit inside a heading. The split targets the first child
 *    element instead of a `p` query. `rootRef` is typed `HTMLElement` and
 *    both roots set it through a callback ref.
 * 3. `paused` prop. Pointer moves are ignored while `paused` is true, so no
 *    new scramble starts.
 * 4. `aria` prop, passed to the gsap SplitText `aria` option. Upstream leaves
 *    the gsap default `auto`, which writes `aria-label` on the split element;
 *    axe forbids that on a `p` or `span` with no role, so a caller can pass
 *    `none`.
 * 5. The split sets `smartWrap: true`, so gsap wraps the letters of each word
 *    in a `white-space: nowrap` span and leaves the spaces outside. Without it
 *    the browser wrapped between the inline-block letters, inside a word.
 * Everything else is unchanged.
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
  inline?: boolean;
  paused?: boolean;
  aria?: 'auto' | 'hidden' | 'none';
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children,
  inline = false,
  paused = false,
  aria = 'auto'
}) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  const charsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!rootRef.current) return;

    const split = SplitText.create(rootRef.current.firstElementChild, {
      type: 'chars',
      charsClass: 'char',
      smartWrap: true,
      aria
    });
    charsRef.current = split.chars as HTMLElement[];

    charsRef.current.forEach(c => {
      gsap.set(c, {
        display: 'inline-block',
        attr: { 'data-content': c.innerHTML }
      });
    });

    const handleMove = (e: PointerEvent) => {
      if (pausedRef.current) return;
      charsRef.current.forEach(c => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
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
    };

    const el = rootRef.current;
    el.addEventListener('pointermove', handleMove);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars, inline, aria]);

  if (inline) {
    return (
      <span ref={el => { rootRef.current = el; }} className={`text-block ${className}`} style={style}>
        <span>{children}</span>
      </span>
    );
  }

  return (
    <div ref={el => { rootRef.current = el; }} className={`text-block ${className}`} style={style}>
      <p>{children}</p>
    </div>
  );
};

export default ScrambledText;
