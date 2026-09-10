import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { CardSwap } from './CardSwap';
import { CARD_SWAP_DEFAULTS, CARD_SWAP_EASINGS } from './source';

const meta = {
  title: 'React Bits/Components/Card Swap',
  component: CardSwap,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Card Swap, commit 625f250, 2026-09-10. Mechanism: a gsap timeline drops the front card and promotes the stack on an interval. Licence MIT + Commons Clause. Page https://reactbits.dev/components/card-swap . Runtime gsap 3.15.0. Pause freezes the timeline and clears the interval. Replay remounts the stack.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CARD_SWAP_DEFAULTS },
  argTypes: {
    width: {
      control: { type: 'range', min: 220, max: 520, step: 10 },
      description: 'Card width in pixels. Upstream default 500.',
    },
    height: {
      control: { type: 'range', min: 180, max: 480, step: 10 },
      description: 'Card height in pixels. Upstream default 400.',
    },
    cardDistance: {
      control: { type: 'range', min: 20, max: 120, step: 5 },
      description: 'Horizontal stack offset. Upstream default 60.',
    },
    verticalDistance: {
      control: { type: 'range', min: 20, max: 120, step: 5 },
      description: 'Vertical stack offset. Upstream default 70.',
    },
    delay: {
      control: { type: 'range', min: 1000, max: 8000, step: 250 },
      description: 'Milliseconds between swaps. Upstream default 5000.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Pause the interval while the pointer is on the stack. Upstream default false.',
    },
    skewAmount: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Y skew in degrees. Upstream default 6.',
    },
    easing: {
      control: 'select',
      options: [...CARD_SWAP_EASINGS],
      description: 'elastic or linear timing. Upstream default elastic.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always freezes the stack in its first pose.',
    },
  },
} satisfies Meta<typeof CardSwap>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Card Swap' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('card-swap-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...CARD_SWAP_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('card-swap-stage');
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await waitFor(() => {
      expect(Number.parseInt(stage.getAttribute('data-cycle') ?? '0', 10)).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await waitFor(() => {
      expect(Number.parseInt(stage.getAttribute('data-cycle') ?? '0', 10)).toBeGreaterThan(0);
    }, SLOW);
  },
};

export const Linear: Story = {
  args: { ...CARD_SWAP_DEFAULTS, easing: 'linear', pauseOnHover: true, delay: 2500 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('card-swap-stage');
    await expect(stage).toHaveAttribute('data-easing', 'linear');
    await waitFor(() => {
      expect(Number.parseInt(stage.getAttribute('data-cycle') ?? '0', 10)).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...CARD_SWAP_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('card-swap-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await expect(stage).toHaveAttribute('data-cycle', '0');
    await playPause(canvas);
  },
};
