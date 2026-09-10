import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { HeroPage } from './HeroPage';
import {
  effectiveOpacity,
  expectFullColorPhotos,
  expectLiveWordmark,
} from './storySupport';

const meta = {
  title: 'Pages/Hero',
  component: HeroPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Package `motion` 13.2.0. Licence MIT. Rebuild of Motion Scroll Zoom Hero plus whileInView stagger. Docs https://motion.dev/docs/react-scroll-animations . Example https://motion.dev/examples/react-scroll-zoom-hero . Wordmark stays static. Photographs stay full colour.',
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof HeroPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expectLiveWordmark(canvas);
    await waitFor(() => {
      expect(canvas.getByRole('heading', { level: 1 })).toBeVisible();
    });
    await waitFor(() => {
      const start = canvas.getByRole('link', { name: /Start week 0/ });
      expect(start).toBeVisible();
      expect(effectiveOpacity(start)).toBe(1);
      expect(getComputedStyle(start).color).toBe('rgb(33, 33, 33)');
    });
    const title = canvas.getByRole('heading', { level: 1 });
    const lead = title.querySelector('.wordmark__lead') as HTMLElement | null;
    await expect(lead).not.toBeNull();
    await expect(effectiveOpacity(lead!)).toBe(1);
    await expect(getComputedStyle(title).backgroundColor).toBe('rgb(33, 33, 33)');
    await expect(getComputedStyle(title).color).toBe('rgb(255, 255, 255)');
    await expect(getComputedStyle(lead!).color).toBe('rgb(255, 255, 255)');
    const titleBox = title.getBoundingClientRect();
    const leadBox = lead!.getBoundingClientRect();
    await expect(leadBox.width).toBeGreaterThan(80);
    await expect(leadBox.height).toBeGreaterThan(24);
    await expect(leadBox.left).toBeGreaterThanOrEqual(titleBox.left - 1);
    await expect(leadBox.top).toBeGreaterThanOrEqual(titleBox.top - 1);
    await expect(leadBox.bottom).toBeLessThanOrEqual(titleBox.bottom + 1);
    await expectFullColorPhotos(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { reducedMotion: 'always' },
  play: async ({ canvas }) => {
    const title = canvas.getByRole('heading', { level: 1 });
    await expect(title).toBeVisible();
    await expect(getComputedStyle(title).opacity).not.toBe('0');
    await expectFullColorPhotos(canvas);
  },
};
