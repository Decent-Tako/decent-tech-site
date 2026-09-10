import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { MagicBento } from './MagicBento';
import { MAGIC_BENTO_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Magic Bento',
  component: MagicBento,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Magic Bento, commit 625f250, 2026-09-10. Mechanism: pointer motion on the grid drives a spotlight, border glow, and particles. Licence MIT + Commons Clause. Page https://reactbits.dev/components/magic-bento . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the grid.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MAGIC_BENTO_DEFAULTS },
  argTypes: {
    textAutoHide: {
      control: 'boolean',
      description: 'Clamp card title and copy. Upstream default true.',
    },
    enableStars: {
      control: 'boolean',
      description: 'Spawn particles on hover. Upstream default true.',
    },
    enableSpotlight: {
      control: 'boolean',
      description: 'Show the moving spotlight. Upstream default true.',
    },
    enableBorderGlow: {
      control: 'boolean',
      description: 'Glow the card border under the pointer. Upstream default true.',
    },
    disableAnimations: {
      control: 'boolean',
      description: 'Turn every gsap effect off. Upstream default false.',
    },
    spotlightRadius: {
      control: { type: 'range', min: 40, max: 600, step: 10 },
      description: 'Spotlight radius in pixels. Upstream default 300.',
    },
    particleCount: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Particles spawned per card hover. Upstream default 12.',
    },
    enableTilt: {
      control: 'boolean',
      description: 'Tilt the card with the pointer. Upstream default false.',
    },
    glowColor: {
      control: 'text',
      description: 'RGB triplet for glow. Brand accent blue 0, 53, 177. Upstream default 132, 0, 255.',
    },
    clickEffect: {
      control: 'boolean',
      description: 'Ripple on click. Upstream default true.',
    },
    enableMagnetism: {
      control: 'boolean',
      description: 'Nudge the card toward the pointer. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always turns animations off and sets particle count to 0.',
    },
  },
} satisfies Meta<typeof MagicBento>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Magic Bento' })).toBeVisible();
}

async function playClick(canvas: Canvas) {
  const stage = canvas.getByTestId('magic-bento-stage');
  await userEvent.click(canvas.getByText('Start'));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-clicked', 'Start');
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
  args: { ...MAGIC_BENTO_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playClick(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-clicked', '');
  },
};

export const TiltedStars: Story = {
  args: { ...MAGIC_BENTO_DEFAULTS, enableTilt: true, particleCount: 20 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playClick(canvas);
    await expect(stage).toHaveAttribute('data-tilt', 'true');
    await expect(stage).toHaveAttribute('data-particles', '20');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MAGIC_BENTO_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('magic-bento-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-particles', '0');
    await playClick(canvas);
    await playPauseResume(canvas, stage);
  },
};
