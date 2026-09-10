import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { SpotlightCard } from './SpotlightCard';
import { SPOTLIGHT_CARD_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Spotlight Card',
  component: SpotlightCard,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Spotlight Card, commit 625f250, 2026-09-10. Mechanism: mouse motion on the card moves a radial spotlight. Licence MIT + Commons Clause. Page https://reactbits.dev/components/spotlight-card . No extra runtime. Pause ignores pointer moves. Replay remounts the card.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SPOTLIGHT_CARD_DEFAULTS },
  argTypes: {
    spotlightColor: {
      control: 'color',
      description: 'Spotlight fill. Brand accent blue. Upstream default rgba(255, 255, 255, 0.25).',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always ignores pointer moves.',
    },
  },
} satisfies Meta<typeof SpotlightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Spotlight Card' })).toBeVisible();
}

async function playMove(canvas: Canvas) {
  const stage = canvas.getByTestId('spotlight-card-stage');
  const card = stage.querySelector('.card-spotlight');
  if (!(card instanceof HTMLElement)) throw new Error('The Spotlight Card is missing.');
  const rect = card.getBoundingClientRect();
  fireEvent.mouseMove(card, { clientX: rect.left + 80, clientY: rect.top + 40 });
  await waitFor(() => {
    expect(stage).not.toHaveAttribute('data-spot', '50,50');
  }, SLOW);
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
  args: { ...SPOTLIGHT_CARD_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getByText('Learn')).toBeVisible();
    const stage = await playMove(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-spot', '50,50');
  },
};

export const YellowSpot: Story = {
  args: { ...SPOTLIGHT_CARD_DEFAULTS, spotlightColor: 'rgba(222, 245, 79, 0.45)' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMove(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SPOTLIGHT_CARD_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('spotlight-card-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByText('Learn')).toBeVisible();
    await playPauseResume(canvas, stage);
  },
};
