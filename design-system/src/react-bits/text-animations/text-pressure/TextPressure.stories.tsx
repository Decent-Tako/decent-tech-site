import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { movePointer } from '../../frame/pointerSupport';
import { TextPressure } from './TextPressure';
import { TEXT_PRESSURE_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Text Pressure',
  component: TextPressure,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Text Pressure, commit 625f250, 2026-09-10. Mechanism: each glyph maps pointer distance to weight, width, and italic axes. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/text-pressure . No extra runtime package. Pause holds the frame loop. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...TEXT_PRESSURE_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word under the pointer. Academy default is the Week 0 title. Upstream default Compressa.`,
    },
    fontFamily: {
      control: 'text',
      description: 'Face name. Brand Sans. Upstream default Roboto Flex.',
    },
    width: {
      control: 'boolean',
      description: 'Map distance to the width axis. Upstream default true.',
    },
    weight: {
      control: 'boolean',
      description: 'Map distance to the weight axis. Upstream default true.',
    },
    italic: {
      control: 'boolean',
      description: 'Map distance to the italic axis. Upstream default true.',
    },
    alpha: {
      control: 'boolean',
      description: 'Map distance to opacity. Upstream default false.',
    },
    flex: {
      control: 'boolean',
      description: 'Space glyphs across the row. Upstream default true.',
    },
    stroke: {
      control: 'boolean',
      description: 'Draw a stroke copy behind each glyph. Upstream default false.',
    },
    scale: {
      control: 'boolean',
      description: 'Scale the line to the container height. Upstream default false.',
    },
    textColor: {
      control: 'color',
      description: 'Fill colour. Ink #212121. Upstream default #FFFFFF.',
    },
    strokeColor: {
      control: 'color',
      description: 'Stroke colour. Accent blue #0035B1. Upstream default #FF0000.',
    },
    minFontSize: {
      control: { type: 'range', min: 12, max: 72, step: 2 },
      description: 'Minimum type size in pixels. Upstream default 24.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always freezes variation at rest.',
    },
  },
} satisfies Meta<typeof TextPressure>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Text Pressure' })).toBeVisible();
}

async function playPressure(canvas: Canvas) {
  const stage = canvas.getByTestId('text-pressure-stage');
  const host = canvas.getByTestId('text-pressure-copy');
  await expect(host).toBeVisible();
  movePointer(host, 24, 24);
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-pressure') ?? '400')).toBeGreaterThan(400);
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
  args: { ...TEXT_PRESSURE_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPressure(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playPressure(canvas);
  },
};

export const StrokeAlpha: Story = {
  args: {
    ...TEXT_PRESSURE_DEFAULTS,
    stroke: true,
    alpha: true,
    text: FEATURES[1].title,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPressure(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...TEXT_PRESSURE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('text-pressure-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('text-pressure-copy')).toHaveTextContent(
      FEATURES[0].title.toUpperCase(),
    );
    await expect(stage).toHaveAttribute('data-pressure', '400');
    await playPause(canvas, stage);
  },
};
