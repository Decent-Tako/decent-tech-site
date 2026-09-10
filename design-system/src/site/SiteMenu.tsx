// The site wrapper around the vendored React Bits Infinite Menu. It renders
// three things into #menu-stage: the wordmark in the top left, the list of
// pages on the right, and the sphere behind both. The home page holds the
// same wordmark and the same five links in its own HTML; this component
// replaces them when it mounts, so the markup is the keyboard path and the
// no-WebGL path when the bundle or WebGL is missing.
//
// The wordmark is the only text on the sphere. It reads the phrase of the
// active dot. A change of dot crossfades the phrase in about 250 ms, or swaps
// it at once under reduced motion, and a visually hidden live region mirrors
// it for assistive technology.
//
// A click on a disc, on the wordmark, or on a list entry expands a circle in
// the disc colour from that point and then opens the page. A wheel step or an
// arrow key moves the sphere one disc along. Pointer or focus on a list entry
// turns the sphere to that dot.
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
// stage; a larger value shows more discs. With local change 10 the field of
// view is constant, so the projected diameter of the sphere over the shorter
// side of the viewport is about 2.857 / scale. The sphere must never sit
// whole inside the screen, so the target ratio is above 1.
const MENU_SCALE = 2.1;

// The projected sphere diameter over the shorter viewport side that the site
// wants. Above 1 the sphere is cut by the screen edges at every size.
const BLEED_RATIO = 1.35;

// The constant from local change 10: projected diameter over the shorter side
// is this number divided by the scale.
const BLEED_CONSTANT = 2.857;

// How long the circle takes to cover the viewport, in milliseconds. The same
// number is the transition duration in menu.css.
const EXPAND_MS = 450;

// How long the wordmark takes to fade from one phrase to the next. The same
// number is the transition duration in menu.css.
const FADE_MS = 250;

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

/** The scale that keeps the sphere wider than the shorter viewport side. */
function scaleForViewport(): number {
  return BLEED_CONSTANT / BLEED_RATIO;
}

export type SiteMenuProps = {
  /** The stage plate colour, read from the --stage token. */
  backgroundColor?: string;
  /** Called once the WebGL sketch has initialised. */
  onReady: () => void;
};

