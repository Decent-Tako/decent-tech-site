import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { BlobCursor } from './BlobCursor';
import { BLOB_CURSOR_DEFAULTS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Animations/Blob Cursor',
  component: BlobCursor,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Blob Cursor, commit 625f250, 2026-09-10. Mechanism: gsap tweens a lead blob and a slower trail toward the pointer, then an SVG goo filter merges them. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/blob-cursor . Runtime gsap 3.15.0. Pause skips new pointer tweens. Replay remounts the blobs. Fill default is brand accent blue #0035B1 (upstream #5227FF).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...BLOB_CURSOR_DEFAULTS },
  argTypes: {
    blobType: {
      control: 'select',
      options: ['circle', 'square'],
      description: 'Blob shape. Upstream default circle.',
    },
    fillColor: {
      control: 'color',
      description: 'Blob fill. Brand accent blue #0035B1. Upstream default #5227FF.',
    },
    trailCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      description: 'How many blobs follow the pointer. Upstream default 3.',
    },
    sizes: {
      control: 'object',
      description: 'Blob widths in pixels. Upstream default [60, 125, 75].',
    },
    innerSizes: {
      control: 'object',
      description: 'Inner dot widths in pixels. Upstream default [20, 35, 25].',
    },
    innerColor: {
      control: 'color',
      description: 'Inner dot colour. Upstream default rgba(255,255,255,0.8).',
    },
    opacities: {
      control: 'object',
      description: 'Blob opacities. Upstream default [0.6, 0.6, 0.6].',
    },
    shadowColor: {
      control: 'color',
      description: 'Box shadow colour. Upstream default rgba(0,0,0,0.75).',
    },
    shadowBlur: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Box shadow blur. Upstream default 5.',
    },
    shadowOffsetX: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Box shadow X offset. Upstream default 10.',
    },
    shadowOffsetY: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Box shadow Y offset. Upstream default 10.',
    },
    filterStdDeviation: {
      control: { type: 'range', min: 0, max: 60, step: 1 },
      description: 'Goo blur. Upstream default 30.',
    },
    filterColorMatrixValues: {
      control: 'text',
      description: 'feColorMatrix values. Upstream default 1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10.',
    },
    useFilter: {
      control: 'boolean',
      description: 'Apply the SVG goo filter. Upstream default true.',
    },
    fastDuration: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Lead blob tween in seconds. Upstream default 0.1.',
    },
    slowDuration: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Trail blob tween in seconds. Upstream default 0.5.',
    },
    fastEase: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'Lead ease. Upstream default power3.out.',
    },
    slowEase: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'Trail ease. Upstream default power1.out.',
    },
    zIndex: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Stacking of the blob layer. Wrapper default 1. Upstream default 100.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always snaps blobs with no goo filter.',
    },
  },
} satisfies Meta<typeof BlobCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Blob Cursor' })).toBeVisible();
}

async function playMove(canvas: Canvas) {
  const host = canvas.getByTestId('blob-cursor-host');
  movePointer(host, 80, 70);
  movePointer(host, 200, 140);
  const blob = host.querySelector('.blob');
  await expect(blob).not.toBeNull();
  await waitFor(() => {
    const transform = (blob as HTMLElement).style.transform;
    expect(transform === '' || transform === 'none').toBe(false);
  });
  return canvas.getByTestId('blob-cursor-stage');
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...BLOB_CURSOR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMove(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playMove(canvas);
  },
};

export const SquareBlobs: Story = {
  args: { ...BLOB_CURSOR_DEFAULTS, blobType: 'square', useFilter: false },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMove(canvas);
    await expect(stage).toHaveAttribute('data-blob-type', 'square');
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...BLOB_CURSOR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMove(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
