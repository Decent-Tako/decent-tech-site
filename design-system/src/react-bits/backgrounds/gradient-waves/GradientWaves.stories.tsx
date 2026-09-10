import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { GradientWaves } from './GradientWaves';
import { GRADIENT_WAVES_DEFAULTS, WAVE_DETAILS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Gradient Waves',
  component: GradientWaves,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Gradient Waves, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 raymarched plasma sea with pointer tilt. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/gradient-waves . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GRADIENT_WAVES_DEFAULTS },
  argTypes: {
    horizonColor: {
      control: 'color',
      description: 'Fog colour. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    waveColor: {
      control: 'color',
      description: 'Wave body. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    crestColor: {
      control: 'color',
      description: 'Crest mix. Brand paper #FFFFFF. Upstream default #FFFFFF.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.4.',
    },
    amplitude: {
      control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
      description: 'Wave height. Upstream default 2.5.',
    },
    waveScale: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Wave frequency. Upstream default 0.6.',
    },
    waveRatio: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Y frequency ratio. Upstream default 0.9.',
    },
    swell: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Swell warp. Upstream default 35.',
    },
    turbulence: {
      control: { type: 'range', min: 0, max: 60, step: 1 },
      description: 'Turbulence warp. Upstream default 20.',
    },
    tilt: {
      control: { type: 'range', min: 0, max: 2, step: 0.01 },
      description: 'Camera tilt. Upstream default 1.11.',
    },
    zoom: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.05 },
      description: 'Field of view. Upstream default 1.',
    },
    height: {
      control: { type: 'range', min: 0, max: 16, step: 0.1 },
      description: 'Sea height. Upstream default 5.5.',
    },
    fogDepth: {
      control: { type: 'range', min: 1, max: 40, step: 0.5 },
      description: 'Fog distance. Upstream default 15.',
    },
    detail: {
      control: 'select',
      options: [...WAVE_DETAILS],
      description: 'Raymarch steps. Upstream default medium.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Colour scale. Upstream default 1.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Output alpha. Upstream default 1.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer tilt. Upstream default true.',
    },
    parallaxStrength: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pointer camera amount. Upstream default 0.5.',
    },
    grain: {
      control: 'boolean',
      description: 'Film grain. Upstream default true.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Grain amount. Upstream default 0.05.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the sea still.',
    },
  },
} satisfies Meta<typeof GradientWaves>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Gradient Waves' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('gradient-waves-stage');
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
  args: { ...GRADIENT_WAVES_DEFAULTS },
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

export const HighDetail: Story = {
  args: { ...GRADIENT_WAVES_DEFAULTS, detail: 'high', grain: false, amplitude: 3.4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GRADIENT_WAVES_DEFAULTS, reducedMotion: 'always' },
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
