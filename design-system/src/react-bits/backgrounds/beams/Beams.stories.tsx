import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Beams } from './Beams';
import { BEAMS_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Beams',
  component: Beams,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Beams, commit 625f250, 2026-09-10. Mechanism: stacked three.js noise planes under a directional light. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/beams . Runtime three 0.180.0. Pause holds the noise clock. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...BEAMS_DEFAULTS },
  argTypes: {
    beamWidth: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Ribbon width. Upstream default 2.',
    },
    beamHeight: {
      control: { type: 'range', min: 2, max: 30, step: 1 },
      description: 'Ribbon length. Upstream default 15.',
    },
    beamNumber: {
      control: { type: 'range', min: 2, max: 24, step: 1 },
      description: 'Ribbon count. Upstream default 12.',
    },
    lightColor: {
      control: 'color',
      description: 'Directional light. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    beamColor: {
      control: 'color',
      description: 'Ribbon colour. Brand accent-blue #0035B1. Upstream default #000000.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Scene colour. Brand ink #212121. Upstream default #000000.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'Noise travel. Upstream default 2.',
    },
    noiseIntensity: {
      control: { type: 'range', min: 0, max: 4, step: 0.05 },
      description: 'Grain in the fragment. Upstream default 1.75.',
    },
    scale: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Noise scale. Upstream default 0.2.',
    },
    rotation: {
      control: { type: 'range', min: -90, max: 90, step: 1 },
      description: 'Group rotation in degrees. Upstream default 0.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the noise clock.',
    },
  },
} satisfies Meta<typeof Beams>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Beams' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('beams-stage');
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
  args: { ...BEAMS_DEFAULTS },
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

export const Rotated: Story = {
  args: { ...BEAMS_DEFAULTS, rotation: 30, beamNumber: 8 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...BEAMS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
