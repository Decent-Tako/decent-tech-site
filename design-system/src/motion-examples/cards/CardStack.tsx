import {
  animate,
  easeIn,
  mix,
  motion,
  progress,
  useMotionValue,
  useReducedMotion,
  useTransform,
  wrap,
} from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { CardsFrame } from './Frame';
import {
  CARD_STACK_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  shouldReduce,
  type CardStackImage,
  type ReducedMotionMode,
} from './source';

export type CardStackProps = {
  images?: CardStackImage[];
  maxRotate?: number;
  minSpeed?: number;
  minDistanceRatio?: number;
  swipeStiffness?: number;
  swipeDamping?: number;
  returnStiffness?: number;
  restStiffness?: number;
  restDamping?: number;
  stackSize?: number;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function CardStack({
  images = CARD_STACK_DEFAULTS.images,
  maxRotate = CARD_STACK_DEFAULTS.maxRotate,
  minSpeed = CARD_STACK_DEFAULTS.minSpeed,
  minDistanceRatio = CARD_STACK_DEFAULTS.minDistanceRatio,
  swipeStiffness = CARD_STACK_DEFAULTS.swipeStiffness,
  swipeDamping = CARD_STACK_DEFAULTS.swipeDamping,
  returnStiffness = CARD_STACK_DEFAULTS.returnStiffness,
  restStiffness = CARD_STACK_DEFAULTS.restStiffness,
  restDamping = CARD_STACK_DEFAULTS.restDamping,
  stackSize = CARD_STACK_DEFAULTS.stackSize,
  reducedMotion = CARD_STACK_DEFAULTS.reducedMotion,
  replayNonce = CARD_STACK_DEFAULTS.replayNonce,
}: CardStackProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const runKey = runId + replayNonce;

  return (
    <CardsFrame
      title="Card stack"
      mechanism={
        <>
          Top card is <code>drag=&quot;x&quot;</code>. <code>useMotionValue</code>{' '}
          holds <code>x</code>. <code>useTransform</code> maps it to{' '}
          <code>rotate</code>. <code>onDragEnd</code> reads distance and
          velocity. <code>wrap</code> sends a swiped card to the back.{' '}
          <code>mix</code> plus <code>progress</code> plus <code>easeIn</code>{' '}
          set scale and opacity.
        </>
      }
      docs={MOTION_RUNTIME.docsDrag}
      example={EXAMPLES.cardStack.page}
      live={EXAMPLES.cardStack.live}
      source={EXAMPLES.cardStack.source}
      extraRuntime="next/image is replaced with img because Storybook is not Next.js."
      fixedNote="The stack is 400 by 400 pixels at the upstream default so the 5 degree fan and the half-width swipe distance stay readable. Below 600px the live example uses 200. will-change and the drop-shadow are the upstream performance and depth hints. Replay remounts at index 0. This animation is one-shot per swipe, so Replay is the control."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="card-stack"
      running={!reduce}
      runId={runKey}
    >
      <CardStackRun
        key={runKey}
        images={images}
        maxRotate={maxRotate}
        minSpeed={minSpeed}
        minDistanceRatio={minDistanceRatio}
        swipeStiffness={swipeStiffness}
        swipeDamping={swipeDamping}
        returnStiffness={returnStiffness}
        restStiffness={restStiffness}
        restDamping={restDamping}
        stackSize={stackSize}
        reduce={reduce}
      />
    </CardsFrame>
  );
}

function CardStackRun({
  images,
  maxRotate,
  minSpeed,
  minDistanceRatio,
  swipeStiffness,
  swipeDamping,
  returnStiffness,
  restStiffness,
  restDamping,
  stackSize,
  reduce,
}: {
  images: CardStackImage[];
  maxRotate: number;
  minSpeed: number;
  minDistanceRatio: number;
  swipeStiffness: number;
  swipeDamping: number;
  returnStiffness: number;
  restStiffness: number;
  restDamping: number;
  stackSize: number;
  reduce: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLUListElement>(null);
  const [width, setWidth] = useState(stackSize);

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.offsetWidth);
  }, [stackSize]);

  const current = images[currentIndex] ?? images[0];

  return (
    <div className="cards-example__stage">
      <ul
        className="cards-stack"
        ref={ref}
        style={{ '--stack-size': `${stackSize}px` } as CSSProperties}
        aria-label="Academy week photographs"
        data-index={String(currentIndex)}
      >
        {images.map((image, index) => (
          <StackImage
            key={image.src}
            src={image.src}
            alt={image.alt}
            ratio={image.ratio}
            minDistance={width * minDistanceRatio}
            maxRotate={maxRotate}
            minSpeed={minSpeed}
            index={index}
            currentIndex={currentIndex}
            totalImages={images.length}
            swipeStiffness={swipeStiffness}
            swipeDamping={swipeDamping}
            returnStiffness={returnStiffness}
            restStiffness={restStiffness}
            restDamping={restDamping}
            reduce={reduce}
            setNextImage={() => {
              setCurrentIndex(wrap(0, images.length, currentIndex + 1));
            }}
          />
        ))}
      </ul>
      <p className="cards-stack__caption">{current?.title}</p>
      <p className="cards-stack__hint">
        Swipe the top photo left or right. Swiped photos move to the back of
        the stack.
      </p>
    </div>
  );
}

