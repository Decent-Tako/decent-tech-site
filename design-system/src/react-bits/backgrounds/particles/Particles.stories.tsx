import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Particles } from './Particles';
import { PARTICLES_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Particles',
  component: Particles,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Particles, commit 625f250, 2026-09-10. Mechanism: ogl point cloud that drifts with a sine of time. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/particles . Runtime ogl 1.0.11. Pause holds uTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PARTICLES_DEFAULTS },
  argTypes: {
    particleCount: {
      control: { type: 'range', min: 20, max: 800, step: 10 },
      description: 'Point count. Upstream default 200.',
    },
    particleSpread: {
      control: { type: 'range', min: 2, max: 30, step: 1 },
      description: 'Cloud radius. Upstream default 10.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Time scale. Upstream default 0.1.',
    },
    particleColors: {
      control: 'object',
      description: 'Palette. Brand #FFFFFF, #0035B1, #DEF54F. Upstream default all #ffffff.',
    },
    moveParticlesOnHover: {
      control: 'boolean',
      description: 'Shift the mesh with the pointer. Upstream default false.',
    },
    particleHoverFactor: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Hover shift scale. Upstream default 1.',
    },
    alphaParticles: {
      control: 'boolean',
      description: 'Soft disc alpha. Upstream default false.',
    },
    particleBaseSize: {
      control: { type: 'range', min: 20, max: 300, step: 10 },
      description: 'Point size. Upstream default 100.',
    },
    sizeRandomness: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Size jitter. Upstream default 1.',
    },
    cameraDistance: {
      control: { type: 'range', min: 5, max: 40, step: 1 },
      description: 'Camera z. Upstream default 20.',
    },
    disableRotation: {
      control: 'boolean',
      description: 'Hold mesh rotation. Upstream default false.',
    },
    pixelRatio: {
      control: { type: 'range', min: 1, max: 2, step: 0.25 },
      description: 'Renderer dpr. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the cloud after a short warm-up.',
    },
  },
} satisfies Meta<typeof Particles>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Particles' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('particles-stage');
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
  await assertCanvasPainted(sketch as HTMLCanvasElement, INK, {
    grid: 32,
    timeoutMs: 8000,
  });
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
  args: { ...PARTICLES_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.particles-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const HoverMove: Story = {
  args: {
    ...PARTICLES_DEFAULTS,
    moveParticlesOnHover: true,
    alphaParticles: true,
    particleHoverFactor: 1.6,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-hover', 'true');
    await playPaint(stage);
    const hit = stage.querySelector('.particles-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PARTICLES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
