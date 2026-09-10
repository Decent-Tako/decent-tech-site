import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { InfiniteLoading } from './InfiniteLoading';
import { expectListsBrand, playPauseLoop, playReplay } from './play';
import {
  INFINITE_LOADING_DEFAULTS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Infinite loading',
  component: InfiniteLoading,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-infinite-loading in Academy branding.',
          'The article page marks this example plus:true and prints a stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: stagger(delayChildren) on list variants. Articles fade and rise. Spinner rotate 360 repeat Infinity. onViewportEnter loads the next batch.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation#orchestration .',
          'Example https://motion.dev/examples/react-infinite-loading .',
          'Live https://examples.motion.dev/react/infinite-loading .',
          'Chunk https://examples.motion.dev/assets/index-ZybWaoTb.js .',
          'Spinner is continuous, so Pause and Speed. Replay resets the list.',
        ].join(' '),
      },
    },
  },
  args: {
    ...INFINITE_LOADING_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    staggerDelay: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
      description: 'stagger() delay between articles. Upstream default 0.2.',
    },
    itemY: {
      control: { type: 'range', min: 0, max: 60, step: 2 },
      description: 'hidden y offset in pixels. Upstream default 20.',
    },
    itemDuration: {
      control: { type: 'range', min: 0.1, max: 1.2, step: 0.05 },
      description: 'Article enter duration. Upstream default 0.4.',
    },
    spinnerDuration: {
      control: { type: 'range', min: 0.4, max: 4, step: 0.1 },
      description: 'One spinner turn in seconds. Upstream default 1.5. This is Speed.',
    },
    batchSize: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      description: 'Items per fetch. Upstream default 3.',
    },
    fetchDelay: {
      control: { type: 'range', min: 200, max: 2000, step: 100 },
      description: 'Simulated fetch delay in milliseconds. Upstream 1000.',
    },
    paused: { control: 'boolean' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof InfiniteLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectListsBrand(canvas);
    await waitFor(() => {
      const heading = canvas.getByText(/Week 0 is Set Up/);
      const list = heading.closest('.lists-news');
      expect(list).not.toBeNull();
      const items = Array.from(
        (list as HTMLElement).querySelectorAll<HTMLElement>('.lists-news__item'),
      );
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(Number(getComputedStyle(item).opacity)).toBeGreaterThan(0.99);
      }
    });
    await playPauseLoop(canvas, 'infinite-loading');
    await playReplay(canvas, 'infinite-loading');
    await waitFor(() => {
      const heading = canvas.getByText(/Week 0 is Set Up/);
      const list = heading.closest('.lists-news');
      expect(list).not.toBeNull();
      const items = Array.from(
        (list as HTMLElement).querySelectorAll<HTMLElement>('.lists-news__item'),
      );
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(Number(getComputedStyle(item).opacity)).toBeGreaterThan(0.99);
      }
    });
  },
};

export const TightStagger: Story = {
  args: {
    ...INFINITE_LOADING_DEFAULTS,
    staggerDelay: 0.05,
    itemDuration: 0.2,
    fetchDelay: 400,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Academy notes')).toBeVisible();
    await waitFor(() => {
      const heading = canvas.getByText(/Week 0 is Set Up/);
      const list = heading.closest('.lists-news');
      expect(list).not.toBeNull();
      const items = Array.from(
        (list as HTMLElement).querySelectorAll<HTMLElement>('.lists-news__item'),
      );
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(Number(getComputedStyle(item).opacity)).toBeGreaterThan(0.99);
      }
    });
    await playPauseLoop(canvas, 'infinite-loading');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...INFINITE_LOADING_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectListsBrand(canvas);
    await expect(canvas.getByTestId('infinite-loading')).toHaveAttribute(
      'data-running',
      'false',
    );
  },
};
