import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { dragPointer } from '../../frame/pointerSupport';
import { ModelViewer } from './ModelViewer';
import { MODEL_VIEWER_DEFAULTS, MODEL_VIEWER_PRESETS } from './source';

const meta = {
  title: 'React Bits/Components/Model Viewer',
  component: ModelViewer,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Model Viewer, commit 625f250, 2026-09-10. Mechanism: a GLB sits in a three.js scene with environment lighting. Drag rotates. Licence MIT + Commons Clause. Page https://reactbits.dev/components/model-viewer . Runtime three 0.180.0, @react-three/fiber 9.7.0, @react-three/drei 10.7.8. Pause holds the render loop. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MODEL_VIEWER_DEFAULTS },
  argTypes: {
    width: {
      control: { type: 'range', min: 240, max: 720, step: 10 },
      description: 'Stage width in pixels. Upstream default 400.',
    },
    height: {
      control: { type: 'range', min: 240, max: 720, step: 10 },
      description: 'Stage height in pixels. Upstream default 400.',
    },
    modelXOffset: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.01 },
      description: 'Horizontal NDC offset. Upstream default 0.',
    },
    modelYOffset: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.01 },
      description: 'Vertical NDC offset. Upstream default 0.',
    },
    defaultRotationX: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Initial yaw in degrees. Upstream default -50.',
    },
    defaultRotationY: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Initial pitch in degrees. Upstream default 20.',
    },
    defaultZoom: {
      control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
      description: 'Camera z. Upstream default 0.5.',
    },
    minZoomDistance: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Closest camera z. Upstream default 0.5.',
    },
    maxZoomDistance: {
      control: { type: 'range', min: 2, max: 20, step: 0.5 },
      description: 'Farthest camera z. Upstream default 10.',
    },
    enableMouseParallax: {
      control: 'boolean',
      description: 'Shift the model with pointer position. Upstream default true.',
    },
    enableManualRotation: {
      control: 'boolean',
      description: 'Drag to rotate. Upstream default true.',
    },
    enableHoverRotation: {
      control: 'boolean',
      description: 'Tilt toward the pointer. Upstream default true.',
    },
    enableManualZoom: {
      control: 'boolean',
      description: 'Wheel or pinch zoom. Upstream default true.',
    },
    ambientIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Ambient light. Upstream default 0.3.',
    },
    keyLightIntensity: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Key directional light. Upstream default 1.',
    },
    fillLightIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Fill directional light. Upstream default 0.5.',
    },
    rimLightIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Rim directional light. Upstream default 0.8.',
    },
    environmentPreset: {
      control: 'select',
      options: [...MODEL_VIEWER_PRESETS],
      description: 'drei Environment preset. Brand default none so the story does not fetch a remote HDR. Upstream default forest.',
    },
    autoFrame: {
      control: 'boolean',
      description: 'Fit the camera to the bounding sphere. Upstream default false.',
    },
    showScreenshotButton: {
      control: 'boolean',
      description: 'Show the capture button. Brand default false. Upstream default true.',
    },
    fadeIn: {
      control: 'boolean',
      description: 'Fade material opacity in after load. Upstream default false.',
    },
    autoRotate: {
      control: 'boolean',
      description: 'Spin on the y axis. Upstream default false.',
    },
    autoRotateSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Auto-rotate radians per second. Upstream default 0.35.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the render loop and turns rotation off.',
    },
  },
} satisfies Meta<typeof ModelViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 15000 };
const BLACK = '#000000';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Model Viewer' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('model-viewer-stage');
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
  await assertCanvasPainted(sketch as HTMLCanvasElement, BLACK, {
    grid: 16,
    timeoutMs: 10000,
  });
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
  args: { ...MODEL_VIEWER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    const sketch = await playPaint(stage);
    if (sketch) {
      await dragPointer(sketch, 120);
      await playPaint(stage);
    }
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const AutoRotate: Story = {
  args: {
    ...MODEL_VIEWER_DEFAULTS,
    autoRotate: true,
    defaultZoom: 1.2,
    keyLightIntensity: 1.6,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-rotate', 'true');
    const sketch = await playPaint(stage);
    if (sketch) {
      await dragPointer(sketch, 80);
      await playPaint(stage);
    }
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MODEL_VIEWER_DEFAULTS, reducedMotion: 'always', autoRotate: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-rotate', 'false');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