function StackImage({
  src,
  alt,
  ratio,
  index,
  currentIndex,
  totalImages,
  maxRotate,
  setNextImage,
  minDistance,
  minSpeed,
  swipeStiffness,
  swipeDamping,
  returnStiffness,
  restStiffness,
  restDamping,
  reduce,
}: {
  src: string;
  alt: string;
  ratio: number;
  index: number;
  currentIndex: number;
  totalImages: number;
  maxRotate: number;
  setNextImage: () => void;
  minDistance: number;
  minSpeed: number;
  swipeStiffness: number;
  swipeDamping: number;
  returnStiffness: number;
  restStiffness: number;
  restDamping: number;
  reduce: boolean;
}) {
  const baseRotation = mix(0, maxRotate, Math.sin(index));
  const x = useMotionValue(0);
  const rotate = useTransform(
    x,
    [0, 400],
    [baseRotation, baseRotation + 10],
    { clamp: false },
  );
  const zIndex = totalImages - wrap(totalImages, 0, index - currentIndex + 1);
  const isTop = index === currentIndex;
  const opacity = progress(totalImages * 0.25, totalImages * 0.75, zIndex);
  const progressInStack = progress(0, totalImages - 1, zIndex);
  const scale = mix(0.5, 1, easeIn(progressInStack));

  const onDragEnd = () => {
    const distance = Math.abs(x.get());
    const speed = Math.abs(x.getVelocity());

    if (distance > minDistance || speed > minSpeed) {
      setNextImage();
      animate(x, 0, {
        type: 'spring',
        stiffness: swipeStiffness,
        damping: swipeDamping,
      });
    } else {
      animate(x, 0, {
        type: 'spring',
        stiffness: returnStiffness,
        damping: swipeDamping,
      });
    }
  };

  return (
    <motion.li
      className="cards-stack__item"
      data-top={isTop ? 'true' : 'false'}
      style={{
        width: ratio > 1 ? '100%' : 'auto',
        height: ratio <= 1 ? '100%' : 'auto',
        aspectRatio: ratio,
        zIndex,
        rotate: reduce ? baseRotation : rotate,
        x: reduce ? 0 : x,
      }}
      initial={reduce ? false : { opacity: 0, scale: 0.3 }}
      animate={{ opacity, scale }}
      whileTap={isTop && !reduce ? { scale: 0.98 } : {}}
      transition={
        reduce
          ? { duration: 0 }
          : { type: 'spring', stiffness: restStiffness, damping: restDamping }
      }
      drag={isTop && !reduce ? 'x' : false}
      onDragEnd={onDragEnd}
      aria-hidden={!isTop}
      tabIndex={isTop ? 0 : -1}
    >
      <img
        data-photo
        src={src}
        alt={isTop ? alt : ''}
        onPointerDown={(event) => event.preventDefault()}
      />
    </motion.li>
  );
}
