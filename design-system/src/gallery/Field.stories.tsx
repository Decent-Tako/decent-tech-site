import { Field } from '@base-ui/react/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Specimen } from './Specimen';

const meta = {
  title: 'UI primitives/Field',
  parameters: {
    docs: {
      description: {
        component:
          'Package `@base-ui/react` 1.8.0. Licence MIT. Docs https://base-ui.com/react/components/field . Source https://github.com/mui/base-ui . Prior use: Base UI was imported in the motion library. Academy need: labelled form fields.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Themed: Story = {
  render: () => (
    <Specimen themed note="Light theme: focus outline #0035B1 on Field.Control.">
      <Field.Root className="gallery-field">
        <Field.Label>Name</Field.Label>
        <Field.Control className="gallery-input" name="name" placeholder="Required" />
      </Field.Root>
    </Specimen>
  ),
};

export const Default: Story = {
  render: () => (
    <Specimen note="Upstream Field.Root, Field.Label, and Field.Control.">
      <Field.Root className="gallery-field">
        <Field.Label>Name</Field.Label>
        <Field.Control name="name" placeholder="Required" />
      </Field.Root>
    </Specimen>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Name');
    await userEvent.type(input, 'Ada');
    await expect(input).toHaveValue('Ada');
  },
};
