import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Variants } from 'motion/react';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { FEATURES } from '../../pages/content';
import {
  AnimatedGroup,
  type PresetType,
} from '../vendor/motion-primitives/animated-group';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

const PRESETS: PresetType[] = [
  'fade',
  'slide',
  'scale',
  'blur',
  'blur-slide',
  'zoom',
  'flip',
  'bounce',
  'rotate',
  'swing',
];

const WEEK_ZERO_ACTIONS = [
  'Complete the Circle profile',
  'Say hi in the Lounge',
  'Find your Buddy and Team',
  'Set the goal to $3,000',
  'RSVP to Learn + Do',
] as const;

const CUSTOM_VARIANTS: { container: Variants; item: Variants } = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18 },
    },
  },
  item: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
};

type GroupArgs = {
  preset: PresetType;
  as: 'div' | 'ul';
  asChild: 'div' | 'li';
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/animated-group`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/animated-group.json`;

function WeeksView(args: GroupArgs) {
  const [nonce, setNonce] = useState(0);

  return (
    <PrimitiveFrame
      title="Animated group"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote="One-shot stagger. Replay remounts. className is the week grid. variants stay unset so preset runs. Photographs stay full color. Size is three cards at 11rem minimum so the photo and title stay readable."
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div
        data-testid="animated-group"
        data-preset={args.preset}
        data-run={String(nonce)}
      >
        <AnimatedGroup
          key={nonce}
          className="mp-week-grid"
          preset={args.preset}
          as={args.as}
          asChild={args.asChild}
        >
          {FEATURES.slice(0, 3).map((week) => (
            <article key={week.id} className="mp-week-card">
              <img
                src={week.photo.src}
                alt={week.photo.alt}
                data-photo=""
              />
              <div className="mp-week-copy">
                <p className="mp-week-kicker">{week.kicker}</p>
                <h3 className="mp-week-title">{week.title}</h3>
              </div>
            </article>
          ))}
        </AnimatedGroup>
      </div>
    </PrimitiveFrame>
  );
}

function ActionsView(args: GroupArgs) {
  const [nonce, setNonce] = useState(0);

  return (
    <PrimitiveFrame
      title="Animated group"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote="as is ul and asChild is li. That is the upstream list shape. children are the five Week 0 actions. Replay remounts."
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div
        data-testid="animated-group"
        data-preset={args.preset}
        data-as={args.as}
        data-run={String(nonce)}
      >
        <AnimatedGroup
          key={nonce}
          className="mp-actions"
          preset={args.preset}
          as={args.as}
          asChild={args.asChild}
        >
          {WEEK_ZERO_ACTIONS.map((action) => (
            <p key={action} className="mp-action">
              {action}
            </p>
          ))}
        </AnimatedGroup>
      </div>
    </PrimitiveFrame>
  );
}

function CustomView(args: GroupArgs) {
  const [nonce, setNonce] = useState(0);

  return (
    <PrimitiveFrame
      title="Animated group"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote="variants.item slides on x. When variants is set, preset is ignored. Replay remounts. This is the upstream custom-variants example."
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div
        data-testid="animated-group"
        data-preset="custom"
        data-run={String(nonce)}
      >
        <AnimatedGroup
          key={nonce}
          className="mp-week-grid"
          variants={CUSTOM_VARIANTS}
          as={args.as}
          asChild={args.asChild}
        >
          {FEATURES.slice(2, 5).map((week) => (
            <article key={week.id} className="mp-week-card">
              <img
                src={week.photo.src}
                alt={week.photo.alt}
                data-photo=""
              />
              <div className="mp-week-copy">
                <p className="mp-week-kicker">{week.kicker}</p>
                <h3 className="mp-week-title">{week.title}</h3>
              </div>
            </article>
          ))}
        </AnimatedGroup>
      </div>
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Animated group',
  component: WeeksView,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    preset: 'blur-slide',
    as: 'div',
    asChild: 'div',
  },
  argTypes: {
    preset: {
      control: 'select',
      options: PRESETS,
      description:
        'Docs list five names and blur-sm. Source has ten names and blur. Default undefined, then fade opacity only.',
    },
    as: {
      control: 'select',
      options: ['div', 'ul'],
      description: "Container element. Upstream default 'div'.",
    },
    asChild: {
      control: 'select',
      options: ['div', 'li'],
      description: "Child wrapper element. Upstream default 'div'.",
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives animated-group, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/animated-group . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/animated-group.tsx . Mechanism: container variants with staggerChildren 0.1. Each child is motion.create(asChild). initial hidden, animate visible. Extra runtime: none. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof WeeksView>;

export default meta;
type Story = StoryObj<typeof meta>;

function fromArgs(args: GroupArgs): GroupArgs {
  return {
    preset: args.preset ?? 'blur-slide',
    as: args.as ?? 'div',
    asChild: args.asChild ?? 'div',
  };
}

async function waitOpaque(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  text: string,
) {
  await waitFor(
    () => {
      const node = canvas.getByText(text);
      const wrap = node.closest('.mp-week-card, .mp-action')?.parentElement;
      const opacity = Number(getComputedStyle(wrap ?? node).opacity);
      expect(opacity).toBeGreaterThan(0.99);
      expect(node).toBeVisible();
    },
    { timeout: 4000 },
  );
}

async function playReplay(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  settledText: string,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await waitOpaque(canvas, settledText);
  const root = canvas.getByTestId('animated-group');
  await expect(root).toHaveAttribute('data-run', '0');
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => expect(root).toHaveAttribute('data-run', '1'));
  await waitOpaque(canvas, settledText);
}

export const WeekCards: Story = {
  render: (args) => <WeeksView {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    const photos = canvas.getAllByRole('img');
    await expect(photos.length).toBe(3);
    await playReplay(canvas, 'Tools');
  },
};

export const WeekZeroActions: Story = {
  args: {
    preset: 'bounce',
    as: 'ul',
    asChild: 'li',
  },
  render: (args) => <ActionsView {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('animated-group')).toHaveAttribute(
      'data-as',
      'ul',
    );
    await playReplay(canvas, 'RSVP to Learn + Do');
  },
};

export const CustomVariants: Story = {
  args: {
    preset: 'slide',
    as: 'div',
    asChild: 'div',
  },
  render: (args) => <CustomView {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('animated-group')).toHaveAttribute(
      'data-preset',
      'custom',
    );
    await playReplay(canvas, 'Street');
  },
};
