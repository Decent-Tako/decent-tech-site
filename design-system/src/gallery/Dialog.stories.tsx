import { Dialog } from '@base-ui/react/dialog';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Specimen } from './Specimen';

const meta = {
  title: 'UI primitives/Dialog',
  parameters: {
    docs: {
      description: {
        component:
          'Package `@base-ui/react` 1.8.0. Licence MIT. Docs https://base-ui.com/react/components/dialog . Source https://github.com/mui/base-ui . Prior use: Base UI used. Academy need: modal confirmation.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Themed: Story = {
  render: () => (
    <Specimen themed note="Light theme: dialog surface uses Academy paper and ink.">
      <Dialog.Root>
        <Dialog.Trigger className="gallery-trigger">View notices</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="gallery-backdrop gallery-themed" />
          <Dialog.Popup className="gallery-dialog gallery-themed">
            <Dialog.Title>Notices</Dialog.Title>
            <Dialog.Description>You are caught up.</Dialog.Description>
            <Dialog.Close className="gallery-button">Close</Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Specimen>
  ),
};

export const Default: Story = {
  render: () => (
    <Specimen note="Upstream Dialog.Root with portal, backdrop, title, and close.">
      <Dialog.Root>
        <Dialog.Trigger>View notices</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="gallery-backdrop" />
          <Dialog.Popup className="gallery-dialog">
            <Dialog.Title>Notices</Dialog.Title>
            <Dialog.Description>You are caught up.</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Specimen>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View notices' }));
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole('dialog', { name: 'Notices' });
    await expect(dialog).toBeVisible();
    await userEvent.click(page.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(page.queryByRole('dialog', { name: 'Notices' })).toBeNull(),
    );
  },
};
