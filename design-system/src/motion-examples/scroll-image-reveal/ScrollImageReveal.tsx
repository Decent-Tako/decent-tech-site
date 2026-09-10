import { MotionConfig, motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type RefObject } from 'react';

import { FEATURES } from '../../pages/content';
import {
  motionReduced,
  useReduce,
  type ReducedMotionMode,
} from '../scroll/reduce';
import { SCROLL_IMAGE_REVEAL_DEFAULTS } from './scrollImageRevealData';
import './scroll-image-reveal.css';

export type ScrollImageRevealProps = {
  clipEnd?: number;
  scaleFrom?: number;
  scaleMid?: number;
  scaleTo?: number;
  yTo?: number;
  reducedMotion?: ReducedMotionMode;
};

const ASPECTS = ['666 / 500', '667 / 500', '375 / 500', '667 / 500', '666 / 500'];

function RevealImage({
  src,
  alt,
  caption,
  aspectRatio,
  container,
  clipEnd,
  scaleFrom,
  scaleMid,
  scaleTo,
  yTo,
  reduce,
}: {
  src: string;
  alt: string;
  caption: string;
  aspectRatio: string;
  container: RefObject<HTMLElement | null>;
  clipEnd: number;
  scaleFrom: number;
  scaleMid: number;
  scaleTo: number;
  yTo: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container,
    target: ref,
    offset: ['start end', 'end start'],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, clipEnd],
    ['inset(0% 50% 0% 50%)', 'inset(0% 0% 0% 0%)'],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, clipEnd, 1],
    [scaleFrom, scaleMid, scaleTo],
  );
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${yTo}%`]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setProgress(value);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <figure
      ref={ref}
      className="academy-image-reveal__item"
      data-reveal-progress={progress.toFixed(3)}
    >
      <motion.div
        className="academy-image-reveal__mask"
        style={{
          clipPath: reduce ? 'inset(0% 0% 0% 0%)' : clipPath,
          aspectRatio,
        }}
      >
        <motion.img
          data-photo
          src={src}
          alt={alt}
          style={{
            scale: reduce ? 1 : scale,
            y: reduce ? '0%' : y,
          }}
        />
      </motion.div>
      <figcaption className="academy-image-reveal__caption">{caption}</figcaption>
    </figure>
  );
}

export function ScrollImageReveal(props: ScrollImageRevealProps) {
  const [runId, setRunId] = useState(0);
  return (
    <ScrollImageRevealView
      key={runId}
      {...props}
      onReplay={() => setRunId((current) => current + 1)}
    />
  );
}

function ScrollImageRevealView({
  clipEnd = SCROLL_IMAGE_REVEAL_DEFAULTS.clipEnd,
  scaleFrom = SCROLL_IMAGE_REVEAL_DEFAULTS.scaleFrom,
  scaleMid = SCROLL_IMAGE_REVEAL_DEFAULTS.scaleMid,
  scaleTo = SCROLL_IMAGE_REVEAL_DEFAULTS.scaleTo,
  yTo = SCROLL_IMAGE_REVEAL_DEFAULTS.yTo,
  reducedMotion = SCROLL_IMAGE_REVEAL_DEFAULTS.reducedMotion,
  onReplay,
}: ScrollImageRevealProps & { onReplay: () => void }) {
  const reduce = useReduce(reducedMotion);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight * 0.35;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <MotionConfig reducedMotion={motionReduced(reducedMotion)}>
      <div
        className={
          reduce
            ? 'academy-image-reveal academy-image-reveal--reduce'
            : 'academy-image-reveal academy-image-reveal--force'
        }
      >
        <div className="academy-image-reveal__bar">
          <p className="academy-image-reveal__intro">
            Package <code>motion</code> 13.2.0. Licence MIT. Mechanism: per
            image, <code>useScroll</code> with a target and offset{' '}
            <code>["start end", "end start"]</code>, then{' '}
            <code>useTransform</code> of <code>clipPath</code>, <code>scale</code>
            , and <code>y</code>. Docs{' '}
            <a href="https://motion.dev/docs/react-use-transform">
              https://motion.dev/docs/react-use-transform
            </a>
            . Example{' '}
            <a href="https://motion.dev/examples/react-scroll-image-reveal">
              https://motion.dev/examples/react-scroll-image-reveal
            </a>
            . Live source{' '}
            <a href="https://examples.motion.dev/react/scroll-image-reveal">
              https://examples.motion.dev/react/scroll-image-reveal
            </a>
            . First-party test{' '}
            <a href="https://github.com/motiondivision/motion/blob/main/dev/react/src/tests/scroll-image-reveal.tsx">
              https://github.com/motiondivision/motion/blob/main/dev/react/src/tests/scroll-image-reveal.tsx
            </a>
            . The article tutorial completion is Motion+. The live example still
            publishes this source. No extra runtime. Replay remounts and scrolls
            to the second photograph.
          </p>
          <button
            type="button"
            className="academy-image-reveal__replay"
            onClick={onReplay}
          >
            Replay
          </button>
        </div>
        <p className="academy-image-reveal__fixed">
          Stage is 640px tall so one revealed photograph is in view. Upstream
          uses the window. Border radius 8px stays fixed because it is the mask
          box. Photographs stay full colour.
        </p>
        <div
          ref={scrollerRef}
          className="academy-image-reveal__scroller"
          tabIndex={0}
          data-scroll-stage
          aria-label="Academy photograph reveal"
        >
          <header className="academy-image-reveal__title">
            <h2>Find your uncomfortable</h2>
          </header>
          {FEATURES.map((item, index) => (
            <RevealImage
              key={item.id}
              src={item.photo.src}
              alt={item.photo.alt}
              caption={`${item.title}. ${item.kicker}`}
              aspectRatio={ASPECTS[index] ?? '4 / 3'}
              container={scrollerRef}
              clipEnd={clipEnd}
              scaleFrom={scaleFrom}
              scaleMid={scaleMid}
              scaleTo={scaleTo}
              yTo={yTo}
              reduce={reduce}
            />
          ))}
          <div className="academy-image-reveal__spacer" />
        </div>
      </div>
    </MotionConfig>
  );
}
