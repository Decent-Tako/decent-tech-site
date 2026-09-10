import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { FEATURES, PHOTOS } from '../../pages/content';
import {
  effectiveOpacity,
  expectFullColorPhotos,
} from '../../pages/storySupport';
import { InView } from '../vendor/motion-primitives/in-view';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type InViewMargin = '0px' | '0px 0px -80px 0px' | '0px 0px -200px 0px';

type InViewArgs = {
  once: boolean;
  duration: number;
  hiddenY: number;
  hiddenBlur: number;
  margin: InViewMargin;
  as: 'div' | 'article' | 'section';
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/in-view`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/in-view.json`;

const FIXED_NOTE =
  'Stage height is 22rem so the card starts below the fold. children is Academy copy, not a free control. as stays a semantic tag. Replay remounts this one-shot.';

function variantsOf(args: InViewArgs) {
  return {
    hidden: {
      opacity: 0,
      y: args.hiddenY,
      filter: `blur(${args.hiddenBlur}px)`,
    },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  };
}

function viewOptionsOf(args: InViewArgs) {
  return { margin: args.margin };
}

function InViewFrame({ children }: { children: ReactNode }) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="In view"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={FIXED_NOTE}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div
        key={nonce}
        className="mp-scroll"
        data-testid="in-view-stage"
        data-run={String(nonce)}
        role="region"
        tabIndex={0}
        aria-label="Scroll to reveal Academy copy"
      >
        <p className="mp-scroll__lead">Scroll down</p>
        <div className="mp-inview-spacer" />
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function WeekLedeView(args: InViewArgs) {
  return (
    <InViewFrame>
      <InView
        as={args.as}
        once={args.once}
        variants={variantsOf(args)}
        viewOptions={viewOptionsOf(args)}
        transition={{ duration: args.duration, ease: 'easeInOut' }}
      >
        <article
            className="mp-inview-card"
            data-testid="in-view-target"
            data-inview-item="true"
          >
          <span className="mp-inview-kicker">Week 0 · Set Up</span>
          <h3>Set the goal to $3,000.</h3>
          <p>
            Find your Buddy and Team. Publish the page. Nothing here unlocks
            until the page is live.
          </p>
        </article>
      </InView>
    </InViewFrame>
  );
}

function AcademyWeeksView(args: InViewArgs) {
  return (
    <InViewFrame>
      {FEATURES.map((feature, index) => (
        <InView
          key={feature.id}
          as={args.as}
          once={args.once}
          variants={variantsOf(args)}
          viewOptions={viewOptionsOf(args)}
          transition={{
            duration: args.duration,
            delay: index * 0.08,
            ease: 'easeInOut',
          }}
        >
          <article
            className="mp-inview-week"
            data-inview-item="true"
            data-testid={index === 0 ? 'in-view-target' : undefined}
          >
            <span className="mp-inview-kicker">
              {feature.kicker} · {feature.index}
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.copy}</p>
          </article>
        </InView>
      ))}
    </InViewFrame>
  );
}

const GRID_PHOTOS = [
  PHOTOS.hero,
  PHOTOS.crowd,
  PHOTOS.community,
  PHOTOS.run,
] as const;

