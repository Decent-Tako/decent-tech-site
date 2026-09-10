import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { RippleDistortion } from './RippleDistortion';
import { RIPPLE_DISTORTION_DEFAULTS, RIPPLE_QUALITIES, RIPPLE_TRIGGERS } from './source';

const meta = {
  title: 'React Bits/Animations/Ripple Distortion',
  component: RippleDistortion,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Ripple Distortion, commit 625f250, 2026-09-10. Mechanism: an ogl displacement field pushes an Academy photograph. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/ripple-distortion . Runtime ogl 1.0.11. Pause freezes the waves. Replay remounts the sketch. Tint default is brand blue #0035B1 (upstream #a855f7).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...RIPPLE_DISTORTION_DEFAULTS },
  argTypes: {
    brushSize: {
      control: { type: 'range', min: 20, max: 400, step: 10 },
      description: 'Wave radius in pixels. Upstream default 150.',
    },
    strength: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Displacement amount. Upstream default 0.2.',
    },
    swirl: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Rotation of the push. Upstream default 1.',
    },
    rings: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Rings in the brush. Upstream default 4.',
    },
    spread: {
      control: { type: 'range', min: 1, max: 12, step: 0.5 },
      description: 'How far the wave grows. Upstream default 5.',
    },
    fade: {
      control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
      description: 'Wave life in seconds. Upstream default 3.',
    },
    spacing: {
      control: { type: 'range', min: 1, max: 60, step: 1 },
      description: 'Pixels between hover waves. Upstream default 15.',
    },
    dispersion: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'RGB split. Upstream default 0.',
    },
    glint: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Specular highlight. Upstream default 0.',
    },
    tint: {
      control: 'color',
      description: 'Tint colour. Brand blue #0035B1. Upstream default #a855f7.',
    },
    tintAmount: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Tint mix. Upstream default 0.1.',
    },
    grayscale: {
      control: 'boolean',
      description: 'Grey the photograph. Upstream default true.',
    },
    highlightColor: {
      control: 'color',
      description: 'Glint colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    trigger: {
      control: 'select',
      options: [...RIPPLE_TRIGGERS],
      description: 'How waves start. Upstream default hover.',
    },
    clickStrength: {
      control: { type: 'range', min: 1, max: 6, step: 0.1 },
      description: 'Click wave power. Upstream default 2.',
    },
    quality: {
      control: 'select',
      options: [...RIPPLE_QUALITIES],
      description: 'Displacement field scale. Upstream default low.',
    },
    enabled: {
      control: 'boolean',
      description: 'Accept pointer waves. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the photograph with one still ripple.',
    },
  },
} satisfies Meta<typeof RippleDistortion>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const CLEAR = '#000000';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Ripple Distortion' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('ripple-distortion-stage');
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
  const host = stage.querySelector('.ripple-distortion') ?? canvasEl;
  await expect(host).not.toBeNull();
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, CLEAR, { grid: 16, timeoutMs: 6000 });
  for (let i = 0; i < 10; i += 1) {
    movePointer(host as HTMLElement, 40 + i * 18, 50 + (i % 4) * 16);
  }
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, CLEAR, { grid: 16, timeoutMs: 6000 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...RIPPLE_DISTORTION_DEFAULTS },
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

export const ColourClick: Story = {
  args: {
    ...RIPPLE_DISTORTION_DEFAULTS,
    grayscale: false,
    trigger: 'both',
    tint: '#DEF54F',
    glint: 0.6,
    dispersion: 0.4,
    quality: 'medium',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-grayscale', 'false');
    await expect(stage).toHaveAttribute('data-trigger', 'both');
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...RIPPLE_DISTORTION_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.dataset.webgl === 'ready') {
      const canvasEl = stage.querySelector('canvas');
      await expect(canvasEl).not.toBeNull();
      await assertCanvasPainted(canvasEl as HTMLCanvasElement, CLEAR, { grid: 16, timeoutMs: 6000 });
    }
    await playPause(canvas, stage);
  },
};
