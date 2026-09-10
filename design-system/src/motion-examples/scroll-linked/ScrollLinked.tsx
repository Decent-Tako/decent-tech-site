import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
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
  MOTION_VERSION,
  PAGE_OFFSETS,
  SCROLL_LINKED_DEFAULTS,
  type PageOffset,
  type ReducedMotionMode,
} from './data';
import { ExampleChrome } from './Frame';

export type ScrollLinkedProps = {
  offset?: PageOffset;
  originX?: number;
  height?: number;
  speed?: number;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollLinked({
  offset = SCROLL_LINKED_DEFAULTS.offset,
  originX = SCROLL_LINKED_DEFAULTS.originX,
  height = SCROLL_LINKED_DEFAULTS.height,
  speed = SCROLL_LINKED_DEFAULTS.speed,
  paused: pausedProp = SCROLL_LINKED_DEFAULTS.paused,
  reducedMotion = SCROLL_LINKED_DEFAULTS.reducedMotion,
}: ScrollLinkedProps) {
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
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setPercent(Math.round(Math.min(1, Math.max(0, value)) * 100));
  });

  return (
    <ExampleChrome
      title="Scroll-linked"
      reducedMotion={reducedMotion}
      pauseLabel="Pause"
      paused={paused}
      onPause={() => setPaused((value) => !value)}
      intro={
        <>
          Package <code>motion</code> {MOTION_VERSION}. Licence {MOTION_LICENCE}.
          Mechanism: <code>useScroll()</code> writes <code>scrollYProgress</code>{' '}
          into <code>style.scaleX</code> on a progress bar. ScrollTimeline drives
          the bar. There is no <code>animate()</code> loop. This animation is
          continuous. Pause stops the demo scroll. Speed is a control. Docs{' '}
          <a href={MOTION_USE_SCROLL_DOCS}>{MOTION_USE_SCROLL_DOCS}</a>. Guide{' '}
          <a href={MOTION_SCROLL_DOCS}>{MOTION_SCROLL_DOCS}</a>. Example{' '}
          <a href={EXAMPLES.linked.page}>{EXAMPLES.linked.page}</a>. Live{' '}
          <a href={EXAMPLES.linked.live}>{EXAMPLES.linked.live}</a>. Source{' '}
          <a href={MOTION_REPO}>{MOTION_REPO}</a>. No extra animation runtime.
          Prior Academy use: Pages/Article already uses this mechanic for reading
          progress.
        </>
      }
      fixedNote="The upstream example tracks the document. Storybook canvas and docs are not that document, so the scroll target is this 560px stage. Axis stays y because the article only overflows vertically. Bar colour stays Academy blue #0035B1 in place of var(--hue-1)."
    >
      <div
        ref={stageRef}
        className="scroll-ex__stage"
        data-scroll-stage=""
        data-paused={paused ? 'true' : 'false'}
        tabIndex={0}
        role="region"
        aria-label="Reading progress example"
      >
        <motion.div
          className="scroll-ex__progress"
          role="progressbar"
          aria-label={ARTICLE_COPY.readLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          style={{ scaleX: scrollYProgress, originX, height }}
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
