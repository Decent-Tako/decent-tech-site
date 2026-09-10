import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Radar } from './Radar';
import { RADAR_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Radar',
  component: Radar,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Radar, commit 625f250, 2026-09-10. Mechanism: ogl rings, spokes, and a sweep, with optional pointer warp. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/radar . Runtime ogl 1.0.11. Pause holds uTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...RADAR_DEFAULTS },
  argTypes: {
    speed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Time scale. Upstream default 1.',
    },
    scale: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Pattern zoom. Upstream default 0.5.',
    },
    ringCount: {
      control: { type: 'range', min: 1, max: 24, step: 1 },
      description: 'Ring count. Upstream default 10.',
    },
    spokeCount: {
      control: { type: 'range', min: 1, max: 24, step: 1 },
      description: 'Spoke count. Upstream default 10.',
    },
    ringThickness: {
      control: { type: 'range', min: 0.01, max: 0.2, step: 0.005 },
      description: 'Ring width. Upstream default 0.05.',
    },
    spokeThickness: {
      control: { type: 'range', min: 0.002, max: 0.08, step: 0.002 },
      description: 'Spoke width. Upstream default 0.01.',
    },
    sweepSpeed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Sweep rate. Upstream default 1.',
    },
    sweepWidth: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Sweep width. Upstream default 2.',
    },
    sweepLobes: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      description: 'Sweep lobes. Upstream default 1.',
    },
    color: {
      control: 'color',
      description: 'Sweep colour. Brand accent-blue #0035B1. Upstream default #9f29ff.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Disc colour. Brand ink #212121. Upstream default #000000.',
    },
    falloff: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Edge falloff. Upstream default 2.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Brightness. Upstream default 1.',
    },
    enableMouseInteraction: {
      control: 'boolean',
      description: 'Pointer warp. Upstream default true.',
    },
    mouseInfluence: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer strength. Upstream default 0.1.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Paint pigment on white. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the radar after a short warm-up.',
    },
  },
} satisfies Meta<typeof Radar>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Radar' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('radar-stage');
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
  await expect(stage).toHaveTextContent('Tracker and plan');
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
  args: { ...RADAR_DEFAULTS },
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

export const DenseSweep: Story = {
  args: {
    ...RADAR_DEFAULTS,
    ringCount: 16,
    spokeCount: 16,
    sweepLobes: 3,
    sweepSpeed: 1.8,
    color: '#DEF54F',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...RADAR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
