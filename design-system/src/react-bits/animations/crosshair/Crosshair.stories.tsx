import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { Crosshair } from './Crosshair';
import { CROSSHAIR_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Crosshair',
  component: Crosshair,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Crosshair, commit 625f250, 2026-09-10. Mechanism: two lines lerp to the pointer; link hover plays SVG turbulence. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/crosshair . Runtime gsap 3.15.0. Pause stops the lerp loop. Replay remounts the lines. Colour default is brand paper #FFFFFF (upstream white).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CROSSHAIR_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Line colour. Brand paper #FFFFFF. Upstream default white.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always freezes the lines.',
    },
  },
} satisfies Meta<typeof Crosshair>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Crosshair' })).toBeVisible();
}

async function playAim(canvas: Canvas) {
  const stage = canvas.getByTestId('crosshair-stage');
  movePointer(stage, 120, 90);
  movePointer(stage, 220, 150);
  await waitFor(() => {
    expect(canvas.getByTestId('crosshair-x')).toHaveStyle({ opacity: '1' });
  });
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
  args: { ...CROSSHAIR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playAim(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playAim(canvas);
  },
};

export const AccentYellow: Story = {
  args: { ...CROSSHAIR_DEFAULTS, color: '#DEF54F' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playAim(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...CROSSHAIR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('crosshair-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
