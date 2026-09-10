import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { AnimatePresenceModes } from './AnimatePresenceModes';
import { MODES_DEFAULTS } from './defaults';
import { expectPresenceBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Presence/AnimatePresence modes',
  component: AnimatePresenceModes,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-animate-presence-modes in Academy branding.',
          'The upstream demo exports no props. Controls lift duration and the three scale keyframes.',
          'Mechanism: three AnimatePresence nodes with mode sync, wait, and popLayout share one state boolean.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animate-presence .',
          'Example https://motion.dev/examples/react-animate-presence-modes .',
          'Live https://examples.motion.dev/react/animate-presence-modes .',
          'One-shot per switch. Replay remounts. Switch is the live trigger.',
        ].join(' '),
      },
    },
  },
  args: {
    ...MODES_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.1, max: 1.2, step: 0.05 },
      description: 'transition.duration in seconds. Upstream default 0.3.',
    },
    enterScale: {
      control: { type: 'range', min: 0.2, max: 1, step: 0.05 },
      description: 'initial.scale. Upstream default 0.6.',
    },
    restScale: {
      control: { type: 'range', min: 0.8, max: 1.2, step: 0.05 },
      description: 'animate.scale. Upstream default 1.',
    },
    exitScale: {
      control: { type: 'range', min: 0.2, max: 1, step: 0.05 },
      description: 'exit.scale. Upstream default 0.8.',
    },
    tapScale: {
      control: { type: 'range', min: 0.8, max: 1, step: 0.01 },
      description: 'Switch whileTap scale. Upstream default 0.95.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof AnimatePresenceModes>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playSwitch(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  const row = canvas.getByText('Switch').closest('.presence-modes');
  await expect(row).toHaveAttribute('data-state', 'on');
  await userEvent.click(canvas.getByRole('button', { name: 'Switch' }));
  await waitFor(() => {
    expect(row).toHaveAttribute('data-state', 'off');
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Switch' }));
  await waitFor(() => {
    expect(row).toHaveAttribute('data-state', 'on');
  });
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('sync')).toBeVisible();
    await expect(canvas.getByText('wait')).toBeVisible();
    await expect(canvas.getByText('popLayout')).toBeVisible();
    await playSwitch(canvas);
    await playReplay(canvas, 'presence-modes');
  },
};

export const SlowWait: Story = {
  args: {
    ...MODES_DEFAULTS,
    duration: 0.8,
    caption: 'Slower switch so wait is obvious',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Slower switch so wait is obvious')).toBeVisible();
    await playSwitch(canvas);
    await playReplay(canvas, 'presence-modes');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...MODES_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectPresenceBrand(canvas);
    await playSwitch(canvas);
  },
};
