import {
  AnimatePresence,
  motion,
  usePresenceData,
  useReducedMotion,
  wrap,
} from 'motion/react';
import {
  forwardRef,
  useState,
  type CSSProperties,
  type SVGProps,
} from 'react';

import { PRESENCE_DATA_DEFAULTS } from './defaults';
import { PresenceFrame } from './Frame';
import {
  ACADEMY_SLIDES,
  PRESENCE_EXAMPLES,
  shouldReduce,
  type PresenceMode,
  type ReducedMotionMode,
} from './source';

export type UsePresenceDataProps = {
  mode?: PresenceMode;
  presenceInitial?: boolean;
  xOffset?: number;
  delay?: number;
  visualDuration?: number;
  bounce?: number;
  tapScale?: number;
  size?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

const iconProps: SVGProps<SVGSVGElement> = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function ArrowLeft() {
  return (
    <svg {...iconProps}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg {...iconProps}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const Slide = forwardRef<
  HTMLDivElement,
  {
    slideId: number;
    size: number;
    xOffset: number;
    delay: number;
    visualDuration: number;
    bounce: number;
    reduce: boolean;
  }
>(function Slide(
  { slideId, size, xOffset, delay, visualDuration, bounce, reduce },
  ref,
) {
  const direction = (usePresenceData() as 1 | -1 | undefined) ?? 1;
  const slide =
    ACADEMY_SLIDES.find((item) => item.id === slideId) ?? ACADEMY_SLIDES[0];

  return (
    <motion.div
      ref={ref}
      className="presence-slides__card"
      data-testid="presence-slide"
      data-slide={String(slideId)}
      style={{ '--presence-size': `${size}px` } as CSSProperties}
      initial={
        reduce ? false : { opacity: 0, x: direction * xOffset }
      }
      animate={{
        opacity: 1,
        x: 0,
        transition: reduce
          ? { duration: 0 }
          : {
              delay,
              type: 'spring',
              visualDuration,
              bounce,
            },
      }}
      exit={{
        opacity: 0,
        x: direction * -xOffset,
        transition: reduce ? { duration: 0 } : undefined,
      }}
    >
      <img
        src={slide.photo.src}
        alt={slide.photo.alt}
        data-photo=""
        width={size}
        height={size}
      />
      <div className="presence-slides__copy">
        <p className="presence-slides__kicker">{slide.kicker}</p>
        <p className="presence-slides__title">{slide.title}</p>
      </div>
    </motion.div>
  );
});

function PresenceDataRun({
  mode,
  presenceInitial,
  xOffset,
  delay,
  visualDuration,
  bounce,
  tapScale,
  size,
  caption,
  reduce,
}: {
  mode: PresenceMode;
  presenceInitial: boolean;
  xOffset: number;
  delay: number;
  visualDuration: number;
  bounce: number;
  tapScale: number;
  size: number;
  caption: string;
  reduce: boolean;
}) {
  const items = ACADEMY_SLIDES.map((slide) => slide.id);
  const [selectedItem, setSelectedItem] = useState<number>(items[0]);
  const [direction, setDirection] = useState<1 | -1>(1);

  function setSlide(newDirection: 1 | -1) {
    const nextItem = wrap(1, items.length, selectedItem + newDirection);
    setSelectedItem(nextItem);
    setDirection(newDirection);
  }

  return (
    <>
      <div
        className="presence-slides"
        data-slide={String(selectedItem)}
        data-direction={String(direction)}
      >
        <motion.button
          type="button"
          className="presence__trigger presence-slides__nav"
          aria-label="Previous"
          initial={false}
          onClick={() => setSlide(-1)}
          whileTap={reduce ? undefined : { scale: tapScale }}
          whileFocus={{ outline: '2px solid var(--accent-blue)' }}
        >
          <ArrowLeft />
        </motion.button>
        <AnimatePresence
          custom={direction}
          initial={presenceInitial}
          mode={mode}
        >
          <Slide
            key={selectedItem}
            slideId={selectedItem}
            size={size}
            xOffset={xOffset}
            delay={delay}
            visualDuration={visualDuration}
            bounce={bounce}
            reduce={reduce}
          />
        </AnimatePresence>
        <motion.button
          type="button"
          className="presence__trigger presence-slides__nav"
          aria-label="Next"
          initial={false}
          onClick={() => setSlide(1)}
          whileTap={reduce ? undefined : { scale: tapScale }}
          whileFocus={{ outline: '2px solid var(--accent-blue)' }}
        >
          <ArrowRight />
        </motion.button>
      </div>
      <p className="presence__caption">{caption}</p>
    </>
  );
}

export function UsePresenceData({
  mode = PRESENCE_DATA_DEFAULTS.mode,
  presenceInitial = PRESENCE_DATA_DEFAULTS.presenceInitial,
  xOffset = PRESENCE_DATA_DEFAULTS.xOffset,
  delay = PRESENCE_DATA_DEFAULTS.delay,
  visualDuration = PRESENCE_DATA_DEFAULTS.visualDuration,
  bounce = PRESENCE_DATA_DEFAULTS.bounce,
  tapScale = PRESENCE_DATA_DEFAULTS.tapScale,
  size = PRESENCE_DATA_DEFAULTS.size,
  caption = PRESENCE_DATA_DEFAULTS.caption,
  reducedMotion = PRESENCE_DATA_DEFAULTS.reducedMotion,
  replayNonce = PRESENCE_DATA_DEFAULTS.replayNonce,
}: UsePresenceDataProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = PRESENCE_EXAMPLES.presenceData;

  return (
    <PresenceFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The slide stays 150 by 150 pixels at the upstream default. wrap(1, items.length, selectedItem + newDirection) is the upstream index call. Slide is forwardRef because popLayout needs a DOM node. Photographs stay full colour. This animation is one-shot per slide, so Replay remounts on Week 0. Next and Previous are the live trigger."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="presence-data"
      runId={runId}
    >
      <PresenceDataRun
        key={`${runId}-${replayNonce}-${mode}-${presenceInitial}-${reduce}`}
        mode={mode}
        presenceInitial={presenceInitial}
        xOffset={xOffset}
        delay={delay}
        visualDuration={visualDuration}
        bounce={bounce}
        tapScale={tapScale}
        size={size}
        caption={caption}
        reduce={reduce}
      />
    </PresenceFrame>
  );
}
