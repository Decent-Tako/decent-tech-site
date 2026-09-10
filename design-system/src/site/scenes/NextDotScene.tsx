// Scroll to the next dot. At the bottom of every page, below the plate, the
// next dot in the cycle rises into view as a disc in its colour with its
// label. The whole site is one loop that echoes the sphere on the home page.
//
// Reaching the bottom of a page never opens anything: it only shows the disc.
// The next page opens on a deliberate push. Once the page is already at its
// bottom, the reader must keep pushing, and the wheel or the touch drag must
// gather more than the disc's own height within 1.5 seconds. A reader who
// simply reads to the end of the page stays where they are.
//
// The disc is a real link in the HTML, so a reader with no script, or with no
// bundle, still reaches the next page, and a keyboard reader tabs to it.
import { useEffect } from 'react';

import type { SceneProps } from '../scenes';

/** The link must be this far into view before the rise finishes. */
const REVEAL_RATIO = 0.6;
/** The push must gather the disc's height inside this long. */
const PUSH_WINDOW_MS = 1500;
/** The page counts as at its bottom inside this many pixels. */
const BOTTOM_SLACK_PX = 1;

/** True while the page is scrolled to its bottom. */
function atBottom(): boolean {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  return scrollable - window.scrollY <= BOTTOM_SLACK_PX;
}

/**
 * Drive the next-dot link. Returns the function that stops the loop and puts
 * back every listener.
 */
function runNextDot(host: HTMLElement, link: HTMLAnchorElement): () => void {
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Under reduced motion the disc is a plain link. It never rises, and no
  // listener is attached, so no push can open the next page.
  if (reduceQuery.matches) {
    host.dataset.nextDot = 'plain';
    return () => {
      delete host.dataset.nextDot;
    };
  }

  let opened = false;
  let frame = 0;
  // The push the reader has gathered at the bottom, and when it last grew.
  let push = 0;
  let pushedAt = 0;
  // Where the last touch was, so a drag can be measured.
  let touchY = 0;

  /** The height of the disc. That is the distance the push must gather. */
  function threshold(): number {
    return link.getBoundingClientRect().height;
  }

  /**
   * Open the next page, once, by the same route a press takes.
   *
   * The site opts the whole navigation into cross-document view transitions
   * with `@view-transition { navigation: auto; }`, so the browser starts one
   * itself for this navigation. A transition started here would be skipped by
   * that one, and the skip is reported as a page error.
   */
  function open() {
    if (opened) return;
    opened = true;
    host.dataset.nextOpen = 'true';
    window.location.assign(link.href);
  }

  /** Add to the push and open once it passes the disc's height. */
  function gather(amount: number) {
    if (opened || amount <= 0) return;
    if (!atBottom()) {
      // The reader left the bottom. The push starts again from nothing.
      push = 0;
      return;
    }
    const now = performance.now();
    // A pause longer than the window ends the push; the reader stopped.
    if (now - pushedAt > PUSH_WINDOW_MS) push = 0;
    pushedAt = now;
    push += amount;
    host.dataset.nextPush = String(Math.round(push));
    if (push >= threshold()) open();
  }

  function onWheel(event: WheelEvent) {
    // Only a push further down the page counts.
    if (event.deltaY > 0) gather(event.deltaY);
  }

  function onTouchStart(event: TouchEvent) {
    touchY = event.touches[0]?.clientY ?? 0;
  }

  function onTouchMove(event: TouchEvent) {
    const y = event.touches[0]?.clientY ?? 0;
    // A drag upward moves the page further down.
    gather(touchY - y);
    touchY = y;
  }

  // The rise. The disc comes up into view as the reader reaches the bottom;
  // this reads the position only and never opens anything.
  function step() {
    frame = 0;
    const box = link.getBoundingClientRect();
    const shown = window.innerHeight - box.top;
    link.dataset.risen = shown >= box.height * REVEAL_RATIO ? 'true' : 'false';
  }

  function onScroll() {
    if (frame === 0) frame = window.requestAnimationFrame(step);
  }

  // The wheel listener is not passive: the push at the bottom is the gesture
  // this scene owns, and the browser must not treat it as an ordinary scroll.
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  step();
  host.dataset.nextDot = 'ready';

  return () => {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    delete link.dataset.risen;
    delete host.dataset.nextDot;
    delete host.dataset.nextPush;
  };
}

export default function NextDotScene({ host, dataset, onReady, onDone }: SceneProps) {
  useEffect(() => {
    const selector = dataset.target ?? '.next-dot__link';
    const link = document.querySelector<HTMLAnchorElement>(selector);
    onReady();
    onDone();
    if (!link) {
      console.warn(`site: next-dot found no link for "${selector}".`);
      return;
    }
    return runNextDot(host, link);
    // The host and the dataset are the mount element; they never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host, onReady, onDone]);
  return null;
}
