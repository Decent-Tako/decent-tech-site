import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { MultiStateBadge } from './MultiStateBadge';
import { expectCardsBrand, playReplay } from './play';
import {
  BADGE_STATE_OPTIONS,
  MULTI_STATE_BADGE_DEFAULTS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Multi-state badge',
  component: MultiStateBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-multi-state-badge in Academy branding.',
          'The article page now marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: AnimatePresence swaps icon and label. layout springs label width. animate() shakes error and pulses success. useTime rotates the loader.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animate-presence . Example https://motion.dev/examples/react-multi-state-badge . Live source https://examples.motion.dev/assets/index-FXaAObi4.js .',
          'The demo exports no props. Controls lift spring, shake, success scale, and labels. Replay returns to idle.',
        ].join(' '),
      },
    },
  },
  args: { ...MULTI_STATE_BADGE_DEFAULTS },
  argTypes: {
    stiffness: {
      control: { type: 'range', min: 200, max: 900, step: 20 },
      description: 'Label and icon width spring. Upstream 600.',
    },
    damping: {
      control: { type: 'range', min: 10, max: 60, step: 5 },
      description: 'Label and icon width damping. Upstream 30.',
    },
    shake: {
      control: { type: 'range', min: 2, max: 16, step: 1 },
      description: 'Error shake amplitude in pixels. Upstream 6.',
    },
    successScale: {
      control: { type: 'range', min: 1, max: 1.5, step: 0.05 },
      description: 'Success pulse scale. Upstream 1.2.',
    },
    pulseDuration: {
      control: { type: 'range', min: 0.15, max: 0.8, step: 0.05 },
      description: 'Shake and pulse duration. Upstream 0.3.',
    },
    loaderPeriod: {
      control: { type: 'range', min: 400, max: 2000, step: 100 },
      description: 'Loader rotation period in ms. Upstream 1000.',
    },
    initialState: {
      control: 'select',
      options: [...BADGE_STATE_OPTIONS],
      description: 'Starting state. Upstream idle.',
    },
    idleLabel: { control: 'text' },
    processingLabel: { control: 'text' },
    successLabel: { control: 'text' },
    errorLabel: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof MultiStateBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...MULTI_STATE_BADGE_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectCardsBrand(canvas);
    const badge = canvas.getByRole('button', { name: 'Publish page' });
    await userEvent.click(badge);
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Sending' })).toBeVisible();
    });
    await playReplay(canvas, 'multi-state-badge');
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Publish page' })).toBeVisible();
    });
  },
};

export const Fundraising: Story = {
  args: {
    ...MULTI_STATE_BADGE_DEFAULTS,
    idleLabel: 'Start',
    processingLabel: 'Counting',
    successLabel: 'Goal $3,000',
    errorLabel: 'Try again',
    shake: 12,
    successScale: 1.35,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Start' }));
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Counting' })).toBeVisible();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Counting' }));
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Goal $3,000' })).toBeVisible();
    });
    await playReplay(canvas, 'multi-state-badge');
  },
};

export const ReducedMotion: Story = {
  args: { ...MULTI_STATE_BADGE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await expect(canvas.getByTestId('multi-state-badge')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Publish page' })).toBeVisible();
  },
};
