// Get in touch page: the contact form is magnetic. While the pointer is on
// the page and away from the form, the form drifts toward the pointer. The
// moment the reader means to use the form, it holds still.
//
// The scene renders nothing. Its host is an empty element next to the form,
// because the site entry mounts a React root into the host and a root
// replaces the children of its element. The host names the wrapper it moves
// with data-target, so the form markup stays exactly as the HTML wrote it.
//
// The scene moves the wrapper with a transform only. It never changes the
// layout, the field order, the tab order, or the focus.
import { useEffect } from 'react';

import type { SceneProps } from '../scenes';
import { number } from '../sceneSupport';

/** The pointer must come this near the form, in pixels, before it holds. */
const HOLD_MARGIN_PX = 24;
/** Below this viewport width the form never moves. */
const NARROW_VIEWPORT_PX = 720;
/** The part of the viewport the form may travel from its resting place. */
const TRAVEL_FRACTION = 0.4;
/** The part of the distance the form closes each frame. */
const FOLLOW_PER_FRAME = 0.08;
/** The form is at rest again below this distance, in pixels. */
const AT_REST_PX = 0.5;
/** The ease back to the resting place after the reader types. */
const RETURN_MS = 300;

type Point = { x: number; y: number };

/**
 * Drive the wrapper. Returns the function that stops the loop and puts back
 * every listener and the transform.
 */
