import { Collapsible } from '@base-ui/react/collapsible';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Specimen } from './Specimen';

const meta = {
  title: 'UI primitives/Collapsible',
  parameters: {
    docs: {
      description: {
        component:
          'Package `@base-ui/react` 1.8.0. Licence MIT. Docs https://base-ui.com/react/components/collapsible . Source https://github.com/mui/base-ui . Prior use: React Aria disclosure was evaluated. Academy need: disclosure.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Themed: Story = {
  render: () => (
    <Specimen themed note="Light theme: trigger hover #0035B1 and press #DEF54F.">
      <Collapsible.Root>
        <Collapsible.Trigger className="gallery-trigger">Recovery keys</Collapsible.Trigger>
        <Collapsible.Panel>
          <p>alien-bean-pasta</p>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Specimen>
  ),
};

export const Default: Story = {
  render: () => (
    <Specimen note="Upstream Collapsible.Trigger and Collapsible.Panel.">
      <Collapsible.Root>
        <Collapsible.Trigger>Recovery keys</Collapsible.Trigger>
        <Collapsible.Panel>
          <p>alien-bean-pasta</p>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Specimen>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Recovery keys' });
    await expect(canvas.queryByText('alien-bean-pasta')).toBeNull();
    await userEvent.click(trigger);
    await expect(canvas.getByText('alien-bean-pasta')).toBeVisible();
  },
};
