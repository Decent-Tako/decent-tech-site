import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { GooeyNav } from './GooeyNav';
import { GOOEY_NAV_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Gooey Nav',
  component: GooeyNav,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Gooey Nav, commit 625f250, 2026-09-10. Mechanism: a click moves a gooey pill and spawns particles. Licence MIT + Commons Clause. Page https://reactbits.dev/components/gooey-nav . No extra runtime. Pause holds particle CSS animations. Replay remounts the nav on the first item.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GOOEY_NAV_DEFAULTS },
  argTypes: {
    animationTime: {
      control: { type: 'range', min: 0, max: 2000, step: 50 },
      description: 'Particle flight length in milliseconds. Upstream default 600.',
    },
    particleCount: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Particles spawned per click. Upstream default 15.',
    },
    particleDistanceStart: {
      control: { type: 'range', min: 0, max: 200, step: 5 },
      description: 'Start radius of each particle. Upstream default 90.',
    },
    particleDistanceEnd: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'End radius of each particle. Upstream default 10.',
    },
    particleR: {
      control: { type: 'range', min: 0, max: 200, step: 5 },
      description: 'Rotation noise scale. Upstream default 100.',
    },
    timeVariance: {
      control: { type: 'range', min: 0, max: 800, step: 20 },
      description: 'Random extra time per particle in milliseconds. Upstream default 300.',
    },
    initialActiveIndex: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: 'Item that starts active. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets time and particle count to 0.',
    },
  },
} satisfies Meta<typeof GooeyNav>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Gooey Nav' })).toBeVisible();
}

async function playSelect(canvas: Canvas) {
  const stage = canvas.getByTestId('gooey-nav-stage');
  await userEvent.click(canvas.getByRole('link', { name: 'Learn' }));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-active', '1');
  }, SLOW);
  await expect(canvas.getByRole('link', { name: 'Learn' }).closest('li')).toHaveClass(
    'active',
  );
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
  args: { ...GOOEY_NAV_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-active', '0');
  },
};

export const DenseParticles: Story = {
  args: {
    ...GOOEY_NAV_DEFAULTS,
    particleCount: 28,
    animationTime: 900,
    particleDistanceStart: 120,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await expect(stage).toHaveAttribute('data-particles', '28');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GOOEY_NAV_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('gooey-nav-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-particles', '0');
    await playSelect(canvas);
    await playPauseResume(canvas, stage);
  },
};
