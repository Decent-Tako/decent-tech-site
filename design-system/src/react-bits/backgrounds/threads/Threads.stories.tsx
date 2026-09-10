import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { THREADS_DEFAULTS } from './source';
import { Threads } from './Threads';

// The stage is ink; the canvas is transparent over it.
const STAGE_INK = '#212121';

const meta = {
  title: 'React Bits/Backgrounds/Threads',
  component: Threads,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Threads, commit 625f250, 2026-09-10. Mechanism: one ogl fragment shader draws forty Perlin-noise lines that drift with time and, when enabled, with the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/threads . Runtime ogl 1.0.11. Pause stops the render through the local paused prop. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...THREADS_DEFAULTS },
  argTypes: {
    color: {
      control: 'object',
      description: 'Line colour as an RGB triple in 0..1. Brand accent yellow. Upstream default [1, 1, 1].',
    },
    amplitude: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Noise displacement of the lines. Upstream default 1.',
    },
    distance: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Spread between the lines. Upstream default 0.',
    },
    enableMouseInteraction: {
      control: 'boolean',
      description: 'The pointer offsets the noise. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused on one still frame.',
    },
  },
} satisfies Meta<typeof Threads>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Threads' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('threads-stage');
  await waitFor(() => {
    expect(stage).not.toHaveAttribute('data-webgl', 'pending');
  }, SLOW);
  if (stage.dataset.webgl === 'unavailable') {
    await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    return { stage, ready: false };
  }
  await expect(stage).toHaveAttribute('data-webgl', 'ready');
  return { stage, ready: true };
}

async function playPoint(stage: HTMLElement) {
  const surface = stage.querySelector('.threads-container');
  const sketch = stage.querySelector('canvas');
  if (!(surface instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Threads container or canvas is missing.');
  }
  const rect = surface.getBoundingClientRect();
  fireEvent.mouseMove(surface, { clientX: rect.left + 200, clientY: rect.top + 80 });
  await assertCanvasPainted(sketch, STAGE_INK);
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
}

export const Default: Story = {
  args: { ...THREADS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    await playReady(canvas);
  },
};

export const PointerWide: Story = {
  args: { ...THREADS_DEFAULTS, enableMouseInteraction: true, amplitude: 2.5, distance: 0.6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...THREADS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
  },
};
