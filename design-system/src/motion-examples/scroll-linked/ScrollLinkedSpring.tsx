import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import { useRef, useState } from 'react';

import { Photo } from '../../pages/Photo';
import { useAutoScroll } from './autoScroll';
import {
  ARTICLE_COPY,
  EXAMPLES,
  MOTION_LICENCE,
  MOTION_REPO,
  MOTION_SCROLL_DOCS,
  MOTION_USE_SCROLL_DOCS,
  MOTION_USE_SPRING_DOCS,
  MOTION_VERSION,
  PAGE_OFFSETS,
  SPRING_DEFAULTS,
  type PageOffset,
  type ReducedMotionMode,
} from './data';
import { ExampleChrome } from './Frame';

export type ScrollLinkedSpringProps = {
  offset?: PageOffset;
  originX?: number;
  height?: number;
  stiffness?: number;
  damping?: number;
  restDelta?: number;
  mass?: number;
  speed?: number;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollLinkedSpring({
  offset = SPRING_DEFAULTS.offset,
  originX = SPRING_DEFAULTS.originX,
  height = SPRING_DEFAULTS.height,
  stiffness = SPRING_DEFAULTS.stiffness,
  damping = SPRING_DEFAULTS.damping,
  restDelta = SPRING_DEFAULTS.restDelta,
  mass = SPRING_DEFAULTS.mass,
  speed = SPRING_DEFAULTS.speed,
  paused: pausedProp = SPRING_DEFAULTS.paused,
  reducedMotion = SPRING_DEFAULTS.reducedMotion,
}: ScrollLinkedSpringProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReduce = useReducedMotion();
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const skip =
    reducedMotion === 'always' ||
    (reducedMotion === 'user' && Boolean(prefersReduce));
  const demoSpeed = skip ? 0 : speed;
  useAutoScroll(stageRef, demoSpeed, paused || skip);

  const { scrollYProgress } = useScroll({
    container: stageRef,
    offset: [...PAGE_OFFSETS[offset]],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness,
    damping,
    restDelta,
    mass,
  });
  const progress = skip ? scrollYProgress : scaleX;
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(progress, 'change', (value) => {
    setPercent(Math.round(Math.min(1, Math.max(0, value)) * 100));
  });

  return (
    <ExampleChrome
      title="Scroll-linked with spring"
      reducedMotion={reducedMotion}
      pauseLabel="Pause"
      paused={paused}
      onPause={() => setPaused((value) => !value)}
      intro={
        <>
          Package <code>motion</code> {MOTION_VERSION}. Licence {MOTION_LICENCE}.
          Mechanism: <code>useScroll()</code> writes <code>scrollYProgress</code>
          , then <code>useSpring</code> lags that value into{' '}
          <code>style.scaleX</code>. This animation is continuous. Pause stops
          the demo scroll. Speed is a control. Docs{' '}
          <a href={MOTION_USE_SPRING_DOCS}>{MOTION_USE_SPRING_DOCS}</a>. Scroll{' '}
          <a href={MOTION_USE_SCROLL_DOCS}>{MOTION_USE_SCROLL_DOCS}</a>. Guide{' '}
          <a href={MOTION_SCROLL_DOCS}>{MOTION_SCROLL_DOCS}</a>. Example{' '}
          <a href={EXAMPLES.spring.page}>{EXAMPLES.spring.page}</a>. Live{' '}
          <a href={EXAMPLES.spring.live}>{EXAMPLES.spring.live}</a>. Source{' '}
          <a href={MOTION_REPO}>{MOTION_REPO}</a>. No extra animation runtime.
          Prior Academy use: Pages/Article uses the raw scroll value, not the
          spring.
        </>
      }
      fixedNote="The upstream example tracks the document. This stage is 560px because Storybook is not that document. Axis stays y. Bar colour stays Academy blue #0035B1. Reduced motion skips the spring and binds the raw scroll value."
    >
      <div
        ref={stageRef}
        className="scroll-ex__stage"
        data-scroll-stage=""
        data-paused={paused ? 'true' : 'false'}
        tabIndex={0}
        role="region"
        aria-label="Spring reading progress example"
      >
        <motion.div
          className="scroll-ex__progress"
          role="progressbar"
          aria-label={ARTICLE_COPY.readLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          style={{ scaleX: progress, originX, height }}
        />
        <ArticleCopy />
      </div>
    </ExampleChrome>
  );
}

function ArticleCopy() {
  return (
    <article className="scroll-ex__article">
      <p className="scroll-ex__kicker">{ARTICLE_COPY.kicker}</p>
      <h3 className="scroll-ex__heading">{ARTICLE_COPY.title}</h3>
      <p className="scroll-ex__dek">{ARTICLE_COPY.dek}</p>
      {ARTICLE_COPY.sections.map((section) => (
        <section key={section.heading}>
          <h3 className="scroll-ex__section">{section.heading}</h3>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {'photo' in section && section.photo ? (
            <Photo
              className="scroll-ex__photo"
              src={section.photo.src}
              alt={section.photo.alt}
              caption={section.photo.caption}
            />
          ) : null}
        </section>
      ))}
    </article>
  );
}
