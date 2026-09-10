// The site wrapper around the vendored React Bits Infinite Menu. It renders
// the sphere and one real link for the active page. The upstream overlay is
// hidden in menu.css because its button logs internal links instead of
// navigating.
import { useCallback, useEffect, useRef, useState } from 'react';

import InfiniteMenu, {
  type MenuItem,
} from '../motion-examples/vendor/react-bits/infinite-menu/InfiniteMenu';
import { SITE_PAGES, withBase, type SitePage } from './pages';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = (event: MediaQueryListEvent) => setReduce(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduce;
}

const items: MenuItem[] = SITE_PAGES.map((page) => ({
  image: withBase(`/menu/${page.slug}.svg`),
  link: page.path,
  title: page.title,
  description: '',
}));

function pageForItem(item: MenuItem): SitePage {
  return SITE_PAGES.find((page) => page.path === item.link) ?? SITE_PAGES[0];
}

export type SiteMenuProps = {
  /** The stage plate colour, read from the --stage token. */
  backgroundColor?: string;
  /** Called once the WebGL sketch has initialised. */
  onReady: () => void;
};

export function SiteMenu({ backgroundColor, onReady }: SiteMenuProps) {
  const [active, setActive] = useState<SitePage | null>(null);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  // The vendored component owns the canvas. Mark it decorative here.
  useEffect(() => {
    rootRef.current
      ?.querySelector('canvas')
      ?.setAttribute('aria-hidden', 'true');
  }, []);

  const handleActive = useCallback((item: MenuItem) => {
    setActive(pageForItem(item));
  }, []);

  return (
    <div className="menu-sphere" ref={rootRef}>
      <InfiniteMenu
        items={items}
        backgroundColor={backgroundColor}
        inertia={!reduce}
        onInit={onReady}
        onActiveItemChange={handleActive}
      />
      {active ? (
        <a className="menu-overlay" href={active.path}>
          <span
            className="menu-overlay__swatch"
            data-dot={active.token}
            aria-hidden="true"
          />
          <span className="menu-overlay__title">{active.title}</span>
        </a>
      ) : null}
    </div>
  );
}
