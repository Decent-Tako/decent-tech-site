import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Lightfall } from './Lightfall';
import { LIGHTFALL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Lightfall',
  component: Lightfall,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Lightfall, commit 625f250, 2026-09-10. Mechanism: ogl raymarch of falling colour streaks with pointer glow. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/lightfall . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LIGHTFALL_DEFAULTS },
  argTypes: {
    colors: {
      control: 'object',
      description: 'Streak palette. Brand #0035B1, #DEF54F, #FFFFFF. Upstream default #A6C8FF, #5227FF, #FF9FFC.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Glow colour. Brand ink #212121. Upstream default #0A29FF.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Fall speed. Upstream default 0.5.',
    },
    streakCount: {
      control: { type: 'range', min: 1, max: 16, step: 1 },
      description: 'Streak layers. Upstream default 2.',
    },
    streakWidth: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Streak width. Upstream default 1.',
    },
    streakLength: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Tail length. Upstream default 1.',
    },
    glow: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Streak glow. Upstream default 1.',
    },
    density: {
      control: { type: 'range', min: 0.05, max: 2, step: 0.05 },
      description: 'Ring density. Upstream default 0.6.',
    },
    twinkle: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Twinkle mix. Upstream default 1.',
    },
    zoom: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Camera zoom. Upstream default 3.',
    },
    backgroundGlow: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Centre glow. Upstream default 0.5.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Master opacity. Upstream default 1.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer glow. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pointer glow amount. Upstream default 0.5.',
    },
    mouseRadius: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Pointer radius. Upstream default 1.',
    },
    mouseDampening: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer lag. Upstream default 0.15.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the streaks still.',
    },
  },
} satisfies Meta<typeof Lightfall>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Lightfall' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('lightfall-stage');
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
  args: { ...LIGHTFALL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const DenseStreaks: Story = {
  args: {
    ...LIGHTFALL_DEFAULTS,
    streakCount: 8,
    density: 1.2,
    mouseStrength: 1,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LIGHTFALL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
