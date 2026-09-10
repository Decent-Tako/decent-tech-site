import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ROTATE_DEFAULTS } from './defaults';
import { expectKeyframeBrand, playReplay } from './play';
import { Rotate } from './Rotate';
import { REDUCED_MOTION_OPTIONS, TWEEN_EASES } from './source';

const meta = {
  title: 'Motion examples/Rotate',
  component: Rotate,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-rotate in Academy branding.',
          'The upstream demo exports no props. Controls lift duration, rotate, and ease.',
          'Mechanism: animate={{ rotate: 360 }} with transition duration 1. One tween. No repeat.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation .',
          'Example https://motion.dev/examples/react-rotate .',
          'Live https://examples.motion.dev/react/rotate .',
          'One-shot. Replay remounts. Caption is 19–28 October.',
        ].join(' '),
      },
    },
  },
  args: {
    ...ROTATE_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.1 },
      description: 'Tween duration in seconds. Upstream default 1.',
    },
    rotateTo: {
      control: { type: 'range', min: 90, max: 720, step: 45 },
      description: 'Target rotate in degrees. Upstream default 360.',
    },
    ease: {
      control: 'select',
      options: [...TWEEN_EASES],
      description:
        'Tween ease. Published source omits ease, so default is Motion easeOut. linear is the tutorial step.',
    },
    size: {
      control: { type: 'range', min: 72, max: 140, step: 4 },
      description: 'Box size in pixels. Upstream default 100.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof Rotate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...ROTATE_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('19–28 October')).toBeVisible();
    await playReplay(canvas, 'kf-rotate');
    await waitFor(
      () => {
        expect(canvas.getByRole('img', { name: '19–28 October' })).toHaveAttribute(
          'data-complete',
          'true',
        );
      },
      { timeout: 4000 },
    );
  },
};

export const Linear: Story = {
  args: {
    ...ROTATE_DEFAULTS,
    ease: 'linear',
    caption: 'Challenge week spin',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Challenge week spin')).toBeVisible();
    await playReplay(canvas, 'kf-rotate');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...ROTATE_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectKeyframeBrand(canvas);
    await expect(canvas.getByText('19–28 October')).toBeVisible();
    await playReplay(canvas, 'kf-rotate');
  },
};
