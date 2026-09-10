import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { ShapeGrid } from './ShapeGrid';
import { SHAPE_GRID_DEFAULTS, SHAPE_GRID_DIRECTIONS, SHAPE_GRID_SHAPES } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Shape Grid',
  component: ShapeGrid,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Shape Grid, commit 625f250, 2026-09-10. Mechanism: a 2d canvas grid of squares, hexagons, circles, or triangles that scrolls and fills on hover. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/shape-grid . No extra runtime. Pause holds the scroll after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SHAPE_GRID_DEFAULTS },
  argTypes: {
    direction: {
      control: 'select',
      options: [...SHAPE_GRID_DIRECTIONS],
      description: 'Scroll direction. Upstream default right.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Scroll speed. Upstream default 1.',
    },
    borderColor: {
      control: 'color',
      description: 'Stroke colour. Brand quiet #A6A6A6. Upstream default #999.',
    },
    squareSize: {
      control: { type: 'range', min: 16, max: 80, step: 2 },
      description: 'Cell size. Upstream default 40.',
    },
    hoverFillColor: {
      control: 'color',
      description: 'Hover fill. Brand ink #212121. Upstream default #222.',
    },
    shape: {
      control: 'select',
      options: [...SHAPE_GRID_SHAPES],
      description: 'Cell shape. Upstream default square.',
    },
    hoverTrailAmount: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'Hover trail length. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the grid after a short warm-up.',
    },
  },
} satisfies Meta<typeof ShapeGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Shape Grid' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('shape-grid-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-ready', 'true');
  }, SLOW);
  return stage;
}

async function playPaint(stage: HTMLElement) {
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
  args: { ...SHAPE_GRID_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const HexagonTrail: Story = {
  args: {
    ...SHAPE_GRID_DEFAULTS,
    shape: 'hexagon',
    direction: 'diagonal',
    hoverTrailAmount: 6,
    squareSize: 32,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-shape', 'hexagon');
    await expect(stage).toHaveAttribute('data-direction', 'diagonal');
    await playPaint(stage);
    const hit = stage.querySelector('canvas') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SHAPE_GRID_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
