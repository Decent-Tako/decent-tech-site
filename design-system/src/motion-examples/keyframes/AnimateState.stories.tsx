import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { STATE_DEFAULTS } from './defaults';
import { AnimateState } from './AnimateState';
import { expectKeyframeBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Animate state',
  component: AnimateState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-state-updates in Academy branding.',
          'The upstream demo exports no props. Controls lift x, y, and rotate.',
          'Mechanism: React state is passed into animate={{ x, y, rotate }} with transition type spring.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation .',
          'Example https://motion.dev/examples/react-state-updates .',
          'Live https://examples.motion.dev/react/state-updates .',
          'State-driven. Replay remounts. Photo is Find Your Uncomfortable.',
        ].join(' '),
      },
    },
  },
  args: {
    ...STATE_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    x: {
      control: { type: 'range', min: -200, max: 200, step: 5 },
      description: 'Target x in pixels. Upstream default 0. Range −200 to 200.',
    },
    y: {
      control: { type: 'range', min: -200, max: 200, step: 5 },
      description: 'Target y in pixels. Upstream default 0. Range −200 to 200.',
    },
    rotate: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Target rotate in degrees. Upstream default 0. Range −180 to 180.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof AnimateState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...STATE_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Find Your Uncomfortable')).toBeVisible();
    await expectFullColorPhotos(canvas);
    await playReplay(canvas, 'kf-state');
  },
};

export const Offset: Story = {
  args: {
    ...STATE_DEFAULTS,
    x: 120,
    y: -60,
    rotate: 18,
    caption: 'Shift the challenge photo',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Shift the challenge photo')).toBeVisible();
    await expectFullColorPhotos(canvas);
    await playReplay(canvas, 'kf-state');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...STATE_DEFAULTS,
    x: 80,
    y: 40,
    rotate: -12,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectKeyframeBrand(canvas);
    await expectFullColorPhotos(canvas);
    await playReplay(canvas, 'kf-state');
  },
};
