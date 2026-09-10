import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { Strands } from './Strands';
import { STRANDS_DEFAULTS } from './source';

const STAGE_INK = '#212121';

const meta = {
  title: 'React Bits/Animations/Strands',
  component: Strands,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Strands, commit 625f250, 2026-09-10. Mechanism: a WebGL 2 fragment shader draws glowing sine ribbons, with an optional glass refraction pass. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/strands . Runtime ogl 1.0.11. Pause holds the time step through the local paused prop. Replay remounts the upstream component. Colour default is brand accent blue, accent yellow, paper, and ink (upstream #FF4242, #7C3AED, #06B6D4, #EAB308).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...STRANDS_DEFAULTS },
  argTypes: {
    colors: {
      control: 'object',
      description:
        'Palette of hex colours, up to eight. Brand accent blue, accent yellow, paper, ink. Upstream default ["#FF4242", "#7C3AED", "#06B6D4", "#EAB308"].',
    },
    count: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'How many ribbons the shader draws. Upstream default 3.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Time multiplier for the sine pair. Upstream default 0.5.',
    },
    amplitude: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Vertical size of each ribbon. Upstream default 1.',
    },
    waviness: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Spatial frequency of the sine pair. Upstream default 1.',
    },
    thickness: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Ribbon width. Upstream default 0.7.',
    },
    glow: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.1 },
      description: 'Exposure of the colour sum. Upstream default 2.6.',
    },
    taper: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'How fast the ribbons fade at the sides. Upstream default 3.',
    },
    spread: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Phase offset between ribbons. Upstream default 1.',
    },
    hueShift: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Palette walk along each ribbon. Upstream default 0.',
    },
    intensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Envelope strength. Upstream default 0.6.',
    },
    saturation: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Colour versus grey. Upstream default 1.5.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha of the ribbons. Upstream default 1.',
    },
    scale: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.05 },
      description: 'Zoom of the shader space. Upstream default 1.5.',
    },
    glass: {
      control: 'boolean',
      description: 'Refract the scene through a sphere. Upstream default false.',
    },
    refraction: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Glass bend at the rim. Upstream default 1.',
    },
    dispersion: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Chromatic split at the rim. Upstream default 1.',
    },
    glassSize: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Radius of the glass sphere. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused at speed 0.',
    },
  },
} satisfies Meta<typeof Strands>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Strands' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('strands-stage');
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

async function playPaint(stage: HTMLElement) {
  const sketch = stage.querySelector('canvas');
  if (!(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Strands canvas is missing.');
  }
  await assertCanvasPainted(sketch, STAGE_INK);
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...STRANDS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) {
      await playPaint(stage);
      await playPaint(stage);
    }
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    const after = await playReady(canvas);
    if (after.ready) await playPaint(after.stage);
  },
};

export const GlassLens: Story = {
  args: { ...STRANDS_DEFAULTS, glass: true, count: 6, glow: 3.4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-glass', 'true');
    if (ready) await playPaint(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...STRANDS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (ready) await expect(stage.querySelector('canvas')).not.toBeNull();
    await playPause(canvas, stage);
  },
};
