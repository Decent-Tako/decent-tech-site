import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFormsBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS, TAB_SELECT_DEFAULTS } from './source';
import { TabSelect } from './TabSelect';

const meta = {
  title: 'Motion examples/Forms/Tab select',
  component: TabSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-tab-select in Academy branding.',
          'The article page prints the Get started stub. Full source is the live View source chunk https://examples.motion.dev/assets/index-iBmF1DB8.js .',
          'Mechanism: the selected tab renders layoutId="selected-indicator". onTapStart is keyboard-accessible. whileTap and whileFocus set the press and focus targets.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-tab-select . Live https://examples.motion.dev/react/tab-select . Repository https://github.com/motiondivision/motion .',
          'Upstream tap scale 0.9, tabs Home React Vue Svelte. Academy tabs are Start Learn Tools Challenge. Replay returns to the first tab.',
        ].join(' '),
      },
    },
  },
  args: { ...TAB_SELECT_DEFAULTS },
  argTypes: {
    tapScale: {
      control: { type: 'range', min: 0.7, max: 1, step: 0.05 },
      description: 'whileTap scale. Upstream default 0.9.',
    },
    tabs: {
      control: 'object',
      description: 'Tab labels. Upstream default Home, React, Vue, Svelte.',
    },
    initialIndex: {
      control: { type: 'range', min: 0, max: 3, step: 1 },
      description: 'Selected index on mount. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof TabSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...TAB_SELECT_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
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
    await playReplay(canvas, 'tab-select');
    await expect(canvas.getByRole('tab', { name: 'Start' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const ChallengeWeek: Story = {
  args: {
    ...TAB_SELECT_DEFAULTS,
    initialIndex: 3,
    tapScale: 0.8,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByRole('tab', { name: 'Challenge' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.click(canvas.getByRole('tab', { name: 'Tools' }));
    await waitFor(() => {
      expect(canvas.getByRole('tab', { name: 'Tools' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
    await playReplay(canvas, 'tab-select');
    await expect(canvas.getByRole('tab', { name: 'Challenge' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const ReducedMotion: Story = {
  args: { ...TAB_SELECT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    await userEvent.click(canvas.getByRole('tab', { name: 'Tools' }));
    await waitFor(() => {
      expect(canvas.getByRole('tab', { name: 'Tools' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
  },
};
