import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { MagicRings } from './MagicRings';
import { MAGIC_RINGS_ALPHA, MAGIC_RINGS_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Magic Rings',
  component: MagicRings,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Magic Rings, commit 625f250, 2026-09-10. Mechanism: a three.js ShaderMaterial draws expanding rings on a full-screen quad. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/magic-rings . Runtime three 0.180.0. Pause stops the frame loop. Replay remounts the sketch. Colour default is brand accent yellow #DEF54F (upstream #fc42ff). Second colour default is brand accent blue #0035B1 (upstream #42fcff).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MAGIC_RINGS_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Inner ring colour. Brand accent yellow #DEF54F. Upstream default #fc42ff.',
    },
    colorTwo: {
      control: 'color',
      description: 'Outer ring colour. Brand accent blue #0035B1. Upstream default #42fcff.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Cycle speed. Upstream default 1.',
    },
    ringCount: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'How many rings. Upstream default 6.',
    },
    attenuation: {
      control: { type: 'range', min: 1, max: 30, step: 1 },
      description: 'Line falloff. Upstream default 10.',
    },
    lineThickness: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.5 },
      description: 'Line width. Upstream default 2.',
    },
    baseRadius: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Start radius. Upstream default 0.35.',
    },
    radiusStep: {
      control: { type: 'range', min: 0.02, max: 0.4, step: 0.01 },
      description: 'Radius between rings. Upstream default 0.1.',
    },
    scaleRate: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Growth per cycle. Upstream default 0.1.',
    },
    opacity: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Output alpha. Upstream default 1.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 8, step: 0.5 },
      description: 'CSS blur on the host. Upstream default 0.',
    },
    noiseAmount: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Grain. Upstream default 0.1.',
    },
    rotation: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Rotation in degrees. Upstream default 0.',
    },
    ringGap: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: 'Cut power between rings. Upstream default 1.5.',
    },
    fadeIn: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Fade in of each ring. Upstream default 0.7.',
    },
    fadeOut: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Fade out of each ring. Upstream default 0.5.',
    },
    followMouse: {
      control: 'boolean',
      description: 'Offset rings toward the pointer. Upstream default false.',
    },
    mouseInfluence: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer offset scale. Upstream default 0.2.',
    },
    hoverScale: {
      control: { type: 'range', min: 1, max: 2, step: 0.05 },
      description: 'Scale on hover. Upstream default 1.2.',
    },
    parallax: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Per-ring pointer offset. Upstream default 0.05.',
    },
    clickBurst: {
      control: 'boolean',
      description: 'Flash on click. Upstream default false.',
    },
    alphaMode: {
      control: 'select',
      options: [...MAGIC_RINGS_ALPHA],
      description: 'Alpha from luminance or coverage. Upstream default luminance.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws one still frame and runs no loop.',
    },
  },
} satisfies Meta<typeof MagicRings>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Magic Rings' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('magic-rings-stage');
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
  movePointer(stage, 180, 120);
  movePointer(stage, 240, 160);
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
  args: { ...MAGIC_RINGS_DEFAULTS },
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

export const FollowPointer: Story = {
  args: { ...MAGIC_RINGS_DEFAULTS, followMouse: true, clickBurst: true, ringCount: 8 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-follow', 'true');
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MAGIC_RINGS_DEFAULTS, reducedMotion: 'always' },
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
