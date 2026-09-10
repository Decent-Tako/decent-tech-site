import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { JUMPING_DOTS_DEFAULTS } from './defaults';
import { JumpingDots } from './JumpingDots';
import { expectLoadingBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Loading/Jumping dots',
  component: JumpingDots,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-loading-jumping-dots in Academy branding.',
          'Mechanism: variants jump translateY with repeat Infinity and repeatType mirror, parent staggerChildren.',
          'Package motion 13.2.0, licence MIT.',
          'Docs https://motion.dev/docs/react-animation#orchestration .',
          'Example https://motion.dev/examples/react-loading-jumping-dots .',
          'Live https://examples.motion.dev/react/loading-jumping-dots .',
          'Continuous. Pause and Speed. Caption waits for Learn + Do.',
        ].join(' '),
      },
    },
  },
  args: {
    ...JUMPING_DOTS_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.3, max: 2, step: 0.1 },
      description: 'One jump in seconds. Upstream default 0.8. This is Speed.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides duration. Default 1.',
    },
    jump: {
      control: { type: 'range', min: -60, max: -8, step: 2 },
      description: 'translateY in pixels. Upstream default -30.',
    },
    staggerChildren: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.05 },
      description: 'Parent stagger. Upstream default -0.2.',
    },
    staggerDirection: {
      control: 'select',
      options: [-1, 1],
      description: 'Upstream default -1.',
    },
    ease: {
      control: 'select',
      options: ['easeInOut', 'easeOut', 'linear'],
    },
    repeatType: {
      control: 'select',
      options: ['mirror', 'reverse', 'loop'],
      description: 'Upstream default mirror.',
    },
    count: {
      control: { type: 'range', min: 2, max: 6, step: 1 },
      description: 'Dot count. Upstream default 3.',
    },
    size: {
      control: { type: 'range', min: 12, max: 36, step: 2 },
    },
    gap: {
      control: { type: 'range', min: 4, max: 24, step: 2 },
    },
    caption: { control: 'text' },
    paused: { control: 'boolean' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof JumpingDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Waiting for Learn + Do')).toBeVisible();
    await playPauseLoop(canvas, 'loading-jumping-dots');
  },
};

export const FiveDots: Story = {
  args: {
    ...JUMPING_DOTS_DEFAULTS,
    count: 5,
    caption: 'Five weeks still closed',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Five weeks still closed')).toBeVisible();
    await playPauseLoop(canvas, 'loading-jumping-dots');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...JUMPING_DOTS_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectLoadingBrand(canvas);
    await expect(canvas.getByTestId('loading-jumping-dots')).toHaveAttribute(
      'data-running',
      'false',
    );
  },
};
