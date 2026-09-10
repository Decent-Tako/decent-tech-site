import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { InfiniteSpiral } from './InfiniteSpiral';
import { INFINITE_SPIRAL_DEFAULTS, SPIRAL_DIRECTIONS, SPIRAL_FITS, SPIRAL_MODES } from './source';

const meta = {
  title: 'React Bits/Components/Infinite Spiral',
  component: InfiniteSpiral,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Infinite Spiral, commit 625f250, 2026-09-10. Mechanism: CSS 3D cards walk a helix with auto, drag, or scroll. Licence MIT + Commons Clause. Page https://reactbits.dev/components/infinite-spiral . No extra runtime. Pause holds the auto-scroll lerp. Replay remounts the helix.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...INFINITE_SPIRAL_DEFAULTS },
  argTypes: {
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Auto-scroll speed. Upstream default 0.55.',
    },
    direction: {
      control: 'select',
      options: [...SPIRAL_DIRECTIONS],
      description: 'Helix travel direction. Upstream default up.',
    },
    animationMode: {
      control: 'select',
      options: [...SPIRAL_MODES],
      description: 'What drives the helix. Upstream default auto.',
    },
    radius: {
      control: { type: 'range', min: 40, max: 320, step: 5 },
      description: 'Helix radius in pixels. Upstream default 170.',
    },
    cardWidth: {
      control: { type: 'range', min: 40, max: 240, step: 4 },
      description: 'Card width in pixels. Upstream default 100.',
    },
    cardHeight: {
      control: { type: 'range', min: 40, max: 240, step: 4 },
      description: 'Card height in pixels. Upstream default 100.',
    },
    verticalSpacing: {
      control: { type: 'range', min: 20, max: 160, step: 4 },
      description: 'Vertical gap between cards. Upstream default 60.',
    },
    perspective: {
      control: { type: 'range', min: 200, max: 2000, step: 50 },
      description: 'CSS perspective in pixels. Upstream default 1000.',
    },
    cardsPerTurn: {
      control: { type: 'range', min: 3, max: 16, step: 1 },
      description: 'Cards in one full turn. Upstream default 7.',
    },
    rotation: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Extra yaw in degrees. Upstream default 0.',
    },
    cardTilt: {
      control: { type: 'range', min: -45, max: 45, step: 1 },
      description: 'Card roll in degrees. Upstream default 0.',
    },
    cardRadius: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Card corner radius. Upstream default 10.',
    },
    centerScale: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.05 },
      description: 'Scale of the nearest card. Upstream default 1.2.',
    },
    edgeFade: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'How soon far cards fade. Upstream default 0.3.',
    },
    edgeBlur: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Blur of far cards in pixels. Upstream default 6.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Hold auto-scroll while hovered. Upstream default true.',
    },
    imageFit: {
      control: 'select',
      options: [...SPIRAL_FITS],
      description: 'object-fit of each photograph. Upstream default cover.',
    },
    grayscale: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Greyscale amount. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets speed to 0.',
    },
  },
} satisfies Meta<typeof InfiniteSpiral>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Infinite Spiral' })).toBeVisible();
}

async function playMove(canvas: Canvas) {
  const stage = canvas.getByTestId('infinite-spiral-stage');
  await expect(canvas.getByRole('list', { name: 'Infinite spiral gallery' })).toBeVisible();
  if (stage.getAttribute('data-speed') !== '0') {
    await waitFor(() => {
      expect(Number.parseFloat(stage.getAttribute('data-progress') ?? '0')).not.toBe(0);
    }, SLOW);
  }
  await expect(canvas.getAllByLabelText('Start').length).toBeGreaterThan(0);
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...INFINITE_SPIRAL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMove(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
  },
};

export const DragDown: Story = {
  args: { ...INFINITE_SPIRAL_DEFAULTS, animationMode: 'drag', direction: 'down', speed: 0.9 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('infinite-spiral-stage');
    await expect(stage).toHaveAttribute('data-mode', 'drag');
    const helix = stage.querySelector('.infinite-spiral') as HTMLElement;
    await expect(helix).toBeTruthy();
    helix.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: 20,
        clientY: 40,
        button: 0,
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'mouse',
      }),
    );
    helix.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: 20,
        clientY: 120,
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'mouse',
      }),
    );
    helix.dispatchEvent(
      new PointerEvent('pointerup', {
        clientX: 20,
        clientY: 120,
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'mouse',
      }),
    );
    await waitFor(() => {
      expect(Number.parseFloat(stage.getAttribute('data-progress') ?? '0')).not.toBe(0);
    }, SLOW);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...INFINITE_SPIRAL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMove(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPauseResume(canvas, stage);
  },
};
