import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { AcidSquares } from './AcidSquares';
import { ACID_SQUARES_DEFAULTS, ACID_SQUARES_DETAILS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Acid Squares',
  component: AcidSquares,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Acid Squares, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 ray-march of stacked squares; time and pointer uniforms drive the field. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/acid-squares . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ACID_SQUARES_DEFAULTS },
  argTypes: {
    color1: {
      control: 'color',
      description: 'Near colour. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    color2: {
      control: 'color',
      description: 'Mid colour. Brand accent-yellow #DEF54F. Upstream default #A855F7.',
    },
    color3: {
      control: 'color',
      description: 'Far colour. Brand paper #FFFFFF. Upstream default #FFFFFF.',
    },
    detail: {
      control: 'select',
      options: [...ACID_SQUARES_DETAILS],
      description: 'Ray-march step count. Upstream default medium.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Time scale of the wave. Upstream default 0.7.',
    },
    waveDepth: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Travel along the corridor. Upstream default 1.',
    },
    zoom: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Camera zoom. Upstream default 1.3.',
    },
    density: {
      control: { type: 'range', min: 1, max: 24, step: 0.5 },
      description: 'Square packing. Upstream default 10.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Glow gain. Upstream default 1.',
    },
    exposure: {
      control: { type: 'range', min: 200, max: 6000, step: 100 },
      description: 'Tone scale. Upstream default 2700.',
    },
    spread: {
      control: { type: 'range', min: 0.05, max: 0.6, step: 0.01 },
      description: 'Step spread. Upstream default 0.3.',
    },
    stepSize: {
      control: { type: 'range', min: 0.0005, max: 0.02, step: 0.0005 },
      description: 'March increment. Upstream default 0.002.',
    },
    colorShift: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'Hue shimmer. Upstream default 0.',
    },
    contrast: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Tone contrast. Upstream default 1.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Tone brightness. Upstream default 1.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Alpha scale. Upstream default 1.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer dents the field. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Dent amount. Upstream default 0.1.',
    },
    mouseRadius: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Dent radius. Upstream default 0.35.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Post blur radius. Upstream default 0.',
    },
    grain: {
      control: 'boolean',
      description: 'Film grain. Upstream default true.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Grain amount. Upstream default 0.05.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds time at zero so the first frame stays still.',
    },
  },
} satisfies Meta<typeof AcidSquares>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Acid Squares' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('acid-squares-stage');
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
  await expect(stage).toHaveTextContent('Week 0');
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
  args: { ...ACID_SQUARES_DEFAULTS },
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
  args: { ...ACID_SQUARES_DEFAULTS, lightMode: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 120, 90);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ACID_SQUARES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
