import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { PrismaticBurst } from './PrismaticBurst';
import {
  PRISMATIC_BURST_ANIMATION_TYPES,
  PRISMATIC_BURST_BLEND_MODES,
  PRISMATIC_BURST_DEFAULTS,
} from './source';

const meta = {
  title: 'React Bits/Backgrounds/Prismatic Burst',
  component: PrismaticBurst,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Prismatic Burst, commit 625f250, 2026-09-10. Mechanism: WebGL 2 burst of rays on ogl with rotate, rotate3d, or hover. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/prismatic-burst . Runtime ogl 1.0.11. Pause holds uTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PRISMATIC_BURST_DEFAULTS },
  argTypes: {
    intensity: {
      control: { type: 'range', min: 0.2, max: 5, step: 0.1 },
      description: 'Ray brightness. Upstream default 2.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.5.',
    },
    animationType: {
      control: 'select',
      options: [...PRISMATIC_BURST_ANIMATION_TYPES],
      description: 'Motion mode. Upstream default rotate3d.',
    },
    colors: {
      control: 'object',
      description:
        'Ramp stops. Brand accent-blue, accent-yellow, paper. Upstream default unset (white ramp).',
    },
    distort: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Warp amount. Upstream default 0.',
    },
    offset: {
      control: 'object',
      description: 'Pixel shift of the burst. Upstream default { x: 0, y: 0 }.',
    },
    hoverDampness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer smoothing. Upstream default 0.',
    },
    rayCount: {
      control: { type: 'range', min: 0, max: 64, step: 1 },
      description: 'Ray count. 0 uses the shader default. Upstream default 0.',
    },
    mixBlendMode: {
      control: 'select',
      options: [...PRISMATIC_BURST_BLEND_MODES],
      description: 'Canvas blend. Upstream default lighten.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Paint pigment on white. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the burst after a short warm-up.',
    },
  },
} satisfies Meta<typeof PrismaticBurst>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Prismatic Burst' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('prismatic-burst-stage');
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
  args: { ...PRISMATIC_BURST_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.prismatic-burst-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const HoverDistort: Story = {
  args: {
    ...PRISMATIC_BURST_DEFAULTS,
    animationType: 'hover',
    distort: 1.2,
    hoverDampness: 0.4,
    intensity: 3,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-animation', 'hover');
    await playPaint(stage);
    const hit = stage.querySelector('.prismatic-burst-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PRISMATIC_BURST_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
