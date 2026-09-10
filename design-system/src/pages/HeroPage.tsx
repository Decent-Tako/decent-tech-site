import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { Wordmark } from '../brand/Wordmark';
import { FEATURES, HERO, PHOTOS } from './content';
import { EASE } from './ease';
import { usePageScroll, useReduceMotion } from './pageScroll';
import { PageShell } from './PageShell';
import { Pressable } from './Pressable';

export function HeroPage({
  reducedMotion = 'user',
}: {
  reducedMotion?: 'user' | 'always';
}) {
  return (
    <PageShell current="start" reducedMotion={reducedMotion}>
      <ScrollZoomHero />
      <section className="academy-band academy-band--paper" id="start">
        <p className="academy-kicker">Six weeks</p>
        <h2 className="academy-band__title">Complete one week at a time.</h2>
        <p className="academy-band__lede">
          Learn contains six weekly lessons. Finish the current week and its
          practical action before the next lesson opens.
        </p>
        <div className="academy-week-grid">
          {FEATURES.map((feature) => (
            <article key={feature.id} className="academy-week-card">
              <strong>
                {feature.index} {feature.title}
              </strong>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function ScrollZoomHero() {
  const reduce = useReduceMotion();
  const container = usePageScroll();
  const trackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container,
    target: trackRef,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(14px)']);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.55, 0.2]);
  const item = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.36, ease: EASE },
    },
  };

  return (
    <section
      ref={trackRef}
      className="academy-hero-track"
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="academy-hero-sticky academy-hero">
        <motion.figure
          className="academy-hero__photo"
          style={reduce ? undefined : { scale, filter: blur, opacity }}
        >
          <img data-photo src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} />
          <figcaption>{PHOTOS.hero.caption}</figcaption>
        </motion.figure>
        <div className="academy-hero__shade" />
        <motion.div
          className="academy-hero__copy"
          initial={reduce ? 'show' : 'hidden'}
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduce ? 0 : 0.08,
                delayChildren: reduce ? 0 : 0.04,
              },
            },
          }}
        >
          <motion.p className="academy-kicker" variants={item}>
            {HERO.kicker}
          </motion.p>
          <motion.h1 className="academy-hero__title" id="hero-title" variants={item}>
            <Wordmark size="hero" href={null} />
          </motion.h1>
          <motion.p className="academy-hero__lede" variants={item}>
            {HERO.lede}
          </motion.p>
          <motion.div className="academy-hero__actions" variants={item}>
            <Pressable className="academy-button academy-button--primary" href="#start">
              Start week 0
            </Pressable>
            <Pressable className="academy-button academy-button--ghost" href="#learn">
              See the six weeks
            </Pressable>
          </motion.div>
          <motion.dl className="academy-hero__facts" variants={item}>
            {HERO.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
