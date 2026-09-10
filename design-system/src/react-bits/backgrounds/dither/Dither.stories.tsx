import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Dither } from './Dither';
import { DITHER_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Dither',
  component: Dither,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Dither, commit 625f250, 2026-09-10. Mechanism: three.js noise wave plus a Bayer dither pass. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/dither . Runtime three 0.180.0 and postprocessing 6.39.5. Pause holds time. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DITHER_DEFAULTS },
  argTypes: {
    waveSpeed: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Wave travel. Upstream default 0.05.',
    },
    waveFrequency: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Noise frequency. Upstream default 3.',
    },
    waveAmplitude: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Octave falloff. Upstream default 0.3.',
    },
    waveColor: {
      control: 'object',
      description: 'Wave RGB 0–1. Brand accent-blue. Upstream default 0.5, 0.5, 0.5.',
    },
    backgroundColor: {
      control: 'object',
      description: 'Field RGB 0–1. Brand ink. Upstream default 0, 0, 0.',
    },
    colorNum: {
      control: { type: 'range', min: 2, max: 16, step: 1 },
      description: 'Dither palette size. Upstream default 4.',
    },
    pixelSize: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      description: 'Dither pixel size. Upstream default 2.',
    },
    disableAnimation: {
      control: 'boolean',
      description: 'Hold time. Upstream default false.',
    },
    enableMouseInteraction: {
      control: 'boolean',
      description: 'Pointer dents the wave. Upstream default true.',
    },
    mouseRadius: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Pointer radius. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the wave still.',
    },
  },
} satisfies Meta<typeof Dither>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Dither' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('dither-stage');
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
  args: { ...DITHER_DEFAULTS },
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

export const CoarsePixels: Story = {
  args: { ...DITHER_DEFAULTS, pixelSize: 6, colorNum: 3, waveFrequency: 4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...DITHER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
