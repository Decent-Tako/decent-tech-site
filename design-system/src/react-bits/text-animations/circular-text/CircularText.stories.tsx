import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { CircularText } from './CircularText';
import { CIRCULAR_HOVERS, CIRCULAR_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Circular Text',
  component: CircularText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Circular Text, commit 625f250, 2026-09-10. Mechanism: letters on a circle, linear rotate, hover changes speed. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/circular-text . Runtime motion 13.2.0. Pause stops the rotation. Replay remounts the ring.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CIRCULAR_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Letters on the ring. Academy default ${CIRCULAR_TEXT_DEFAULTS.text}. Upstream has no default.`,
    },
    spinDuration: {
      control: { type: 'range', min: 2, max: 40, step: 1 },
      description: 'Seconds per full turn. Upstream default 20.',
    },
    onHover: {
      control: 'select',
      options: [...CIRCULAR_HOVERS],
      description: 'Hover behaviour. Upstream default speedUp.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows a still ring.',
    },
  },
} satisfies Meta<typeof CircularText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Circular Text' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('circular-text-stage');
  await expect(canvas.getByTestId('circular-text')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...CIRCULAR_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPause(canvas);
    await userEvent.hover(canvas.getByTestId('circular-text'));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
  },
};

export const SlowDownOnHover: Story = {
  args: { ...CIRCULAR_TEXT_DEFAULTS, onHover: 'slowDown', spinDuration: 8 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...CIRCULAR_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPause(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
  },
};
