import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { dragPointer } from '../../frame/pointerSupport';
import { DomeGallery } from './DomeGallery';
import { DOME_GALLERY_DEFAULTS, FIT_BASIS } from './source';

const meta = {
  title: 'React Bits/Components/Dome Gallery',
  component: DomeGallery,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Dome Gallery, commit 625f250, 2026-09-10. Mechanism: CSS 3D tiles on a hemisphere, dragged with @use-gesture/react. Licence MIT + Commons Clause. Page https://reactbits.dev/components/dome-gallery . Runtime @use-gesture/react 10.3.1. Pause ignores drag. Replay remounts the dome.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DOME_GALLERY_DEFAULTS },
  argTypes: {
    fit: {
      control: { type: 'range', min: 0.2, max: 1, step: 0.05 },
      description: 'How tightly the sphere fills the stage. Upstream default 0.5.',
    },
    fitBasis: {
      control: 'select',
      options: [...FIT_BASIS],
      description: 'Which dimension drives fit. Upstream default auto.',
    },
    minRadius: {
      control: { type: 'range', min: 200, max: 1200, step: 20 },
      description: 'Smallest sphere radius in pixels. Upstream default 600.',
    },
    maxRadius: {
      control: { type: 'range', min: 600, max: 8000, step: 100 },
      description: 'Largest sphere radius in pixels. Upstream default Infinity. Control default 4000.',
    },
    padFactor: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.05 },
      description: 'Padding around the viewer. Upstream default 0.25.',
    },
    overlayBlurColor: {
      control: 'color',
      description: 'Edge fade colour. Brand ink. Upstream default #120F17.',
    },
    maxVerticalRotationDeg: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Vertical tilt limit in degrees. Upstream default 5.',
    },
    dragSensitivity: {
      control: { type: 'range', min: 4, max: 60, step: 1 },
      description: 'Pixels per degree of drag. Upstream default 20.',
    },
    enlargeTransitionMs: {
      control: { type: 'range', min: 0, max: 800, step: 20 },
      description: 'Enlarge animation length in milliseconds. Upstream default 300.',
    },
    segments: {
      control: { type: 'range', min: 10, max: 50, step: 1 },
      description: 'Tile count around the sphere. Upstream default 35.',
    },
    dragDampening: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Inertia after drag. Upstream default 2.',
    },
    openedImageWidth: {
      control: 'text',
      description: 'Enlarged width. Upstream default 400px.',
    },
    openedImageHeight: {
      control: 'text',
      description: 'Enlarged height. Upstream default 400px.',
    },
    imageBorderRadius: {
      control: 'text',
      description: 'Tile corner radius. Upstream default 30px.',
    },
    openedImageBorderRadius: {
      control: 'text',
      description: 'Enlarged corner radius. Upstream default 30px.',
    },
    grayscale: {
      control: 'boolean',
      description: 'Tiles start in grayscale. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always ignores drag and sets enlarge duration to 0.',
    },
  },
} satisfies Meta<typeof DomeGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Dome Gallery' })).toBeVisible();
}

async function playDrag(canvas: Canvas) {
  const stage = canvas.getByTestId('dome-gallery-stage');
  const main = stage.querySelector('.sphere-main');
  await expect(main).toBeTruthy();
  await dragPointer(main as HTMLElement, 80);
  await waitFor(() => {
    expect(Number.parseFloat(stage.getAttribute('data-rot-y') ?? '0')).not.toBe(0);
  }, SLOW);
  return stage;
}

async function playOpen(canvas: Canvas) {
  const stage = canvas.getByTestId('dome-gallery-stage');
  await new Promise((resolve) => setTimeout(resolve, 120));
  const tile = stage.querySelector('.item__image');
  await expect(tile).toBeTruthy();
  await userEvent.click(tile as HTMLElement);
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-open', 'true');
  }, SLOW);
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...DOME_GALLERY_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDrag(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
  },
};

export const ColourTiles: Story = {
  args: { ...DOME_GALLERY_DEFAULTS, grayscale: false, overlayBlurColor: '#0035B1' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('dome-gallery-stage');
    await expect(stage).toHaveAttribute('data-gray', 'false');
    await playDrag(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...DOME_GALLERY_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('dome-gallery-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    const tile = stage.querySelector('.item__image');
    await expect(tile).toBeTruthy();
    await userEvent.click(tile as HTMLElement);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-open', 'true');
    }, SLOW);
    await playPauseResume(canvas, stage);
  },
};
