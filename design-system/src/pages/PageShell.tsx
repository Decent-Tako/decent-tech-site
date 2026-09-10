import { LayoutGroup, MotionConfig } from 'motion/react';
import { useRef, type ReactNode } from 'react';

import { Wordmark } from '../brand/Wordmark';
import { PAGE_NAV, type PageId } from './content';
import { NavIndicator } from './NavIndicator';
import { PageScrollProvider } from './pageScroll';
import { Pressable } from './Pressable';

export function PageShell({
  current,
  reducedMotion = 'user',
  onNavigate,
  children,
}: {
  current: PageId;
  reducedMotion?: 'user' | 'always';
  onNavigate?: (id: PageId) => void;
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion={reducedMotion}>
      <PageScrollProvider
        scrollRef={scrollRef}
        forceReduce={reducedMotion === 'always'}
      >
        <div className="academy-page" ref={scrollRef}>
          <a className="academy-skip" href="#academy-main">
            Skip to content
          </a>
          <header className="academy-masthead">
            <Wordmark size="small" href="#top" label="Uncomfortable Academy home" />
            <LayoutGroup>
              <nav className="academy-masthead__nav" aria-label="Primary">
                <ul>
                  {PAGE_NAV.map((item) => (
                    <li key={item.id}>
                      {current === item.id ? (
                        <NavIndicator layoutId="masthead-active" />
                      ) : null}
                      {onNavigate ? (
                        <button
                          type="button"
                          aria-current={current === item.id ? 'page' : undefined}
                          onClick={() => onNavigate(item.id)}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <a
                          href={`#${item.id}`}
                          aria-current={current === item.id ? 'page' : undefined}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </LayoutGroup>
            <Pressable
              className="academy-button academy-button--primary academy-masthead__start"
              href="#start"
            >
              Start
            </Pressable>
          </header>
          <div id="academy-main">{children}</div>
        </div>
      </PageScrollProvider>
    </MotionConfig>
  );
}
