import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { DecayCard } from './DecayCard';
import { DECAY_CARD_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Decay Card',
  component: DecayCard,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Decay Card, commit 625f250, 2026-09-10. Mechanism: pointer travel drives an SVG displacement map and a gsap tilt. Licence MIT + Commons Clause. Page https://reactbits.dev/components/decay-card . Runtime gsap 3.15.0. Pause holds the rAF loop. Replay remounts the card.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DECAY_CARD_DEFAULTS },
  argTypes: {
    width: {
      control: { type: 'range', min: 180, max: 420, step: 10 },
      description: 'Card width in pixels. Upstream default 300.',
    },
    height: {
      control: { type: 'range', min: 240, max: 520, step: 10 },
      description: 'Card height in pixels. Upstream default 400.',
    },
    baseFrequency: {
      control: { type: 'range', min: 0.002, max: 0.06, step: 0.001 },
      description: 'Turbulence frequency. Upstream default 0.015.',
    },
    numOctaves: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      description: 'Turbulence octaves. Upstream default 5.',
    },
    seed: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Turbulence seed. Upstream default 4.',
    },
    maxDisplacement: {
      control: { type: 'range', min: 0, max: 800, step: 10 },
      description: 'Peak displacement scale. Upstream default 400.',
    },
    movementBound: {
      control: { type: 'range', min: 0, max: 120, step: 5 },
      description: 'Tilt travel cap in pixels. Upstream default 50.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the photograph still.',
    },
  },
} satisfies Meta<typeof DecayCard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Decay Card' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('decay-card-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

async function playDecay(stage: HTMLElement) {
  const card = stage.querySelector('.content');
  await expect(card).toBeTruthy();
  await expect(stage).toHaveTextContent('Start');
  movePointer(card as HTMLElement, 40, 40);
  movePointer(card as HTMLElement, 180, 220);
  await waitFor(() => {
    expect(Number.parseFloat(stage.getAttribute('data-scale') ?? '0')).toBeGreaterThan(1);
  }, SLOW);
}

export const Default: Story = {
  args: { ...DECAY_CARD_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('decay-card-stage');
    await playDecay(stage);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playDecay(stage);
  },
};

export const StrongDecay: Story = {
  args: { ...DECAY_CARD_DEFAULTS, maxDisplacement: 700, baseFrequency: 0.03 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('decay-card-stage');
    await playDecay(stage);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...DECAY_CARD_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('decay-card-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveTextContent('Week 0');
    await expect(stage).toHaveAttribute('data-scale', '0');
    await playPause(canvas);
  },
};
