import {
  MotionConfig,
  animate,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import {
  DEMO_DURATION,
  DEMO_PROGRESS,
  ZOOM_BODY,
  ZOOM_DEFAULTS,
  ZOOM_KICKER,
  ZOOM_OFFSET,
  ZOOM_PHOTO,
  ZOOM_TITLE,
  type ReducedMotionMode,
} from './scrollZoomHeroData';
import './scroll-zoom-hero.css';

export type ScrollZoomHeroProps = {
  scaleTo?: number;
  blurTo?: number;
  fadeStart?: number;
  textYTo?: number;
  textFadeAt?: number;
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

export function ScrollZoomHero(props: ScrollZoomHeroProps) {
  const scaleTo = props.scaleTo ?? ZOOM_DEFAULTS.scaleTo;
  const blurTo = props.blurTo ?? ZOOM_DEFAULTS.blurTo;
  const fadeStart = props.fadeStart ?? ZOOM_DEFAULTS.fadeStart;
  const textYTo = props.textYTo ?? ZOOM_DEFAULTS.textYTo;
  const textFadeAt = props.textFadeAt ?? ZOOM_DEFAULTS.textFadeAt;
  const reducedMotion = props.reducedMotion ?? ZOOM_DEFAULTS.reducedMotion;
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
      <figure className="scroll-zoom-hero">
        <div className="scroll-zoom-hero__bar">
          <div>
            <h2 className="scroll-zoom-hero__title">Scroll zoom hero</h2>
            <p className="scroll-zoom-hero__intro">
              Package <code>motion</code> 13.2.0. Licence MIT. Mechanism:{' '}
              <code>useScroll</code> with offset {ZOOM_OFFSET.join(', ')} yields{' '}
              <code>scrollYProgress</code>. <code>useTransform</code> maps it to
              scale, blur, opacity, and title offset. Docs{' '}
              <a href="https://motion.dev/docs/react-use-scroll">
                https://motion.dev/docs/react-use-scroll
              </a>
              . Example{' '}
              <a href="https://motion.dev/examples/react-scroll-zoom-hero">
                https://motion.dev/examples/react-scroll-zoom-hero
              </a>
              . Live{' '}
              <a href="https://examples.motion.dev/react/scroll-zoom-hero">
                https://examples.motion.dev/react/scroll-zoom-hero
              </a>
              . Source{' '}
              <a href="https://github.com/motiondivision/motion">
                https://github.com/motiondivision/motion
              </a>
              . No extra runtime. Prior Academy use: Pages/Hero uses this
              mechanic in a page composition.
            </p>
          </div>
          <button
            type="button"
            className="scroll-zoom-hero__replay"
            onClick={() => setRunId((value) => value + 1)}
          >
            Replay
          </button>
        </div>
        <p className="scroll-zoom-hero__fixed">
          The track stays 80rem with a 40rem sticky stage because the upstream
          example is 200vh over 100vh. Offset stays {ZOOM_OFFSET.join(' → ')}{' '}
          because that is the zoom window. Replay runs a {DEMO_DURATION}s sweep.
        </p>
        <ZoomStage
          key={`${runId}-${scaleTo}-${blurTo}-${fadeStart}-${textYTo}-${textFadeAt}-${reducedMotion}`}
          runId={runId}
          scaleTo={scaleTo}
          blurTo={blurTo}
          fadeStart={fadeStart}
          textYTo={textYTo}
          textFadeAt={textFadeAt}
          reducedMotion={reducedMotion}
        />
      </figure>
    </MotionConfig>
  );
}

function ZoomStage({
  runId,
  scaleTo,
  blurTo,
  fadeStart,
  textYTo,
  textFadeAt,
  reducedMotion,
}: {
  runId: number;
  scaleTo: number;
  blurTo: number;
  fadeStart: number;
  textYTo: number;
  textFadeAt: number;
  reducedMotion: ReducedMotionMode;
}) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    target: trackRef,
    offset: [ZOOM_OFFSET[0], ZOOM_OFFSET[1]],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, scaleTo]);
  const opacity = useTransform(
    scrollYProgress,
    [0, fadeStart, 1],
    [1, 1, 0],
  );
  const blur = useTransform(scrollYProgress, [0, 1], [0, blurTo]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', `${textYTo}%`]);
  const textOpacity = useTransform(scrollYProgress, [0, textFadeAt], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setProgress(value);
  });

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
      className="scroll-zoom-hero__stage"
      tabIndex={0}
      aria-label="Scroll zoom hero example"
      data-testid="scroll-zoom-hero-stage"
      data-run-id={String(runId)}
      data-progress={progress.toFixed(3)}
      data-reduced={reduce ? 'true' : 'false'}
    >
      <section ref={trackRef} className="scroll-zoom-hero__track">
        <div className="scroll-zoom-hero__sticky">
          <motion.div
            className="scroll-zoom-hero__background"
            style={reduce ? undefined : { scale, opacity, filter }}
          >
            <img
              data-photo=""
              src={ZOOM_PHOTO.src}
              alt={ZOOM_PHOTO.alt}
            />
          </motion.div>
          <div className="scroll-zoom-hero__scrim" />
          <motion.div
            className="scroll-zoom-hero__copy"
            style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          >
            <p className="scroll-zoom-hero__kicker">{ZOOM_KICKER}</p>
            <h3 className="scroll-zoom-hero__headline">{ZOOM_TITLE}</h3>
          </motion.div>
        </div>
      </section>
      <section className="scroll-zoom-hero__after">
        <p>{ZOOM_BODY}</p>
      </section>
    </div>
  );
}
