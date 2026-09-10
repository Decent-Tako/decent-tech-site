import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { Dock } from './Dock';
import { DOCK_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Dock',
  component: Dock,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Dock, commit 625f250, 2026-09-10. Mechanism: motion springs scale each item by pointer distance. Licence MIT + Commons Clause. Page https://reactbits.dev/components/dock . Runtime motion 13.2.0. Pause ignores the pointer and returns items to rest. Replay remounts the dock.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DOCK_DEFAULTS },
  argTypes: {
    distance: {
      control: { type: 'range', min: 40, max: 400, step: 10 },
      description: 'Pointer range that scales a neighbour. Upstream default 200.',
    },
    panelHeight: {
      control: { type: 'range', min: 40, max: 120, step: 2 },
      description: 'Rest height of the bar in pixels. Upstream default 68.',
    },
    baseItemSize: {
      control: { type: 'range', min: 32, max: 80, step: 2 },
      description: 'Rest size of each item in pixels. Upstream default 50.',
    },
    dockHeight: {
      control: { type: 'range', min: 80, max: 400, step: 8 },
      description: 'Hover height of the outer row in pixels. Upstream default 256.',
    },
    magnification: {
      control: { type: 'range', min: 40, max: 140, step: 2 },
      description: 'Peak item size in pixels. Upstream default 70.',
    },
    springMass: {
      control: { type: 'range', min: 0.05, max: 2, step: 0.05 },
      description: 'Spring mass. Upstream default 0.1.',
    },
    springStiffness: {
      control: { type: 'range', min: 20, max: 400, step: 10 },
      description: 'Spring stiffness. Upstream default 150.',
    },
    springDamping: {
      control: { type: 'range', min: 2, max: 40, step: 1 },
      description: 'Spring damping. Upstream default 12.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always keeps item size at baseItemSize.',
    },
  },
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Dock' })).toBeVisible();
}

async function playHover(canvas: Canvas) {
  const stage = canvas.getByTestId('dock-stage');
  const start = canvas.getByRole('button', { name: 'Start' });
  const rest = start.getBoundingClientRect().width;
  movePointer(start, rest / 2, rest / 2);
  await waitFor(() => {
    expect(start.getBoundingClientRect().width).toBeGreaterThan(rest + 4);
  }, SLOW);
  await userEvent.click(start);
  await expect(stage).toHaveAttribute('data-active', 'start');
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...DOCK_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-active', '');
  },
};

export const LargeMagnify: Story = {
  args: { ...DOCK_DEFAULTS, magnification: 110, distance: 260 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('dock-stage');
    await expect(stage).toHaveAttribute('data-magnify', '110');
    await playHover(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...DOCK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('dock-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-magnify', String(DOCK_DEFAULTS.baseItemSize));
    const start = canvas.getByRole('button', { name: 'Start' });
    const rest = start.getBoundingClientRect().width;
    movePointer(start, rest / 2, rest / 2);
    await userEvent.click(start);
    await expect(stage).toHaveAttribute('data-active', 'start');
    await expect(Math.abs(start.getBoundingClientRect().width - rest)).toBeLessThan(2);
    await playPauseResume(canvas, stage);
  },
};
