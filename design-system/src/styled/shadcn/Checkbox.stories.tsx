import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { Checkbox } from './ui/checkbox';
import { Field, FieldLabel } from './ui/field';
import { withShadcn } from './withShadcn';

const meta = {
  title: 'Styled systems/shadcn/Checkbox',
  decorators: [withShadcn],
  parameters: {
    docs: {
      description: {
        component:
          'Package `shadcn` 4.21.0, style `base-nova`. Licence MIT. Docs https://ui.shadcn.com/docs/components/checkbox . Source https://github.com/shadcn-ui/ui . Builds on `@base-ui/react/checkbox` 1.8.0.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official shadcn Checkbox with FieldLabel. No Academy theme.">
      <Field orientation="horizontal">
        <Checkbox id="shadcn-notices" />
        <FieldLabel htmlFor="shadcn-notices">Enable notices</FieldLabel>
      </Field>
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole('checkbox', { name: 'Enable notices' });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
