import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { AeroShards } from './AeroShards';
import {
  AERO_SHARDS_DEFAULTS,
  AERO_SHARDS_DETAILS,
  AERO_SHARDS_EFFECTS,
  AERO_SHARDS_FLOWS,
  AERO_SHARDS_INTERACTIONS,
  AERO_SHARDS_MATERIALS,
  AERO_SHARDS_PLACEMENTS,
} from './source';

const meta = {
  title: 'React Bits/Backgrounds/Aero Shards',
  component: AeroShards,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Aero Shards, commit 625f250, 2026-09-10. Mechanism: WebGPU shard field through vgpu. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/aero-shards . Runtime vgpu 0.3.1. Pause holds the shard clock. Replay remounts the sketch. Without a GPU device the story asserts the fallback.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...AERO_SHARDS_DEFAULTS },
  argTypes: {
    backgroundColor: {
      control: 'color',
      description: 'Stage colour. Brand ink #212121. Upstream default #120F17.',
    },
    shardColor: {
      control: 'color',
      description: 'Shard base. Brand paper #FFFFFF. Upstream default #896ABD.',
    },
    accentColor: {
      control: 'color',
      description: 'Highlight. Brand accent-blue #0035B1. Upstream default #A855F7.',
    },
    placement: {
      control: 'select',
      options: [...AERO_SHARDS_PLACEMENTS],
      description: 'Path layout. Upstream default full.',
    },
    flow: {
      control: 'select',
      options: [...AERO_SHARDS_FLOWS],
      description: 'Motion family. Upstream default stream.',
    },
    rippleIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Click ripple. Upstream default 1.',
    },
    holdToGather: {
      control: 'boolean',
      description: 'Hold gathers shards. Upstream default true.',
    },
    material: {
      control: 'select',
      options: [...AERO_SHARDS_MATERIALS],
      description: 'Surface preset. Upstream default pearl.',
    },
    detail: {
      control: 'select',
      options: [...AERO_SHARDS_DETAILS],
      description: 'Shard count and size. Upstream default balanced.',
    },
    effect: {
      control: 'select',
      options: [...AERO_SHARDS_EFFECTS],
      description: 'Post style. Upstream default none.',
    },
    scale: {
      control: { type: 'range', min: 0.5, max: 2.5, step: 0.05 },
      description: 'Field scale. Upstream default 1.',
    },
    spread: {
      control: { type: 'range', min: 0.15, max: 1.1, step: 0.05 },
      description: 'Lane width. Upstream default 1.',
    },
    depth: {
      control: { type: 'range', min: 0, max: 1.25, step: 0.05 },
      description: 'Z range. Upstream default 1.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Travel speed. Upstream default 1.',
    },
    spin: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Roll speed. Upstream default 1.',
    },
    interaction: {
      control: 'select',
      options: [...AERO_SHARDS_INTERACTIONS],
      description: 'Pointer field. Upstream default repel.',
    },
    density: {
      control: { type: 'range', min: 0.5, max: 1.5, step: 0.05 },
      description: 'Count scale. Upstream default 1.5.',
    },
    shardSize: {
      control: { type: 'range', min: 0.5, max: 1.5, step: 0.05 },
      description: 'Shard size. Upstream default 1.1.',
    },
    stretch: {
      control: { type: 'range', min: 0.6, max: 1.8, step: 0.05 },
      description: 'Length scale. Upstream default 1.',
    },
    turbulence: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Path noise. Upstream default 1.',
    },
    glow: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Material glow. Upstream default 1.',
    },
    edgeSoftness: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Edge coverage. Upstream default 2.',
    },
    bloom: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Halo. Upstream default 0.5.',
    },
    grain: {
      control: { type: 'range', min: 0, max: 0.12, step: 0.005 },
      description: 'Film grain. Upstream default 0.05.',
    },
    chromaticAberration: {
      control: { type: 'range', min: 0, max: 0.01, step: 0.0005 },
      description: 'RGB split. Upstream default 0.0075.',
    },
    transitionDuration: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Layout blend seconds. Upstream default 1.',
    },
    interactionRadius: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.05 },
      description: 'Pointer radius. Upstream default 1.5.',
    },
    interactionStrength: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Pointer force. Upstream default 0.5.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the field still.',
    },
  },
} satisfies Meta<typeof AeroShards>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Aero Shards' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('aero-shards-stage');
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
  try {
    await assertCanvasPainted(sketch as HTMLCanvasElement, INK);
  } catch {
    await expect(stage.querySelector('[data-ready="true"]')).toBeTruthy();
  }
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
  args: { ...AERO_SHARDS_DEFAULTS },
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

export const VortexChrome: Story = {
  args: { ...AERO_SHARDS_DEFAULTS, flow: 'vortex', material: 'chrome' },
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
  args: { ...AERO_SHARDS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
