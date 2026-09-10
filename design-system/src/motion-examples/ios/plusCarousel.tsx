import { motion, useMotionValue, useMotionValueEvent } from 'motion/react';
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  CarouselContext,
  TickerContext,
  TickerItemContext,
} from './plusCarouselHooks';

export type PlusCarouselProps = {
  items: ReactNode[];
  gap?: number;
  snap?: boolean;
  loop?: boolean;
  overflow?: boolean;
  className?: string;
  children?: ReactNode;
};

type ItemRecord = {
  node: HTMLDivElement | null;
  setOffset: (value: number) => void;
};

function TickerItem({
  register,
  index,
  children,
}: {
  register: (record: ItemRecord, index: number) => void;
  index: number;
  children: ReactNode;
}) {
  const offset = useMotionValue(0);
  const setNode = (node: HTMLDivElement | null) => {
    register(
      {
        node,
        setOffset: (value: number) => offset.set(value),
      },
      index,
    );
  };

  const value = useMemo(() => ({ offset }), [offset]);

  return (
    <TickerItemContext.Provider value={value}>
      <div ref={setNode} className="ios-plus-carousel__item">
        {children}
      </div>
    </TickerItemContext.Provider>
  );
}

export function Carousel({
  items,
  gap = 0,
  snap = false,
  loop = false,
  overflow = false,
  className,
  children,
}: PlusCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemRecords = useRef<Array<ItemRecord | undefined>>([]);
  const renderedOffset = useMotionValue(0);
  const [isMeasured, setIsMeasured] = useState(false);
  const [maxInset, setMaxInset] = useState(0);

  const register = useCallback((record: ItemRecord, index: number) => {
    itemRecords.current[index] = record;
  }, []);

  const syncOffsets = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const viewBox = viewport.getBoundingClientRect();
    const center = viewBox.left + viewBox.width / 2;
    for (const record of itemRecords.current) {
      if (!record?.node) continue;
      const box = record.node.getBoundingClientRect();
      record.setOffset(box.left + box.width / 2 - center);
    }
  }, []);

  const measure = useCallback(() => {
    const records = itemRecords.current.filter(
      (record): record is ItemRecord => Boolean(record?.node),
    );
    const first = records[0]?.node;
    const last = records[records.length - 1]?.node;
    if (!first || !last) return;

    const currentX = renderedOffset.get();
    const firstBox = first.getBoundingClientRect();
    const lastBox = last.getBoundingClientRect();
    const firstCenter = firstBox.left + firstBox.width / 2 - currentX;
    const lastCenter = lastBox.left + lastBox.width / 2 - currentX;
    setMaxInset(Math.max(0, lastCenter - firstCenter));
    setIsMeasured(true);
    syncOffsets();
  }, [renderedOffset, syncOffsets]);

  useLayoutEffect(() => {
    measure();
  }, [gap, items.length, measure]);

  useMotionValueEvent(renderedOffset, 'change', () => {
    syncOffsets();
  });

  const carouselValue = useMemo(
    () => ({ targetOffset: renderedOffset }),
    [renderedOffset],
  );
  const tickerValue = useMemo(
    () => ({ isMeasured, renderedOffset, maxInset }),
    [isMeasured, maxInset, renderedOffset],
  );

  return (
    <CarouselContext.Provider value={carouselValue}>
      <TickerContext.Provider value={tickerValue}>
        <div
          ref={viewportRef}
          className={className}
          data-plus-carousel=""
          data-overflow={overflow ? 'true' : 'false'}
          data-loop={loop ? 'true' : 'false'}
          data-snap={snap ? 'true' : 'false'}
          data-measured={isMeasured ? 'true' : 'false'}
        >
          <motion.div
            className="ios-plus-carousel__track"
            drag="x"
            dragConstraints={{ left: -maxInset, right: 0 }}
            dragElastic={0}
            dragMomentum={!snap}
            style={{ x: renderedOffset, gap }}
          >
            {items.map((item, index) => (
              <TickerItem key={index} index={index} register={register}>
                {item}
              </TickerItem>
            ))}
          </motion.div>
          {children}
        </div>
      </TickerContext.Provider>
    </CarouselContext.Provider>
  );
}

