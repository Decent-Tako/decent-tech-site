import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { SplitText } from './SplitText';
import {
  GSAP_EASES,
  SPLIT_TEXT_ALIGNS,
  SPLIT_TEXT_DEFAULTS,
  SPLIT_TEXT_TAGS,
  SPLIT_TEXT_TYPES,
} from './source';

const meta = {
  title: 'React Bits/Text animations/Split Text',
  component: SplitText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Split Text, commit 625f250, 2026-09-10. Mechanism: SplitText breaks the paragraph into units and a gsap fromTo tween fades each unit up. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/split-text . Runtime gsap 3.15.0 and @gsap/react 2.1.2. Pause holds the tween. Replay remounts the paragraph.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SPLIT_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Paragraph that splits into units. Academy default is the Week 0 copy. Upstream has no default.`,
    },
    delay: {
      control: { type: 'range', min: 0, max: 400, step: 10 },
      description: 'Stagger between units in milliseconds. Upstream default 50.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.05 },
      description: 'Seconds per unit tween. Upstream default 1.25.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of each unit. Upstream default power3.out.',
    },
    splitType: {
      control: 'select',
      options: [...SPLIT_TEXT_TYPES],
      description: 'SplitText type. Upstream default chars.',
    },
    from: {
      control: 'object',
      description: 'Start vars. Upstream default { opacity: 0, y: 40 }.',
    },
    to: {
      control: 'object',
      description: 'End vars. Upstream default { opacity: 1, y: 0 }.',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Share of the viewport the paragraph must cross. Upstream default 0.1.',
    },
    rootMargin: {
      control: 'text',
      description: 'ScrollTrigger start offset. Upstream default -100px.',
    },
    textAlign: {
      control: 'select',
      options: [...SPLIT_TEXT_ALIGNS],
      description: 'CSS text-align. Upstream default center.',
    },
    tag: {
      control: 'select',
      options: [...SPLIT_TEXT_TAGS],
      description: 'Host element. The story uses p. Upstream default p.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the paragraph with no split.',
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

async function playDone(canvas: Canvas) {
  const stage = canvas.getByTestId('split-text-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'done');
  }, SLOW);
  await expect(canvas.getByTestId('split-text-copy')).toHaveTextContent(FEATURES[0].copy);
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
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playDone(canvas);
  },
};

export const WordsFromLeft: Story = {
  args: {
    ...SPLIT_TEXT_DEFAULTS,
    splitType: 'words',
    from: { opacity: 0, x: -32 },
    to: { opacity: 1, x: 0 },
    delay: 80,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SPLIT_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
