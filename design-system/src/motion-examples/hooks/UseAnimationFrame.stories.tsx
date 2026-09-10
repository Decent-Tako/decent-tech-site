import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { USE_ANIMATION_FRAME_DEFAULTS } from './defaults';
import { expectHookBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { UseAnimationFrame } from './UseAnimationFrame';

const meta = {
  title: 'Motion examples/Use animation frame',
  component: UseAnimationFrame,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-use-animation-frame in Academy branding.',
          'The upstream demo exports no props. Controls lift speed, time periods, and amplitudes.',
          'Mechanism: useAnimationFrame writes cube.style.transform every frame. rotate = sin(t / 10000) * 200. y = (1 + sin(t / 1000)) * -50.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-animation-frame .',
          'Example https://motion.dev/examples/react-use-animation-frame .',
          'Live https://examples.motion.dev/react/use-animation-frame .',
          'Continuous. Pause and Speed. Faces are Academy weeks.',
        ].join(' '),
      },
    },
  },
  args: {
    ...USE_ANIMATION_FRAME_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Multiplies elapsed time. Upstream has no speed; default 1.',
    },
    rotatePeriod: {
      control: { type: 'range', min: 2000, max: 20000, step: 500 },
      description: 'Milliseconds in sin(t / period) for rotate. Upstream 10000.',
    },
    bouncePeriod: {
      control: { type: 'range', min: 250, max: 3000, step: 50 },
      description: 'Milliseconds in sin(t / period) for y. Upstream 1000.',
    },
    rotateAmplitude: {
      control: { type: 'range', min: 40, max: 360, step: 10 },
      description: 'Peak rotate in degrees. Upstream 200.',
    },
    bounceAmplitude: {
      control: { type: 'range', min: 10, max: 80, step: 5 },
      description: 'Peak y travel in pixels. Upstream 50.',
    },
    size: {
      control: { type: 'range', min: 140, max: 240, step: 10 },
      description: 'Cube size in pixels. Upstream default 200.',
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
} satisfies Meta<typeof UseAnimationFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...USE_ANIMATION_FRAME_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Set the goal')).toBeVisible();
    await waitFor(
      () => {
        const y = Number(
          canvas.getByRole('img').getAttribute('data-y') ?? '0',
        );
        expect(Math.abs(y)).toBeGreaterThan(1);
      },
      { timeout: 4000 },
    );
    await playPauseLoop(canvas, 'hk-use-animation-frame');
  },
};

export const Fast: Story = {
  args: {
    ...USE_ANIMATION_FRAME_DEFAULTS,
    speed: 2.5,
    caption: 'Fast cube of Academy weeks',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Fast cube of Academy weeks')).toBeVisible();
    await playPauseLoop(canvas, 'hk-use-animation-frame');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...USE_ANIMATION_FRAME_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectHookBrand(canvas);
    await expect(canvas.getByTestId('hk-use-animation-frame')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
