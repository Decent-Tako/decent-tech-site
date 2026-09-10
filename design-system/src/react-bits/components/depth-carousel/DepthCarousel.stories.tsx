import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { DepthCarousel } from './DepthCarousel';
import { DEPTH_CAROUSEL_DEFAULTS, GSAP_EASES, TILT_DIRECTIONS } from './source';

const meta = {
  title: 'React Bits/Components/Depth Carousel',
  component: DepthCarousel,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Depth Carousel, commit 625f250, 2026-09-10. Mechanism: a gsap tween recedes cards on a 3D rail of translateZ, translateX, and rotateY. Licence MIT + Commons Clause. Page https://reactbits.dev/components/depth-carousel . Runtime gsap 3.15.0. Pause kills the rail tween and autoplay. Replay remounts the stack.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DEPTH_CAROUSEL_DEFAULTS },
  argTypes: {
    cardWidth: {
      control: { type: 'range', min: 180, max: 420, step: 10 },
      description: 'Card width in pixels. Upstream default 300.',
    },
    cardHeight: {
      control: { type: 'range', min: 220, max: 520, step: 10 },
      description: 'Card height in pixels. Upstream default 380.',
    },
    radius: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Card corner radius in pixels. Upstream default 18.',
    },
    tint: {
      control: 'color',
      description: 'Rear card overlay. Brand ink. Upstream default #05060a.',
    },
    depth: {
      control: { type: 'range', min: 40, max: 400, step: 10 },
      description: 'Z step per card in pixels. Upstream default 220.',
    },
    spread: {
      control: { type: 'range', min: 20, max: 180, step: 5 },
      description: 'X step per card in pixels. Upstream default 90.',
    },
    tilt: {
      control: { type: 'range', min: 0, max: 45, step: 1 },
      description: 'Y rotation in degrees. Upstream default 22.',
    },
    tiltDirection: {
      control: 'select',
      options: [...TILT_DIRECTIONS],
      description: 'Rail side. Upstream default right.',
    },
    perspective: {
      control: { type: 'range', min: 600, max: 2400, step: 50 },
      description: 'CSS perspective in pixels. Upstream default 1400.',
    },
    visibleCards: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      description: 'How many cards stay opaque. Upstream default 4.',
    },
    falloff: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Brightness drop per step. Upstream default 0.2.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Rear blur in pixels. Upstream default 6.',
    },
    duration: {
      control: { type: 'range', min: 0, max: 1600, step: 50 },
      description: 'Tween length in milliseconds. Upstream default 700.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the rail tween. Upstream default power3.out.',
    },
    autoplay: {
      control: 'boolean',
      description: 'Advance on an interval. Upstream default false.',
    },
    autoplayDelay: {
      control: { type: 'range', min: 600, max: 8000, step: 100 },
      description: 'Milliseconds between autoplay steps. Upstream default 3200.',
    },
    loop: {
      control: 'boolean',
      description: 'Wrap the rail. Upstream default true.',
    },
    showControls: {
      control: 'boolean',
      description: 'Show previous and next arrows. Upstream default true.',
    },
    showIndicators: {
      control: 'boolean',
      description: 'Show the dot list. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always jumps with duration 0.',
    },
  },
} satisfies Meta<typeof DepthCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Depth Carousel' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('depth-carousel-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...DEPTH_CAROUSEL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('depth-carousel-stage');
    await expect(stage).toHaveAttribute('data-index', '0');
    await expect(stage.querySelectorAll('.depth-carousel__img')).toHaveLength(5);
    await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '1');
    }, SLOW);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '0');
    }, SLOW);
    await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '1');
    }, SLOW);
  },
};

export const TiltLeftAutoplay: Story = {
  args: {
    ...DEPTH_CAROUSEL_DEFAULTS,
    tiltDirection: 'left',
    autoplay: true,
    autoplayDelay: 700,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('depth-carousel-stage');
    await expect(stage).toHaveAttribute('data-tilt', 'left');
    await waitFor(() => {
      expect(Number.parseInt(stage.getAttribute('data-index') ?? '0', 10)).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...DEPTH_CAROUSEL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('depth-carousel-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage.querySelectorAll('.depth-carousel__img')).toHaveLength(5);
    await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
    await expect(stage).toHaveAttribute('data-index', '1');
    await playPause(canvas);
  },
};
