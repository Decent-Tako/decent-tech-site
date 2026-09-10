import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { Iridescence } from './Iridescence';
import { IRIDESCENCE_DEFAULTS } from './source';

// The canvas clears to white before the shader paints every pixel.
const CLEAR_WHITE = '#FFFFFF';

const meta = {
  title: 'React Bits/Backgrounds/Iridescence',
  component: Iridescence,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Iridescence, commit 625f250, 2026-09-10. Mechanism: one ogl fragment shader folds the pixel grid through eight sine and cosine passes and maps it through a cosine palette; the pointer shifts the fold. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/iridescence . Runtime ogl 1.0.11. Pause skips the render through the local paused prop. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...IRIDESCENCE_DEFAULTS },
  argTypes: {
    color: {
      control: 'object',
      description: 'Palette multiplier as an RGB triple in 0..1. Brand accent blue. Upstream default [1, 1, 1].',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Time multiplier. Upstream default 1.',
    },
    amplitude: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'How far the pointer shifts the fold. Upstream default 0.1.',
    },
    mouseReact: {
      control: 'boolean',
      description: 'The pointer shifts the fold. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused on one still frame.',
    },
  },
} satisfies Meta<typeof Iridescence>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Iridescence' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('iridescence-stage');
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
  const surface = stage.querySelector('.iridescence-container');
  const sketch = stage.querySelector('canvas');
  if (!(surface instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Iridescence container or canvas is missing.');
  }
  const rect = surface.getBoundingClientRect();
  fireEvent.mouseMove(surface, { clientX: rect.left + 240, clientY: rect.top + 120 });
  await assertCanvasPainted(sketch, CLEAR_WHITE);
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
}

export const Default: Story = {
  args: { ...IRIDESCENCE_DEFAULTS },
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

export const FastWideNoPointer: Story = {
  args: { ...IRIDESCENCE_DEFAULTS, speed: 2.5, amplitude: 0.4, mouseReact: false },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...IRIDESCENCE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
  },
};
