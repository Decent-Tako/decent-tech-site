import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { Fragment, useEffect, useRef, useState } from 'react';

import { SCROLL_WORD_REVEAL_DEFAULTS } from './defaults';
import { TextFrame } from './Frame';
import {
  shouldReduce,
  TEXT_EXAMPLES,
  type ReducedMotionMode,
} from './source';
import { getWordProgressRange } from './wordOpacity';

export type TextScrollWordRevealProps = {
  statement?: string;
  startColor?: string;
  endColor?: string;
  spread?: number;
  wordDuration?: number;
  kicker?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function Word({
  children,
  progress,
  index,
  count,
  spread,
  wordDuration,
  startColor,
  endColor,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  spread: number;
  wordDuration: number;
  startColor: string;
  endColor: string;
  reducedMotion: boolean;
}) {
  const range = getWordProgressRange(index, count, spread, wordDuration);
  const color = useTransform(
    progress,
    [range.start, range.end],
    [startColor, endColor],
  );

  return (
    <motion.span
      aria-hidden="true"
      style={reducedMotion ? undefined : { color }}
    >
      {children}
    </motion.span>
  );
}

function TextScrollWordRevealRun({
  statement,
  startColor,
  endColor,
  spread,
  wordDuration,
  kicker,
  skip,
}: {
  statement: string;
  startColor: string;
  endColor: string;
  spread: number;
  wordDuration: number;
  kicker: string;
  skip: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollerRef,
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const [progress, setProgress] = useState(skip ? 1 : 0);
  const words = statement.split(' ');

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(latest);
  });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || skip) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        el.scrollTop = (el.scrollHeight - el.clientHeight) * 0.55;
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [skip]);

  return (
    <div
      ref={scrollerRef}
      className="scroll-word"
      tabIndex={0}
      data-scroll-stage
      data-progress={progress.toFixed(2)}
      aria-label="Week 0 reading"
    >
      <section
        ref={sectionRef}
        className="scroll-word__section"
        aria-labelledby="scroll-word-reveal-heading"
      >
        <div className="scroll-word__stage">
          <div className="scroll-word__layout">
            <div className="scroll-word__progress" aria-hidden="true">
              <motion.span
                style={{ scaleY: skip ? 1 : scrollYProgress }}
              />
            </div>
            <div>
              <p className="scroll-word__kicker">{kicker}</p>
              <h3
                id="scroll-word-reveal-heading"
                className="scroll-word__heading"
                aria-label={statement}
              >
                {words.map((word, index) => (
                  <Fragment key={`${word}-${index}`}>
                    <Word
                      progress={scrollYProgress}
                      index={index}
                      count={words.length}
                      spread={spread}
                      wordDuration={wordDuration}
                      startColor={startColor}
                      endColor={endColor}
                      reducedMotion={skip}
                    >
                      {word}
                    </Word>
                    {index < words.length - 1 ? ' ' : null}
                  </Fragment>
                ))}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function TextScrollWordReveal({
  statement = SCROLL_WORD_REVEAL_DEFAULTS.statement,
  startColor = SCROLL_WORD_REVEAL_DEFAULTS.startColor,
  endColor = SCROLL_WORD_REVEAL_DEFAULTS.endColor,
  spread = SCROLL_WORD_REVEAL_DEFAULTS.spread,
  wordDuration = SCROLL_WORD_REVEAL_DEFAULTS.wordDuration,
  kicker = SCROLL_WORD_REVEAL_DEFAULTS.kicker,
  reducedMotion = SCROLL_WORD_REVEAL_DEFAULTS.reducedMotion,
  replayNonce = SCROLL_WORD_REVEAL_DEFAULTS.replayNonce,
}: TextScrollWordRevealProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = TEXT_EXAMPLES.scrollWordReveal;

  return (
    <TextFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      extraDocs={example.extraDocs}
      example={example.example}
      live={example.live}
      fixedNote="The stage is 560 px tall so the sticky reveal is visible in the canvas. Upstream uses the window and min-height 220 vh. The story uses useScroll with a container ref, a documented option, because the story cannot own the window. Offset stays [start start, end end] because that range is the reveal geometry. Upstream opacity 0.15 fails contrast on paper, so unrevealed words use charcoal #4A4A4A and revealed words use ink #212121. The scroll mapping is unchanged. Replay remounts, then scrolls to 55 percent."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="text-scroll-word-reveal"
      running={!reduce}
      runId={runId}
      stageClassName="text-example__stage--scroll"
    >
      <TextScrollWordRevealRun
        key={`${runId}-${replayNonce}-${statement}-${startColor}-${endColor}-${spread}-${wordDuration}-${reduce}`}
        statement={statement}
        startColor={startColor}
        endColor={endColor}
        spread={spread}
        wordDuration={wordDuration}
        kicker={kicker}
        skip={reduce}
      />
    </TextFrame>
  );
}
