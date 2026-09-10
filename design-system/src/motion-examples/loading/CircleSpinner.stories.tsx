import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { CircleSpinner } from './CircleSpinner';
import { CIRCLE_SPINNER_DEFAULTS } from './defaults';
import { expectLoadingBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Loading/Circle spinner',
  component: CircleSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-loading-circle-spinner in Academy branding.',
          'The upstream demo exports no props. Controls lift duration, size, and border width.',
          'Mechanism: animate={{ transform: "rotate(360deg)" }} with repeat Infinity and ease linear.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation .',
          'Example https://motion.dev/examples/react-loading-circle-spinner .',
          'Live https://examples.motion.dev/react/loading-circle-spinner .',
          'Continuous. Pause and Speed. Caption is Week 0.',
        ].join(' '),
      },
    },
  },
  args: {
    ...CIRCLE_SPINNER_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.4, max: 3, step: 0.1 },
      description: 'One rotation in seconds. Upstream default 1.5. This is Speed.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides duration. Upstream has no speed; default 1.',
    },
    size: {
      control: { type: 'range', min: 32, max: 96, step: 2 },
      description: 'Spinner box in pixels. Upstream default 50.',
    },
    borderWidth: {
      control: { type: 'range', min: 2, max: 8, step: 1 },
      description: 'Border width in pixels. Upstream default 4.',
    },
    caption: { control: 'text' },
    paused: {
      control: 'boolean',
      description: 'Stop the rotation. Continuous loops use Pause, not Replay.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof CircleSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Opening Week 0')).toBeVisible();
    await playPauseLoop(canvas, 'loading-circle-spinner');
  },
};

export const Slow: Story = {
  args: {
    ...CIRCLE_SPINNER_DEFAULTS,
    duration: 3,
    caption: 'Slow open for Week 0',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Slow open for Week 0')).toBeVisible();
    await playPauseLoop(canvas, 'loading-circle-spinner');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...CIRCLE_SPINNER_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectLoadingBrand(canvas);
    await expect(canvas.getByTestId('loading-circle-spinner')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
