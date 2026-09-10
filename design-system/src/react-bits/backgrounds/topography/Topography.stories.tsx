import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Topography } from './Topography';
import { TOPOGRAPHY_COLOR_MODES, TOPOGRAPHY_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Topography',
  component: Topography,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Topography, commit 625f250, 2026-09-10. Mechanism: morphing ogl contour bands with optional pointer elevation. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/topography . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...TOPOGRAPHY_DEFAULTS },
  argTypes: {
    lowColor: {
      control: 'color',
      description: 'Low elevation. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    midColor: {
      control: 'color',
      description: 'Mid elevation. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    highColor: {
      control: 'color',
      description: 'High elevation. Brand paper #FFFFFF. Upstream default #FFFFFF.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Morph speed scale. Upstream default 0.35.',
    },
    morphAmount: {
      control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
      description: 'Field amplitude. Upstream default 3.',
    },
    morphSpeed: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Control-point speed. Upstream default 0.05.',
    },
    bands: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Contour count. Upstream default 2.',
    },
    thickness: {
      control: { type: 'range', min: 0.002, max: 0.08, step: 0.002 },
      description: 'Line thickness. Upstream default 0.01.',
    },
    scale: {
      control: { type: 'range', min: 0.3, max: 3, step: 0.1 },
      description: 'Field scale. Upstream default 1.',
    },
    pixelSize: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Pixelation. Upstream default 1.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Line glow. Upstream default 0.5.',
    },
    colorMode: {
      control: 'select',
      options: [...TOPOGRAPHY_COLOR_MODES],
      description: 'Line colour mode. Upstream default elevation.',
    },
    contrast: {
      control: { type: 'range', min: 0.4, max: 6, step: 0.1 },
      description: 'Coverage contrast. Upstream default 3.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Brightness. Upstream default 1.',
    },
    fillBands: {
      control: 'boolean',
      description: 'Fill between contours. Upstream default false.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha. Upstream default 1.',
    },
    grain: {
      control: 'boolean',
      description: 'Film grain. Upstream default true.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Grain strength. Upstream default 0.05.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer bumps elevation. Upstream default true.',
    },
    mouseRadius: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Pointer radius. Upstream default 0.3.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pointer strength. Upstream default 0.4.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-paper mapping. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the contours after a short warm-up.',
    },
  },
} satisfies Meta<typeof Topography>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Topography' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('topography-stage');
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
  args: { ...TOPOGRAPHY_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.topography-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const AlternatingFill: Story = {
  args: {
    ...TOPOGRAPHY_DEFAULTS,
    colorMode: 'alternating',
    fillBands: true,
    bands: 3.5,
    pixelSize: 4,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-mode', 'alternating');
    await playPaint(stage);
    const hit = stage.querySelector('.topography-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...TOPOGRAPHY_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
