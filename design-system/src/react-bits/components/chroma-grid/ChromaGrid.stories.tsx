import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { ChromaGrid } from './ChromaGrid';
import { CHROMA_GRID_DEFAULTS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Components/Chroma Grid',
  component: ChromaGrid,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Chroma Grid, commit 625f250, 2026-09-10. Mechanism: a grayscale mask follows the pointer with gsap and colour shows in the spotlight. Licence MIT + Commons Clause. Page https://reactbits.dev/components/chroma-grid . Runtime gsap 3.15.0. Pause skips pointer gsap. Replay remounts the grid.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CHROMA_GRID_DEFAULTS },
  argTypes: {
    radius: {
      control: { type: 'range', min: 80, max: 480, step: 10 },
      description: 'Spotlight radius in pixels. Upstream default 300.',
    },
    columns: {
      control: { type: 'range', min: 1, max: 4, step: 1 },
      description: 'Grid columns. Upstream default 3.',
    },
    rows: {
      control: { type: 'range', min: 1, max: 4, step: 1 },
      description: 'Grid rows hint. Upstream default 2.',
    },
    damping: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Spotlight follow duration in seconds. Upstream default 0.45.',
    },
    fadeOut: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Grayscale return duration in seconds. Upstream default 0.6.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the spotlight. Upstream default power3.out.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows colour with no spotlight tween.',
    },
  },
} satisfies Meta<typeof ChromaGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Chroma Grid' })).toBeVisible();
}

async function playCards(canvas: Canvas) {
  const images = canvas.getAllByRole('img');
  await expect(images).toHaveLength(5);
  await expect(canvas.getByText('Start')).toBeVisible();
  return images;
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('chroma-grid-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...CHROMA_GRID_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('chroma-grid-stage');
    await playCards(canvas);
    const grid = stage.querySelector('.chroma-grid');
    await expect(grid).toBeTruthy();
    movePointer(grid as HTMLElement, 80, 80);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-revealed', 'true');
    }, SLOW);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playCards(canvas);
    const again = stage.querySelector('.chroma-grid');
    movePointer(again as HTMLElement, 120, 90);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-revealed', 'true');
    }, SLOW);
  },
};

export const TwoColumns: Story = {
  args: { ...CHROMA_GRID_DEFAULTS, columns: 2, radius: 180 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('chroma-grid-stage');
    await expect(stage).toHaveAttribute('data-columns', '2');
    await playCards(canvas);
    const grid = stage.querySelector('.chroma-grid');
    movePointer(grid as HTMLElement, 60, 60);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-revealed', 'true');
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...CHROMA_GRID_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('chroma-grid-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-revealed', 'true');
    await playCards(canvas);
    await playPause(canvas);
  },
};
