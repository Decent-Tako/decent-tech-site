import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { CursorGrid } from './CursorGrid';
import { CURSOR_GRID_DEFAULTS, FALLOFFS } from './source';

const meta = {
  title: 'React Bits/Animations/Cursor Grid',
  component: CursorGrid,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Cursor Grid, commit 625f250, 2026-09-10. Mechanism: a 2D canvas lights lattice cells around the pointer and pulses on click. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/cursor-grid . No extra runtime. Pause ignores the pointer. Replay remounts the grid. Colour default is brand accent blue #0035B1 (upstream #D946EF).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CURSOR_GRID_DEFAULTS },
  argTypes: {
    cellSize: {
      control: { type: 'range', min: 20, max: 140, step: 5 },
      description: 'Cell size in pixels. Upstream default 70.',
    },
    color: {
      control: 'color',
      description: 'Cell colour. Brand accent blue #0035B1. Upstream default #D946EF.',
    },
    radius: {
      control: { type: 'range', min: 20, max: 400, step: 10 },
      description: 'Pointer light radius. Upstream default 140.',
    },
    falloff: {
      control: 'select',
      options: [...FALLOFFS],
      description: 'Distance to brightness curve. Upstream default smooth.',
    },
    holdTime: {
      control: { type: 'range', min: 0, max: 2000, step: 50 },
      description: 'Milliseconds a cell stays lit. Upstream default 400.',
    },
    fadeDuration: {
      control: { type: 'range', min: 50, max: 2000, step: 50 },
      description: 'Fade after hold, in milliseconds. Upstream default 800.',
    },
    lineWidth: {
      control: { type: 'range', min: 0.5, max: 6, step: 0.1 },
      description: 'Cell stroke. Upstream default 1.2.',
    },
    maxOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Peak cell opacity. Upstream default 1.',
    },
    fillOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Cell fill opacity. Upstream default 0.',
    },
    gridOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Static lattice opacity. Upstream default 0.',
    },
    cellRadius: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Rounded cell corners. Upstream default 0.',
    },
    clickPulse: {
      control: 'boolean',
      description: 'Expanding ring on click. Upstream default true.',
    },
    pulseSpeed: {
      control: { type: 'range', min: 100, max: 1600, step: 50 },
      description: 'Pulse speed in pixels per second. Upstream default 600.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows a still lattice and ignores the pointer.',
    },
  },
} satisfies Meta<typeof CursorGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const PAPER = '#FFFFFF';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Cursor Grid' })).toBeVisible();
}

async function playLight(canvas: Canvas) {
  const stage = canvas.getByTestId('cursor-grid-stage');
  const grid = stage.querySelector('.cursor-grid');
  await expect(grid).not.toBeNull();
  movePointer(grid as HTMLElement, 120, 100);
  movePointer(grid as HTMLElement, 180, 140);
  await userEvent.click(grid as HTMLElement);
  const canvasEl = canvas.getByTestId('cursor-grid-canvas') as HTMLCanvasElement;
  await assertCanvasPainted(canvasEl, PAPER);
  return stage;
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...CURSOR_GRID_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playLight(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playLight(canvas);
  },
};

export const RoundedLattice: Story = {
  args: {
    ...CURSOR_GRID_DEFAULTS,
    falloff: 'sharp',
    cellRadius: 10,
    fillOpacity: 0.2,
    gridOpacity: 0.15,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playLight(canvas);
    await expect(stage).toHaveAttribute('data-falloff', 'sharp');
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...CURSOR_GRID_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('cursor-grid-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await assertCanvasPainted(
      canvas.getByTestId('cursor-grid-canvas') as HTMLCanvasElement,
      PAPER,
    );
    await playPause(canvas, stage);
  },
};
