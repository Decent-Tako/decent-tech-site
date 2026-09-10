import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';

type Canvas = {
  getByRole: (
    role: string,
    options?: { name?: string | RegExp; level?: number },
  ) => HTMLElement;
  getByTestId: (id: string) => HTMLElement;
  getByText: (text: string | RegExp) => HTMLElement;
};

export async function expectTextBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { level: 2 })).toBeVisible();
}

export async function playReplay(canvas: Canvas, testId: string) {
  await expectTextBrand(canvas);
  const root = canvas.getByTestId(testId);
  await expect(root).toHaveAttribute('data-run', '0');
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => {
    expect(root).toHaveAttribute('data-run', '1');
  });
}
