import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';

type Canvas = {
  getByRole: (
    role: string,
    options?: { name?: string | RegExp; level?: number },
  ) => HTMLElement;
  getByTestId: (id: string) => HTMLElement;
  getByLabelText: (text: string | RegExp) => HTMLElement;
  getByText: (text: string | RegExp) => HTMLElement;
};

export async function expectFormsBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { level: 2 })).toBeVisible();
}

export async function waitUntilOpaque(element: HTMLElement) {
  await waitFor(() => {
    const styles = getComputedStyle(element);
    expect(Number(styles.opacity)).toBeGreaterThan(0.99);
    const channels = styles.color.match(/\d+/g)?.map(Number) ?? [];
    expect(channels[0] ?? 255).toBeLessThan(80);
  });
}

export async function playReplay(canvas: Canvas, testId: string) {
  const root = canvas.getByTestId(testId);
  await expect(root).toHaveAttribute('data-run', '0');
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => {
    expect(canvas.getByTestId(testId)).toHaveAttribute('data-run', '1');
  });
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
