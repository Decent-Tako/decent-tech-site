import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ClerkConditionalField } from './ClerkConditionalField';
import { expectFormsBrand, playReplay, waitUntilOpaque } from './play';
import { CLERK_CONDITIONAL_DEFAULTS, REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Forms/Clerk conditional field',
  component: ClerkConditionalField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-clerk-conditional-field in Academy branding.',
          'Mechanism: resize() writes the measured field height. animate={{ height }} opens the box. Inner AnimatePresence fades the password field.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/resize . Example https://motion.dev/examples/react-clerk-conditional-field . Live https://examples.motion.dev/react/clerk-conditional-field . Repository https://github.com/motiondivision/motion .',
          'Upstream MotionConfig spring bounce 0.3, visualDuration 0.4, y -8. Replay remounts the form.',
        ].join(' '),
      },
    },
  },
  args: { ...CLERK_CONDITIONAL_DEFAULTS },
  argTypes: {
    bounce: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
      description: 'Spring bounce. Upstream default 0.3.',
    },
    visualDuration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Spring visualDuration. Upstream default 0.4.',
    },
    yFrom: {
      control: { type: 'range', min: -24, max: 0, step: 1 },
      description: 'Password enter y in pixels. Upstream default -8.',
    },
    heading: { control: 'text' },
    description: { control: 'text' },
    emailLabel: { control: 'text' },
    passwordLabel: { control: 'text' },
    submitLabel: { control: 'text' },
    doneLabel: { control: 'text' },
    emailPlaceholder: { control: 'text' },
    passwordPlaceholder: { control: 'text' },
    initialOpen: {
      control: 'boolean',
      description: 'Open the password field on mount. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof ClerkConditionalField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...CLERK_CONDITIONAL_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    await userEvent.type(
      canvas.getByLabelText('Email'),
      'you@wearemobilise.org',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(canvas.getByLabelText('Password')).toBeVisible();
    });
    await playReplay(canvas, 'clerk-conditional-field');
    await expect(canvas.queryByLabelText('Password')).toBeNull();
  },
};

export const OpenOnMount: Story = {
  args: {
    ...CLERK_CONDITIONAL_DEFAULTS,
    initialOpen: true,
    heading: 'Create a Circle password',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await waitFor(() => {
      expect(canvas.getByLabelText('Password')).toBeVisible();
    });
    await waitUntilOpaque(canvas.getByLabelText('Password'));
    await playReplay(canvas, 'clerk-conditional-field');
    await waitFor(() => {
      expect(canvas.getByLabelText('Password')).toBeVisible();
    });
    await waitUntilOpaque(canvas.getByLabelText('Password'));
  },
};

export const ReducedMotion: Story = {
  args: { ...CLERK_CONDITIONAL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    await userEvent.type(
      canvas.getByLabelText('Email'),
      'you@wearemobilise.org',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(canvas.getByLabelText('Password')).toBeVisible();
    });
  },
};
