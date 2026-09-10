import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { BounceCards } from './BounceCards';
import { BOUNCE_CARDS_DEFAULTS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Components/Bounce Cards',
  component: BounceCards,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Bounce Cards, commit 625f250, 2026-09-10. Mechanism: gsap.fromTo scales a fan of cards from 0 with an elastic ease. Licence MIT + Commons Clause. Page https://reactbits.dev/components/bounce-cards . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the fan.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...BOUNCE_CARDS_DEFAULTS },
  argTypes: {
    containerWidth: {
      control: { type: 'range', min: 240, max: 640, step: 10 },
      description: 'Fan width in pixels. Upstream default 400.',
    },
    containerHeight: {
      control: { type: 'range', min: 240, max: 640, step: 10 },
      description: 'Fan height in pixels. Upstream default 400.',
    },
    animationDelay: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Wait before the intro in seconds. Upstream default 0.5.',
    },
    animationStagger: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Stagger between cards in seconds. Upstream default 0.06.',
    },
    easeType: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the intro. Upstream default elastic.out(1, 0.8).',
    },
    enableHover: {
      control: 'boolean',
      description: 'Push sibling cards on hover. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always skips the intro scale.',
    },
  },
} satisfies Meta<typeof BounceCards>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Bounce Cards' })).toBeVisible();
}

async function playCards(canvas: Canvas) {
  const images = canvas.getAllByRole('img');
  await expect(images).toHaveLength(5);
  await waitFor(() => {
    expect(images[2]).toBeVisible();
  }, SLOW);
  return images;
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('bounce-cards-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...BOUNCE_CARDS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playCards(canvas);
    const stage = await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playCards(canvas);
  },
};

export const HoverPush: Story = {
  args: { ...BOUNCE_CARDS_DEFAULTS, enableHover: true, animationDelay: 0 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('bounce-cards-stage');
    await expect(stage).toHaveAttribute('data-hover', 'true');
    const images = await playCards(canvas);
    await userEvent.hover(images[2]);
    await expect(images[2]).toBeVisible();
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...BOUNCE_CARDS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('bounce-cards-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playCards(canvas);
    await playPause(canvas);
  },
};
