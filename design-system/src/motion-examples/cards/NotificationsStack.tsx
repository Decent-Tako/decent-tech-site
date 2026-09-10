import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { CardsFrame } from './Frame';
import {
  EXAMPLES,
  MOTION_RUNTIME,
  NOTIFICATIONS_STACK_DEFAULTS,
  shouldReduce,
  type NotificationItem,
  type ReducedMotionMode,
} from './source';

export type NotificationsStackProps = {
  count?: number;
  height?: number;
  width?: number;
  gap?: number;
  scaleStep?: number;
  opacityStep?: number;
  mass?: number;
  stiffness?: number;
  damping?: number;
  itemDelay?: number;
  openY?: number;
  openScale?: number;
  notifications?: NotificationItem[];
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function NotificationsStack({
  count = NOTIFICATIONS_STACK_DEFAULTS.count,
  height = NOTIFICATIONS_STACK_DEFAULTS.height,
  width = NOTIFICATIONS_STACK_DEFAULTS.width,
  gap = NOTIFICATIONS_STACK_DEFAULTS.gap,
  scaleStep = NOTIFICATIONS_STACK_DEFAULTS.scaleStep,
  opacityStep = NOTIFICATIONS_STACK_DEFAULTS.opacityStep,
  mass = NOTIFICATIONS_STACK_DEFAULTS.mass,
  stiffness = NOTIFICATIONS_STACK_DEFAULTS.stiffness,
  damping = NOTIFICATIONS_STACK_DEFAULTS.damping,
  itemDelay = NOTIFICATIONS_STACK_DEFAULTS.itemDelay,
  openY = NOTIFICATIONS_STACK_DEFAULTS.openY,
  openScale = NOTIFICATIONS_STACK_DEFAULTS.openScale,
  notifications = NOTIFICATIONS_STACK_DEFAULTS.notifications,
  reducedMotion = NOTIFICATIONS_STACK_DEFAULTS.reducedMotion,
  replayNonce = NOTIFICATIONS_STACK_DEFAULTS.replayNonce,
}: NotificationsStackProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const runKey = runId + replayNonce;

  return (
    <CardsFrame
      title="Notifications stack"
      mechanism={
        <>
          Parent <code>animate</code> is <code>open</code> or <code>closed</code>
          . Variants propagate to the header and each card. Closed cards stack
          with <code>y: -index * (height + gap)</code>, scale{' '}
          <code>1 - index * scaleStep</code>, and opacity{' '}
          <code>1 - index * opacityStep</code>.
        </>
      }
      docs={MOTION_RUNTIME.docsVariants}
      example={EXAMPLES.notificationsStack.page}
      live={EXAMPLES.notificationsStack.live}
      source={EXAMPLES.notificationsStack.source}
      fixedNote="Cards stay 280 by 60 pixels at the upstream default so the 0.1 scale step and 0.4 opacity step remain visible in the closed stack. Replay collapses the stack. This animation is one-shot on click, so Replay is the control."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="notifications-stack"
      running={!reduce}
      runId={runKey}
    >
      <NotificationsRun
        key={runKey}
        count={count}
        height={height}
        width={width}
        gap={gap}
        scaleStep={scaleStep}
        opacityStep={opacityStep}
        mass={mass}
        stiffness={stiffness}
        damping={damping}
        itemDelay={itemDelay}
        openY={openY}
        openScale={openScale}
        notifications={notifications}
        reduce={reduce}
      />
    </CardsFrame>
  );
}

function NotificationsRun({
  count,
  height,
  width,
  gap,
  scaleStep,
  opacityStep,
  mass,
  stiffness,
  damping,
  itemDelay,
  openY,
  openScale,
  notifications,
  reduce,
}: {
  count: number;
  height: number;
  width: number;
  gap: number;
  scaleStep: number;
  opacityStep: number;
  mass: number;
  stiffness: number;
  damping: number;
  itemDelay: number;
  openY: number;
  openScale: number;
  notifications: NotificationItem[];
  reduce: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const items = Array.from({ length: count }, (_, index) => {
    return notifications[index % notifications.length];
  });
  const instant: Transition = reduce
    ? { duration: 0 }
    : { type: 'spring', mass };
  const childTransition = (index: number): Transition =>
    reduce
      ? { duration: 0 }
      : {
          type: 'spring',
          stiffness,
          damping,
          delay: index * itemDelay,
        };

  const stackVariants: Variants = {
    open: { y: openY, scale: openScale, cursor: 'pointer' },
    closed: { y: 0, scale: 1, cursor: 'default' },
  };

  return (
    <div className="cards-example__stage cards-example__stage--notes">
      <motion.div
        className="notes-stack"
        style={{ gap }}
        variants={stackVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        transition={instant}
        data-testid="notes-stack"
        data-open={isOpen ? 'true' : 'false'}
      >
        <Header
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          reduce={reduce}
          stiffness={stiffness}
          damping={damping}
        />
        {items.map((item, index) => (
          <NotificationCard
            key={`${item.title}-${index}`}
            index={index}
            count={count}
            item={item}
            height={height}
            width={width}
            gap={gap}
            scaleStep={scaleStep}
            opacityStep={opacityStep}
            isOpen={isOpen}
            transition={childTransition(index)}
            onClick={() => setIsOpen((open) => !open)}
          />
        ))}
      </motion.div>
    </div>
  );
}

function Header({
  isOpen,
  onClose,
  reduce,
  stiffness,
  damping,
}: {
  isOpen: boolean;
  onClose: () => void;
  reduce: boolean;
  stiffness: number;
  damping: number;
}) {
  const variants: Variants = {
    open: { y: 0, scale: 1, opacity: 1 },
    closed: { y: 60, scale: 0.8, opacity: 0 },
  };

  return (
    <motion.div
      className="notes-header"
      variants={variants}
      aria-hidden={!isOpen}
      transition={
        reduce
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness,
              damping,
              delay: isOpen ? 0.2 : 0,
            }
      }
    >
      <p className="notes-header__title">Notifications</p>
      <button
        type="button"
        onClick={onClose}
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
      >
        Collapse
      </button>
    </motion.div>
  );
}

function NotificationCard({
  index,
  count,
  item,
  height,
  width,
  gap,
  scaleStep,
  opacityStep,
  isOpen,
  transition,
  onClick,
}: {
  index: number;
  count: number;
  item: NotificationItem;
  height: number;
  width: number;
  gap: number;
  scaleStep: number;
  opacityStep: number;
  isOpen: boolean;
  transition: Transition;
  onClick: () => void;
}) {
  const variants: Variants = {
    open: {
      y: 0,
      scale: 1,
      opacity: 1,
      pointerEvents: 'auto',
      cursor: 'pointer',
    },
    closed: {
      y: -index * (height + gap) - gap * index,
      scale: 1 - index * scaleStep,
      opacity: 1 - index * opacityStep,
      pointerEvents: index === 0 ? 'auto' : 'none',
      cursor: index === 0 ? 'pointer' : 'default',
    },
  };

  const style: CSSProperties = {
    height,
    width,
    zIndex: count - index,
  };

  return (
    <motion.button
      type="button"
      className="notes-card"
      style={style}
      variants={variants}
      transition={transition}
      onClick={onClick}
      aria-hidden={!isOpen && index > 0}
      tabIndex={!isOpen && index > 0 ? -1 : 0}
      aria-label={`${item.title}. ${item.body}`}
    >
      <strong>{item.title}</strong>
      <span>{item.body}</span>
    </motion.button>
  );
}
