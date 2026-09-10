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
// arrow key moves the sphere one page along the order of SITE_PAGES, wrapping
// at the ends. Pointer or focus on a list entry turns the sphere to that dot.
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
import { SITE_PAGES, splitPhrase, withBase, type SitePage } from './pages';

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

// One step per this many milliseconds. A trackpad sends many events per
// gesture; the throttle turns them into single discs. A reader who keeps
// scrolling still moves on before the glide of the last step has finished,
// and the new target simply takes over the glide.
const STEP_THROTTLE_MS = 250;

// A wheel event below this many units is the tail of a trackpad gesture, or
// the drift of a free-spinning wheel, not a new turn. Ignoring it keeps one
// gesture to one disc.
const WHEEL_DELTA_FLOOR = 4;

// How often the stage republishes the discs it shows, in milliseconds. The
// Chromium check reads them to click a named disc.
const HIT_POINTS_MS = 1000;

// How long the site waits for the page to leave after the circle covers the
// stage. If the tab comes back and no page followed, the circle was left over
// from a navigation that never happened, and the stage clears it.
const NAVIGATION_GRACE_MS = 2000;

type Expand = { page: SitePage; x: number; y: number };

/** What the last press on the stage became. The stage carries it. */
type LastClick = 'open' | 'turn' | 'miss' | 'drag';

/**
 * True when the browser can run a cross-document view transition. With it the
 * expanding circle is the shared element the page field grows out of, so the
 * browser owns the motion and the site must not also run its own circle.
 * Without it the site runs the circle and then navigates, as before.
 */
function supportsViewTransition(): boolean {
  return (
    typeof document !== 'undefined' &&
    // The value, not the key. A test that takes the feature away by setting
    // it to undefined leaves the key in place, and so would a browser that
    // ships the property without the behaviour.
    typeof (document as Document & { startViewTransition?: unknown })
      .startViewTransition === 'function' &&
    CSS.supports('view-transition-name: x')
  );
}

