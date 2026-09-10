import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { LogoLoop } from './LogoLoop';
import { LOGO_LOOP_DEFAULTS, LOGO_LOOP_DIRECTIONS } from './source';

const meta = {
  title: 'React Bits/Animations/Logo Loop',
  component: LogoLoop,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Logo Loop, commit 625f250, 2026-09-10. Mechanism: a duplicated track of Academy labels translates at a steady pixel speed. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/logo-loop . No extra runtime. Pause holds the last offset. Replay remounts the loop. Fade colour default is brand paper #FFFFFF.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LOGO_LOOP_DEFAULTS },
  argTypes: {
    speed: {
      control: { type: 'range', min: 0, max: 400, step: 10 },
      description: 'Pixels per second. Upstream default 120.',
    },
    direction: {
      control: 'select',
      options: [...LOGO_LOOP_DIRECTIONS],
      description: 'Travel direction. Upstream default left.',
    },
    width: {
      control: 'text',
      description: 'Track width. Upstream default 100%.',
    },
    logoHeight: {
      control: { type: 'range', min: 16, max: 64, step: 1 },
      description: 'Item height in pixels. Upstream default 28.',
    },
    gap: {
      control: { type: 'range', min: 8, max: 80, step: 4 },
      description: 'Gap in pixels. Upstream default 32.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Hold the track on hover. Upstream default true (undefined treated as pause).',
    },
    fadeOut: {
      control: 'boolean',
      description: 'Fade the edges. Upstream default false.',
    },
    fadeOutColor: {
      control: 'color',
      description: 'Fade colour. Brand paper #FFFFFF. Upstream CSS fallback #ffffff.',
    },
    scaleOnHover: {
      control: 'boolean',
      description: 'Scale an item on hover. Upstream default false.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Region label. Upstream default Partner logos.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the track at offset 0.',
    },
  },
} satisfies Meta<typeof LogoLoop>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Logo Loop' })).toBeVisible();
}

async function playMove(canvas: Canvas) {
  const stage = canvas.getByTestId('logo-loop-stage');
  await expect(canvas.getByTestId('logo-loop-host')).toBeVisible();
  await waitFor(() => {
    expect(Number(stage.dataset.offset)).toBeGreaterThan(0);
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
  args: { ...LOGO_LOOP_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMove(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playMove(canvas);
  },
};

export const FadeRight: Story = {
  args: { ...LOGO_LOOP_DEFAULTS, direction: 'right', fadeOut: true, scaleOnHover: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('logo-loop-stage');
    await expect(stage).toHaveAttribute('data-direction', 'right');
    await playMove(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LOGO_LOOP_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('logo-loop-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByText('Start')).toBeVisible();
    await playPause(canvas, stage);
  },
};
