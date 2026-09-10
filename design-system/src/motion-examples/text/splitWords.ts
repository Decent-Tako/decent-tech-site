export function splitWords(element: HTMLElement): { words: HTMLElement[] } {
  const text = element.textContent ?? '';
  element.setAttribute('aria-label', text.trim());
  const parts = text.split(/(\s+)/);
  element.replaceChildren();
  const words: HTMLElement[] = [];

  for (const part of parts) {
    if (part === '') continue;
    if (/^\s+$/.test(part)) {
      element.append(part);
      continue;
    }

    const span = document.createElement('span');
    span.className = 'split-word';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = part;
    element.append(span);
    words.push(span);
  }

  return { words };
}
