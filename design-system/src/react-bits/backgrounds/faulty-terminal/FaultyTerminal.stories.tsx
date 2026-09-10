import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { FaultyTerminal } from './FaultyTerminal';
import { FAULTY_TERMINAL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Faulty Terminal',
  component: FaultyTerminal,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Faulty Terminal, commit 625f250, 2026-09-10. Mechanism: ogl CRT digit field with glitch, flicker, scanlines, and curvature. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/faulty-terminal . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FAULTY_TERMINAL_DEFAULTS },
  argTypes: {
    scale: {
      control: { type: 'range', min: 0.4, max: 3, step: 0.1 },
      description: 'Digit field scale. Upstream default 1.',
    },
    gridMul: {
      control: 'object',
      description: 'Grid density [x, y]. Upstream default [2, 1].',
    },
    digitSize: {
      control: { type: 'range', min: 0.5, max: 4, step: 0.1 },
      description: 'Digit cell size. Upstream default 1.5.',
    },
    timeScale: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.3.',
    },
    scanlineIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Scanline mix. Upstream default 0.3.',
    },
    glitchAmount: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Horizontal displace. Upstream default 1.',
    },
    flickerAmount: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Flicker mix. Upstream default 1.',
    },
    noiseAmp: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Noise amplitude. Upstream default 1.',
    },
    chromaticAberration: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'RGB split. Upstream default 0.',
    },
    dither: {
      control: { type: 'range', min: 0, max: 8, step: 0.5 },
      description: 'Dither amount. Upstream default 0.',
    },
    curvature: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Barrel warp. Upstream default 0.2.',
    },
    tint: {
      control: 'color',
      description: 'Digit tint. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    mouseReact: {
      control: 'boolean',
      description: 'Pointer brightens cells. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer amount. Upstream default 0.2.',
    },
    dpr: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.25 },
      description: 'Device pixel ratio. Story default 1. Upstream min(devicePixelRatio, 2).',
    },
    pageLoadAnimation: {
      control: 'boolean',
      description: 'Cell fade-in on mount. Upstream default true.',
    },
    brightness: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Tone gain. Upstream default 1.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds time still.',
    },
  },
} satisfies Meta<typeof FaultyTerminal>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Faulty Terminal' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('faulty-terminal-stage');
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
  args: { ...FAULTY_TERMINAL_DEFAULTS },
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

export const HeavyGlitch: Story = {
  args: {
    ...FAULTY_TERMINAL_DEFAULTS,
    glitchAmount: 2.4,
    chromaticAberration: 3,
    curvature: 0.45,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FAULTY_TERMINAL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
