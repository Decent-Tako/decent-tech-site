import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { SlicedWaves } from './SlicedWaves';
import { SLICED_WAVES_DEFAULTS, SLICED_WAVES_ORIENTATIONS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Sliced Waves',
  component: SlicedWaves,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Sliced Waves, commit 625f250, 2026-09-10. Mechanism: an ogl grid of travelling bars with optional pointer thickness. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/sliced-waves . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SLICED_WAVES_DEFAULTS },
  argTypes: {
    color1: {
      control: 'color',
      description: 'First bar colour. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    color2: {
      control: 'color',
      description: 'Second bar colour. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    color3: {
      control: 'color',
      description: 'Along-axis mix. Brand paper #FFFFFF. Upstream default #B497CF.',
    },
    columns: {
      control: { type: 'range', min: 2, max: 32, step: 1 },
      description: 'Column count. Upstream default 14.',
    },
    rows: {
      control: { type: 'range', min: 2, max: 24, step: 1 },
      description: 'Row count. Upstream default 8.',
    },
    barThickness: {
      control: { type: 'range', min: 0.02, max: 0.5, step: 0.01 },
      description: 'Bar thickness. Upstream default 0.1.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Wave speed. Upstream default 0.35.',
    },
    travel: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Travel distance. Upstream default 0.7.',
    },
    waveSpread: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Phase spread. Upstream default 0.9.',
    },
    rowOffset: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Row phase offset. Upstream default 1.',
    },
    softness: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Edge softness. Upstream default 0.05.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Glow amount. Upstream default 0.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Brightness. Upstream default 1.',
    },
    contrast: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Contrast. Upstream default 1.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha. Upstream default 0.5.',
    },
    orientation: {
      control: 'select',
      options: [...SLICED_WAVES_ORIENTATIONS],
      description: 'Bar axis. Upstream default horizontal.',
    },
    alternate: {
      control: 'boolean',
      description: 'Alternate row direction. Upstream default false.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer thickens a local band. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Pointer strength. Upstream default 1.',
    },
    mouseRadius: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Pointer radius. Upstream default 0.3.',
    },
    grain: {
      control: 'boolean',
      description: 'Film grain. Upstream default true.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Grain strength. Upstream default 0.05.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-paper mapping. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the waves after a short warm-up.',
    },
  },
} satisfies Meta<typeof SlicedWaves>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Sliced Waves' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('sliced-waves-stage');
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
  await expect(stage).toHaveTextContent('Six weeks');
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
  args: { ...SLICED_WAVES_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.sliced-waves-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const Vertical: Story = {
  args: {
    ...SLICED_WAVES_DEFAULTS,
    orientation: 'vertical',
    alternate: true,
    glow: 0.4,
    columns: 10,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-orientation', 'vertical');
    await playPaint(stage);
    const hit = stage.querySelector('.sliced-waves-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SLICED_WAVES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
