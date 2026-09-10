import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { TiltedCard } from './TiltedCard';
import { TILTED_CARD_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Tilted Card',
  component: TiltedCard,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Tilted Card, commit 625f250, 2026-09-10. Mechanism: pointer offset on the figure drives rotateX and rotateY springs, with a caption that follows the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/components/tilted-card . Runtime motion 13.2.0. Pause ignores pointer motion. Replay remounts the card.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...TILTED_CARD_DEFAULTS },
  argTypes: {
    containerHeight: {
      control: 'text',
      description: 'Height of the figure. Upstream default 300px.',
    },
    containerWidth: {
      control: 'text',
      description: 'Width of the figure. Upstream default 100%.',
    },
    imageHeight: {
      control: 'text',
      description: 'Height of the photograph. Upstream default 300px.',
    },
    imageWidth: {
      control: 'text',
      description: 'Width of the photograph. Upstream default 300px.',
    },
    scaleOnHover: {
      control: { type: 'range', min: 1, max: 1.4, step: 0.05 },
      description: 'Scale at hover. Upstream default 1.1.',
    },
    rotateAmplitude: {
      control: { type: 'range', min: 0, max: 30, step: 1 },
      description: 'Max tilt in degrees. Upstream default 14.',
    },
    showMobileWarning: {
      control: 'boolean',
      description: 'Show the mobile warning below 640px. Upstream default true.',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show the caption that follows the pointer. Upstream default true.',
    },
    displayOverlayContent: {
      control: 'boolean',
      description: 'Show overlay copy on the photograph. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets rotateAmplitude to 0 and scaleOnHover to 1.',
    },
  },
} satisfies Meta<typeof TiltedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Tilted Card' })).toBeVisible();
}

async function playHover(canvas: Canvas) {
  const stage = canvas.getByTestId('tilted-card-stage');
  const figure = stage.querySelector('.tilted-card-figure');
  if (!(figure instanceof HTMLElement)) throw new Error('The Tilted Card figure is missing.');
  await userEvent.hover(figure);
  movePointer(figure, 80, 80);
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-hover', 'true');
  }, SLOW);
  await expect(canvas.getByRole('img', { name: /physical challenge/i })).toBeVisible();
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
  args: { ...TILTED_CARD_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-hover', 'false');
  },
};

export const WithOverlay: Story = {
  args: { ...TILTED_CARD_DEFAULTS, displayOverlayContent: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('tilted-card-stage');
    await expect(stage).toHaveAttribute('data-overlay', 'true');
    await expect(canvas.getByText(/Week 0/)).toBeVisible();
    await playHover(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...TILTED_CARD_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('tilted-card-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-tilt', 'false');
    await playHover(canvas);
    await playPauseResume(canvas, stage);
  },
};
