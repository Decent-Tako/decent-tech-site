import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { LightTunnel } from './LightTunnel';
import { FLOW_DIRECTIONS, LIGHT_TUNNEL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Light Tunnel',
  component: LightTunnel,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Light Tunnel, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 polar fibre tunnel with pulse cables. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/light-tunnel . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LIGHT_TUNNEL_DEFAULTS },
  argTypes: {
    cableColor: {
      control: 'color',
      description: 'Cable tint. Brand accent-blue #0035B1. Upstream default #A855F7.',
    },
    pulseColor: {
      control: 'color',
      description: 'Pulse tint. Brand accent-yellow #DEF54F. Upstream default #A855F7.',
    },
    tunnelColor: {
      control: 'color',
      description: 'Tunnel body. Brand ink #212121. Upstream default #5227FF.',
    },
    tunnelOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Body opacity. Upstream default 0.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Scroll scale. Upstream default 0.1.',
    },
    flowDirection: {
      control: 'select',
      options: [...FLOW_DIRECTIONS],
      description: 'Inward or outward. Upstream default outward.',
    },
    pulseSpeed: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Pulse time scale. Upstream default 2.',
    },
    pulseLength: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.01 },
      description: 'Pulse length. Upstream default 0.28.',
    },
    pulseBlend: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pulse blend. Upstream default 1.',
    },
    pulseWidth: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Pulse width. Upstream default 1.',
    },
    cableCount: {
      control: { type: 'range', min: 4, max: 48, step: 1 },
      description: 'Cable count. Upstream default 20.',
    },
    thickness: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Cable thickness. Upstream default 0.35.',
    },
    rimWidth: {
      control: { type: 'range', min: 0.01, max: 0.5, step: 0.01 },
      description: 'Rim width. Upstream default 0.15.',
    },
    waviness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Wave amount. Upstream default 0.3.',
    },
    sway: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Rotation sway. Upstream default 0.5.',
    },
    size: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Tunnel scale. Upstream default 1.',
    },
    centerX: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.01 },
      description: 'Centre X. Upstream default 0.',
    },
    centerY: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.01 },
      description: 'Centre Y. Upstream default 0.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Rim glow. Upstream default 1.',
    },
    fadeNear: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Near fade. Upstream default 0.5.',
    },
    fadeFar: {
      control: { type: 'range', min: 0.5, max: 4, step: 0.1 },
      description: 'Far fade. Upstream default 2.',
    },
    brightness: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Brightness. Upstream default 1.',
    },
    colorVariance: {
      control: 'boolean',
      description: 'Per-cable colour drift. Upstream default true.',
    },
    grain: {
      control: 'boolean',
      description: 'Film grain. Upstream default true.',
    },
    grainIntensity: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Grain amount. Upstream default 0.05.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Master opacity. Upstream default 1.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer offset. Upstream default true.',
    },
    mouseStrength: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Pointer amount. Upstream default 0.1.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the tunnel still.',
    },
  },
} satisfies Meta<typeof LightTunnel>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Light Tunnel' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('light-tunnel-stage');
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
  args: { ...LIGHT_TUNNEL_DEFAULTS },
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

export const InwardFlow: Story = {
  args: {
    ...LIGHT_TUNNEL_DEFAULTS,
    flowDirection: 'inward',
    cableCount: 28,
    tunnelOpacity: 0.2,
  },
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
  args: { ...LIGHT_TUNNEL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
