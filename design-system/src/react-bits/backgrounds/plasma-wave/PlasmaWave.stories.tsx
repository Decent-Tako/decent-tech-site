import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { PlasmaWave } from './PlasmaWave';
import { PLASMA_WAVE_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Plasma Wave',
  component: PlasmaWave,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Plasma Wave, commit 625f250, 2026-09-10. Mechanism: ogl raymarch of two bent colour tubes. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/plasma-wave . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PLASMA_WAVE_DEFAULTS },
  argTypes: {
    xOffset: {
      control: { type: 'range', min: -200, max: 200, step: 1 },
      description: 'View x shift. Upstream default 0.',
    },
    yOffset: {
      control: { type: 'range', min: -200, max: 200, step: 1 },
      description: 'View y shift. Upstream default 0.',
    },
    rotationDeg: {
      control: { type: 'range', min: -180, max: 180, step: 1 },
      description: 'View rotation in degrees. Upstream default 0.',
    },
    focalLength: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Ray focal length. Upstream default 0.8.',
    },
    speed1: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Tube 1 speed. Upstream default 0.05.',
    },
    speed2: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Tube 2 speed. Upstream default 0.05.',
    },
    dir2: {
      control: { type: 'range', min: -2, max: 2, step: 0.1 },
      description: 'Tube 2 direction. Upstream default 1.',
    },
    bend1: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Tube 1 bend. Upstream default 1.',
    },
    bend2: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Tube 2 bend. Upstream default 0.5.',
    },
    colors: {
      control: 'object',
      description: 'Two-stop palette. Brand #0035B1, #DEF54F. Upstream default #A855F7, #06B6D4.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the tubes after a short warm-up.',
    },
  },
} satisfies Meta<typeof PlasmaWave>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Plasma Wave' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('plasma-wave-stage');
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
  await expect(stage).toHaveTextContent('Six weeks');
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
  args: { ...PLASMA_WAVE_DEFAULTS },
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

export const Rotated: Story = {
  args: { ...PLASMA_WAVE_DEFAULTS, rotationDeg: 35, bend1: 1.4, speed1: 0.08 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-rotation', '35');
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PLASMA_WAVE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
