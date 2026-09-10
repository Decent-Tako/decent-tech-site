import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { RotatingText } from './RotatingText';
import {
  ROTATING_PRESENCE_MODE,
  ROTATING_SPLIT_BY,
  ROTATING_STAGGER_FROM,
  ROTATING_TEXT_DEFAULTS,
} from './source';

const meta = {
  title: 'React Bits/Text animations/Rotating Text',
  component: RotatingText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Rotating Text, commit 625f250, 2026-09-10. Mechanism: AnimatePresence swaps the current word on an interval and staggers each glyph. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/rotating-text . Runtime motion 13.2.0. Pause clears the interval. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ROTATING_TEXT_DEFAULTS },
  argTypes: {
    texts: {
      control: 'object',
      description: 'Words that rotate. Academy default is Start, Learn, Tools. Upstream has no default.',
    },
    animatePresenceMode: {
      control: 'select',
      options: [...ROTATING_PRESENCE_MODE],
      description: 'AnimatePresence mode. Upstream default wait.',
    },
    animatePresenceInitial: {
      control: 'boolean',
      description: 'Run the enter animation on the first word. Upstream default false.',
    },
    rotationInterval: {
      control: { type: 'range', min: 400, max: 6000, step: 100 },
      description: 'Milliseconds between words. Upstream default 2000.',
    },
    staggerDuration: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.01 },
      description: 'Seconds between glyph enters. Upstream default 0.',
    },
    staggerFrom: {
      control: 'select',
      options: [...ROTATING_STAGGER_FROM],
      description: 'Glyph stagger origin. Upstream default first.',
    },
    loop: {
      control: 'boolean',
      description: 'Return to the first word after the last. Upstream default true.',
    },
    auto: {
      control: 'boolean',
      description: 'Advance on the interval. Upstream default true.',
    },
    splitBy: {
      control: 'select',
      options: [...ROTATING_SPLIT_BY],
      description: 'How the current word splits. Upstream default characters.',
    },
    mainClassName: {
      control: 'text',
      description: 'Class on the rotating span. Academy default rotating-text. Upstream default empty.',
    },
    splitLevelClassName: {
      control: 'text',
      description: 'Class on each word or line group. Upstream default empty.',
    },
    elementLevelClassName: {
      control: 'text',
      description: 'Class on each glyph. Upstream default empty.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the first word with no swap.',
    },
  },
} satisfies Meta<typeof RotatingText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Rotating Text' })).toBeVisible();
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...ROTATING_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('rotating-text-stage');
    await expect(canvas.getByTestId('rotating-text-copy')).toBeVisible();
    await expect(canvas.getByText(FEATURES[0].kicker)).toBeVisible();
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '1');
    }, SLOW);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '1');
    }, SLOW);
  },
};

export const WordsStagger: Story = {
  args: {
    ...ROTATING_TEXT_DEFAULTS,
    splitBy: 'words',
    staggerDuration: 0.08,
    staggerFrom: 'last',
    rotationInterval: 1600,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('rotating-text-stage');
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-index', '1');
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ROTATING_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('rotating-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-index', '0');
    await expect(canvas.getByText(FEATURES[0].title)).toBeVisible();
    await playPause(canvas, stage);
  },
};
