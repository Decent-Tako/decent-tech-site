import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { SwarmCursor } from './SwarmCursor';
import { SWARM_CURSOR_DEFAULTS } from './source';

const STAGE_INK = '#212121';

const meta = {
  title: 'React Bits/Animations/Swarm Cursor',
  component: SwarmCursor,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Swarm Cursor, commit 625f250, 2026-09-10. Mechanism: particles flock to the pointer, stamp a field buffer, and a glow pass composites them. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/swarm-cursor . Runtime ogl 1.0.11. Pause holds the physics step through the local paused prop. Replay remounts the swarm. Colour default is brand paper #FFFFFF (upstream #ffffff). Accent default is brand accent yellow #DEF54F (upstream #ffffff).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SWARM_CURSOR_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Core tint. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    accentColor: {
      control: 'color',
      description: 'Halo tint. Brand accent yellow #DEF54F. Upstream default #ffffff.',
    },
    count: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'How many particles flock. Upstream default 10.',
    },
    size: {
      control: { type: 'range', min: 2, max: 40, step: 1 },
      description: 'Stamp radius in pixels. Upstream default 10.',
    },
    merge: {
      control: { type: 'range', min: 0.1, max: 1.5, step: 0.01 },
      description: 'Field threshold that fuses the stamps. Upstream default 0.77.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Halo strength. Upstream default 0.75.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha of the composite. Upstream default 1.',
    },
    spread: {
      control: { type: 'range', min: 20, max: 240, step: 5 },
      description: 'Orbit radius around the pointer. Upstream default 100.',
    },
    separation: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'How hard particles push apart. Upstream default 0.15.',
    },
    speed: {
      control: { type: 'range', min: 0.1, max: 6, step: 0.1 },
      description: 'Steer and max speed. Upstream default 2.5.',
    },
    wander: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Noise flow mixed into the wish vector. Upstream default 0.25.',
    },
    trail: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'How long stamps linger, in seconds. Upstream default 0.75.',
    },
    scatterOnClick: {
      control: 'boolean',
      description: 'Click kicks every particle away. Upstream default true.',
    },
    enabled: {
      control: 'boolean',
      description: 'Run the flock. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused with the flock at rest.',
    },
  },
} satisfies Meta<typeof SwarmCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Swarm Cursor' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('swarm-cursor-stage');
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

async function playChase(stage: HTMLElement) {
  const surface = stage.querySelector('.swarm-cursor');
  const sketch = stage.querySelector('canvas');
  if (!(surface instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Swarm Cursor container or canvas is missing.');
  }
  movePointer(surface, 80, 70);
  const rect = surface.getBoundingClientRect();
  for (let step = 0; step < 10; step += 1) {
    const t = step / 9;
    fireEvent.pointerMove(surface, {
      clientX: rect.left + rect.width * (0.2 + 0.6 * t),
      clientY: rect.top + rect.height * (0.35 + 0.3 * Math.sin(t * Math.PI * 2)),
    });
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  await assertCanvasPainted(sketch, STAGE_INK, { grid: 16 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...SWARM_CURSOR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playChase(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    const after = await playReady(canvas);
    if (after.ready) await playChase(after.stage);
  },
};

export const DenseScatter: Story = {
  args: { ...SWARM_CURSOR_DEFAULTS, count: 24, size: 16, spread: 140 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-scatter', 'true');
    if (ready) {
      const surface = stage.querySelector('.swarm-cursor');
      if (!(surface instanceof HTMLElement)) {
        throw new Error('The Swarm Cursor container is missing.');
      }
      await playChase(stage);
      fireEvent.pointerDown(surface);
      fireEvent.pointerUp(surface);
    }
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SWARM_CURSOR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (ready) await expect(stage.querySelector('canvas')).not.toBeNull();
    await playPause(canvas, stage);
  },
};
