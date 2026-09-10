import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { NavigationPage } from './NavigationPage';
import { expectFullColorPhotos, expectLiveWordmark } from './storySupport';

const meta = {
  title: 'Pages/Navigation',
  component: NavigationPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Package `motion` 13.2.0. Licence MIT. Rebuild of Motion shared layout navigation with `layoutId` and `AnimatePresence`. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-shared-layout-animation .',
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof NavigationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expectLiveWordmark(canvas);
    await waitFor(() => {
      const learn = canvas.getByRole('heading', { name: 'Learn' });
      expect(learn).toBeVisible();
      expect(getComputedStyle(learn.closest('article')!).opacity).toBe('1');
    });
    const rail = within(canvas.getByRole('navigation', { name: 'Academy areas' }));
    const toolsButton = rail.getByRole('button', { name: 'Tools' });
    await userEvent.click(toolsButton);
    await waitFor(() => {
      const tools = canvas.getByRole('heading', { name: 'Tools' });
      expect(tools).toBeVisible();
      expect(getComputedStyle(tools.closest('article')!).opacity).toBe('1');
      expect(canvas.queryByRole('heading', { name: 'Learn' })).toBeNull();
    });
    await expect(toolsButton).toHaveAttribute('aria-current', 'page');
    await expectFullColorPhotos(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { reducedMotion: 'always' },
  play: async ({ canvas, userEvent }) => {
    const rail = within(canvas.getByRole('navigation', { name: 'Academy areas' }));
    const eventsButton = rail.getByRole('button', { name: 'Events' });
    await userEvent.click(eventsButton);
    await waitFor(() => {
      expect(canvas.getByRole('heading', { name: 'Events' })).toBeVisible();
    });
    const heading = canvas.getByRole('heading', { name: 'Events' });
    await expect(getComputedStyle(heading).opacity).not.toBe('0');
    await expectFullColorPhotos(canvas);
  },
};
