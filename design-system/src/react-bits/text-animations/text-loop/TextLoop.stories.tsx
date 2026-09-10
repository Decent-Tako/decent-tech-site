import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { TextLoop } from './TextLoop';
import { TEXT_LOOP_DEFAULTS, TEXT_LOOP_DIRECTIONS, TEXT_LOOP_SHAPES } from './source';

const meta = {
  title: 'React Bits/Text animations/Text Loop',
  component: TextLoop,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Text Loop, commit 625f250, 2026-09-10. Mechanism: repeated copy rides an SVG path while gsap advances startOffset. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/text-loop . Runtime gsap 3.15.0. Pause holds the offset tween. Replay remounts the path.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...TEXT_LOOP_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Phrase on the path. Academy default is the Week 0 title. Upstream default React ✦ Bits.`,
    },
    shape: {
      control: 'select',
      options: [...TEXT_LOOP_SHAPES],
      description: 'Built path family. Upstream default wave.',
    },
    speed: {
      control: { type: 'range', min: 20, max: 240, step: 10 },
      description: 'Pixels per second along the path. Upstream default 90.',
    },
    direction: {
      control: 'select',
      options: [...TEXT_LOOP_DIRECTIONS],
      description: 'Travel direction. Upstream default forward.',
    },
    separator: {
      control: 'text',
      description: 'Glyph between repeats. Upstream default ✦.',
    },
    curviness: {
      control: { type: 'range', min: 0, max: 180, step: 5 },
      description: 'Path amplitude. Upstream default 90.',
    },
    fontSize: {
      control: { type: 'range', min: 16, max: 72, step: 2 },
      description: 'SVG type size in pixels. Upstream default 46.',
    },
    fontWeight: {
      control: { type: 'range', min: 400, max: 800, step: 100 },
      description: 'SVG font-weight. Upstream default 800.',
    },
    letterSpacing: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'Letter spacing in pixels. Upstream default 2.',
    },
    uppercase: {
      control: 'boolean',
      description: 'Force uppercase. Upstream default true.',
    },
    color: {
      control: 'color',
      description: 'Fill colour. Ink #212121. Upstream default #ffffff.',
    },
    ribbon: {
      control: 'boolean',
      description: 'Stroke the path as a ribbon. Upstream default true.',
    },
    ribbonColor: {
      control: 'color',
      description: 'Ribbon colour. Accent blue #0035B1. Upstream default #5227FF.',
    },
    ribbonWidth: {
      control: { type: 'range', min: 8, max: 140, step: 2 },
      description: 'Ribbon stroke width. Upstream default 86.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Hold the tween while hovered. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always leaves the phrase still.',
    },
  },
} satisfies Meta<typeof TextLoop>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Text Loop' })).toBeVisible();
}

async function playOffset(canvas: Canvas) {
  const stage = canvas.getByTestId('text-loop-stage');
  await expect(canvas.getByRole('img', { name: FEATURES[0].title })).toBeVisible();
  await waitFor(() => {
    expect(Math.abs(Number(stage.getAttribute('data-offset') ?? '0'))).toBeGreaterThan(0);
  }, SLOW);
  return stage;
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...TEXT_LOOP_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOffset(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playOffset(canvas);
  },
};

export const CircleReverse: Story = {
  args: {
    ...TEXT_LOOP_DEFAULTS,
    shape: 'circle',
    direction: 'reverse',
    speed: 140,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOffset(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...TEXT_LOOP_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('text-loop-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByRole('img', { name: FEATURES[0].title })).toBeVisible();
    await expect(stage).toHaveAttribute('data-offset', '0');
    await playPause(canvas, stage);
  },
};
