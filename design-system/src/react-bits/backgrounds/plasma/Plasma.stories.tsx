import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Plasma } from './Plasma';
import { PLASMA_DEFAULTS, PLASMA_DIRECTIONS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Plasma',
  component: Plasma,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Plasma, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 raymarch of a plasma tube. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/plasma . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PLASMA_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Tint. Brand accent-blue #0035B1. Upstream default #ffffff.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Time scale. Upstream default 1.',
    },
    direction: {
      control: 'select',
      options: [...PLASMA_DIRECTIONS],
      description: 'Time direction. Upstream default forward.',
    },
    scale: {
      control: { type: 'range', min: 0.4, max: 3, step: 0.1 },
      description: 'Field zoom. Upstream default 1.',
    },
    opacity: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Alpha scale. Upstream default 1.',
    },
    mouseInteractive: {
      control: 'boolean',
      description: 'Pointer warp. Upstream default true.',
    },
    renderScale: {
      control: { type: 'range', min: 0.25, max: 1, step: 0.05 },
      description: 'Internal buffer scale. Upstream default 0.55.',
    },
    maxDpr: {
      control: { type: 'range', min: 1, max: 2, step: 0.25 },
      description: 'DPR cap. Upstream default 1.5.',
    },
    targetFps: {
      control: { type: 'range', min: 15, max: 60, step: 5 },
      description: 'Frame cap. Upstream default 60.',
    },
    iterations: {
      control: { type: 'range', min: 10, max: 80, step: 5 },
      description: 'Raymarch steps. Upstream default 60.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the field after a short warm-up.',
    },
  },
} satisfies Meta<typeof Plasma>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Plasma' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('plasma-stage');
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
  args: { ...PLASMA_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.plasma-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const Reverse: Story = {
  args: { ...PLASMA_DEFAULTS, direction: 'reverse', scale: 1.4, speed: 1.4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-direction', 'reverse');
    await playPaint(stage);
    const hit = stage.querySelector('.plasma-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PLASMA_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
