import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { EXIT_DEFAULTS } from './defaults';
import { ExitAnimation } from './ExitAnimation';
import { expectPresenceBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Presence/Exit animation',
  component: ExitAnimation,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-exit-animation in Academy branding.',
          'The upstream demo exports no props. Controls lift AnimatePresence initial, opacity, scale, and whileTap y.',
          'Mechanism: AnimatePresence initial={false} around a keyed motion.div with matching initial and exit { opacity: 0, scale: 0 }.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animate-presence .',
          'Example https://motion.dev/examples/react-exit-animation .',
          'Live https://examples.motion.dev/react/exit-animation .',
          'One-shot. Replay remounts. Hide and Show is the live trigger. Caption is Publish the page.',
        ].join(' '),
      },
    },
  },
  args: {
    ...EXIT_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    presenceInitial: {
      control: 'boolean',
      description: 'AnimatePresence initial. Upstream default false.',
    },
    opacityFrom: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'initial.opacity and exit.opacity. Upstream default 0.',
    },
    opacityTo: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'animate.opacity. Upstream default 1.',
    },
    scaleFrom: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'initial.scale and exit.scale. Upstream default 0.',
    },
    scaleTo: {
      control: { type: 'range', min: 0.5, max: 1.5, step: 0.05 },
      description: 'animate.scale. Upstream default 1.',
    },
    whileTapY: {
      control: { type: 'range', min: 0, max: 4, step: 0.5 },
      description: 'Hide/Show whileTap y in pixels. Upstream default 1.',
    },
    size: {
      control: { type: 'range', min: 80, max: 160, step: 4 },
      description: 'Box size in pixels. Upstream default 100.',
    },
    label: { control: 'text' },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof ExitAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playHideShow(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await waitFor(() => {
    expect(canvas.getByTestId('presence-exit-box')).toBeVisible();
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Hide' }));
  await waitFor(() => {
    expect(canvas.queryByTestId('presence-exit-box')).toBeNull();
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Show' }));
  await waitFor(() => {
    expect(canvas.getByTestId('presence-exit-box')).toBeVisible();
  });
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Publish the page')).toBeVisible();
    await playHideShow(canvas);
    await playReplay(canvas, 'presence-exit');
  },
};

export const EnterOnFirstPaint: Story = {
  args: {
    ...EXIT_DEFAULTS,
    presenceInitial: true,
    caption: 'Enter plays on first paint',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Enter plays on first paint')).toBeVisible();
    await playHideShow(canvas);
    await playReplay(canvas, 'presence-exit');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...EXIT_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectPresenceBrand(canvas);
    await expect(canvas.getByTestId('presence-exit-box')).toBeVisible();
    await playHideShow(canvas);
  },
};
