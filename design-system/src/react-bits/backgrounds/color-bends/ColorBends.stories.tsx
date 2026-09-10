import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { ColorBends } from './ColorBends';
import { COLOR_BENDS_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Color Bends',
  component: ColorBends,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Color Bends, commit 625f250, 2026-09-10. Mechanism: three.js full-screen shader warps colour bands with time, frequency, and a pointer uniform. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/color-bends . Runtime three 0.180.0. Pause holds uTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...COLOR_BENDS_DEFAULTS },
  argTypes: {
    rotation: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Field rotation in degrees. Upstream default 90.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale of the warp. Upstream default 0.2.',
    },
    colors: {
      control: 'object',
      description:
        'Band colours. Brand accent-blue, accent-yellow, paper. Upstream default [].',
    },
    transparent: {
      control: 'boolean',
      description: 'Premultiplied alpha cover. Upstream default true.',
    },
    autoRotate: {
      control: { type: 'range', min: 0, max: 60, step: 1 },
      description: 'Extra rotation per second. Upstream default 0.',
    },
    scale: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Field scale. Upstream default 1.',
    },
    frequency: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Warp frequency. Upstream default 1.',
    },
    warpStrength: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Displacement mix. Upstream default 1.',
    },
    mouseInfluence: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Pointer pull. Upstream default 1.',
    },
    parallax: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pointer offset of the field. Upstream default 0.5.',
    },
    noise: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Grain amount. Upstream default 0.15.',
    },
    iterations: {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Warp passes. Upstream default 1.',
    },
    intensity: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Colour gain. Upstream default 1.5.',
    },
    bandWidth: {
      control: { type: 'range', min: 1, max: 12, step: 0.5 },
      description: 'Band thickness. Upstream default 6.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds time still.',
    },
  },
} satisfies Meta<typeof ColorBends>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Color Bends' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('color-bends-stage');
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
  args: { ...COLOR_BENDS_DEFAULTS },
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

export const AutoRotate: Story = {
  args: { ...COLOR_BENDS_DEFAULTS, autoRotate: 12, frequency: 1.6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...COLOR_BENDS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
