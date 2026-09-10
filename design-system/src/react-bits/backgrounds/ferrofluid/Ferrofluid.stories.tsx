import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Ferrofluid } from './Ferrofluid';
import { FERROFLUID_DEFAULTS, FLOW_DIRECTIONS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Ferrofluid',
  component: Ferrofluid,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Ferrofluid, commit 625f250, 2026-09-10. Mechanism: ogl ferrofluid field with time, flow, and a pointer glow. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/ferrofluid . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FERROFLUID_DEFAULTS },
  argTypes: {
    colors: {
      control: 'object',
      description:
        'Palette of up to eight stops. Brand accent-blue, accent-yellow, paper. Upstream default #ffffff, #ffffff, #ffffff.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Time scale of the flow. Upstream default 0.5.',
    },
    scale: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Field scale. Upstream default 1.6.',
    },
    turbulence: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Noise warp. Upstream default 1.',
    },
    fluidity: {
      control: { type: 'range', min: 0.001, max: 1, step: 0.01 },
      description: 'Soft-min blend of the two peak fields. Upstream default 0.1.',
    },
    rimWidth: {
      control: { type: 'range', min: 0.02, max: 1, step: 0.02 },
      description: 'Width of the lit rim. Upstream default 0.2.',
    },
    sharpness: {
      control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
      description: 'Rim power. Upstream default 2.5.',
    },
    shimmer: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Noise on the rim. Upstream default 1.5.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Rim brightness. Upstream default 2.',
    },
    flowDirection: {
      control: 'select',
      options: [...FLOW_DIRECTIONS],
      description: 'Flow vector. Upstream default down.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Output alpha. Upstream default 1.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer glow. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Pointer glow amount. Upstream default 1.',
    },
    mouseRadius: {
      control: { type: 'range', min: 0.02, max: 1, step: 0.01 },
      description: 'Pointer glow radius. Upstream default 0.35.',
    },
    mouseDampening: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Pointer lerp time. Upstream default 0.15.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the field still.',
    },
  },
} satisfies Meta<typeof Ferrofluid>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Ferrofluid' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('ferrofluid-stage');
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
  args: { ...FERROFLUID_DEFAULTS },
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

export const FlowUp: Story = {
  args: { ...FERROFLUID_DEFAULTS, flowDirection: 'up', turbulence: 1.8 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FERROFLUID_DEFAULTS, reducedMotion: 'always' },
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
