import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { withShadcn } from './withShadcn';

const meta = {
  title: 'Styled systems/shadcn/Field',
  decorators: [withShadcn],
  parameters: {
    docs: {
      description: {
        component:
          'Package `shadcn` 4.21.0, style `base-nova`. Licence MIT. Docs https://ui.shadcn.com/docs/components/field . Source https://github.com/shadcn-ui/ui . Builds on `@base-ui/react/input` 1.8.0.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official shadcn Field and Input. No Academy theme.">
      <Field>
        <FieldLabel htmlFor="shadcn-name">Name</FieldLabel>
        <Input id="shadcn-name" name="name" placeholder="Required" />
      </Field>
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Name');
    await userEvent.type(input, 'Ada');
    await expect(input).toHaveValue('Ada');
  },
};
