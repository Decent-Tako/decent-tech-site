import { Checkbox } from '@base-ui/react/checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Specimen } from './Specimen';

const meta = {
  title: 'UI primitives/Checkbox',
  parameters: {
    docs: {
      description: {
        component:
          'Package `@base-ui/react` 1.8.0. Licence MIT. Docs https://base-ui.com/react/components/checkbox . Source https://github.com/mui/base-ui . Prior use: Base UI used. Academy need: selection.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Themed: Story = {
  render: () => (
    <Specimen themed note="Light theme: checked fill #DEF54F.">
      <label className="gallery-label">
        <Checkbox.Root defaultChecked className="gallery-checkbox">
          <Checkbox.Indicator>x</Checkbox.Indicator>
        </Checkbox.Root>
        Enable notices
      </label>
    </Specimen>
  ),
};

export const Default: Story = {
  render: () => (
    <Specimen note="Upstream Checkbox.Root inside a label.">
      <label className="gallery-label">
        <Checkbox.Root className="gallery-checkbox">
          <Checkbox.Indicator>x</Checkbox.Indicator>
        </Checkbox.Root>
        Enable notices
      </label>
    </Specimen>
  ),
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole('checkbox', { name: 'Enable notices' });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
