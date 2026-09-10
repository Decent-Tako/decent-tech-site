import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { LayoutAnchor } from './LayoutAnchor';
import { expectLayoutBrand, playReplay } from './play';
import { LAYOUT_ANCHOR_DEFAULTS, REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Layout anchor',
  component: LayoutAnchor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-layout-anchor in Academy branding.',
          'Mechanism: parent layout grows the card. Child layoutAnchor pins a 0–1 point on the $3,000 chip. layoutDependency is the expanded flag. Child delay waits for the parent.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-layout-anchor . Live https://examples.motion.dev/react/layout-anchor . Repository https://github.com/motiondivision/motion .',
          'Upstream default is anchorX 0.5, anchorY 0.5, duration 0.8, delay 0.8, parent 150 to 300, child 70 to 100. Replay remounts collapsed.',
        ].join(' '),
      },
    },
  },
  args: { ...LAYOUT_ANCHOR_DEFAULTS },
  argTypes: {
    anchorX: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'layoutAnchor.x. 0 left, 1 right. Upstream default 0.5.',
    },
    anchorY: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'layoutAnchor.y. 0 top, 1 bottom. Upstream default 0.5.',
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Parent and child duration in seconds. Upstream default 0.8.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.1 },
      description: 'Child delay in seconds. Upstream default 0.8.',
    },
    collapsedSize: {
      control: { type: 'range', min: 120, max: 240, step: 10 },
      description: 'Parent size when collapsed. Upstream default 150.',
    },
    expandedSize: {
      control: { type: 'range', min: 220, max: 420, step: 10 },
      description: 'Parent size when expanded. Upstream default 300.',
    },
    childCollapsed: {
      control: { type: 'range', min: 48, max: 120, step: 2 },
      description: 'Goal chip size when collapsed. Upstream default 70.',
    },
    childExpanded: {
      control: { type: 'range', min: 72, max: 160, step: 2 },
      description: 'Goal chip size when expanded. Upstream default 100.',
    },
    heading: { control: 'text' },
    goal: { control: 'text' },
    copy: { control: 'text' },
    photoSrc: { control: 'text' },
    photoAlt: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof LayoutAnchor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...LAYOUT_ANCHOR_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    const card = canvas.getByRole('button', { name: /Week 0.*Expand/ });
    await expect(card).toHaveAttribute('data-expanded', 'false');
    await userEvent.click(card);
    await waitFor(() => {
      expect(card).toHaveAttribute('data-expanded', 'true');
    });
    await expect(canvas.getByText('$3,000')).toBeVisible();
    await playReplay(canvas, 'layout-anchor');
    await expect(
      canvas.getByRole('button', { name: /Week 0.*Expand/ }),
    ).toHaveAttribute('data-expanded', 'false');
  },
};

export const TopLeftAnchor: Story = {
  args: {
    ...LAYOUT_ANCHOR_DEFAULTS,
    anchorX: 0,
    anchorY: 0,
    heading: 'Challenge week',
    copy: 'Do it in public. 19–28 October 2026.',
    photoSrc: PHOTOS.night.src,
    photoAlt: PHOTOS.night.alt,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: /Challenge week.*Expand/ }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole('button', { name: /Challenge week/ }),
      ).toHaveAttribute('data-expanded', 'true');
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...LAYOUT_ANCHOR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(
      canvas.getByRole('button', { name: /Week 0/ }),
    ).toHaveAttribute('data-expanded', 'false');
  },
};