export function SiteMenu({ backgroundColor, onReady }: SiteMenuProps) {
  const [active, setActive] = useState<SitePage>(SITE_PAGES[0]);
  // The phrase that fades out while the new one fades in, or null at rest.
  const [leaving, setLeaving] = useState<string | null>(null);
  const [expand, setExpand] = useState<Expand | null>(null);
  const [steps, setSteps] = useState(0);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<InfiniteGridMenu | null>(null);
  // The listeners below read the active page from a ref, so a dot change
  // does not rebuild them.
  const activeRef = useRef(active);
  // True from the first activation until the page leaves. A second click
  // during the expand does nothing.
  const openingRef = useRef(false);
  // Negative infinity, not zero: the first step must never fall inside the
  // throttle window, however soon after load it comes.
  const lastStepRef = useRef(Number.NEGATIVE_INFINITY);
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

  // The vendored menu reports the active item, so the phrase change starts
  // here, in a callback, not in an effect. `leaving` holds the phrase that
  // fades out while the new one fades in; a timer clears it after the fade.
  const fadeTimerRef = useRef(0);
  const handleActive = useCallback((item: MenuItem) => {
    const next = pageForItem(item);
    const current = activeRef.current;
    if (current === next) return;
    activeRef.current = next;
    setActive(next);
    if (reduceRef.current) return;
    setLeaving(current.phrase);
    window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => setLeaving(null), FADE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(fadeTimerRef.current), []);

  const handleInit = useCallback(
    (menu: InfiniteGridMenu) => {
      menuRef.current = menu;
      menu.setScale(scaleForViewport());
      onReady();
    },
    [onReady],
  );

  // The sphere must stay cut by the screen edges at every size, so the scale
  // is computed again after each resize.
  useEffect(() => {
    const onResize = () => menuRef.current?.setScale(scaleForViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Open a page. Under reduced motion the circle is left out.
  const open = useCallback((page: SitePage, x: number, y: number) => {
    if (openingRef.current) return;
    openingRef.current = true;
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

  // A circle that starts at an element outside the stage still needs stage
  // pixels, so the element box is measured against the stage box.
  const centreOf = useCallback((element: HTMLElement) => {
    const stage = rootRef.current?.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    return {
      x: box.left + box.width / 2 - (stage?.left ?? 0),
      y: box.top + box.height / 2 - (stage?.top ?? 0),
    };
  }, []);

  // One disc per call, no faster than the throttle. The stage counts the
  // steps it takes, so the Chromium check can tell a wheel that never
  // arrived from a sphere that did not move.
  const step = useCallback((direction: 1 | -1) => {
    const now = performance.now();
    if (now - lastStepRef.current < STEP_THROTTLE_MS) return;
    lastStepRef.current = now;
    menuRef.current?.step(direction);
    setSteps((count) => count + 1);
  }, []);

  // The stage carries the count, so the Chromium check can tell a wheel that
  // never arrived from a sphere that did not move.
  useEffect(() => {
    rootRef.current?.parentElement?.setAttribute('data-steps', String(steps));
  }, [steps]);

  // The home page itself does not scroll, so the wheel drives the sphere.
  // The listener is not passive; it stops the page from bouncing.
  // The listener sits on the stage, the element the site owns, not on the
  // sphere inside it. A wheel anywhere over the stage turns the sphere.
  useEffect(() => {
    const sphere = rootRef.current;
    if (!sphere) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY === 0) return;
      step(event.deltaY > 0 ? 1 : -1);
    };
    // Both the stage and the sphere inside it. A wheel over the sphere
    // bubbles to the stage, but an event sent straight to the stage never
    // reaches the sphere, and one sent to the sphere is not the stage's.
    const hosts = [sphere.parentElement, sphere].filter(
      (host): host is HTMLElement => host !== null,
    );
    for (const host of hosts) {
      host.addEventListener('wheel', onWheel, { passive: false });
    }
    return () => {
      for (const host of hosts) host.removeEventListener('wheel', onWheel);
    };
  }, [step]);

  // Turn the sphere to a page without opening it. The vendored snap eases the
  // sphere there, so it never jumps.
  const turnTo = useCallback((page: SitePage) => {
    menuRef.current?.turnToItem(SITE_PAGES.indexOf(page));
  }, []);

  const handleWordmarkKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
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
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const centre = centreOf(event.currentTarget);
        open(activeRef.current, centre.x, centre.y);
      }
    },
    [step, centreOf, open],
  );

  const handleWordmarkClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const centre = centreOf(event.currentTarget);
      open(activeRef.current, centre.x, centre.y);
    },
    [centreOf, open],
  );

  const handleEntryClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, page: SitePage) => {
      event.preventDefault();
      const centre = centreOf(event.currentTarget);
      open(page, centre.x, centre.y);
    },
    [centreOf, open],
  );

  return (
    <>
      {/* The wordmark is the only text on the sphere. It reads the phrase of
          the active dot and opens that page through the same expanding
          circle as a disc, from its own centre. */}
      <header className="site-header">
        <a
          className="wordmark"
          href={active.path}
          onClick={handleWordmarkClick}
          onKeyDown={handleWordmarkKeyDown}
        >
          <span className="wordmark-phrase">
            {/* The outgoing phrase lies over the new one and fades out, so
                the two cross while the box keeps the new width. */}
            {leaving === null ? null : (
              <span className="wordmark-phrase__out" aria-hidden="true">
                {leaving}
              </span>
            )}
            <span
              className="wordmark-phrase__in"
              data-fading={leaving === null ? 'false' : 'true'}
            >
              {active.phrase}
            </span>
          </span>
        </a>
        {/* Assistive technology follows the phrase here, not on the link. */}
        <span className="visually-hidden" aria-live="polite">
          {active.phrase}
        </span>
      </header>

      {/* The list of pages on the right. It is the keyboard path and the
          no-WebGL path, so it holds a real link to every page. Pointer or
          focus turns the sphere; a click opens the page. */}
      <nav className="menu-list" aria-label="Site pages">
        <ul>
          {SITE_PAGES.map((page) => (
            <li key={page.slug}>
              <a
                href={page.path}
                aria-current={page === active ? 'page' : undefined}
                onPointerEnter={() => turnTo(page)}
                onFocus={() => turnTo(page)}
                onClick={(event) => handleEntryClick(event, page)}
              >
                <span
                  className="menu-list__dot"
                  data-dot={page.token}
                  aria-hidden="true"
                />
                {page.phrase}
              </a>
            </li>
          ))}
        </ul>
      </nav>

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
        {expand ? (
          <span
            className="menu-expand"
            data-dot={expand.page.token}
            aria-hidden="true"
            style={{ left: `${expand.x}px`, top: `${expand.y}px` }}
          />
        ) : null}
      </div>
    </>
  );
}
