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
  queryByTestId?: (id: string) => HTMLElement | null;
  getAllByRole: (role: string) => HTMLElement[];
};

export async function expectPresenceBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading')).toBeVisible();
  await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
}

export async function waitOpaque(canvas: Canvas, testId: string) {
  await waitFor(
    () => {
      const opacity = Number(getComputedStyle(canvas.getByTestId(testId)).opacity);
      expect(opacity).toBeGreaterThan(0.99);
    },
    { timeout: 2000 },
  );
}

export async function playReplay(canvas: Canvas, testId: string) {
  await expectPresenceBrand(canvas);
  const root = canvas.getByTestId(testId);
  await expect(root).toHaveAttribute('data-run', '0');
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => {
    expect(root).toHaveAttribute('data-run', '1');
  });
}

export async function playPhotos(canvas: Canvas) {
  await expectFullColorPhotos(canvas);
}
