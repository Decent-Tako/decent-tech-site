import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { pointerDrag } from '../../pages/storySupport';
import { DragLockDirection } from './DragLockDirection';
import { DRAG_LOCK_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Drag lock direction',
  component: DragLockDirection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-drag-lock-direction in Academy branding.',
          'Mechanism: dragDirectionLock picks the first axis past the pan threshold. onDirectionLock names it. Constraints at 0 rubber-band to origin.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-drag . Example https://motion.dev/examples/react-drag-lock-direction . Live https://examples.motion.dev/react/drag-lock-direction .',
          'Upstream bounceStiffness 500, bounceDamping 15, dragElastic 0.2. Constraints stay at 0. That origin is the rubber-band.',
        ].join(' '),
      },
    },
  },
  args: { ...DRAG_LOCK_DEFAULTS },
  argTypes: {
    dragDirectionLock: {
      control: 'boolean',
      description: 'Lock to the first axis. Upstream true.',
    },
    bounceStiffness: {
      control: { type: 'range', min: 80, max: 800, step: 20 },
      description: 'dragTransition bounceStiffness. Upstream 500.',
    },
    bounceDamping: {
      control: { type: 'range', min: 5, max: 40, step: 1 },
      description: 'dragTransition bounceDamping. Upstream 15.',
    },
    dragElastic: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Travel past origin before bounce. Upstream 0.2.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof DragLockDirection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...DRAG_LOCK_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByRole('heading', { name: 'Drag lock direction' }),
    ).toBeVisible();
    const box = canvas.getByRole('button', { name: /100-person tracker/ });
    await expect(box).toHaveAttribute('data-lock-enabled', 'true');
    await pointerDrag(box, 90, 90, async () => {
      await waitFor(() => {
        const axis = box.getAttribute('data-lock-axis');
        expect(axis === 'x' || axis === 'y').toBe(true);
      });
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const Unlocked: Story = {
  args: {
    ...DRAG_LOCK_DEFAULTS,
    dragDirectionLock: false,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const box = canvas.getByRole('button', { name: /100-person tracker/ });
    await expect(box).toHaveAttribute('data-lock-enabled', 'false');
    await pointerDrag(box, 70, 70, async () => {
      await expect(box).toHaveAttribute('data-lock-axis', 'none');
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...DRAG_LOCK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Tracker')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};
