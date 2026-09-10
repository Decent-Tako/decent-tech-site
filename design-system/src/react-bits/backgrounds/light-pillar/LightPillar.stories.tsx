import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { LightPillar } from './LightPillar';
import { LIGHT_PILLAR_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Light Pillar',
  component: LightPillar,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Light Pillar, commit 625f250, 2026-09-10. Mechanism: three.js raymarch of a noise pillar. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/light-pillar . Runtime three 0.180.0. Pause holds uTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LIGHT_PILLAR_DEFAULTS },
  argTypes: {
    topColor: {
      control: 'color',
      description: 'Upper colour. Brand accent-blue #0035B1. Upstream default #5227FF.',
    },
    bottomColor: {
      control: 'color',
      description: 'Lower colour. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    intensity: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Brightness. Upstream default 1.',
    },
    rotationSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.3.',
    },
    interactive: {
      control: 'boolean',
      description: 'Pointer yaw. Upstream default false.',
    },
    glowAmount: {
      control: { type: 'range', min: 0.001, max: 0.02, step: 0.001 },
      description: 'Glow scale. Upstream default 0.005.',
    },
    pillarWidth: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Pillar radius. Upstream default 3.',
    },
    pillarHeight: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Vertical scale. Upstream default 0.4.',
    },
    noiseIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Grain. Upstream default 0.5.',
    },
    mixBlendMode: {
      control: 'select',
      options: ['screen', 'normal', 'plus-lighter', 'lighten'],
      description: 'CSS mix-blend-mode. Upstream default screen.',
    },
    pillarRotation: {
      control: { type: 'range', min: -180, max: 180, step: 1 },
      description: 'Yaw in degrees. Upstream default 0.',
    },
    quality: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      description: 'Raymarch steps. Upstream default high.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the pillar still.',
    },
  },
} satisfies Meta<typeof LightPillar>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Light Pillar' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('light-pillar-stage');
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
  await expect(stage).toHaveTextContent('Tracker and plan');
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
  args: { ...LIGHT_PILLAR_DEFAULTS },
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

export const Interactive: Story = {
  args: { ...LIGHT_PILLAR_DEFAULTS, interactive: true, pillarRotation: 25 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LIGHT_PILLAR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
