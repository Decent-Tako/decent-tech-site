import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { CountUp } from './CountUp';
import { COUNT_UP_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Count Up',
  component: CountUp,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Count Up, commit 625f250, 2026-09-10. Mechanism: motion spring from from to to once the span is in view. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/count-up . Runtime motion 13.2.0. Pause holds the start. Replay remounts the span.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...COUNT_UP_DEFAULTS },
  argTypes: {
    to: {
      control: { type: 'number', min: 0, max: 10000, step: 100 },
      description: 'End value. Academy default 3000 (the participant goal). Upstream has no default.',
    },
    from: {
      control: { type: 'number', min: 0, max: 10000, step: 100 },
      description: 'Start value. Upstream default 0.',
    },
    direction: {
      control: 'select',
      options: ['up', 'down'],
      description: 'Count up to `to` or down from `to`. Upstream default up.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Seconds before the spring starts. Upstream default 0.',
    },
    duration: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Spring length in seconds. Upstream default 2.',
    },
    startWhen: {
      control: 'boolean',
      description: 'Start when the span is in view. Upstream default true.',
    },
    separator: {
      control: 'text',
      description: 'Thousands separator. Empty string groups nothing. Upstream default empty.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always writes the final number at once.',
    },
  },
} satisfies Meta<typeof CountUp>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Count Up' })).toBeVisible();
}

async function playDone(canvas: Canvas) {
  const stage = canvas.getByTestId('count-up-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'done');
  }, SLOW);
  await expect(canvas.getByTestId('count-up-value')).toBeVisible();
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
  args: { ...COUNT_UP_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playDone(canvas);
  },
};

export const DownWithSeparator: Story = {
  args: { ...COUNT_UP_DEFAULTS, direction: 'down', separator: ',', duration: 1 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...COUNT_UP_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('count-up-value')).toHaveTextContent('3000');
    await playPause(canvas, stage);
  },
};
