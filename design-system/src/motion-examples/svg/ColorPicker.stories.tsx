import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { COLOR_PICKER_DEFAULTS } from './defaults';
import { ColorPicker } from './ColorPicker';
import { expectSvgBrand, playPauseLoop, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Color picker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-color-picker in Academy branding.',
          'Real props: pushMagnitude default 5, pushSpring damping 30 stiffness 100. Size is lifted from the 140 px wrapper.',
          'Mechanism: usePointerPosition feeds useTransform push, then useSpring. Tap animates conic-gradient stops to the selected colour.',
          'Package motion 13.2.0, licence MIT. Extra runtime: Academy usePointerPosition because motion-plus is exclusive to members.',
          'Docs https://motion.dev/docs/react-use-spring .',
          'Example https://motion.dev/examples/react-color-picker .',
          'Live https://examples.motion.dev/react/color-picker .',
          'Pointer-driven. Pause freezes the push. Replay clears the week banner colour.',
        ].join(' '),
      },
    },
  },
  args: {
    ...COLOR_PICKER_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    pushMagnitude: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Push in pixels when the pointer is near a dot. Upstream default 5.',
    },
    damping: {
      control: { type: 'range', min: 5, max: 80, step: 1 },
      description: 'pushSpring.damping. Upstream default 30.',
    },
    stiffness: {
      control: { type: 'range', min: 20, max: 300, step: 10 },
      description: 'pushSpring.stiffness. Upstream default 100. This is Speed.',
    },
    size: {
      control: { type: 'range', min: 140, max: 420, step: 10 },
      description: 'Visible wrapper in pixels. Upstream 140. Default 320 so the rings are legible.',
    },
    caption: { control: 'text' },
    paused: {
      control: 'boolean',
      description: 'Stop pointer tracking. Continuous tracking uses Pause.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Pick a week banner colour')).toBeVisible();
    await playPauseLoop(canvas, 'svg-color-picker');
    await playReplay(canvas, 'svg-color-picker');
  },
};

export const StrongPush: Story = {
  args: {
    ...COLOR_PICKER_DEFAULTS,
    pushMagnitude: 16,
    stiffness: 60,
    caption: 'Strong push for banner pick',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Strong push for banner pick')).toBeVisible();
    await playPauseLoop(canvas, 'svg-color-picker');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...COLOR_PICKER_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectSvgBrand(canvas);
    await expect(canvas.getByTestId('svg-color-picker')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
