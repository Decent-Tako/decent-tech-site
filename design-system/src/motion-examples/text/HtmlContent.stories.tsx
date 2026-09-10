import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { HTML_CONTENT_DEFAULTS } from './defaults';
import { HtmlContent } from './HtmlContent';
import { playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/HTML content',
  component: HtmlContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-html-content in Academy branding.',
          'Mechanism: useMotionValue count, useTransform rounds it, animate(count, to, { duration }) on mount. A motion node renders the MotionValue as HTML.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-motion-value .',
          'Example https://motion.dev/examples/react-html-content .',
          'Live https://examples.motion.dev/react/html-content .',
          'Upstream counts 0 to 100 in 5 s. This story counts 0 to 3000 because that is the participant goal. One-shot. Replay remounts.',
        ].join(' '),
      },
    },
  },
  args: {
    ...HTML_CONTENT_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    from: {
      control: { type: 'range', min: 0, max: 500, step: 10 },
      description: 'Start value. Upstream 0.',
    },
    to: {
      control: { type: 'range', min: 10, max: 5000, step: 10 },
      description: 'End value. Upstream 100. Academy default 3000.',
    },
    duration: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.5 },
      description: 'animate() duration in seconds. Upstream 5.',
    },
    prefix: { control: 'text' },
    caption: { control: 'text' },
    fontSize: {
      control: { type: 'range', min: 32, max: 96, step: 2 },
      description: 'Number size in pixels. Upstream 64.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof HtmlContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Raised toward $3,000')).toBeVisible();
    await waitFor(
      () => {
        const value = Number(
          canvas.getByRole('status').getAttribute('data-value'),
        );
        expect(value).toBeGreaterThan(0);
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'text-html-content');
  },
};

export const Tracker: Story = {
  args: {
    ...HTML_CONTENT_DEFAULTS,
    to: 100,
    duration: 2,
    prefix: '',
    caption: 'People on the 100-person tracker',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('People on the 100-person tracker'),
    ).toBeVisible();
    await playReplay(canvas, 'text-html-content');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...HTML_CONTENT_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-value',
      '3000',
    );
    await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  },
};
