import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { Masonry } from './Masonry';
import { GSAP_EASES, MASONRY_DEFAULTS, MASONRY_FROM } from './source';

const meta = {
  title: 'React Bits/Components/Masonry',
  component: Masonry,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Masonry, commit 625f250, 2026-09-10. Mechanism: gsap places photograph tiles from a direction, then hover scales them. Licence MIT + Commons Clause. Page https://reactbits.dev/components/masonry . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the grid.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MASONRY_DEFAULTS },
  argTypes: {
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the layout tween. Upstream default power3.out.',
    },
    duration: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Layout tween length in seconds. Upstream default 0.6.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Delay between tiles in seconds. Upstream default 0.05.',
    },
    animateFrom: {
      control: 'select',
      options: [...MASONRY_FROM],
      description: 'Direction tiles enter from. Upstream default bottom.',
    },
    scaleOnHover: {
      control: 'boolean',
      description: 'Scale a tile on hover. Upstream default true.',
    },
    hoverScale: {
      control: { type: 'range', min: 0.8, max: 1.2, step: 0.01 },
      description: 'Hover scale factor. Upstream default 0.95.',
    },
    blurToFocus: {
      control: 'boolean',
      description: 'Start from blur(10px). Upstream default true.',
    },
    colorShiftOnHover: {
      control: 'boolean',
      description: 'Show a brand colour overlay on hover. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always snaps tiles with no blur or hover scale.',
    },
  },
} satisfies Meta<typeof Masonry>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Masonry' })).toBeVisible();
}

async function playSelect(canvas: Canvas) {
  const stage = canvas.getByTestId('masonry-stage');
  const tile = await waitFor(() => canvas.getByRole('button', { name: 'Learn' }), SLOW);
  await userEvent.click(tile);
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-active', 'learn');
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
  args: { ...MASONRY_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-active', '');
  },
};

export const ColorShiftFromTop: Story = {
  args: {
    ...MASONRY_DEFAULTS,
    animateFrom: 'top',
    colorShiftOnHover: true,
    hoverScale: 1.04,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await expect(stage).toHaveAttribute('data-from', 'top');
    await expect(stage).toHaveAttribute('data-color-shift', 'true');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MASONRY_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('masonry-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playSelect(canvas);
    await playPauseResume(canvas, stage);
  },
};
