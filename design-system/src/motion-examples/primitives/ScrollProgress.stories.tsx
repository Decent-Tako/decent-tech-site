import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ARTICLE } from '../../pages/content';
import { ScrollProgress } from '../vendor/motion-primitives/scroll-progress';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type ProgressArgs = {
  stiffness: number;
  damping: number;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/scroll-progress`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/scroll-progress.json`;

const FIXED_NOTE =
  'Bar height is 0.5rem so scaleX is visible. Upstream default is h-1. containerRef is this 22rem stage, not a free control. Replay sets scrollTop to 0. Pause is not a prop.';

function scaleXOf(el: Element | null): number {
  if (!el) return 0;
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === 'none') return 0;
  const match = transform.match(/matrix\(([^)]+)\)/);
  if (!match) return 0;
  return Number(match[1].split(',')[0]);
}

function ArticleBody() {
  return (
    <article className="mp-article">
      <p className="mp-inview-kicker">{ARTICLE.kicker}</p>
      <h2>{ARTICLE.title}</h2>
      <p>{ARTICLE.dek}</p>
      {ARTICLE.sections.map((section) => (
        <section key={section.heading}>
          <h3>{section.heading}</h3>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}

function ProgressHost({
  stiffness,
  damping,
  barClass,
}: ProgressArgs & { barClass: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nonce, setNonce] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.scrollTop = 0;
    setPercent(0);
  }, [nonce]);

  return (
    <PrimitiveFrame
      title="Scroll progress"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={FIXED_NOTE}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div
        key={nonce}
        ref={containerRef}
        className="mp-scroll"
        data-testid="scroll-progress-stage"
        data-percent={String(percent)}
        role="region"
        tabIndex={0}
        aria-label="Week 0 article"
        onScroll={() => {
          const node = containerRef.current;
          if (!node) return;
          const max = node.scrollHeight - node.clientHeight;
          setPercent(max <= 0 ? 0 : Math.round((node.scrollTop / max) * 100));
        }}
      >
        <div className="mp-progress">
          <ScrollProgress
            containerRef={containerRef}
            springOptions={{ stiffness, damping }}
            className={barClass}
          />
        </div>
        <ArticleBody />
      </div>
    </PrimitiveFrame>
  );
}

function WeekArticleView(args: ProgressArgs) {
  return <ProgressHost {...args} barClass="mp-progress__bar" />;
}

function GradientBarView(args: ProgressArgs) {
  return (
    <ProgressHost
      {...args}
      barClass="mp-progress__bar mp-progress__bar--gradient"
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Scroll progress',
  component: WeekArticleView,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    stiffness: 200,
    damping: 50,
  },
  argTypes: {
    stiffness: {
      control: { type: 'range', min: 40, max: 400, step: 10 },
      description: 'springOptions.stiffness. Upstream default 200.',
    },
    damping: {
      control: { type: 'range', min: 10, max: 80, step: 2 },
      description: 'springOptions.damping. Upstream default 50.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives scroll-progress, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/scroll-progress . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/scroll-progress.tsx . Mechanism: useScroll({ container }) writes scrollYProgress. useSpring maps it to scaleX on a motion.div. Extra runtime: none. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof WeekArticleView>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playProgress(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const stage = canvas.getByTestId('scroll-progress-stage');
  const bar = canvasElement.querySelector('.mp-progress__bar');
  expect(bar).not.toBeNull();
  stage.scrollTop = stage.scrollHeight;
  await waitFor(
    () => {
      expect(scaleXOf(bar)).toBeGreaterThan(0.4);
    },
    { timeout: 4000 },
  );
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(
    () => {
      expect(scaleXOf(canvasElement.querySelector('.mp-progress__bar'))).toBeLessThan(
        0.15,
      );
    },
    { timeout: 4000 },
  );
}

export const WeekArticle: Story = {
  render: (args) => <WeekArticleView {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await playProgress(canvas, canvasElement);
    await expect(
      canvas.getByRole('heading', { name: ARTICLE.title }),
    ).toBeVisible();
  },
};

export const GradientBar: Story = {
  args: {
    stiffness: 120,
    damping: 28,
  },
  render: (args) => <GradientBarView {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await playProgress(canvas, canvasElement);
  },
};
