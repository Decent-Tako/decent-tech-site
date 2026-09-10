import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { COLOR_INTERPOLATION_DEFAULTS } from './defaults';
import { ColorInterpolation } from './ColorInterpolation';
import { expectSvgBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Color interpolation',
  component: ColorInterpolation,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-color-interpolation in Academy branding.',
          'The upstream demo exports no props. Controls lift duration, speed, fromColor, toColor, and swatch size.',
          'Mechanism: WAAPI Element.animate versus useAnimate() on backgroundColor. Motion interpolates in linear RGB.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-animate .',
          'Example https://motion.dev/examples/react-color-interpolation .',
          'Live https://examples.motion.dev/react/color-interpolation .',
          'Continuous. Pause and Speed. Colours are hover blue #0035B1 and press yellow #DEF54F.',
        ].join(' '),
      },
    },
  },
  args: {
    ...COLOR_INTERPOLATION_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.4, max: 4, step: 0.1 },
      description: 'One direction in seconds. Upstream default 2. This is Speed with speed.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides duration. Upstream has no speed; default 1.',
    },
    fromColor: {
      control: 'color',
      description: 'Start colour. Upstream var(--hue-1). Default Academy blue #0035B1.',
    },
    toColor: {
      control: 'color',
      description: 'End colour. Upstream var(--hue-4). Default Academy yellow #DEF54F.',
    },
    swatchSize: {
      control: { type: 'range', min: 64, max: 160, step: 4 },
      description: 'Swatch box in pixels. Upstream default 100.',
    },
    caption: { control: 'text' },
    paused: {
      control: 'boolean',
      description: 'Stop both loops. Continuous loops use Pause, not Replay.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof ColorInterpolation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Hover blue to press yellow')).toBeVisible();
    await expect(canvas.getByText('Browser')).toBeVisible();
    await expect(canvas.getByText('Motion')).toBeVisible();
    await playPauseLoop(canvas, 'svg-color-interpolation');
  },
};

export const InkToBlue: Story = {
  args: {
    ...COLOR_INTERPOLATION_DEFAULTS,
    fromColor: '#212121',
    toColor: '#0035B1',
    caption: 'Ink to hover blue',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Ink to hover blue')).toBeVisible();
    await playPauseLoop(canvas, 'svg-color-interpolation');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...COLOR_INTERPOLATION_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectSvgBrand(canvas);
    await expect(canvas.getByTestId('svg-color-interpolation')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
