import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectLoadingBrand, playReplay } from './play';
import { PROGRESS_BAR_DEFAULTS } from './defaults';
import { ProgressBar } from './ProgressBar';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Loading/Progress bar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-loading-progress-bar in Academy branding.',
          'The article page now marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: useSpring progress bound to scaleX. transform-origin 0% 50%.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-spring .',
          'Example https://motion.dev/examples/react-loading-progress-bar .',
          'Live https://examples.motion.dev/react/loading-progress-bar .',
          'One-shot. Replay remounts the spring. Caption is raised toward $3,000.',
        ].join(' '),
      },
    },
  },
  args: {
    ...PROGRESS_BAR_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    intervalMs: {
      control: { type: 'range', min: 120, max: 1000, step: 20 },
      description: 'Mock load tick in milliseconds. Upstream default 500.',
    },
    increment: {
      control: { type: 'range', min: 0.05, max: 0.6, step: 0.05 },
      description: 'Max random add per tick. Upstream default 0.2.',
    },
    trackWidth: {
      control: { type: 'range', min: 160, max: 400, step: 10 },
      description: 'Track max-width in pixels. Upstream default 300.',
    },
    trackHeight: {
      control: { type: 'range', min: 6, max: 20, step: 1 },
      description: 'Track height in pixels. Upstream default 10.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText(/Raised toward \$3,000/)).toBeVisible();
    await waitFor(
      () => {
        const progress = Number(
          canvas.getByRole('progressbar').getAttribute('data-progress'),
        );
        expect(progress).toBeGreaterThan(0);
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'loading-progress-bar');
  },
};

export const FastTicks: Story = {
  args: {
    ...PROGRESS_BAR_DEFAULTS,
    intervalMs: 160,
    increment: 0.45,
    caption: 'Fast raise toward $3,000',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Fast raise toward \$3,000/)).toBeVisible();
    await playReplay(canvas, 'loading-progress-bar');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...PROGRESS_BAR_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectLoadingBrand(canvas);
    await expect(canvas.getByRole('progressbar')).toHaveAttribute(
      'data-progress',
      '1.00',
    );
    await expect(canvas.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
  },
};
