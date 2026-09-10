import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { BounceEasing } from './BounceEasing';
import { BOUNCE_EASING_DEFAULTS } from './defaults';
import { expectHookBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Bounce easing',
  component: BounceEasing,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-bounce-easing in Academy branding.',
          'The upstream demo exports no props. Controls lift bounce duration, stiffness, and damping.',
          'Mechanism: layout on the ball. On uses spring stiffness 700 damping 30. Off uses duration 1.2 with easeOutBounce.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-transitions .',
          'Example https://motion.dev/examples/react-bounce-easing .',
          'Live https://examples.motion.dev/react/bounce-easing .',
          'Toggle-driven. Replay remounts to In the street. Caption is Challenge week.',
        ].join(' '),
      },
    },
  },
  args: {
    ...BOUNCE_EASING_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    bounceDuration: {
      control: { type: 'range', min: 0.4, max: 2.4, step: 0.1 },
      description: 'Off tween duration in seconds. Upstream default 1.2.',
    },
    stiffness: {
      control: { type: 'range', min: 120, max: 1200, step: 20 },
      description: 'On spring stiffness. Upstream default 700.',
    },
    damping: {
      control: { type: 'range', min: 8, max: 80, step: 2 },
      description: 'On spring damping. Upstream default 30.',
    },
    initialOn: {
      control: 'boolean',
      description: 'Start in the street. Upstream default true.',
    },
    onLabel: { control: 'text' },
    offLabel: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof BounceEasing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...BOUNCE_EASING_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('In the street')).toBeVisible();
    const toggle = canvas.getByRole('button', { name: /Challenge week/ });
    await expect(toggle).toHaveAttribute('data-is-on', 'true');
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(toggle).toHaveAttribute('data-is-on', 'false');
    });
    await expect(canvas.getByText('At rest')).toBeVisible();
    await playReplay(canvas, 'hk-bounce-easing');
    await waitFor(() => {
      expect(
        canvas.getByRole('button', { name: /Challenge week/ }),
      ).toHaveAttribute('data-is-on', 'true');
    });
  },
};

export const SoftSpring: Story = {
  args: {
    ...BOUNCE_EASING_DEFAULTS,
    stiffness: 180,
    damping: 18,
    onLabel: 'Challenge week live',
    offLabel: 'Before 19 October',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Challenge week live')).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: /Challenge week/ }),
    );
    await waitFor(() => {
      expect(canvas.getByText('Before 19 October')).toBeVisible();
    });
    await playReplay(canvas, 'hk-bounce-easing');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...BOUNCE_EASING_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectHookBrand(canvas);
    await expect(canvas.getByTestId('hk-bounce-easing')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByText('In the street')).toBeVisible();
  },
};
