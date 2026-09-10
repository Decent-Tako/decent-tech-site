import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../brand/fontFallback';
import { ArticlePage } from './ArticlePage';
import {
  effectiveOpacity,
  expectFullColorPhotos,
  expectLiveWordmark,
} from './storySupport';

const meta = {
  title: 'Pages/Article',
  component: ArticlePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Package `motion` 13.2.0. Licence MIT. Rebuild of Motion scroll-linked progress and scroll-triggered section reveals. Docs https://motion.dev/docs/react-scroll-animations . Examples https://motion.dev/examples/react-scroll-linked and https://motion.dev/examples/react-scroll-hide-header .',
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ArticlePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expectLiveWordmark(canvas);
    await expect(
      canvas.getByRole('heading', { name: 'Set up before the first session.' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('progressbar', { name: 'Reading progress' }),
    ).toBeVisible();
    const body = canvasElement.querySelector('.academy-article__body');
    await expect(body).toHaveClass('prose');
    await expect(body).toHaveClass('prose-academy');
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const paragraph = canvas.getByText(
      /The Uncomfortable Academy is a mental challenge beside the physical one./,
    );
    await expect(getComputedStyle(paragraph).fontFamily).toMatch(/Brand Sans/);
    await waitFor(() => {
      expect(effectiveOpacity(paragraph)).toBe(1);
      expect(getComputedStyle(paragraph).color).toBe('rgb(33, 33, 33)');
    });
    await expectFullColorPhotos(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Set up before the first session.' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'What this week is for' }),
    ).toBeVisible();
    await expectFullColorPhotos(canvas);
  },
};
