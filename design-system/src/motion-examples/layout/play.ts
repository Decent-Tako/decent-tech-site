import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';

type Canvas = {
  getByRole: (
    role: string,
    options?: { name?: string | RegExp },
  ) => HTMLElement;
  getByTestId: (id: string) => HTMLElement;
  getByText: (text: string | RegExp) => HTMLElement;
  getAllByRole: (role: string) => HTMLElement[];
  queryAllByRole: (role: string) => HTMLElement[];
};

export async function expectLayoutBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading')).toBeVisible();
  if (canvas.queryAllByRole('img').length > 0) {
    await expectFullColorPhotos(canvas);
  }
}

export async function playReplay(canvas: Canvas, testId: string) {
  const root = canvas.getByTestId(testId);
  await expect(root).toHaveAttribute('data-run', '0');
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => {
    expect(canvas.getByTestId(testId)).toHaveAttribute('data-run', '1');
  });
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
