import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { ColorTokens } from './ColorTokens';
import { BRAND_COLORS, CONTRAST_PAIRS } from './colors';
import {
  contrastRatio,
  formatRatio,
  normalizeHex,
  readCssColor,
  wcagAaNormal,
} from './contrast';

const meta = {
  title: 'Brand/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Locked Academy color tokens. Neutrals at rest. Blue #0035B1 on hover and :focus-visible with white type. Yellow #DEF54F on press and confirmed success with ink type.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Tokens: Story = {
  render: () => <ColorTokens />,
  play: async ({ canvas }) => {
    for (const token of BRAND_COLORS) {
      await expect(canvas.getAllByText(token.hex).length).toBeGreaterThan(0);
      await expect(normalizeHex(readCssColor(token.name))).toBe(token.hex);
    }

    for (const pair of CONTRAST_PAIRS) {
      const ratio = contrastRatio(pair.foregroundHex, pair.backgroundHex);
      await expect(canvas.getAllByText(formatRatio(ratio)).length).toBeGreaterThan(0);
      if (pair.bodyText) {
        await expect(wcagAaNormal(ratio)).toBe(true);
      }
    }

    await expect(canvas.getByText('#0170B9')).toBeInTheDocument();
    await expect(canvas.getByText(/filter: none/)).toBeInTheDocument();
  },
};
