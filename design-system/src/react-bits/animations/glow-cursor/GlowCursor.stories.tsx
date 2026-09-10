import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { GlowCursor } from './GlowCursor';
import { GLOW_BLEND_MODES, GLOW_CURSOR_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Glow Cursor',
  component: GlowCursor,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Glow Cursor, commit 625f250, 2026-09-10. Mechanism: an OGL shader draws a tapered trail that eases toward the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/glow-cursor . Runtime ogl 1.0.11. Pause holds the last trail. Replay remounts the sketch. Color default is brand accent blue #0035B1 (upstream #67E8F9). Secondary color default is accent yellow #DEF54F (upstream #A78BFA).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GLOW_CURSOR_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Head tint. Brand accent blue #0035B1. Upstream default #67E8F9.',
    },
    secondaryColor: {
      control: 'color',
      description: 'Tail tint. Brand accent yellow #DEF54F. Upstream default #A78BFA.',
    },
    trailLength: {
      control: { type: 'range', min: 2, max: 64, step: 1 },
      description: 'Active points. Upstream default 40.',
    },
    trailWidth: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'Head width in pixels. Upstream default 8.',
    },
    trailTaper: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'How fast the tail thins. Upstream default 0.8.',
    },
    followSpeed: {
      control: { type: 'range', min: 0.01, max: 0.99, step: 0.01 },
      description: 'Head ease toward the pointer. Upstream default 0.16.',
    },
    glowIntensity: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Beam glow. Upstream default 1.9.',
    },
    glowSpread: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Glow falloff. Upstream default 1.2.',
    },
    hotspot: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Core highlight. Upstream default 0.65.',
    },
    brightness: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Luminance scale. Upstream default 1.25.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Trail opacity. Upstream default 1.',
    },
    pulseSpeed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Along-trail pulse. Upstream default 1.1.',
    },
    noiseStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Film grain. Upstream default 0.035.',
    },
    idleFade: {
      control: 'boolean',
      description: 'Fade when idle. Upstream default true.',
    },
    idleTimeout: {
      control: { type: 'range', min: 0, max: 3000, step: 50 },
      description: 'Idle wait in milliseconds. Upstream default 700.',
    },
    fadeDuration: {
      control: { type: 'range', min: 16, max: 3000, step: 50 },
      description: 'Fade length in milliseconds. Upstream default 900.',
    },
    blendMode: {
      control: 'select',
      options: [...GLOW_BLEND_MODES],
      description: 'Canvas blend mode. Upstream default screen.',
    },
    maxDevicePixelRatio: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.25 },
      description: 'Pixel ratio cap. Upstream default 1.5.',
    },
    enabled: {
      control: 'boolean',
      description: 'Draw the trail. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always disables the trail and holds a still frame.',
    },
  },
} satisfies Meta<typeof GlowCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const INK = '#212121';
const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Glow Cursor' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('glow-cursor-stage');
  await waitFor(() => {
    expect(stage.getAttribute('data-webgl')).not.toBe('pending');
  }, SLOW);
  return stage;
}

async function playTrail(canvas: Canvas) {
  const stage = await playReady(canvas);
  if (stage.getAttribute('data-webgl') === 'unavailable') {
    await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    return stage;
  }
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-webgl', 'ready');
  }, SLOW);
  const host = canvas.getByTestId('glow-cursor-host');
  movePointer(host, 80, 70);
  movePointer(host, 240, 160);
  const glowCanvas = canvas.getByTestId('glow-cursor-canvas') as HTMLCanvasElement;
  await assertCanvasPainted(glowCanvas, INK);
  await expect(canvas.getByText('Public work')).toBeVisible();
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
  args: { ...GLOW_CURSOR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTrail(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playTrail(canvas);
  },
};

export const WideTrail: Story = {
  args: { ...GLOW_CURSOR_DEFAULTS, trailWidth: 18, glowSpread: 2, trailLength: 56 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTrail(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GLOW_CURSOR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-enabled', 'false');
    if (stage.getAttribute('data-webgl') === 'unavailable') {
      await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    } else {
      await waitFor(() => {
        expect(stage).toHaveAttribute('data-webgl', 'ready');
      }, SLOW);
    }
    await playPause(canvas, stage);
  },
};
