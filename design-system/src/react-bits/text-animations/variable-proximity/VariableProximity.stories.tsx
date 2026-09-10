import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { movePointer } from '../../frame/pointerSupport';
import { VariableProximity } from './VariableProximity';
import { VARIABLE_PROXIMITY_DEFAULTS, VARIABLE_PROXIMITY_FALLOFFS } from './source';

const meta = {
  title: 'React Bits/Text animations/Variable Proximity',
  component: VariableProximity,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Variable Proximity, commit 625f250, 2026-09-10. Mechanism: each glyph maps pointer distance to font weight. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/variable-proximity . Runtime motion 13.2.0. Pause holds the frame loop. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...VARIABLE_PROXIMITY_DEFAULTS },
  argTypes: {
    label: {
      control: 'text',
      description: `Word under the pointer. Academy default is the Week 0 title. Upstream has no default.`,
    },
    fromFontVariationSettings: {
      control: 'text',
      description: "Variation at rest. Upstream has no default. Here 'wght' 400.",
    },
    toFontVariationSettings: {
      control: 'text',
      description: "Variation at the pointer. Brand Sans 700. Upstream demo used 'wght' 800.",
    },
    radius: {
      control: { type: 'range', min: 20, max: 200, step: 5 },
      description: 'Pointer radius in pixels. Upstream default 50.',
    },
    falloff: {
      control: 'select',
      options: [...VARIABLE_PROXIMITY_FALLOFFS],
      description: 'Distance curve. Upstream default linear.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always freezes weight at rest.',
    },
  },
} satisfies Meta<typeof VariableProximity>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Variable Proximity' })).toBeVisible();
}

async function playWeight(canvas: Canvas) {
  const stage = canvas.getByTestId('variable-proximity-stage');
  const host = canvas.getByTestId('variable-proximity-copy');
  await expect(host).toBeVisible();
  await expect(host).toHaveTextContent(FEATURES[0].title);
  movePointer(host, 24, 24);
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-weight') ?? '400')).toBeGreaterThan(400);
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
  args: { ...VARIABLE_PROXIMITY_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playWeight(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playWeight(canvas);
  },
};

export const GaussianFalloff: Story = {
  args: {
    ...VARIABLE_PROXIMITY_DEFAULTS,
    falloff: 'gaussian',
    radius: 120,
    label: FEATURES[1].title,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('variable-proximity-stage');
    const host = canvas.getByTestId('variable-proximity-copy');
    await expect(host).toHaveTextContent(FEATURES[1].title);
    movePointer(host, 24, 24);
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-weight') ?? '400')).toBeGreaterThan(400);
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...VARIABLE_PROXIMITY_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('variable-proximity-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('variable-proximity-copy')).toHaveTextContent(FEATURES[0].title);
    await expect(stage).toHaveAttribute('data-weight', '400');
    await playPause(canvas, stage);
  },
};
