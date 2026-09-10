import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ConicGradientPointer } from './ConicGradientPointer';
import { movePointer } from './playSupport';
import { CONIC_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Conic gradient pointer',
  component: ConicGradientPointer,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Rebuild of motion.dev react-conic-gradient-pointer. Mechanism: useMotionValue gradientX/Y and useTransform building conic-gradient at the pointer. Package motion 13.2.0, licence MIT. Example https://motion.dev/examples/react-conic-gradient-pointer . Continuous. Pause ignores later moves.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CONIC_DEFAULTS },
  argTypes: {
    width: {
      control: { type: 'range', min: 200, max: 520, step: 10 },
      description: 'Box width in pixels. Upstream default 400.',
    },
    height: {
      control: { type: 'range', min: 200, max: 520, step: 10 },
      description: 'Box height in pixels. Upstream default 400.',
    },
    radius: {
      control: { type: 'range', min: 0, max: 200, step: 2 },
      description: 'Border radius in pixels. Upstream default 50.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof ConicGradientPointer>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playBrand(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Conic gradient pointer' }),
  ).toBeVisible();
}

export const Default: Story = {
  args: { ...CONIC_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const box = canvas.getByTestId('conic-box');
    movePointer(box, 80, 60);
    await waitFor(() => {
      expect(box.dataset.gx).toBeTruthy();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(box).toHaveAttribute('data-paused', 'true');
  },
};

export const Compact: Story = {
  args: {
    ...CONIC_DEFAULTS,
    width: 260,
    height: 260,
    radius: 24,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    movePointer(canvas.getByTestId('conic-box'), 40, 40);
    await waitFor(() => {
      expect(canvas.getByTestId('conic-box').dataset.gx).toBeTruthy();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  },
};

export const ReducedMotion: Story = {
  args: {
    ...CONIC_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(canvas.getByTestId('conic-box')).toHaveAttribute(
      'data-paused',
      'true',
    );
  },
};
