import { Button, Dialog, Flex } from '@radix-ui/themes';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Frame } from '../Frame';
import { withRadixTheme } from './withRadixTheme';

const meta = {
  title: 'Styled systems/Radix Themes/Dialog',
  decorators: [withRadixTheme],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@radix-ui/themes` 3.3.0. Licence MIT. Docs https://www.radix-ui.com/themes/docs/components/dialog . Source https://github.com/radix-ui/themes . Builds on `radix-ui` Dialog.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official Radix Themes Dialog. Default Theme, no Academy theme.">
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>View notices</Button>
        </Dialog.Trigger>
        <Dialog.Content maxWidth="24rem">
          <Dialog.Title>Notices</Dialog.Title>
          <Dialog.Description>You are caught up.</Dialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button>Close</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Frame>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View notices' }));
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole('dialog', { name: 'Notices' });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(page.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(page.queryByRole('dialog', { name: 'Notices' })).toBeNull(),
    );
  },
};
