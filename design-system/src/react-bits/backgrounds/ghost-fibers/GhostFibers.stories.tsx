import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { GhostFibers } from './GhostFibers';
import { GHOST_FIBERS_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Ghost Fibers',
  component: GhostFibers,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Ghost Fibers, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 polar fiber layers with twist and glow. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/ghost-fibers . Runtime ogl 1.0.11. Pause holds the fiber clock. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GHOST_FIBERS_DEFAULTS },
  argTypes: {
    lineColor: {
      control: 'color',
      description: 'Fiber colour. Brand accent-blue #0035B1. Upstream default #140E35.',
    },
    glowColor: {
      control: 'color',
      description: 'Glow colour. Brand accent-yellow #DEF54F. Upstream default #3437A0.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.2.',
    },
    scale: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Field scale. Upstream default 2.',
    },
    rotation: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Base rotation in degrees. Upstream default 0.',
    },
    rotationSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Spin rate. Upstream default 0.25.',
    },
    layers: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Fiber layers. Upstream default 4.',
    },
    waveAmplitude: {
      control: { type: 'range', min: 0, max: 0.1, step: 0.001 },
      description: 'Wave offset. Upstream default 0.015.',
    },
    waveFrequency: {
      control: { type: 'range', min: 0.5, max: 12, step: 0.1 },
      description: 'Wave frequency. Upstream default 3.',
    },
    waveSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Wave time scale. Upstream default 0.15.',
    },
    layerSpeed: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Per-layer time offset. Upstream default 0.08.',
    },
    twist: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Polar twist. Upstream default 0.1.',
    },
    twistFrequency: {
      control: { type: 'range', min: 0, max: 16, step: 0.1 },
      description: 'Twist frequency. Upstream default 5.',
    },
    twistSpeed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Twist time scale. Upstream default 1.2.',
    },
    lineFrequency: {
      control: { type: 'range', min: 1, max: 16, step: 0.5 },
      description: 'Line density. Upstream default 5.',
    },
    lineSpacing: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'Per-layer line offset. Upstream default 2.',
    },
    lineSharpness: {
      control: { type: 'range', min: 1, max: 32, step: 1 },
      description: 'Line power. Upstream default 16.',
    },
    glowFalloff: {
      control: { type: 'range', min: 0.5, max: 24, step: 0.5 },
      description: 'Glow distance. Upstream default 10.',
    },
    glowIntensity: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Glow amount. Upstream default 1.6.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Tone map. Upstream default 2.',
    },
    blueBoost: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.05 },
      description: 'Blue channel scale. Upstream default 1.25.',
    },
    vignette: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Edge fade. Upstream default 0.8.',
    },
    grain: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Film grain. Upstream default 0.05.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the fibers still.',
    },
  },
} satisfies Meta<typeof GhostFibers>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Ghost Fibers' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('ghost-fibers-stage');
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
  args: { ...GHOST_FIBERS_DEFAULTS },
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

export const LightMode: Story = {
  args: { ...GHOST_FIBERS_DEFAULTS, lightMode: true, layers: 6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GHOST_FIBERS_DEFAULTS, reducedMotion: 'always' },
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
