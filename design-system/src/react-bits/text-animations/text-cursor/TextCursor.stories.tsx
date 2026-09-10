import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { movePointer } from '../../frame/pointerSupport';
import { TextCursor } from './TextCursor';
import { TEXT_CURSOR_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Text Cursor',
  component: TextCursor,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Text Cursor, commit 625f250, 2026-09-10. Mechanism: pointer motion drops the word along the path; AnimatePresence fades idle points. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/text-cursor . Runtime motion 13.2.0. Pause skips new points. Replay remounts the stage.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...TEXT_CURSOR_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word dropped on the path. Academy default is the Week 0 title. Upstream default is an emoji.`,
    },
    spacing: {
      control: { type: 'range', min: 20, max: 200, step: 10 },
      description: 'Pixels between trail points. Upstream default 100.',
    },
    followMouseDirection: {
      control: 'boolean',
      description: 'Rotate each point toward the pointer. Upstream default true.',
    },
    randomFloat: {
      control: 'boolean',
      description: 'Float each point on a loop. Upstream default true.',
    },
    exitDuration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Seconds to fade a point. Upstream default 0.5.',
    },
    removalInterval: {
      control: { type: 'range', min: 10, max: 200, step: 10 },
      description: 'Milliseconds between idle removals. Upstream default 30.',
    },
    maxPoints: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Cap on live points. Upstream default 5.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always keeps the trail empty.',
    },
  },
} satisfies Meta<typeof TextCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Text Cursor' })).toBeVisible();
}

async function playTrail(canvas: Canvas) {
  const stage = canvas.getByTestId('text-cursor-stage');
  const host = canvas.getByTestId('text-cursor-host');
  movePointer(host, 40, 40);
  movePointer(host, 160, 80);
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-count') ?? '0')).toBeGreaterThan(0);
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
  args: { ...TEXT_CURSOR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTrail(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playTrail(canvas);
  },
};

export const TightSpacing: Story = {
  args: {
    ...TEXT_CURSOR_DEFAULTS,
    spacing: 40,
    maxPoints: 8,
    randomFloat: false,
    text: FEATURES[1].title,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTrail(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...TEXT_CURSOR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('text-cursor-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-count', '0');
    movePointer(canvas.getByTestId('text-cursor-host'), 40, 40);
    await expect(stage).toHaveAttribute('data-count', '0');
    await playPause(canvas, stage);
  },
};
