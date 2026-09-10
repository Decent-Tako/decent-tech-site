import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { useEffect, useState, type CSSProperties } from 'react';

import { HTML_CONTENT_DEFAULTS } from './defaults';
import { TextFrame } from './Frame';
import {
  shouldReduce,
  TEXT_EXAMPLES,
  type ReducedMotionMode,
} from './source';

export type HtmlContentProps = {
  from?: number;
  to?: number;
  duration?: number;
  prefix?: string;
  caption?: string;
  fontSize?: number;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function HtmlContentRun({
  from,
  to,
  duration,
  prefix,
  caption,
  fontSize,
  skip,
}: {
  from: number;
  to: number;
  duration: number;
  prefix: string;
  caption: string;
  fontSize: number;
  skip: boolean;
}) {
  const count = useMotionValue(skip ? to : from);
  const rounded = useTransform(() => Math.round(count.get()));
  const [shown, setShown] = useState(skip ? to : from);

  useMotionValueEvent(rounded, 'change', (latest) => {
    setShown(latest);
  });

  useEffect(() => {
    if (skip) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration });
    return () => controls.stop();
  }, [count, duration, skip, to]);

  return (
    <div
      className="html-content"
      role="status"
      aria-label={caption}
      data-value={String(shown)}
      style={{ '--html-font-size': `${fontSize}px` } as CSSProperties}
    >
      <p className="html-content__value">
        <span>{prefix}</span>
        <motion.span>{rounded}</motion.span>
      </p>
      <p className="text-example__caption">{caption}</p>
    </div>
  );
}

export function HtmlContent({
  from = HTML_CONTENT_DEFAULTS.from,
  to = HTML_CONTENT_DEFAULTS.to,
  duration = HTML_CONTENT_DEFAULTS.duration,
  prefix = HTML_CONTENT_DEFAULTS.prefix,
  caption = HTML_CONTENT_DEFAULTS.caption,
  fontSize = HTML_CONTENT_DEFAULTS.fontSize,
  reducedMotion = HTML_CONTENT_DEFAULTS.reducedMotion,
  replayNonce = HTML_CONTENT_DEFAULTS.replayNonce,
}: HtmlContentProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = TEXT_EXAMPLES.htmlContent;

  return (
    <TextFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      extraDocs={example.extraDocs}
      example={example.example}
      live={example.live}
      fixedNote="Upstream counts 0 to 100 in 5 s. This story counts 0 to 3000 because that is the participant goal. Font size 64 px stays the upstream size so the number reads as a total, not a caption. Replay remounts the motion value."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="text-html-content"
      running={!reduce}
      runId={runId}
    >
      <HtmlContentRun
        key={`${runId}-${replayNonce}-${from}-${to}-${duration}-${reduce}`}
        from={from}
        to={to}
        duration={duration}
        prefix={prefix}
        caption={caption}
        fontSize={fontSize}
        skip={reduce}
      />
    </TextFrame>
  );
}
