import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { Cubes } from './Cubes';
import { CUBES_DEFAULTS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Animations/Cubes',
  component: Cubes,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Cubes, commit 625f250, 2026-09-10. Mechanism: CSS 3D cubes tilt toward the pointer with gsap and ripple face colour on click. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/cubes . Runtime gsap 3.15.0. Pause stops auto-tilt. Replay remounts the grid. Face colour default is brand ink #212121 (upstream #120F17).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CUBES_DEFAULTS },
  argTypes: {
    gridSize: {
      control: { type: 'range', min: 3, max: 16, step: 1 },
      description: 'Cubes per side. Upstream default 10.',
    },
    cubeSize: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Pixel size of each cube. 0 keeps the upstream 1fr layout. Upstream default unset.',
    },
    maxAngle: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Tilt in degrees at the pointer. Upstream default 45.',
    },
    radius: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'How many cells around the pointer tilt. Upstream default 3.',
    },
    easing: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'Enter ease. Upstream default power3.out.',
    },
    duration: {
      control: 'object',
      description: 'Enter and leave durations in seconds. Upstream default { enter: 0.3, leave: 0.6 }.',
    },
    cellGap: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Gap in pixels. 0 keeps the upstream 5% gap. Upstream default unset.',
    },
    borderStyle: {
      control: 'text',
      description: 'Face border. Brand paper. Upstream default 1px solid #fff.',
    },
    faceColor: {
      control: 'color',
      description: 'Face fill. Brand ink #212121. Upstream default #120F17.',
    },
    shadow: {
      control: 'boolean',
      description: 'Face box shadow. Upstream default false.',
    },
    autoAnimate: {
      control: 'boolean',
      description: 'Wander the tilt when idle. Upstream default true.',
    },
    rippleOnClick: {
      control: 'boolean',
      description: 'Ripple face colour on click. Upstream default true.',
    },
    rippleColor: {
      control: 'color',
      description: 'Ripple colour. Brand paper #FFFFFF. Upstream default #fff.',
    },
    rippleSpeed: {
      control: { type: 'range', min: 0.25, max: 6, step: 0.25 },
      description: 'Ripple speed scale. Upstream default 2.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows a still grid with no tilt.',
    },
  },
} satisfies Meta<typeof Cubes>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Cubes' })).toBeVisible();
}

async function playRipple(canvas: Canvas) {
  const stage = canvas.getByTestId('cubes-stage');
  const scene = canvas.getByTestId('cubes-scene');
  movePointer(scene, 80, 80);
  await userEvent.click(scene);
  await waitFor(() => {
    expect(Number(stage.dataset.ripples)).toBeGreaterThan(0);
  });
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
  args: { ...CUBES_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playRipple(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playRipple(canvas);
  },
};

export const TightGrid: Story = {
  args: { ...CUBES_DEFAULTS, gridSize: 6, maxAngle: 60, autoAnimate: false },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playRipple(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...CUBES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('cubes-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('cubes-scene').querySelectorAll('.cube').length).toBe(100);
    await playPause(canvas, stage);
  },
};
