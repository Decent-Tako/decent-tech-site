import { animate, stagger, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { SPLIT_TEXT_DEFAULTS } from './defaults';
import { TextFrame } from './Frame';
import {
  shouldReduce,
  TEXT_EXAMPLES,
  type ReducedMotionMode,
} from './source';
import { splitWords } from './splitWords';

export type SplitTextProps = {
  text?: string;
  duration?: number;
  bounce?: number;
  staggerDelay?: number;
  fromY?: number;
  fontSize?: number;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function SplitTextRun({
  text,
  duration,
  bounce,
  staggerDelay,
  fromY,
  fontSize,
  skip,
}: {
  text: string;
  duration: number;
  bounce: number;
  staggerDelay: number;
  fromY: number;
  fontSize: number;
  skip: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const heading = headingRef.current;
    if (!container || !heading) return;

    heading.textContent = text;
    heading.setAttribute('aria-label', text.trim());

    if (skip) {
      container.style.visibility = 'visible';
      container.dataset.ready = 'true';
      container.dataset.complete = 'true';
      return;
    }

    let cancelled = false;
    const controls: { stop: () => void }[] = [];

    void document.fonts.ready.then(() => {
      if (cancelled || !headingRef.current || !containerRef.current) return;
      containerRef.current.style.visibility = 'visible';
      const { words } = splitWords(headingRef.current);
      const animation = animate(
        words,
        { opacity: [0, 1], y: [fromY, 0] },
        {
          type: 'spring',
          duration,
          bounce,
          delay: stagger(staggerDelay),
        },
      );
      controls.push(animation);
      containerRef.current.dataset.ready = 'true';
      const markComplete = () => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.dataset.complete = 'true';
      };
      const finished = (
        animation as { finished?: Promise<unknown>; then?: typeof Promise.prototype.then }
      ).finished;
      if (finished) {
        void finished.then(markComplete);
      } else {
        void Promise.resolve(animation).then(markComplete);
      }
    });

    return () => {
      cancelled = true;
      for (const control of controls) control.stop();
    };
  }, [bounce, duration, fromY, skip, staggerDelay, text]);

  return (
    <div
      ref={containerRef}
      className="split-text"
      data-ready="false"
      data-complete="false"
      style={{ '--split-font-size': `${fontSize}px` } as CSSProperties}
    >
      <h3 ref={headingRef} className="split-text__heading" />
    </div>
  );
}

export function SplitText({
  text = SPLIT_TEXT_DEFAULTS.text,
  duration = SPLIT_TEXT_DEFAULTS.duration,
  bounce = SPLIT_TEXT_DEFAULTS.bounce,
  staggerDelay = SPLIT_TEXT_DEFAULTS.staggerDelay,
  fromY = SPLIT_TEXT_DEFAULTS.fromY,
  fontSize = SPLIT_TEXT_DEFAULTS.fontSize,
  reducedMotion = SPLIT_TEXT_DEFAULTS.reducedMotion,
  replayNonce = SPLIT_TEXT_DEFAULTS.replayNonce,
}: SplitTextProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = TEXT_EXAMPLES.splitText;

  return (
    <TextFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      extraDocs={example.extraDocs}
      example={example.example}
      live={example.live}
      extraRuntime={`The article page is Motion+ and prints only the Get started stub. Full source is the live View source chunk ${example.chunk}. splitText from motion-plus needs a Motion+ token. This catalogue wraps words in span.split-word and keeps animate plus stagger.`}
      fixedNote="The line stays max-width 420 px because that is the upstream box the stagger is authored for. visibility stays hidden until fonts.ready, matching upstream. bounce 0 is the upstream spring. Replay remounts after fonts are ready."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="text-split-text"
      running={!reduce}
      runId={runId}
    >
      <SplitTextRun
        key={`${runId}-${replayNonce}-${text}-${duration}-${bounce}-${staggerDelay}-${fromY}-${reduce}`}
        text={text}
        duration={duration}
        bounce={bounce}
        staggerDelay={staggerDelay}
        fromY={fromY}
        fontSize={fontSize}
        skip={reduce}
      />
    </TextFrame>
  );
}
