import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { CHARACTERS_REMAINING_DEFAULTS } from './defaults';
import { playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { CharactersRemaining } from './CharactersRemaining';

const meta = {
  title: 'Motion examples/Characters remaining',
  component: CharactersRemaining,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-characters-remaining in Academy branding.',
          'Mechanism: useAnimate plus transform() maps remaining count to colour and spring velocity, then animate scale 1 with stiffness 700 and damping 80.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-animate .',
          'Example https://motion.dev/examples/react-characters-remaining .',
          'Live https://examples.motion.dev/react/characters-remaining .',
          'maxLength 12 matches upstream. Colour map uses blue and ink, not pink. The field is a page title.',
        ].join(' '),
      },
    },
  },
  args: {
    ...CHARACTERS_REMAINING_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    maxLength: {
      control: { type: 'range', min: 8, max: 80, step: 1 },
      description: 'Character cap. Upstream default 12.',
    },
    lowAt: {
      control: { type: 'range', min: 0, max: 8, step: 1 },
      description: 'Remaining count that maps to lowColor. Upstream 2.',
    },
    restAt: {
      control: { type: 'range', min: 2, max: 20, step: 1 },
      description: 'Remaining count that maps to restColor and skips the spring. Upstream 6.',
    },
    velocityAtZero: {
      control: { type: 'range', min: 0, max: 80, step: 5 },
      description: 'Spring velocity at 0 remaining. Upstream 50.',
    },
    velocityAtFive: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Spring velocity at 5 remaining. Upstream 0.',
    },
    stiffness: {
      control: { type: 'range', min: 200, max: 1200, step: 20 },
      description: 'Spring stiffness. Upstream 700.',
    },
    damping: {
      control: { type: 'range', min: 20, max: 120, step: 5 },
      description: 'Spring damping. Upstream 80.',
    },
    lowColor: {
      control: 'color',
      description: 'Colour at lowAt remaining. Upstream #ff008c. Academy #0035B1.',
    },
    restColor: {
      control: 'color',
      description: 'Colour at restAt remaining. Upstream #ccc. Academy #212121.',
    },
    label: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof CharactersRemaining>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const field = canvas.getByLabelText('Page title');
    await expect(canvas.getByText('12')).toBeVisible();
    await userEvent.type(field, 'hello');
    await waitFor(() => {
      expect(canvas.getByText('7')).toBeVisible();
    });
    await userEvent.type(field, '!!!!!!');
    await waitFor(() => {
      expect(canvas.getByText('1')).toBeVisible();
    });
    await playReplay(canvas, 'text-characters-remaining');
    await expect(canvas.getByLabelText('Page title')).toHaveValue('');
    await expect(canvas.getByText('12')).toBeVisible();
  },
};

export const ThankYou: Story = {
  args: {
    ...CHARACTERS_REMAINING_DEFAULTS,
    maxLength: 80,
    restAt: 20,
    label: 'Thank-you note',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Thank-you note')).toBeVisible();
    await expect(canvas.getByText('80')).toBeVisible();
    await playReplay(canvas, 'text-characters-remaining');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...CHARACTERS_REMAINING_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByLabelText('Page title')).toBeVisible();
    await expect(canvas.getByText('12')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  },
};
