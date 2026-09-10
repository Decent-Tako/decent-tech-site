import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { AnimatedList } from './AnimatedList';
import { ANIMATED_LIST_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Animated List',
  component: AnimatedList,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Animated List, commit 625f250, 2026-09-10. Mechanism: motion.div rows scale in when they enter the scroller. Licence MIT + Commons Clause. Page https://reactbits.dev/components/animated-list . Runtime motion 13.2.0. Pause records the paused state. Replay remounts the list.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ANIMATED_LIST_DEFAULTS },
  argTypes: {
    showGradients: {
      control: 'boolean',
      description: 'Fade the top and bottom of the scroller. Upstream default true.',
    },
    enableArrowNavigation: {
      control: 'boolean',
      description: 'Arrow keys move the selected row. Upstream default true.',
    },
    displayScrollbar: {
      control: 'boolean',
      description: 'Show the scroller thumb. Upstream default true.',
    },
    initialSelectedIndex: {
      control: { type: 'range', min: -1, max: 12, step: 1 },
      description: 'Row that starts selected. -1 is none. Upstream default -1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always skips the enter scale through MotionConfig.',
    },
  },
} satisfies Meta<typeof AnimatedList>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Animated List' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('animated-list-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...ANIMATED_LIST_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const rows = canvas.getAllByRole('listitem');
    await expect(rows.length).toBeGreaterThan(3);
    await userEvent.click(rows[1]);
    const stage = canvas.getByTestId('animated-list-stage');
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-selected', '1');
    }, SLOW);
    await expect(rows[1].querySelector('.item')).toHaveClass('selected');
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-selected', '-1');
  },
};

export const NoGradients: Story = {
  args: {
    ...ANIMATED_LIST_DEFAULTS,
    showGradients: false,
    displayScrollbar: false,
    initialSelectedIndex: 0,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('animated-list-stage');
    await expect(stage).toHaveAttribute('data-selected', '0');
    const rows = canvas.getAllByRole('listitem');
    await userEvent.click(rows[2]);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-selected', '2');
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...ANIMATED_LIST_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('animated-list-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    const rows = canvas.getAllByRole('listitem');
    await userEvent.click(rows[0]);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-selected', '0');
    }, SLOW);
    await playPause(canvas);
  },
};
