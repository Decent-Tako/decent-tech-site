import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { CurvedInput } from './CurvedInput';
import { CURVED_INPUT_DEFAULTS, CURVED_SHADOWS, CURVED_THEMES } from './source';

const meta = {
  title: 'React Bits/Components/Curved Input',
  component: CurvedInput,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Curved Input, commit 625f250, 2026-09-10. Mechanism: an SVG path bends the field, caret, and submit chip along a circular arc. Licence MIT + Commons Clause. Page https://reactbits.dev/components/curved-input . No extra runtime package. Pause hides the blinking caret. Replay remounts the field.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CURVED_INPUT_DEFAULTS },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Initial field text. Upstream default empty.',
    },
    placeholder: {
      control: 'text',
      description: 'Empty-field caption. Academy copy. Upstream default Enter your email.',
    },
    buttonText: {
      control: 'text',
      description: 'Submit chip label. Academy copy. Upstream default Get Started.',
    },
    type: {
      control: 'text',
      description: 'Native input type. Upstream default email.',
    },
    theme: {
      control: 'select',
      options: [...CURVED_THEMES],
      description: 'Palette when colour props are omitted. Upstream default dark.',
    },
    width: {
      control: { type: 'range', min: 240, max: 640, step: 10 },
      description: 'Bar width in pixels. Upstream default 450.',
    },
    bend: {
      control: { type: 'range', min: -80, max: 80, step: 1 },
      description: 'Arc sagitta in pixels. Upstream default 28.',
    },
    height: {
      control: { type: 'range', min: 40, max: 96, step: 1 },
      description: 'Bar thickness in pixels. Upstream default 64.',
    },
    cornerRadius: {
      control: { type: 'range', min: 0, max: 32, step: 1 },
      description: 'End cap radius in pixels. Upstream default 18.',
    },
    borderWidth: {
      control: { type: 'range', min: 0, max: 4, step: 0.25 },
      description: 'Stroke width in pixels. Upstream default 1.5.',
    },
    fontSize: {
      control: { type: 'range', min: 12, max: 24, step: 1 },
      description: 'Path text size in pixels. Upstream default 16.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Bar fill. Brand ink. Upstream theme #1B1722.',
    },
    textColor: {
      control: 'color',
      description: 'Typed text colour. Brand paper. Upstream theme #f5f5f5.',
    },
    placeholderColor: {
      control: 'color',
      description: 'Empty caption colour. Brand quiet. Upstream theme #a1a1aa.',
    },
    borderColor: {
      control: 'color',
      description: 'Bar stroke. Brand line. Upstream theme #392e4e.',
    },
    buttonColor: {
      control: 'color',
      description: 'Submit chip. Brand accent-blue. Upstream theme #A855F7.',
    },
    buttonTextColor: {
      control: 'color',
      description: 'Chip label colour. Brand paper. Upstream theme #ffffff.',
    },
    iconColor: {
      control: 'color',
      description: 'Leading chip. Brand accent-yellow. Upstream uses button colour.',
    },
    shadowSize: {
      control: 'select',
      options: [...CURVED_SHADOWS],
      description: 'Drop shadow size. Upstream default md.',
    },
    shadowColor: {
      control: 'color',
      description: 'Drop shadow colour. Brand ink. Upstream theme #000000.',
    },
    showButton: {
      control: 'boolean',
      description: 'Show the submit chip. Upstream default true.',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show the leading chip. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always flattens the bar to bend 0.',
    },
  },
} satisfies Meta<typeof CurvedInput>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Curved Input' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('curved-input-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

async function playType(canvas: Canvas, text: string) {
  const stage = canvas.getByTestId('curved-input-stage');
  const field = canvas.getByLabelText('Set the goal to $3,000');
  await waitFor(() => {
    expect(stage.querySelector('.curved-input__svg')).toBeTruthy();
  });
  await userEvent.click(stage.querySelector('.curved-input__svg') as Element);
  await userEvent.type(field, text, { skipClick: true });
}

export const Default: Story = {
  args: { ...CURVED_INPUT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('curved-input-stage');
    await expect(canvas.getByText('Week 0 · Set Up. Goal $3,000.')).toBeVisible();
    await playType(canvas, 'team@academy.test');
    await expect(stage).toHaveAttribute('data-value', 'team@academy.test');
    await userEvent.click(canvas.getByRole('button', { name: 'Open Week 0' }));
    await expect(stage).toHaveAttribute('data-submitted', 'team@academy.test');
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-value', '');
    await playType(canvas, 'hi');
    await expect(stage).toHaveAttribute('data-value', 'hi');
  },
};

export const LightFlat: Story = {
  args: { ...CURVED_INPUT_DEFAULTS, theme: 'light', bend: 0, showIcon: false },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('curved-input-stage');
    await expect(stage).toHaveAttribute('data-theme', 'light');
    await playType(canvas, 'Buddy');
    await expect(stage).toHaveAttribute('data-value', 'Buddy');
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...CURVED_INPUT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('curved-input-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playType(canvas, '3000');
    await expect(stage).toHaveAttribute('data-value', '3000');
    await playPause(canvas);
  },
};
