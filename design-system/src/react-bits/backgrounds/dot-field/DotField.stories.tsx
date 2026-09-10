import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { DotField } from './DotField';
import { DOT_FIELD_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Dot Field',
  component: DotField,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Dot Field, commit 625f250, 2026-09-10. Mechanism: 2D canvas grid of dots; the pointer bulges the field. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/dot-field . No extra runtime. Pause holds the bulge and the wave. Replay remounts the field.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DOT_FIELD_DEFAULTS },
  argTypes: {
    dotRadius: {
      control: { type: 'range', min: 0.5, max: 6, step: 0.5 },
      description: 'Dot radius in pixels. Upstream default 1.5.',
    },
    dotSpacing: {
      control: { type: 'range', min: 4, max: 40, step: 1 },
      description: 'Gap between dots. Upstream default 14.',
    },
    cursorRadius: {
      control: { type: 'range', min: 40, max: 800, step: 10 },
      description: 'Pointer influence radius. Upstream default 500.',
    },
    cursorForce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Push when bulgeOnly is false. Upstream default 0.1.',
    },
    bulgeOnly: {
      control: 'boolean',
      description: 'Bulge instead of scatter. Upstream default true.',
    },
    bulgeStrength: {
      control: { type: 'range', min: 0, max: 120, step: 1 },
      description: 'Bulge amount. Upstream default 67.',
    },
    glowRadius: {
      control: { type: 'range', min: 0, max: 400, step: 10 },
      description: 'SVG glow radius. Upstream default 160.',
    },
    sparkle: {
      control: 'boolean',
      description: 'Random larger dots. Upstream default false.',
    },
    waveAmplitude: {
      control: { type: 'range', min: 0, max: 20, step: 0.5 },
      description: 'Sine offset. Upstream default 0.',
    },
    gradientFrom: {
      control: 'color',
      description: 'Dot gradient start. Brand accent-blue. Upstream default rgba(168, 85, 247, 0.35).',
    },
    gradientTo: {
      control: 'color',
      description: 'Dot gradient end. Brand accent-yellow. Upstream default rgba(180, 151, 207, 0.25).',
    },
    glowColor: {
      control: 'color',
      description: 'Glow colour. Brand paper #FFFFFF. Upstream default #120F17.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the field still.',
    },
  },
} satisfies Meta<typeof DotField>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Dot Field' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('dot-field-stage');
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
  await expect(stage).toHaveTextContent('19–28 October 2026');
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
  args: { ...DOT_FIELD_DEFAULTS },
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

export const Waves: Story = {
  args: { ...DOT_FIELD_DEFAULTS, waveAmplitude: 8, sparkle: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...DOT_FIELD_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
