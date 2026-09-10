import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { ShapeBlur } from './ShapeBlur';
import { SHAPE_BLUR_DEFAULTS, SHAPE_BLUR_VARIATIONS } from './source';

const meta = {
  title: 'React Bits/Animations/Shape Blur',
  component: ShapeBlur,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Shape Blur, commit 625f250, 2026-09-10. Mechanism: a three.js signed-distance field draws a rounded rect, circle, or triangle whose edge follows the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/shape-blur . Runtime three 0.180.0. Pause holds the damped pointer. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SHAPE_BLUR_DEFAULTS },
  argTypes: {
    variation: {
      control: 'select',
      options: [...SHAPE_BLUR_VARIATIONS],
      description: '0 rounded rect, 1 filled circle, 2 ring, 3 triangle. Upstream default 0.',
    },
    pixelRatioProp: {
      control: { type: 'range', min: 1, max: 3, step: 0.5 },
      description: 'Shader pixel ratio before resize. Upstream default 2.',
    },
    shapeSize: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Rounded rect size. Upstream default 1.2.',
    },
    roundness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Corner roundness. Upstream default 0.4.',
    },
    borderSize: {
      control: { type: 'range', min: 0.01, max: 0.4, step: 0.01 },
      description: 'Stroke width. Upstream default 0.05.',
    },
    circleSize: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Pointer soften radius. Upstream default 0.3.',
    },
    circleEdge: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Pointer soften falloff. Upstream default 0.5.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always seeds the pointer at the centre and holds it.',
    },
  },
} satisfies Meta<typeof ShapeBlur>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Shape Blur' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('shape-blur-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.dataset.webgl);
  }, SLOW);
  return stage;
}

async function playSketch(stage: HTMLElement) {
  if (stage.dataset.webgl !== 'ready') {
    await expect(stage.querySelector('p[data-webgl="unavailable"]')).not.toBeNull();
    return;
  }
  const canvasEl = stage.querySelector('canvas');
  await expect(canvasEl).not.toBeNull();
  const host = stage.querySelector('[data-testid="shape-blur-host"]') ?? canvasEl;
  await expect(host).not.toBeNull();
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, INK, { grid: 16, timeoutMs: 6000 });
  for (let i = 0; i < 10; i += 1) {
    movePointer(host as HTMLElement, 40 + i * 18, 50 + (i % 4) * 16);
  }
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, INK, { grid: 16, timeoutMs: 6000 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...SHAPE_BLUR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
    await playSketch(stage);
  },
};

export const Triangle: Story = {
  args: { ...SHAPE_BLUR_DEFAULTS, variation: 3, circleSize: 0.45 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-variation', '3');
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SHAPE_BLUR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.dataset.webgl === 'ready') {
      const canvasEl = stage.querySelector('canvas');
      await expect(canvasEl).not.toBeNull();
      await assertCanvasPainted(canvasEl as HTMLCanvasElement, INK, { grid: 16, timeoutMs: 6000 });
    }
    await playPause(canvas, stage);
  },
};
