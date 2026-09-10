import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { CRTWarp } from './CRTWarp';
import { CRT_WARP_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/CRT Warp',
  component: CRTWarp,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits CRT Warp, commit 625f250, 2026-09-10. Mechanism: three.js CRT plasma with curvature, scanlines, bloom, and pointer bend. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/crt-warp . Runtime three 0.180.0. Pause holds uTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CRT_WARP_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Plasma colour. Brand accent-yellow #DEF54F. Upstream default #c755f7.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Screen colour. Brand ink #212121. Upstream default #05010a.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Time scale. Upstream default 0.5.',
    },
    curvature: {
      control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
      description: 'CRT barrel. Upstream default 0.25.',
    },
    scanlineStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Scanline mix. Upstream default 0.25.',
    },
    scanlineFrequency: {
      control: { type: 'range', min: 20, max: 400, step: 5 },
      description: 'Scanline count. Upstream default 200.',
    },
    waveAmplitude: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Plasma amplitude. Upstream default 0.3.',
    },
    waveFrequency: {
      control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
      description: 'Plasma frequency. Upstream default 2.5.',
    },
    bloom: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Glow. Upstream default 1.5.',
    },
    bloomRadius: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Glow radius. Upstream default 1.',
    },
    noise: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Grain. Upstream default 0.1.',
    },
    vignette: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Edge fade. Upstream default 0.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.05 },
      description: 'Tone. Upstream default 1.25.',
    },
    pixelation: {
      control: { type: 'range', min: 1, max: 12, step: 0.5 },
      description: 'Cell size. Upstream default 1.',
    },
    rgbShift: {
      control: { type: 'range', min: 0, max: 0.05, step: 0.001 },
      description: 'Channel offset. Upstream default 0.015.',
    },
    mouseReact: {
      control: 'boolean',
      description: 'Pointer bends the CRT. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pointer force. Upstream default 0.5.',
    },
    dpr: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.25 },
      description: 'Pixel ratio cap. Upstream default 1.',
    },
    fps: {
      control: { type: 'range', min: 10, max: 60, step: 1 },
      description: 'Frame cap. Upstream default 30.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the plasma still.',
    },
  },
} satisfies Meta<typeof CRTWarp>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'CRT Warp' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('crt-warp-stage');
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
  args: { ...CRT_WARP_DEFAULTS },
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

export const StrongCurve: Story = {
  args: { ...CRT_WARP_DEFAULTS, curvature: 0.7, scanlineStrength: 0.6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 120, 90);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...CRT_WARP_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
