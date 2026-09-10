import { MotionConfig, motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { FEATURES } from '../../pages/content';
import {
  motionReduced,
  useReduce,
  type ReducedMotionMode,
} from '../scroll/reduce';
import {
  SCROLL_HORIZONTAL_DEFAULTS,
  type ScrollOffsetPair,
} from './scrollHorizontalData';
import './scroll-horizontal.css';

export type ScrollHorizontalProps = {
  itemWidth?: number;
  gap?: number;
  offsetStart?: ScrollOffsetPair;
  offsetEnd?: ScrollOffsetPair;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollHorizontal(props: ScrollHorizontalProps) {
  const [runId, setRunId] = useState(0);
  return (
    <ScrollHorizontalView
      key={runId}
      {...props}
      onReplay={() => setRunId((current) => current + 1)}
    />
  );
}

function ScrollHorizontalView({
  itemWidth = SCROLL_HORIZONTAL_DEFAULTS.itemWidth,
  gap = SCROLL_HORIZONTAL_DEFAULTS.gap,
  offsetStart = SCROLL_HORIZONTAL_DEFAULTS.offsetStart,
  offsetEnd = SCROLL_HORIZONTAL_DEFAULTS.offsetEnd,
  reducedMotion = SCROLL_HORIZONTAL_DEFAULTS.reducedMotion,
  onReplay,
}: ScrollHorizontalProps & { onReplay: () => void }) {
  const reduce = useReduce(reducedMotion);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollerRef,
    target: trackRef,
    offset: [offsetStart, offsetEnd],
  });
  const totalDistance = (FEATURES.length - 1) * (itemWidth + gap);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setProgress(value);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;
    const frame = requestAnimationFrame(() => {
      scroller.scrollTop = track.offsetTop + track.offsetHeight * 0.45;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <MotionConfig reducedMotion={motionReduced(reducedMotion)}>
      <div
        className={
          reduce
            ? 'academy-scroll-horizontal academy-scroll-horizontal--reduce'
            : 'academy-scroll-horizontal academy-scroll-horizontal--force'
        }
      >
        <div className="academy-scroll-horizontal__bar">
          <p className="academy-scroll-horizontal__intro">
            Package <code>motion</code> 13.2.0. Licence MIT. Mechanism:{' '}
            <code>useScroll</code> with a target and offset{' '}
            <code>["start start", "end end"]</code>, then{' '}
            <code>useTransform(scrollYProgress, [0, 1], [0, -totalDistance])</code>{' '}
            on <code>x</code> of a sticky row. Docs{' '}
            <a href="https://motion.dev/docs/react-scroll-animations">
              https://motion.dev/docs/react-scroll-animations
            </a>
            . Example{' '}
            <a href="https://motion.dev/examples/react-scroll-horizontal">
              https://motion.dev/examples/react-scroll-horizontal
            </a>
            . Live source{' '}
            <a href="https://examples.motion.dev/react/scroll-horizontal">
              https://examples.motion.dev/react/scroll-horizontal
            </a>
            . Repository{' '}
            <a href="https://github.com/motiondivision/motion">
              https://github.com/motiondivision/motion
            </a>
            . No extra runtime. Prior Academy use: Pages/Feature scroll already
            uses this mechanic. Replay remounts and scrolls to mid-track. Mix-blend
            multiply on the photo overlay is dropped so photographs stay full
            colour. The <code>x</code> translation is unchanged.
          </p>
          <button
            type="button"
            className="academy-scroll-horizontal__replay"
            onClick={onReplay}
          >
            Replay
          </button>
        </div>
        <p className="academy-scroll-horizontal__fixed">
          Stage is 640px tall. Cards are {itemWidth} by 500px so one card plus
          the next edge is visible. Upstream uses a 400px sticky wrapper and
          300vh of track. The story uses a container ref because the story
          cannot own the window. Intended viewport 400px and above.
        </p>
        <div
          ref={scrollerRef}
          className="academy-scroll-horizontal__scroller"
          tabIndex={0}
          data-scroll-stage
          data-progress={progress.toFixed(3)}
          aria-label="Academy week gallery"
        >
          <section className="academy-scroll-horizontal__intro-section">
            <h2>Academy weeks</h2>
          </section>
          <div ref={trackRef} className="academy-scroll-horizontal__track">
            <div className="academy-scroll-horizontal__sticky">
              <motion.div
                className="academy-scroll-horizontal__gallery"
                style={{ x: reduce ? 0 : x, gap }}
              >
                {FEATURES.map((item, index) => (
                  <article
                    key={item.id}
                    className="academy-scroll-horizontal__item"
                    style={{ width: itemWidth, height: 500 }}
                  >
                    <img data-photo src={item.photo.src} alt={item.photo.alt} />
                    <div className="academy-scroll-horizontal__copy">
                      <span className="academy-scroll-horizontal__kicker">
                        0{index + 1} {item.kicker}
                      </span>
                      <h3>{item.title}</h3>
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>
          </div>
          <section className="academy-scroll-horizontal__outro">
            <p>Fin</p>
          </section>
        </div>
      </div>
    </MotionConfig>
  );
}