function PhotoGridView(args: InViewArgs) {
  return (
    <InViewFrame>
      <div className="mp-inview-grid">
        {GRID_PHOTOS.map((photo, index) => (
          <InView
            key={photo.src}
            as={args.as}
            once={args.once}
            variants={variantsOf(args)}
            viewOptions={viewOptionsOf(args)}
            transition={{
              duration: args.duration,
              delay: index * 0.06,
              ease: 'easeOut',
            }}
          >
            <figure
              className="mp-inview-photo"
              data-inview-item="true"
              data-testid={index === 0 ? 'in-view-target' : undefined}
            >
              <img data-photo src={photo.src} alt={photo.alt} />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          </InView>
        ))}
      </div>
    </InViewFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/In view',
  component: WeekLedeView,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    once: false,
    duration: 0.3,
    hiddenY: 100,
    hiddenBlur: 4,
    margin: '0px 0px -80px 0px',
    as: 'div',
  },
  argTypes: {
    once: {
      control: 'boolean',
      description:
        'Local isViewed flag after the first complete. Not useInView({ once }). Upstream undefined.',
    },
    duration: {
      control: { type: 'range', min: 0.15, max: 1.2, step: 0.05 },
      description: 'transition.duration in seconds. Docs example 0.3.',
    },
    hiddenY: {
      control: { type: 'range', min: 0, max: 160, step: 10 },
      description: 'variants.hidden.y. Docs example 100.',
    },
    hiddenBlur: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'variants.hidden filter blur in px. Docs example 4.',
    },
    margin: {
      control: 'select',
      options: ['0px', '0px 0px -80px 0px', '0px 0px -200px 0px'],
      description: 'viewOptions.margin. Docs example 0px 0px -200px 0px.',
    },
    as: {
      control: 'select',
      options: ['div', 'article', 'section'],
      description: 'Upstream default div.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives in-view, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/in-view . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/in-view.tsx . Mechanism: useInView(ref, viewOptions) swaps hidden and visible variants. once sets a local isViewed flag in onAnimationComplete. Extra runtime: none. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof WeekLedeView>;

export default meta;
type Story = StoryObj<typeof meta>;

async function sweepStage(stage: HTMLElement) {
  const max = Math.max(0, stage.scrollHeight - stage.clientHeight);
  const step = Math.max(48, Math.floor(stage.clientHeight / 2));
  for (let y = 0; y <= max; y += step) {
    stage.scrollTop = y;
    await new Promise((resolve) => window.setTimeout(resolve, 60));
  }
  stage.scrollTop = max;
}

async function waitUntilItemsVisible(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await waitFor(
    () => {
      const items = canvas.getByTestId('in-view-stage').querySelectorAll(
        '[data-inview-item]',
      );
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(effectiveOpacity(item as HTMLElement)).toBeGreaterThan(0.9);
      }
    },
    { timeout: 6000 },
  );
}

async function playInView(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const stage = canvas.getByTestId('in-view-stage');
  canvas.getByTestId('in-view-target').scrollIntoView({ block: 'center' });
  await waitFor(
    () => {
      expect(
        effectiveOpacity(canvas.getByTestId('in-view-target')),
      ).toBeGreaterThan(0.9);
    },
    { timeout: 4000 },
  );
  await sweepStage(stage);
  await waitUntilItemsVisible(canvas);
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  const region = canvas.getByTestId('in-view-stage');
  canvas.getByTestId('in-view-target').scrollIntoView({ block: 'center' });
  await waitFor(
    () => {
      expect(
        effectiveOpacity(canvas.getByTestId('in-view-target')),
      ).toBeGreaterThan(0.9);
    },
    { timeout: 4000 },
  );
  await sweepStage(region);
  await waitUntilItemsVisible(canvas);
}

export const WeekLede: Story = {
  render: (args) => <WeekLedeView {...(args as InViewArgs)} />,
  play: async ({ canvas }) => {
    await playInView(canvas);
  },
};

export const AcademyWeeks: Story = {
  args: {
    once: true,
    duration: 0.35,
    hiddenY: 72,
    hiddenBlur: 0,
    margin: '0px 0px -80px 0px',
    as: 'article',
  },
  render: (args) => <AcademyWeeksView {...(args as InViewArgs)} />,
  play: async ({ canvas }) => {
    await playInView(canvas);
    await expect(
      canvas.getByRole('heading', { name: 'Start' }),
    ).toBeVisible();
  },
};

export const PhotoGrid: Story = {
  args: {
    once: true,
    duration: 0.4,
    hiddenY: 48,
    hiddenBlur: 6,
    margin: '0px 0px -80px 0px',
    as: 'div',
  },
  render: (args) => <PhotoGridView {...(args as InViewArgs)} />,
  play: async ({ canvas }) => {
    await playInView(canvas);
    await expectFullColorPhotos(canvas);
  },
};
