import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { Noise } from './Noise';
import { NOISE_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Noise',
  component: Noise,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Noise, commit 625f250, 2026-09-10. Mechanism: a 2D canvas fills a 1024 square with greyscale grain every few frames. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/noise . No extra runtime package. Pause stops the refresh loop. Replay remounts the overlay.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...NOISE_DEFAULTS },
  argTypes: {
    patternSize: {
      control: { type: 'range', min: 50, max: 512, step: 1 },
      description: 'Declared grain cell size. The draw path does not sample it. Upstream default 250.',
    },
    patternScaleX: {
      control: { type: 'range', min: 0.25, max: 4, step: 0.05 },
      description: 'Declared horizontal scale. The draw path does not sample it. Upstream default 1.',
    },
    patternScaleY: {
      control: { type: 'range', min: 0.25, max: 4, step: 0.05 },
      description: 'Declared vertical scale. The draw path does not sample it. Upstream default 1.',
    },
    patternRefreshInterval: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Frames between grain redraws. Upstream default 2.',
    },
    patternAlpha: {
      control: { type: 'range', min: 4, max: 80, step: 1 },
      description: 'Grain alpha 0-255. Upstream default 15.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws one grain frame and runs no loop.',
    },
  },
} satisfies Meta<typeof Noise>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const PAPER = '#FFFFFF';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Noise' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('noise-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.dataset.webgl);
  }, SLOW);
  return stage;
}

async function playSketch(stage: HTMLElement) {
  if (stage.dataset.webgl !== 'ready') {
    await expect(stage.querySelector('p[data-webgl="unavailable"]')).not.toBeNull();
    return;
  }
  const canvasEl = stage.querySelector('canvas');
  await expect(canvasEl).not.toBeNull();
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, PAPER, { grid: 8, timeoutMs: 6000, tolerance: 4 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...NOISE_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
    await playSketch(stage);
  },
};

export const HeavyGrain: Story = {
  args: { ...NOISE_DEFAULTS, patternAlpha: 40, patternRefreshInterval: 1 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...NOISE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};
