import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { ARTICLE } from '../../../pages/content';
import { SPLIT_EASES, SPLIT_TAGS, SPLIT_TEXT_DEFAULTS, SPLIT_TYPES } from './source';
import { SplitText } from './SplitText';

const meta = {
  title: 'React Bits/Text animations/Split Text',
  component: SplitText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Split Text, commit 625f250, 2026-09-10. Mechanism: the gsap SplitText plugin splits the text into chars, words, or lines and gsap.fromTo tweens each piece in with a stagger once a ScrollTrigger fires. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/split-text . Runtime gsap 3.15.0 and @gsap/react 2.1.2. Pause holds the gsap global timeline. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SPLIT_TEXT_DEFAULTS },
  argTypes: {
    delay: {
      control: { type: 'range', min: 0, max: 300, step: 10 },
      description: 'Stagger between pieces in milliseconds. Upstream default 50.',
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 4, step: 0.05 },
      description: 'Tween length per piece in seconds. Upstream default 1.25.',
    },
    ease: {
      control: 'select',
      options: [...SPLIT_EASES],
      description: 'gsap ease of the tween. Upstream default power3.out.',
    },
    splitType: {
      control: 'select',
      options: [...SPLIT_TYPES],
      description: 'What the text splits into. Upstream default chars.',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Share of the viewport the element must cross. Upstream default 0.1.',
    },
    rootMargin: {
      control: 'text',
      description: 'Offset added to the trigger start. Upstream default -100px.',
    },
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment of the block. Upstream default center.',
    },
    tag: {
      control: 'select',
      options: [...SPLIT_TAGS],
      description: 'Element the text renders in. Upstream default p.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always lands every piece at once with no stagger.',
    },
  },
} satisfies Meta<typeof SplitText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Split Text' })).toBeVisible();
}

async function playLand(canvas: Canvas) {
  const stage = canvas.getByTestId('split-text-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'done');
  }, SLOW);
  const box = canvas.getByTestId('split-text-box');
  await expect(box).toHaveTextContent(ARTICLE.title);
  const pieces = box.querySelectorAll('.split-char, .split-word, .split-line');
  expect(pieces.length).toBeGreaterThan(0);
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
  args: { ...SPLIT_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playLand(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-state', 'pending');
    await playLand(canvas);
  },
};

export const WordsHeading: Story = {
  args: { ...SPLIT_TEXT_DEFAULTS, splitType: 'words', tag: 'h3', duration: 0.6, delay: 120 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playLand(canvas);
    await expect(canvas.getByRole('heading', { name: ARTICLE.title })).toBeVisible();
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SPLIT_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playLand(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
