import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { PixelTrail } from './PixelTrail';
import { PIXEL_TRAIL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Pixel Trail',
  component: PixelTrail,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Pixel Trail, commit 625f250, 2026-09-10. Mechanism: a three.js shader samples a pointer trail texture onto a pixel grid. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/pixel-trail . Runtime three 0.180.0. Pause skips new stamps. Replay remounts the sketch. Colour default is brand paper #FFFFFF (upstream #ffffff). The local copy drives three.js directly because @react-three/fiber leaks JSX types into Motion stories.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PIXEL_TRAIL_DEFAULTS },
  argTypes: {
    gridSize: {
      control: { type: 'range', min: 8, max: 80, step: 1 },
      description: 'Pixel grid count. Upstream default 40.',
    },
    trailSize: {
      control: { type: 'range', min: 0.02, max: 0.4, step: 0.01 },
      description: 'Trail stamp radius. Upstream default 0.1.',
    },
    maxAge: {
      control: { type: 'range', min: 50, max: 2000, step: 10 },
      description: 'Stamp life in milliseconds. Upstream default 250.',
    },
    interpolate: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'In-between stamps. Upstream default 5.',
    },
    color: {
      control: 'color',
      description: 'Pixel colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always seeds one still trail stamp at the centre.',
    },
  },
} satisfies Meta<typeof PixelTrail>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Pixel Trail' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('pixel-trail-stage');
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
  const host = stage.querySelector('.pixel-trail-host') ?? canvasEl;
  await expect(host).not.toBeNull();
  for (let i = 0; i < 10; i += 1) {
    movePointer(host as HTMLElement, 40 + i * 18, 50 + (i % 4) * 16);
  }
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, INK, { grid: 16, timeoutMs: 6000 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...PIXEL_TRAIL_DEFAULTS },
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

export const CoarseGrid: Story = {
  args: { ...PIXEL_TRAIL_DEFAULTS, gridSize: 16, trailSize: 0.2, color: '#DEF54F' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PIXEL_TRAIL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.dataset.webgl === 'ready') {
      const canvasEl = stage.querySelector('canvas');
      await expect(canvasEl).not.toBeNull();
      await assertCanvasPainted(canvasEl as HTMLCanvasElement, INK, { grid: 16, timeoutMs: 6000 });
    }
    await playPause(canvas, stage);
  },
};