function runMagnet(host: HTMLElement, wrapper: HTMLElement, follow: number): () => void {
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  // The offset the form shows now, and the offset it moves toward.
  const shown: Point = { x: 0, y: 0 };
  const wanted: Point = { x: 0, y: 0 };
  let pointer: Point | null = null;
  // True once the reader has typed in any field. It stays true for the visit.
  let typed = false;
  // True while a pointer that is not a mouse was the last one seen.
  let coarsePointer = false;
  let frame = 0;
  let returning = false;

  const isNarrow = () => window.innerWidth < NARROW_VIEWPORT_PX;

  // True when the pointer is inside the form plus the hold margin. The
  // rectangle is the one the reader sees, so it already holds the offset.
  function pointerIsOnTheForm(): boolean {
    if (!pointer) return false;
    const box = wrapper.getBoundingClientRect();
    return (
      pointer.x >= box.left - HOLD_MARGIN_PX &&
      pointer.x <= box.right + HOLD_MARGIN_PX &&
      pointer.y >= box.top - HOLD_MARGIN_PX &&
      pointer.y <= box.bottom + HOLD_MARGIN_PX
    );
  }

  function hasFocus(): boolean {
    const active = document.activeElement;
    return active instanceof HTMLElement && wrapper.contains(active);
  }

  /** True when the form must hold still. Any one reason is enough. */
  function holds(): boolean {
    return (
      typed ||
      coarsePointer ||
      isNarrow() ||
      reduceQuery.matches ||
      pointer === null ||
      hasFocus() ||
      pointerIsOnTheForm()
    );
  }

  function write() {
    if (Math.abs(shown.x) < AT_REST_PX && Math.abs(shown.y) < AT_REST_PX) {
      wrapper.style.transform = '';
      host.dataset.offset = '0,0';
      return;
    }
    wrapper.style.transform = `translate3d(${shown.x.toFixed(2)}px, ${shown.y.toFixed(2)}px, 0)`;
    host.dataset.offset = `${shown.x.toFixed(1)},${shown.y.toFixed(1)}`;
  }

  /** The offset the pointer asks for, capped so the form stays on screen. */
  function aim() {
    if (!pointer) return;
    // The resting rectangle is the one on screen less the offset it shows.
    const box = wrapper.getBoundingClientRect();
    const restCentre = {
      x: box.left + box.width / 2 - shown.x,
      y: box.top + box.height / 2 - shown.y,
    };
    const capX = window.innerWidth * TRAVEL_FRACTION;
    const capY = window.innerHeight * TRAVEL_FRACTION;
    // The form never leaves the viewport: the resting rectangle plus the
    // offset must keep its edges inside the window.
    const restLeft = box.left - shown.x;
    const restTop = box.top - shown.y;
    const minX = Math.max(-capX, -restLeft);
    const maxX = Math.min(capX, window.innerWidth - (restLeft + box.width));
    const minY = Math.max(-capY, -restTop);
    const maxY = Math.min(capY, window.innerHeight - (restTop + box.height));
    wanted.x = Math.min(Math.max(pointer.x - restCentre.x, minX), Math.max(minX, maxX));
    wanted.y = Math.min(Math.max(pointer.y - restCentre.y, minY), Math.max(minY, maxY));
  }

  function step() {
    frame = 0;
    if (holds()) {
      // A hold keeps the offset the form has now. Nothing moves.
      if (typed && !returning) {
        // The reader has typed. Ease back to the resting place, once.
        returning = true;
        wrapper.style.transition = `transform ${RETURN_MS}ms ease`;
        shown.x = 0;
        shown.y = 0;
        write();
        // The ease ends on transitionend. A timer can fire while the
        // compositor still shows a frame of the ease, and the site check then
        // reads a matrix that is not the resting place. The timer below is
        // only the fallback for a browser that sends no event, and it waits
        // longer than the ease.
        const settle = () => {
          wrapper.removeEventListener('transitionend', settle);
          wrapper.style.transition = '';
          // Clear the inline transform in the same frame as the flag. While
          // the ease runs, the computed transform is a matrix of the frame
          // the compositor shows. The flag must never go up before that
          // matrix is gone, or the site check reads the ease and not the
          // resting place.
          wrapper.style.transform = '';
          host.dataset.offset = '0,0';
          // The form is at rest and holds there for the rest of the visit.
          // The site check waits for this before it reads the transform.
          host.dataset.atRest = 'true';
        };
        wrapper.addEventListener('transitionend', settle);
        window.setTimeout(settle, RETURN_MS * 2);
      }
      return;
    }
    aim();
    shown.x += (wanted.x - shown.x) * follow;
    shown.y += (wanted.y - shown.y) * follow;
    write();
    frame = window.requestAnimationFrame(step);
  }

  function wake() {
    if (frame === 0 && !holds()) frame = window.requestAnimationFrame(step);
  }

  function onPointerMove(event: PointerEvent) {
    coarsePointer = event.pointerType !== 'mouse';
    pointer = { x: event.clientX, y: event.clientY };
    wake();
  }

  function onPointerLeave() {
    pointer = null;
  }

  function onInput() {
    typed = true;
    host.dataset.typed = 'true';
    step();
  }

  function onFocusIn(event: FocusEvent) {
    if (event.target instanceof Node && wrapper.contains(event.target)) step();
  }

  function onKeyDown(event: KeyboardEvent) {
    // The first Tab into the page is a keyboard reader. Freeze at once.
    if (event.key === 'Tab') {
      typed = true;
      host.dataset.typed = 'true';
      step();
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('keydown', onKeyDown, true);
  wrapper.addEventListener('input', onInput);
  document.addEventListener('focusin', onFocusIn);

  return () => {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('blur', onPointerLeave);
    window.removeEventListener('keydown', onKeyDown, true);
    wrapper.removeEventListener('input', onInput);
    document.removeEventListener('focusin', onFocusIn);
    wrapper.style.transform = '';
    wrapper.style.transition = '';
  };
}

export default function MagneticFormScene({ host, dataset, onReady, onDone }: SceneProps) {
  useEffect(() => {
    const selector = dataset.target ?? '.contact-form';
    const wrapper = document.querySelector<HTMLElement>(selector);
    onReady();
    onDone();
    if (!wrapper) {
      console.warn(`site: magnetic-form found no wrapper for "${selector}".`);
      return;
    }
    const follow = number(dataset.follow, FOLLOW_PER_FRAME);
    return runMagnet(host, wrapper, follow);
    // The host and the dataset are the mount element; they never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host, onReady, onDone]);
  return null;
}
