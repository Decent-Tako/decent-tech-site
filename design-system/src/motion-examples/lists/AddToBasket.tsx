import {
  arc,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import { useRef, useState } from 'react';

import { ListsFrame } from './Frame';
import {
  ADD_TO_BASKET_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  shouldReduce,
  type ArcDirection,
  type ReducedMotionMode,
} from './source';

const PRODUCT_SIZE = 160;
const BASKET_BOX = 56;
const FLY_SCALE = BASKET_BOX / PRODUCT_SIZE;

export type AddToBasketProps = {
  strength?: number;
  peak?: number;
  rotate?: number;
  duration?: number;
  basketVelocityFactor?: number;
  direction?: ArcDirection;
  productName?: string;
  productPrice?: string;
  buttonLabel?: string;
  basketLabel?: string;
  photoSrc?: string;
  photoAlt?: string;
  reducedMotion?: ReducedMotionMode;
};

function BasketGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 11-1 9" />
      <path d="m19 11-4-7" />
      <path d="M2 11h20" />
      <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
      <path d="M4.5 15.5h15" />
      <path d="m5 11 4-7" />
      <path d="m9 11 1 9" />
    </svg>
  );
}

export function AddToBasket({
  strength = ADD_TO_BASKET_DEFAULTS.strength,
  peak = ADD_TO_BASKET_DEFAULTS.peak,
  rotate = ADD_TO_BASKET_DEFAULTS.rotate,
  duration = ADD_TO_BASKET_DEFAULTS.duration,
  basketVelocityFactor = ADD_TO_BASKET_DEFAULTS.basketVelocityFactor,
  direction = ADD_TO_BASKET_DEFAULTS.direction,
  productName = ADD_TO_BASKET_DEFAULTS.productName,
  productPrice = ADD_TO_BASKET_DEFAULTS.productPrice,
  buttonLabel = ADD_TO_BASKET_DEFAULTS.buttonLabel,
  basketLabel = ADD_TO_BASKET_DEFAULTS.basketLabel,
  photoSrc = ADD_TO_BASKET_DEFAULTS.photoSrc,
  photoAlt = ADD_TO_BASKET_DEFAULTS.photoAlt,
  reducedMotion = ADD_TO_BASKET_DEFAULTS.reducedMotion,
}: AddToBasketProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [scope, animate] = useAnimate();
  const productRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isFlying, setIsFlying] = useState(false);
  const productX = useMotionValue(0);
  const productY = useMotionValue(0);

  const addToBasket = async () => {
    const product = productRef.current;
    const basket = basketRef.current;
    const ring = ringRef.current;
    if (!product || !basket || !ring || isFlying) return;
    setIsFlying(true);

    const from = product.getBoundingClientRect();
    const to = basket.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const flyDuration = reduce ? 0 : duration;

    await animate(
      product,
      {
        x: dx,
        y: dy,
        scale: FLY_SCALE,
        opacity: [1, 1, 0],
      },
      {
        duration: flyDuration,
        path: arc({
          strength,
          peak,
          rotate,
          direction: direction === 'auto' ? undefined : direction,
        }),
        ease: [0.74, 0.18, 0.93, 0.69],
        opacity: { inherit: true, times: [0, 0.95, 1] },
      },
    );

    animate(
      basket,
      { x: 0, y: 0 },
      {
        type: 'spring',
        stiffness: 500,
        damping: 12,
        x: {
          inherit: true,
          velocity: productX.getVelocity() * basketVelocityFactor,
        },
        y: {
          inherit: true,
          velocity: productY.getVelocity() * basketVelocityFactor,
        },
      },
    );

    animate(
      ring,
      { scale: [1, 2.2], opacity: [0.8, 0] },
      { duration: reduce ? 0 : 0.5, ease: 'easeOut' },
    );

    animate(
      product,
      {
        x: 0,
        y: 0,
        scale: 0.9,
        rotate: 0,
        opacity: 0,
        clipPath: 'inset(0%)',
      },
      { duration: 0 },
    );

    await animate(
      product,
      { opacity: 1, scale: 1 },
      {
        scale: reduce
          ? { duration: 0 }
          : { type: 'spring', visualDuration: 0.4, bounce: 0.35 },
        opacity: { duration: reduce ? 0 : 0.25, ease: 'easeOut' },
      },
    );

    setIsFlying(false);
  };

  return (
    <ListsFrame
      title="Add to basket"
      mechanism={
        <>
          <code>useAnimate</code> flies the photograph with{' '}
          <code>transition.path: arc({'{ strength, peak, rotate, direction }'})</code>
          . Opacity times are <code>[0, 0.95, 1]</code>. A spring knocks the
          page basket with the product velocity. A ring scales{' '}
          <code>1 → 2.2</code> and fades. The product snaps home and springs
          back in.
        </>
      }
      docs={MOTION_RUNTIME.docsArc}
      example={EXAMPLES.addToBasket.page}
      live={EXAMPLES.addToBasket.live}
      chunk={EXAMPLES.addToBasket.chunk}
      fixedNote="Product size stays 160 px and the basket stays 56 px so FLY_SCALE stays 56/160, the upstream ratio. The stage is 26 rem tall so the arc has room. Fly ease [0.74, 0.18, 0.93, 0.69] and basket spring 500/12 stay fixed. Replay runs the flight."
      controlKind="replay"
      onReplay={() => {
        setRunId((value) => value + 1);
        void addToBasket();
      }}
      reducedMotion={reducedMotion}
      testId="add-to-basket"
      running={isFlying}
      runId={runId}
      extraData={{ 'data-flying': isFlying ? 'true' : 'false' }}
    >
      <div className="lists-example__stage lists-example__stage--tall">
        <div ref={scope} className="lists-basket">
          <div
            ref={basketRef}
            className="lists-basket__icon"
            role="img"
            aria-label={basketLabel}
          >
            <motion.div ref={ringRef} className="lists-basket__ring" />
            <BasketGlyph />
          </div>
          <div className="lists-basket__center">
            <motion.div
              ref={productRef}
              className="lists-basket__product"
              style={{ x: productX, y: productY }}
            >
              <img src={photoSrc} alt={photoAlt} data-photo="true" />
            </motion.div>
            <div className="lists-basket__meta">
              <span>{productName}</span>
              <span className="lists-basket__price">{productPrice}</span>
            </div>
            <motion.button
              type="button"
              className="lists-basket__button"
              onClick={() => {
                void addToBasket();
              }}
              disabled={isFlying}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
            >
              {buttonLabel}
            </motion.button>
          </div>
        </div>
      </div>
    </ListsFrame>
  );
}
