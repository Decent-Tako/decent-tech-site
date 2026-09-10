import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Frame } from '../Frame';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { withShadcn } from './withShadcn';

const meta = {
  title: 'Styled systems/shadcn/Dialog',
  decorators: [withShadcn],
  parameters: {
    docs: {
      description: {
        component:
          'Package `shadcn` 4.21.0, style `base-nova`. Licence MIT. Docs https://ui.shadcn.com/docs/components/dialog . Source https://github.com/shadcn-ui/ui . Builds on `@base-ui/react/dialog` 1.8.0.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official shadcn Dialog. No Academy theme.">
      <Dialog>
        <DialogTrigger render={<Button />}>View notices</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Notices</DialogTitle>
            <DialogDescription>You are caught up.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button />}>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Frame>
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
