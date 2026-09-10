import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../brand/fontFallback';
import { IconComparison } from './catalog';
import { ACADEMY_CONCEPTS } from './concepts';
import { ICON_PACKAGES } from './packages';

const meta = {
  title: 'Icon resources/Comparison',
  parameters: {
    docs: {
      description: {
        component:
          'Side-by-side Academy concepts from lucide-react 1.43.0, @phosphor-icons/react 2.1.10, @tabler/icons-react 3.46.0, and @heroicons/react 2.2.0. Imports are package-native. Missing concepts stay empty.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Themed: Story = {
  render: () => <IconComparison themed labelled />,
};

export const Default: Story = {
  render: () => <IconComparison labelled />,
  play: async ({ canvas }) => {
    // Labels render in Brand Sans. A fallback would misreport the brand.
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);

    for (const pkg of ICON_PACKAGES) {
      await expect(canvas.getByRole('columnheader', { name: pkg.packageName })).toBeVisible();
    }

    for (const concept of ACADEMY_CONCEPTS) {
      await expect(canvas.getByRole('rowheader', { name: concept.label })).toBeVisible();
    }

    await expect(canvas.getByRole('img', { name: 'lucide-react Rocket' })).toBeVisible();
    await expect(
      canvas.getByRole('img', { name: '@phosphor-icons/react RocketIcon' }),
    ).toBeVisible();
    await expect(canvas.getByRole('img', { name: '@tabler/icons-react IconRocket' })).toBeVisible();
    await expect(
      canvas.getByRole('img', { name: '@heroicons/react RocketLaunchIcon' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('status', { name: 'lucide-react has no Running icon' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('status', { name: '@heroicons/react has no Running icon' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('status', { name: '@heroicons/react has no Sport icon' }),
    ).toBeVisible();
  },
};
