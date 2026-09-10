import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { SplitFlapText } from './SplitFlapText';
import { SPLIT_FLAP_CHARSETS, SPLIT_FLAP_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Split Flap Text',
  component: SplitFlapText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Split Flap Text, commit 625f250, 2026-09-10. Mechanism: each glyph sits on a split-flap tile that flips through a charset, then lands on the next phrase. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/split-flap-text . No extra runtime package. Pause holds the cycle timer. Replay remounts the board.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SPLIT_FLAP_TEXT_DEFAULTS },
  argTypes: {
    words: {
      control: 'object',
      description: 'Phrases on the board. Academy default is the first three feature titles. Upstream default LAUNCH READY, SYNC ONLINE, SIGNAL LIVE.',
    },
    flipDuration: {
      control: { type: 'range', min: 0.04, max: 0.4, step: 0.02 },
      description: 'Seconds per flap. Upstream default 0.12.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.01 },
      description: 'Seconds between tiles. Upstream default 0.06.',
    },
    cycleDelay: {
      control: { type: 'range', min: 400, max: 6000, step: 100 },
      description: 'Milliseconds before the next phrase. Upstream default 2400.',
    },
    charset: {
      control: 'select',
      options: [...SPLIT_FLAP_CHARSETS],
      description: 'Glyph set during the flip. Upstream default alphanumeric.',
    },
    flipsPerChar: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Random flaps before the target glyph. Upstream default 8.',
    },
    tileColor: {
      control: 'color',
      description: 'Tile fill. Ink #212121. Upstream default #111827.',
    },
    textColor: {
      control: 'color',
      description: 'Glyph colour. Paper #FFFFFF. Upstream default #f8fafc.',
    },
    tileRadius: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Tile corner radius in pixels. Upstream default 8.',
    },
    gap: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Gap between tiles in pixels. Upstream default 6.',
    },
    fontSize: {
      control: { type: 'range', min: 20, max: 80, step: 2 },
      description: 'Tile type size in pixels. Upstream default 52.',
    },
    loop: {
      control: 'boolean',
      description: 'Repeat the phrase list. Upstream default true.',
    },
    padTo: {
      control: { type: 'range', min: 1, max: 24, step: 1 },
      description: 'Minimum tile count. Upstream default 12.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the first phrase with no flaps.',
    },
  },
} satisfies Meta<typeof SplitFlapText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Split Flap Text' })).toBeVisible();
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...SPLIT_FLAP_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('split-flap-text-stage');
    await expect(canvas.getByTestId('split-flap-text-copy')).toHaveAttribute(
      'aria-label',
      expect.stringContaining(FEATURES[0].title),
    );
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-index') ?? '0')).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-index') ?? '0')).toBeGreaterThan(0);
    }, SLOW);
  },
};

export const FastAlpha: Story = {
  args: {
    ...SPLIT_FLAP_TEXT_DEFAULTS,
    charset: 'alpha',
    cycleDelay: 1200,
    flipsPerChar: 3,
    fontSize: 36,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('split-flap-text-stage');
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-index') ?? '0')).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SPLIT_FLAP_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('split-flap-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-index', '0');
    await expect(canvas.getByTestId('split-flap-text-copy')).toHaveAttribute(
      'aria-label',
      expect.stringContaining(FEATURES[0].title),
    );
    await playPause(canvas, stage);
  },
};
