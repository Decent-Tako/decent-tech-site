import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import { useRef, useState, type RefObject } from 'react';

import { useAutoScroll } from './autoScroll';
import {
  EXAMPLES,
  MOTION_LICENCE,
  MOTION_REPO,
  MOTION_SCROLL_DOCS,
  MOTION_USE_SCROLL_DOCS,
  MOTION_VERSION,
  TARGET_OFFSETS,
  TRACK_DEFAULTS,
  TRACK_ITEMS,
  type ReducedMotionMode,
  type TargetOffset,
  type WeekCard,
} from './data';
import { ExampleChrome } from './Frame';

export type ScrollTrackElementProps = {
  offset?: TargetOffset;
  radius?: number;
  strokeWidth?: number;
  speed?: number;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function ScrollTrackElement({
  offset = TRACK_DEFAULTS.offset,
  radius = TRACK_DEFAULTS.radius,
  strokeWidth = TRACK_DEFAULTS.strokeWidth,
  speed = TRACK_DEFAULTS.speed,
  paused: pausedProp = TRACK_DEFAULTS.paused,
  reducedMotion = TRACK_DEFAULTS.reducedMotion,
}: ScrollTrackElementProps) {
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
  useAutoScroll(stageRef, skip ? 0 : speed, paused || skip);

  return (
    <ExampleChrome
      title="Scroll-track element in viewport"
      reducedMotion={reducedMotion}
      pauseLabel="Pause"
      paused={paused}
      onPause={() => setPaused((value) => !value)}
      intro={
        <>
          Package <code>motion</code> {MOTION_VERSION}. Licence {MOTION_LICENCE}.
          Mechanism: each item passes its <code>ref</code> to{' '}
          <code>useScroll({'{ target, offset }'})</code>.{' '}
          <code>scrollYProgress</code> binds to <code>pathLength</code> on a{' '}
          <code>motion.circle</code>. Progress is 0 when the item end meets the
          container end, and 1 when the item start meets the container start.
          This animation is continuous. Pause stops the demo scroll. Speed is a
          control. Docs <a href={MOTION_USE_SCROLL_DOCS}>{MOTION_USE_SCROLL_DOCS}</a>
          . Guide <a href={MOTION_SCROLL_DOCS}>{MOTION_SCROLL_DOCS}</a>. Example{' '}
          <a href={EXAMPLES.track.page}>{EXAMPLES.track.page}</a>. Live{' '}
          <a href={EXAMPLES.track.live}>{EXAMPLES.track.live}</a>. Source{' '}
          <a href={MOTION_REPO}>{MOTION_REPO}</a>. No extra animation runtime. No
          earlier Academy experiment used per-element <code>target</code> tracking.
        </>
      }
      fixedNote="Each section stays 100vh with a 400px cap, and the box stays 200 by 250 pixels, because that is the authored progress geometry. The SVG keeps translateX(-100px) rotate(-90deg) from the example. The stage is 560px and is the useScroll container so Storybook can host it."
    >
      <div
        ref={stageRef}
        className="scroll-ex__stage"
        data-scroll-stage=""
        data-paused={paused ? 'true' : 'false'}
        tabIndex={0}
        role="region"
        aria-label="Viewport tracking example"
      >
        <div className="scroll-track">
          {TRACK_ITEMS.map((item) => (
            <TrackItem
              key={item.id}
              item={item}
              container={stageRef}
              offset={TARGET_OFFSETS[offset]}
              radius={radius}
              strokeWidth={strokeWidth}
            />
          ))}
        </div>
      </div>
    </ExampleChrome>
  );
}

function TrackItem({
  item,
  container,
  offset,
  radius,
  strokeWidth,
}: {
  item: WeekCard;
  container: RefObject<HTMLDivElement | null>;
  offset: (typeof TARGET_OFFSETS)[TargetOffset];
  radius: number;
  strokeWidth: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container,
    target: ref,
    offset: [...offset],
  });
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setPercent(Math.round(Math.min(1, Math.max(0, value)) * 100));
  });

  return (
    <section className="scroll-track__item">
      <div ref={ref} className="scroll-track__box">
        <img data-photo="" src={item.photo.src} alt={item.photo.alt} />
        <p className="scroll-track__label">
          {item.kicker}. {item.title}
        </p>
        <figure
          className="scroll-track__progress"
          aria-label={`${item.kicker}. ${item.title} progress ${percent} percent`}
        >
          <svg width="75" height="75" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              className="scroll-track__ring scroll-track__ring-bg"
              cx="50"
              cy="50"
              r={radius}
              pathLength="1"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              className="scroll-track__ring"
              cx="50"
              cy="50"
              r={radius}
              pathLength="1"
              strokeWidth={strokeWidth}
              data-track-ring=""
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
        </figure>
      </div>
    </section>
  );
}
