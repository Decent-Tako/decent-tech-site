import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PATH_DRAWING_DEFAULTS } from './defaults';
import { PathDrawing } from './PathDrawing';
import { playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Path drawing',
  component: PathDrawing,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-path-drawing in Academy branding.',
          'The upstream demo exports no props. Controls lift duration, delay step, bounce, stroke width, and size.',
          'Mechanism: draw variants. hidden sets pathLength 0. visible(i) springs pathLength to 1 with delay i * 0.5.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-svg-animation .',
          'Example https://motion.dev/examples/react-path-drawing .',
          'Live https://examples.motion.dev/react/path-drawing .',
          'One-shot. Replay remounts the SVG. Rows are Week 0, Learn, and Challenge week.',
        ].join(' '),
      },
    },
  },
  args: {
    ...PATH_DRAWING_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.4, max: 3, step: 0.1 },
      description: 'pathLength spring duration in seconds. Upstream default 1.5.',
    },
    delayStep: {
      control: { type: 'range', min: 0, max: 1.2, step: 0.1 },
      description: 'Delay multiplier per custom index. Upstream default 0.5.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.05 },
      description: 'Spring bounce. Upstream default 0.',
    },
    strokeWidth: {
      control: { type: 'range', min: 4, max: 16, step: 1 },
      description: 'Stroke width in pixels. Upstream default 10.',
    },
    size: {
      control: { type: 'range', min: 320, max: 720, step: 20 },
      description: 'SVG width and height. Upstream default 600.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof PathDrawing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Week 0, Learn, and Challenge week')).toBeVisible();
    await playReplay(canvas, 'svg-path-drawing');
  },
};

export const SlowDraw: Story = {
  args: {
    ...PATH_DRAWING_DEFAULTS,
    duration: 2.5,
    delayStep: 0.8,
    caption: 'Slow draw for Week 0',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Slow draw for Week 0')).toBeVisible();
    await playReplay(canvas, 'svg-path-drawing');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...PATH_DRAWING_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
    await expect(canvas.getByTestId('svg-path-drawing')).toHaveAttribute(
      'data-running',
      'false',
    );
  },
};
