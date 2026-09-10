import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PAGE_NAV, PHOTOS } from '../../pages/content';
import { AnimatedBackground } from '../vendor/motion-primitives/animated-background';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type BackgroundArgs = {
  enableHover: boolean;
  defaultValue: string;
  bounce: number;
  duration: number;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/animated-background`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/animated-background.json`;

const CARD_WEEKS = [
  {
    id: 'start',
    kicker: 'Week 0',
    title: 'Set up before the first session.',
    photo: PHOTOS.hero,
  },
  {
    id: 'learn',
    kicker: 'Six weeks',
    title: 'Complete one week at a time.',
    photo: PHOTOS.crowd,
  },
  {
    id: 'challenge',
    kicker: '19–28 October 2026',
    title: 'Do it, film it, thank people.',
    photo: PHOTOS.night,
  },
] as const;

function TabsView(args: BackgroundArgs) {
  const [nonce, setNonce] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(args.defaultValue);

  return (
    <PrimitiveFrame
      title="Animated background"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote="className is the yellow overlay. children are Start, Learn, Tools, Events, Lounge. onValueChange is a callback, not a control. Replay remounts from defaultValue. Size is the tab row."
      replay
      onReplay={() => {
        setActiveId(args.defaultValue);
        setNonce((current) => current + 1);
      }}
    >
      <div
        className="mp-tabs"
        data-testid="animated-background"
        data-active={activeId ?? ''}
        data-hover={String(args.enableHover)}
      >
        <AnimatedBackground
          key={nonce}
          className="mp-highlight"
          defaultValue={args.defaultValue}
          enableHover={args.enableHover}
          transition={{
            type: 'spring',
            bounce: args.bounce,
            duration: args.duration,
          }}
          onValueChange={setActiveId}
        >
          {PAGE_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              data-id={item.id}
              className="mp-tab"
            >
              {item.label}
            </button>
          ))}
        </AnimatedBackground>
      </div>
    </PrimitiveFrame>
  );
}

function CardsView(args: BackgroundArgs) {
  const [nonce, setNonce] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(args.defaultValue);

  return (
    <PrimitiveFrame
      title="Animated background"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote="Upstream card example, rebuilt as Week 0, Learn, and Challenge week. The overlay is a yellow wash. Photographs stay full color. Replay remounts from defaultValue."
      replay
      onReplay={() => {
        setActiveId(args.defaultValue);
        setNonce((current) => current + 1);
      }}
    >
      <div
        className="mp-week-grid"
        data-testid="animated-background"
        data-active={activeId ?? ''}
        data-hover={String(args.enableHover)}
      >
        <AnimatedBackground
          key={nonce}
          className="mp-week-card-highlight"
          defaultValue={args.defaultValue}
          enableHover={args.enableHover}
          transition={{
            type: 'spring',
            bounce: args.bounce,
            duration: args.duration,
          }}
          onValueChange={setActiveId}
        >
          {CARD_WEEKS.map((week) => (
            <button
              key={week.id}
              type="button"
              data-id={week.id}
              className="mp-week-card"
            >
              <img src={week.photo.src} alt={week.photo.alt} data-photo="" />
              <span className="mp-week-copy">
                <span className="mp-week-kicker">{week.kicker}</span>
                <span className="mp-week-title">{week.title}</span>
              </span>
            </button>
          ))}
        </AnimatedBackground>
      </div>
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Animated background',
  component: TabsView,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    enableHover: false,
    defaultValue: 'start',
    bounce: 0.2,
    duration: 0.5,
  },
  argTypes: {
    enableHover: {
      control: 'boolean',
      description:
        'Docs omit this. Source default false. True uses enter and leave instead of click.',
    },
    defaultValue: {
      control: 'select',
      options: ['start', 'learn', 'tools', 'events', 'lounge', 'challenge'],
      description: 'First active data-id. No upstream default.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description:
        'Writes transition.bounce. Upstream leaves transition undefined.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 1.2, step: 0.05 },
      description:
        'Writes transition.duration in seconds. Upstream leaves transition undefined.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives animated-background, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/animated-background . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/animated-background.tsx . Mechanism: layoutId background-{useId} overlay. AnimatePresence fades it. Click or hover sets activeId. Extra runtime: none. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof TabsView>;

export default meta;
type Story = StoryObj<typeof meta>;

function fromArgs(args: BackgroundArgs): BackgroundArgs {
  return {
    enableHover: Boolean(args.enableHover),
    defaultValue: args.defaultValue || 'start',
    bounce: typeof args.bounce === 'number' ? args.bounce : 0.2,
    duration: typeof args.duration === 'number' ? args.duration : 0.5,
  };
}

export const AcademyTabs: Story = {
  render: (args) => <TabsView {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const root = canvas.getByTestId('animated-background');
    await userEvent.click(canvas.getByRole('button', { name: 'Learn' }));
    await waitFor(() => expect(root).toHaveAttribute('data-active', 'learn'));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => expect(root).toHaveAttribute('data-active', 'start'));
  },
};

export const HoverTabs: Story = {
  args: {
    enableHover: true,
    defaultValue: 'start',
    bounce: 0.2,
    duration: 0.4,
  },
  render: (args) => <TabsView {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const root = canvas.getByTestId('animated-background');
    await expect(root).toHaveAttribute('data-hover', 'true');
    await userEvent.hover(canvas.getByRole('button', { name: 'Tools' }));
    await waitFor(() => expect(root).toHaveAttribute('data-active', 'tools'));
    await userEvent.unhover(canvas.getByRole('button', { name: 'Tools' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => expect(root).toHaveAttribute('data-active', 'start'));
  },
};

export const WeekCards: Story = {
  args: {
    enableHover: false,
    defaultValue: 'start',
    bounce: 0.15,
    duration: 0.55,
  },
  render: (args) => <CardsView {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const root = canvas.getByTestId('animated-background');
    const photos = canvas.getAllByRole('img');
    await expect(photos.length).toBe(3);
    for (const image of photos) {
      await expect(getComputedStyle(image).filter).toBe('none');
    }
    await userEvent.click(
      canvas.getByRole('button', { name: /Do it, film it, thank people/ }),
    );
    await waitFor(() =>
      expect(root).toHaveAttribute('data-active', 'challenge'),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => expect(root).toHaveAttribute('data-active', 'start'));
  },
};
