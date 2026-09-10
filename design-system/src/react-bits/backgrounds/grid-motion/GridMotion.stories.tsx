import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { GridMotion } from './GridMotion';
import { GRID_MOTION_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Grid Motion',
  component: GridMotion,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Grid Motion, commit 625f250, 2026-09-10. Mechanism: four gsap rows inertia-slide from pointer X. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/grid-motion . Runtime gsap 3.15.0. Pause holds the ticker updates. Replay remounts the grid.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GRID_MOTION_DEFAULTS },
  argTypes: {
    gradientColor: {
      control: 'color',
      description: 'Radial overlay. Brand ink #212121. Upstream default black.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the rows still.',
    },
  },
} satisfies Meta<typeof GridMotion>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Grid Motion' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('grid-motion-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-ready', 'true');
  }, SLOW);
  await expect(stage).toHaveTextContent('Six weeks');
  await expect(stage.querySelector('.row__item-img')).toBeTruthy();
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
  args: { ...GRID_MOTION_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    movePointer(stage, 180, 80);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
  },
};

export const PaperWash: Story = {
  args: { ...GRID_MOTION_DEFAULTS, gradientColor: '#FFFFFF' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GRID_MOTION_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPauseResume(canvas, stage);
  },
};
