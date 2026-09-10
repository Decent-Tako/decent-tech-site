import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { FoldText } from './FoldText';
import { FOLD_HINGES, FOLD_SPLITS, FOLD_TEXT_DEFAULTS, FOLD_TRIGGERS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Text animations/Fold Text',
  component: FoldText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Fold Text, commit 625f250, 2026-09-10. Mechanism: gsap rotates each character, word, or line from a hinge into the page. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/fold-text . Runtime gsap 3.15.0. Pause holds the timeline. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FOLD_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Copy that splits into pieces. Academy default is the Week 0 title. Upstream default 'Design unfolds'.`,
    },
    splitBy: {
      control: 'select',
      options: [...FOLD_SPLITS],
      description: 'Split unit. Upstream default char.',
    },
    hinge: {
      control: 'select',
      options: [...FOLD_HINGES],
      description: 'Fold origin. Upstream default top.',
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Seconds per piece. Upstream default 0.65.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.005 },
      description: 'Delay between pieces in seconds. Upstream default 0.045.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease. Upstream default power3.out.',
    },
    perspective: {
      control: { type: 'range', min: 120, max: 1400, step: 20 },
      description: 'CSS perspective in pixels. Upstream default 700.',
    },
    creaseShading: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Crease overlay opacity. Upstream default 0.55.',
    },
    trigger: {
      control: 'select',
      options: [...FOLD_TRIGGERS],
      description: 'When the fold plays. Upstream default mount.',
    },
    fontSize: {
      control: { type: 'range', min: 24, max: 120, step: 4 },
      description: 'Size in pixels. Upstream default 80.',
    },
    fontWeight: {
      control: { type: 'range', min: 400, max: 800, step: 100 },
      description: 'Weight of the word. Brand Sans 700. Upstream default 800.',
    },
    color: {
      control: 'color',
      description: 'Fill of the word. Ink #212121. Upstream default #f7f2e8.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the unfolded word at once.',
    },
  },
} satisfies Meta<typeof FoldText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Fold Text' })).toBeVisible();
}

async function playDone(canvas: Canvas) {
  const stage = canvas.getByTestId('fold-text-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'done');
  }, SLOW);
  await expect(canvas.getByTestId('fold-text-root')).toHaveTextContent(FEATURES[0].title);
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
  args: { ...FOLD_TEXT_DEFAULTS },
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
    ...FOLD_TEXT_DEFAULTS,
    text: FEATURES[0].kicker,
    splitBy: 'word',
    hinge: 'left',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FOLD_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDone(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
