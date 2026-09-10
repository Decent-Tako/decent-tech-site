import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { Shuffle } from './Shuffle';
import {
  GSAP_EASES,
  SHUFFLE_ALIGNS,
  SHUFFLE_DEFAULTS,
  SHUFFLE_DIRECTIONS,
  SHUFFLE_MODES,
  SHUFFLE_TAGS,
} from './source';

const meta = {
  title: 'React Bits/Text animations/Shuffle',
  component: Shuffle,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Shuffle, commit 625f250, 2026-09-10. Mechanism: SplitText wraps each glyph in a strip and a gsap timeline slides extra copies until the real letter lands. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/shuffle . Runtime gsap 3.15.0 and @gsap/react 2.1.2. Pause holds the timeline. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SHUFFLE_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word that splits into glyphs. Academy default is the Week 0 title. Upstream has no default.`,
    },
    shuffleDirection: {
      control: 'select',
      options: [...SHUFFLE_DIRECTIONS],
      description: 'Slide direction of each strip. Upstream default right.',
    },
    duration: {
      control: { type: 'range', min: 0.05, max: 2, step: 0.05 },
      description: 'Seconds per strip slide. Upstream default 0.35.',
    },
    maxDelay: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Random delay cap in random mode, in seconds. Upstream default 0.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of each strip. Upstream default power3.out.',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Share of the viewport the word must cross. Upstream default 0.1.',
    },
    rootMargin: {
      control: 'text',
      description: 'ScrollTrigger start offset. Upstream default -100px.',
    },
    tag: {
      control: 'select',
      options: [...SHUFFLE_TAGS],
      description: 'Host element. The story uses p. Upstream default p.',
    },
    textAlign: {
      control: 'select',
      options: [...SHUFFLE_ALIGNS],
      description: 'CSS text-align. Upstream default center.',
    },
    shuffleTimes: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      description: 'Extra glyph copies in each strip. Upstream default 1.',
    },
    animationMode: {
      control: 'select',
      options: [...SHUFFLE_MODES],
      description: 'evenodd staggers odd then even glyphs. Upstream default evenodd.',
    },
    loop: {
      control: 'boolean',
      description: 'Repeat the shuffle. Upstream default false.',
    },
    loopDelay: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Seconds between loops. Upstream default 0.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.01 },
      description: 'Seconds between evenodd glyphs. Upstream default 0.03.',
    },
    scrambleCharset: {
      control: 'text',
      description: 'Glyphs used for extra copies. Empty keeps the real letter. Upstream default empty.',
    },
    colorFrom: {
      control: 'color',
      description: 'Start colour. Ink #212121. Upstream has no default.',
    },
    colorTo: {
      control: 'color',
      description: 'End colour. Accent blue #0035B1. Upstream has no default.',
    },
    triggerOnce: {
      control: 'boolean',
      description: 'ScrollTrigger fires once. Upstream default true.',
    },
    respectReducedMotion: {
      control: 'boolean',
      description: 'Honour the OS reduced-motion query. Upstream default true.',
    },
    triggerOnHover: {
      control: 'boolean',
      description: 'Replay the shuffle on pointer enter. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the final word with no shuffle.',
    },
  },
} satisfies Meta<typeof Shuffle>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Shuffle' })).toBeVisible();
}

async function playDone(canvas: Canvas) {
  const stage = canvas.getByTestId('shuffle-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'done');
  }, SLOW);
  await expect(canvas.getByTestId('shuffle-copy')).toBeVisible();
  await expect(stage).toHaveAttribute('data-copy', FEATURES[0].title);
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
  args: { ...SHUFFLE_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playDone(canvas);
  },
};

export const ScrambleUp: Story = {
  args: {
    ...SHUFFLE_DEFAULTS,
    shuffleDirection: 'up',
    shuffleTimes: 3,
    scrambleCharset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    animationMode: 'random',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SHUFFLE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
