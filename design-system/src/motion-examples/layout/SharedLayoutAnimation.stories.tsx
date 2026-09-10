import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectLayoutBrand, playReplay } from './play';
import { SharedLayoutAnimation } from './SharedLayoutAnimation';
import {
  PRESENCE_MODE_OPTIONS,
  REDUCED_MOTION_OPTIONS,
  SHARED_LAYOUT_DEFAULTS,
} from './source';

const meta = {
  title: 'Motion examples/Shared layout animation',
  component: SharedLayoutAnimation,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-shared-layout-animation in Academy branding.',
          'Mechanism: the selected tab renders layoutId="underline". The projection stack moves that underline from the old tab box to the new one. Panel copy uses AnimatePresence mode wait.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-shared-layout-animation . Live https://examples.motion.dev/react/shared-layout-animation . Repository https://github.com/motiondivision/motion .',
          'Upstream default is three tabs, layoutId underline, presence mode wait, duration 0.2, y 10. Replay remounts on Start.',
        ].join(' '),
      },
    },
  },
  args: { ...SHARED_LAYOUT_DEFAULTS },
  argTypes: {
    presenceMode: {
      control: 'select',
      options: [...PRESENCE_MODE_OPTIONS],
      description: 'AnimatePresence mode. Upstream default wait.',
    },
    duration: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Panel enter and exit duration. Upstream default 0.2.',
    },
    yFrom: {
      control: { type: 'range', min: 0, max: 40, step: 2 },
      description: 'Panel enter y in pixels. Upstream default 10.',
    },
    heading: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof SharedLayoutAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...SHARED_LAYOUT_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await expect(canvas.getByRole('tab', { name: 'Start' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.click(canvas.getByRole('tab', { name: 'Learn' }));
    await waitFor(() => {
      expect(canvas.getByRole('tab', { name: 'Learn' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
    await waitFor(() => {
      expect(
        canvas.getByText(
          'Complete one week at a time. Finish the action before the next week opens.',
        ),
      ).toBeVisible();
    });
    await playReplay(canvas, 'shared-layout-animation');
    await expect(canvas.getByRole('tab', { name: 'Start' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await waitFor(() => {
      const panels = canvas.getAllByRole('tabpanel');
      expect(panels).toHaveLength(1);
      expect(Number(getComputedStyle(panels[0]).opacity)).toBeGreaterThan(0.99);
    });
  },
};

export const SyncPresence: Story = {
  args: {
    ...SHARED_LAYOUT_DEFAULTS,
    presenceMode: 'sync',
    duration: 0.45,
    heading: 'Challenge week tabs',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await userEvent.click(canvas.getByRole('tab', { name: 'Challenge' }));
    await waitFor(() => {
      expect(canvas.getByRole('tab', { name: 'Challenge' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => {
      const panels = canvas.getAllByRole('tabpanel');
      expect(panels).toHaveLength(1);
      expect(Number(getComputedStyle(panels[0]).opacity)).toBeGreaterThan(0.99);
    });
  },
};

export const ReducedMotion: Story = {
  args: { ...SHARED_LAYOUT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await expect(canvas.getByText('Academy weeks')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(canvas.getByRole('tab', { name: 'Start' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};
