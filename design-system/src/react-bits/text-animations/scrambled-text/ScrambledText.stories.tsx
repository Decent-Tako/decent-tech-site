import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { ARTICLE } from '../../../pages/content';
import { ScrambledText } from './ScrambledText';
import { SCRAMBLED_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Scrambled Text',
  component: ScrambledText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Scrambled Text, commit 625f250, 2026-09-10. Mechanism: the gsap SplitText plugin splits the text into letters and the ScrambleTextPlugin scrambles every letter near the pointer back to itself. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/scrambled-text . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SCRAMBLED_TEXT_DEFAULTS },
  argTypes: {
    radius: {
      control: { type: 'range', min: 20, max: 400, step: 10 },
      description: 'Pointer reach in pixels. Upstream default 100.',
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 4, step: 0.1 },
      description: 'Longest scramble in seconds, at the pointer. Upstream default 1.2.',
    },
    speed: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Letter cycle speed of the scramble. Upstream default 0.5.',
    },
    scrambleChars: {
      control: 'text',
      description: 'Characters the scramble cycles through. Upstream default .: (full stop and colon).',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always ignores the pointer, so the letters stay.',
    },
  },
} satisfies Meta<typeof ScrambledText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Scrambled Text' })).toBeVisible();
}

function block(canvas: Canvas): HTMLElement {
  const root = canvas.getByTestId('scrambled-text-box').querySelector('.text-block');
  if (!(root instanceof HTMLElement)) throw new Error('The scrambled text block is missing.');
  return root;
}

// Sweep the pointer across the letters, catch a scrambled frame, then wait
// for every letter to settle back.
async function playSweep(canvas: Canvas) {
  const root = block(canvas);
  await waitFor(() => {
    expect(root.querySelectorAll('.char').length).toBeGreaterThan(0);
  }, SLOW);
  const rect = root.getBoundingClientRect();
  for (let step = 0; step < 8; step += 1) {
    fireEvent.pointerMove(root, {
      clientX: rect.left + (rect.width * (step + 0.5)) / 8,
      clientY: rect.top + rect.height / 2,
    });
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  await waitFor(() => {
    expect(root.textContent?.replace(/\s+/g, ' ').trim()).not.toBe(ARTICLE.title);
  }, SLOW);
  await waitFor(() => {
    expect(root.textContent?.replace(/\s+/g, ' ').trim()).toBe(ARTICLE.title);
  }, SLOW);
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('scrambled-text-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...SCRAMBLED_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playSweep(canvas);
    const stage = await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playSweep(canvas);
  },
};

export const WideSlow: Story = {
  args: { ...SCRAMBLED_TEXT_DEFAULTS, radius: 300, duration: 2, scrambleChars: '#*+' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playSweep(canvas);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...SCRAMBLED_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scrambled-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    const root = block(canvas);
    await waitFor(() => {
      expect(root.querySelectorAll('.char').length).toBeGreaterThan(0);
    }, SLOW);
    const rect = root.getBoundingClientRect();
    fireEvent.pointerMove(root, { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 });
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(root.textContent?.replace(/\s+/g, ' ').trim()).toBe(ARTICLE.title);
    await playPause(canvas);
  },
};
