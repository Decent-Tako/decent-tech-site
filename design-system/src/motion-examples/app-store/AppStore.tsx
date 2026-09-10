import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Transition,
} from 'motion/react';
import { useRef, useState } from 'react';

import { Wordmark } from '../../brand/Wordmark';
import { PHOTOS } from '../../pages/content';
import './app-store.css';

export type StoreItemId = 'start' | 'learn' | 'tools' | 'lounge';

export type AppStoreProps = {
  overlayDuration?: number;
  overlayDelay?: number;
  layoutType?: 'spring' | 'tween';
  bounce?: number;
  visualDuration?: number;
  tweenDuration?: number;
  presenceMode?: 'sync' | 'wait' | 'popLayout';
  initialOpenId?: 'none' | StoreItemId;
  reducedMotion?: 'user' | 'always' | 'never';
};

type StoreItem = {
  id: StoreItemId;
  category: string;
  title: string;
  body: string[];
  photo: (typeof PHOTOS)[keyof typeof PHOTOS];
  top?: number;
  bottom?: number;
  width?: string;
  left?: number;
  theme?: 'dark';
};

const STORE_ITEMS: StoreItem[] = [
  {
    id: 'start',
    category: 'Week 0',
    title: 'Set the goal to $3,000. Publish the page.',
    body: [
      'Week 0 is Set Up. Complete the Circle profile. Say hi in the Lounge. Find your Buddy and your Team.',
      'Set the goal to $3,000. RSVP to Learn + Do. Later weeks stay locked until this page is live.',
    ],
    photo: PHOTOS.hero,
    top: -120,
  },
  {
    id: 'learn',
    category: 'Six weeks',
    title: 'Complete one week at a time.',
    body: [
      'Learn contains six weekly lessons. Finish the current lesson and its practical action before the next week opens.',
      'Keep the line short enough to say out loud. State the next action.',
    ],
    photo: PHOTOS.crowd,
    bottom: -40,
    theme: 'dark',
    width: '110%',
    left: -20,
  },
  {
    id: 'tools',
    category: 'Tracker',
    title: 'Map 100 people. Start with the inner circle.',
    body: [
      'Use the 100-person tracker and the ten-day content plan. List the inner circle first. Send the first asks.',
      'Challenge week runs 19–28 October 2026. Aim for $3,000 before that week starts.',
    ],
    photo: PHOTOS.community,
    theme: 'dark',
    width: '160%',
    left: -80,
  },
  {
    id: 'lounge',
    category: 'Buddy and Team',
    title: 'Share what works. Move when one of you stalls.',
    body: [
      'Buddy is the person you check in with most. The Team Leader runs Learn + Do and keeps the Team moving.',
      'The Lounge is where Buddy and Team talk. Do not say squad.',
    ],
    photo: PHOTOS.night,
    bottom: -80,
  },
];

