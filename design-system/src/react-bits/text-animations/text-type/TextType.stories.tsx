import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { TextType } from './TextType';
import { TEXT_TYPE_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Text Type',
  component: TextType,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Text Type, commit 625f250, 2026-09-10. Mechanism: timeouts append and delete glyphs while gsap blinks a cursor. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/text-type . Runtime gsap 3.15.0. Pause holds the timeouts and the cursor tween. Replay remounts the typewriter.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...TEXT_TYPE_DEFAULTS },
  argTypes: {
    typingSpeed: {
      control: { type: 'range', min: 10, max: 200, step: 10 },
      description: 'Milliseconds per typed glyph. Upstream default 50.',
    },
    initialDelay: {
      control: { type: 'range', min: 0, max: 2000, step: 50 },
      description: 'Wait before the first glyph, in milliseconds. Upstream default 0.',
    },
    pauseDuration: {
      control: { type: 'range', min: 200, max: 4000, step: 100 },
      description: 'Hold on a finished phrase before delete, in milliseconds. Upstream default 2000.',
    },
    deletingSpeed: {
      control: { type: 'range', min: 10, max: 120, step: 5 },
      description: 'Milliseconds per deleted glyph. Upstream default 30.',
    },
    loop: {
      control: 'boolean',
      description: 'Cycle the phrase list. Upstream default true.',
    },
    showCursor: {
      control: 'boolean',
      description: 'Show the blinking cursor. Upstream default true.',
    },
    hideCursorWhileTyping: {
      control: 'boolean',
      description: 'Hide the cursor while glyphs are changing. Upstream default false.',
    },
    cursorCharacter: {
      control: 'text',
      description: 'Cursor glyph. Upstream default |.',
    },
    cursorBlinkDuration: {
      control: { type: 'range', min: 0.1, max: 1.5, step: 0.1 },
      description: 'gsap blink length in seconds. Upstream default 0.5.',
    },
    textColor: {
      control: 'color',
      description: 'Fill colour. Ink #212121. Upstream textColors default [].',
    },
    startOnVisible: {
      control: 'boolean',
      description: 'Wait for IntersectionObserver before typing. Upstream default false.',
    },
    reverseMode: {
      control: 'boolean',
      description: 'Type the phrase from the last glyph. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the first phrase in full with no typing.',
    },
  },
} satisfies Meta<typeof TextType>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Text Type' })).toBeVisible();
}

async function playTyped(canvas: Canvas) {
  const stage = canvas.getByTestId('text-type-stage');
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-length') ?? '0')).toBeGreaterThan(0);
  }, SLOW);
  await expect(canvas.getByTestId('text-type-copy')).toBeVisible();
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
  args: { ...TEXT_TYPE_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTyped(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playTyped(canvas);
  },
};

export const ReverseMode: Story = {
  args: { ...TEXT_TYPE_DEFAULTS, reverseMode: true, typingSpeed: 30 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTyped(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...TEXT_TYPE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('text-type-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-length', String(FEATURES[0].title.length));
    }, SLOW);
    await expect(canvas.getByTestId('text-type-copy')).toHaveTextContent(FEATURES[0].title);
    await playPause(canvas, stage);
  },
};
