import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { Ribbons } from './Ribbons';
import { RIBBONS_DEFAULTS } from './source';

// The stage is ink; the canvas is transparent over it.
const STAGE_INK = '#212121';

const meta = {
  title: 'React Bits/Animations/Ribbons',
  component: Ribbons,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Ribbons, commit 625f250, 2026-09-10. Mechanism: one ogl Polyline per colour springs its head to the pointer and drags a tail of points behind it. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/ribbons . Runtime ogl 1.0.11. Pause holds the step through the local paused prop. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...RIBBONS_DEFAULTS },
  argTypes: {
    colors: {
      control: 'object',
      description:
        'One ribbon per hex colour. Brand accent blue, accent yellow, paper. Upstream default ["#ff9346", "#7cff67", "#ffee51", "#5227FF"].',
    },
    baseSpring: {
      control: { type: 'range', min: 0.005, max: 0.2, step: 0.005 },
      description: 'Pull of the head towards the pointer. Upstream default 0.03.',
    },
    baseFriction: {
      control: { type: 'range', min: 0.5, max: 0.99, step: 0.01 },
      description: 'Velocity kept per frame. Upstream default 0.9.',
    },
    baseThickness: {
      control: { type: 'range', min: 2, max: 80, step: 1 },
      description: 'Line width in pixels. Upstream default 30.',
    },
    offsetFactor: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Sideways spread between ribbons. Upstream default 0.05.',
    },
    maxAge: {
      control: { type: 'range', min: 50, max: 2000, step: 50 },
      description: 'Milliseconds a point takes to reach the one before it. Upstream default 500.',
    },
    pointCount: {
      control: { type: 'range', min: 5, max: 150, step: 5 },
      description: 'Points per ribbon. Upstream default 50.',
    },
    speedMultiplier: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Tail follow speed. Upstream default 0.6.',
    },
    enableFade: {
      control: 'boolean',
      description: 'Fade the tail out. Upstream default false.',
    },
    enableShaderEffect: {
      control: 'boolean',
      description: 'Sine wobble along the ribbon. Upstream default false.',
    },
    effectAmplitude: {
      control: { type: 'range', min: 0, max: 10, step: 0.5 },
      description: 'Wobble size in pixels. Upstream default 2.',
    },
    backgroundColor: {
      control: 'object',
      description: 'Clear colour as [r, g, b, a] in 0..1. Upstream default [0, 0, 0, 0].',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused with the ribbons at rest.',
    },
  },
} satisfies Meta<typeof Ribbons>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Ribbons' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('ribbons-stage');
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

async function playDrag(stage: HTMLElement) {
  const surface = stage.querySelector('.ribbons-container');
  const sketch = stage.querySelector('canvas');
  if (!(surface instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Ribbons container or canvas is missing.');
  }
  const rect = surface.getBoundingClientRect();
  // A slow sweep across the stage, so the springs follow and the ribbons
  // stretch out; then a fine grid, because a 30 px ribbon can slip between
  // eight samples per axis.
  for (let step = 0; step < 24; step += 1) {
    const t = step / 23;
    fireEvent.mouseMove(surface, {
      clientX: rect.left + rect.width * (0.1 + 0.8 * t),
      clientY: rect.top + rect.height * (0.5 + 0.35 * Math.sin(t * Math.PI * 2)),
    });
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  await assertCanvasPainted(sketch, STAGE_INK, { grid: 32 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
}

export const Default: Story = {
  args: { ...RIBBONS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playDrag(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    await playReady(canvas);
  },
};

// Opaque ribbons, so the pixel sample stays reliable; enableFade thins the
// tail to near the stage colour and is left to the controls.
export const ThickWobble: Story = {
  args: { ...RIBBONS_DEFAULTS, enableShaderEffect: true, baseThickness: 48, effectAmplitude: 6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playDrag(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...RIBBONS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    // The paused sketch drew one frame and stopped; the buffer clears once
    // that frame shows, so the ready state is the proof here.
    if (ready) await expect(stage.querySelector('canvas')).not.toBeNull();
    await playPause(canvas, stage);
  },
};
