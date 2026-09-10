import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { GridDistortion } from './GridDistortion';
import { GRID_DISTORTION_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Grid Distortion',
  component: GridDistortion,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Grid Distortion, commit 625f250, 2026-09-10. Mechanism: a three.js plane samples a data texture so pointer motion warps an image. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/grid-distortion . Runtime three 0.180.0. Pause holds the offset field. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GRID_DISTORTION_DEFAULTS },
  argTypes: {
    grid: {
      control: { type: 'range', min: 4, max: 32, step: 1 },
      description: 'Data-texture resolution. Upstream default 15.',
    },
    mouse: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer radius as a share of the grid. Upstream default 0.1.',
    },
    strength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Offset write strength. Upstream default 0.15.',
    },
    relaxation: {
      control: { type: 'range', min: 0.5, max: 1, step: 0.01 },
      description: 'How fast offsets decay. Upstream default 0.9.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the offset field.',
    },
  },
} satisfies Meta<typeof GridDistortion>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Grid Distortion' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('grid-distortion-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.getAttribute('data-webgl'));
  }, SLOW);
  return stage;
}

async function playPaint(stage: HTMLElement) {
  if (stage.getAttribute('data-webgl') !== 'ready') {
    await expect(stage.querySelector('[data-webgl="unavailable"]')).toBeVisible();
    return null;
  }
  const sketch = stage.querySelector('canvas');
  await expect(sketch).toBeTruthy();
  await expect(stage).toHaveTextContent('Week 0');
  await assertCanvasPainted(sketch as HTMLCanvasElement, INK);
  return sketch as HTMLCanvasElement;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...GRID_DISTORTION_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const TightGrid: Story = {
  args: { ...GRID_DISTORTION_DEFAULTS, grid: 8, strength: 0.4, mouse: 0.25 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GRID_DISTORTION_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
