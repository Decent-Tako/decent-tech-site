import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { StickerPeel } from './StickerPeel';
import { GSAP_EASES, STICKER_PEEL_DEFAULTS, STICKER_POSITIONS } from './source';

const meta = {
  title: 'React Bits/Animations/Sticker Peel',
  component: StickerPeel,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Sticker Peel, commit 625f250, 2026-09-10. Mechanism: hover peels a photograph with a mirrored flap, and gsap Draggable moves it. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/sticker-peel . Runtime gsap 3.15.0. Pause freezes peel and drag. Replay remounts the sticker.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...STICKER_PEEL_DEFAULTS },
  argTypes: {
    rotate: {
      control: { type: 'range', min: -45, max: 45, step: 1 },
      description: 'Photograph rotation in degrees. Upstream default 30.',
    },
    peelBackHoverPct: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Hover peel as a percent. Upstream default 30.',
    },
    peelBackActivePct: {
      control: { type: 'range', min: 0, max: 90, step: 1 },
      description: 'Active peel as a percent. Upstream default 40.',
    },
    peelEasing: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'Active peel ease. Upstream default power3.out.',
    },
    peelHoverEasing: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'Hover peel ease. Upstream default power2.out.',
    },
    width: {
      control: { type: 'range', min: 80, max: 360, step: 4 },
      description: 'Photograph width in pixels. Upstream default 200.',
    },
    shadowIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Drop shadow strength. Upstream default 0.6.',
    },
    lightingIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Point light strength. Upstream default 0.1.',
    },
    initialPosition: {
      control: 'select',
      options: [...STICKER_POSITIONS],
      description: 'Start placement. Upstream default center.',
    },
    peelDirection: {
      control: { type: 'range', min: 0, max: 360, step: 15 },
      description: 'Peel angle in degrees. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always freezes peel and drag.',
    },
  },
} satisfies Meta<typeof StickerPeel>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Sticker Peel' })).toBeVisible();
}

async function playPeel(canvas: Canvas) {
  const stage = canvas.getByTestId('sticker-peel-stage');
  const host = canvas.getByTestId('sticker-peel-host');
  const sticker = host.querySelector('.sticker-container');
  await expect(sticker).not.toBeNull();
  await expect(canvas.getByAltText('A group running together across a field')).toBeVisible();
  await userEvent.hover(sticker as HTMLElement);
  await expect(stage).toHaveAttribute('data-peeled', 'true');
  await userEvent.unhover(sticker as HTMLElement);
  await expect(stage).toHaveAttribute('data-peeled', 'false');
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
  args: { ...STICKER_PEEL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPeel(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playPeel(canvas);
  },
};

export const SidePeel: Story = {
  args: {
    ...STICKER_PEEL_DEFAULTS,
    peelDirection: 90,
    rotate: 8,
    width: 240,
    peelBackHoverPct: 42,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('sticker-peel-stage');
    await expect(stage).toHaveAttribute('data-direction', '90');
    await playPeel(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...STICKER_PEEL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('sticker-peel-stage');
    const host = canvas.getByTestId('sticker-peel-host');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(host).toHaveAttribute('data-reduced', 'true');
    const sticker = host.querySelector('.sticker-container');
    await expect(sticker).not.toBeNull();
    await userEvent.hover(sticker as HTMLElement);
    await expect(stage).toHaveAttribute('data-peeled', 'false');
    await playPause(canvas, stage);
  },
};