function itemById(id: string): StoreItem {
  const item = STORE_ITEMS.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Unknown store item: ${id}`);
  }
  return item;
}

function useReduce(reducedMotion: 'user' | 'always' | 'never') {
  const pref = useReducedMotion();
  if (reducedMotion === 'always') return true;
  if (reducedMotion === 'never') return false;
  return pref === true;
}

function layoutTransition(
  reduce: boolean,
  layoutType: 'spring' | 'tween',
  bounce: number,
  visualDuration: number,
  tweenDuration: number,
): Transition {
  if (reduce) return { duration: 0 };
  if (layoutType === 'tween') {
    return { type: 'tween', duration: tweenDuration, ease: [0.2, 0, 0, 1] };
  }
  return { type: 'spring', bounce, visualDuration };
}

type CardProps = StoreItem & { open: () => void };

function Card({
  id,
  title,
  category,
  photo,
  open,
  top,
  bottom,
  width = '100%',
  left,
  theme,
}: CardProps) {
  return (
    <li className={`card ${theme ?? ''}`}>
      <motion.div className="card-content" layoutId={`card-container-${id}`}>
        <motion.div
          className="card-image-container"
          layoutId={`card-image-container-${id}`}
        >
          <motion.img
            className="card-image"
            data-photo
            src={photo.src}
            alt={photo.alt}
            style={{ top, bottom, width, left }}
            layoutId={`card-image-${id}`}
          />
        </motion.div>
        <motion.div
          className="title-container"
          layoutId={`title-container-${id}`}
          layout="position"
        >
          <span className="h6">{category}</span>
          <h2 className="h3">{title}</h2>
        </motion.div>
        <button
          type="button"
          className="card-open-link"
          aria-expanded="false"
          aria-label={`${category}. ${title}`}
          onClick={open}
        />
      </motion.div>
    </li>
  );
}

function List({
  open,
  hidden,
}: {
  open: (id: StoreItemId) => void;
  hidden: boolean;
}) {
  return (
    <ul className="card-list" aria-hidden={hidden || undefined}>
      {STORE_ITEMS.map((card) => (
        <Card key={card.id} {...card} open={() => open(card.id)} />
      ))}
    </ul>
  );
}

function Item({
  id,
  close,
  overlayDuration,
  overlayDelay,
  reduce,
}: {
  id: StoreItemId;
  close: () => void;
  overlayDuration: number;
  overlayDelay: number;
  reduce: boolean;
}) {
  const { category, title, body, photo, top, bottom, theme, width = '100%', left } =
    itemById(id);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={
          reduce
            ? { duration: 0, delay: 0 }
            : { duration: overlayDuration, delay: overlayDelay }
        }
        style={{ pointerEvents: 'auto' }}
        className="overlay"
        onClick={close}
      />
      <div className={`card-content-container open ${theme ?? ''}`}>
        <motion.div className="card-content" layoutId={`card-container-${id}`}>
          <motion.div
            className="card-image-container"
            layoutId={`card-image-container-${id}`}
          >
            <motion.img
              className="card-image"
              data-photo
              src={photo.src}
              alt={photo.alt}
              style={{ top, bottom, width, left }}
              layoutId={`card-image-${id}`}
            />
          </motion.div>
          <motion.div
            className="title-container"
            layoutId={`title-container-${id}`}
            layout="position"
          >
            <span className="h6">{category}</span>
            <h2 className="h3">{title}</h2>
          </motion.div>
          <motion.div className="content-container small">
            {body.map((paragraph) => (
              <p key={paragraph} className="big">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export function AppStore(props: AppStoreProps) {
  return <AppStoreView key={props.initialOpenId ?? 'none'} {...props} />;
}

function AppStoreView({
  overlayDuration = 0.2,
  overlayDelay = 0.1,
  layoutType = 'spring',
  bounce = 0.2,
  visualDuration = 0.4,
  tweenDuration = 0.35,
  presenceMode = 'sync',
  initialOpenId = 'none',
  reducedMotion = 'user',
}: AppStoreProps) {
  const reduce = useReduce(reducedMotion);
  const transition = layoutTransition(
    reduce,
    layoutType,
    bounce,
    visualDuration,
    tweenDuration,
  );
  const [openId, setOpenId] = useState<StoreItemId | null>(
    initialOpenId === 'none' ? null : initialOpenId,
  );
  const pendingOpen = useRef<StoreItemId | null>(null);

  const replay = () => {
    const target = initialOpenId === 'none' ? STORE_ITEMS[0].id : initialOpenId;
    if (openId === null) {
      setOpenId(target);
      return;
    }
    pendingOpen.current = target;
    setOpenId(null);
  };

  return (
    <MotionConfig
      reducedMotion={
        reducedMotion === 'always'
          ? 'always'
          : reducedMotion === 'never'
            ? 'never'
            : 'user'
      }
      transition={transition}
    >
      <div className="academy-app-store-shell">
        <div className="academy-app-store-chrome">
          <p>
            Package <code>motion</code> 13.2.0. Licence MIT. Mechanism:{' '}
            <code>layoutId</code> shared layout plus <code>AnimatePresence</code>{' '}
            overlay. Docs{' '}
            <a href="https://motion.dev/docs/react-layout-animations">
              https://motion.dev/docs/react-layout-animations
            </a>
            . Example{' '}
            <a href="https://motion.dev/examples/react-app-store">
              https://motion.dev/examples/react-app-store
            </a>
            . Live source{' '}
            <a href="https://examples.motion.dev/react/app-store">
              https://examples.motion.dev/react/app-store
            </a>
            . Repository{' '}
            <a href="https://github.com/motiondivision/motion">
              https://github.com/motiondivision/motion
            </a>
            . No extra runtime. Intended viewport 990px and above. The tutorial
            steps on the article page are Motion+. The live example publishes the
            source. Prior Academy use: Pages/Navigation already uses{' '}
            <code>layoutId</code> for a different composition.
          </p>
          <button
            type="button"
            className="academy-app-store-replay"
            onClick={replay}
          >
            Replay
          </button>
        </div>
        <div id="academy-app-store">
          <header>
            <div>
              <p className="store-kicker">Nedd&apos;s × Mobilise</p>
              <h1 className="store-title">Today</h1>
            </div>
            <Wordmark size="tiny" label="Uncomfortable Academy home" />
          </header>
          <List
            hidden={openId !== null}
            open={(id) => {
              pendingOpen.current = null;
              setOpenId(id);
            }}
          />
          <AnimatePresence
            mode={presenceMode}
            onExitComplete={() => {
              const next = pendingOpen.current;
              if (!next) return;
              pendingOpen.current = null;
              setOpenId(next);
            }}
          >
            {openId ? (
              <Item
                key="item"
                close={() => setOpenId(null)}
                id={openId}
                overlayDuration={overlayDuration}
                overlayDelay={overlayDelay}
                reduce={reduce}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
