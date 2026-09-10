import type { Variants } from 'motion/react';
import { motion, stagger } from 'motion/react';
import { useEffect, useRef, useState, type RefObject } from 'react';

import { FEATURES } from '../../pages/content';

const ITEMS = FEATURES.slice(0, 5);

export type VariantsNavProps = {
  itemStagger: number;
  itemStartDelay: number;
  closeStagger: number;
  itemY: number;
  hoverScale: number;
  tapScale: number;
  openStiffness: number;
  closeStiffness: number;
  closeDamping: number;
  closeDelay: number;
  initialOpen: boolean;
  skip: boolean;
  onOpenChange?: (open: boolean) => void;
  replayToken: number;
};

export function VariantsNav({
  itemStagger,
  itemStartDelay,
  closeStagger,
  itemY,
  hoverScale,
  tapScale,
  openStiffness,
  closeStiffness,
  closeDamping,
  closeDelay,
  initialOpen,
  skip,
  onOpenChange,
  replayToken,
}: VariantsNavProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [initialFromArgs, setInitialFromArgs] = useState(initialOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);

  if (initialOpen !== initialFromArgs) {
    setInitialFromArgs(initialOpen);
    setIsOpen(initialOpen);
  }

  useEffect(() => {
    if (replayToken === 0) return undefined;
    const closeId = window.setTimeout(() => setIsOpen(false), 0);
    const openId = window.setTimeout(() => setIsOpen(true), 80);
    return () => {
      window.clearTimeout(closeId);
      window.clearTimeout(openId);
    };
  }, [replayToken]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const navVariants = skip
    ? {
        open: { transition: { duration: 0 } },
        closed: { transition: { duration: 0 } },
      }
    : {
        open: {
          transition: {
            delayChildren: stagger(itemStagger, { startDelay: itemStartDelay }),
          },
        },
        closed: {
          transition: {
            delayChildren: stagger(closeStagger, { from: 'last' as const }),
          },
        },
      };

  const itemVariants = skip
    ? {
        open: { y: 0, opacity: 1, transition: { duration: 0 } },
        closed: { y: itemY, opacity: 0, transition: { duration: 0 } },
      }
    : {
        open: {
          y: 0,
          opacity: 1,
          transition: {
            y: { stiffness: 1000, velocity: -100 },
          },
        },
        closed: {
          y: itemY,
          opacity: 0,
          transition: {
            y: { stiffness: 1000 },
          },
        },
      };

  const sidebarVariants: Variants = {
    open: (measuredHeight = 1000) => ({
      clipPath: `circle(${measuredHeight * 2 + 200}px at 40px 40px)`,
      transition: skip
        ? { duration: 0 }
        : {
            type: 'spring',
            stiffness: openStiffness,
            restDelta: 2,
          },
    }),
    closed: {
      clipPath: 'circle(30px at 40px 40px)',
      transition: skip
        ? { duration: 0 }
        : {
            delay: closeDelay,
            type: 'spring',
            stiffness: closeStiffness,
            damping: closeDamping,
          },
    },
  };

  return (
    <div className="kf-variants" data-open={isOpen ? 'true' : 'false'}>
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        custom={height}
        ref={containerRef}
        className="kf-variants__nav"
        aria-label="Academy stages"
      >
        <motion.div
          className="kf-variants__background"
          variants={sidebarVariants}
        />
        <motion.ul
          className="kf-variants__list"
          variants={navVariants}
          inert={!isOpen}
        >
          {ITEMS.map((item) => (
            <motion.li
              key={item.id}
              className="kf-variants__item-wrap"
              variants={itemVariants}
            >
              <motion.button
                type="button"
                className="kf-variants__item"
                whileHover={skip ? undefined : { scale: hoverScale }}
                whileTap={skip ? undefined : { scale: tapScale }}
              >
                <img
                  data-photo=""
                  className="kf-variants__photo"
                  src={item.photo.src}
                  alt={item.photo.alt}
                />
                <span className="kf-variants__copy">
                  <span className="kf-variants__kicker">{item.kicker}</span>
                  <span className="kf-variants__name">{item.title}</span>
                </span>
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
        <MenuToggle
          open={isOpen}
          toggle={() => setIsOpen((current) => !current)}
        />
      </motion.nav>
    </div>
  );
}

function MenuToggle({ open, toggle }: { open: boolean; toggle: () => void }) {
  return (
    <button
      type="button"
      className="kf-variants__toggle"
      aria-expanded={open}
      aria-label={open ? 'Close stages' : 'Open stages'}
      onClick={toggle}
    >
      <svg width="23" height="23" viewBox="0 0 23 23" aria-hidden="true">
        <Path
          variants={{
            closed: { d: 'M 2 2.5 L 20 2.5' },
            open: { d: 'M 3 16.5 L 17 2.5' },
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            closed: { d: 'M 2 16.346 L 20 16.346' },
            open: { d: 'M 3 2.5 L 17 16.346' },
          }}
        />
      </svg>
    </button>
  );
}

function Path({
  d,
  variants,
  transition,
}: {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}) {
  return (
    <motion.path
      fill="transparent"
      strokeWidth="3"
      stroke="currentColor"
      strokeLinecap="round"
      d={d}
      variants={variants}
      transition={transition}
    />
  );
}

const useDimensions = (ref: RefObject<HTMLDivElement | null>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const frame = requestAnimationFrame(() => {
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    });
    return () => cancelAnimationFrame(frame);
  }, [ref]);

  return size;
};
