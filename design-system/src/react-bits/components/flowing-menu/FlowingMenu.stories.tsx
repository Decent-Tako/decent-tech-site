import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FlowingMenu } from './FlowingMenu';
import { FLOWING_MENU_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Flowing Menu',
  component: FlowingMenu,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Flowing Menu, commit 625f250, 2026-09-10. Mechanism: gsap slides a photograph marquee from the nearest edge on hover. Licence MIT + Commons Clause. Page https://reactbits.dev/components/flowing-menu . Runtime gsap 3.15.0. Pause holds the marquee tween. Replay remounts the menu.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FLOWING_MENU_DEFAULTS },
  argTypes: {
    speed: {
      control: { type: 'range', min: 2, max: 40, step: 1 },
      description: 'Marquee loop length in seconds. Upstream default 15.',
    },
    textColor: {
      control: 'color',
      description: 'Idle label colour. Brand paper. Upstream default #fff.',
    },
    bgColor: {
      control: 'color',
      description: 'Menu fill. Brand ink. Upstream default #120F17.',
    },
    marqueeBgColor: {
      control: 'color',
      description: 'Marquee fill. Brand paper. Upstream default #fff.',
    },
    marqueeTextColor: {
      control: 'color',
      description: 'Marquee label colour. Brand ink. Upstream default #120F17.',
    },
    borderColor: {
      control: 'color',
      description: 'Row divider. Brand paper. Upstream default #fff.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets marquee speed near 0.',
    },
  },
} satisfies Meta<typeof FlowingMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Flowing Menu' })).toBeVisible();
}

async function playHover(canvas: Canvas) {
  const stage = canvas.getByTestId('flowing-menu-stage');
  await userEvent.hover(canvas.getByRole('link', { name: 'Start' }));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-hover', 'Start');
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
  args: { ...FLOWING_MENU_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-hover', '');
  },
};

export const FastMarquee: Story = {
  args: { ...FLOWING_MENU_DEFAULTS, speed: 6, marqueeBgColor: '#DEF54F' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('flowing-menu-stage');
    await expect(stage).toHaveAttribute('data-speed', '6');
    await playHover(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FLOWING_MENU_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('flowing-menu-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playHover(canvas);
    await playPauseResume(canvas, stage);
  },
};
