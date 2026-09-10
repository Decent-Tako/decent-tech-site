import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { FallingText } from './FallingText';
import { FALLING_TEXT_DEFAULTS, FALLING_TRIGGERS } from './source';

const meta = {
  title: 'React Bits/Text animations/Falling Text',
  component: FallingText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Falling Text, commit 625f250, 2026-09-10. Mechanism: Matter.js rigid bodies for each word, gravity, bounce, and a mouse constraint. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/falling-text . Runtime matter-js 0.20.0. Pause holds the runner. Replay remounts the world.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FALLING_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Words that become bodies. Academy default is the Week 0 card. Upstream default ''.`,
    },
    highlightWords: {
      control: 'object',
      description: 'Words that take highlightClass. Academy default Buddy and Team. Upstream default [].',
    },
    highlightClass: {
      control: 'text',
      description: 'Class for highlighted words. Upstream default highlighted.',
    },
    trigger: {
      control: 'select',
      options: [...FALLING_TRIGGERS],
      description: 'When the world starts. Upstream default auto.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Matter renderer background. Upstream default transparent.',
    },
    wireframes: {
      control: 'boolean',
      description: 'Draw Matter wireframes. Upstream default false.',
    },
    gravity: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'World gravity on y. Upstream default 1.',
    },
    mouseConstraintStiffness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Stiffness of the pointer constraint. Upstream default 0.2.',
    },
    fontSize: {
      control: 'text',
      description: 'CSS font-size of the words. Brand default 1.25rem. Upstream default 1rem.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always keeps the words in place with no physics.',
    },
  },
} satisfies Meta<typeof FallingText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Falling Text' })).toBeVisible();
}

async function playFallen(canvas: Canvas) {
  const stage = canvas.getByTestId('falling-text-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-started', 'true');
  }, SLOW);
  await waitFor(() => {
    const word = canvas.getAllByTestId('falling-text-word')[0];
    expect(word.style.transform).toMatch(/rotate/);
  }, SLOW);
  await expect(canvas.getByText('Buddy')).toBeVisible();
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
  args: { ...FALLING_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playFallen(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playFallen(canvas);
  },
};

export const ClickToFall: Story = {
  args: { ...FALLING_TEXT_DEFAULTS, trigger: 'click', gravity: 1.4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('falling-text-stage');
    await expect(stage).toHaveAttribute('data-started', 'false');
    await userEvent.click(canvas.getByTestId('falling-text-host'));
    await playFallen(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FALLING_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('falling-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-started', 'false');
    await expect(canvas.getByText(FEATURES[0].copy.split(' ')[0] ?? '')).toBeVisible();
    await playPause(canvas, stage);
  },
};
