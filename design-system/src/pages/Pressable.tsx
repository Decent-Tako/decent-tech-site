import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { EASE } from './ease';
import { useReduceMotion } from './pageScroll';

type PressableProps = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
} & (
  | { as?: 'a'; href: string }
  | { as: 'button'; href?: undefined; type?: 'button' | 'submit' }
);

export function Pressable(props: PressableProps) {
  const reduce = useReduceMotion();
  const variants = {
    rest: { y: 0, scale: 1 },
    engaged: {
      y: reduce ? 0 : -2,
      transition: { duration: reduce ? 0 : 0.16, ease: EASE },
    },
    pressed: {
      scale: reduce ? 1 : 0.98,
      transition: { duration: reduce ? 0 : 0.09, ease: EASE },
    },
  };
  const arrow = {
    rest: { x: 0 },
    engaged: { x: reduce ? 0 : 4 },
    pressed: { x: 0 },
  };

  const shared = {
    className: props.className,
    initial: 'rest' as const,
    whileHover: 'engaged' as const,
    whileFocus: 'engaged' as const,
    whileTap: 'pressed' as const,
    variants,
    onClick: props.onClick,
  };

  const body = (
    <>
      {props.children}
      <motion.span
        className="academy-button__arrow"
        aria-hidden="true"
        variants={arrow}
        transition={{ duration: reduce ? 0 : 0.16, ease: EASE }}
      >
        →
      </motion.span>
    </>
  );

  if (props.as === 'button') {
    return (
      <motion.button type={props.type ?? 'button'} {...shared}>
        {body}
      </motion.button>
    );
  }

  return (
    <motion.a href={props.href} {...shared}>
      {body}
    </motion.a>
  );
}
