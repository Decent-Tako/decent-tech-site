import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { GradientText } from './GradientText';
import { GRADIENT_DIRECTIONS, GRADIENT_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Gradient Text',
  component: GradientText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Gradient Text, commit 625f250, 2026-09-10. Mechanism: a clipped linear gradient sweeps across the word with useAnimationFrame. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/gradient-text . Runtime motion 13.2.0. Pause holds the frame loop. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GRADIENT_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word under the gradient. Academy default is the Week 0 title. Upstream children have no default.`,
    },
    colors: {
      control: 'object',
      description:
        'Gradient stops. Ink, accent blue, accent yellow. Upstream default #5227FF, #FF9FFC, #B497CF.',
    },
    animationSpeed: {
      control: { type: 'range', min: 1, max: 16, step: 1 },
      description: 'Seconds per sweep. Upstream default 8.',
    },
    showBorder: {
      control: 'boolean',
      description: 'Paint a matching border overlay. Upstream default false.',
    },
    direction: {
      control: 'select',
      options: [...GRADIENT_DIRECTIONS],
      description: 'Sweep axis. Upstream default horizontal.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Hold the sweep while hovered. Upstream default false.',
    },
    yoyo: {
      control: 'boolean',
      description: 'Reverse at the end of each sweep. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always freezes the gradient at the start.',
    },
  },
} satisfies Meta<typeof GradientText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Gradient Text' })).toBeVisible();
}

async function playSweep(canvas: Canvas) {
  const stage = canvas.getByTestId('gradient-text-stage');
  await expect(canvas.getByTestId('gradient-text-copy')).toHaveTextContent(FEATURES[0].title);
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-progress') ?? '0')).toBeGreaterThan(0);
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
  args: { ...GRADIENT_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSweep(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playSweep(canvas);
  },
};

export const VerticalBorder: Story = {
  args: {
    ...GRADIENT_TEXT_DEFAULTS,
    direction: 'vertical',
    showBorder: true,
    animationSpeed: 4,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSweep(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GRADIENT_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('gradient-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('gradient-text-copy')).toHaveTextContent(FEATURES[0].title);
    await playPause(canvas, stage);
  },
};
