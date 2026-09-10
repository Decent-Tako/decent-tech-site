import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { OptionWheel } from './OptionWheel';
import { OPTION_WHEEL_DEFAULTS, OPTION_WHEEL_SIDES } from './source';

const meta = {
  title: 'React Bits/Components/Option Wheel',
  component: OptionWheel,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Option Wheel, commit 625f250, 2026-09-10. Mechanism: a rAF lerp lays labels on a curve. Click or drag to change the selected item. Licence MIT + Commons Clause. Page https://reactbits.dev/components/option-wheel . No extra runtime. Pause holds the rAF loop. Replay remounts the wheel.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...OPTION_WHEEL_DEFAULTS },
  argTypes: {
    defaultSelected: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: 'Index that starts selected. Upstream default 3.',
    },
    textColor: {
      control: 'color',
      description: 'Idle label colour. Brand token quiet. Upstream default #a6a6a6.',
    },
    activeColor: {
      control: 'color',
      description: 'Selected label colour. Brand token paper. Upstream default #ffffff.',
    },
    side: {
      control: 'select',
      options: [...OPTION_WHEEL_SIDES],
      description: 'Which side the curve opens toward. Upstream default left.',
    },
    fontSize: {
      control: { type: 'range', min: 1, max: 5, step: 0.1 },
      description: 'Label size in rem. Upstream default 3.',
    },
    spacing: {
      control: { type: 'range', min: 0.8, max: 2.4, step: 0.1 },
      description: 'Row height as a multiple of font size. Upstream default 1.4.',
    },
    curve: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'How far the arc pulls inward. Upstream default 1.',
    },
    tilt: {
      control: { type: 'range', min: 0, max: 20, step: 0.5 },
      description: 'Arc tightness in degrees. Upstream default 6.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'Blur per step away from the selection. Upstream default 2.',
    },
    fade: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Opacity drop per step. Upstream default 0.25.',
    },
    minOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Floor opacity. Brand default 0.75 so faded labels meet contrast. Upstream default 0.05.',
    },
    smoothing: {
      control: { type: 'range', min: 1, max: 600, step: 10 },
      description: 'rAF lerp time constant in milliseconds. Upstream default 200.',
    },
    inset: {
      control: { type: 'range', min: 0, max: 160, step: 4 },
      description: 'Inset from the stage edge in pixels. Upstream default 80.',
    },
    loop: {
      control: 'boolean',
      description: 'Wrap from last to first. Upstream default false.',
    },
    draggable: {
      control: 'boolean',
      description: 'Drag to scroll the wheel. Upstream default true.',
    },
    soundUrl: {
      control: 'text',
      description: 'Optional tick sound URL. Upstream default empty.',
    },
    soundVolume: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Tick volume. Upstream default 0.5.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always snaps the wheel with no tilt or blur.',
    },
  },
} satisfies Meta<typeof OptionWheel>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Option Wheel' })).toBeVisible();
}

async function playSelect(canvas: Canvas) {
  const stage = canvas.getByTestId('option-wheel-stage');
  await userEvent.click(canvas.getByRole('option', { name: 'Learn' }));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-active', '1');
    const option = canvas.getByRole('option', { name: 'Learn' });
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(Number.parseFloat(option.style.opacity)).toBeGreaterThan(0.9);
  }, SLOW);
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...OPTION_WHEEL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-active', '3');
  },
};

export const RightSide: Story = {
  args: { ...OPTION_WHEEL_DEFAULTS, side: 'right', tilt: 10 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await expect(stage).toHaveAttribute('data-side', 'right');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...OPTION_WHEEL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('option-wheel-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playSelect(canvas);
    await playPauseResume(canvas, stage);
  },
};
