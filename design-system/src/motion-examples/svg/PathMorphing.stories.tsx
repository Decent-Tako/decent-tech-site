import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PATH_MORPHING_DEFAULTS } from './defaults';
import { PathMorphing } from './PathMorphing';
import { expectSvgBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Path morphing',
  component: PathMorphing,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-path-morphing in Academy branding.',
          'The upstream demo exports no props. Controls lift duration, speed, and maxSegmentLength.',
          'Mechanism: animate() on a progress Motion value. useTransform mixer calls flubber interpolate.',
          'Package motion 13.2.0, licence MIT. Extra runtime flubber 0.4.2 MIT.',
          'Docs https://motion.dev/docs/react-svg-animation .',
          'Example https://motion.dev/examples/react-path-morphing .',
          'Live https://examples.motion.dev/react/path-morphing .',
          'Continuous. Pause and Speed. Shapes are Challenge week, Buddy, Outreach, Community, Fireside, and the $3,000 goal.',
        ].join(' '),
      },
    },
  },
  args: {
    ...PATH_MORPHING_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.3, max: 2, step: 0.1 },
      description: 'Morph duration in seconds. Upstream default 0.8. This is Speed with speed.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides duration. Upstream has no speed; default 1.',
    },
    maxSegmentLength: {
      control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 },
      description: 'flubber interpolate option. Upstream default 0.1.',
    },
    caption: { control: 'text' },
    paused: {
      control: 'boolean',
      description: 'Stop the cycle. Continuous loops use Pause, not Replay.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof PathMorphing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await waitFor(() => {
      const shape = canvas
        .getByRole('img', { name: /Academy shapes/ })
        .getAttribute('data-shape');
      expect(shape).not.toBe('Challenge week');
    }, { timeout: 4000 });
    await playPauseLoop(canvas, 'svg-path-morphing');
  },
};

export const FastCycle: Story = {
  args: {
    ...PATH_MORPHING_DEFAULTS,
    duration: 0.4,
    caption: 'Fast Academy cycle',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Fast Academy cycle')).toBeVisible();
    await playPauseLoop(canvas, 'svg-path-morphing');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...PATH_MORPHING_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectSvgBrand(canvas);
    await expect(canvas.getByTestId('svg-path-morphing')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
