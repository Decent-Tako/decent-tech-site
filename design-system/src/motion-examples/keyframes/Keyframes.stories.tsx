import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { KEYFRAMES_DEFAULTS } from './defaults';
import { Keyframes } from './Keyframes';
import { expectKeyframeBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS, TWEEN_EASES } from './source';

const meta = {
  title: 'Motion examples/Keyframes',
  component: Keyframes,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-keyframes in Academy branding.',
          'The upstream demo exports no props. Controls lift duration, scale, rotate, and repeatDelay.',
          'Mechanism: animate keyframe arrays on scale, rotate, and borderRadius, with times, repeat Infinity, and repeatDelay 1.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation#keyframes .',
          'Example https://motion.dev/examples/react-keyframes .',
          'Live https://examples.motion.dev/react/keyframes .',
          'Continuous. Pause and Speed. Caption is Goal $3,000.',
        ].join(' '),
      },
    },
  },
  args: {
    ...KEYFRAMES_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.4, max: 4, step: 0.1 },
      description: 'One cycle in seconds. Upstream default 2. This is Speed.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides duration. Upstream has no speed; default 1.',
    },
    scaleTo: {
      control: { type: 'range', min: 1, max: 2.4, step: 0.1 },
      description: 'Peak scale. Upstream default 2.',
    },
    rotateTo: {
      control: { type: 'range', min: 0, max: 360, step: 15 },
      description: 'Peak rotate in degrees. Upstream default 180.',
    },
    repeatDelay: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: 'Pause between loops in seconds. Upstream default 1.',
    },
    ease: {
      control: 'select',
      options: [...TWEEN_EASES],
      description: 'Keyframe ease. Upstream easeInOut.',
    },
    size: {
      control: { type: 'range', min: 72, max: 140, step: 4 },
      description: 'Box size in pixels. Upstream default 100.',
    },
    caption: { control: 'text' },
    paused: {
      control: 'boolean',
      description: 'Stop the loop. Continuous loops use Pause, not Replay.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof Keyframes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...KEYFRAMES_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Goal $3,000')).toBeVisible();
    await playPauseLoop(canvas, 'kf-keyframes');
  },
};

export const Slow: Story = {
  args: {
    ...KEYFRAMES_DEFAULTS,
    duration: 3.5,
    caption: 'Slow goal $3,000',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Slow goal $3,000')).toBeVisible();
    await playPauseLoop(canvas, 'kf-keyframes');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...KEYFRAMES_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectKeyframeBrand(canvas);
    await expect(canvas.getByTestId('kf-keyframes')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
