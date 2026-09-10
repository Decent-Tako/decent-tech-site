import { useState } from 'react';
import { Button, Modal, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Frame } from '../Frame';
import { withMantine } from './withMantine';

const meta = {
  title: 'Styled systems/Mantine/Dialog',
  decorators: [withMantine],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@mantine/core` 9.6.0. Licence MIT. Docs https://mantine.dev/core/modal/ . Source https://github.com/mantinedev/mantine . Modal is the dialog surface.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function NoticesModal() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button color="dark" onClick={() => setOpened(true)}>
        View notices
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Notices"
        transitionProps={{ duration: 0 }}
      >
        <Text>You are caught up.</Text>
        <Button color="dark" mt="md" onClick={() => setOpened(false)}>
          Close
        </Button>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => (
    <Frame note="Official Mantine Modal. Default provider, no Academy theme.">
      <NoticesModal />
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