/** The phrase with its full stop in a span, so CSS can colour the stop. */
function Phrase({ phrase }: { phrase: string }) {
  const { before, after } = splitPhrase(phrase);
  return (
    <>
      {before}
      <span className="wordmark-dot">.</span>
      {after}
    </>
  );
}

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
  // The timer that opens the page once the circle has covered the stage.
  // Cancelling it is how the stage recovers from a navigation that never
  // happened.
  const openTimerRef = useRef(0);
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

  // Open a page. Three paths, and the site runs exactly one of them.
  //
  // 1. Reduced motion: open at once, no circle and no transition.
  // 2. Cross-document view transitions: navigate straight away. The browser
  //    morphs the shared `field` element into the field of the page it opens.
  //    The site must not also grow its own circle, so the circle stays out.
  // 3. No view transitions: grow the circle over the stage, then navigate.
  //    The page still opens on its flat field colour at the far end.
  const open = useCallback((page: SitePage, x: number, y: number) => {
    if (openingRef.current) return;
    openingRef.current = true;
    if (reduceRef.current || supportsViewTransition()) {
      location.assign(page.path);
      return;
    }
    setExpand({ page, x, y });
    openTimerRef.current = window.setTimeout(
      () => location.assign(page.path),
      EXPAND_MS,
    );
  }, []);

  // Put the stage back to rest. The circle goes, the guard lifts, and the
  // timer that would open a page is cancelled.
  const cancelOpen = useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    openingRef.current = false;
    setExpand(null);
  }, []);

  // The stuck screen. The browser keeps this page in the back-forward cache
  // with its DOM as it was, so the back button restores it with the circle
  // still covering the stage and `openingRef` still true. Every later press
  // is then ignored and the screen looks dead.
  //
  // A restore from that cache is a `pageshow` with `persisted` set, so the
  // stage clears itself there. It also clears on `pagehide`, so a page that
  // is put into the cache goes in already at rest, whatever the browser does
  // with `pageshow`.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) cancelOpen();
    };
    const onPageHide = () => cancelOpen();
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [cancelOpen]);

  // The same screen, reached another way. A tab that goes to the background
  // during the expand can have its timer held back, so the page never opens
  // and the circle stays. When the tab comes back, the stage waits out the
  // grace and clears if no page followed.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (!openingRef.current) return;
      window.setTimeout(() => {
        if (openingRef.current) cancelOpen();
      }, NAVIGATION_GRACE_MS);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [cancelOpen]);

  // What the last press on the stage became. The stage carries it, so the
  // Chromium check and a person in devtools can see why a click did nothing.
  const markClick = useCallback((what: LastClick) => {
    rootRef.current?.parentElement?.setAttribute('data-last-click', what);
  }, []);

  // The canvas fills the stage, so a canvas pixel is already a stage pixel.
  //
  // Only a direct press on the centred disc opens its page. A press on any
  // other disc turns the sphere until that disc is the centre. A press on
  // empty stage does nothing at all: the sphere is a menu, not a backdrop
  // that swallows clicks.
  const handleItemClick = useCallback(
    (
      item: MenuItem | null,
      vertexIndex: number,
      point: { x: number; y: number },
      hit: boolean,
    ) => {
      // The drag rule threw the press away; the vendored menu already turned
      // the sphere with it.
      if (item === null) {
        markClick('drag');
        return;
      }
      if (!hit) {
        markClick('miss');
        return;
      }
      const menu = menuRef.current;
      // The centred disc is the one the wordmark names, so a hit on it is the
      // reader asking for that page.
      if (menu && vertexIndex === menu.getCentredVertex()) {
        markClick('open');
        open(pageForItem(item), point.x, point.y);
        return;
      }
      markClick('turn');
      menu?.turnToVertex(vertexIndex);
    },
    [open, markClick],
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
  // A step walks the five pages in the order of SITE_PAGES and wraps at the
  // ends, so the wheel and the arrow keys always visit About, Portfolio,
  // Blog, About Ben, Get in touch, and back. The vendored `step()` walks the
  // vertex order of the sphere instead, which is arbitrary, so the site uses
  // `turnToItem()` for both. The sphere still eases; it never jumps.
  const step = useCallback((direction: 1 | -1) => {
    const now = performance.now();
    if (now - lastStepRef.current < STEP_THROTTLE_MS) return;
    lastStepRef.current = now;
    const count = SITE_PAGES.length;
    const from = SITE_PAGES.indexOf(activeRef.current);
    const next = (((from + direction) % count) + count) % count;
    menuRef.current?.turnToItem(next);
    setSteps((total) => total + 1);
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
      // The page still must not scroll or bounce, whether or not the event
      // goes on to turn the sphere.
      event.preventDefault();
      // A trackpad gesture is a stream of small events. The floor drops the
      // tail of one, and the throttle in `step()` folds the rest into the
      // single disc the reader asked for.
      if (Math.abs(event.deltaY) < WHEEL_DELTA_FLOOR) return;
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

  // The cursor says whether a press would do anything: `pointer` over a disc,
  // `grab` over empty stage, because empty stage is where a drag turns the
  // sphere. The hit test runs at most once a frame, so a fast pointer costs
  // one test per paint and not one per event.
  useEffect(() => {
    const sphere = rootRef.current;
    if (!sphere) return;
    let frame = 0;
    let pending: { x: number; y: number } | null = null;
    const test = () => {
      frame = 0;
      const menu = menuRef.current;
      const at = pending;
      pending = null;
      if (!menu || !at) return;
      const local = menu.toCanvasPoint(at.x, at.y);
      sphere.dataset.overDisc =
        menu.hitTestVertex(local.x, local.y) >= 0 ? 'true' : 'false';
    };
    const onMove = (event: PointerEvent) => {
      pending = { x: event.clientX, y: event.clientY };
      if (frame === 0) frame = requestAnimationFrame(test);
    };
    const onLeave = () => {
      sphere.dataset.overDisc = 'false';
    };
    sphere.addEventListener('pointermove', onMove);
    sphere.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      sphere.removeEventListener('pointermove', onMove);
      sphere.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // The stage publishes the discs it shows, so the Chromium check can click a
  // named one instead of guessing at a coordinate. Once a second is enough:
  // the check reads the list, then clicks.
  useEffect(() => {
    const publish = () => {
      const menu = menuRef.current;
      const stage = rootRef.current?.parentElement;
      if (!menu || !stage) return;
      stage.setAttribute('data-hit-points', JSON.stringify(menu.getHitPoints()));
      // Which of those discs a press would open. It is the vertex nearest the
      // snap direction, which is not always the disc nearest the middle of
      // the stage, so a check cannot work it out from the points alone.
      stage.setAttribute('data-centred-vertex', String(menu.getCentredVertex()));
    };
    publish();
    const timer = window.setInterval(publish, HIT_POINTS_MS);
    return () => window.clearInterval(timer);
  }, []);

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
                <Phrase phrase={leaving} />
              </span>
            )}
            <span
              className="wordmark-phrase__in"
              data-fading={leaving === null ? 'false' : 'true'}
            >
              <Phrase phrase={active.phrase} />
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
                <Phrase phrase={page.phrase} />
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
