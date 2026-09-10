import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { GlareHover } from './GlareHover';
import { GLARE_HOVER_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Glare Hover',
  component: GlareHover,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Glare Hover, commit 625f250, 2026-09-10. Mechanism: a CSS gradient sweep on hover. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/glare-hover . No extra runtime. Pause freezes the sweep. Replay remounts the card. Background default is brand ink #212121 (upstream #000). Glare default is paper #FFFFFF (upstream #ffffff). Border default is charcoal #4A4A4A (upstream #333).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GLARE_HOVER_DEFAULTS },
  argTypes: {
    width: {
      control: 'text',
      description: 'Card width. Upstream default 500px.',
    },
    height: {
      control: 'text',
      description: 'Card height. Upstream default 500px.',
    },
    background: {
      control: 'color',
      description: 'Card fill. Brand ink #212121. Upstream default #000.',
    },
    borderRadius: {
      control: 'text',
      description: 'Corner radius. Upstream default 10px.',
    },
    borderColor: {
      control: 'color',
      description: 'Border color. Brand charcoal #4A4A4A. Upstream default #333.',
    },
    glareColor: {
      control: 'color',
      description: 'Sweep colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    glareOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Sweep opacity. Upstream default 0.5.',
    },
    glareAngle: {
      control: { type: 'range', min: -180, max: 180, step: 5 },
      description: 'Sweep angle in degrees. Upstream default -45.',
    },
    glareSize: {
      control: { type: 'range', min: 50, max: 400, step: 10 },
      description: 'Sweep size percent. Upstream default 250.',
    },
    transitionDuration: {
      control: { type: 'range', min: 0, max: 2000, step: 50 },
      description: 'Sweep length in milliseconds. Upstream default 650.',
    },
    playOnce: {
      control: 'boolean',
      description: 'Animate only the first hover. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always snaps the sweep with a zero duration.',
    },
  },
} satisfies Meta<typeof GlareHover>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Glare Hover' })).toBeVisible();
}

async function playHover(canvas: Canvas) {
  const stage = canvas.getByTestId('glare-hover-stage');
  const card = canvas.getByTestId('glare-hover-card');
  await userEvent.hover(card);
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-hover', 'true');
  });
  await expect(canvas.getByText('Tracker and plan')).toBeVisible();
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
  args: { ...GLARE_HOVER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playHover(canvas);
  },
};

export const PlayOnce: Story = {
  args: { ...GLARE_HOVER_DEFAULTS, playOnce: true, glareSize: 320 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await expect(stage).toHaveAttribute('data-play-once', 'true');
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GLARE_HOVER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
