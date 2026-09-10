import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { CommandPalette } from './CommandPalette';
import { expectListsBrand, playReplay } from './play';
import {
  COMMAND_PALETTE_DEFAULTS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Command palette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-command-palette in Academy branding.',
          'The article page marks this example plus:true and prints a stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: AnimatePresence mounts backdrop opacity and a dialog spring on y and scale. Inner AnimatePresence mode popLayout plus layout filters the list.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animate-presence .',
          'Example https://motion.dev/examples/react-command-palette .',
          'Live https://examples.motion.dev/react/command-palette .',
          'Chunk https://examples.motion.dev/assets/index-Dc9b4dWa.js .',
          'dialogOffsetY default -16. backdropDuration default 0.2. Replay closes the palette.',
        ].join(' '),
      },
    },
  },
  args: {
    ...COMMAND_PALETTE_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    dialogOffsetY: {
      control: { type: 'range', min: -100, max: 100, step: 1 },
      description: 'Dialog enter y offset. Upstream default -16.',
    },
    backdropDuration: {
      control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 },
      description: 'Backdrop opacity duration. Upstream default 0.2.',
    },
    dialogStiffness: {
      control: { type: 'range', min: 80, max: 800, step: 10 },
      description: 'Dialog spring stiffness. Upstream default 500.',
    },
    dialogDamping: {
      control: { type: 'range', min: 8, max: 80, step: 1 },
      description: 'Dialog spring damping. Upstream default 35.',
    },
    itemStiffness: {
      control: { type: 'range', min: 80, max: 800, step: 10 },
      description: 'Filtered item spring stiffness. Upstream default 400.',
    },
    itemDamping: {
      control: { type: 'range', min: 8, max: 80, step: 1 },
      description: 'Filtered item spring damping. Upstream default 30.',
    },
    placeholder: { control: 'text' },
    triggerLabel: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectListsBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: /Search Academy commands/ }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole('dialog', { name: 'Academy commands' }),
      ).toBeVisible();
    });
    await expect(canvas.getByText('Find Buddy')).toBeVisible();
    await playReplay(canvas, 'command-palette');
    await waitFor(() => {
      expect(
        canvas.queryByRole('dialog', { name: 'Academy commands' }),
      ).toBeNull();
    });
  },
};

export const Filtered: Story = {
  args: {
    ...COMMAND_PALETTE_DEFAULTS,
    dialogOffsetY: -40,
    backdropDuration: 0.35,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /Search Academy commands/ }),
    );
    const dialog = await waitFor(() =>
      canvas.getByRole('dialog', { name: 'Academy commands' }),
    );
    const input = canvas.getByLabelText('Search Academy commands');
    await userEvent.type(input, 'buddy');
    await expect(canvas.getByRole('option', { name: /Find Buddy/ })).toBeVisible();
    await waitFor(() => {
      expect(
        canvas.queryByRole('option', { name: /Publish the page/ }),
      ).toBeNull();
    });
    await expect(dialog).toBeVisible();
    await playReplay(canvas, 'command-palette');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...COMMAND_PALETTE_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectListsBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: /Search Academy commands/ }),
    );
    await expect(
      canvas.getByRole('dialog', { name: 'Academy commands' }),
    ).toBeVisible();
  },
};
