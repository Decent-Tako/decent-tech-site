import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { MagneticFilings } from './MagneticFilings';
import { movePointer } from './playSupport';
import { FILINGS_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Magnetic filings',
  component: MagneticFilings,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Rebuild of motion.dev react-magnetic-filings. Mechanism: usePointerPosition plus useTransform atan2 rotate. Live source https://examples.motion.dev/assets/index-CdEeTlkY.js . Package motion 13.2.0. Extra runtime: Academy plusAdapter because motion-plus is exclusive to members. Continuous. Pause freezes the last angle. size is the upstream prop.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FILINGS_DEFAULTS },
  argTypes: {
    size: {
      control: { type: 'range', min: 4, max: 24, step: 1 },
      description: 'Grid size. Upstream default 16 (256 filings).',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof MagneticFilings>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playBrand(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Magnetic filings' }),
  ).toBeVisible();
  await expect(canvas.getByText('Inner circle. Map 100 people.')).toBeVisible();
}

export const Default: Story = {
  args: { ...FILINGS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const grid = canvas.getByTestId('filings-grid');
    const filing = canvas.getAllByTestId('filing')[0];
    const before = getComputedStyle(filing).transform;
    movePointer(grid, 20, 20);
    await waitFor(() => {
      expect(getComputedStyle(filing).transform).not.toBe(before);
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(grid).toHaveAttribute('data-paused', 'true');
  },
};

export const CoarseGrid: Story = {
  args: {
    ...FILINGS_DEFAULTS,
    size: 8,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getAllByTestId('filing')).toHaveLength(64);
    movePointer(canvas.getByTestId('filings-grid'), 80, 80);
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  },
};

export const ReducedMotion: Story = {
  args: {
    ...FILINGS_DEFAULTS,
    size: 8,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getByTestId('filings-grid')).toHaveAttribute(
      'data-paused',
      'true',
    );
  },
};
