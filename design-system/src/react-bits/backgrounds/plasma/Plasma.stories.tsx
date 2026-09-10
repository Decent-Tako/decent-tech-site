import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { Plasma } from './Plasma';
import { PLASMA_DEFAULTS, PLASMA_DIRECTIONS } from './source';

// The stage is ink; the canvas is transparent over it.
const STAGE_INK = '#212121';

const meta = {
  title: 'React Bits/Backgrounds/Plasma',
  component: Plasma,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Plasma, commit 625f250, 2026-09-10. Mechanism: one WebGL 2 fragment shader raymarches a twisted tube and tints it with one colour; the pointer bends the field. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/plasma . Runtime ogl 1.0.11. Pause stops the loop through the local paused prop. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PLASMA_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Tint of the plasma. Brand accent yellow. Upstream default #ffffff.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Time multiplier. Upstream default 1.',
    },
    direction: {
      control: 'select',
      options: [...PLASMA_DIRECTIONS],
      description: 'Time direction. Upstream default forward.',
    },
    scale: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Zoom around the centre. Upstream default 1.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha of the plasma. Upstream default 1.',
    },
    mouseInteractive: {
      control: 'boolean',
      description: 'The pointer bends the field. Upstream default true.',
    },
    renderScale: {
      control: { type: 'range', min: 0.2, max: 1, step: 0.05 },
      description: 'Buffer size as a share of the box. Upstream default 0.55.',
    },
    maxDpr: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.25 },
      description: 'Cap on devicePixelRatio. Upstream default 1.5.',
    },
    targetFps: {
      control: { type: 'range', min: 10, max: 60, step: 5 },
      description: 'Frame rate the loop aims for. Upstream default 60.',
    },
    iterations: {
      control: { type: 'range', min: 10, max: 60, step: 5 },
      description: 'Raymarch steps. Upstream default 60.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Paint pigment on white instead of light on black. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused on one static frame.',
    },
  },
} satisfies Meta<typeof Plasma>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Plasma' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('plasma-stage');
  await waitFor(() => {
    expect(stage).not.toHaveAttribute('data-webgl', 'pending');
  }, SLOW);
  if (stage.dataset.webgl === 'unavailable') {
    await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    return { stage, ready: false };
  }
  await expect(stage).toHaveAttribute('data-webgl', 'ready');
  return { stage, ready: true };
}

async function playPoint(stage: HTMLElement) {
  const surface = stage.querySelector('.plasma-container');
  const sketch = stage.querySelector('canvas');
  if (!(surface instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Plasma container or canvas is missing.');
  }
  const rect = surface.getBoundingClientRect();
  fireEvent.mouseMove(surface, { clientX: rect.left + 240, clientY: rect.top + 120 });
  await assertCanvasPainted(sketch, STAGE_INK);
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
}

export const Default: Story = {
  args: { ...PLASMA_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    await playReady(canvas);
  },
};

export const PingpongLight: Story = {
  args: { ...PLASMA_DEFAULTS, direction: 'pingpong', lightMode: true, speed: 2 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PLASMA_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
  },
};
