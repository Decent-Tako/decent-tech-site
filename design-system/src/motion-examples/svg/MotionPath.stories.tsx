import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { MOTION_PATH_DEFAULTS } from './defaults';
import { MotionPath } from './MotionPath';
import { expectSvgBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Motion path',
  component: MotionPath,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-motion-path in Academy branding.',
          'The upstream demo exports no props. Controls lift duration, speed, box size, start scale, and stroke width.',
          'Mechanism: motion.path animates pathLength 0 to 1. A box binds CSS offsetPath and animates offsetDistance 0% to 100% with the same reverse loop.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation .',
          'Example https://motion.dev/examples/react-motion-path .',
          'Live https://examples.motion.dev/react/motion-path .',
          'Continuous. Pause and Speed. The token is a participant photograph on the six-week spiral.',
        ].join(' '),
      },
    },
  },
  args: {
    ...MOTION_PATH_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 1, max: 8, step: 0.5 },
      description: 'Loop duration in seconds. Upstream default 4. This is Speed with speed.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides duration. Upstream has no speed; default 1.',
    },
    boxSize: {
      control: { type: 'range', min: 32, max: 80, step: 2 },
      description: 'Token size in pixels. Upstream default 50.',
    },
    startScale: {
      control: { type: 'range', min: 1, max: 3.5, step: 0.1 },
      description: 'Scale at offsetDistance 0%. Upstream default 2.5.',
    },
    strokeWidth: {
      control: { type: 'range', min: 4, max: 20, step: 1 },
      description: 'Path stroke width. Upstream default 12.',
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
} satisfies Meta<typeof MotionPath>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByText('A participant through the six weeks'),
    ).toBeVisible();
    await expectFullColorPhotos(canvas);
    await playPauseLoop(canvas, 'svg-motion-path');
  },
};

export const FastLoop: Story = {
  args: {
    ...MOTION_PATH_DEFAULTS,
    duration: 2,
    caption: 'Fast six-week loop',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Fast six-week loop')).toBeVisible();
    await expectFullColorPhotos(canvas);
    await playPauseLoop(canvas, 'svg-motion-path');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...MOTION_PATH_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectSvgBrand(canvas);
    await expectFullColorPhotos(canvas);
    await expect(canvas.getByTestId('svg-motion-path')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
