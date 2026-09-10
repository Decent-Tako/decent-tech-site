import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { dragPointer } from '../../frame/pointerSupport';
import { CurvedLoop } from './CurvedLoop';
import { CURVED_LOOP_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Curved Loop',
  component: CurvedLoop,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Curved Loop, commit 625f250, 2026-09-10. Mechanism: SVG textPath on a quadratic curve, startOffset steps each frame. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/curved-loop . Pause holds the offset. Replay remounts the path.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CURVED_LOOP_DEFAULTS },
  argTypes: {
    marqueeText: {
      control: 'text',
      description: 'Line that repeats on the curve. Academy default is the hero lede. Upstream default empty.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 12, step: 0.5 },
      description: 'Pixels per frame. Upstream default 2.',
    },
    curveAmount: {
      control: { type: 'range', min: 0, max: 800, step: 20 },
      description: 'Quadratic control-point drop. Upstream default 400.',
    },
    direction: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Heading of the loop. Upstream default left.',
    },
    interactive: {
      control: 'boolean',
      description: 'Drag to scrub the offset. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the offset at the first layout.',
    },
  },
} satisfies Meta<typeof CurvedLoop>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Curved Loop' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const jacket = canvas.getByTestId('curved-loop-jacket');
  await waitFor(() => {
    expect(jacket).toHaveAttribute('data-ready', 'true');
  }, SLOW);
  return jacket;
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('curved-loop-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...CURVED_LOOP_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const jacket = await playReady(canvas);
    const before = jacket.getAttribute('data-offset');
    await waitFor(() => {
      expect(jacket.getAttribute('data-offset')).not.toBe(before);
    }, SLOW);
    await dragPointer(jacket, 80);
    const stage = await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
  },
};

export const RightAndFlat: Story = {
  args: { ...CURVED_LOOP_DEFAULTS, direction: 'right', curveAmount: 80, speed: 4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playReady(canvas);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...CURVED_LOOP_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const jacket = await playReady(canvas);
    const frozen = jacket.getAttribute('data-offset');
    await new Promise((resolve) => setTimeout(resolve, 120));
    await expect(jacket).toHaveAttribute('data-offset', frozen);
    const stage = await playPause(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
  },
};
