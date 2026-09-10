import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { dragPointer, movePointer } from '../../frame/pointerSupport';
import { ElasticMesh } from './ElasticMesh';
import { ELASTIC_MESH_DEFAULTS, MESH_INTERACTIONS } from './source';

const meta = {
  title: 'React Bits/Animations/Elastic Mesh',
  component: ElasticMesh,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Elastic Mesh, commit 625f250, 2026-09-10. Mechanism: an OGL spring mesh follows the pointer with stiffness, damping, and pull. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/elastic-mesh . Runtime ogl 1.0.11. Pause holds the last pose. Replay remounts the sketch. color1 default is brand accent blue #0035B1 (upstream #5227FF). color2 default is ink #212121 (upstream #B19EEF). Image default is the Week 0 photograph (upstream empty string).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ELASTIC_MESH_DEFAULTS },
  argTypes: {
    image: {
      control: 'text',
      description:
        'Texture URL. Academy photograph from public/photos. Upstream default empty string (gradient fill).',
    },
    color1: {
      control: 'color',
      description: 'Gradient top when no image. Brand accent blue #0035B1. Upstream default #5227FF.',
    },
    color2: {
      control: 'color',
      description: 'Gradient bottom when no image. Brand ink #212121. Upstream default #B19EEF.',
    },
    highlight: {
      control: 'color',
      description: 'Specular highlight. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    showGrid: {
      control: 'boolean',
      description: 'Draw the UV grid overlay. Upstream default true.',
    },
    gridDensity: {
      control: { type: 'range', min: 2, max: 40, step: 1 },
      description: 'Grid cells across the mesh. Upstream default 20.',
    },
    gridOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.02 },
      description: 'Grid overlay opacity. Upstream default 0.28.',
    },
    gridColor: {
      control: 'color',
      description: 'Grid overlay colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Corner radius in pixels. Upstream default 25.',
    },
    stiffness: {
      control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 },
      description: 'Spring return strength. Upstream default 0.05.',
    },
    damping: {
      control: { type: 'range', min: 0.05, max: 0.9, step: 0.05 },
      description: 'Velocity retain complement. Upstream default 0.2.',
    },
    grabRadius: {
      control: { type: 'range', min: 0.1, max: 1.5, step: 0.05 },
      description: 'Pointer influence radius. Upstream default 0.6.',
    },
    pull: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Pointer pull strength. Upstream default 0.4.',
    },
    wobble: {
      control: { type: 'range', min: 0, max: 12, step: 0.5 },
      description: 'Neighbour coupling. Upstream default 5.',
    },
    tilt: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Perspective tilt in degrees. Upstream default 14.',
    },
    shading: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Diffuse and specular mix. Upstream default 0.5.',
    },
    resolution: {
      control: { type: 'range', min: 6, max: 40, step: 1 },
      description: 'Nodes per side. Upstream default 25.',
    },
    interaction: {
      control: 'select',
      options: [...MESH_INTERACTIONS],
      description: 'hover follows the pointer. drag follows only while down. Upstream default hover.',
    },
    enabled: {
      control: 'boolean',
      description: 'Run pointer physics. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws a still mesh with no pointer pull.',
    },
  },
} satisfies Meta<typeof ElasticMesh>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const PAPER = '#FFFFFF';
const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Elastic Mesh' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('elastic-mesh-stage');
  await waitFor(() => {
    expect(stage.getAttribute('data-webgl')).not.toBe('pending');
  }, SLOW);
  return stage;
}

async function playMesh(canvas: Canvas, mode: 'hover' | 'drag' = 'hover') {
  const stage = await playReady(canvas);
  if (stage.getAttribute('data-webgl') === 'unavailable') {
    await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    return stage;
  }
  const meshCanvas = canvas.getByTestId('elastic-mesh-canvas') as HTMLCanvasElement;
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-webgl', 'ready');
  }, SLOW);
  await assertCanvasPainted(meshCanvas, PAPER);
  const surface = canvas.getByTestId('elastic-mesh-surface');
  if (mode === 'drag') {
    await dragPointer(surface, 120);
  } else {
    movePointer(surface, 80, 70);
    movePointer(surface, 200, 140);
    movePointer(surface, 260, 90);
  }
  await waitFor(() => {
    expect(Number(stage.dataset.offset)).toBeGreaterThan(0);
  }, SLOW);
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
  args: { ...ELASTIC_MESH_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMesh(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playMesh(canvas);
  },
};

export const DragMesh: Story = {
  args: { ...ELASTIC_MESH_DEFAULTS, interaction: 'drag', pull: 0.8 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMesh(canvas, 'drag');
    await expect(stage).toHaveAttribute('data-interaction', 'drag');
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ELASTIC_MESH_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.getAttribute('data-webgl') === 'unavailable') {
      await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    } else {
      await waitFor(() => {
        expect(stage).toHaveAttribute('data-webgl', 'ready');
      }, SLOW);
      const meshCanvas = canvas.getByTestId('elastic-mesh-canvas') as HTMLCanvasElement;
      await assertCanvasPainted(meshCanvas, PAPER);
      const surface = canvas.getByTestId('elastic-mesh-surface');
      movePointer(surface, 120, 90);
      await expect(stage).toHaveAttribute('data-offset', '0');
    }
    await playPause(canvas, stage);
  },
};
