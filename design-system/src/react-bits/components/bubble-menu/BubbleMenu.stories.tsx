import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { BubbleMenu } from './BubbleMenu';
import { BUBBLE_MENU_DEFAULTS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Components/Bubble Menu',
  component: BubbleMenu,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Bubble Menu, commit 625f250, 2026-09-10. Mechanism: a toggle scales overlay pills from 0 with a back ease and staggered labels. Licence MIT + Commons Clause. Page https://reactbits.dev/components/bubble-menu . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the menu closed.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...BUBBLE_MENU_DEFAULTS },
  argTypes: {
    menuAriaLabel: {
      control: 'text',
      description: 'Accessible name of the toggle. Upstream default Toggle menu.',
    },
    menuBg: {
      control: 'color',
      description: 'Pill and bubble fill. Brand paper. Upstream default #fff.',
    },
    menuContentColor: {
      control: 'color',
      description: 'Label and line colour. Brand ink. Upstream default #111.',
    },
    useFixedPosition: {
      control: 'boolean',
      description: 'Pin the bar to the viewport. Keep false in the stage. Upstream default false.',
    },
    animationEase: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the pill scale. Upstream default back.out(1.5).',
    },
    animationDuration: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pill scale length in seconds. Upstream default 0.5.',
    },
    staggerDelay: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Delay between pills in seconds. Upstream default 0.12.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets duration and stagger to 0.',
    },
  },
} satisfies Meta<typeof BubbleMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Bubble Menu' })).toBeVisible();
}

async function playOpen(canvas: Canvas) {
  const stage = canvas.getByTestId('bubble-menu-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Toggle menu' }));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-open', 'true');
  }, SLOW);
  await waitFor(() => {
    expect(canvas.getByRole('menuitem', { name: 'Start' })).toBeVisible();
  }, SLOW);
  return stage;
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('bubble-menu-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...BUBBLE_MENU_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOpen(canvas);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-open', 'false');
  },
};

export const SlowStagger: Story = {
  args: { ...BUBBLE_MENU_DEFAULTS, staggerDelay: 0.2, animationDuration: 0.7 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playOpen(canvas);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...BUBBLE_MENU_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('bubble-menu-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playOpen(canvas);
    await playPause(canvas);
  },
};
