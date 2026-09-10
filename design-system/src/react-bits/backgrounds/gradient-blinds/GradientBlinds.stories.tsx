import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { GradientBlinds } from './GradientBlinds';
import { GRADIENT_BLINDS_DEFAULTS, SHINE_DIRECTIONS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Gradient Blinds',
  component: GradientBlinds,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Gradient Blinds, commit 625f250, 2026-09-10. Mechanism: ogl striped gradient revealed by a pointer spotlight. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/gradient-blinds . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GRADIENT_BLINDS_DEFAULTS },
  argTypes: {
    gradientColors: {
      control: 'object',
      description:
        'Gradient stops. Brand accent-blue and accent-yellow. Upstream default #FF9FFC, #5227FF.',
    },
    angle: {
      control: { type: 'range', min: -180, max: 180, step: 1 },
      description: 'Stripe angle in degrees. Upstream default 0.',
    },
    noise: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Grain amount. Upstream default 0.3.',
    },
    blindCount: {
      control: { type: 'range', min: 2, max: 48, step: 1 },
      description: 'Stripe count. Upstream default 16.',
    },
    blindMinWidth: {
      control: { type: 'range', min: 8, max: 200, step: 2 },
      description: 'Minimum stripe width in pixels. Upstream default 60.',
    },
    mouseDampening: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Pointer lerp time. Upstream default 0.15.',
    },
    mirrorGradient: {
      control: 'boolean',
      description: 'Mirror the ramp. Upstream default false.',
    },
    spotlightRadius: {
      control: { type: 'range', min: 0.05, max: 1.5, step: 0.05 },
      description: 'Pointer spotlight radius. Upstream default 0.5.',
    },
    spotlightSoftness: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Spotlight falloff. Upstream default 1.',
    },
    spotlightOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Spotlight mix. Upstream default 1.',
    },
    distortAmount: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'UV warp. Upstream default 0.',
    },
    shineDirection: {
      control: 'select',
      options: [...SHINE_DIRECTIONS],
      description: 'Stripe shine. Upstream default left.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the blinds still.',
    },
  },
} satisfies Meta<typeof GradientBlinds>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Gradient Blinds' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('gradient-blinds-stage');
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
  await expect(stage).toHaveTextContent('Public work');
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
  args: { ...GRADIENT_BLINDS_DEFAULTS },
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

export const ShineRight: Story = {
  args: {
    ...GRADIENT_BLINDS_DEFAULTS,
    shineDirection: 'right',
    distortAmount: 1.2,
    angle: 15,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GRADIENT_BLINDS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};
