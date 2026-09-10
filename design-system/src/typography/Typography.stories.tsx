import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { contrastRatio, formatRatio, wcagAaNormal } from '../brand/contrast';
import { assertFaceNotFallback } from '../brand/fontFallback';
import { ContrastReport } from './ContrastReport';
import { ElementRange as ElementRangeView } from './ElementRange';
import { LongArticle } from './LongArticle';
import { LongReference } from './LongReference';
import { MEASURES, countWords, type Measure } from './measure';
import { PROSE_CONTRAST_PAIRS } from './pairs';

function ElementRangeStory({ measure = 'default' }: { measure?: Measure }) {
  const [current, setCurrent] = useState<Measure>(measure);
  return <ElementRangeView measure={current} onMeasureChange={setCurrent} />;
}

function ArticleStory({ measure = 'default' }: { measure?: Measure }) {
  const [current, setCurrent] = useState<Measure>(measure);
  return <LongArticle measure={current} onMeasureChange={setCurrent} />;
}

function ReferenceStory({ measure = 'default' }: { measure?: Measure }) {
  const [current, setCurrent] = useState<Measure>(measure);
  return <LongReference measure={current} onMeasureChange={setCurrent} />;
}

async function expectAcademyProse(
  canvas: {
    getByRole: (
      role: string,
      options?: { name?: string | RegExp; level?: number },
    ) => HTMLElement;
    getByText: (text: string | RegExp) => HTMLElement;
    findByText: (text: string | RegExp) => Promise<HTMLElement>;
  },
  heading: string,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);

  const article = canvas.getByRole('article');
  await expect(article).toHaveClass('prose');
  await expect(article).toHaveClass('prose-academy');
  await expect(article).toHaveClass(MEASURES.default.className);
  await expect(getComputedStyle(article).fontFamily).toMatch(/Brand Sans/);
  const headingNode = canvas.getByRole('heading', { name: heading, level: 1 });
  await expect(headingNode).toBeVisible();
  await expect(getComputedStyle(headingNode).color).toBe('rgb(33, 33, 33)');
  const quote = article.querySelector('blockquote');
  await expect(quote).not.toBeNull();
  await expect(getComputedStyle(quote!).borderInlineStartWidth).not.toBe('0px');
  await expect(canvas.getByText('Default: 65ch')).toBeVisible();
  await canvas.findByText('Line length 65 characters.');

  await userEvent.click(canvas.getByRole('radio', { name: 'Narrow' }));
  await expect(article).toHaveClass(MEASURES.narrow.className);
  await expect(canvas.getByText('Narrow: 50ch')).toBeVisible();
  await canvas.findByText('Line length 50 characters.');

  await userEvent.click(canvas.getByRole('radio', { name: 'Wide' }));
  await expect(article).toHaveClass(MEASURES.wide.className);
  await expect(canvas.getByText('Wide: 80ch')).toBeVisible();
  await canvas.findByText('Line length 80 characters.');

  await userEvent.click(canvas.getByRole('radio', { name: 'Default' }));
  await expect(article).toHaveClass(MEASURES.default.className);
  await expect(canvas.getByText('Default: 65ch')).toBeVisible();
  await canvas.findByText('Line length 65 characters.');
}

const meta = {
  title: 'Typography/Reading',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Package @tailwindcss/typography 0.5.20. Licence MIT. Official plugin for prose classes on HTML we do not control. Docs https://github.com/tailwindlabs/tailwindcss-typography . Tailwind 4 register path is @plugin "@tailwindcss/typography".',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Contrast: Story = {
  parameters: { layout: 'padded' },
  render: () => <ContrastReport />,
  play: async ({ canvas }) => {
    for (const pair of PROSE_CONTRAST_PAIRS) {
      const ratio = contrastRatio(pair.foregroundHex, pair.backgroundHex);
      await expect(canvas.getAllByText(formatRatio(ratio)).length).toBeGreaterThan(0);
      if (pair.bodyText) {
        await expect(wcagAaNormal(ratio)).toBe(true);
      }
    }
    await expect(
      canvas.getByText('Quiet token. Not used for prose text.'),
    ).toBeInTheDocument();
  },
};

export const ElementRange: Story = {
  name: 'Element range',
  render: () => <ElementRangeStory />,
  play: async ({ canvas }) => {
    await expectAcademyProse(canvas, 'Academy reading elements');
    await expect(canvas.getByRole('heading', { name: 'Headings sit on ink', level: 2 })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Links, hover, and press', level: 3 })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Inline code and keyboard', level: 4 })).toBeVisible();
    await expect(
      canvas.getByText(/Keep the line short enough to say out loud/),
    ).toBeVisible();
    await expect(canvas.getByRole('table')).toBeVisible();
    await expect(canvas.getByRole('separator')).toBeVisible();
    await expect(canvas.getByText('prose prose-academy')).toBeVisible();
  },
};

export const Article: Story = {
  render: () => <ArticleStory />,
  play: async ({ canvas }) => {
    await expectAcademyProse(canvas, 'Set up before the first session');
    const words = countWords(canvas.getByRole('article').textContent ?? '');
    await expect(words).toBeGreaterThanOrEqual(800);
    await expect(canvas.getByRole('figure')).toBeVisible();
    await expect(
      canvas.getByText(/Keep the line short enough to say out loud/),
    ).toBeVisible();
  },
};

export const Reference: Story = {
  render: () => <ReferenceStory />,
  play: async ({ canvas }) => {
    await expectAcademyProse(canvas, 'Academy reading reference');
    const words = countWords(canvas.getByRole('article').textContent ?? '');
    await expect(words).toBeGreaterThanOrEqual(800);
    await expect(canvas.getAllByRole('table').length).toBeGreaterThanOrEqual(2);
    await expect(canvas.getByText(/2783885/)).toBeVisible();
    await expect(
      canvas.getByRole('link', { name: '@plugin' }),
    ).toHaveAttribute(
      'href',
      'https://tailwindcss.com/docs/functions-and-directives#plugin-directive',
    );
  },
};
