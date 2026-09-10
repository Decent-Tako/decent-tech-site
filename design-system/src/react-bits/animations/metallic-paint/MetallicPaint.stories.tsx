import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { MetallicPaint } from './MetallicPaint';
import { METALLIC_PAINT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Metallic Paint',
  component: MetallicPaint,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Metallic Paint, commit 625f250, 2026-09-10. Mechanism: a WebGL 2 liquid-metal shader maps a depth field from an Academy photograph. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/metallic-paint . No extra runtime package. Pause holds the clock. Replay remounts the sketch. lightColor brand paper #FFFFFF (upstream #ffffff). darkColor brand ink #212121 (upstream #000000). tintColor brand accent yellow #DEF54F (upstream #feb3ff).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...METALLIC_PAINT_DEFAULTS },
  argTypes: {
    seed: {
      control: { type: 'range', min: 1, max: 200, step: 1 },
      description: 'Noise seed. Upstream default 42.',
    },
    scale: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Pattern scale. Upstream default 4.',
    },
    refraction: {
      control: { type: 'range', min: 0, max: 0.1, step: 0.001 },
      description: 'Refraction amount. Upstream default 0.01.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 0.08, step: 0.001 },
      description: 'Edge blur. Upstream default 0.015.',
    },
    liquid: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Liquid mix. Upstream default 0.75.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Flow speed. Upstream default 0.3.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Light lift. Upstream default 2.',
    },
    contrast: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Contrast. Upstream default 0.5.',
    },
    angle: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Pattern angle in degrees. Upstream default 0.',
    },
    fresnel: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Fresnel rim. Upstream default 1.',
    },
    lightColor: {
      control: 'color',
      description: 'Highlight colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    darkColor: {
      control: 'color',
      description: 'Shade colour. Brand ink #212121. Upstream default #000000.',
    },
    patternSharpness: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Band sharpness. Upstream default 1.',
    },
    waveAmplitude: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Wave amplitude. Upstream default 1.',
    },
    noiseScale: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Noise scale. Upstream default 0.5.',
    },
    chromaticSpread: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Chromatic spread. Upstream default 2.',
    },
    mouseAnimation: {
      control: 'boolean',
      description: 'Drive time from the pointer. Upstream default false.',
    },
    distortion: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Edge distortion. Upstream default 1.',
    },
    contour: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Contour mix. Upstream default 0.2.',
    },
    tintColor: {
      control: 'color',
      description: 'Tint colour. Brand accent yellow #DEF54F. Upstream default #feb3ff.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws one still frame and runs no loop.',
    },
  },
} satisfies Meta<typeof MetallicPaint>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 15000 };
const PAPER = '#FFFFFF';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Metallic Paint' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('metallic-paint-stage');
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
  movePointer(stage, 160, 90);
  movePointer(stage, 220, 140);
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, PAPER, { grid: 16, timeoutMs: 8000 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...METALLIC_PAINT_DEFAULTS },
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

export const MouseFlow: Story = {
  args: { ...METALLIC_PAINT_DEFAULTS, mouseAnimation: true, liquid: 1.2, scale: 5 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...METALLIC_PAINT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.dataset.webgl === 'ready') {
      const canvasEl = stage.querySelector('canvas');
      await expect(canvasEl).not.toBeNull();
      await assertCanvasPainted(canvasEl as HTMLCanvasElement, PAPER, { grid: 16, timeoutMs: 8000 });
    }
    await playPause(canvas, stage);
  },
};
