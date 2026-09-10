// The site wrapper around the vendored React Bits Infinite Menu. It renders
// the sphere and one real link for the active page. The upstream overlay is
// hidden in menu.css because its button logs internal links instead of
// navigating.
//
// Three site behaviours sit on top of the sphere. The sphere starts on the
// gold disc (About). A click on a disc, or activation of the pill, expands a
// circle in the disc colour over the stage and then opens the page. A wheel
// step or an arrow key moves the sphere one disc along.
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';

import InfiniteMenu, {
  type InfiniteGridMenu,
  type MenuItem,
} from '../motion-examples/vendor/react-bits/infinite-menu/InfiniteMenu';
import { SITE_PAGES, withBase, type SitePage } from './pages';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// How much of the sphere the resting view shows. At 1 one disc fills the
// stage; at 2.4 about a dozen discs are in the frame at 1280 by 800, with
// the five colours repeating across the sphere. Tuned from the CI shots.
const MENU_SCALE = 2.4;

// How long the circle takes to cover the viewport, in milliseconds. The same
// number is the transition duration in menu.css.
const EXPAND_MS = 450;

// One wheel step per this many milliseconds. A trackpad sends many events per
// gesture; the throttle turns them into single discs.
const STEP_THROTTLE_MS = 300;

type Expand = { page: SitePage; x: number; y: number };

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
  const [expand, setExpand] = useState<Expand | null>(null);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<InfiniteGridMenu | null>(null);
  // True from the first activation until the page leaves. A second click
  // during the expand does nothing.
  const leavingRef = useRef(false);
  const lastStepRef = useRef(0);
  const reduceRef = useRef(reduce);

  useEffect(() => {
    reduceRef.current = reduce;
  }, [reduce]);

  // The vendored component owns the canvas. Mark it decorative here.
  useEffect(() => {
    rootRef.current
      ?.querySelector('canvas')
      ?.setAttribute('aria-hidden', 'true');
  }, []);

  const handleActive = useCallback((item: MenuItem) => {
    setActive(pageForItem(item));
  }, []);

  const handleInit = useCallback(
    (menu: InfiniteGridMenu) => {
      menuRef.current = menu;
      onReady();
    },
    [onReady],
  );

  // Open a page. Under reduced motion the circle is left out.
  const open = useCallback((page: SitePage, x: number, y: number) => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    if (reduceRef.current) {
      location.assign(page.path);
      return;
    }
    setExpand({ page, x, y });
    window.setTimeout(() => location.assign(page.path), EXPAND_MS);
  }, []);

  // The canvas fills the stage, so a canvas pixel is already a stage pixel.
  const handleItemClick = useCallback(
    (item: MenuItem, _vertexIndex: number, point: { x: number; y: number }) => {
      open(pageForItem(item), point.x, point.y);
    },
    [open],
  );

  // The pill circle starts at the centre of the pill, in stage pixels.
  const centreOf = (element: HTMLElement) => {
    const stage = rootRef.current?.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    return {
      x: box.left + box.width / 2 - (stage?.left ?? 0),
      y: box.top + box.height / 2 - (stage?.top ?? 0),
    };
  };

  // One disc per call, no faster than the throttle.
  const step = useCallback((direction: 1 | -1) => {
    const now = performance.now();
    if (now - lastStepRef.current < STEP_THROTTLE_MS) return;
    lastStepRef.current = now;
    menuRef.current?.step(direction);
  }, []);

  // The home page itself does not scroll, so the wheel drives the sphere.
  // The listener is not passive; it stops the page from bouncing.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY === 0) return;
      step(event.deltaY > 0 ? 1 : -1);
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, [step]);

  const handlePillKeyDown = (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
      return;
    }
    // Enter and Space open the page the same way a disc does. The browser
    // would follow the link, so the expand takes the event first.
    if ((event.key === 'Enter' || event.key === ' ') && active) {
      event.preventDefault();
      const centre = centreOf(event.currentTarget);
      open(active, centre.x, centre.y);
    }
  };

  const handlePillClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!active) return;
    event.preventDefault();
    const centre = centreOf(event.currentTarget);
    open(active, centre.x, centre.y);
  };

  return (
    <div className="menu-sphere" ref={rootRef}>
      <InfiniteMenu
        items={items}
        scale={MENU_SCALE}
        backgroundColor={backgroundColor}
        inertia={!reduce}
        onInit={handleInit}
        onActiveItemChange={handleActive}
        onItemClick={handleItemClick}
      />
      {active ? (
        <a
          className="menu-overlay"
          href={active.path}
          onClick={handlePillClick}
          onKeyDown={handlePillKeyDown}
        >
          <span
            className="menu-overlay__swatch"
            data-dot={active.token}
            aria-hidden="true"
          />
          <span className="menu-overlay__title">{active.title}</span>
        </a>
      ) : null}
      {expand ? (
        <span
          className="menu-expand"
          data-dot={expand.page.token}
          aria-hidden="true"
          style={{ left: `${expand.x}px`, top: `${expand.y}px` }}
        />
      ) : null}
    </div>
  );
}
