import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { SPLIT_TEXT_DEFAULTS } from './defaults';
import { playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { SplitText } from './SplitText';

const meta = {
  title: 'Motion examples/Split text',
  component: SplitText,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-split-text in Academy branding.',
          'The article page is plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk https://examples.motion.dev/assets/index-BRxIvodC.js .',
          'Mechanism: document.fonts.ready, wrap words in span.split-word, animate opacity [0, 1] and y [10, 0] with type spring, duration 2, bounce 0, delay stagger(0.05).',
          'splitText from motion-plus is Motion+ exclusive. This catalogue keeps animate plus stagger.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/animate .',
          'Example https://motion.dev/examples/react-split-text .',
          'Live https://examples.motion.dev/react/split-text .',
          'One-shot. Replay remounts after fonts are ready. Copy is the $3,000 goal, not generic membership copy.',
        ].join(' '),
      },
    },
  },
  args: {
    ...SPLIT_TEXT_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Heading copy. Upstream default is membership copy.',
    },
    duration: {
      control: { type: 'range', min: 0.4, max: 4, step: 0.1 },
      description: 'Spring duration in seconds. Upstream default 2.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Spring bounce. Upstream default 0.',
    },
    staggerDelay: {
      control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 },
      description: 'stagger() delay in seconds. Upstream default 0.05.',
    },
    fromY: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Opening translateY in pixels. Upstream default 10.',
    },
    fontSize: {
      control: { type: 'range', min: 20, max: 48, step: 1 },
      description: 'Heading size in pixels so the 420 px box still wraps.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof SplitText>;

export default meta;
type Story = StoryObj<typeof meta>;

async function waitSplitComplete(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await waitFor(
    () => {
      expect(
        canvas.getByLabelText(SPLIT_TEXT_DEFAULTS.text).closest('.split-text') ??
          canvas.getByTestId('text-split-text').querySelector('.split-text'),
      ).toHaveAttribute('data-complete', 'true');
    },
    { timeout: 8000 },
  );
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await waitFor(() => {
      expect(
        canvas.getByLabelText(SPLIT_TEXT_DEFAULTS.text),
      ).toBeVisible();
    });
    await waitSplitComplete(canvas);
    await playReplay(canvas, 'text-split-text');
    await waitSplitComplete(canvas);
  },
};

export const FastStagger: Story = {
  args: {
    ...SPLIT_TEXT_DEFAULTS,
    text: 'Publish your page before Learn + Do.',
    duration: 1,
    staggerDelay: 0.02,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByLabelText('Publish your page before Learn + Do.'),
    ).toBeVisible();
    await waitFor(
      () => {
        expect(
          canvas
            .getByLabelText('Publish your page before Learn + Do.')
            .closest('.split-text'),
        ).toHaveAttribute('data-complete', 'true');
      },
      { timeout: 8000 },
    );
    await playReplay(canvas, 'text-split-text');
    await waitFor(
      () => {
        expect(
          canvas
            .getByLabelText('Publish your page before Learn + Do.')
            .closest('.split-text'),
        ).toHaveAttribute('data-complete', 'true');
      },
      { timeout: 8000 },
    );
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SPLIT_TEXT_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByLabelText(SPLIT_TEXT_DEFAULTS.text),
    ).toBeVisible();
    await expect(
      canvas.getByLabelText(SPLIT_TEXT_DEFAULTS.text).closest('.split-text'),
    ).toHaveAttribute('data-ready', 'true');
    await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  },
};
