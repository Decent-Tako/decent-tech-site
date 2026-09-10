import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { TRANSITION_DEFAULTS } from './defaults';
import { expectPresenceBrand, playReplay, waitOpaque } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { Transition } from './Transition';

const meta = {
  title: 'Motion examples/Presence/Transition',
  component: Transition,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-transition in Academy branding.',
          'The upstream demo exports no props. Controls lift duration, delay, cubic-bezier, and scale.',
          'Mechanism: motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-transitions .',
          'Example https://motion.dev/examples/react-transition .',
          'Live https://examples.motion.dev/react/transition .',
          'One-shot. Replay remounts. Caption is the $3,000 goal date.',
        ].join(' '),
      },
    },
  },
  args: {
    ...TRANSITION_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    opacityFrom: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'initial.opacity. Upstream default 0.',
    },
    opacityTo: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'animate.opacity. Upstream default 1.',
    },
    scaleFrom: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'initial.scale. Upstream default 0.5.',
    },
    scaleTo: {
      control: { type: 'range', min: 0.5, max: 1.5, step: 0.05 },
      description: 'animate.scale. Upstream default 1.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.1 },
      description: 'transition.duration in seconds. Upstream default 0.8.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.1 },
      description: 'transition.delay in seconds. Upstream default 0.5.',
    },
    easeX1: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Cubic-bezier x1. Upstream default 0.',
    },
    easeY1: {
      control: { type: 'range', min: 0, max: 1.2, step: 0.01 },
      description: 'Cubic-bezier y1. Upstream default 0.71.',
    },
    easeX2: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Cubic-bezier x2. Upstream default 0.2.',
    },
    easeY2: {
      control: { type: 'range', min: 0, max: 1.2, step: 0.01 },
      description: 'Cubic-bezier y2. Upstream default 1.01.',
    },
    size: {
      control: { type: 'range', min: 120, max: 280, step: 8 },
      description: 'Disc size in pixels. Upstream default 200.',
    },
    label: { control: 'text' },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof Transition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByText('Aim for $3,000 before 19 October 2026'),
    ).toBeVisible();
    await waitOpaque(canvas, 'presence-transition-disc');
    await expect(canvas.getByText('$3,000')).toBeVisible();
    await playReplay(canvas, 'presence-transition');
    await waitOpaque(canvas, 'presence-transition-disc');
  },
};

export const NoDelay: Story = {
  args: {
    ...TRANSITION_DEFAULTS,
    delay: 0,
    duration: 0.4,
    caption: 'No delay, shorter tween',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No delay, shorter tween')).toBeVisible();
    await waitOpaque(canvas, 'presence-transition-disc');
    await playReplay(canvas, 'presence-transition');
    await waitOpaque(canvas, 'presence-transition-disc');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...TRANSITION_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectPresenceBrand(canvas);
    await expect(canvas.getByTestId('presence-transition-disc')).toBeVisible();
    await expect(canvas.getByText('$3,000')).toBeVisible();
  },
};
