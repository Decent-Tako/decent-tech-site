import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { PixelSnow } from './PixelSnow';
import { PIXEL_SNOW_DEFAULTS, PIXEL_SNOW_VARIANTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Pixel Snow',
  component: PixelSnow,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Pixel Snow, commit 625f250, 2026-09-10. Mechanism: three.js voxel raymarch of falling flakes. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/pixel-snow . Runtime three 0.180.0. Pause holds uTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PIXEL_SNOW_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Flake colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    flakeSize: {
      control: { type: 'range', min: 0.002, max: 0.05, step: 0.002 },
      description: 'World flake size. Upstream default 0.01.',
    },
    minFlakeSize: {
      control: { type: 'range', min: 0.25, max: 4, step: 0.05 },
      description: 'Screen-size floor. Upstream default 1.25.',
    },
    pixelResolution: {
      control: { type: 'range', min: 40, max: 400, step: 10 },
      description: 'Pixel grid. Upstream default 200.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 4, step: 0.05 },
      description: 'Fall speed. Upstream default 1.25.',
    },
    depthFade: {
      control: { type: 'range', min: 1, max: 20, step: 0.5 },
      description: 'Distance fade. Upstream default 8.',
    },
    farPlane: {
      control: { type: 'range', min: 4, max: 40, step: 1 },
      description: 'Ray far plane. Upstream default 20.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Flake brightness. Upstream default 1.',
    },
    gamma: {
      control: { type: 'range', min: 0.2, max: 1, step: 0.05 },
      description: 'Gamma. Upstream default 0.4545.',
    },
    density: {
      control: { type: 'range', min: 0.05, max: 0.8, step: 0.05 },
      description: 'Cell occupancy. Upstream default 0.3.',
    },
    variant: {
      control: 'select',
      options: [...PIXEL_SNOW_VARIANTS],
      description: 'Flake shape. Upstream default square.',
    },
    direction: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Wind heading in degrees. Upstream default 125.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the flakes after a short warm-up.',
    },
  },
} satisfies Meta<typeof PixelSnow>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Pixel Snow' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('pixel-snow-stage');
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
  await expect(stage).toHaveTextContent('Public work');
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
  args: { ...PIXEL_SNOW_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const Snowflake: Story = {
  args: { ...PIXEL_SNOW_DEFAULTS, variant: 'snowflake', density: 0.45, speed: 0.8 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-variant', 'snowflake');
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PIXEL_SNOW_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
