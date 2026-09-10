import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { PixelBlast } from './PixelBlast';
import { PIXEL_BLAST_DEFAULTS, PIXEL_BLAST_VARIANTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Pixel Blast',
  component: PixelBlast,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Pixel Blast, commit 625f250, 2026-09-10. Mechanism: three.js GLSL3 pixel grid with click ripples. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/pixel-blast . Runtime three 0.180.0 and postprocessing 6.39.5. Pause holds uTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PIXEL_BLAST_DEFAULTS },
  argTypes: {
    variant: {
      control: 'select',
      options: [...PIXEL_BLAST_VARIANTS],
      description: 'Pixel shape. Upstream default square.',
    },
    pixelSize: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Cell size. Upstream default 3.',
    },
    color: {
      control: 'color',
      description: 'Grid colour. Brand accent-blue #0035B1. Upstream default #B497CF.',
    },
    antialias: {
      control: 'boolean',
      description: 'Renderer antialias. Upstream default true.',
    },
    patternScale: {
      control: { type: 'range', min: 0.5, max: 6, step: 0.1 },
      description: 'Pattern scale. Upstream default 2.',
    },
    patternDensity: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Cell density. Upstream default 1.',
    },
    liquid: {
      control: 'boolean',
      description: 'Liquid post pass. Upstream default false.',
    },
    liquidStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Liquid warp. Upstream default 0.1.',
    },
    liquidRadius: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Touch radius. Upstream default 1.',
    },
    pixelSizeJitter: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Size jitter. Upstream default 0.',
    },
    enableRipples: {
      control: 'boolean',
      description: 'Click ripples. Upstream default true.',
    },
    rippleIntensityScale: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Ripple strength. Upstream default 1.',
    },
    rippleThickness: {
      control: { type: 'range', min: 0.02, max: 0.5, step: 0.02 },
      description: 'Ripple width. Upstream default 0.1.',
    },
    rippleSpeed: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Ripple travel. Upstream default 0.3.',
    },
    liquidWobbleSpeed: {
      control: { type: 'range', min: 0, max: 10, step: 0.5 },
      description: 'Liquid frequency. Upstream default 4.5.',
    },
    autoPauseOffscreen: {
      control: 'boolean',
      description: 'Skip frames off-screen. Upstream default true.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.5.',
    },
    transparent: {
      control: 'boolean',
      description: 'Clear alpha 0. Upstream default true.',
    },
    edgeFade: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Edge fade. Upstream default 0.5.',
    },
    noiseAmount: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Noise pass. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the grid after a short warm-up.',
    },
  },
} satisfies Meta<typeof PixelBlast>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Pixel Blast' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('pixel-blast-stage');
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
  args: { ...PIXEL_BLAST_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 80, 80);
    hit.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: hit.getBoundingClientRect().left + 80,
        clientY: hit.getBoundingClientRect().top + 80,
        bubbles: true,
        pointerId: 1,
        pointerType: 'mouse',
      }),
    );
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const Circle: Story = {
  args: { ...PIXEL_BLAST_DEFAULTS, variant: 'circle', pixelSize: 5, patternScale: 3 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-variant', 'circle');
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PIXEL_BLAST_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
