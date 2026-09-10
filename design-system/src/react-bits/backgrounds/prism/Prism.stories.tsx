import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Prism } from './Prism';
import { PRISM_ANIMATION_TYPES, PRISM_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Prism',
  component: Prism,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Prism, commit 625f250, 2026-09-10. Mechanism: ogl raymarch of a glowing prism with rotate, hover, or 3drotate. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/prism . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PRISM_DEFAULTS },
  argTypes: {
    height: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Prism height. Upstream default 3.5.',
    },
    baseWidth: {
      control: { type: 'range', min: 0.5, max: 10, step: 0.1 },
      description: 'Base width. Upstream default 5.5.',
    },
    animationType: {
      control: 'select',
      options: [...PRISM_ANIMATION_TYPES],
      description: 'Motion mode. Upstream default rotate.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Edge glow. Upstream default 1.',
    },
    offset: {
      control: 'object',
      description: 'Pixel shift of the prism. Upstream default { x: 0, y: 0 }.',
    },
    noise: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Grain amount. Upstream default 0.5.',
    },
    transparent: {
      control: 'boolean',
      description: 'Alpha canvas. Upstream default true.',
    },
    scale: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Zoom. Upstream default 3.6.',
    },
    hueShift: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Hue rotation in degrees. Upstream default 0.',
    },
    colorFrequency: {
      control: { type: 'range', min: 0.1, max: 4, step: 0.1 },
      description: 'Band frequency. Upstream default 1.',
    },
    hoverStrength: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Hover tilt. Upstream default 2.',
    },
    inertia: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Hover lerp. Upstream default 0.05.',
    },
    bloom: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Bloom. Upstream default 1.',
    },
    suspendWhenOffscreen: {
      control: 'boolean',
      description: 'Stop the loop off-screen. Upstream default false.',
    },
    timeScale: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time multiplier. Upstream default 0.5.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Paint pigment on white. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the prism after a short warm-up.',
    },
  },
} satisfies Meta<typeof Prism>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Prism' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('prism-stage');
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
  args: { ...PRISM_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.prism-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const HoverTilt: Story = {
  args: { ...PRISM_DEFAULTS, animationType: 'hover', hueShift: 40, glow: 1.6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-animation', 'hover');
    await playPaint(stage);
    const hit = stage.querySelector('.prism-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PRISM_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-time-scale', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
