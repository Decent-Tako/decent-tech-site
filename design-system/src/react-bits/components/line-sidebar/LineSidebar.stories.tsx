import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { LineSidebar } from './LineSidebar';
import { LINE_SIDEBAR_DEFAULTS, LINE_SIDEBAR_FALLOFFS } from './source';

const meta = {
  title: 'React Bits/Components/Line Sidebar',
  component: LineSidebar,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Line Sidebar, commit 625f250, 2026-09-10. Mechanism: pointer proximity drives a rAF lerp of --effect so colour, marker scale, and shift stay in step. Licence MIT + Commons Clause. Page https://reactbits.dev/components/line-sidebar . No extra runtime. Pause holds the rAF loop. Replay remounts the list.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LINE_SIDEBAR_DEFAULTS },
  argTypes: {
    accentColor: {
      control: 'color',
      description: 'Hover mix colour. Brand token accent blue. Upstream default #A855F7.',
    },
    textColor: {
      control: 'color',
      description: 'Idle label colour. Brand token quiet. Upstream default #c4c4c4.',
    },
    markerColor: {
      control: 'color',
      description: 'Idle marker colour. Brand token charcoal. Upstream default #6c6c6c.',
    },
    showIndex: {
      control: 'boolean',
      description: 'Show a 01-style index before each label. Upstream default true.',
    },
    showMarker: {
      control: 'boolean',
      description: 'Draw the horizontal marker beside each item. Upstream default true.',
    },
    proximityRadius: {
      control: { type: 'range', min: 20, max: 240, step: 10 },
      description: 'Distance in pixels that drives --effect. Upstream default 100.',
    },
    maxShift: {
      control: { type: 'range', min: 0, max: 80, step: 2 },
      description: 'Maximum label shift in pixels. Upstream default 30.',
    },
    falloff: {
      control: 'select',
      options: [...LINE_SIDEBAR_FALLOFFS],
      description: 'Ease from distance to --effect. Upstream default smooth.',
    },
    markerLength: {
      control: { type: 'range', min: 12, max: 120, step: 4 },
      description: 'Marker width in pixels. Upstream default 60.',
    },
    markerGap: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Gap between marker and label in pixels. Upstream default 0.',
    },
    tickScale: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Length of the in-between tick as a share of the marker. Upstream default 0.5.',
    },
    scaleTick: {
      control: 'boolean',
      description: 'In-between ticks scale with proximity. Upstream default true.',
    },
    itemGap: {
      control: { type: 'range', min: 4, max: 48, step: 2 },
      description: 'Vertical gap between items in pixels. Upstream default 20.',
    },
    fontSize: {
      control: { type: 'range', min: 0.8, max: 2, step: 0.05 },
      description: 'Label size in rem. Upstream default 1.1.',
    },
    smoothing: {
      control: { type: 'range', min: 1, max: 400, step: 10 },
      description: 'rAF lerp time constant in milliseconds. Upstream default 100.',
    },
    defaultActive: {
      control: { type: 'number', min: 0, max: 4, step: 1 },
      description: 'Index that starts active. null means none. Upstream default null.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always snaps --effect with smoothing 1.',
    },
  },
} satisfies Meta<typeof LineSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Line Sidebar' })).toBeVisible();
}

async function playSelect(canvas: Canvas) {
  const stage = canvas.getByTestId('line-sidebar-stage');
  await userEvent.click(canvas.getByText('Learn'));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-active', '1');
  }, SLOW);
  await expect(canvas.getByText('Learn').closest('li')).toHaveAttribute('aria-current', 'true');
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
  args: { ...LINE_SIDEBAR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-active', '');
  },
};

export const SharpFalloff: Story = {
  args: { ...LINE_SIDEBAR_DEFAULTS, falloff: 'sharp', showIndex: false },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await expect(stage).toHaveAttribute('data-falloff', 'sharp');
    await expect(stage).toHaveAttribute('data-index', 'false');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LINE_SIDEBAR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('line-sidebar-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playSelect(canvas);
    await playPauseResume(canvas, stage);
  },
};
