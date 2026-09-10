import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { IosSlider } from './IosSlider';
import { expectIosBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS, SLIDER_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/iOS slider',
  component: IosSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-ios-slider in Academy branding.',
          'The article page marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: useMotionValue progress. onPan adds drag offset. useTransform maps progress to y pull, scaleX squish, and scaleY stretch.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-transform .',
          'Example https://motion.dev/examples/react-ios-slider .',
          'Live https://examples.motion.dev/react/ios-slider .',
          'One-shot intro pull on mount. Replay remounts it. Drag stays live.',
        ].join(' '),
      },
    },
  },
  args: { ...SLIDER_DEFAULTS },
  argTypes: {
    maxPull: {
      control: { type: 'range', min: 4, max: 40, step: 1 },
      description: 'Pixels the track travels past 0 and 1. Upstream default 20.',
    },
    maxSquish: {
      control: { type: 'range', min: 0.7, max: 1, step: 0.01 },
      description: 'scaleX at full pull. Upstream default 0.92.',
    },
    maxStretch: {
      control: { type: 'range', min: 1, max: 1.3, step: 0.01 },
      description: 'scaleY at full pull. Upstream default 1.08.',
    },
    keyboardStep: {
      control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 },
      description: 'Arrow key step. Upstream default 0.05.',
    },
    keyboardStiffness: {
      control: { type: 'range', min: 80, max: 500, step: 10 },
      description: 'Keyboard overshoot spring stiffness. Upstream default 200.',
    },
    keyboardDamping: {
      control: { type: 'range', min: 20, max: 120, step: 5 },
      description: 'Keyboard overshoot spring damping. Upstream default 60.',
    },
    initialProgress: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Starting progress before the intro pull. Upstream default 0.5.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof IosSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...SLIDER_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expect(canvas.getByText(/Raised toward \$3,000/)).toBeVisible();
    await waitFor(
      () => {
        const value = Number(
          canvas.getByRole('slider').getAttribute('data-progress'),
        );
        expect(value).not.toBe(0.5);
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'ios-slider');
    await waitFor(
      () => {
        const value = Number(
          canvas.getByRole('slider').getAttribute('data-progress'),
        );
        expect(value).toBeGreaterThan(0.5);
      },
      { timeout: 4000 },
    );
  },
};

export const StrongPull: Story = {
  args: {
    ...SLIDER_DEFAULTS,
    maxPull: 32,
    maxSquish: 0.8,
    maxStretch: 1.18,
    caption: 'Strong pull toward $3,000',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Strong pull toward \$3,000/)).toBeVisible();
    await playReplay(canvas, 'ios-slider');
  },
};

export const ReducedMotion: Story = {
  args: { ...SLIDER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expect(canvas.getByRole('slider')).toHaveAttribute(
      'data-progress',
      '1.00',
    );
  },
};
