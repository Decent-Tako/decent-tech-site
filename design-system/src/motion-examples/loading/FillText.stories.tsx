import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { FILL_TEXT_DEFAULTS } from './defaults';
import { FillText } from './FillText';
import { expectLoadingBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Loading/Fill text',
  component: FillText,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-loading-fill-text in Academy branding.',
          'The article page now marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: useSpring progress. useTransform maps [0, 1] to clip-path inset fill.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-spring .',
          'Example https://motion.dev/examples/react-loading-fill-text .',
          'Live https://examples.motion.dev/react/loading-fill-text .',
          'One-shot. Replay remounts the spring. Text is CHALLENGE, not generic Loading.',
        ].join(' '),
      },
    },
  },
  args: {
    ...FILL_TEXT_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    intervalMs: {
      control: { type: 'range', min: 120, max: 1000, step: 20 },
      description: 'Mock load tick in milliseconds. Upstream default 500.',
    },
    increment: {
      control: { type: 'range', min: 0.05, max: 0.6, step: 0.05 },
      description: 'Max random add per tick. Upstream default 0.2.',
    },
    text: {
      control: 'text',
      description: 'Fill copy. Upstream default Loading.',
    },
    caption: { control: 'text' },
    fontSize: {
      control: { type: 'range', min: 32, max: 80, step: 2 },
      description: 'Upstream default 64.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof FillText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getAllByText('CHALLENGE').length).toBeGreaterThanOrEqual(
      1,
    );
    await waitFor(
      () => {
        const progress = Number(
          canvas.getByRole('status').getAttribute('data-progress'),
        );
        expect(progress).toBeGreaterThan(0);
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'loading-fill-text');
  },
};

export const GoalCopy: Story = {
  args: {
    ...FILL_TEXT_DEFAULTS,
    text: '$3,000',
    caption: 'Participant goal',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Participant goal')).toBeVisible();
    await playReplay(canvas, 'loading-fill-text');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...FILL_TEXT_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectLoadingBrand(canvas);
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-progress',
      '1.00',
    );
    await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  },
};
