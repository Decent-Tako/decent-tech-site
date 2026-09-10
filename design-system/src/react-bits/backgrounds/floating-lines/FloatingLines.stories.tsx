import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { FloatingLines } from './FloatingLines';
import { BLEND_MODES, FLOATING_LINES_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Floating Lines',
  component: FloatingLines,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Floating Lines, commit 625f250, 2026-09-10. Mechanism: three.js sine-wave bands that bend toward the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/floating-lines . Runtime three 0.180.0. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FLOATING_LINES_DEFAULTS },
  argTypes: {
    linesGradient: {
      control: 'object',
      description:
        'Line colour stops. Brand accent-blue and accent-yellow. Upstream default empty (hardcoded pink and blue).',
    },
    enabledWaves: {
      control: 'object',
      description: 'Which bands draw. Upstream default top, middle, bottom.',
    },
    lineCount: {
      control: 'object',
      description: 'Lines per band, or one number for all. Upstream default [6].',
    },
    lineDistance: {
      control: 'object',
      description: 'Gap per band. Upstream default [5].',
    },
    topWavePosition: {
      control: 'object',
      description: 'Top band x, y, rotate. Upstream fallback x 10, y 0.5, rotate -0.4.',
    },
    middleWavePosition: {
      control: 'object',
      description: 'Middle band x, y, rotate. Upstream fallback x 5, y 0, rotate 0.2.',
    },
    bottomWavePosition: {
      control: 'object',
      description: 'Bottom band x, y, rotate. Upstream default x 2, y -0.7, rotate -1.',
    },
    animationSpeed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Time scale. Upstream default 1.',
    },
    interactive: {
      control: 'boolean',
      description: 'Pointer bend. Upstream default true.',
    },
    bendRadius: {
      control: { type: 'range', min: 0.2, max: 20, step: 0.1 },
      description: 'Pointer falloff. Upstream default 5.',
    },
    bendStrength: {
      control: { type: 'range', min: -2, max: 2, step: 0.05 },
      description: 'Pointer offset. Upstream default -0.5.',
    },
    mouseDamping: {
      control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
      description: 'Pointer lerp. Upstream default 0.05.',
    },
    parallax: {
      control: 'boolean',
      description: 'Pointer offset of the field. Upstream default true.',
    },
    parallaxStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Parallax amount. Upstream default 0.2.',
    },
    mixBlendMode: {
      control: 'select',
      options: [...BLEND_MODES],
      description: 'CSS mix-blend-mode. Upstream default screen.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Clear colour. Brand ink #212121. Upstream default #000000.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the bands still.',
    },
  },
} satisfies Meta<typeof FloatingLines>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Floating Lines' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('floating-lines-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.getAttribute('data-webgl'));
  }, SLOW);
  return stage;
}

async function playPaint(stage: HTMLElement) {
  if (stage.getAttribute('data-webgl') !== 'ready') {
    await expect(stage.querySelector('[data-webgl="unavailable"]')).toBeVisible();
    return null;
  }
  const sketch = stage.querySelector('canvas');
  await expect(sketch).toBeTruthy();
  await expect(stage).toHaveTextContent('Six weeks');
  await assertCanvasPainted(sketch as HTMLCanvasElement, INK);
  return sketch as HTMLCanvasElement;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...FLOATING_LINES_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const LightMode: Story = {
  args: { ...FLOATING_LINES_DEFAULTS, lightMode: true, mixBlendMode: 'normal' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FLOATING_LINES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await playPaint(stage);
  },
};
