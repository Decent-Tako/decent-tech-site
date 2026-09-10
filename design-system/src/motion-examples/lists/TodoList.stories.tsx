import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectListsBrand, playReplay } from './play';
import {
  REDUCED_MOTION_OPTIONS,
  TODO_LIST_DEFAULTS,
} from './source';
import { TodoList } from './TodoList';

const meta = {
  title: 'Motion examples/Todo list',
  component: TodoList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-todo-list in Academy branding.',
          'The article page marks this example plus:true and prints a stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: Reorder.Group plus Reorder.Item on axis y. animate(boxShadow) on drag. motion.span opacity and scaleX strikethrough on toggle. A 600 ms timeout moves completed items to the bottom.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-reorder .',
          'Example https://motion.dev/examples/react-todo-list .',
          'Live https://examples.motion.dev/react/todo-list .',
          'Chunk https://examples.motion.dev/assets/index-DU7YM8Py.js .',
          'Week 0 actions. Replay restores the open checklist.',
        ].join(' '),
      },
    },
  },
  args: {
    ...TODO_LIST_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    textDuration: {
      control: { type: 'range', min: 0.1, max: 1.2, step: 0.05 },
      description: 'Text opacity duration in seconds. Upstream default 0.4.',
    },
    strikeDuration: {
      control: { type: 'range', min: 0.1, max: 1.2, step: 0.05 },
      description: 'Strikethrough scaleX duration. Upstream default 0.4.',
    },
    completeDelay: {
      control: { type: 'range', min: 0, max: 1500, step: 50 },
      description:
        'Milliseconds before a completed item moves to the bottom. Upstream 600.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectListsBrand(canvas);
    await expect(canvas.getByText('Publish the page')).toBeVisible();
    const checkbox = canvas.getByRole('checkbox', {
      name: /Publish the page/,
    });
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(checkbox);
    await waitFor(() => {
      expect(
        canvas.getByRole('checkbox', { name: /Publish the page/ }),
      ).toHaveAttribute('aria-checked', 'true');
    });
    await playReplay(canvas, 'todo-list');
    await expect(
      canvas.getByRole('checkbox', { name: /Publish the page/ }),
    ).toHaveAttribute('aria-checked', 'false');
  },
};

export const FastStrike: Story = {
  args: {
    ...TODO_LIST_DEFAULTS,
    strikeDuration: 0.15,
    textDuration: 0.15,
    completeDelay: 200,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Find Buddy')).toBeVisible();
    await userEvent.click(
      canvas.getByRole('checkbox', { name: /Find Buddy/ }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole('checkbox', { name: /Find Buddy/ }),
      ).toHaveAttribute('aria-checked', 'true');
    });
    await playReplay(canvas, 'todo-list');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...TODO_LIST_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectListsBrand(canvas);
    await expect(canvas.getByTestId('todo-list')).toHaveAttribute(
      'data-running',
      'false',
    );
  },
};
