import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { Folder } from './Folder';
import { FOLDER_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Folder',
  component: Folder,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Folder, commit 625f250, 2026-09-10. Mechanism: a click toggles the open class and CSS transforms fan three papers out of the folder. Licence MIT + Commons Clause. Page https://reactbits.dev/components/folder . No extra runtime. Pause freezes the CSS transitions. Replay remounts the folder closed.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FOLDER_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Folder cover colour. Brand accent blue. Upstream default #5227FF.',
    },
    size: {
      control: { type: 'range', min: 0.5, max: 2.5, step: 0.1 },
      description: 'Scale of the folder mark. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always removes the open and close transitions.',
    },
  },
} satisfies Meta<typeof Folder>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Folder' })).toBeVisible();
}

async function playOpen(canvas: Canvas) {
  const stage = canvas.getByTestId('folder-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Open folder' }));
  await expect(canvas.getByRole('button', { name: 'Close folder' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(canvas.getByText('Start')).toBeVisible();
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...FOLDER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOpen(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(canvas.getByRole('button', { name: 'Open folder' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

export const LargeYellow: Story = {
  args: { ...FOLDER_DEFAULTS, size: 1.6, color: '#DEF54F' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOpen(canvas);
    await expect(stage).toHaveAttribute('data-size', '1.6');
    await expect(stage).toHaveAttribute('data-color', '#DEF54F');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FOLDER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOpen(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPauseResume(canvas, stage);
  },
};
