import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';

type Canvas = {
  getByRole: (
    role: string,
    options?: { name?: string | RegExp },
  ) => HTMLElement;
  getByTestId: (id: string) => HTMLElement;
  getByText: (text: string | RegExp) => HTMLElement;
};

export async function expectLoadingBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading')).toBeVisible();
}

export async function playPauseLoop(canvas: Canvas, testId: string) {
  await expectLoadingBrand(canvas);
  const root = canvas.getByTestId(testId);
  await expect(root).toHaveAttribute('data-running', 'true');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(root).toHaveAttribute('data-running', 'false');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(root).toHaveAttribute('data-running', 'true');
}

export async function playReplay(canvas: Canvas, testId: string) {
  await expectLoadingBrand(canvas);
  const root = canvas.getByTestId(testId);
  await expect(root).toHaveAttribute('data-run', '0');
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => {
    expect(root).toHaveAttribute('data-run', '1');
  });
}
