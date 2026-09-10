import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Grainient } from './Grainient';
import { GRAINIENT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Grainient',
  component: Grainient,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Grainient, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 warped three-stop grain gradient. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/grainient . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GRAINIENT_DEFAULTS },
  argTypes: {
    timeSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.25.',
    },
    colorBalance: {
      control: { type: 'range', min: -1, max: 1, step: 0.05 },
      description: 'Blend offset. Upstream default 0.',
    },
    warpStrength: {
      control: { type: 'range', min: 0.1, max: 4, step: 0.1 },
      description: 'Warp scale. Upstream default 1.',
    },
    warpFrequency: {
      control: { type: 'range', min: 0.5, max: 16, step: 0.1 },
      description: 'Warp frequency. Upstream default 5.',
    },
    warpSpeed: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'Warp time scale. Upstream default 2.',
    },
    warpAmplitude: {
      control: { type: 'range', min: 4, max: 120, step: 1 },
      description: 'Warp amplitude. Upstream default 50.',
    },
    blendAngle: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Blend rotation in degrees. Upstream default 0.',
    },
    blendSoftness: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Blend edge. Upstream default 0.05.',
    },
    rotationAmount: {
      control: { type: 'range', min: 0, max: 1000, step: 10 },
      description: 'Noise rotation. Upstream default 500.',
    },
    noiseScale: {
      control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
      description: 'Rotation noise scale. Upstream default 2.',
    },
    grainAmount: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.01 },
      description: 'Grain mix. Upstream default 0.1.',
    },
    grainScale: {
      control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
      description: 'Grain scale. Upstream default 2.',
    },
    grainAnimated: {
      control: 'boolean',
      description: 'Move the grain. Upstream default false.',
    },
    contrast: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.05 },
      description: 'Contrast. Upstream default 1.5.',
    },
    gamma: {
      control: { type: 'range', min: 0.4, max: 2.4, step: 0.05 },
      description: 'Gamma. Upstream default 1.',
    },
    saturation: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Saturation. Upstream default 1.',
    },
    centerX: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.01 },
      description: 'Centre X. Upstream default 0.',
    },
    centerY: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.01 },
      description: 'Centre Y. Upstream default 0.',
    },
    zoom: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Zoom. Upstream default 0.9.',
    },
    color1: {
      control: 'color',
      description: 'Stop 1. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    color2: {
      control: 'color',
      description: 'Stop 2. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    color3: {
      control: 'color',
      description: 'Stop 3. Brand paper #FFFFFF. Upstream default #B497CF.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the gradient still.',
    },
  },
} satisfies Meta<typeof Grainient>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Grainient' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('grainient-stage');
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
  args: { ...GRAINIENT_DEFAULTS },
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

export const AnimatedGrain: Story = {
  args: { ...GRAINIENT_DEFAULTS, grainAnimated: true, grainAmount: 0.22 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GRAINIENT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};
