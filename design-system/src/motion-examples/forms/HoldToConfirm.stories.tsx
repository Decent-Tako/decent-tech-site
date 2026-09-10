import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { HoldToConfirm } from './HoldToConfirm';
import { expectFormsBrand, firePointer, playReplay } from './play';
import { HOLD_TO_CONFIRM_DEFAULTS, REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Forms/Hold to confirm',
  component: HoldToConfirm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-hold-to-confirm in Academy branding.',
          'The article page prints the Get started stub. Full source is the live View source chunk https://examples.motion.dev/assets/index-DTAfmC1D.js .',
          'Mechanism: progress is a useMotionValue. Pointer down runs animate(progress, 1). Pointer up and leave reverse it. useTransform maps progress to stroke, scale, and fill x. The SVG circle binds pathLength.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-motion-value . Example https://motion.dev/examples/react-hold-to-confirm . Live https://examples.motion.dev/react/hold-to-confirm . Repository https://github.com/motiondivision/motion .',
          'Upstream hold duration 2, release 0.3, scale 0.85, stroke 20. Replay remounts progress at 0.',
        ].join(' '),
      },
    },
  },
  args: { ...HOLD_TO_CONFIRM_DEFAULTS },
  argTypes: {
    holdDuration: {
      control: { type: 'range', min: 0.6, max: 4, step: 0.1 },
      description: 'Hold duration in seconds. Upstream default 2.',
    },
    releaseDuration: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Release duration in seconds. Upstream default 0.3.',
    },
    holdScale: {
      control: { type: 'range', min: 0.7, max: 1, step: 0.01 },
      description: 'Button scale at progress 1. Upstream default 0.85.',
    },
    strokeWidthTo: {
      control: { type: 'range', min: 8, max: 32, step: 1 },
      description: 'Ring stroke at progress 1. Upstream default 20.',
    },
    label: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof HoldToConfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

async function holdUntilMoving(button: HTMLElement) {
  const box = button.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  firePointer(button, 'pointerdown', { clientX: x, clientY: y, buttons: 1 });
  await waitFor(
    () => {
      expect(Number(button.getAttribute('data-progress'))).toBeGreaterThan(0.02);
    },
    { timeout: 4000 },
  );
  firePointer(button, 'pointerup', { clientX: x, clientY: y, buttons: 0 });
}

export const Default: Story = {
  args: { ...HOLD_TO_CONFIRM_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    const button = canvas.getByRole('button', {
      name: 'Hold to publish the page',
    });
    await holdUntilMoving(button);
    await playReplay(canvas, 'hold-to-confirm');
    await expect(
      canvas.getByRole('button', { name: 'Hold to publish the page' }),
    ).toHaveAttribute('data-progress', '0.00');
  },
};

export const FastHold: Story = {
  args: {
    ...HOLD_TO_CONFIRM_DEFAULTS,
    holdDuration: 0.6,
    holdScale: 0.78,
    label: 'Hold to set the $3,000 goal',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const button = canvas.getByRole('button', {
      name: 'Hold to set the $3,000 goal',
    });
    await holdUntilMoving(button);
    await playReplay(canvas, 'hold-to-confirm');
  },
};

export const ReducedMotion: Story = {
  args: { ...HOLD_TO_CONFIRM_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    const button = canvas.getByRole('button', {
      name: 'Hold to publish the page',
    });
    await holdUntilMoving(button);
  },
};
