import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { DecryptedText } from './DecryptedText';
import { DECRYPTED_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Decrypted Text',
  component: DecryptedText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Decrypted Text, commit 625f250, 2026-09-10. Mechanism: characters scramble through a glyph set, then settle on the source string. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/decrypted-text . Runtime motion 13.2.0. Pause clears the interval. Replay remounts the span.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DECRYPTED_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Source string. Academy default ${DECRYPTED_TEXT_DEFAULTS.text}. Upstream has no default.`,
    },
    speed: {
      control: { type: 'range', min: 10, max: 200, step: 10 },
      description: 'Milliseconds per scramble tick. Upstream default 50.',
    },
    maxIterations: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'Ticks before the non-sequential reveal settles. Upstream default 10.',
    },
    sequential: {
      control: 'boolean',
      description: 'Reveal one index at a time. Upstream default false.',
    },
    revealDirection: {
      control: 'select',
      options: ['start', 'end', 'center'],
      description: 'Order of sequential reveal. Upstream default start.',
    },
    useOriginalCharsOnly: {
      control: 'boolean',
      description: 'Scramble with glyphs from the source string only. Upstream default false.',
    },
    characters: {
      control: 'text',
      description: 'Glyph set for the scramble. Upstream default A-Z a-z and symbols.',
    },
    parentClassName: {
      control: 'text',
      description: 'Class on the wrapper span. Academy default decrypted-text. Upstream default empty.',
    },
    encryptedClassName: {
      control: 'text',
      description: 'Class on glyphs still scrambling. Academy default decrypted-text__hidden. Upstream default empty.',
    },
    animateOn: {
      control: 'select',
      options: ['view', 'hover', 'inViewHover', 'click'],
      description: 'Trigger. Upstream default hover.',
    },
    clickMode: {
      control: 'select',
      options: ['once', 'toggle'],
      description: 'Click behaviour when animateOn is click. Upstream default once.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the plain title.',
    },
  },
} satisfies Meta<typeof DecryptedText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Decrypted Text' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('decrypted-text-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...DECRYPTED_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('decrypted-text-stage');
    await userEvent.hover(canvas.getByTestId('decrypted-text'));
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-animating', 'true');
    }, SLOW);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-animating', 'false');
    }, SLOW);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
  },
};

export const SequentialClick: Story = {
  args: {
    ...DECRYPTED_TEXT_DEFAULTS,
    sequential: true,
    animateOn: 'click',
    text: FEATURES[1].title,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('decrypted-text-stage');
    await userEvent.click(canvas.getByTestId('decrypted-text'));
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-animating', 'true');
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...DECRYPTED_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPause(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByText(FEATURES[0].title)).toBeVisible();
  },
};
