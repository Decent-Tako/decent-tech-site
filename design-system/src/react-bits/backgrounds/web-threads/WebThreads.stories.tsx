import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { WebThreads } from './WebThreads';
import { WEB_THREADS_DEFAULTS, WEB_THREADS_FAN_MODES } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Web Threads',
  component: WebThreads,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Web Threads, commit 625f250, 2026-09-10. Mechanism: an ogl fan of sine threads with optional pointer pinch. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/web-threads . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...WEB_THREADS_DEFAULTS },
  argTypes: {
    color1: {
      control: 'color',
      description: 'First thread. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    color2: {
      control: 'color',
      description: 'Last thread. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    color3: {
      control: 'color',
      description: 'Core mix. Brand paper #FFFFFF. Upstream default #FFFFFF.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Phase speed. Upstream default 0.2.',
    },
    threadCount: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Thread count. Upstream default 6.',
    },
    frequency: {
      control: { type: 'range', min: 1, max: 12, step: 0.5 },
      description: 'Sine frequency. Upstream default 5.',
    },
    spread: {
      control: { type: 'range', min: 0.02, max: 0.6, step: 0.01 },
      description: 'Fan spread. Upstream default 0.18.',
    },
    taper: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Spread taper. Upstream default 1.',
    },
    position: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Vertical origin. Upstream default 0.5.',
    },
    fanMode: {
      control: 'select',
      options: [...WEB_THREADS_FAN_MODES],
      description: 'Fan origin. Upstream default center.',
    },
    glow: {
      control: { type: 'range', min: 0.005, max: 0.1, step: 0.005 },
      description: 'Glow amount. Upstream default 0.02.',
    },
    falloff: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Glow falloff. Upstream default 0.6.',
    },
    thickness: {
      control: { type: 'range', min: 0.3, max: 3, step: 0.1 },
      description: 'Thread thickness. Upstream default 1.1.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Brightness. Upstream default 0.6.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha. Upstream default 1.',
    },
    mirror: {
      control: 'boolean',
      description: 'Mirror phase across the pinch. Upstream default true.',
    },
    shimmer: {
      control: 'boolean',
      description: 'Per-thread shimmer. Upstream default false.',
    },
    grain: {
      control: 'boolean',
      description: 'Film grain. Upstream default true.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Grain strength. Upstream default 0.05.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer pinches the fan. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer pinch amount. Upstream default 0.3.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Light-mode fill. Brand paper #FFFFFF. Upstream default #FFFFFF.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-paper mapping. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the threads after a short warm-up.',
    },
  },
} satisfies Meta<typeof WebThreads>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Web Threads' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('web-threads-stage');
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
  await expect(stage).toHaveTextContent('Six published weeks');
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
  args: { ...WEB_THREADS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.web-threads-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const FanLeft: Story = {
  args: {
    ...WEB_THREADS_DEFAULTS,
    fanMode: 'left',
    shimmer: true,
    threadCount: 8,
    spread: 0.28,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-fan', 'left');
    await playPaint(stage);
    const hit = stage.querySelector('.web-threads-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...WEB_THREADS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
