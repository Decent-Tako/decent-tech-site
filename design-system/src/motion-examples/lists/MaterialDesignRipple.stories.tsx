import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { MaterialDesignRipple } from './MaterialDesignRipple';
import { expectListsBrand, playReplay } from './play';
import {
  MATERIAL_RIPPLE_DEFAULTS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Material Design ripple',
  component: MaterialDesignRipple,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-material-design-ripple in Academy branding.',
          'The article page marks this example plus:true and prints a stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: onPointerDown creates a ripple at the local origin. AnimatePresence mounts a motion.span from scale(0) to scale(1). Pointer up removes it so the exit fade can run.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animate-presence .',
          'Example https://motion.dev/examples/react-material-design-ripple .',
          'Live https://examples.motion.dev/react/material-design-ripple .',
          'Chunk https://examples.motion.dev/assets/index-C_NhZqUQ.js .',
          'Press RSVP to Learn + Do. Replay fires a centre ripple.',
        ].join(' '),
      },
    },
  },
  args: {
    ...MATERIAL_RIPPLE_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    enterDuration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Ripple scale-in duration. Upstream default 0.3.',
    },
    exitDuration: {
      control: { type: 'range', min: 0.1, max: 1.2, step: 0.05 },
      description: 'Ripple fade duration. Upstream default 0.55.',
    },
    hoverDuration: {
      control: { type: 'range', min: 0.05, max: 0.6, step: 0.05 },
      description: 'Button colour tween. Upstream default 0.2.',
    },
    label: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof MaterialDesignRipple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectListsBrand(canvas);
    await expect(
      canvas.getByRole('button', { name: 'RSVP to Learn + Do' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'RSVP to Learn + Do' }),
    );
    await playReplay(canvas, 'material-design-ripple');
  },
};

export const SlowRipple: Story = {
  args: {
    ...MATERIAL_RIPPLE_DEFAULTS,
    enterDuration: 0.7,
    exitDuration: 1,
    label: 'Publish the page',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Publish the page' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Publish the page' }),
    );
    await playReplay(canvas, 'material-design-ripple');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...MATERIAL_RIPPLE_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectListsBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'RSVP to Learn + Do' }),
    );
    await expect(
      canvas.getByRole('button', { name: 'RSVP to Learn + Do' }),
    ).toBeVisible();
  },
};
