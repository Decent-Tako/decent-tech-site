import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { BlurText } from './BlurText';
import { BLUR_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Blur Text',
  component: BlurText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Blur Text, commit 625f250, 2026-09-10. Mechanism: motion.span keyframes from blur 10px to sharp type, staggered by word or letter. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/blur-text . Runtime motion 13.2.0. Pause holds remaining delays. Replay remounts the paragraph.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...BLUR_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Copy that splits into units. Academy default is the Week 0 card. Upstream default ''.`,
    },
    delay: {
      control: { type: 'range', min: 0, max: 800, step: 20 },
      description: 'Stagger between units in milliseconds. Upstream default 200.',
    },
    animateBy: {
      control: 'select',
      options: ['words', 'letters'],
      description: 'Split on spaces or on characters. Upstream default words.',
    },
    direction: {
      control: 'select',
      options: ['top', 'bottom'],
      description: 'Enter from above or below. Upstream default top.',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'IntersectionObserver threshold. Upstream default 0.1.',
    },
    rootMargin: {
      control: 'text',
      description: 'IntersectionObserver rootMargin. Upstream default 0px.',
    },
    stepDuration: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Seconds per keyframe step. Upstream default 0.35.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the sharp type at once.',
    },
  },
} satisfies Meta<typeof BlurText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Blur Text' })).toBeVisible();
}

async function playDone(canvas: Canvas) {
  const stage = canvas.getByTestId('blur-text-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'done');
  }, SLOW);
  await expect(canvas.getByText(FEATURES[0].copy.split(' ')[0])).toBeVisible();
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
  args: { ...BLUR_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playDone(canvas);
  },
};

export const LettersFromBottom: Story = {
  args: { ...BLUR_TEXT_DEFAULTS, animateBy: 'letters', direction: 'bottom', delay: 40 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...BLUR_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
