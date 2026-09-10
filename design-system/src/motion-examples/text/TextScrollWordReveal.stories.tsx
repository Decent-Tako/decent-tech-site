import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { SCROLL_WORD_REVEAL_DEFAULTS } from './defaults';
import { playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { TextScrollWordReveal } from './TextScrollWordReveal';

const meta = {
  title: 'Motion examples/Scroll word reveal',
  component: TextScrollWordReveal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-text-scroll-word-reveal in Academy branding.',
          'Mechanism: useScroll({ target, container, offset: ["start start", "end end"] }) drives scrollYProgress. Each word useTransform maps progress through getWordOpacity.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-scroll .',
          'Example https://motion.dev/examples/react-text-scroll-word-reveal .',
          'Live https://examples.motion.dev/react/text-scroll-word-reveal .',
          'SPREAD 0.8, WORD_DURATION 0.2. Unrevealed words are charcoal, not opacity 0.15, because that fails contrast on paper. Replay remounts then scrolls to 55 percent.',
          'Copy is the Challenge week goal, not generic studio copy.',
        ].join(' '),
      },
      story: { inline: true, height: '720px' },
    },
  },
  args: {
    ...SCROLL_WORD_REVEAL_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    statement: {
      control: 'text',
      description: 'Words split on spaces. Upstream is a studio line.',
    },
    startColor: {
      control: 'color',
      description:
        'Unrevealed word colour. Upstream was opacity 0.15. Academy charcoal #4A4A4A so contrast holds.',
    },
    endColor: {
      control: 'color',
      description: 'Revealed word colour. Academy ink #212121.',
    },
    spread: {
      control: { type: 'range', min: 0.2, max: 1, step: 0.05 },
      description: 'Share of scrollYProgress that spaces the words. Upstream 0.8.',
    },
    wordDuration: {
      control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 },
      description: 'Share of progress each word takes to reach 1. Upstream 0.2.',
    },
    kicker: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof TextScrollWordReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

function scrollStage(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  const scroller = canvas.getByLabelText('Week 0 reading');
  scroller.scrollTop = (scroller.scrollHeight - scroller.clientHeight) * 0.55;
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Week 0')).toBeVisible();
    scrollStage(canvas);
    await waitFor(
      () => {
        const progress = Number(
          canvas.getByLabelText('Week 0 reading').getAttribute('data-progress'),
        );
        expect(progress).toBeGreaterThan(0.1);
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'text-scroll-word-reveal');
    scrollStage(canvas);
  },
};

export const TightSpread: Story = {
  args: {
    ...SCROLL_WORD_REVEAL_DEFAULTS,
    statement: 'Find your Buddy. Set $3,000. Publish the page.',
    spread: 0.4,
    wordDuration: 0.1,
    kicker: 'Five actions',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Five actions')).toBeVisible();
    scrollStage(canvas);
    await playReplay(canvas, 'text-scroll-word-reveal');
    scrollStage(canvas);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SCROLL_WORD_REVEAL_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByRole('heading', { name: SCROLL_WORD_REVEAL_DEFAULTS.statement }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  },
};
