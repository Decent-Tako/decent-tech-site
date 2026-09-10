import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Silk } from './Silk';
import { SILK_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Silk',
  component: Silk,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Silk, commit 625f250, 2026-09-10. Mechanism: a three.js silk noise plane. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/silk . Runtime three 0.180.0. Pause holds uTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SILK_DEFAULTS },
  argTypes: {
    speed: {
      control: { type: 'range', min: 0, max: 12, step: 0.1 },
      description: 'Time scale. Upstream default 5.',
    },
    scale: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'UV scale of the folds. Upstream default 1.',
    },
    color: {
      control: 'color',
      description: 'Silk colour. Brand charcoal #4A4A4A. Upstream default #7B7481.',
    },
    noiseIntensity: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Grain strength. Upstream default 1.5.',
    },
    rotation: {
      control: { type: 'range', min: 0, max: 6.28, step: 0.05 },
      description: 'UV rotation in radians. Upstream default 0.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-paper fold shading. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the silk after a short warm-up.',
    },
  },
} satisfies Meta<typeof Silk>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Silk' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('silk-stage');
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
  args: { ...SILK_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.silk-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const LightMode: Story = {
  args: {
    ...SILK_DEFAULTS,
    lightMode: true,
    rotation: 0.6,
    noiseIntensity: 2.2,
    color: '#0035B1',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-light', 'true');
    await playPaint(stage);
    const hit = stage.querySelector('.silk-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SILK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
