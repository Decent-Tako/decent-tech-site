import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { TargetCursor } from './TargetCursor';
import { TARGET_CURSOR_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Target Cursor',
  component: TargetCursor,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Target Cursor, commit 625f250, 2026-09-10. Mechanism: a four-corner cursor follows the pointer, spins, and locks onto a matching target on hover. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/target-cursor . Runtime gsap 3.15.0. Pause holds the spin timeline. Replay remounts the cursor. Colour default is brand paper #FFFFFF (upstream #ffffff). On-target colour default is brand accent yellow #DEF54F (upstream unset).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...TARGET_CURSOR_DEFAULTS },
  argTypes: {
    targetSelector: {
      control: 'text',
      description: 'CSS selector for lock targets. Upstream default .cursor-target.',
    },
    spinDuration: {
      control: { type: 'range', min: 0.4, max: 8, step: 0.1 },
      description: 'Seconds per full spin. Upstream default 2.',
    },
    hideDefaultCursor: {
      control: 'boolean',
      description: 'Hide the operating-system cursor on the stage. Upstream default true.',
    },
    hoverDuration: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Seconds the lock strength rises. Upstream default 0.2.',
    },
    parallaxOn: {
      control: 'boolean',
      description: 'Corners ease toward the target while locked. Upstream default true.',
    },
    cursorColor: {
      control: 'color',
      description: 'Dot and corner colour. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    cursorColorOnTarget: {
      control: 'color',
      description: 'Colour while locked. Brand accent yellow #DEF54F. Upstream default unset.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the cursor paused with no spin.',
    },
  },
} satisfies Meta<typeof TargetCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Target Cursor' })).toBeVisible();
}

async function playAim(canvas: Canvas) {
  const stage = canvas.getByTestId('target-cursor-stage');
  await expect(canvas.getByTestId('target-cursor')).toBeVisible();
  movePointer(stage, 80, 70);
  movePointer(stage, 160, 110);
  const start = canvas.getByRole('link', { name: 'Start' });
  await userEvent.hover(start);
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-locked', 'true');
  }, SLOW);
  await expect(canvas.getByText('Start')).toBeVisible();
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
  args: { ...TARGET_CURSOR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playAim(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    await playAim(canvas);
  },
};

export const NoParallax: Story = {
  args: { ...TARGET_CURSOR_DEFAULTS, parallaxOn: false, spinDuration: 1 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playAim(canvas);
    await expect(stage).toHaveAttribute('data-parallax', 'false');
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...TARGET_CURSOR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('target-cursor-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('target-cursor')).toBeVisible();
    await playPause(canvas, stage);
  },
};
