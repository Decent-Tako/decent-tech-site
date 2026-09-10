import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { ImageTrail } from './ImageTrail';
import { IMAGE_TRAIL_DEFAULTS, IMAGE_TRAIL_VARIANTS } from './source';

const meta = {
  title: 'React Bits/Animations/Image Trail',
  component: ImageTrail,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Image Trail, commit 625f250, 2026-09-10. Mechanism: eight gsap variants drop the next photograph at the pointer once it travels 80 px. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/image-trail . Runtime gsap 3.15.0. Pause skips new trail images. Replay remounts the trail. Photographs come from public/photos through publicAsset().',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...IMAGE_TRAIL_DEFAULTS },
  argTypes: {
    variant: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      options: [...IMAGE_TRAIL_VARIANTS],
      description: 'Trail class 1 to 8. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the first photograph with no trail.',
    },
  },
} satisfies Meta<typeof ImageTrail>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Image Trail' })).toBeVisible();
}

function visibleCount(host: HTMLElement) {
  return [...host.querySelectorAll<HTMLElement>('.content__img')].filter(
    (el) => Number.parseFloat(getComputedStyle(el).opacity) > 0.1,
  ).length;
}

async function playTrail(canvas: Canvas) {
  const stage = canvas.getByTestId('image-trail-stage');
  const host = canvas.getByTestId('image-trail-host');
  for (let i = 0; i < 8; i += 1) {
    movePointer(host, 40 + i * 28, 60 + (i % 3) * 24);
  }
  await waitFor(() => {
    expect(visibleCount(host)).toBeGreaterThan(0);
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
  args: { ...IMAGE_TRAIL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTrail(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playTrail(canvas);
  },
};

export const VariantFour: Story = {
  args: { ...IMAGE_TRAIL_DEFAULTS, variant: 4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('image-trail-stage');
    await expect(stage).toHaveAttribute('data-variant', '4');
    await playTrail(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...IMAGE_TRAIL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('image-trail-stage');
    const host = canvas.getByTestId('image-trail-host');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    movePointer(host, 80, 80);
    movePointer(host, 200, 140);
    await expect(visibleCount(host)).toBeLessThanOrEqual(1);
    await playPause(canvas, stage);
  },
};
