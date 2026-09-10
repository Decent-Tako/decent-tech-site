import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ENTER_DEFAULTS } from './defaults';
import { EnterAnimation } from './EnterAnimation';
import { expectPresenceBrand, playReplay, waitOpaque } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Presence/Enter animation',
  component: EnterAnimation,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-enter-animation in Academy branding.',
          'The upstream demo exports no props. Controls lift opacity, scale, duration, visualDuration, and bounce.',
          'Mechanism: motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}. Scale spring visualDuration 0.4 bounce 0.5.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation .',
          'Example https://motion.dev/examples/react-enter-animation .',
          'Live https://examples.motion.dev/react/enter-animation .',
          'One-shot. Replay remounts. Caption is the Week 0 goal.',
        ].join(' '),
      },
    },
  },
  args: {
    ...ENTER_DEFAULTS,
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
      description: 'initial.scale. Upstream default 0.',
    },
    scaleTo: {
      control: { type: 'range', min: 0.5, max: 1.5, step: 0.05 },
      description: 'animate.scale. Upstream default 1.',
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 1.5, step: 0.05 },
      description: 'transition.duration in seconds. Upstream default 0.4.',
    },
    visualDuration: {
      control: { type: 'range', min: 0.1, max: 1.5, step: 0.05 },
      description: 'Scale spring visualDuration. Upstream default 0.4.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Scale spring bounce. Upstream default 0.5.',
    },
    size: {
      control: { type: 'range', min: 64, max: 160, step: 4 },
      description: 'Disc size in pixels. Upstream default 100.',
    },
    label: { control: 'text' },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof EnterAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Week 0 goal')).toBeVisible();
    await waitOpaque(canvas, 'presence-enter-disc');
    await expect(canvas.getByText('$3,000')).toBeVisible();
    await playReplay(canvas, 'presence-enter');
    await waitOpaque(canvas, 'presence-enter-disc');
  },
};

export const SoftBounce: Story = {
  args: {
    ...ENTER_DEFAULTS,
    bounce: 0.15,
    visualDuration: 0.8,
    caption: 'Softer enter for the Week 0 goal',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Softer enter for the Week 0 goal')).toBeVisible();
    await waitOpaque(canvas, 'presence-enter-disc');
    await playReplay(canvas, 'presence-enter');
    await waitOpaque(canvas, 'presence-enter-disc');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...ENTER_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectPresenceBrand(canvas);
    await expect(canvas.getByTestId('presence-enter-disc')).toBeVisible();
    await expect(canvas.getByText('$3,000')).toBeVisible();
  },
};
