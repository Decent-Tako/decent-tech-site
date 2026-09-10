import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { FEATURES } from './content';
import { usePageScroll, useReduceMotion } from './pageScroll';
import { PageShell } from './PageShell';

export function FeatureScrollPage({
  reducedMotion = 'user',
}: {
  reducedMotion?: 'user' | 'always';
}) {
  return (
    <PageShell current="tools" reducedMotion={reducedMotion}>
      <FeatureNarrative />
    </PageShell>
  );
}

function FeatureNarrative() {
  const reduce = useReduceMotion();

  if (reduce) {
    return (
      <div className="academy-features-stack" id="tools">
        {FEATURES.map((feature) => (
          <FeaturePanel key={feature.id} feature={feature} />
        ))}
      </div>
    );
  }

  return <HorizontalFeatures />;
}

function HorizontalFeatures() {
  const container = usePageScroll();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container,
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const shift = -((FEATURES.length - 1) / FEATURES.length) * 100;
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `${shift}%`]);

  return (
    <div className="academy-features-track" ref={trackRef} id="tools">
      <div className="academy-features-stage">
        <motion.div className="academy-features-row" style={{ x }}>
          {FEATURES.map((feature) => (
            <FeaturePanel key={feature.id} feature={feature} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function FeaturePanel({ feature }: { feature: (typeof FEATURES)[number] }) {
  return (
    <article className="academy-feature academy-feature--ink">
      <div className="academy-feature__copy">
        <p className="academy-feature__index">
          <span>{feature.index}</span>
          {feature.kicker}
        </p>
        <h2 className="academy-feature__title">{feature.title}</h2>
        <p>{feature.copy}</p>
      </div>
      <figure className="academy-feature__photo">
        <img data-photo src={feature.photo.src} alt={feature.photo.alt} />
        <figcaption>{feature.photo.caption}</figcaption>
      </figure>
    </article>
  );
}
