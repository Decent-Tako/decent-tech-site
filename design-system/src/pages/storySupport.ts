import { expect } from 'storybook/test';

export async function expectLiveWordmark(
  canvas: {
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
  },
  name = 'Uncomfortable Academy home',
) {
  const mark = canvas.getByRole('link', { name });
  await expect(mark.querySelector('img')).toBeNull();
  await expect(mark).toHaveTextContent('Uncomfortable');
  await expect(mark).toHaveTextContent('Academy');
}

export function effectiveOpacity(el: HTMLElement) {
  let opacity = 1;
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    opacity *= Number(getComputedStyle(node).opacity);
    if (opacity < 0.99) return opacity;
  }
  return opacity;
}

export async function expectFullColorPhotos(canvas: {
  getAllByRole: (role: string) => HTMLElement[];
}) {
  const images = canvas.getAllByRole('img');
  for (const image of images) {
    if (!image.hasAttribute('data-photo')) continue;
    await expect(getComputedStyle(image).filter).toBe('none');
    await expect(getComputedStyle(image).mixBlendMode).toBe('normal');
  }
}

function firePointer(
  target: EventTarget,
  type: string,
  init: PointerEventInit,
) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      bubbles: true,
      cancelable: true,
      view: window,
      ...init,
    }),
  );
}

export async function pointerDrag(
  element: HTMLElement,
  deltaX: number,
  deltaY: number,
  during?: () => Promise<void> | void,
) {
  const box = element.getBoundingClientRect();
  const startX = box.left + box.width / 2;
  const startY = box.top + box.height / 2;

  firePointer(element, 'pointerdown', {
    clientX: startX,
    clientY: startY,
    buttons: 1,
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  firePointer(window, 'pointermove', {
    clientX: startX + deltaX,
    clientY: startY + deltaY,
    buttons: 1,
  });
  firePointer(document, 'pointermove', {
    clientX: startX + deltaX,
    clientY: startY + deltaY,
    buttons: 1,
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  if (during) await during();
  firePointer(window, 'pointerup', {
    clientX: startX + deltaX,
    clientY: startY + deltaY,
    buttons: 0,
  });
  firePointer(document, 'pointerup', {
    clientX: startX + deltaX,
    clientY: startY + deltaY,
    buttons: 0,
  });
}
