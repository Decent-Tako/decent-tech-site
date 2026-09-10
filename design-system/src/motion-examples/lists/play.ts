import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';

type Canvas = {
  getByRole: (
    role: string,
    options?: { name?: string | RegExp; level?: number },
  ) => HTMLElement;
  getByTestId: (id: string) => HTMLElement;
  getByText: (text: string | RegExp) => HTMLElement;
  getAllByRole: (
    role: string,
    options?: { name?: string | RegExp },
  ) => HTMLElement[];
  queryAllByRole: (role: string) => HTMLElement[];
  queryByRole: (
    role: string,
    options?: { name?: string | RegExp },
  ) => HTMLElement | null;
};

export async function expectListsBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { level: 2 })).toBeVisible();
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

export async function playPauseLoop(canvas: Canvas, testId: string) {
  const root = canvas.getByTestId(testId);
  await expect(root).toHaveAttribute('data-running', 'true');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(canvas.getByTestId(testId)).toHaveAttribute(
    'data-running',
    'false',
  );
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(canvas.getByTestId(testId)).toHaveAttribute(
    'data-running',
    'true',
  );
}

export function firePointer(
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
