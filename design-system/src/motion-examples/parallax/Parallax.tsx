import {
  MotionConfig,
  animate,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useEffect, useRef, useState, type RefObject } from 'react';

import {
  DEMO_DURATION,
  DEMO_PROGRESS,
  IMAGE_SPEED_SCALE,
  PARALLAX_DEFAULTS,
  PARALLAX_OFFSET,
  PARALLAX_SECTIONS,
  TEXT_RANGE,
  type ReducedMotionMode,
} from './parallaxData';
import './parallax.css';

export type ParallaxProps = {
  imageSpeed?: number;
  textY?: number;
  reducedMotion?: ReducedMotionMode;
};

function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

export function Parallax(props: ParallaxProps) {
  const imageSpeed = props.imageSpeed ?? PARALLAX_DEFAULTS.imageSpeed;
  const textY = props.textY ?? PARALLAX_DEFAULTS.textY;
  const reducedMotion = props.reducedMotion ?? PARALLAX_DEFAULTS.reducedMotion;
  const [runId, setRunId] = useState(0);

  return (
    <MotionConfig
      reducedMotion={
        reducedMotion === 'always'
          ? 'always'
          : reducedMotion === 'never'
            ? 'never'
            : 'user'
      }
    >
      <figure className="academy-parallax">
        <div className="academy-parallax__bar">
          <div>
            <h2 className="academy-parallax__title">Parallax</h2>
            <p className="academy-parallax__intro">
              Package <code>motion</code> 13.2.0. Licence MIT. Mechanism: each
              section calls <code>useScroll</code> with offset{' '}
              {PARALLAX_OFFSET.join(', ')}. <code>useTransform</code> maps
              progress to image <code>y</code> at{' '}
              <code>imageSpeed * {IMAGE_SPEED_SCALE}</code> percent, and to
              title opacity and <code>y</code> on {TEXT_RANGE.join(', ')}. Docs{' '}
              <a href="https://motion.dev/docs/react-use-scroll">
                https://motion.dev/docs/react-use-scroll
              </a>
              . Example{' '}
              <a href="https://motion.dev/examples/react-parallax">
                https://motion.dev/examples/react-parallax
              </a>
              . Live{' '}
              <a href="https://examples.motion.dev/react/parallax">
                https://examples.motion.dev/react/parallax
              </a>
              . Source{' '}
              <a href="https://github.com/motiondivision/motion">
                https://github.com/motiondivision/motion
              </a>
              . No extra runtime. Prior Academy use: none. Pages/Feature scroll
              uses <code>useScroll</code> for a different composition.
            </p>
          </div>
          <button
            type="button"
            className="academy-parallax__replay"
            onClick={() => setRunId((value) => value + 1)}
          >
            Replay
          </button>
        </div>
        <p className="academy-parallax__fixed">
          Each section stays 40rem, matching the stage, so one panel fills the
          frame. The background stays 130% tall with a -15% offset because that
          extra image is the parallax travel. TEXT_RANGE stays four stops.
          Replay runs a {DEMO_DURATION}s sweep.
        </p>
        <ParallaxStage
          key={`${runId}-${imageSpeed}-${textY}-${reducedMotion}`}
          runId={runId}
          imageSpeed={imageSpeed}
          textY={textY}
          reducedMotion={reducedMotion}
        />
      </figure>
    </MotionConfig>
  );
}

function ParallaxStage({
  runId,
  imageSpeed,
  textY,
  reducedMotion,
}: {
  runId: number;
  imageSpeed: number;
  textY: number;
  reducedMotion: ReducedMotionMode;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stage = scrollRef.current;
    if (!stage || reduce) return;
    stage.scrollTop = 0;
    const target = stage.scrollHeight * DEMO_PROGRESS;
    const controls = animate(0, target, {
      duration: DEMO_DURATION,
      ease: 'easeInOut',
      onUpdate: (value) => {
        stage.scrollTop = value;
      },
    });
    return () => controls.stop();
  }, [reduce, runId]);

  return (
    <div
      ref={scrollRef}
      className="academy-parallax__stage"
      tabIndex={0}
      aria-label="Parallax example"
      data-testid="parallax-stage"
      data-run-id={String(runId)}
      data-progress={progress.toFixed(3)}
      data-reduced={reduce ? 'true' : 'false'}
    >
      <div className="academy-parallax__page">
        {PARALLAX_SECTIONS.map((section, index) => (
          <ParallaxSection
            key={section.id}
            index={index}
            title={section.title}
            subtitle={section.subtitle}
            src={section.photo.src}
            alt={section.photo.alt}
            imageSpeed={imageSpeed}
            textY={textY}
            reduce={reduce}
            scrollRef={scrollRef}
            onLeadProgress={index === 0 ? setProgress : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function ParallaxSection({
  index,
  title,
  subtitle,
  src,
  alt,
  imageSpeed,
  textY,
  reduce,
  scrollRef,
  onLeadProgress,
}: {
  index: number;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  imageSpeed: number;
  textY: number;
  reduce: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onLeadProgress?: (value: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    target: ref,
    offset: [PARALLAX_OFFSET[0], PARALLAX_OFFSET[1]],
  });
  const speed = imageSpeed * IMAGE_SPEED_SCALE;
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${speed}%`, `${speed}%`],
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [...TEXT_RANGE],
    [0, 1, 1, 0],
  );
  const textShift = useTransform(
    scrollYProgress,
    [...TEXT_RANGE],
    [textY, 0, 0, -textY],
  );

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    onLeadProgress?.(value);
  });

  return (
    <section ref={ref} className="academy-parallax__section">
      <motion.div
        className="academy-parallax__bg"
        style={reduce ? undefined : { y: imageY }}
      >
        <img
          data-photo=""
          src={src}
          alt={alt}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </motion.div>
      <div className="academy-parallax__overlay" />
      <motion.div
        className="academy-parallax__content"
        style={reduce ? undefined : { opacity: textOpacity, y: textShift }}
      >
        <h3 className="academy-parallax__headline">{title}</h3>
        <p className="academy-parallax__subtitle">{subtitle}</p>
      </motion.div>
    </section>
  );
}
