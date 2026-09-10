import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { RippleGrid } from './RippleGrid';
import { RIPPLE_GRID_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Ripple Grid',
  component: RippleGrid,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Ripple Grid, commit 625f250, 2026-09-10. Mechanism: ogl grid with a time ripple and optional pointer wave. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/ripple-grid . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...RIPPLE_GRID_DEFAULTS },
  argTypes: {
    enableRainbow: {
      control: 'boolean',
      description: 'Time-tinted cells. Upstream default false.',
    },
    gridColor: {
      control: 'color',
      description: 'Grid colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    rippleIntensity: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Ripple amount. Upstream default 0.05.',
    },
    gridSize: {
      control: { type: 'range', min: 2, max: 24, step: 0.5 },
      description: 'Cell count. Upstream default 10.',
    },
    gridThickness: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'Line weight. Upstream default 15.',
    },
    fadeDistance: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Fade radius. Upstream default 1.5.',
    },
    vignetteStrength: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Vignette. Upstream default 2.',
    },
    glowIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Glow. Upstream default 0.1.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha. Upstream default 1.',
    },
    gridRotation: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Rotation in degrees. Upstream default 0.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer wave. Upstream default true.',
    },
    mouseInteractionRadius: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Pointer radius. Upstream default 1.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Paint pigment on white. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the grid after a short warm-up.',
    },
  },
} satisfies Meta<typeof RippleGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Ripple Grid' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('ripple-grid-stage');
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
  await expect(stage).toHaveTextContent('19–28 October 2026');
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
  args: { ...RIPPLE_GRID_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.ripple-grid-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const Rainbow: Story = {
  args: {
    ...RIPPLE_GRID_DEFAULTS,
    enableRainbow: true,
    rippleIntensity: 0.12,
    gridRotation: 15,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-rainbow', 'true');
    await playPaint(stage);
    const hit = stage.querySelector('.ripple-grid-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...RIPPLE_GRID_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
