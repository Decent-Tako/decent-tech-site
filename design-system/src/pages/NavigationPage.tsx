import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';

import { DESTINATIONS, type DestinationId, type PageId } from './content';
import { EASE } from './ease';
import { NavIndicator } from './NavIndicator';
import { useReduceMotion } from './pageScroll';
import { PageShell } from './PageShell';
import { Pressable } from './Pressable';

export function NavigationPage({
  reducedMotion = 'user',
}: {
  reducedMotion?: 'user' | 'always';
}) {
  const [current, setCurrent] = useState<DestinationId>('learn');

  return (
    <PageShell
      current={current}
      reducedMotion={reducedMotion}
      onNavigate={(id: PageId) => setCurrent(id)}
    >
      <SharedLayoutDestinations
        selected={current}
        onSelect={setCurrent}
      />
    </PageShell>
  );
}

function SharedLayoutDestinations({
  selected,
  onSelect,
}: {
  selected: DestinationId;
  onSelect: (id: DestinationId) => void;
}) {
  const reduce = useReduceMotion();
  const destination = DESTINATIONS.find((item) => item.id === selected) ?? DESTINATIONS[1];

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.article
          key={destination.id}
          className="academy-destination academy-destination--ink"
          id={destination.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
        >
          <motion.figure
            className="academy-destination__photo"
            layoutId={`photo-${destination.id}`}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
          >
            <img
              data-photo
              src={destination.photo.src}
              alt={destination.photo.alt}
            />
          </motion.figure>
          <div className="academy-destination__copy">
            <p className="academy-kicker">{destination.kicker}</p>
            <h1 className="academy-destination__title">{destination.title}</h1>
            <p>{destination.copy}</p>
            <Pressable
              className="academy-button academy-button--primary"
              href={`#${destination.id}`}
            >
              {destination.cta}
            </Pressable>
          </div>
        </motion.article>
      </AnimatePresence>
      <nav className="academy-rail" aria-label="Academy areas">
        {DESTINATIONS.map((item) => {
          const active = item.id === selected;
          return (
            <motion.button
              key={item.id}
              type="button"
              className="academy-rail__item"
              aria-current={active ? 'page' : undefined}
              onClick={() => onSelect(item.id)}
              layout
              transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            >
              {active ? (
                <span className="academy-rail__slot" aria-hidden="true" />
              ) : (
                <motion.img
                  data-photo
                  layoutId={`photo-${item.id}`}
                  src={item.photo.src}
                  alt=""
                  transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                />
              )}
              <span>{item.title}</span>
              {active ? <NavIndicator layoutId="rail-active" /> : null}
            </motion.button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}
