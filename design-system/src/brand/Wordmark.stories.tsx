import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Wordmark } from './Wordmark';

const meta = {
  title: 'Brand/Wordmark',
  component: Wordmark,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Immutable live-text lockup. Brand Sans 700 uppercase Uncomfortable over Brand Script 400 Academy, right-aligned script. Do not move, scale, skew, rotate, or interpolate weight. The mark inherits color.',
      },
    },
  },
  args: {
    size: 'small',
    href: '#top',
    label: 'Uncomfortable Academy',
  },
  decorators: [
    (Story, context) => {
      const inverse = context.name === 'On Ink';
      return (
        <div className={inverse ? 'brand-plate brand-plate--ink' : 'brand-plate'}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectLiveText(
  canvas: {
    getByRole: (role: string, options?: { name?: string }) => HTMLElement;
  },
  name = 'Uncomfortable Academy',
) {
  const mark = canvas.getByRole('link', { name });
  await expect(mark.querySelector('img')).toBeNull();
  await expect(mark).toHaveClass('wordmark');
  await expect(mark).toHaveTextContent('Uncomfortable');
  await expect(mark).toHaveTextContent('Academy');
  const lead = mark.querySelector('.wordmark__lead');
  const script = mark.querySelector('.wordmark__script');
  await expect(lead).not.toBeNull();
  await expect(script).not.toBeNull();
  await expect(getComputedStyle(lead as Element).textTransform).toBe('uppercase');
  await expect(['700', 'bold']).toContain(getComputedStyle(lead as Element).fontWeight);
  await expect(['400', 'normal']).toContain(getComputedStyle(script as Element).fontWeight);
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await expectLiveText(canvas);
    const mark = canvas.getByRole('link', { name: 'Uncomfortable Academy' });
    await expect(getComputedStyle(mark).color).toBe('rgb(33, 33, 33)');
  },
};

export const Static: Story = {
  args: {
    href: null,
  },
  play: async ({ canvas }) => {
    const mark = canvas.getByText('Uncomfortable').closest('.wordmark');
    await expect(mark).not.toBeNull();
    await expect(mark).toHaveTextContent('Academy');
    await expect(mark?.querySelector('img')).toBeNull();
    await expect(mark?.tagName).toBe('SPAN');
  },
};

export const OnInk: Story = {
  play: async ({ canvas }) => {
    await expectLiveText(canvas);
    const mark = canvas.getByRole('link', { name: 'Uncomfortable Academy' });
    await expect(getComputedStyle(mark).color).toBe('rgb(255, 255, 255)');
  },
};

export const Tiny: Story = {
  args: { size: 'tiny' },
  play: async ({ canvas }) => {
    await expectLiveText(canvas);
  },
};

export const Hero: Story = {
  args: { size: 'hero' },
  play: async ({ canvas }) => {
    await expectLiveText(canvas);
  },
};

export const Footer: Story = {
  args: { size: 'footer' },
  play: async ({ canvas }) => {
    await expectLiveText(canvas);
  },
};
