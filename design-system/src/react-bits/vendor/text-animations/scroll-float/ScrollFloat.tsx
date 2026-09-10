/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrollFloat/ScrollFloat.tsx
 * Page: https://reactbits.dev/text-animations/scroll-float
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. `paused` disables the ScrollTrigger without reverting.
 * 3. `reduced` skips the tween and leaves glyphs in the final pose.
 * 4. `onProgress` reports scrub progress.
 * 5. The heading carries data-testid="scroll-float-copy".
 * 6. Cleanup kills only this tween.
 * 7. Unused default React import removed for erasableSyntaxOnly.
 */
import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  paused?: boolean;
  reduced?: boolean;
  onProgress?: (progress: number) => void;
}

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  paused = false,
  reduced = false,
  onProgress
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      <span className="char" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll('.char');
    if (reduced) {
      gsap.set(charElements, { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1 });
      onProgressRef.current?.(1);
      return;
    }

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const tween = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
          onUpdate: self => onProgressRef.current?.(self.progress)
        }
      }
    );
    triggerRef.current = tween.scrollTrigger ?? null;

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      triggerRef.current = null;
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, reduced]);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    if (paused) trigger.disable(false);
    else trigger.enable();
  }, [paused, reduced]);

  return (
    <h2
      ref={containerRef}
      className={`scroll-float ${containerClassName}`}
      data-testid="scroll-float-copy"
    >
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
