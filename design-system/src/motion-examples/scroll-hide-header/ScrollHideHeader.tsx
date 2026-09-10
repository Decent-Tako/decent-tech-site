import {
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Wordmark } from '../../brand/Wordmark';
import { DESTINATIONS, PAGE_NAV } from '../../pages/content';
import {
  motionReduced,
  useReduce,
  type ReducedMotionMode,
} from '../scroll/reduce';
import {
  SCROLL_HIDE_HEADER_DEFAULTS,
  type HideEase,
} from './scrollHideHeaderData';
import './scroll-hide-header.css';

export type ScrollHideHeaderProps = {
  hideThreshold?: number;
  hideY?: number;
  duration?: number;
  ease?: HideEase;
  hiddenOpacity?: number;
  reducedMotion?: ReducedMotionMode;
};

const NAV = PAGE_NAV.filter((item) => item.id !== 'events');

export function ScrollHideHeader(props: ScrollHideHeaderProps) {
  const [runId, setRunId] = useState(0);
  return (
    <ScrollHideHeaderView
      key={runId}
      {...props}
      onReplay={() => setRunId((current) => current + 1)}
    />
  );
}

function ScrollHideHeaderView({
  hideThreshold = SCROLL_HIDE_HEADER_DEFAULTS.hideThreshold,
  hideY = SCROLL_HIDE_HEADER_DEFAULTS.hideY,
  duration = SCROLL_HIDE_HEADER_DEFAULTS.duration,
  ease = SCROLL_HIDE_HEADER_DEFAULTS.ease,
  hiddenOpacity = SCROLL_HIDE_HEADER_DEFAULTS.hiddenOpacity,
  reducedMotion = SCROLL_HIDE_HEADER_DEFAULTS.reducedMotion,
  onReplay,
}: ScrollHideHeaderProps & { onReplay: () => void }) {
  const reduce = useReduce(reducedMotion);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollerRef });
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > hideThreshold) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      el.scrollTop = Math.max(hideThreshold + 80, 230);
    });
    return () => cancelAnimationFrame(frame);
  }, [hideThreshold]);

  return (
    <MotionConfig reducedMotion={motionReduced(reducedMotion)}>
      <div className="academy-hide-header">
        <div className="academy-hide-header__bar">
          <p className="academy-hide-header__intro">
            Package <code>motion</code> 13.2.0. Licence MIT. Mechanism:{' '}
            <code>useScroll</code> <code>scrollY</code> plus{' '}
            <code>useMotionValueEvent(scrollY, "change")</code>. If current is
            greater than previous and greater than the threshold, hide. Else
            show. <code>motion.header</code> animates <code>y</code> and{' '}
            <code>opacity</code>. Docs{' '}
            <a href="https://motion.dev/docs/react-use-motion-value-event">
              https://motion.dev/docs/react-use-motion-value-event
            </a>
            . Example{' '}
            <a href="https://motion.dev/examples/react-scroll-hide-header">
              https://motion.dev/examples/react-scroll-hide-header
            </a>
            . Live source{' '}
            <a href="https://examples.motion.dev/react/scroll-hide-header">
              https://examples.motion.dev/react/scroll-hide-header
            </a>
            . Repository{' '}
            <a href="https://github.com/motiondivision/motion">
              https://github.com/motiondivision/motion
            </a>
            . No extra runtime. Replay remounts at the top, then scrolls past
            the threshold. This is scroll-linked, not a loop, so there is no
            Pause.
          </p>
          <button
            type="button"
            className="academy-hide-header__replay"
            onClick={onReplay}
          >
            Replay
          </button>
        </div>
        <p className="academy-hide-header__fixed">
          Stage is 560px tall so the hide is visible in the canvas. Upstream
          uses the window and 100vh sections. The story uses{' '}
          <code>useScroll</code> with a container ref, a documented option,
          because the story cannot own the window. Header height 60px stays
          fixed because it is the bar geometry.
        </p>
        <div className="academy-hide-header__viewport">
          <motion.header
            className="academy-hide-header__masthead"
            data-hidden={hidden ? 'true' : 'false'}
            inert={hidden}
            animate={{
              y: hidden ? hideY : 0,
              opacity: hidden ? hiddenOpacity : 1,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration, ease }
            }
          >
            <div className="academy-hide-header__masthead-inner">
              <Wordmark
                size="tiny"
                href="#hide-start"
                label="Uncomfortable Academy home"
              />
              <nav className="academy-hide-header__nav" aria-label="Academy">
                {NAV.map((item) => (
                  <a key={item.id} href={`#hide-${item.id}`}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </motion.header>
          <div
            ref={scrollerRef}
            className="academy-hide-header__scroller"
            tabIndex={0}
            data-scroll-stage
            aria-label="Week 0 reading"
          >
            <section className="academy-hide-header__hero">
              <p>
                Scroll down to hide the header.
                <br />
                Scroll up to show it again.
              </p>
            </section>
            {DESTINATIONS.filter((item) => item.id !== 'events').map((item) => (
              <section
                key={item.id}
                className="academy-hide-header__section"
                id={`hide-${item.id}`}
              >
                <h2>{item.title}</h2>
                <p>{item.kicker}</p>
                <p>{item.copy}</p>
                <img data-photo src={item.photo.src} alt={item.photo.alt} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
