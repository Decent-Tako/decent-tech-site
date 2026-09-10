import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { ScrollVelocity } from './ScrollVelocity';
import { VELOCITY_DEFAULTS } from './scrollVelocityData';

const meta = {
  title: 'Motion examples/Scroll velocity',
  component: ScrollVelocity,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-scroll-velocity-linked-offset in Academy branding.',
          'The upstream demo exports no props. ScrollVelocity() is a page with hardcoded spring and wave values.',
          'Mechanism: useMotionValue holds wheel offset, useSpring smooths it, useVelocity drives a wave spring, wrap loops x, and useTransform writes translate3d plus rotateY(-50deg).',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-velocity . Example https://motion.dev/examples/react-scroll-velocity-linked-offset . Repository https://github.com/motiondivision/motion .',
          'motion-plus ScrambleText is paid. Motion animate() scrambles the hover label. Controls lift the hardcoded spring and wave values. RotateY, perspective, and plane height stay fixed; see the page note.',
        ].join(' '),
      },
      story: { inline: true, height: '760px' },
    },
  },
  tags: ['autodocs'],
  args: {
    ...VELOCITY_DEFAULTS,
  },
  argTypes: {
    stiffness: {
      control: { type: 'range', min: 40, max: 260, step: 10 },
      description: 'Scroll spring stiffness. Upstream default 100.',
    },
    damping: {
      control: { type: 'range', min: 10, max: 60, step: 1 },
      description: 'Scroll spring damping. Upstream default 30.',
    },
    mass: {
      control: { type: 'range', min: 0.2, max: 1.5, step: 0.1 },
      description: 'Scroll spring mass. Upstream default 0.5.',
    },
    waveStiffness: {
      control: { type: 'range', min: 80, max: 500, step: 10 },
      description: 'Wave spring stiffness. Upstream default 300.',
    },
    waveDamping: {
      control: { type: 'range', min: 8, max: 40, step: 1 },
      description: 'Wave spring damping. Upstream default 20.',
    },
    waveMass: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
      description: 'Wave spring mass. Upstream default 0.3.',
    },
    waveDivisor: {
      control: { type: 'range', min: 20, max: 120, step: 5 },
      description: 'velocity / divisor. Upstream default 50.',
    },
    waveAmount: {
      control: { type: 'range', min: 1, max: 16, step: 1 },
      description: 'Wave amplitude multiplier. Upstream default 5.',
    },
    hoverStiffness: {
      control: { type: 'range', min: 120, max: 600, step: 20 },
      description: 'Hover lift stiffness. Upstream default 400.',
    },
    hoverDamping: {
      control: { type: 'range', min: 10, max: 40, step: 1 },
      description: 'Hover lift damping. Upstream default 25.',
    },
    planeWidth: {
      control: { type: 'range', min: 220, max: 400, step: 10 },
      description: 'Plane width in pixels. Upstream default 320.',
    },
    planeGap: {
      control: { type: 'range', min: -160, max: 40, step: 10 },
      description: 'Gap added to width. Upstream default -80.',
    },
    totalPlanes: {
      control: { type: 'range', min: 8, max: 26, step: 1 },
      description: 'Plane count. Upstream default 26.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof ScrollVelocity>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectBrand(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expectFullColorPhotos(canvas);
}

async function expectSweep(canvasElement: HTMLElement) {
  await waitFor(
    () => {
      const stage = canvasElement.querySelector(
        '[data-testid="scroll-velocity-stage"]',
      );
      expect(stage).not.toBeNull();
      expect(Number(stage?.getAttribute('data-scroll-x'))).not.toBe(0);
    },
    { timeout: 4000 },
  );
}

export const Default: Story = {
  args: {
    ...VELOCITY_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Scroll velocity' }),
    ).toBeVisible();
    await expect(canvas.getByText('Uncomfortable Academy')).toBeVisible();
    await expect(canvas.getByText('Six weeks')).toBeVisible();
    await expectSweep(canvasElement);
    await expectBrand(canvas);
    const before = canvasElement
      .querySelector('[data-testid="scroll-velocity-stage"]')
      ?.getAttribute('data-run-id');
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => {
      expect(
        canvasElement
          .querySelector('[data-testid="scroll-velocity-stage"]')
          ?.getAttribute('data-run-id'),
      ).not.toBe(before);
    });
    await expectSweep(canvasElement);
  },
};

export const HeavyWave: Story = {
  args: {
    ...VELOCITY_DEFAULTS,
    waveAmount: 14,
    waveDivisor: 25,
    waveStiffness: 180,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expectSweep(canvasElement);
    await expectBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expectSweep(canvasElement);
  },
};

export const TightSpring: Story = {
  args: {
    ...VELOCITY_DEFAULTS,
    stiffness: 220,
    damping: 18,
    mass: 0.3,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expectSweep(canvasElement);
    await expectBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expectSweep(canvasElement);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...VELOCITY_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Scroll velocity' }),
    ).toBeVisible();
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await expect(canvas.getByText('Challenge')).toBeVisible();
    const stage = canvasElement.querySelector(
      '[data-testid="scroll-velocity-stage"]',
    );
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expectBrand(canvas);
  },
};
