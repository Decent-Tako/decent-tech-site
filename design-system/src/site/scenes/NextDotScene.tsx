// Scroll to the next dot. At the bottom of every page, below the plate, the
// next dot in the cycle rises into view as a disc in its colour with its
// label. A scroll of the disc's own height past the bottom opens that page, and
// so does a press on the disc. The whole site is one loop that echoes the
// sphere on the home page.
//
// The disc is a real link in the HTML, so a reader with no script, or with no
// bundle, still reaches the next page. The scene only adds the rise and the
// scroll threshold.
import { useEffect } from 'react';

import type { SceneProps } from '../scenes';

/** The link must be this far into view before the rise finishes. */
const REVEAL_RATIO = 0.6;

/**
 * Drive the next-dot link. Returns the function that stops the loop and puts
 * back every listener.
 */
function runNextDot(host: HTMLElement, link: HTMLElement): () => void {
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Under reduced motion the disc is a plain link. It never rises and a
  // scroll past it never opens the page on its own.
  if (reduceQuery.matches) {
    host.dataset.nextDot = 'plain';
    return () => {
      delete host.dataset.nextDot;
    };
  }

  let opened = false;
  let frame = 0;

  /** True once the reader has scrolled the disc's own height past the bottom. */
  function scrolledPast(): boolean {
    const box = link.getBoundingClientRect();
    // How far the bottom of the disc has travelled above the bottom of the
    // viewport. The page carries a disc's height of room below the disc, so
    // this can reach the disc's own height, which is the threshold.
    const past = window.innerHeight - box.bottom;
    return past >= box.height;
  }

  function step() {
    frame = 0;
    const box = link.getBoundingClientRect();
    const shown = window.innerHeight - box.top;
    const risen = shown >= box.height * REVEAL_RATIO;
    link.dataset.risen = risen ? 'true' : 'false';
    if (!opened && scrolledPast()) {
      opened = true;
      host.dataset.nextDot = 'opening';
      // A real click, so the site takes the same path a press takes: the
      // cross-document view transition where the browser has it, and a plain
      // navigation where it does not.
      link.click();
    }
  }

  function onScroll() {
    if (frame === 0) frame = window.requestAnimationFrame(step);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  step();
  host.dataset.nextDot = 'ready';

  return () => {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    delete link.dataset.risen;
    delete host.dataset.nextDot;
  };
}

export default function NextDotScene({ host, dataset, onReady, onDone }: SceneProps) {
  useEffect(() => {
    const selector = dataset.target ?? '.next-dot__link';
    const link = document.querySelector<HTMLElement>(selector);
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
