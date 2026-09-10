import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { PixelSwap } from './PixelSwap';
import { PIXEL_SWAP_DEFAULTS, PIXEL_SWAP_PATTERNS, PIXEL_SWAP_TRIGGERS } from './source';

const meta = {
  title: 'React Bits/Animations/Pixel Swap',
  component: PixelSwap,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Pixel Swap, commit 625f250, 2026-09-10. Mechanism: a grid of pixel windows clones the incoming photograph. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/pixel-swap . No extra runtime package. Pause skips new swaps. Replay remounts the card. Photographs come from public/photos through publicAsset().',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PIXEL_SWAP_DEFAULTS },
  argTypes: {
    pixelSize: {
      control: { type: 'range', min: 16, max: 128, step: 4 },
      description: 'Pixel window size. Upstream default 64.',
    },
    gap: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Gap between pixels. Upstream default 0.',
    },
    pixelRadius: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
      description: 'Corner radius percent. Upstream default 0.',
    },
    pixelSpin: {
      control: { type: 'range', min: 0, max: 180, step: 5 },
      description: 'Spin in degrees. Upstream default 0.',
    },
    pixelScale: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Start scale. Upstream default 0.35.',
    },
    fade: {
      control: 'boolean',
      description: 'Fade pixels in. Upstream default true.',
    },
    duration: {
      control: { type: 'range', min: 200, max: 3000, step: 50 },
      description: 'Swap length in milliseconds. Upstream default 1400.',
    },
    pixelDuration: {
      control: { type: 'range', min: 60, max: 1200, step: 10 },
      description: 'Each pixel length in milliseconds. Upstream default 450.',
    },
    pattern: {
      control: 'select',
      options: [...PIXEL_SWAP_PATTERNS],
      description: 'Reveal order. Upstream default random.',
    },
    randomness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Mix random into the order. Upstream default 0.',
    },
    easing: {
      control: 'text',
      description: 'CSS easing. Upstream default cubic-bezier(0.22, 1, 0.36, 1).',
    },
    trigger: {
      control: 'select',
      options: [...PIXEL_SWAP_TRIGGERS],
      description: 'How the swap starts. Upstream default hover.',
    },
    initialActive: {
      control: 'boolean',
      description: 'Start on the second photograph. Upstream default false.',
    },
    aspectRatio: {
      control: 'text',
      description: 'Card aspect ratio. Upstream default 16 / 10.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the second photograph with no swap.',
    },
  },
} satisfies Meta<typeof PixelSwap>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Pixel Swap' })).toBeVisible();
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...PIXEL_SWAP_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('pixel-swap-stage');
    const card = canvas.getByTestId('pixel-swap-card');
    await expect(card).toHaveAttribute('data-active', 'false');
    await userEvent.hover(card);
    await waitFor(() => {
      expect(card).toHaveAttribute('data-active', 'true');
    }, SLOW);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const replayed = canvas.getByTestId('pixel-swap-card');
    await userEvent.hover(replayed);
    await waitFor(() => {
      expect(replayed).toHaveAttribute('data-active', 'true');
    }, SLOW);
  },
};

export const SpiralClick: Story = {
  args: { ...PIXEL_SWAP_DEFAULTS, pattern: 'spiral', trigger: 'click', duration: 800 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('pixel-swap-stage');
    const card = canvas.getByTestId('pixel-swap-card');
    await userEvent.click(card);
    await waitFor(() => {
      expect(card).toHaveAttribute('data-active', 'true');
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PIXEL_SWAP_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('pixel-swap-stage');
    const card = canvas.getByTestId('pixel-swap-card');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(card).toHaveAttribute('data-active', 'true');
    await playPause(canvas, stage);
  },
};
