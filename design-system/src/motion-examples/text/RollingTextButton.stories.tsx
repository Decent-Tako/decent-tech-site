import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ROLLING_TEXT_BUTTON_DEFAULTS } from './defaults';
import { playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { RollingTextButton } from './RollingTextButton';

const meta = {
  title: 'Motion examples/Rolling text button',
  component: RollingTextButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-rolling-text-button in Academy branding.',
          'Mechanism: two motion.span copies. Outgoing translateY(0%) to 100%. Incoming translateY(-100%) to 0%. Hover and focus request active. A pending flag waits for onAnimationComplete.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation#variants .',
          'Example https://motion.dev/examples/react-rolling-text-button .',
          'Live https://examples.motion.dev/react/rolling-text-button .',
          'Ease 0.338, 0.015, 0.395, 0.959 stays fixed. Duration 0.3 s. Label is Start Week 0, not Start free.',
        ].join(' '),
      },
    },
  },
  args: {
    ...ROLLING_TEXT_BUTTON_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button copy. Upstream default Start free.',
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Roll duration in seconds. Upstream default 0.3.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof RollingTextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const tile = canvas.getByRole('button', { name: 'Start Week 0' });
    await userEvent.hover(tile);
    await waitFor(() => {
      expect(tile).toHaveAttribute('data-active', 'true');
    });
    await playReplay(canvas, 'text-rolling-text-button');
    await expect(
      canvas.getByRole('button', { name: 'Start Week 0' }),
    ).toHaveAttribute('data-active', 'false');
  },
};

export const PublishPage: Story = {
  args: {
    ...ROLLING_TEXT_BUTTON_DEFAULTS,
    label: 'Publish your page',
    duration: 0.5,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    const tile = canvas.getByRole('button', { name: 'Publish your page' });
    await userEvent.hover(tile);
    await waitFor(() => {
      expect(tile).toHaveAttribute('data-active', 'true');
    });
    await playReplay(canvas, 'text-rolling-text-button');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...ROLLING_TEXT_BUTTON_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const tile = canvas.getByRole('button', { name: 'Start Week 0' });
    await userEvent.hover(tile);
    await expect(tile).toHaveAttribute('data-active', 'false');
    await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  },
};
