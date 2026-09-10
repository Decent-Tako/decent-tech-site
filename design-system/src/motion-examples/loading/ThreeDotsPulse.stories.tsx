import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectLoadingBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { THREE_DOTS_PULSE_DEFAULTS } from './defaults';
import { ThreeDotsPulse } from './ThreeDotsPulse';

const meta = {
  title: 'Motion examples/Loading/Three dots pulse',
  component: ThreeDotsPulse,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-loading-three-dots-pulse in Academy branding.',
          'Mechanism: variants pulse scale [1, 1.5, 1] with repeat Infinity. Parent staggerChildren.',
          'Package motion 13.2.0, licence MIT.',
          'Docs https://motion.dev/docs/react-animation#orchestration .',
          'Example https://motion.dev/examples/react-loading-three-dots-pulse .',
          'Live https://examples.motion.dev/react/loading-three-dots-pulse .',
          'Continuous. Pause and Speed. Caption writes a thank-you.',
        ].join(' '),
      },
    },
  },
  args: {
    ...THREE_DOTS_PULSE_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.4, max: 2.4, step: 0.1 },
      description: 'One pulse in seconds. Upstream default 1.2. This is Speed.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
    },
    scaleTo: {
      control: { type: 'range', min: 1.1, max: 2.2, step: 0.1 },
      description: 'Peak scale. Upstream default 1.5.',
    },
    staggerChildren: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.05 },
    },
    staggerDirection: {
      control: 'select',
      options: [-1, 1],
    },
    ease: {
      control: 'select',
      options: ['easeInOut', 'easeOut', 'linear'],
    },
    count: { control: { type: 'range', min: 2, max: 6, step: 1 } },
    size: { control: { type: 'range', min: 12, max: 36, step: 2 } },
    gap: { control: { type: 'range', min: 8, max: 32, step: 2 } },
    caption: { control: 'text' },
    paused: { control: 'boolean' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof ThreeDotsPulse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Writing a thank-you')).toBeVisible();
    await playPauseLoop(canvas, 'loading-three-dots-pulse');
  },
};

export const LargerPulse: Story = {
  args: {
    ...THREE_DOTS_PULSE_DEFAULTS,
    scaleTo: 2,
    duration: 1.6,
    caption: 'Thank-you after a gift',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Thank-you after a gift')).toBeVisible();
    await playPauseLoop(canvas, 'loading-three-dots-pulse');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...THREE_DOTS_PULSE_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectLoadingBrand(canvas);
    await expect(canvas.getByTestId('loading-three-dots-pulse')).toHaveAttribute(
      'data-running',
      'false',
    );
  },
};
