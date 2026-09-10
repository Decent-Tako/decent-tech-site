/* eslint-disable react-refresh/only-export-components */
import { useReducedMotion } from 'motion/react';
import { createContext, useContext, type ReactNode, type RefObject } from 'react';

const ScrollContext = createContext<RefObject<HTMLElement | null> | null>(null);
const ForceReduceContext = createContext(false);

export function PageScrollProvider({
  scrollRef,
  forceReduce = false,
  children,
}: {
  scrollRef: RefObject<HTMLElement | null>;
  forceReduce?: boolean;
  children: ReactNode;
}) {
  return (
    <ForceReduceContext.Provider value={forceReduce}>
      <ScrollContext.Provider value={scrollRef}>{children}</ScrollContext.Provider>
    </ForceReduceContext.Provider>
  );
}

export function usePageScroll() {
  const ref = useContext(ScrollContext);
  if (!ref) {
    throw new Error('usePageScroll needs PageShell');
  }
  return ref;
}

export function useReduceMotion() {
  const forced = useContext(ForceReduceContext);
  const pref = useReducedMotion();
  return forced || pref !== false;
}
