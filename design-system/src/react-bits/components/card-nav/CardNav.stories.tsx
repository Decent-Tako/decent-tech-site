import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { CardNav } from './CardNav';
import { CARD_NAV_DEFAULTS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Components/Card Nav',
  component: CardNav,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Card Nav, commit 625f250, 2026-09-10. Mechanism: a hamburger plays a gsap timeline that grows the bar and fades three nested cards in. Licence MIT + Commons Clause. Page https://reactbits.dev/components/card-nav . Runtime gsap 3.15.0 and react-icons 5.7.0. Pause holds the gsap global timeline. Replay remounts the bar closed.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CARD_NAV_DEFAULTS },
  argTypes: {
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the expand. Upstream default power3.out.',
    },
    baseColor: {
      control: 'color',
      description: 'Bar fill. Brand paper. Upstream default #fff.',
    },
    menuColor: {
      control: 'color',
      description: 'Hamburger colour. Brand ink. Upstream default unset (#000 in the file).',
    },
    buttonBgColor: {
      control: 'color',
      description: 'CTA fill. Brand ink. Upstream default unset.',
    },
    buttonTextColor: {
      control: 'color',
      description: 'CTA text. Brand paper. Upstream default unset.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets the expand duration to 0.',
    },
  },
} satisfies Meta<typeof CardNav>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Card Nav' })).toBeVisible();
}

async function playOpen(canvas: Canvas) {
  await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
  await waitFor(() => {
    expect(canvas.getByRole('button', { name: 'Close menu' })).toBeVisible();
  }, SLOW);
  await waitFor(() => {
    const card = canvas.getByText('Learn').closest('.nav-card');
    expect(card).not.toBeNull();
    expect(Number.parseFloat(getComputedStyle(card as HTMLElement).opacity)).toBeGreaterThan(0.99);
  }, SLOW);
  await expect(canvas.getByRole('link', { name: 'Open Learn' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('card-nav-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...CARD_NAV_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playOpen(canvas);
    const stage = await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(canvas.getByRole('button', { name: 'Open menu' })).toBeVisible();
  },
};

export const ExpoEase: Story = {
  args: { ...CARD_NAV_DEFAULTS, ease: 'expo.out' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playOpen(canvas);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...CARD_NAV_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('card-nav-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playOpen(canvas);
    await playPause(canvas);
  },
};
