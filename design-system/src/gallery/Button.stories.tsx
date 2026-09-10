import { Button } from '@base-ui/react/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Specimen } from './Specimen';

const meta = {
  title: 'UI primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Package `@base-ui/react` 1.8.0. Licence MIT. Docs https://base-ui.com/react/components/button . Source https://github.com/mui/base-ui . React `^17 || ^18 || ^19`. Prior use: motion-library `components/ui/button.tsx`. Academy need: primary actions.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Themed: Story = {
  args: {
    children: 'Submit',
  },
  render: (args) => (
    <Specimen
      themed
      note="Light theme: className only. Hover uses #0035B1. Press uses #DEF54F."
    >
      <Button className="gallery-button" {...args} />
    </Specimen>
  ),
};

export const Default: Story = {
  args: {
    children: 'Submit',
  },
  render: (args) => (
    <Specimen note="Upstream default: Base UI Button with no Academy class names.">
      <Button {...args} />
    </Specimen>
  ),
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(button);
    await expect(button).toBeEnabled();
  },
};
