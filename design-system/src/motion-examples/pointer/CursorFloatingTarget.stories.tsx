import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { CursorFloatingTarget } from './CursorFloatingTarget';
import { movePointer } from './playSupport';
import { CURSOR_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Cursor floating target',
  component: CursorFloatingTarget,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Rebuild of motion.dev react-cursor-floating-target. Mechanism: usePointerPosition, useTransform, useSpring for the target, useAnimate infinite rotate, two Cursor nodes. Live source https://examples.motion.dev/assets/index-BZl1QozQ.js . Extra runtime: Academy plusAdapter. Continuous. Pause stops follow and rotate. Speed is rotate duration.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CURSOR_DEFAULTS },
  argTypes: {
    damping: {
      control: { type: 'range', min: 10, max: 120, step: 2 },
      description: 'Target spring damping. Upstream default 80.',
    },
    stiffness: {
      control: { type: 'range', min: 40, max: 400, step: 10 },
      description: 'Target spring stiffness. Upstream default 200.',
    },
    rotateDuration: {
      control: { type: 'range', min: 2, max: 20, step: 0.5 },
      description: 'Label rotate duration in seconds. Upstream default 8. This is Speed.',
    },
    offset: {
      control: { type: 'range', min: 20, max: 180, step: 5 },
      description: 'Pointer offset range in pixels. Upstream default 100.',
    },
    magneticSnap: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Cursor magnetic snap. Upstream default 0.9.',
    },
    reticuleStiffness: {
      control: { type: 'range', min: 200, max: 2000, step: 50 },
      description: 'Reticule spring stiffness. Upstream default 1000.',
    },
    reticuleDamping: {
      control: { type: 'range', min: 10, max: 120, step: 5 },
      description: 'Reticule spring damping. Upstream default 50.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof CursorFloatingTarget>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playBrand(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Cursor floating target' }),
  ).toBeVisible();
  await expect(canvas.getByText('Week 0')).toBeVisible();
  await expectFullColorPhotos(canvas);
}

export const Default: Story = {
  args: { ...CURSOR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const target = canvas.getByTestId('cursor-target');
    movePointer(canvas.getByTestId('cursor-stage'), 80, 60);
    await waitFor(() => {
      expect(getComputedStyle(target).transform).not.toBe('none');
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(target).toHaveAttribute('data-paused', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const SlowSpin: Story = {
  args: {
    ...CURSOR_DEFAULTS,
    rotateDuration: 16,
    offset: 60,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Start now. Set the goal to $3,000.' }),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  },
};

export const ReducedMotion: Story = {
  args: {
    ...CURSOR_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getByTestId('cursor-target')).toHaveAttribute(
      'data-paused',
      'true',
    );
    await expect(canvas.queryByTestId('plus-cursor')).toBeNull();
  },
};
