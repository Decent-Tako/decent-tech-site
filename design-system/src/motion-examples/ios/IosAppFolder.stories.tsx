import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { effectiveOpacity } from '../../pages/storySupport';
import { IosAppFolder } from './IosAppFolder';
import { expectIosBrand, expectIosPhotos, playReplay } from './play';
import {
  FOLDER_DEFAULTS,
  PRESENCE_MODE_OPTIONS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/iOS App Folder',
  component: IosAppFolder,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-ios-app-folder in Academy branding.',
          'The article page marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: AnimatePresence mode=popLayout plus layoutId shared layout. Tiles without layoutId spring from the measured mini-grid centre.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations .',
          'Example https://motion.dev/examples/react-ios-app-folder .',
          'Live https://examples.motion.dev/react/ios-app-folder .',
          'Replay opens the folder. Close folder returns to the grid.',
        ].join(' '),
      },
    },
  },
  args: { ...FOLDER_DEFAULTS },
  argTypes: {
    title: { control: 'text' },
    items: { control: 'object' },
    stiffness: {
      control: { type: 'range', min: 80, max: 500, step: 10 },
      description: 'Layout spring stiffness. Upstream default 200.',
    },
    damping: {
      control: { type: 'range', min: 8, max: 60, step: 1 },
      description: 'Layout spring damping. Upstream default 22.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Layout spring bounce. Upstream default 0.',
    },
    titleStiffness: {
      control: { type: 'range', min: 80, max: 500, step: 10 },
      description: 'Open title spring stiffness. Upstream default 200.',
    },
    titleDamping: {
      control: { type: 'range', min: 8, max: 60, step: 1 },
      description: 'Open title spring damping. Upstream default 19.',
    },
    presenceMode: {
      control: 'select',
      options: [...PRESENCE_MODE_OPTIONS],
      description: 'AnimatePresence mode. Upstream default popLayout.',
    },
    initialOpen: {
      control: 'boolean',
      description: 'Open the folder on mount. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof IosAppFolder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...FOLDER_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expectIosPhotos(canvas);
    await expect(
      canvas.getByRole('button', { name: 'Open Uncomfortable Academy folder' }),
    ).toBeVisible();
    await playReplay(canvas, 'ios-app-folder');
    await waitFor(
      () => {
        const dialog = canvas.getByRole('dialog', {
          name: 'Uncomfortable Academy',
        });
        expect(dialog).toBeVisible();
        expect(effectiveOpacity(dialog)).toBe(1);
        const goal = canvas.getByText('Goal');
        expect(goal).toBeVisible();
        expect(effectiveOpacity(goal)).toBe(1);
      },
      { timeout: 4000 },
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Close folder' }));
    await waitFor(
      () => {
        expect(canvas.queryByRole('dialog')).toBeNull();
        expect(
          canvas.getByRole('button', {
            name: 'Open Uncomfortable Academy folder',
          }),
        ).toBeVisible();
      },
      { timeout: 4000 },
    );
  },
};

export const OpenOnMount: Story = {
  args: {
    ...FOLDER_DEFAULTS,
    initialOpen: true,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await waitFor(() => {
      const dialog = canvas.getByRole('dialog', {
        name: 'Uncomfortable Academy',
      });
      expect(dialog).toBeVisible();
      expect(effectiveOpacity(dialog)).toBe(1);
    });
    await playReplay(canvas, 'ios-app-folder');
    await waitFor(
      () => {
        const dialog = canvas.getByRole('dialog', {
          name: 'Uncomfortable Academy',
        });
        expect(dialog).toBeVisible();
        expect(effectiveOpacity(dialog)).toBe(1);
      },
      { timeout: 4000 },
    );
  },
};

export const ReducedMotion: Story = {
  args: { ...FOLDER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expect(
      canvas.getByRole('button', { name: 'Open Uncomfortable Academy folder' }),
    ).toBeVisible();
  },
};
