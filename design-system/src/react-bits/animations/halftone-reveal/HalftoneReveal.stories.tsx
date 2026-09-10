import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { HalftoneReveal } from './HalftoneReveal';
import {
  HALFTONE_MODES,
  HALFTONE_REVEAL_DEFAULTS,
  HALFTONE_SHAPES,
  HALFTONE_TRIGGERS,
} from './source';

const meta = {
  title: 'React Bits/Animations/Halftone Reveal',
  component: HalftoneReveal,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Halftone Reveal, commit 625f250, 2026-09-10. Mechanism: an ogl WebGL2 sketch prints a photograph as a circle (or square, diamond, line) halftone and opens a sharp loupe under the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/halftone-reveal . Runtime ogl 1.0.11. Pause stops the frame loop. Replay remounts the sketch. Ink default is brand ink #212121 (upstream #141414). Paper default is brand paper #FFFFFF (upstream #fff7e6).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...HALFTONE_REVEAL_DEFAULTS },
  argTypes: {
    inkColor: {
      control: 'color',
      description: 'Halftone ink. Brand ink #212121. Upstream default #141414.',
    },
    paperColor: {
      control: 'color',
      description: 'Halftone paper. Brand paper #FFFFFF. Upstream default #fff7e6.',
    },
    mode: {
      control: 'select',
      options: [...HALFTONE_MODES],
      description: 'Print mode. Upstream default mono.',
    },
    dotSize: {
      control: { type: 'range', min: 0.4, max: 2, step: 0.05 },
      description: 'Dot radius scale. Upstream default 1.',
    },
    dotDensity: {
      control: { type: 'range', min: 20, max: 160, step: 1 },
      description: 'Dots per unit. Upstream default 71.',
    },
    angle: {
      control: { type: 'range', min: 0, max: 180, step: 1 },
      description: 'Screen angle in degrees. Upstream default 45.',
    },
    shape: {
      control: 'select',
      options: [...HALFTONE_SHAPES],
      description: 'Dot shape. Upstream default circle.',
    },
    contrast: {
      control: { type: 'range', min: 0.4, max: 2.4, step: 0.05 },
      description: 'Grade contrast. Upstream default 1.15.',
    },
    invert: {
      control: 'boolean',
      description: 'Invert the grade. Upstream default false.',
    },
    revealRadius: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Loupe radius. Upstream default 0.4.',
    },
    edge: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Loupe edge softness. Upstream default 0.8.',
    },
    follow: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.01 },
      description: 'Pointer follow time. Upstream default 0.37.',
    },
    idleReveal: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Sharp mix with no pointer. Upstream default 0.',
    },
    trigger: {
      control: 'select',
      options: [...HALFTONE_TRIGGERS],
      description: 'When the loupe opens. Upstream default hover.',
    },
    borderRadius: {
      control: 'text',
      description: 'Host corner radius. Upstream default 16px.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the sharp photograph with no loupe.',
    },
  },
} satisfies Meta<typeof HalftoneReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const PAPER = '#FFFFFF';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Halftone Reveal' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('halftone-reveal-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.dataset.webgl);
  }, SLOW);
  return stage;
}

async function playSketch(stage: HTMLElement) {
  if (stage.dataset.webgl !== 'ready') {
    await expect(stage.querySelector('p[data-webgl="unavailable"]')).not.toBeNull();
    return;
  }
  const canvasEl = stage.querySelector('canvas');
  await expect(canvasEl).not.toBeNull();
  movePointer(stage, 180, 120);
  movePointer(stage, 260, 180);
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, PAPER, { grid: 16, timeoutMs: 6000 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...HALFTONE_REVEAL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
    await playSketch(stage);
  },
};

export const DuotoneSquares: Story = {
  args: { ...HALFTONE_REVEAL_DEFAULTS, mode: 'duotone', shape: 'square' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-mode', 'duotone');
    await expect(stage).toHaveAttribute('data-shape', 'square');
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...HALFTONE_REVEAL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.dataset.webgl === 'ready') {
      const canvasEl = stage.querySelector('canvas');
      await expect(canvasEl).not.toBeNull();
      await assertCanvasPainted(canvasEl as HTMLCanvasElement, PAPER, { grid: 16, timeoutMs: 6000 });
    }
    await playPause(canvas, stage);
  },
};
