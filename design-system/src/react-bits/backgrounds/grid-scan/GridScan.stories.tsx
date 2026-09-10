import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { GridScan } from './GridScan';
import { GRID_SCAN_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Grid Scan',
  component: GridScan,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Grid Scan, commit 625f250, 2026-09-10. Mechanism: three.js perspective grid with a travelling scan pulse. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/grid-scan . Runtime three 0.180.0, postprocessing 6.39.5, face-api.js 0.22.2 (webcam off). Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GRID_SCAN_DEFAULTS },
  argTypes: {
    enableWebcam: {
      control: 'boolean',
      description: 'Face tracking. Stories keep this false. Upstream default false.',
    },
    showPreview: {
      control: 'boolean',
      description: 'Webcam preview. Upstream default false.',
    },
    sensitivity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pointer skew amount. Upstream default 0.55.',
    },
    lineThickness: {
      control: { type: 'range', min: 0.25, max: 4, step: 0.25 },
      description: 'Grid line width. Upstream default 1.',
    },
    linesColor: {
      control: 'color',
      description: 'Grid colour. Brand paper #FFFFFF. Upstream default #2F293A.',
    },
    scanColor: {
      control: 'color',
      description: 'Scan pulse. Brand accent-yellow #DEF54F. Upstream default #FF9FFC.',
    },
    scanOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Scan mix. Upstream default 0.4.',
    },
    gridScale: {
      control: { type: 'range', min: 0.02, max: 0.4, step: 0.01 },
      description: 'Cell size. Upstream default 0.1.',
    },
    lineStyle: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Line pattern. Upstream default solid.',
    },
    lineJitter: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Line wobble. Upstream default 0.1.',
    },
    scanDirection: {
      control: 'select',
      options: ['forward', 'backward', 'pingpong'],
      description: 'Pulse travel. Upstream default pingpong.',
    },
    enablePost: {
      control: 'boolean',
      description: 'Bloom and chromatic aberration. Upstream default true.',
    },
    bloomIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Bloom mix. Upstream default 0.',
    },
    bloomThreshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Bloom threshold. Upstream default 0.',
    },
    bloomSmoothing: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Bloom smoothing. Upstream default 0.',
    },
    chromaticAberration: {
      control: { type: 'range', min: 0, max: 0.02, step: 0.001 },
      description: 'RGB split. Upstream default 0.002.',
    },
    noiseIntensity: {
      control: { type: 'range', min: 0, max: 0.1, step: 0.005 },
      description: 'Grain. Upstream default 0.01.',
    },
    scanGlow: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Pulse width. Upstream default 0.5.',
    },
    scanSoftness: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Pulse falloff. Upstream default 2.',
    },
    scanPhaseTaper: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Pulse taper. Upstream default 0.9.',
    },
    scanDuration: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Pulse length in seconds. Upstream default 2.',
    },
    scanDelay: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Wait between pulses. Upstream default 2.',
    },
    enableGyro: {
      control: 'boolean',
      description: 'Device tilt. Stories keep this false. Upstream default false.',
    },
    scanOnClick: {
      control: 'boolean',
      description: 'Click starts a pulse. Upstream default false.',
    },
    snapBackDelay: {
      control: { type: 'range', min: 0, max: 1000, step: 50 },
      description: 'Pointer leave delay in ms. Upstream default 250.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the scan still.',
    },
  },
} satisfies Meta<typeof GridScan>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Grid Scan' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('grid-scan-stage');
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
  args: { ...GRID_SCAN_DEFAULTS },
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

export const DashedClickScan: Story = {
  args: { ...GRID_SCAN_DEFAULTS, lineStyle: 'dashed', scanOnClick: true, scanColor: '#0035B1' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await userEvent.click(stage);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GRID_SCAN_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
