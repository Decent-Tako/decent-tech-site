import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { SoftAurora } from './SoftAurora';
import { SOFT_AURORA_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Soft Aurora',
  component: SoftAurora,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Soft Aurora, commit 625f250, 2026-09-10. Mechanism: two ogl Perlin-noise aurora bands with optional pointer shift. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/soft-aurora . Runtime ogl 1.0.11. Pause holds uTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SOFT_AURORA_DEFAULTS },
  argTypes: {
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Time scale. Upstream default 0.6.',
    },
    scale: {
      control: { type: 'range', min: 0.4, max: 4, step: 0.1 },
      description: 'Noise scale. Upstream default 1.5.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Brightness. Upstream default 1.',
    },
    color1: {
      control: 'color',
      description: 'First band. Brand paper #FFFFFF. Upstream default #f7f7f7.',
    },
    color2: {
      control: 'color',
      description: 'Second band. Brand accent-blue #0035B1. Upstream default #e100ff.',
    },
    noiseFrequency: {
      control: { type: 'range', min: 0.4, max: 6, step: 0.1 },
      description: 'Noise frequency. Upstream default 2.5.',
    },
    noiseAmplitude: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Noise amplitude. Upstream default 1.',
    },
    bandHeight: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Band height. Upstream default 0.5.',
    },
    bandSpread: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Band spread. Upstream default 1.',
    },
    octaveDecay: {
      control: { type: 'range', min: 0.02, max: 0.8, step: 0.02 },
      description: 'Octave decay. Upstream default 0.1.',
    },
    layerOffset: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Second-layer time offset. Upstream default 0.',
    },
    colorSpeed: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Gradient travel. Upstream default 1.',
    },
    enableMouseInteraction: {
      control: 'boolean',
      description: 'Pointer shifts the sample. Upstream default true.',
    },
    mouseInfluence: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer shift amount. Upstream default 0.25.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-paper mapping. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the aurora after a short warm-up.',
    },
  },
} satisfies Meta<typeof SoftAurora>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Soft Aurora' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('soft-aurora-stage');
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
  await expect(stage).toHaveTextContent('Tracker and plan');
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
  args: { ...SOFT_AURORA_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.soft-aurora-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const WideBands: Story = {
  args: {
    ...SOFT_AURORA_DEFAULTS,
    bandHeight: 0.2,
    bandSpread: 1.6,
    color2: '#DEF54F',
    layerOffset: 1.2,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-mouse', 'true');
    await playPaint(stage);
    const hit = stage.querySelector('.soft-aurora-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SOFT_AURORA_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
