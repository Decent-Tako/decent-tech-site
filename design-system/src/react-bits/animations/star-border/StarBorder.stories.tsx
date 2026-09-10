import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { StarBorder } from './StarBorder';
import { STAR_BORDER_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Star Border',
  component: StarBorder,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Star Border, commit 625f250, 2026-09-10. Mechanism: two radial gradients travel the top and bottom edges of a button. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/star-border . No extra runtime. Pause holds the star keyframes. Replay remounts the button. Colour default is brand yellow #DEF54F (upstream white).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...STAR_BORDER_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Star colour. Brand yellow #DEF54F. Upstream default white.',
    },
    speed: {
      control: 'text',
      description: 'Keyframe duration. Upstream default 6s.',
    },
    thickness: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Padding that shows the star. Upstream default 1.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Inner fill. Brand ink #212121. Upstream default #000000.',
    },
    textColor: {
      control: 'color',
      description: 'Label colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    borderColor: {
      control: 'color',
      description: 'Inner border. Brand charcoal #4A4A4A. Upstream default #222222.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always removes the star keyframes.',
    },
  },
} satisfies Meta<typeof StarBorder>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Star Border' })).toBeVisible();
}

async function playMotion(canvas: Canvas) {
  const stage = canvas.getByTestId('star-border-stage');
  const host = canvas.getByTestId('star-border-host');
  await expect(canvas.getByRole('button', { name: 'Open Week 0' })).toBeVisible();
  const glow = host.querySelector('.border-gradient-bottom');
  await expect(glow).not.toBeNull();
  return { stage, host, glow: glow as HTMLElement };
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...STAR_BORDER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, host, glow } = await playMotion(canvas);
    await expect(getComputedStyle(glow).animationPlayState).toBe('running');
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(host).toHaveAttribute('data-paused', 'false');
  },
};

export const BlueFast: Story = {
  args: {
    ...STAR_BORDER_DEFAULTS,
    color: '#0035B1',
    speed: '2s',
    thickness: 3,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, host } = await playMotion(canvas);
    await expect(stage).toHaveAttribute('data-speed', '2s');
    await expect(host).toHaveAttribute('data-speed', '2s');
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...STAR_BORDER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, host, glow } = await playMotion(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(host).toHaveAttribute('data-reduced', 'true');
    await expect(getComputedStyle(glow).animationName).toBe('none');
    await playPause(canvas, stage);
  },
};
