import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { DarkVeil } from './DarkVeil';
import { DARK_VEIL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Dark Veil',
  component: DarkVeil,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Dark Veil, commit 625f250, 2026-09-10. Mechanism: ogl CPPN colour field with hue, warp, noise, and scanlines. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/dark-veil . Runtime ogl 1.0.11. Pause holds uTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DARK_VEIL_DEFAULTS },
  argTypes: {
    hueShift: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      description: 'Hue rotation in degrees. Upstream default 0.',
    },
    noiseIntensity: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Grain amount. Upstream default 0.',
    },
    scanlineIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Scanline mix. Upstream default 0.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Time scale. Upstream default 0.5.',
    },
    scanlineFrequency: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'Scanline frequency. Upstream default 0.',
    },
    warpAmount: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'UV warp. Upstream default 0.',
    },
    resolutionScale: {
      control: { type: 'range', min: 0.25, max: 2, step: 0.25 },
      description: 'Internal resolution scale. Upstream default 1.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds time still.',
    },
  },
} satisfies Meta<typeof DarkVeil>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Dark Veil' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('dark-veil-stage');
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
  args: { ...DARK_VEIL_DEFAULTS },
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

export const Scanlines: Story = {
  args: {
    ...DARK_VEIL_DEFAULTS,
    scanlineIntensity: 0.45,
    scanlineFrequency: 2.5,
    warpAmount: 1.2,
    hueShift: 40,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...DARK_VEIL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
