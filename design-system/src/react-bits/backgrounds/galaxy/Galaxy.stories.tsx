import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { Galaxy } from './Galaxy';
import { GALAXY_DEFAULTS } from './source';

// The stage is ink; the canvas is transparent over it.
const STAGE_INK = '#212121';

const meta = {
  title: 'React Bits/Backgrounds/Galaxy',
  component: Galaxy,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Galaxy, commit 625f250, 2026-09-10. Mechanism: one ogl fragment shader hashes four layers of drifting, twinkling stars; the pointer pulls or repels the field. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/galaxy . Runtime ogl 1.0.11. Pause skips the render through the local paused prop. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GALAXY_DEFAULTS },
  argTypes: {
    focal: {
      control: 'object',
      description: 'Centre of the field as [x, y] in 0..1. Upstream default [0.5, 0.5].',
    },
    rotation: {
      control: 'object',
      description: 'Rotation as [cos, sin]. Upstream default [1, 0].',
    },
    starSpeed: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Drift speed of the stars. Upstream default 0.5.',
    },
    density: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Star count multiplier. Upstream default 1.',
    },
    hueShift: {
      control: { type: 'range', min: 0, max: 360, step: 5 },
      description: 'Hue rotation of the stars in degrees. Upstream default 140.',
    },
    disableAnimation: {
      control: 'boolean',
      description: 'Freeze time; the pointer still moves the field. Upstream default false.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Twinkle and rotation time multiplier. Upstream default 1.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'The pointer moves the field. Upstream default true.',
    },
    glowIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Halo around each star. Upstream default 0.3.',
    },
    saturation: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Colour saturation of the stars. Upstream default 0.',
    },
    mouseRepulsion: {
      control: 'boolean',
      description: 'The pointer pushes stars away. Upstream default true.',
    },
    repulsionStrength: {
      control: { type: 'range', min: 0, max: 10, step: 0.5 },
      description: 'Push strength. Upstream default 2.',
    },
    twinkleIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Twinkle depth. Upstream default 0.3.',
    },
    rotationSpeed: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Spin of the whole field. Upstream default 0.1.',
    },
    autoCenterRepulsion: {
      control: { type: 'range', min: 0, max: 10, step: 0.5 },
      description: 'Push away from the centre with no pointer. Upstream default 0.',
    },
    transparent: {
      control: 'boolean',
      description: 'Clear to transparent instead of black. Upstream default true.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Dark stars on white. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused on one still frame.',
    },
  },
} satisfies Meta<typeof Galaxy>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Galaxy' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('galaxy-stage');
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
  const surface = stage.querySelector('.galaxy-container');
  const sketch = stage.querySelector('canvas');
  if (!(surface instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Galaxy container or canvas is missing.');
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
  args: { ...GALAXY_DEFAULTS },
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

export const DenseSaturated: Story = {
  args: { ...GALAXY_DEFAULTS, density: 2, saturation: 0.8, hueShift: 40, glowIntensity: 0.6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GALAXY_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (ready) await playPoint(stage);
    await playPause(canvas, stage);
  },
};
