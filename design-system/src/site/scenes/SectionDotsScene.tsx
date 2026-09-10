// Sections as dots. On a page that carries `data-effect="section-dots"`, each
// section inside the named host becomes a disc in the page's field colour with
// a short word on it. A press grows a circle out of that disc, the section's
// plate fades in over it, and a close control shrinks it back.
//
// The markup is already whole without this scene. The HTML holds the sections
// with their headings and their copy, so a reader with no script, or with no
// bundle, reads all three at once. The scene only folds them.
//
// There is no route change and no scroll jump. The circle grows from the disc
// the reader pressed, so the motion starts where the eye already is.
import { useEffect } from 'react';

import type { SceneProps } from '../scenes';

/** The circle grows over this long, and shrinks back over the same. */
const GROW_MS = 420;
/** The plate fades in behind the last part of the growth. */
const PLATE_FADE_MS = 260;

/**
 * Fold the sections of `list` into discs. Returns the function that unfolds
 * them and puts back every listener, so the markup ends as the HTML wrote it.
 */
function foldSections(host: HTMLElement, list: HTMLElement): () => void {
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = Array.from(list.querySelectorAll<HTMLElement>('[data-section-dot]'));
  if (sections.length === 0) {
    console.warn('site: section-dots found no [data-section-dot] sections.');
    return () => {};
  }

  const cleanups: Array<() => void> = [];
  let open: HTMLElement | null = null;

  // The circle that grows out of the disc. One element, reused by every
  // section, so the page never holds more than one.
  const circle = document.createElement('div');
  circle.className = 'section-dot__circle';
  circle.setAttribute('aria-hidden', 'true');
  list.appendChild(circle);

  /** Grow the circle from the centre of `disc`, then leave it covering. */
  function growFrom(disc: HTMLElement) {
    if (reduceQuery.matches) return;
    const listBox = list.getBoundingClientRect();
    const box = disc.getBoundingClientRect();
    circle.style.left = `${box.left + box.width / 2 - listBox.left}px`;
    circle.style.top = `${box.top + box.height / 2 - listBox.top}px`;
    circle.dataset.state = 'grow';
    window.setTimeout(() => {
      if (circle.dataset.state === 'grow') delete circle.dataset.state;
    }, GROW_MS + PLATE_FADE_MS);
  }

  function closeSection(section: HTMLElement, moveFocus: boolean) {
    const disc = section.querySelector<HTMLElement>('.section-dot__disc');
    const panel = section.querySelector<HTMLElement>('.section-dot__panel');
    if (!disc || !panel) return;
    section.dataset.open = 'false';
    disc.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    delete circle.dataset.state;
    open = null;
    // The reader pressed Escape or the close control, so the focus goes back
    // to the disc that opened the section. It never falls to the document.
    if (moveFocus) disc.focus();
  }

  function openSection(section: HTMLElement) {
    const disc = section.querySelector<HTMLElement>('.section-dot__disc');
    const panel = section.querySelector<HTMLElement>('.section-dot__panel');
    if (!disc || !panel) return;
    if (open && open !== section) closeSection(open, false);
    growFrom(disc);
    section.dataset.open = 'true';
    disc.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    open = section;
  }

  sections.forEach((section) => {
    const heading = section.querySelector<HTMLElement>('h3');
    const label = section.dataset.sectionDot ?? heading?.textContent?.trim() ?? '';
    const panel = section.querySelector<HTMLElement>('.section-dot__body');
    if (!panel || !heading) {
      console.warn('site: section-dots found a section with no body or heading.');
      return;
    }

    // Wrap the body in the panel the disc opens. The panel keeps the copy in
    // the document order it had, so the reading order never changes.
    const wrapper = document.createElement('div');
    wrapper.className = 'section-dot__panel';
    wrapper.hidden = true;
    panel.parentNode?.insertBefore(wrapper, panel);
    wrapper.appendChild(panel);

    // The disc is a real button, so Enter, Space, and the tab order all work
    // with nothing added. The label is the short word, in the serif with the
    // full stop on its own span, exactly as the running heads read.
    const disc = document.createElement('button');
    disc.type = 'button';
    disc.className = 'section-dot__disc';
    disc.setAttribute('aria-expanded', 'false');
    const panelId = `${section.id || heading.id || 'section'}-panel`;
    wrapper.id = panelId;
    disc.setAttribute('aria-controls', panelId);
    const stop = label.lastIndexOf('.');
    if (stop === label.length - 1 && stop > 0) {
      disc.append(label.slice(0, stop));
      const dot = document.createElement('span');
      dot.className = 'wordmark-dot';
      dot.textContent = '.';
      disc.appendChild(dot);
    } else {
      disc.textContent = label;
    }
    // The heading still names the section for assistive technology, so the
    // disc carries the full heading as its accessible name and the short word
    // stays the visible label.
    disc.setAttribute('aria-label', heading.textContent?.trim() ?? label);
    section.insertBefore(disc, wrapper);

    // The close control: a small disc with an x, in the tab order.
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'section-dot__close';
    close.setAttribute('aria-label', 'Close this section');
    close.textContent = '×';
    wrapper.insertBefore(close, wrapper.firstChild);

    const onDisc = () => {
      if (section.dataset.open === 'true') closeSection(section, true);
      else openSection(section);
    };
    const onClose = () => closeSection(section, true);
    disc.addEventListener('click', onDisc);
    close.addEventListener('click', onClose);

    section.dataset.open = 'false';
    cleanups.push(() => {
      disc.removeEventListener('click', onDisc);
      close.removeEventListener('click', onClose);
      close.remove();
      disc.remove();
      // Put the body back where the HTML had it and drop the wrapper.
      wrapper.parentNode?.insertBefore(panel, wrapper);
      wrapper.remove();
      delete section.dataset.open;
    });
  });

  // Escape closes the section that is open, from anywhere on the page.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation();
      closeSection(open, true);
    }
  };
  document.addEventListener('keydown', onKeyDown);

  // The host says the sections are folded, so the site check and the tests
  // can tell the folded page from the plain markup.
  host.dataset.sections = String(sections.length);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
    cleanups.forEach((undo) => undo());
    circle.remove();
    delete host.dataset.sections;
  };
}

export default function SectionDotsScene({ host, dataset, onReady, onDone }: SceneProps) {
  useEffect(() => {
    const selector = dataset.target ?? '.service-grid';
    const list = document.querySelector<HTMLElement>(selector);
    onReady();
    onDone();
    if (!list) {
      console.warn(`site: section-dots found no list for "${selector}".`);
      return;
    }
    return foldSections(host, list);
    // The host and the dataset are the mount element; they never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host, onReady, onDone]);
  return null;
}
