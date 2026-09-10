import {
  Archive,
  Clock9,
  Flag,
  MailOpen,
  type LucideIcon,
} from 'lucide-react';
import {
  animate,
  clamp,
  motion,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

import { GestureFrame } from './Frame';
import {
  EXAMPLES,
  MOTION_RUNTIME,
  SWIPE_DEFAULTS,
  type ReducedMotionMode,
} from './source';

export type SwipeActionsProps = {
  stiffness?: number;
  damping?: number;
  itemHeight?: number;
  itemMaxWidth?: number;
  fullSwipeRatio?: number;
  snapRatio?: number;
  heading?: string;
  reducedMotion?: ReducedMotionMode;
};

export function SwipeActions({
  stiffness = SWIPE_DEFAULTS.stiffness,
  damping = SWIPE_DEFAULTS.damping,
  itemHeight = SWIPE_DEFAULTS.itemHeight,
  itemMaxWidth = SWIPE_DEFAULTS.itemMaxWidth,
  fullSwipeRatio = SWIPE_DEFAULTS.fullSwipeRatio,
  snapRatio = SWIPE_DEFAULTS.snapRatio,
  heading = SWIPE_DEFAULTS.heading,
  reducedMotion = SWIPE_DEFAULTS.reducedMotion,
}: SwipeActionsProps) {
  const [runId, setRunId] = useState(0);
  const spring = { stiffness, damping };

  return (
    <GestureFrame
      title="Swipe actions"
      mechanism={
        <>
          Custom pointer tracking, not the <code>drag</code> prop.{' '}
          <code>useMotionValue</code> holds swipe amount. <code>useSpring</code>{' '}
          follows it. <code>useTransform</code> maps amount to progress. Past{' '}
          {Math.round(fullSwipeRatio * 100)}% snaps to a full swipe. Past{' '}
          {Math.round(snapRatio * 100)}% on release snaps open to 50%.
        </>
      }
      docs={MOTION_RUNTIME.docsDrag}
      example={EXAMPLES.swipe.page}
      live={EXAMPLES.swipe.live}
      extraRuntime="lucide-react 1.43.0 is already in this catalogue for icons."
      fixedNote="Height 80 px and max width 384 px are the upstream row size. They stay the default because that is the iOS mail-row proportion. Replay jumps the swipe amount to 0. The tutorial rest is Motion+. The live example still publishes this source."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
    >
      <div className="gesture-example__stage gesture-example__stage--swipe">
        <SwipeRow
          key={runId}
          spring={spring}
          itemHeight={itemHeight}
          itemMaxWidth={itemMaxWidth}
          fullSwipeRatio={fullSwipeRatio}
          snapRatio={snapRatio}
          heading={heading}
        />
      </div>
    </GestureFrame>
  );
}

function SwipeRow({
  spring,
  itemHeight,
  itemMaxWidth,
  fullSwipeRatio,
  snapRatio,
  heading,
}: {
  spring: { stiffness: number; damping: number };
  itemHeight: number;
  itemMaxWidth: number;
  fullSwipeRatio: number;
  snapRatio: number;
  heading: string;
}) {
  const swipeItemRef = useRef<HTMLDivElement>(null);
  const swipeItemWidth = useRef(0);
  const swipeStartX = useRef(0);
  const swipeStartOffset = useRef(0);
  const fullSwipeSnapPosition = useRef<'left' | 'right' | null>(null);
  const swipeContainerRef = useRef<HTMLDivElement>(null);
  const [progressLabel, setProgressLabel] = useState('0');

  const swipeAmount = useMotionValue(0);
  const swipeAmountSpring = useSpring(swipeAmount, spring);
  const swipeProgress = useTransform(swipeAmount, (value) => {
    const itemWidth = swipeItemWidth.current;
    if (!itemWidth) return 0;
    return value / itemWidth;
  });

  useMotionValueEvent(swipeProgress, 'change', (value) => {
    setProgressLabel(value.toFixed(2));
  });

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      swipeStartX.current = event.clientX;
      swipeStartOffset.current = swipeAmount.get();

      const handlePointerMove = (info: PointerEvent) => {
        const itemWidth = swipeItemWidth.current;
        if (!itemWidth) return;

        const swipeDelta =
          info.clientX - swipeStartX.current + swipeStartOffset.current;
        const fullSwipeThreshold = itemWidth * fullSwipeRatio;
        const isSwipingBeyondThreshold =
          Math.abs(swipeDelta) > fullSwipeThreshold;
        const isSwipingLeft = swipeDelta < 0;

        if (fullSwipeSnapPosition.current) {
          const isSwipingBackToCenter =
            Math.abs(swipeDelta) < fullSwipeThreshold;
          if (isSwipingBackToCenter) {
            fullSwipeSnapPosition.current = null;
            swipeAmount.set(swipeDelta);
          } else {
            const snapPosition =
              fullSwipeSnapPosition.current === 'left' ? -itemWidth : itemWidth;
            swipeAmount.set(snapPosition);
          }
          return;
        }

        if (isSwipingBeyondThreshold) {
          const snapDirection = isSwipingLeft ? 'left' : 'right';
          const snapPosition = isSwipingLeft ? -itemWidth : itemWidth;
          fullSwipeSnapPosition.current = snapDirection;
          swipeAmount.set(snapPosition);
        } else {
          swipeAmount.set(clamp(-itemWidth, itemWidth, swipeDelta));
        }
      };

      const handlePointerUp = () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);

        const itemWidth = swipeItemWidth.current;
        if (!itemWidth) return;

        const currentOffset = swipeAmount.get();
        let targetOffset = 0;
        const snapThreshold = itemWidth * snapRatio;

        if (Math.abs(currentOffset) > snapThreshold) {
          targetOffset =
            currentOffset > 0 ? itemWidth * 0.5 : itemWidth * -0.5;
        }

        const isFullySwiped = fullSwipeSnapPosition.current;
        if (isFullySwiped) {
          animate([
            [
              swipeContainerRef.current!,
              {
                scaleY: 1.05,
                scaleX: 0.95,
                y: -24,
                pointerEvents: 'none',
              },
              { duration: 0.1, ease: 'easeOut' },
            ],
            [
              swipeContainerRef.current!,
              {
                scaleY: 1,
                scaleX: 1,
                y: 0,
                pointerEvents: 'auto',
              },
              { duration: 0.6, type: 'spring' },
            ],
          ]);
          targetOffset = 0;
          animate(swipeAmount, targetOffset, { duration: 0.5, delay: 0.3 });
        } else {
          swipeAmount.set(targetOffset);
        }

        fullSwipeSnapPosition.current = null;
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [fullSwipeRatio, snapRatio, swipeAmount],
  );

  useEffect(() => {
    const handleResize = () => {
      const newWidth = swipeItemRef.current?.getBoundingClientRect().width;
      if (!newWidth) return;
      swipeItemWidth.current = newWidth;
      const currentProgress = swipeProgress.get();
      const newOffset = currentProgress * newWidth;
      swipeAmount.jump(newOffset);
      swipeAmountSpring.jump(newOffset);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [swipeAmount, swipeAmountSpring, swipeProgress]);

  return (
    <div className="gesture-swipe" style={{ maxWidth: itemMaxWidth }}>
      <motion.div
        ref={swipeContainerRef}
        className="gesture-swipe__row"
        style={{ '--swipe-height': `${itemHeight}px` } as CSSProperties}
        onPointerDown={handlePointerDown}
        data-swipe-progress={progressLabel}
        role="region"
        aria-label={`${heading} Swipe left or right to reveal actions.`}
      >
        <motion.div
          ref={swipeItemRef}
          className="gesture-swipe__item"
          style={{ x: swipeAmountSpring }}
        >
          <SwipeItemContent swipeProgress={swipeProgress} spring={spring}>
            {heading}
          </SwipeItemContent>
        </motion.div>

        <ActionsGroup
          side="left"
          swipeAmount={swipeAmountSpring}
          primaryAction={
            <Action
              primary
              swipeProgress={swipeProgress}
              side="left"
              bgColor="#0035B1"
              color="#FFFFFF"
              spring={spring}
            >
              <ActionContent icon={MailOpen} label="Thank" />
            </Action>
          }
          secondaryAction={
            <Action
              swipeProgress={swipeProgress}
              side="left"
              bgColor="#4A4A4A"
              color="#FFFFFF"
              spring={spring}
            >
              <ActionContent icon={Clock9} label="Follow up" />
            </Action>
          }
        />

        <ActionsGroup
          side="right"
          swipeAmount={swipeAmountSpring}
          primaryAction={
            <Action
              primary
              swipeProgress={swipeProgress}
              side="right"
              bgColor="#212121"
              color="#FFFFFF"
              spring={spring}
            >
              <ActionContent icon={Archive} label="Archive" />
            </Action>
          }
          secondaryAction={
            <Action
              swipeProgress={swipeProgress}
              side="right"
              bgColor="#DEF54F"
              color="#212121"
              spring={spring}
            >
              <ActionContent icon={Flag} label="Flag stall" />
            </Action>
          }
        />
      </motion.div>
    </div>
  );
}

function ActionsGroup({
  swipeAmount,
  side,
  primaryAction,
  secondaryAction,
}: {
  swipeAmount: MotionValue<number>;
  side: 'left' | 'right';
  primaryAction: ReactNode;
  secondaryAction: ReactNode;
}) {
  return (
    <motion.div
      className="gesture-swipe__actions"
      style={{
        left: side === 'right' ? '100%' : undefined,
        right: side === 'left' ? '100%' : undefined,
        x: swipeAmount,
      }}
    >
      {secondaryAction}
      {primaryAction}
    </motion.div>
  );
}

function Action({
  children,
  primary = false,
  swipeProgress,
  side,
  bgColor,
  color,
  spring,
}: {
  children: ReactNode;
  primary?: boolean;
  swipeProgress: MotionValue<number>;
  side: 'left' | 'right';
  bgColor: string;
  color: string;
  spring: { stiffness: number; damping: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const actionWidth = useRef(0);

  const calculateX = useCallback(
    (progressValue: number) => {
      const width = actionWidth.current;
      if (primary) {
        if (Math.abs(progressValue) >= 0.8) return 0;
        return ((progressValue * width) / 2) * -1;
      }
      return 0;
    },
    [primary],
  );

  const x = useSpring(0, spring);
  useMotionValueEvent(swipeProgress, 'change', (newSwipeProgress) => {
    x.set(calculateX(newSwipeProgress));
  });

  useEffect(() => {
    const updateWidth = () => {
      const width = ref.current?.getBoundingClientRect().width;
      if (!width) return;
      actionWidth.current = width;
      x.jump(calculateX(swipeProgress.get()));
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [calculateX, swipeProgress, x]);

  const finalStateOpacity = primary ? 1 : 0;
  const contentOpacitySource = useTransform(
    swipeProgress,
    [-1, -0.8, -0.5, -0.25, 0.25, 0.5, 0.8, 1],
    [finalStateOpacity, 1, 1, 0, 0, 1, 1, finalStateOpacity],
  );
  const contentOpacity = useSpring(contentOpacitySource, spring);
  const contentXSource = useTransform(
    swipeProgress,
    [-1, -0.8, -0.5, 0.5, 0.8, 1],
    [0, 16, 0, 0, -16, 0],
  );
  const contentX = useSpring(contentXSource, spring);
  const contentScaleSource = useTransform(
    swipeProgress,
    [-1, -0.8, 0, 0.8, 1],
    [1, 0.8, 1, 0.8, 1],
  );
  const contentScale = useSpring(contentScaleSource, spring);

  return (
    <motion.div
      ref={ref}
      className="gesture-swipe__action"
      style={{
        justifyContent: side === 'right' ? 'flex-start' : 'flex-end',
        x,
        backgroundColor: bgColor,
        color,
      }}
    >
      <motion.div className="gesture-swipe__action-slot">
        <motion.span
          style={{
            x: contentX,
            opacity: contentOpacity,
            scale: contentScale,
            transformOrigin: side === 'right' ? 'right' : 'left',
          }}
        >
          {children}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function ActionContent({ icon, label }: { icon: LucideIcon; label: string }) {
  const Icon = icon;
  return (
    <button type="button" className="gesture-swipe__action-button">
      <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
      {label}
    </button>
  );
}

function SwipeItemContent({
  swipeProgress,
  spring,
  children,
}: {
  swipeProgress: MotionValue<number>;
  spring: { stiffness: number; damping: number };
  children: ReactNode;
}) {
  const opacitySource = useTransform(swipeProgress, [-0.5, 0, 0.5], [0, 1, 0]);
  const opacity = useSpring(opacitySource, spring);
  const xSource = useTransform(swipeProgress, [-0.5, 0, 0.5], [40, 0, -40]);
  const x = useSpring(xSource, spring);

  return (
    <motion.p className="gesture-swipe__copy" style={{ opacity, x }}>
      {children}
    </motion.p>
  );
}
