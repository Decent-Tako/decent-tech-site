import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { Stepper } from './Stepper';
import { STEPPER_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Stepper, commit 625f250, 2026-09-10. Mechanism: Continue slides the next step in from the left with a spring and fills the connector. Licence MIT + Commons Clause. Page https://reactbits.dev/components/stepper . Runtime motion 13.2.0. Pause shows the current step with no spring. Replay remounts at the first step.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...STEPPER_DEFAULTS },
  argTypes: {
    initialStep: {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Step shown on mount, 1-based. Upstream default 1.',
    },
    backButtonText: {
      control: 'text',
      description: 'Label of the back control. Upstream default Back.',
    },
    nextButtonText: {
      control: 'text',
      description: 'Label of the next control. Upstream default Continue.',
    },
    disableStepIndicators: {
      control: 'boolean',
      description: 'Turn off click on the circles. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows each step with no spring.',
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Stepper' })).toBeVisible();
}

async function playNext(canvas: Canvas, fromStep: string) {
  const stage = canvas.getByTestId('stepper-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
  await waitFor(() => {
    expect(stage).not.toHaveAttribute('data-step', fromStep);
  }, SLOW);
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
  args: { ...STEPPER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getByText('Week 0')).toBeVisible();
    const stage = await playNext(canvas, '1');
    await waitFor(() => {
      expect(canvas.getByText('Six weeks')).toBeVisible();
    }, SLOW);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-step', '1');
    }, SLOW);
  },
};

export const StartAtLearn: Story = {
  args: { ...STEPPER_DEFAULTS, initialStep: 2, disableStepIndicators: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('stepper-stage');
    await expect(stage).toHaveAttribute('data-step', '2');
    await expect(stage).toHaveAttribute('data-indicators', 'false');
    await expect(canvas.getByText('Six weeks')).toBeVisible();
    await playNext(canvas, '2');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...STEPPER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('stepper-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playNext(canvas, '1');
    await playPauseResume(canvas, stage);
  },
};
