import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { MetaBalls } from './MetaBalls';
import { META_BALLS_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Meta Balls',
  component: MetaBalls,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Meta Balls, commit 625f250, 2026-09-10. Mechanism: an ogl WebGL 2 shader sums orbiting spheres and a cursor ball. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/meta-balls . Runtime ogl 1.0.11. Pause holds the clock. Replay remounts the sketch. Colour defaults are brand paper #FFFFFF (upstream #ffffff).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...META_BALLS_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Ball colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Orbit speed. Upstream default 0.3.',
    },
    enableMouseInteraction: {
      control: 'boolean',
      description: 'Cursor ball follows the pointer. Upstream default true.',
    },
    hoverSmoothness: {
      control: { type: 'range', min: 0.01, max: 0.4, step: 0.01 },
      description: 'Cursor ball easing. Upstream default 0.05.',
    },
    animationSize: {
      control: { type: 'range', min: 8, max: 80, step: 1 },
      description: 'World scale of the field. Upstream default 30.',
    },
    ballCount: {
      control: { type: 'range', min: 1, max: 50, step: 1 },
      description: 'Orbiting ball count. Upstream default 15.',
    },
    clumpFactor: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Orbit radius scale. Upstream default 1.',
    },
    cursorBallSize: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Cursor ball radius. Upstream default 3.',
    },
    cursorBallColor: {
      control: 'color',
      description: 'Cursor ball colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    enableTransparency: {
      control: 'boolean',
      description: 'Premultiply the field onto a clear buffer. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws one still frame and runs no loop.',
    },
  },
} satisfies Meta<typeof MetaBalls>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const CLEAR = '#000000';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Meta Balls' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('meta-balls-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.dataset.webgl);
  }, SLOW);
  return stage;
}

async function playSketch(stage: HTMLElement) {
  if (stage.dataset.webgl !== 'ready') {
    await expect(stage.querySelector('p[data-webgl="unavailable"]')).not.toBeNull();
    return;
  }
  const canvasEl = stage.querySelector('canvas');
  await expect(canvasEl).not.toBeNull();
  movePointer(stage, 180, 80);
  movePointer(stage, 240, 140);
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, CLEAR, { grid: 16, timeoutMs: 6000 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...META_BALLS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
    await playSketch(stage);
  },
};

export const YellowCursor: Story = {
  args: {
    ...META_BALLS_DEFAULTS,
    cursorBallColor: '#DEF54F',
    cursorBallSize: 5,
    ballCount: 8,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...META_BALLS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.dataset.webgl === 'ready') {
      const canvasEl = stage.querySelector('canvas');
      await expect(canvasEl).not.toBeNull();
      await assertCanvasPainted(canvasEl as HTMLCanvasElement, CLEAR, { grid: 16, timeoutMs: 6000 });
    }
    await playPause(canvas, stage);
  },
};
