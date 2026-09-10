import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { DESTINATIONS } from '../../pages/content';
import { expectFullColorPhotos } from '../../pages/storySupport';
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNavigation,
} from '../vendor/motion-primitives/carousel';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type CarouselArgs = {
  disableDrag: boolean;
  alwaysShow: boolean;
  initialIndex: number;
  stiffness: number;
  damping: number;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/carousel`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/carousel.json`;

const EXTRA_RUNTIME =
  'Extra runtime lucide-react 1.43.0 for ChevronLeft and ChevronRight. Licence ISC. Motion does not ship those icons.';

function WeekCard({
  title,
  kicker,
  copy,
  photo,
}: (typeof DESTINATIONS)[number]) {
  return (
    <article className="mp-carousel-card">
      <img data-photo src={photo.src} alt={photo.alt} />
      <div>
        <span>{kicker}</span>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
    </article>
  );
}

function WeekCardsView(args: CarouselArgs) {
  const [index, setIndex] = useState(args.initialIndex);
  const [nonce, setNonce] = useState(0);

  return (
    <PrimitiveFrame
      title="Carousel"
      docs={DOCS}
      registry={REGISTRY}
      extraRuntime={EXTRA_RUNTIME}
      fixedNote="alwaysShow keeps Previous and Next visible. Indicators use the upstream dots. Replay remounts to initialIndex. Stage width is 36rem so each photograph is 12rem tall."
      replay
      onReplay={() => {
        setIndex(args.initialIndex);
        setNonce((current) => current + 1);
      }}
    >
      <div
        key={nonce}
        className="mp-carousel"
        data-testid="carousel"
        data-index={String(index)}
      >
        <Carousel
          initialIndex={args.initialIndex}
          disableDrag={args.disableDrag}
          onIndexChange={setIndex}
        >
          <CarouselContent
            transition={{
              type: 'spring',
              stiffness: args.stiffness,
              damping: args.damping,
              duration: 0.2,
            }}
          >
            {DESTINATIONS.map((item) => (
              <CarouselItem key={item.id}>
                <WeekCard {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNavigation
            alwaysShow={args.alwaysShow}
            classNameButton="mp-carousel-nav"
          />
          <CarouselIndicator classNameButton="mp-carousel-dot" />
        </Carousel>
      </div>
    </PrimitiveFrame>
  );
}

function WeekStripView(args: CarouselArgs) {
  const [index, setIndex] = useState(args.initialIndex);
  const [nonce, setNonce] = useState(0);

  return (
    <PrimitiveFrame
      title="Carousel"
      docs={DOCS}
      registry={REGISTRY}
      extraRuntime={EXTRA_RUNTIME}
      fixedNote="flex-basis 33.333% is the docs custom-sizes example. IntersectionObserver counts visible items and steps by that width. Replay remounts to initialIndex."
      replay
      onReplay={() => {
        setIndex(args.initialIndex);
        setNonce((current) => current + 1);
      }}
    >
      <div
        key={nonce}
        className="mp-carousel mp-carousel--strip"
        data-testid="carousel"
        data-index={String(index)}
      >
        <Carousel
          initialIndex={args.initialIndex}
          disableDrag={args.disableDrag}
          onIndexChange={setIndex}
        >
          <CarouselContent
            transition={{
              type: 'spring',
              stiffness: args.stiffness,
              damping: args.damping,
              duration: 0.2,
            }}
          >
            {DESTINATIONS.map((item) => (
              <CarouselItem key={item.id} className="mp-carousel-item--third">
                <WeekCard {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNavigation
            alwaysShow={args.alwaysShow}
            classNameButton="mp-carousel-nav"
          />
        </Carousel>
      </div>
    </PrimitiveFrame>
  );
}

function CustomIndicatorsView(args: CarouselArgs) {
  const [index, setIndex] = useState(args.initialIndex);
  const [nonce, setNonce] = useState(0);

  return (
    <PrimitiveFrame
      title="Carousel"
      docs={DOCS}
      registry={REGISTRY}
      extraRuntime={EXTRA_RUNTIME}
      fixedNote="index and onIndexChange are the docs custom-indicator example. The week name buttons are host UI, not CarouselIndicator. Replay remounts to initialIndex."
      replay
      onReplay={() => {
        setIndex(args.initialIndex);
        setNonce((current) => current + 1);
      }}
    >
      <div
        key={nonce}
        className="mp-carousel"
        data-testid="carousel"
        data-index={String(index)}
      >
        <Carousel
          index={index}
          disableDrag={args.disableDrag}
          onIndexChange={setIndex}
        >
          <CarouselContent
            transition={{
              type: 'spring',
              stiffness: args.stiffness,
              damping: args.damping,
              duration: 0.2,
            }}
          >
            {DESTINATIONS.map((item) => (
              <CarouselItem key={item.id}>
                <WeekCard {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNavigation
            alwaysShow={args.alwaysShow}
            classNameButton="mp-carousel-nav"
          />
        </Carousel>
        <div className="mp-carousel-indicators">
          {DESTINATIONS.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to ${item.title}`}
              aria-current={index === itemIndex ? 'true' : undefined}
              onClick={() => setIndex(itemIndex)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Carousel',
  component: WeekCardsView,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    disableDrag: false,
    alwaysShow: true,
    initialIndex: 0,
    stiffness: 90,
    damping: 18,
  },
  argTypes: {
    disableDrag: {
      control: 'boolean',
      description: 'Upstream default false.',
    },
    alwaysShow: {
      control: 'boolean',
      description: 'CarouselNavigation.alwaysShow. Upstream default false.',
    },
    initialIndex: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: 'Upstream default 0.',
    },
    stiffness: {
      control: { type: 'range', min: 40, max: 200, step: 10 },
      description: 'CarouselContent transition.stiffness. Upstream 90.',
    },
    damping: {
      control: { type: 'range', min: 8, max: 40, step: 2 },
      description: 'CarouselContent transition.damping. Upstream 18.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives carousel, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/carousel . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/carousel.tsx . Mechanism: context holds index. IntersectionObserver counts visible items. animate translateX is -index * (100 / visibleItemsCount)%. Drag steps when dragX is past 10px. Extra runtime lucide-react 1.43.0. Prior Academy use: evaluated only. Gallery Embla carousel is a different package.',
      },
    },
  },
} satisfies Meta<typeof WeekCardsView>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playCarousel(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const root = canvas.getByTestId('carousel');
  await expect(root).toHaveAttribute('data-index', '0');
  await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
  await waitFor(() => expect(root).toHaveAttribute('data-index', '1'), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(
    () => expect(canvas.getByTestId('carousel')).toHaveAttribute('data-index', '0'),
    { timeout: 4000 },
  );
}

export const WeekCards: Story = {
  render: (args) => <WeekCardsView {...args} />,
  play: async ({ canvas }) => {
    await playCarousel(canvas);
    await expectFullColorPhotos(canvas);
  },
};

export const WeekStrip: Story = {
  args: {
    disableDrag: false,
    alwaysShow: true,
    initialIndex: 0,
    stiffness: 90,
    damping: 18,
  },
  render: (args) => <WeekStripView {...args} />,
  play: async ({ canvas }) => {
    await playCarousel(canvas);
    await expectFullColorPhotos(canvas);
  },
};

export const CustomIndicators: Story = {
  args: {
    disableDrag: true,
    alwaysShow: true,
    initialIndex: 0,
    stiffness: 90,
    damping: 18,
  },
  render: (args) => <CustomIndicatorsView {...args} />,
  play: async ({ canvas }) => {
    await playCarousel(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Go to Learn' }));
    await waitFor(() =>
      expect(canvas.getByTestId('carousel')).toHaveAttribute('data-index', '1'),
    );
    await expectFullColorPhotos(canvas);
  },
};
