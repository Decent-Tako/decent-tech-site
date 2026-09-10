import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { GhostCursor } from './GhostCursor';
import { GHOST_CURSOR_DEFAULTS, MIX_BLEND_MODES } from './source';

const meta = {
  title: 'React Bits/Animations/Ghost Cursor',
  component: GhostCursor,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Ghost Cursor, commit 625f250, 2026-09-10. Mechanism: a Three.js shader trail follows the pointer with bloom and grain. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/ghost-cursor . Runtime three 0.180.0. Pause holds the last frame. Replay remounts the renderer. Color default is brand accent blue #0035B1 (upstream #B497CF).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GHOST_CURSOR_DEFAULTS },
  argTypes: {
    trailLength: {
      control: { type: 'range', min: 4, max: 80, step: 1 },
      description: 'Trail samples. Upstream default 50.',
    },
    inertia: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Coast after leave. Upstream default 0.5.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Film grain. Upstream default 0.05.',
    },
    bloomStrength: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Unreal bloom strength. Upstream default 0.1.',
    },
    bloomRadius: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Unreal bloom radius. Upstream default 1.',
    },
    bloomThreshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.005 },
      description: 'Unreal bloom threshold. Upstream default 0.025.',
    },
    brightness: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Shader brightness. Upstream default 1.',
    },
    color: {
      control: 'color',
      description: 'Blob tint. Brand accent blue #0035B1. Upstream default #B497CF.',
    },
    mixBlendMode: {
      control: 'select',
      options: [...MIX_BLEND_MODES],
      description: 'Canvas blend mode. Upstream default screen.',
    },
    edgeIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Fade at the canvas edge. Upstream default 0.',
    },
    maxDevicePixelRatio: {
      control: { type: 'range', min: 0.25, max: 2, step: 0.25 },
      description: 'Pixel ratio cap. Upstream default 0.5.',
    },
    targetPixels: {
      control: { type: 'range', min: 200000, max: 2000000, step: 100000 },
      description: 'Pixel budget. Desktop default 1300000. Touch uses 900000 upstream.',
    },
    fadeDelayMs: {
      control: { type: 'range', min: 0, max: 3000, step: 100 },
      description: 'Wait before fade-out. Desktop default 1000. Touch uses 500 upstream.',
    },
    fadeDurationMs: {
      control: { type: 'range', min: 0, max: 4000, step: 100 },
      description: 'Fade-out length. Desktop default 1500. Touch uses 1000 upstream.',
    },
    zIndex: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Stacking of the overlay. Upstream default 10.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds a still frame with no trail updates.',
    },
  },
} satisfies Meta<typeof GhostCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const INK = '#212121';
const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Ghost Cursor' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('ghost-cursor-stage');
  await waitFor(() => {
    expect(stage.getAttribute('data-webgl')).not.toBe('pending');
  }, SLOW);
  return stage;
}

async function playTrail(canvas: Canvas) {
  const stage = await playReady(canvas);
  if (stage.getAttribute('data-webgl') === 'unavailable') {
    await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    return stage;
  }
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-webgl', 'ready');
  }, SLOW);
  movePointer(stage, 80, 70);
  movePointer(stage, 220, 150);
  const ghostCanvas = canvas.getByTestId('ghost-cursor-canvas') as HTMLCanvasElement;
  await assertCanvasPainted(ghostCanvas, INK);
  await expect(canvas.getByText('19–28 October 2026')).toBeVisible();
  return stage;
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...GHOST_CURSOR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTrail(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playTrail(canvas);
  },
};

export const LongTrail: Story = {
  args: { ...GHOST_CURSOR_DEFAULTS, trailLength: 80, bloomStrength: 0.35, brightness: 1.4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTrail(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GHOST_CURSOR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.getAttribute('data-webgl') === 'unavailable') {
      await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    } else {
      await waitFor(() => {
        expect(stage).toHaveAttribute('data-webgl', 'ready');
      }, SLOW);
    }
    await playPause(canvas, stage);
  },
};
