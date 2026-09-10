import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectLayoutBrand, playReplay } from './play';
import { ReorderItems } from './ReorderItems';
import {
  LAYOUT_MODE_OPTIONS,
  REDUCED_MOTION_OPTIONS,
  REORDER_ITEMS_DEFAULTS,
} from './source';

const meta = {
  title: 'Motion examples/Reorder items',
  component: ReorderItems,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-reorder-items in Academy branding.',
          'Mechanism: this is not Reorder.Group. Each motion.li has layout. A timeout shuffles the tiles. The tile keeps key so React reorders the nodes and the projection node FLIP-animates them.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-reorder-items . Live https://examples.motion.dev/react/reorder-items . Repository https://github.com/motiondivision/motion .',
          'Upstream default is interval 1000 ms, spring stiffness 300, damping 20, four tiles. Continuous. Pause and Speed. Replay remounts the original order.',
        ].join(' '),
      },
    },
  },
  args: { ...REORDER_ITEMS_DEFAULTS },
  argTypes: {
    intervalMs: {
      control: { type: 'range', min: 400, max: 2500, step: 100 },
      description: 'Shuffle interval in milliseconds. Upstream default 1000. This is Speed.',
    },
    stiffness: {
      control: { type: 'range', min: 80, max: 600, step: 10 },
      description: 'Layout spring stiffness. Upstream default 300.',
    },
    damping: {
      control: { type: 'range', min: 8, max: 60, step: 1 },
      description: 'Layout spring damping. Upstream default 20.',
    },
    layout: {
      control: 'select',
      options: [...LAYOUT_MODE_OPTIONS],
      description: 'layout prop. Upstream default true.',
    },
    paused: {
      control: 'boolean',
      description: 'Stop the shuffle. Continuous loops use Pause.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof ReorderItems>;

export default meta;
type Story = StoryObj<typeof meta>;

const INITIAL_ORDER = 'start,learn,tools,challenge';

export const Default: Story = {
  args: {
    ...REORDER_ITEMS_DEFAULTS,
    intervalMs: 400,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    const list = canvas.getByRole('list', { name: 'Academy week tiles' });
    const startOrder = list.getAttribute('data-order');
    await waitFor(
      () => {
        expect(list.getAttribute('data-order')).not.toBe(startOrder);
      },
      { timeout: 3000 },
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(canvas.getByTestId('reorder-items')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
    await playReplay(canvas, 'reorder-items');
  },
};

export const SlowShuffle: Story = {
  args: {
    ...REORDER_ITEMS_DEFAULTS,
    intervalMs: 1800,
    stiffness: 140,
    damping: 12,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...REORDER_ITEMS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await expect(canvas.getByTestId('reorder-items')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
    await expect(
      canvas.getByRole('list', { name: 'Academy week tiles' }),
    ).toHaveAttribute('data-order', INITIAL_ORDER);
  },
};
