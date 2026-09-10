import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { StaggeredMenu } from './StaggeredMenu';
import { STAGGERED_MENU_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Staggered Menu',
  component: StaggeredMenu,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Staggered Menu, commit 625f250, 2026-09-10. Mechanism: colour prelayers slide in, then the panel, then labels rise with a stagger. Licence MIT + Commons Clause. Page https://reactbits.dev/components/staggered-menu . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the menu closed.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...STAGGERED_MENU_DEFAULTS },
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Side the panel enters from. Upstream default right.',
    },
    colors: {
      control: 'object',
      description: 'Prelayer fills. Brand accent blue and yellow. Upstream default #B497CF, #5227FF.',
    },
    displaySocials: {
      control: 'boolean',
      description: 'Show the social row. Upstream default true.',
    },
    displayItemNumbering: {
      control: 'boolean',
      description: 'Show 01, 02 on each item. Upstream default true.',
    },
    menuButtonColor: {
      control: 'color',
      description: 'Toggle colour when closed. Brand paper. Upstream default #fff.',
    },
    openMenuButtonColor: {
      control: 'color',
      description: 'Toggle colour when open. Brand paper. Upstream default #fff.',
    },
    changeMenuColorOnOpen: {
      control: 'boolean',
      description: 'Tween the toggle colour on open. Upstream default true.',
    },
    accentColor: {
      control: 'color',
      description: 'Hover and numbering colour. Brand accent blue. Upstream default #5227FF.',
    },
    isFixed: {
      control: 'boolean',
      description: 'Pin the menu to the viewport. Keep false in the stage. Upstream default false.',
    },
    closeOnClickAway: {
      control: 'boolean',
      description: 'Click on the stage outside the panel closes it. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets gsap durations to 0.',
    },
  },
} satisfies Meta<typeof StaggeredMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Staggered Menu' })).toBeVisible();
}

async function playOpen(canvas: Canvas) {
  const stage = canvas.getByTestId('staggered-menu-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-open', 'true');
  }, SLOW);
  await waitFor(() => {
    expect(canvas.getByRole('link', { name: 'Start' })).toBeVisible();
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
  args: { ...STAGGERED_MENU_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOpen(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-open', 'false');
  },
};

export const PanelLeft: Story = {
  args: { ...STAGGERED_MENU_DEFAULTS, position: 'left', displayItemNumbering: false },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('staggered-menu-stage');
    await expect(stage).toHaveAttribute('data-position', 'left');
    await expect(stage).toHaveAttribute('data-numbering', 'false');
    await playOpen(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...STAGGERED_MENU_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('staggered-menu-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playOpen(canvas);
    await playPauseResume(canvas, stage);
  },
};
