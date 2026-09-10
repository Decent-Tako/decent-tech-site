import { motion } from 'motion/react';

import { EASE } from './ease';
import { useReduceMotion } from './pageScroll';

export function NavIndicator({ layoutId }: { layoutId: string }) {
  const reduce = useReduceMotion();

  return (
    <motion.span
      className="academy-nav-indicator"
      layoutId={layoutId}
      aria-hidden="true"
      transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
    />
  );
}
