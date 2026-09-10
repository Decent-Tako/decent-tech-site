/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.tsx
 * Page: https://reactbits.dev/text-animations/scroll-reveal
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. `paused` disables this instance's ScrollTriggers without reverting.
 * 3. `reduced` skips the tweens and leaves words in the final pose.
 * 4. `onProgress` reports the word scrub progress.
 * 5. The heading carries data-testid="scroll-reveal-copy".
 * 6. Cleanup kills only this instance's triggers.
 * 7. Unused default React import removed for erasableSyntaxOnly.
 */
import { useEffect, useRef, useMemo, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  paused?: boolean;
  reduced?: boolean;
  onProgress?: (progress: number) => void;
}

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
  paused = false,
  reduced = false,
  onProgress
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wordElements = el.querySelectorAll<HTMLElement>('.word');
    if (reduced) {
      gsap.set(el, { rotate: 0 });
      gsap.set(wordElements, { opacity: 1, filter: 'blur(0px)' });
      onProgressRef.current?.(1);
      return;
    }

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const triggers: ScrollTrigger[] = [];

    const rotation = gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );
    if (rotation.scrollTrigger) triggers.push(rotation.scrollTrigger);

    const words = gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true,
          onUpdate: self => onProgressRef.current?.(self.progress)
        }
      }
    );
    if (words.scrollTrigger) triggers.push(words.scrollTrigger);

    let blurTween: gsap.core.Tween | undefined;
    if (enableBlur) {
      blurTween = gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
      if (blurTween.scrollTrigger) triggers.push(blurTween.scrollTrigger);
    }

    triggersRef.current = triggers;

    return () => {
      rotation.kill();
      words.kill();
      blurTween?.kill();
      triggers.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength, reduced]);

  useEffect(() => {
    for (const trigger of triggersRef.current) {
      if (paused) trigger.disable(false);
      else trigger.enable();
    }
  }, [paused, reduced]);

  return (
    <h2
      ref={containerRef}
      className={`scroll-reveal ${containerClassName}`}
      data-testid="scroll-reveal-copy"
    >
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
