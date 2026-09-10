import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { LightRays } from './LightRays';
import { LIGHT_RAYS_DEFAULTS, RAYS_ORIGINS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Light Rays',
  component: LightRays,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Light Rays, commit 625f250, 2026-09-10. Mechanism: ogl God rays from an origin, with optional pointer steer. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/light-rays . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LIGHT_RAYS_DEFAULTS },
  argTypes: {
    raysOrigin: {
      control: 'select',
      options: [...RAYS_ORIGINS],
      description: 'Ray source. Upstream default top-center.',
    },
    raysColor: {
      control: 'color',
      description: 'Ray tint. Brand accent-yellow #DEF54F. Upstream default #ffffff.',
    },
    raysSpeed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Time scale. Upstream default 1.',
    },
    lightSpread: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Cone width. Upstream default 1.',
    },
    rayLength: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Falloff length. Upstream default 2.',
    },
    pulsating: {
      control: 'boolean',
      description: 'Pulse the strength. Upstream default false.',
    },
    fadeDistance: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Distance fade. Upstream default 1.',
    },
    saturation: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Colour mix. Upstream default 1.',
    },
    followMouse: {
      control: 'boolean',
      description: 'Pointer steer. Upstream default true.',
    },
    mouseInfluence: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer mix. Upstream default 0.1.',
    },
    noiseAmount: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Grain. Upstream default 0.',
    },
    distortion: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Angle wobble. Upstream default 0.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the rays still.',
    },
  },
} satisfies Meta<typeof LightRays>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Light Rays' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('light-rays-stage');
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
  args: { ...LIGHT_RAYS_DEFAULTS },
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

export const BottomLeftPulse: Story = {
  args: {
    ...LIGHT_RAYS_DEFAULTS,
    raysOrigin: 'bottom-left',
    pulsating: true,
    distortion: 0.4,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LIGHT_RAYS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
