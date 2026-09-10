import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectLayoutBrand, playReplay, pointerDrag } from './play';
import { ReorderGrid } from './ReorderGrid';
import {
  REDUCED_MOTION_OPTIONS,
  REORDER_AXIS_OPTIONS,
  REORDER_GRID_DEFAULTS,
} from './source';

const meta = {
  title: 'Motion examples/Reorder grid',
  component: ReorderGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-reorder-grid in Academy branding.',
          'Mechanism: Reorder.Group plus Reorder.Item. Item drag writes x/y. checkReorder moves the value when the dragged centre is closer to another cell. Item layout FLIP-animates neighbours.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-reorder . Example https://motion.dev/examples/react-reorder-grid . Live https://examples.motion.dev/react/reorder-grid . Repository https://github.com/motiondivision/motion .',
          'Upstream omits axis so detectAxis runs. detectAxis starts as y until items measure, then xy for this 4-column grid. Catalogue default is xy so the first drag uses both axes. dragScale 1.08, stiffness 350, damping 30. Replay restores the original order. Pointer-drag only.',
        ].join(' '),
      },
    },
  },
  args: { ...REORDER_GRID_DEFAULTS },
  argTypes: {
    dragScale: {
      control: { type: 'range', min: 1, max: 1.3, step: 0.02 },
      description: 'whileDrag scale. Upstream default 1.08.',
    },
    stiffness: {
      control: { type: 'range', min: 80, max: 700, step: 10 },
      description: 'Item layout spring stiffness. Upstream default 350.',
    },
    damping: {
      control: { type: 'range', min: 10, max: 80, step: 1 },
      description: 'Item layout spring damping. Upstream default 30.',
    },
    axis: {
      control: 'select',
      options: [...REORDER_AXIS_OPTIONS],
      description:
        'Reorder.Group axis. Upstream omits it. detectAxis returns xy for this grid. Catalogue default xy.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof ReorderGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const INITIAL_ORDER =
  'profile,lounge,buddy,team,goal,rsvp,publish,tracker,inner,plan,do,film,thank,follow,street,checkin';

export const Default: Story = {
  args: { ...REORDER_GRID_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    const group = canvas.getByRole('list', {
      name: 'Week 0 and Challenge week actions',
    });
    await expect(group).toHaveAttribute('data-order', INITIAL_ORDER);
    const first = canvas.getByRole('listitem', { name: /Circle profile/ });
    await pointerDrag(first, 140, 0);
    await waitFor(() => {
      expect(group.getAttribute('data-order')).not.toBe(INITIAL_ORDER);
    });
    await playReplay(canvas, 'reorder-grid');
    await expect(
      canvas.getByRole('list', {
        name: 'Week 0 and Challenge week actions',
      }),
    ).toHaveAttribute('data-order', INITIAL_ORDER);
  },
};

export const HeavySpring: Story = {
  args: {
    ...REORDER_GRID_DEFAULTS,
    stiffness: 180,
    damping: 14,
    dragScale: 1.18,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    const first = canvas.getByRole('listitem', { name: /Circle profile/ });
    await pointerDrag(first, 140, 0);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...REORDER_GRID_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await expect(
      canvas.getByRole('list', {
        name: 'Week 0 and Challenge week actions',
      }),
    ).toHaveAttribute('data-order', INITIAL_ORDER);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};
