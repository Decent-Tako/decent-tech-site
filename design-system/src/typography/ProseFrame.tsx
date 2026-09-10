import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import {
  MEASURES,
  countWords,
  measureZeroCharacters,
  type Measure,
} from './measure';

export function ProseFrame({
  measure,
  onMeasureChange,
  children,
}: {
  measure: Measure;
  onMeasureChange: (measure: Measure) => void;
  children: ReactNode;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const [words, setWords] = useState(0);
  const [characters, setCharacters] = useState(0);
  const spec = MEASURES[measure];

  useLayoutEffect(() => {
    const article = articleRef.current;
    if (!article) {
      return;
    }

    let cancelled = false;
    const update = () => {
      if (cancelled) {
        return;
      }
      setWords(countWords(article.textContent ?? ''));
      setCharacters(measureZeroCharacters(article));
    };

    update();
    void document.fonts.ready.then(update);
    const observer = new ResizeObserver(update);
    observer.observe(article);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [children, measure]);

  return (
    <div className="typography-frame">
      <div className="typography-toolbar">
        <fieldset>
          <legend>Reading measure</legend>
          <div className="typography-toolbar__options">
            {(Object.keys(MEASURES) as Measure[]).map((key) => (
              <label key={key}>
                <input
                  type="radio"
                  name="reading-measure"
                  value={key}
                  checked={measure === key}
                  onChange={() => onMeasureChange(key)}
                />
                {MEASURES[key].label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="typography-toolbar__meta" aria-live="polite">
          <strong>
            {spec.label}: {spec.ch}ch
          </strong>
          <span>Line length {characters} characters.</span>
          <span>{words} words in this article.</span>
        </p>
      </div>
      <article
        ref={articleRef}
        className={`prose prose-academy ${spec.className}`}
      >
        {children}
      </article>
    </div>
  );
}
