import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { movePointer } from '../../frame/pointerSupport';
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
          'Vendored React Bits Scrambled Text, commit 625f250, 2026-09-10. Mechanism: SplitText splits the paragraph and ScrambleTextPlugin scrambles glyphs near the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/scrambled-text . Runtime gsap 3.15.0. Pause skips pointer scramble. Replay remounts the paragraph.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SCRAMBLED_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Paragraph that splits into glyphs. Academy default is the Week 0 copy. Upstream children have no default.`,
    },
    radius: {
      control: { type: 'range', min: 20, max: 300, step: 10 },
      description: 'Pointer radius in pixels. Upstream default 100.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Maximum scramble length in seconds. Upstream default 1.2.',
    },
    speed: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'ScrambleTextPlugin speed. Upstream default 0.5.',
    },
    scrambleChars: {
      control: 'text',
      description: 'Glyph set used while scrambled. Upstream default .:.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always leaves the paragraph unsplit.',
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

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...SCRAMBLED_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scrambled-text-stage');
    const copy = canvas.getByTestId('scrambled-text-copy');
    await expect(copy).toHaveTextContent(FEATURES[0].copy);
    movePointer(copy, 24, 16);
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-scrambles') ?? '0')).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-scrambles', '0');
  },
};

export const WideRadius: Story = {
  args: {
    ...SCRAMBLED_TEXT_DEFAULTS,
    radius: 220,
    scrambleChars: 'ABC',
    text: FEATURES[1].copy,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scrambled-text-stage');
    const copy = canvas.getByTestId('scrambled-text-copy');
    await expect(copy).toHaveTextContent(FEATURES[1].copy);
    movePointer(copy, 40, 20);
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-scrambles') ?? '0')).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SCRAMBLED_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scrambled-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('scrambled-text-copy')).toHaveTextContent(FEATURES[0].copy);
    await playPause(canvas, stage);
  },
};
