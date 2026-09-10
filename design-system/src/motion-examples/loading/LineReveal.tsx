import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from 'motion/react';
import { useEffect, useState } from 'react';

import { PHOTOS } from '../../pages/content';
import { LINE_REVEAL_DEFAULTS } from './defaults';
import { LoadingFrame } from './Frame';
import {
  LOADING_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type LineRevealProps = {
  intervalMs?: number;
  increment?: number;
  stiffness?: number;
  damping?: number;
  visualDuration?: number;
  bounce?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

const GALLERY = [
  { photo: PHOTOS.hero, aspectRatio: '4 / 3' },
  { photo: PHOTOS.crowd, aspectRatio: '3 / 4' },
  { photo: PHOTOS.community, aspectRatio: '3 / 4' },
  { photo: PHOTOS.night, aspectRatio: '3 / 4' },
  { photo: PHOTOS.run, aspectRatio: '4 / 3' },
] as const;

function LineRevealRun({
  intervalMs,
  increment,
  stiffness,
  damping,
  visualDuration,
  bounce,
  caption,
  skip,
}: {
  intervalMs: number;
  increment: number;
  stiffness: number;
  damping: number;
  visualDuration: number;
  bounce: number;
  caption: string;
  skip: boolean;
}) {
  const progress = useSpring(skip ? 1 : 0, { stiffness, damping });
  const [isLoaded, setIsLoaded] = useState(skip);

  const leftEdge = useMotionValue(
    skip ? 'calc(0% - 0px)' : 'calc(50% - 2px)',
  );
  const rightEdge = useMotionValue(
    skip ? 'calc(100% + 0px)' : 'calc(50% + 2px)',
  );
  const { topEdge, bottomEdge } = useTransform(progress, [0, 1], {
    topEdge: ['50%', '0%'],
    bottomEdge: ['50%', '100%'],
  });

  const clipPath = useMotionTemplate`polygon(
      0% 0%, ${leftEdge} 0%, ${leftEdge} ${topEdge}, ${leftEdge} ${bottomEdge}, ${rightEdge} ${bottomEdge}, ${rightEdge} ${topEdge}, 
      ${leftEdge} ${topEdge}, ${leftEdge} 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%
    )`;

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest >= 1 && !isLoaded) {
      setIsLoaded(true);
    }
  });

  useEffect(() => {
    if (!isLoaded || skip) return;

    const transition: Transition = {
      type: 'spring',
      visualDuration,
      bounce,
    };

    animate(leftEdge, 'calc(0% - 0px)', transition);
    animate(rightEdge, 'calc(100% + 0px)', transition);
  }, [bounce, isLoaded, leftEdge, rightEdge, skip, visualDuration]);

  useEffect(() => {
    if (skip) return;

    const interval = setInterval(() => {
      const newProgress = progress.get() + Math.random() * increment;

      if (newProgress >= 1) {
        progress.set(1);
        clearInterval(interval);
      } else {
        progress.set(newProgress);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [increment, intervalMs, progress, skip]);

  return (
    <div
      className="loading-line"
      role="status"
      aria-label={isLoaded ? 'Week gallery open' : caption}
      data-loaded={isLoaded ? 'true' : 'false'}
    >
      <ul className="loading-line__gallery">
        {GALLERY.map((item) => (
          <li key={item.photo.src} className="loading-line__item">
            <img
              data-photo=""
              src={item.photo.src}
              alt={item.photo.alt}
              style={{
                aspectRatio: item.aspectRatio,
                height: item.aspectRatio === '4 / 3' ? '100%' : 'auto',
                width: item.aspectRatio === '3 / 4' ? '100%' : 'auto',
              }}
            />
          </li>
        ))}
        <li className="loading-line__item">
          <div className="loading-line__goal">
            <p className="loading-line__goal-kicker">Challenge week</p>
            <p className="loading-line__goal-copy">Goal $3,000</p>
          </div>
        </li>
      </ul>
      <motion.div
        className="loading-line__ink"
        animate={{ opacity: isLoaded ? 0 : 1 }}
      />
      <motion.div className="loading-line__blue" style={{ clipPath }} />
    </div>
  );
}

export function LineReveal({
  intervalMs = LINE_REVEAL_DEFAULTS.intervalMs,
  increment = LINE_REVEAL_DEFAULTS.increment,
  stiffness = LINE_REVEAL_DEFAULTS.stiffness,
  damping = LINE_REVEAL_DEFAULTS.damping,
  visualDuration = LINE_REVEAL_DEFAULTS.visualDuration,
  bounce = LINE_REVEAL_DEFAULTS.bounce,
  caption = LINE_REVEAL_DEFAULTS.caption,
  reducedMotion = LINE_REVEAL_DEFAULTS.reducedMotion,
  replayNonce = LINE_REVEAL_DEFAULTS.replayNonce,
}: LineRevealProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = LOADING_EXAMPLES.lineReveal;

  return (
    <LoadingFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      fixedNote="The stage stays 500 by 400 pixels because the polygon clip is authored for that box. Overlays use position absolute inside the stage, not position fixed, so Storybook controls stay usable. The 2 px centre line (calc(50% ± 2px)) is the punch-out geometry. Japan-day photos are replaced by Academy photographs plus the $3,000 goal tile. This animation is one-shot, so Replay remounts it."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="loading-line-reveal"
      running={!reduce}
      runId={runId}
    >
      <LineRevealRun
        key={`${runId}-${replayNonce}-${intervalMs}-${increment}-${stiffness}-${damping}-${reduce}`}
        intervalMs={intervalMs}
        increment={increment}
        stiffness={stiffness}
        damping={damping}
        visualDuration={visualDuration}
        bounce={bounce}
        caption={caption}
        skip={reduce}
      />
      <p className="loading__caption">{caption}</p>
    </LoadingFrame>
  );
}
