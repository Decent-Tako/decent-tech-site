import {
  animate,
  MotionConfig,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { DESTINATIONS } from '../../pages/content';
import {
  motionReduced,
  useReduce,
  type ReducedMotionMode,
} from '../scroll/reduce';
import { SCROLL_CONTAINER_DEFAULTS } from './scrollContainerData';
import './scroll-container.css';

export type ScrollContainerProps = {
  leftInset?: number;
  rightInset?: number;
  maskDuration?: number;
  reducedMotion?: ReducedMotionMode;
};

const LEFT = '0%';
const RIGHT = '100%';
const TRANSPARENT = '#0000';
const OPAQUE = '#000';

function useScrollOverflowMask(
  scrollXProgress: MotionValue<number>,
  leftInset: number,
  rightInset: number,
  reduce: boolean,
  maskDuration: number,
) {
  const leftFade = `${leftInset}%`;
  const rightFade = `${rightInset}%`;
  const start = `linear-gradient(90deg, ${OPAQUE}, ${OPAQUE} ${LEFT}, ${OPAQUE} ${rightFade}, ${TRANSPARENT})`;
  const mid = `linear-gradient(90deg, ${TRANSPARENT}, ${OPAQUE} ${leftFade}, ${OPAQUE} ${rightFade}, ${TRANSPARENT})`;
  const end = `linear-gradient(90deg, ${TRANSPARENT}, ${OPAQUE} ${leftFade}, ${OPAQUE} ${RIGHT}, ${OPAQUE})`;
  const maskImage = useMotionValue(start);

  useMotionValueEvent(scrollXProgress, 'change', (value) => {
    const apply = (next: string) => {
      if (reduce || maskDuration <= 0) {
        maskImage.set(next);
        return;
      }
      void animate(maskImage, next, { duration: maskDuration });
    };
    if (value === 0) {
      apply(start);
    } else if (value === 1) {
      apply(end);
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      apply(mid);
    }
  });

  return maskImage;
}

export function ScrollContainer(props: ScrollContainerProps) {
  const [runId, setRunId] = useState(0);
  return (
    <ScrollContainerView
      key={runId}
      {...props}
      onReplay={() => setRunId((current) => current + 1)}
    />
  );
}

function ScrollContainerView({
  leftInset = SCROLL_CONTAINER_DEFAULTS.leftInset,
  rightInset = SCROLL_CONTAINER_DEFAULTS.rightInset,
  maskDuration = SCROLL_CONTAINER_DEFAULTS.maskDuration,
  reducedMotion = SCROLL_CONTAINER_DEFAULTS.reducedMotion,
  onReplay,
}: ScrollContainerProps & { onReplay: () => void }) {
  const reduce = useReduce(reducedMotion);
  const ref = useRef<HTMLUListElement>(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const maskImage = useScrollOverflowMask(
    scrollXProgress,
    leftInset,
    rightInset,
    reduce,
    maskDuration,
  );
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollXProgress, 'change', (value) => {
    setProgress(value);
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      const max = Math.max(el.scrollWidth - el.clientWidth, 0);
      el.scrollLeft = max * 0.6;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <MotionConfig reducedMotion={motionReduced(reducedMotion)}>
      <div className="academy-scroll-container">
        <div className="academy-scroll-container__bar">
          <p className="academy-scroll-container__intro">
            Package <code>motion</code> 13.2.0. Licence MIT. Mechanism:{' '}
            <code>useScroll</code> with a container ref on a horizontal list,{' '}
            <code>pathLength: scrollXProgress</code> on the ring, and{' '}
            <code>useMotionValueEvent</code> plus <code>animate()</code> of a{' '}
            <code>maskImage</code> gradient. Docs{' '}
            <a href="https://motion.dev/docs/react-use-scroll">
              https://motion.dev/docs/react-use-scroll
            </a>
            . Example{' '}
            <a href="https://motion.dev/examples/react-scroll-container">
              https://motion.dev/examples/react-scroll-container
            </a>
            . Live source{' '}
            <a href="https://examples.motion.dev/react/scroll-container">
              https://examples.motion.dev/react/scroll-container
            </a>
            . Repository{' '}
            <a href="https://github.com/motiondivision/motion">
              https://github.com/motiondivision/motion
            </a>
            . No extra runtime. Replay resets the list and scrolls to 60% so
            the ring and the edge mask move. This is scroll-linked, not a loop,
            so there is no Pause.
          </p>
          <button
            type="button"
            className="academy-scroll-container__replay"
            onClick={onReplay}
          >
            Replay
          </button>
        </div>
        <p className="academy-scroll-container__fixed">
          Stage is 400px wide and the cards are 200 by 220px so the ring and
          two cards are visible together. Upstream uses the same size. SVG
          geometry (viewBox 100, radius 30, pathLength 1) stays fixed because
          it is the ring, not a visual parameter. <code>axis</code> stays{' '}
          <code>x</code> because this example tracks <code>scrollXProgress</code>.
        </p>
        <div className="academy-scroll-container__stage">
          <svg
            className="academy-scroll-container__progress"
            width="80"
            height="80"
            viewBox="0 0 100 100"
            role="img"
            aria-label={`Week scroller progress ${Math.round(progress * 100)} percent`}
          >
            <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              className="indicator"
              style={{ pathLength: scrollXProgress }}
            />
          </svg>
          <motion.ul
            ref={ref}
            className="academy-scroll-container__list"
            style={{ maskImage }}
            tabIndex={0}
            data-scroll-stage
            data-progress={progress.toFixed(3)}
            aria-label="Academy weeks"
          >
            {DESTINATIONS.map((item) => (
              <li key={item.id} className="academy-scroll-container__card">
                <img data-photo src={item.photo.src} alt={item.photo.alt} />
                <p className="academy-scroll-container__label">{item.title}</p>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </MotionConfig>
  );
}
