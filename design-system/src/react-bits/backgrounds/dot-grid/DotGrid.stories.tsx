import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { DotGrid } from './DotGrid';
import { DOT_GRID_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Dot Grid',
  component: DotGrid,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Dot Grid, commit 625f250, 2026-09-10. Mechanism: 2D canvas dots with gsap inertia on pointer speed and click. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/dot-grid . Runtime gsap 3.15.0. Pause holds the gsap timeline. Replay remounts the grid.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DOT_GRID_DEFAULTS },
  argTypes: {
    dotSize: {
      control: { type: 'range', min: 4, max: 32, step: 1 },
      description: 'Dot diameter in pixels. Upstream default 16.',
    },
    gap: {
      control: { type: 'range', min: 8, max: 64, step: 1 },
      description: 'Gap between dots. Upstream default 32.',
    },
    baseColor: {
      control: 'color',
      description: 'Idle colour. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    activeColor: {
      control: 'color',
      description: 'Near-pointer colour. Brand accent-yellow #DEF54F. Upstream default #5227FF.',
    },
    proximity: {
      control: { type: 'range', min: 20, max: 400, step: 10 },
      description: 'Colour and inertia radius. Upstream default 150.',
    },
    speedTrigger: {
      control: { type: 'range', min: 10, max: 400, step: 10 },
      description: 'Pointer speed that starts inertia. Upstream default 100.',
    },
    shockRadius: {
      control: { type: 'range', min: 40, max: 500, step: 10 },
      description: 'Click shock radius. Upstream default 250.',
    },
    shockStrength: {
      control: { type: 'range', min: 0, max: 20, step: 0.5 },
      description: 'Click push. Upstream default 5.',
    },
    maxSpeed: {
      control: { type: 'range', min: 200, max: 8000, step: 100 },
      description: 'Pointer speed clamp. Upstream default 5000.',
    },
    resistance: {
      control: { type: 'range', min: 100, max: 2000, step: 50 },
      description: 'Inertia resistance. Upstream default 750.',
    },
    returnDuration: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Return tween length in seconds. Upstream default 1.5.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the grid still.',
    },
  },
} satisfies Meta<typeof DotGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Dot Grid' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('dot-grid-stage');
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
  args: { ...DOT_GRID_DEFAULTS },
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

export const TightGrid: Story = {
  args: { ...DOT_GRID_DEFAULTS, dotSize: 10, gap: 18, proximity: 90 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...DOT_GRID_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
