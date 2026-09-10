import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useRef, useState, type RefObject } from 'react';

import {
  EXAMPLES,
  MOTION_COMPONENT_DOCS,
  MOTION_LICENCE,
  MOTION_REPO,
  MOTION_SCROLL_DOCS,
  MOTION_VERSION,
  TRIGGERED_DEFAULTS,
  WEEK_CARDS,
  type ReducedMotionMode,
  type WeekCard,
} from './data';
import { ExampleChrome } from './Frame';

export type ScrollTriggeredProps = {
  amount?: number;
  once?: boolean;
  bounce?: number;
  duration?: number;
  offscreenY?: number;
  onscreenY?: number;
  rotate?: number;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollTriggered({
  amount = TRIGGERED_DEFAULTS.amount,
  once = TRIGGERED_DEFAULTS.once,
  bounce = TRIGGERED_DEFAULTS.bounce,
  duration = TRIGGERED_DEFAULTS.duration,
  offscreenY = TRIGGERED_DEFAULTS.offscreenY,
  onscreenY = TRIGGERED_DEFAULTS.onscreenY,
  rotate = TRIGGERED_DEFAULTS.rotate,
  reducedMotion = TRIGGERED_DEFAULTS.reducedMotion,
}: ScrollTriggeredProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReduce = useReducedMotion();
  const [runId, setRunId] = useState(0);
  const skip =
    reducedMotion === 'always' ||
    (reducedMotion === 'user' && Boolean(prefersReduce));

  const cardVariants: Variants = {
    offscreen: { y: offscreenY },
    onscreen: {
      y: onscreenY,
      rotate,
      transition: { type: 'spring', bounce, duration },
    },
  };

  return (
    <ExampleChrome
      title="Scroll-triggered"
      reducedMotion={reducedMotion}
      replay
      onReplay={() => {
        setRunId((value) => value + 1);
        if (stageRef.current) stageRef.current.scrollTop = 0;
      }}
      intro={
        <>
          Package <code>motion</code> {MOTION_VERSION}. Licence {MOTION_LICENCE}.
          Mechanism: each card is a <code>motion.div</code> with{' '}
          <code>initial=&quot;offscreen&quot;</code> and{' '}
          <code>whileInView=&quot;onscreen&quot;</code>. A pooled
          IntersectionObserver swaps variants. The onscreen variant springs{' '}
          <code>y</code> and <code>rotate</code>. This animation is one-shot per
          enter. Replay remounts the cards. Docs{' '}
          <a href={MOTION_COMPONENT_DOCS}>{MOTION_COMPONENT_DOCS}</a>. Guide{' '}
          <a href={MOTION_SCROLL_DOCS}>{MOTION_SCROLL_DOCS}</a>. Example{' '}
          <a href={EXAMPLES.triggered.page}>{EXAMPLES.triggered.page}</a>. Live{' '}
          <a href={EXAMPLES.triggered.live}>{EXAMPLES.triggered.live}</a>. Source{' '}
          <a href={MOTION_REPO}>{MOTION_REPO}</a>. No extra animation runtime. No
          earlier catalogue story used <code>whileInView</code> cards. Pages/Article
          uses a fade, not this spring.
        </>
      }
      fixedNote="Card size stays 300 by 430 pixels and the splash clip-path stays the upstream path because that geometry is the authored card, not a Motion option. transform-origin stays 10% 60%. The stage is 560px so amount 0.8 can fire. viewport.root is this stage."
    >
      <div
        ref={stageRef}
        className="scroll-ex__stage"
        data-scroll-stage=""
        tabIndex={0}
        role="region"
        aria-label="Scroll-triggered week cards"
      >
        <div className="scroll-cards" key={runId}>
          {WEEK_CARDS.map((card, index) => (
            <WeekCardView
              key={card.id}
              card={card}
              index={index}
              amount={amount}
              once={once}
              skip={skip}
              variants={cardVariants}
              root={stageRef}
            />
          ))}
        </div>
      </div>
    </ExampleChrome>
  );
}

function WeekCardView({
  card,
  index,
  amount,
  once,
  skip,
  variants,
  root,
}: {
  card: WeekCard;
  index: number;
  amount: number;
  once: boolean;
  skip: boolean;
  variants: Variants;
  root: RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div
      className={`scroll-card card-container-${index}`}
      data-card=""
      initial={skip ? 'onscreen' : 'offscreen'}
      animate={skip ? 'onscreen' : undefined}
      whileInView={skip ? undefined : 'onscreen'}
      viewport={skip ? undefined : { amount, once, root }}
      variants={variants}
    >
      <div className="scroll-card__splash" />
      <div className="scroll-card__face" data-card-face="">
        <img data-photo="" src={card.photo.src} alt={card.photo.alt} />
        <div className="scroll-card__copy">
          <p className="scroll-ex__kicker">{card.kicker}</p>
          <h3>{card.title}</h3>
          <p>{card.copy}</p>
        </div>
      </div>
    </motion.div>
  );
}
