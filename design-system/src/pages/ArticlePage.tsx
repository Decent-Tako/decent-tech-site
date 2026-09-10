import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';

import { ARTICLE } from './content';
import { EASE } from './ease';
import { usePageScroll, useReduceMotion } from './pageScroll';
import { PageShell } from './PageShell';
import { Photo } from './Photo';

export function ArticlePage({
  reducedMotion = 'user',
}: {
  reducedMotion?: 'user' | 'always';
}) {
  return (
    <PageShell current="learn" reducedMotion={reducedMotion}>
      <ArticleSurface />
    </PageShell>
  );
}

function ArticleSurface() {
  const reduce = useReduceMotion();
  const container = usePageScroll();
  const { scrollYProgress, scrollY } = useScroll({ container });
  const [percent, setPercent] = useState(0);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setPercent(Math.round(value * 100));
  });

  useMotionValueEvent(scrollY, 'change', (current) => {
    if (reduce) {
      setHidden(false);
      return;
    }
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(current > previous && current > 80);
  });

  return (
    <>
      <motion.div
        className="academy-progress"
        role="progressbar"
        aria-label={ARTICLE.readLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        style={{ scaleX: scrollYProgress }}
        animate={reduce || !hidden ? { y: 0 } : { y: -4 }}
        transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
      />
      <article className="academy-article" id="learn">
        <header className="academy-article__header">
          <p className="academy-kicker">{ARTICLE.kicker}</p>
          <h1 className="academy-article__title">{ARTICLE.title}</h1>
          <p className="academy-article__dek">{ARTICLE.dek}</p>
        </header>
        <div className="academy-article__body prose prose-academy prose-measure-default">
          {ARTICLE.sections.map((section) => (
            <motion.section
              key={section.heading}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35, root: container }}
              transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
            >
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {'photo' in section && section.photo ? (
                <Photo
                  src={section.photo.src}
                  alt={section.photo.alt}
                  caption={section.photo.caption}
                />
              ) : null}
            </motion.section>
          ))}
        </div>
      </article>
    </>
  );
}
