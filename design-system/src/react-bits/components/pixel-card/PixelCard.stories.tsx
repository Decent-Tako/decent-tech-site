import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { PixelCard } from './PixelCard';
import { PIXEL_CARD_DEFAULTS, PIXEL_CARD_VARIANTS } from './source';

const STAGE_PAPER = '#FFFFFF';

const meta = {
  title: 'React Bits/Components/Pixel Card',
  component: PixelCard,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Pixel Card, commit 625f250, 2026-09-10. Mechanism: hover fills a 2D canvas with a pixel grid that shimmers, then shrinks on leave. Licence MIT + Commons Clause. Page https://reactbits.dev/components/pixel-card . No extra runtime. Pause skips pixel updates. Replay remounts the card.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PIXEL_CARD_DEFAULTS },
  argTypes: {
    variant: {
      control: 'select',
      options: [...PIXEL_CARD_VARIANTS],
      description: 'Preset for gap, speed, and colours. Upstream default default.',
    },
    gap: {
      control: { type: 'range', min: 2, max: 20, step: 1 },
      description: 'Pixel grid gap in pixels. Upstream default 5 (default variant).',
    },
    speed: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Shimmer speed. Upstream default 35 (default variant).',
    },
    colors: {
      control: 'text',
      description:
        'Comma-separated pixel colours. Brand ink, accent blue, charcoal. Upstream default #f8fafc,#f1f5f9,#cbd5e1.',
    },
    noFocus: {
      control: 'boolean',
      description: 'Skip appear on focus. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets delay and speed to 0.',
    },
  },
} satisfies Meta<typeof PixelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Pixel Card' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('pixel-card-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-ready', 'true');
  }, SLOW);
  return stage;
}

async function playHoverPaint(canvas: Canvas) {
  const card = canvas.getByTestId('pixel-card-stage').querySelector('.pixel-card');
  const sketch = canvas.getByTestId('pixel-card-stage').querySelector('canvas');
  if (!(card instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Pixel Card or canvas is missing.');
  }
  const wrap = canvas.getByTestId('pixel-card-stage').querySelector('.pixel-card-stage');
  if (wrap instanceof HTMLElement) fireEvent.mouseEnter(wrap);
  fireEvent.mouseEnter(card);
  fireEvent.mouseOver(card);
  await userEvent.hover(card);
  const stage = canvas.getByTestId('pixel-card-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-hovered', 'true');
  }, SLOW);
  await assertCanvasPainted(sketch, STAGE_PAPER, { grid: 60, timeoutMs: 8000 });
  return sketch;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...PIXEL_CARD_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await playHoverPaint(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
    await playHoverPaint(canvas);
  },
};

export const BlueGrid: Story = {
  args: {
    ...PIXEL_CARD_DEFAULTS,
    variant: 'blue',
    gap: 10,
    speed: 25,
    colors: '#0035B1,#DEF54F,#0035B1',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-variant', 'blue');
    await expect(stage).toHaveAttribute('data-gap', '10');
    await playHoverPaint(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PIXEL_CARD_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playHoverPaint(canvas);
    await playPauseResume(canvas, stage);
  },
};
