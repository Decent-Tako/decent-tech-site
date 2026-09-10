import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { FontSpecimens } from './FontSpecimens';
import { assertFaceNotFallback, assertNoBoxOverlap } from './fontFallback';

const meta = {
  title: 'Brand/Fonts',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Brand Sans 400 and 700 are the interface faces. Brand Script 400 is the wordmark script. Both are aliases bound in tokens.css to SIL OFL 1.1 files.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Specimens: Story = {
  render: () => <FontSpecimens />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Brand Sans Regular')).toBeInTheDocument();
    await expect(canvas.getByText('Brand Sans Bold')).toBeInTheDocument();
    await expect(canvas.getByText('Brand Script Regular')).toBeInTheDocument();
    await expect(canvas.getAllByText(/SIL Open Font License 1.1/).length).toBe(3);
    await expect(
      canvas.getByRole('link', { name: '/fonts/brand-script-OFL.txt' }),
    ).toHaveAttribute('href', '/fonts/brand-script-OFL.txt');
    await expect(canvas.getByText('16px Complete the current week before the next lesson opens.')).toBeInTheDocument();
    await expect(canvas.getByText('176px Find the edge.')).toBeInTheDocument();
    await expect(canvas.getByText('20px Academy')).toBeInTheDocument();

    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await assertFaceNotFallback('Brand Script', 400);

    const specimenLines = document.querySelectorAll('[data-specimen-line]');
    expect(specimenLines.length).toBe(13);
    const blocks = document.querySelectorAll(
      '.brand-doc h2, .brand-font-face, [data-specimen-line]',
    );
    assertNoBoxOverlap([...blocks]);
  },
};
