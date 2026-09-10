import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { Button } from './ui/button';
import { withShadcn } from './withShadcn';

const meta = {
  title: 'Styled systems/shadcn/Button',
  component: Button,
  decorators: [withShadcn],
  parameters: {
    docs: {
      description: {
        component:
          'Package `shadcn` 4.21.0, style `base-nova`. Licence MIT. Docs https://ui.shadcn.com/docs/components/button . Source https://github.com/shadcn-ui/ui . Builds on `@base-ui/react/button` 1.8.0. CLI copy, not a runtime.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Submit' },
  render: (args) => (
    <Frame note="Official shadcn Button default variant. No Academy theme.">
      <Button {...args} />
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(button);
    await expect(button).toBeEnabled();
  },
};
