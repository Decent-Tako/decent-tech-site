import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { SideRays } from './SideRays';
import { SIDE_RAYS_DEFAULTS, SIDE_RAYS_ORIGINS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Side Rays',
  component: SideRays,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Side Rays, commit 625f250, 2026-09-10. Mechanism: ogl pair of animated rays from a corner. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/side-rays . Runtime ogl 1.0.11. Pause holds iTime after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SIDE_RAYS_DEFAULTS },
  argTypes: {
    speed: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Time scale. Upstream default 2.5.',
    },
    rayColor1: {
      control: 'color',
      description: 'First ray. Brand accent-yellow #DEF54F. Upstream default #EAB308.',
    },
    rayColor2: {
      control: 'color',
      description: 'Second ray. Brand paper #FFFFFF. Upstream default #96c8ff.',
    },
    intensity: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Brightness. Upstream default 2.',
    },
    spread: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Cone spread. Upstream default 2.',
    },
    origin: {
      control: 'select',
      options: [...SIDE_RAYS_ORIGINS],
      description: 'Ray origin. Upstream default top-right.',
    },
    tilt: {
      control: { type: 'range', min: -90, max: 90, step: 1 },
      description: 'Tilt in degrees. Upstream default 0.',
    },
    saturation: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Saturation. Upstream default 1.5.',
    },
    blend: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Mix of the two rays. Upstream default 0.75.',
    },
    falloff: {
      control: { type: 'range', min: 0.4, max: 4, step: 0.1 },
      description: 'Distance falloff. Upstream default 1.6.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the rays after a short warm-up.',
    },
  },
} satisfies Meta<typeof SideRays>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Side Rays' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('side-rays-stage');
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
  args: { ...SIDE_RAYS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.side-rays-container') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const BottomLeft: Story = {
  args: {
    ...SIDE_RAYS_DEFAULTS,
    origin: 'bottom-left',
    tilt: 20,
    intensity: 3,
    rayColor1: '#0035B1',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-origin', 'bottom-left');
    await playPaint(stage);
    const hit = stage.querySelector('.side-rays-container') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SIDE_RAYS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
