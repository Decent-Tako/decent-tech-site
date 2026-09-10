import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { LINE_REVEAL_DEFAULTS } from './defaults';
import { LineReveal } from './LineReveal';
import { expectLoadingBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Loading/Line reveal',
  component: LineReveal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-loading-line-reveal in Academy branding.',
          'The article page now marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: useSpring, useTransform edges, useMotionTemplate polygon clipPath, useMotionValueEvent, animate() open.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-motion-template .',
          'Example https://motion.dev/examples/react-loading-line-reveal .',
          'Live https://examples.motion.dev/react/loading-line-reveal .',
          'One-shot. Replay remounts. Gallery is Academy photographs plus the $3,000 goal.',
        ].join(' '),
      },
    },
  },
  args: {
    ...LINE_REVEAL_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    intervalMs: {
      control: { type: 'range', min: 80, max: 800, step: 20 },
      description: 'Mock load tick in milliseconds. Upstream default 300.',
    },
    increment: {
      control: { type: 'range', min: 0.05, max: 0.6, step: 0.05 },
      description: 'Max random add per tick. Upstream default 0.3.',
    },
    stiffness: {
      control: { type: 'range', min: 80, max: 800, step: 20 },
      description: 'useSpring stiffness. Upstream default 500.',
    },
    damping: {
      control: { type: 'range', min: 10, max: 80, step: 2 },
      description: 'useSpring damping. Upstream default 40.',
    },
    visualDuration: {
      control: { type: 'range', min: 0.2, max: 1.2, step: 0.05 },
      description: 'Open-spring visualDuration. Upstream default 0.5.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.05 },
      description: 'Open-spring bounce. Upstream default 0.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof LineReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Goal $3,000')).toBeVisible();
    await expectFullColorPhotos(canvas);
    await waitFor(
      () => {
        expect(canvas.getByRole('status')).toHaveAttribute(
          'data-loaded',
          'true',
        );
      },
      { timeout: 5000 },
    );
    await playReplay(canvas, 'loading-line-reveal');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...LINE_REVEAL_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectLoadingBrand(canvas);
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-loaded',
      'true',
    );
    await expect(canvas.getByText('Goal $3,000')).toBeVisible();
    await expectFullColorPhotos(canvas);
  },
};
