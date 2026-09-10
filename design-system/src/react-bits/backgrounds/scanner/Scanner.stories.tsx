import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Scanner } from './Scanner';
import { SCANNER_DEFAULTS, SCAN_DIRECTIONS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Scanner',
  component: Scanner,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Scanner, commit 625f250, 2026-09-10. Mechanism: WebGL 2 scan field on ogl with a sweep and optional pointer warp. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/scanner . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SCANNER_DEFAULTS },
  argTypes: {
    color1: {
      control: 'color',
      description: 'First stop. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    color2: {
      control: 'color',
      description: 'Second stop. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    color3: {
      control: 'color',
      description: 'Third stop. Brand paper #FFFFFF. Upstream default #FFFFFF.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Field time. Upstream default 0.5.',
    },
    sweepSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Sweep rate. Upstream default 0.25.',
    },
    sweepWidth: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Sweep width. Upstream default 1.6.',
    },
    sweepFalloff: {
      control: { type: 'range', min: 1, max: 12, step: 0.5 },
      description: 'Sweep falloff. Upstream default 6.',
    },
    scale: {
      control: { type: 'range', min: 0.4, max: 4, step: 0.1 },
      description: 'Pattern zoom. Upstream default 1.5.',
    },
    frequency: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Band frequency. Upstream default 2.',
    },
    ripple: {
      control: { type: 'range', min: 0, max: 1, step: 0.02 },
      description: 'Ripple amount. Upstream default 0.22.',
    },
    bandDensity: {
      control: { type: 'range', min: 2, max: 24, step: 1 },
      description: 'Band count. Upstream default 11.',
    },
    lineSharpness: {
      control: { type: 'range', min: 1, max: 12, step: 0.5 },
      description: 'Line sharpness. Upstream default 5.5.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 1, step: 0.02 },
      description: 'Glow. Upstream default 0.22.',
    },
    scanDirection: {
      control: 'select',
      options: [...SCAN_DIRECTIONS],
      description: 'Sweep axis. Upstream default vertical.',
    },
    colorSpread: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Colour spread. Upstream default 0.7.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Brightness. Upstream default 1.',
    },
    contrast: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.05 },
      description: 'Contrast. Upstream default 1.15.',
    },
    softness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Softness. Upstream default 1.4.',
    },
    vignette: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Vignette. Upstream default 0.45.',
    },
    scanline: {
      control: 'boolean',
      description: 'Scanlines. Upstream default true.',
    },
    grain: {
      control: 'boolean',
      description: 'Grain. Upstream default true.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Grain amount. Upstream default 0.05.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha. Upstream default 1.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer warp. Upstream default true.',
    },
    mouseRadius: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Pointer radius. Upstream default 0.5.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pointer strength. Upstream default 0.5.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the field after a short warm-up.',
    },
  },
} satisfies Meta<typeof Scanner>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Scanner' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('scanner-stage');
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
  args: { ...SCANNER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.scanner-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const Horizontal: Story = {
  args: { ...SCANNER_DEFAULTS, scanDirection: 'horizontal', sweepSpeed: 0.5, glow: 0.4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-direction', 'horizontal');
    await playPaint(stage);
    const hit = stage.querySelector('.scanner-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SCANNER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
