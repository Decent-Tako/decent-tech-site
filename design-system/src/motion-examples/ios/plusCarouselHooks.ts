import { createContext, useContext } from 'react';
import type { MotionValue } from 'motion/react';

export type CarouselContextValue = {
  targetOffset: MotionValue<number>;
};

export type TickerContextValue = {
  isMeasured: boolean;
  renderedOffset: MotionValue<number>;
  maxInset: number;
};

export type TickerItemContextValue = {
  offset: MotionValue<number>;
};

export const CarouselContext = createContext<CarouselContextValue | null>(null);
export const TickerContext = createContext<TickerContextValue | null>(null);
export const TickerItemContext = createContext<TickerItemContextValue | null>(
  null,
);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used inside Carousel');
  }
  return context;
}

export function useTicker() {
  const context = useContext(TickerContext);
  if (!context) {
    throw new Error('useTicker must be used inside Carousel');
  }
  return context;
}

export function useTickerItem() {
  const context = useContext(TickerItemContext);
  if (!context) {
    throw new Error('useTickerItem must be used inside a Carousel item');
  }
  return context;
}
