import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectLoadingBrand, playPauseLoop } from './play';
import { RIPPLE_DEFAULTS } from './defaults';
import { Ripple } from './Ripple';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Loading/Ripple',
  component: Ripple,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-loading-ripple in Academy branding.',
          'The article page now marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: scale(0)→scale(1) and opacity 1→0, repeat Infinity, ease easeOut, staggered delay.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation .',
          'Example https://motion.dev/examples/react-loading-ripple .',
          'Live https://examples.motion.dev/react/loading-ripple .',
          'Continuous. Pause and Speed. Caption publishes the fundraising page.',
        ].join(' '),
      },
    },
  },
  args: {
    ...RIPPLE_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.6, max: 4, step: 0.1 },
      description: 'One ripple in seconds. Upstream default 2. This is Speed.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
    },
    delayStep: {
      control: { type: 'range', min: 0.1, max: 1.2, step: 0.05 },
      description: 'Delay between rings. Upstream 0, 0.5, 1.',
    },
    count: { control: { type: 'range', min: 1, max: 6, step: 1 } },
    size: {
      control: { type: 'range', min: 60, max: 180, step: 4 },
      description: 'Box size in pixels. Upstream default 100.',
    },
    borderWidth: { control: { type: 'range', min: 2, max: 10, step: 1 } },
    ease: {
      control: 'select',
      options: ['easeOut', 'easeInOut', 'linear'],
    },
    caption: { control: 'text' },
    paused: { control: 'boolean' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof Ripple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Publishing your page')).toBeVisible();
    await playPauseLoop(canvas, 'loading-ripple');
  },
};

export const TightDelay: Story = {
  args: {
    ...RIPPLE_DEFAULTS,
    delayStep: 0.2,
    duration: 1.2,
    caption: 'Page going live',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Page going live')).toBeVisible();
    await playPauseLoop(canvas, 'loading-ripple');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...RIPPLE_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectLoadingBrand(canvas);
    await expect(canvas.getByTestId('loading-ripple')).toHaveAttribute(
      'data-running',
      'false',
    );
  },
};
