import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { Carousel } from './Carousel';
import { CAROUSEL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Carousel, commit 625f250, 2026-09-10. Mechanism: a motion spring slides the track on x and tilts each card on rotateY. Licence MIT + Commons Clause. Page https://reactbits.dev/components/carousel . Runtime motion 13.2.0 and react-icons 5.7.0. Pause clears the autoplay interval. Replay remounts the track.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CAROUSEL_DEFAULTS },
  argTypes: {
    baseWidth: {
      control: { type: 'range', min: 220, max: 480, step: 10 },
      description: 'Track width in pixels. Upstream default 300.',
    },
    autoplay: {
      control: 'boolean',
      description: 'Advance on an interval. Upstream default false.',
    },
    autoplayDelay: {
      control: { type: 'range', min: 500, max: 8000, step: 100 },
      description: 'Milliseconds between autoplay steps. Upstream default 3000.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Hold autoplay while the pointer is on the track. Upstream default false.',
    },
    loop: {
      control: 'boolean',
      description: 'Clone the ends so the track can wrap. Upstream default false.',
    },
    round: {
      control: 'boolean',
      description: 'Circular cards and container. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always jumps to the next slide with no spring.',
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Carousel' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('carousel-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...CAROUSEL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('carousel-stage');
    await expect(canvas.getByText('Start')).toBeVisible();
    await expect(stage).toHaveAttribute('data-index', '0');
    await userEvent.click(canvas.getByRole('button', { name: 'Go to slide 2' }));
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '1');
    }, SLOW);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '0');
    }, SLOW);
    await userEvent.click(canvas.getByRole('button', { name: 'Go to slide 3' }));
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '2');
    }, SLOW);
  },
};

export const LoopAutoplay: Story = {
  args: { ...CAROUSEL_DEFAULTS, loop: true, autoplay: true, autoplayDelay: 800 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('carousel-stage');
    await expect(stage).toHaveAttribute('data-loop', 'true');
    await waitFor(() => {
      expect(Number.parseInt(stage.getAttribute('data-index') ?? '0', 10)).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...CAROUSEL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('carousel-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByText('Start')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Go to slide 2' }));
    await expect(stage).toHaveAttribute('data-index', '1');
    await playPause(canvas);
  },
};
