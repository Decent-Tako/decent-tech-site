import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import {
  useId,
  useState,
  type FocusEvent,
  type PropsWithChildren,
} from 'react';

import { CardsFrame } from './Frame';
import {
  ACCORDION_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  shouldReduce,
  type AccordionItem,
  type ReducedMotionMode,
} from './source';

export type AccordionProps = {
  duration?: number;
  blur?: number;
  items?: AccordionItem[];
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function Accordion({
  duration = ACCORDION_DEFAULTS.duration,
  blur = ACCORDION_DEFAULTS.blur,
  items = ACCORDION_DEFAULTS.items,
  reducedMotion = ACCORDION_DEFAULTS.reducedMotion,
  replayNonce = ACCORDION_DEFAULTS.replayNonce,
}: AccordionProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const runKey = runId + replayNonce;
  const ringId = useId();

  return (
    <CardsFrame
      title="Accordion"
      mechanism={
        <>
          Each item is <code>animate=&quot;open&quot;|&quot;closed&quot;</code>.
          Content variants animate <code>height: &quot;auto&quot;</code> and a{' '}
          <code>maskImage</code> gradient. Inner copy variants animate blur and
          opacity. Chevron variants rotate 180. Keyboard focus mounts a{' '}
          <code>layoutId</code> focus ring. <code>onlyKeyboardFocus</code> uses{' '}
          <code>:focus-visible</code>.
        </>
      }
      docs={MOTION_RUNTIME.docsLayout}
      example={EXAMPLES.accordion.page}
      live={EXAMPLES.accordion.live}
      source={EXAMPLES.accordion.source}
      priorNote="Gallery Collapsible is Base UI. This example is the Motion accordion."
      fixedNote="The panel is 32rem so Academy FAQ copy stays readable. Upstream was 300 to 500 pixels. height auto is the mechanism, so the open size is content, not a control. Replay remounts every item closed. This animation is one-shot on click, so Replay is the control."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="accordion"
      running={!reduce}
      runId={runKey}
    >
      <div
        key={runKey}
        className="cards-example__stage cards-example__stage--accordion"
      >
        <MotionConfig transition={reduce ? { duration: 0 } : { duration }}>
          <div className="accordion">
            {items.map((item) => (
              <Item
                key={item.header}
                header={item.header}
                blur={blur}
                ringId={ringId}
                reduce={reduce}
              >
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Item>
            ))}
          </div>
        </MotionConfig>
      </div>
    </CardsFrame>
  );
}

function Item({
  header,
  children,
  blur,
  ringId,
  reduce,
}: PropsWithChildren<{
  header: string;
  blur: number;
  ringId: string;
  reduce: boolean;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const id = useId();

  return (
    <motion.section
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      data-open={isOpen ? 'true' : 'false'}
    >
      <h3>
        <motion.button
          id={`${id}-button`}
          type="button"
          aria-expanded={isOpen}
          aria-controls={id}
          onClick={() => setIsOpen((value) => !value)}
          onFocus={onlyKeyboardFocus(() => setHasFocus(true))}
          onBlur={() => setHasFocus(false)}
        >
          <span>{header}</span>
          <ChevronDownIcon />
          {hasFocus ? (
            <motion.div
              layoutId={`${ringId}-focus-ring`}
              className="focus-ring"
              transition={reduce ? { duration: 0 } : undefined}
            />
          ) : null}
        </motion.button>
      </h3>
      <motion.div
        variants={{
          open: {
            height: 'auto',
            maskImage: 'linear-gradient(to bottom, black 100%, transparent 100%)',
          },
          closed: {
            height: 0,
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          },
        }}
        id={id}
        aria-labelledby={`${id}-button`}
        aria-hidden={!isOpen}
        className="accordion-content"
      >
        <motion.div
          variants={{
            open: { filter: 'blur(0px)', opacity: 1 },
            closed: { filter: `blur(${blur}px)`, opacity: 0 },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
      <hr />
    </motion.section>
  );
}

function ChevronDownIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      variants={{
        open: { rotate: 180 },
        closed: { rotate: 0 },
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

function onlyKeyboardFocus(callback: () => void) {
  return (event: FocusEvent<HTMLButtonElement>) => {
    if (event.type === 'focus' && event.target.matches(':focus-visible')) {
      callback();
    }
  };
}
