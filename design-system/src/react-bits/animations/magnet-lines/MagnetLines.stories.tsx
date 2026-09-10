import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { MagnetLines } from './MagnetLines';
import { MAGNET_LINES_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Magnet Lines',
  component: MagnetLines,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Magnet Lines, commit 625f250, 2026-09-10. Mechanism: a CSS grid of spans rotate toward the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/magnet-lines . No extra runtime. Pause ignores new pointer moves. Replay remounts the grid. Line colour default is brand ink #212121 (upstream #efefef).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MAGNET_LINES_DEFAULTS },
  argTypes: {
    rows: {
      control: { type: 'range', min: 3, max: 16, step: 1 },
      description: 'Grid rows. Upstream default 9.',
    },
    columns: {
      control: { type: 'range', min: 3, max: 16, step: 1 },
      description: 'Grid columns. Upstream default 9.',
    },
    containerSize: {
      control: 'text',
      description: 'Grid size. Upstream default 80vmin.',
    },
    lineColor: {
      control: 'color',
      description: 'Span colour. Brand ink #212121. Upstream default #efefef.',
    },
    lineWidth: {
      control: 'text',
      description: 'Span width. Upstream default 1vmin.',
    },
    lineHeight: {
      control: 'text',
      description: 'Span height. Upstream default 6vmin.',
    },
    baseAngle: {
      control: { type: 'range', min: -90, max: 90, step: 1 },
      description: 'Rest angle in degrees. Upstream default -10.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always keeps the rest angle.',
    },
  },
} satisfies Meta<typeof MagnetLines>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Magnet Lines' })).toBeVisible();
}

async function playRotate(canvas: Canvas) {
  const stage = canvas.getByTestId('magnet-lines-stage');
  const host = canvas.getByTestId('magnet-lines-host');
  const before = stage.dataset.angle;
  movePointer(host, 20, 20);
  movePointer(host, 180, 40);
  await waitFor(() => {
    expect(stage.dataset.angle).not.toBe(before);
  }, SLOW);
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
  args: { ...MAGNET_LINES_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playRotate(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playRotate(canvas);
  },
};

export const DenseGrid: Story = {
  args: { ...MAGNET_LINES_DEFAULTS, rows: 12, columns: 12, baseAngle: 20 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('magnet-lines-stage');
    await expect(stage).toHaveAttribute('data-rows', '12');
    await playRotate(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MAGNET_LINES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('magnet-lines-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('magnet-lines-host')).toBeVisible();
    await playPause(canvas, stage);
  },
};
