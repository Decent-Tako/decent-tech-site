import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { Gestures } from './Gestures';
import { GESTURES_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Gestures',
  component: Gestures,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-gestures in Academy branding.',
          'Mechanism: whileHover and whileTap set target keyframes. Hover uses a tween. Rest and tap use a spring.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-gestures . Example https://motion.dev/examples/react-gestures . Live https://examples.motion.dev/react/gestures .',
          'Upstream hover scale 1.2, tap scale 0.8. Tutorial also sets rotate and backgroundColor. Rest is ink. Hover is blue. Press is yellow.',
          'Pages/Pressable already uses whileHover and whileTap for a different composition.',
        ].join(' '),
      },
    },
  },
  args: { ...GESTURES_DEFAULTS },
  argTypes: {
    hoverScale: {
      control: { type: 'range', min: 1, max: 1.5, step: 0.05 },
      description: 'whileHover scale. Upstream 1.2.',
    },
    tapScale: {
      control: { type: 'range', min: 0.6, max: 1, step: 0.05 },
      description: 'whileTap scale. Upstream 0.8.',
    },
    hoverRotate: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'whileHover rotate in degrees. Upstream 0. Tutorial 5.',
    },
    tapRotate: {
      control: { type: 'range', min: -12, max: 0, step: 1 },
      description: 'whileTap rotate in degrees. Upstream 0. Tutorial -5.',
    },
    hoverDuration: {
      control: { type: 'range', min: 0.05, max: 0.6, step: 0.05 },
      description: 'Hover tween duration in seconds. Tutorial 0.2.',
    },
    springStiffness: {
      control: { type: 'range', min: 80, max: 600, step: 20 },
      description: 'Rest spring stiffness. Tutorial 400.',
    },
    springDamping: {
      control: { type: 'range', min: 8, max: 40, step: 1 },
      description: 'Rest spring damping. Tutorial 17.',
    },
    label: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof Gestures>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...GESTURES_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByRole('heading', { name: 'Gestures' }),
    ).toBeVisible();
    const tile = canvas.getByRole('button', { name: 'RSVP to Learn + Do' });
    await userEvent.hover(tile);
    await waitFor(() => {
      expect(tile).toHaveAttribute('data-hovering', 'true');
    });
    await userEvent.unhover(tile);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    const reset = canvas.getByRole('button', { name: 'RSVP to Learn + Do' });
    await expect(reset).toHaveAttribute('data-hovering', 'false');
  },
};

export const RotateAndColour: Story = {
  args: {
    ...GESTURES_DEFAULTS,
    hoverRotate: 5,
    tapRotate: -5,
    label: 'Start Challenge week',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const tile = canvas.getByRole('button', { name: 'Start Challenge week' });
    await userEvent.hover(tile);
    await waitFor(() => {
      expect(tile).toHaveAttribute('data-hovering', 'true');
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...GESTURES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByRole('button', { name: 'RSVP to Learn + Do' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};
