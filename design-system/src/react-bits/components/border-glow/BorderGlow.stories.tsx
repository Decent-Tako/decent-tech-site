import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { BorderGlow } from './BorderGlow';
import { BORDER_GLOW_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Border Glow',
  component: BorderGlow,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Border Glow, commit 625f250, 2026-09-10. Mechanism: pointer position sets CSS custom properties that mask a mesh-gradient border toward the cursor. Licence MIT + Commons Clause. Page https://reactbits.dev/components/border-glow . No extra runtime. Pause ignores pointer moves. Replay remounts the card.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...BORDER_GLOW_DEFAULTS },
  argTypes: {
    edgeSensitivity: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'How close the pointer must be to light the edge. Upstream default 30.',
    },
    glowColor: {
      control: 'text',
      description: 'HSL triple for the outer glow. Brand yellow. Upstream default 40 80 80.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Card fill. Brand ink. Upstream default #120F17.',
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 48, step: 1 },
      description: 'Corner radius in pixels. Upstream default 28.',
    },
    glowRadius: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Outer glow padding in pixels. Upstream default 40.',
    },
    glowIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: 'Glow opacity multiplier. Upstream default 1.',
    },
    coneSpread: {
      control: { type: 'range', min: 5, max: 50, step: 1 },
      description: 'Width of the lit cone. Upstream default 25.',
    },
    animated: {
      control: 'boolean',
      description: 'Play a sweep on mount. Upstream default false.',
    },
    colors: {
      control: 'object',
      description: 'Mesh gradient stops. Brand tokens. Upstream default #c084fc #f472b6 #38bdf8.',
    },
    fillOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Inner fill opacity near the edge. Upstream default 0.5.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always turns the mount sweep off.',
    },
  },
} satisfies Meta<typeof BorderGlow>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Border Glow' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('border-glow-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

async function playPointer(canvas: Canvas) {
  const card = canvas.getByTestId('border-glow-card');
  await expect(card).toBeVisible();
  movePointer(card, 8, 8);
  await waitFor(() => {
    const proximity = Number.parseFloat(getComputedStyle(card).getPropertyValue('--edge-proximity'));
    expect(proximity).toBeGreaterThan(0);
  }, SLOW);
  return card;
}

export const Default: Story = {
  args: { ...BORDER_GLOW_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await playPointer(canvas);
    const stage = await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playPointer(canvas);
  },
};

export const Sweep: Story = {
  args: { ...BORDER_GLOW_DEFAULTS, animated: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('border-glow-stage');
    await expect(stage).toHaveAttribute('data-animated', 'true');
    const card = canvas.getByTestId('border-glow-card');
    await waitFor(() => {
      expect(card.classList.contains('sweep-active') || Number.parseFloat(getComputedStyle(card).getPropertyValue('--edge-proximity')) >= 0).toBe(true);
    }, SLOW);
    await playPointer(canvas);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...BORDER_GLOW_DEFAULTS, animated: true, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('border-glow-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPointer(canvas);
    await playPause(canvas);
  },
};
