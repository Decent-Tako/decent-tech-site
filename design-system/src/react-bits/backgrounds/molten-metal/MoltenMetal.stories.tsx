import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { MoltenMetal } from './MoltenMetal';
import { MOLTEN_METAL_COLOR_MODES, MOLTEN_METAL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Molten Metal',
  component: MoltenMetal,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Molten Metal, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 fold-and-glow metal field with three colour stops. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/molten-metal . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MOLTEN_METAL_DEFAULTS },
  argTypes: {
    color1: {
      control: 'color',
      description: 'Low-intensity stop. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    color2: {
      control: 'color',
      description: 'Mid-intensity stop. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    color3: {
      control: 'color',
      description: 'High-intensity stop. Brand paper #FFFFFF. Upstream default #FFFFFF.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.35.',
    },
    scale: {
      control: { type: 'range', min: 1, max: 10, step: 0.5 },
      description: 'Field zoom. Upstream default 4.',
    },
    detail: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      description: 'Fold iterations. Upstream default 3.',
    },
    glow: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Glow strength. Upstream default 1.6.',
    },
    coreSize: {
      control: { type: 'range', min: 0.01, max: 0.6, step: 0.01 },
      description: 'Glow core radius. Upstream default 0.1.',
    },
    swirl: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Rotation amount. Upstream default 1.',
    },
    fold: {
      control: { type: 'range', min: -1, max: 1, step: 0.05 },
      description: 'Warp matrix scale. Upstream default -0.2.',
    },
    blackPoint: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Intensity floor. Upstream default 0.05.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Intensity scale. Upstream default 1.3.',
    },
    colorMode: {
      control: 'select',
      options: [...MOLTEN_METAL_COLOR_MODES],
      description: 'Mix mid-point. Upstream default molten.',
    },
    grain: {
      control: 'boolean',
      description: 'Hash grain. Upstream default true.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Grain amount. Upstream default 0.05.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer drift. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer drift scale. Upstream default 0.3.',
    },
    opacity: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Alpha scale. Upstream default 1.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Light-mode mix colour. Upstream default #FFFFFF.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the field after a short warm-up.',
    },
  },
} satisfies Meta<typeof MoltenMetal>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Molten Metal' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('molten-metal-stage');
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
  args: { ...MOLTEN_METAL_DEFAULTS },
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

export const Ember: Story = {
  args: { ...MOLTEN_METAL_DEFAULTS, colorMode: 'ember', glow: 2.2, speed: 0.5 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-mode', 'ember');
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MOLTEN_METAL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
