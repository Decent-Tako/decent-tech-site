import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { movePointer } from '../../frame/pointerSupport';
import { TrueFocus } from './TrueFocus';
import { TRUE_FOCUS_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/True Focus',
  component: TrueFocus,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits True Focus, commit 625f250, 2026-09-10. Mechanism: words take a blur in turn while a corner frame follows the sharp word. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/true-focus . Runtime motion 13.2.0. Pause holds the word interval. Replay remounts the sentence.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...TRUE_FOCUS_DEFAULTS },
  argTypes: {
    sentence: {
      control: 'text',
      description: `Words to focus. Academy default is the first three FEATURES titles. Upstream default True Focus.`,
    },
    separator: {
      control: 'text',
      description: 'Split glyph between words. Upstream default a space.',
    },
    manualMode: {
      control: 'boolean',
      description: 'Focus follows pointer instead of the interval. Upstream default false.',
    },
    blurAmount: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Blur in pixels on the idle words. Upstream default 5.',
    },
    borderColor: {
      control: 'color',
      description: 'Corner colour. Accent blue #0035B1. Upstream default green.',
    },
    glowColor: {
      control: 'color',
      description: 'Corner glow. Accent blue at 0.6. Upstream default rgba(0, 255, 0, 0.6).',
    },
    animationDuration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Frame move length in seconds. Upstream default 0.5.',
    },
    pauseBetweenAnimations: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Hold on a word in seconds. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always keeps the first word sharp with no interval.',
    },
  },
} satisfies Meta<typeof TrueFocus>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'True Focus' })).toBeVisible();
}

async function playAdvance(canvas: Canvas) {
  const stage = canvas.getByTestId('true-focus-stage');
  await expect(canvas.getByTestId('true-focus-word-0')).toHaveTextContent(FEATURES[0].title);
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-index') ?? '0')).toBeGreaterThan(0);
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
  args: { ...TRUE_FOCUS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playAdvance(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '0');
    }, SLOW);
    await playAdvance(canvas);
  },
};

export const ManualHover: Story = {
  args: { ...TRUE_FOCUS_DEFAULTS, manualMode: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('true-focus-stage');
    const second = canvas.getByTestId('true-focus-word-1');
    await expect(second).toHaveTextContent(FEATURES[1].title);
    await userEvent.hover(second);
    movePointer(second, 12, 12);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '1');
      expect(second).toHaveAttribute('data-active', 'true');
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...TRUE_FOCUS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('true-focus-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-index', '0');
    await expect(stage).toHaveAttribute('data-blur', '0');
    await expect(canvas.getByTestId('true-focus-word-0')).toHaveAttribute('data-active', 'true');
    await playPause(canvas, stage);
  },
};
