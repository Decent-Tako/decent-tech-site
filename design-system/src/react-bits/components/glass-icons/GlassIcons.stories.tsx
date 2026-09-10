import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { GlassIcons } from './GlassIcons';
import { GLASS_ICON_PALETTES, GLASS_ICONS_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Glass Icons',
  component: GlassIcons,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Glass Icons, commit 625f250, 2026-09-10. Mechanism: each button stacks a rotated colour back plate under a frosted front. Hover or focus lifts the front and shows the label. Licence MIT + Commons Clause. Page https://reactbits.dev/components/glass-icons . No extra runtime. Pause freezes the CSS transitions. Replay remounts the grid.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GLASS_ICONS_DEFAULTS },
  argTypes: {
    palette: {
      control: 'select',
      options: [...GLASS_ICON_PALETTES],
      description: 'named uses upstream gradient keys. brand uses accent blue and ink. Wrapper default named.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows labels and holds the plates still.',
    },
  },
} satisfies Meta<typeof GlassIcons>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Glass Icons' })).toBeVisible();
}

async function playActivate(canvas: Canvas) {
  const stage = canvas.getByTestId('glass-icons-stage');
  const start = canvas.getByRole('button', { name: 'Start' });
  await userEvent.click(start);
  await expect(stage).toHaveAttribute('data-active', 'Start');
  await expect(start).toBeVisible();
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
  args: { ...GLASS_ICONS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playActivate(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-active', '');
  },
};

export const BrandPalette: Story = {
  args: { ...GLASS_ICONS_DEFAULTS, palette: 'brand' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playActivate(canvas);
    await expect(stage).toHaveAttribute('data-palette', 'brand');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GLASS_ICONS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('glass-icons-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByText('Start')).toBeVisible();
    await expect(canvas.getByText('Learn')).toBeVisible();
    await playActivate(canvas);
    await playPauseResume(canvas, stage);
  },
};
