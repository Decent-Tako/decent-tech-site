import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { PixelTransition } from './PixelTransition';
import { PIXEL_TRANSITION_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Pixel Transition',
  component: PixelTransition,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Pixel Transition, commit 625f250, 2026-09-10. Mechanism: a gsap stagger of overlay pixels reveals the second photograph. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/pixel-transition . Runtime gsap 3.15.0. Pause skips new swaps. Replay remounts the card. pixelColor default is brand accent yellow #DEF54F (upstream currentColor). Photographs come from public/photos through publicAsset().',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PIXEL_TRANSITION_DEFAULTS },
  argTypes: {
    gridSize: {
      control: { type: 'range', min: 3, max: 16, step: 1 },
      description: 'Pixel grid count on each side. Upstream default 7.',
    },
    pixelColor: {
      control: 'color',
      description: 'Overlay pixel colour. Brand accent yellow #DEF54F. Upstream default currentColor.',
    },
    animationStepDuration: {
      control: { type: 'range', min: 0.1, max: 1.5, step: 0.05 },
      description: 'Stagger length in seconds. Upstream default 0.3.',
    },
    once: {
      control: 'boolean',
      description: 'Stay on the second photograph after the first hover. Upstream default false.',
    },
    aspectRatio: {
      control: 'text',
      description: 'Padding-top of the card. Upstream default 100%.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the second photograph with no stagger.',
    },
  },
} satisfies Meta<typeof PixelTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Pixel Transition' })).toBeVisible();
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...PIXEL_TRANSITION_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('pixel-transition-stage');
    const card = canvas.getByTestId('pixel-transition-card');
    await expect(card).toHaveAttribute('data-active', 'false');
    await userEvent.hover(card);
    await waitFor(() => {
      expect(card).toHaveAttribute('data-active', 'true');
    }, SLOW);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const replayed = canvas.getByTestId('pixel-transition-card');
    await userEvent.hover(replayed);
    await waitFor(() => {
      expect(replayed).toHaveAttribute('data-active', 'true');
    }, SLOW);
  },
};

export const CoarseOnce: Story = {
  args: { ...PIXEL_TRANSITION_DEFAULTS, gridSize: 4, once: true, animationStepDuration: 0.2 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('pixel-transition-stage');
    const card = canvas.getByTestId('pixel-transition-card');
    await userEvent.hover(card);
    await waitFor(() => {
      expect(card).toHaveAttribute('data-active', 'true');
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PIXEL_TRANSITION_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('pixel-transition-stage');
    const card = canvas.getByTestId('pixel-transition-card');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(card).toHaveAttribute('data-active', 'true');
    await playPause(canvas, stage);
  },
};
