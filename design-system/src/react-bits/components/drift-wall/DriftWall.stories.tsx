import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { DriftWall } from './DriftWall';
import { DRIFT_DIRECTIONS, DRIFT_WALL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Drift Wall',
  component: DriftWall,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Drift Wall, commit 625f250, 2026-09-10. Mechanism: columns of photographs drift past in CSS 3D, with hover lift. Licence MIT + Commons Clause. Page https://reactbits.dev/components/drift-wall . No extra runtime. Pause holds the column offsets. Replay remounts the wall.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DRIFT_WALL_DEFAULTS },
  argTypes: {
    columns: {
      control: { type: 'range', min: 2, max: 8, step: 1 },
      description: 'Column count. Upstream default 5.',
    },
    tileWidth: {
      control: { type: 'range', min: 80, max: 320, step: 8 },
      description: 'Tile width in pixels. Upstream default 200.',
    },
    tileHeight: {
      control: { type: 'range', min: 60, max: 240, step: 8 },
      description: 'Tile height in pixels. Upstream default 132.',
    },
    gap: {
      control: { type: 'range', min: 0, max: 40, step: 2 },
      description: 'Gap between tiles in pixels. Upstream default 18.',
    },
    radius: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Tile corner radius in pixels. Upstream default 14.',
    },
    tilt: {
      control: { type: 'range', min: -40, max: 40, step: 1 },
      description: 'RotateX in degrees. Upstream default 16.',
    },
    turn: {
      control: { type: 'range', min: -40, max: 40, step: 1 },
      description: 'RotateY in degrees. Upstream default -14.',
    },
    roll: {
      control: { type: 'range', min: -20, max: 20, step: 1 },
      description: 'RotateZ in degrees. Upstream default 0.',
    },
    perspective: {
      control: { type: 'range', min: 400, max: 2400, step: 50 },
      description: 'CSS perspective in pixels. Upstream default 1200.',
    },
    depth: {
      control: { type: 'range', min: 0, max: 400, step: 10 },
      description: 'TranslateZ in pixels. Upstream default 120.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 120, step: 2 },
      description: 'Column speed in pixels per second. Upstream default 42.',
    },
    direction: {
      control: 'select',
      options: [...DRIFT_DIRECTIONS],
      description: 'Drift direction. Upstream default up.',
    },
    variance: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Speed difference between columns. Upstream default 0.45.',
    },
    parallax: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pointer tilt amount. Upstream default 0.6.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Hold every column while the pointer is over the wall. Upstream default false.',
    },
    lift: {
      control: { type: 'range', min: 0, max: 120, step: 4 },
      description: 'Hover lift in pixels. Upstream default 64.',
    },
    fade: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Edge fade. Upstream default 0.6.',
    },
    dim: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Idle tile dim. Upstream default 0.55.',
    },
    grayscale: {
      control: 'boolean',
      description: 'Idle tiles in grayscale. Upstream default false.',
    },
    overlayColor: {
      control: 'color',
      description: 'Edge overlay colour. Brand ink. Upstream default #060010.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets speed to 0.',
    },
  },
} satisfies Meta<typeof DriftWall>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Drift Wall' })).toBeVisible();
}

async function playHover(canvas: Canvas) {
  const stage = canvas.getByTestId('drift-wall-stage');
  const tile = stage.querySelector('[data-tile-id]');
  await expect(tile).toBeTruthy();
  const rect = (tile as HTMLElement).getBoundingClientRect();
  movePointer(tile as HTMLElement, rect.width / 2, rect.height / 2);
  await waitFor(() => {
    expect(stage.getAttribute('data-active')).not.toBe('');
  }, SLOW);
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...DRIFT_WALL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-active', '');
  },
};

export const Downward: Story = {
  args: { ...DRIFT_WALL_DEFAULTS, direction: 'down', speed: 64 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('drift-wall-stage');
    await expect(stage).toHaveAttribute('data-direction', 'down');
    await expect(stage).toHaveAttribute('data-speed', '64');
    await playHover(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...DRIFT_WALL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('drift-wall-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    const tile = stage.querySelector('[data-tile-id]');
    await expect(tile).toBeTruthy();
    await playPauseResume(canvas, stage);
  },
};
