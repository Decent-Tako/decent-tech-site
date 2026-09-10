import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { IosFrame } from './Frame';
import {
  EXAMPLES,
  FOLDER_DEFAULTS,
  FOLDER_ITEMS,
  shouldReduce,
  type FolderItem,
  type PresenceMode,
  type ReducedMotionMode,
} from './source';

export type IosAppFolderProps = {
  title?: string;
  items?: FolderItem[];
  stiffness?: number;
  damping?: number;
  bounce?: number;
  titleStiffness?: number;
  titleDamping?: number;
  presenceMode?: PresenceMode;
  initialOpen?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function AppTile({
  iconSrc,
  label,
  layoutId,
}: {
  iconSrc: string;
  label: string;
  layoutId?: string;
}) {
  return (
    <motion.img
      className="ios-folder__tile"
      src={iconSrc}
      alt={label}
      data-photo=""
      layoutId={layoutId}
      draggable={false}
    />
  );
}

function OpenGridItem({
  item,
  idx,
  items,
  itemOffsets,
  offsetsReady,
  stiffness,
  damping,
}: {
  item: FolderItem;
  idx: number;
  items: FolderItem[];
  itemOffsets: Record<string, { x: number; y: number }>;
  offsetsReady: boolean;
  stiffness: number;
  damping: number;
}) {
  const off = itemOffsets[item.key] ?? { x: 0, y: 0 };
  const hasLayout = Boolean(item.layoutId);
  const nonLayoutTotal = items.filter((entry) => !entry.layoutId).length;
  const nonLayoutIdx = items.slice(0, idx).filter((entry) => !entry.layoutId)
    .length;
  const openDelay = offsetsReady
    ? item.layoutId
      ? 0
      : -0.025 + nonLayoutIdx * 0.025
    : 0;
  const closeDelay = offsetsReady
    ? item.layoutId
      ? 0
      : -0.095 + (nonLayoutTotal - 1 - nonLayoutIdx) * 0.025
    : 0;

  return (
    <motion.div
      className="ios-folder__open-item"
      data-folder-item={item.key}
      initial={
        hasLayout
          ? { opacity: 1 }
          : offsetsReady
            ? { opacity: 0, scale: 0.2, x: off.x, y: off.y }
            : { opacity: 0 }
      }
      animate={
        hasLayout
          ? { opacity: 1 }
          : offsetsReady
            ? { opacity: 1, scale: 1, x: 0, y: 0 }
            : { opacity: 0 }
      }
      exit={
        hasLayout
          ? { opacity: 1 }
          : {
              opacity: 0,
              scale: 0.2,
              x: off.x,
              y: off.y,
              transition: {
                type: 'spring',
                stiffness,
                damping,
                delay: closeDelay,
                opacity: { delay: 0.05 },
              },
            }
      }
      transition={{
        type: 'spring',
        stiffness,
        damping,
        delay: openDelay,
      }}
    >
      <div className="ios-folder__open-tile">
        <AppTile
          layoutId={item.layoutId}
          iconSrc={item.iconSrc}
          label={item.iconAlt}
        />
      </div>
      {hasLayout ? (
        <motion.div
          layoutId={`label-${item.layoutId}`}
          className="ios-folder__open-label"
        >
          {item.name}
        </motion.div>
      ) : (
        <div className="ios-folder__open-label">{item.name}</div>
      )}
    </motion.div>
  );
}

export function IosAppFolder({
  title = FOLDER_DEFAULTS.title,
  items = FOLDER_ITEMS,
  stiffness = FOLDER_DEFAULTS.stiffness,
  damping = FOLDER_DEFAULTS.damping,
  bounce = FOLDER_DEFAULTS.bounce,
  titleStiffness = FOLDER_DEFAULTS.titleStiffness,
  titleDamping = FOLDER_DEFAULTS.titleDamping,
  presenceMode = FOLDER_DEFAULTS.presenceMode,
  initialOpen = FOLDER_DEFAULTS.initialOpen,
  reducedMotion = FOLDER_DEFAULTS.reducedMotion,
}: IosAppFolderProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const layoutSpring = {
    type: 'spring' as const,
    stiffness,
    damping,
    bounce,
  };
  const [runId, setRunId] = useState(0);
  const [isOpen, setIsOpen] = useState(initialOpen && runId === 0);
  const miniGridRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [itemOffsets, setItemOffsets] = useState<
    Record<string, { x: number; y: number }>
  >({});

  useEffect(() => {
    for (const item of items) {
      const img = new Image();
      img.src = item.iconSrc;
    }
  }, [items]);

  const openFolder = useCallback(() => {
    const rect = miniGridRef.current?.getBoundingClientRect();
    if (rect) {
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setIsOpen(true);
  }, []);

  const closeFolder = useCallback(() => {
    setIsOpen(false);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !origin) return;
    const next: Record<string, { x: number; y: number }> = {};
    for (const item of items) {
      const el = document.querySelector<HTMLDivElement>(
        `[data-folder-item="${item.key}"]`,
      );
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      next[item.key] = {
        x: origin.x - (rect.left + rect.width / 2),
        y: origin.y - (rect.top + rect.height / 2),
      };
    }
    // Origin offsets are the non-layoutId spring mechanism.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- measure after open layout
    setItemOffsets(next);
  }, [isOpen, items, origin]);

  useEffect(() => {
    if (runId === 0) return;
    const timer = window.setTimeout(() => {
      openFolder();
    }, 40);
    return () => window.clearTimeout(timer);
  }, [openFolder, runId]);

  const forceRest = isOpen && !origin && runId === 0 && initialOpen;
  const offsetsReady =
    forceRest ||
    Boolean(
      isOpen && origin && Object.keys(itemOffsets).length === items.length,
    );

  return (
    <IosFrame
      title="iOS App Folder"
      mechanism={
        <>
          <code>AnimatePresence mode=&quot;{presenceMode}&quot;</code> swaps the
          closed folder and the open overlay. Tiles with <code>layoutId</code>{' '}
          FLIP from the mini-grid. Tiles without <code>layoutId</code> spring
          from the measured mini-grid centre.
        </>
      }
      docs={EXAMPLES.folder.docs}
      example={EXAMPLES.folder.page}
      live={EXAMPLES.folder.live}
      extraRuntime="lucide-react is not required here. App tiles are Academy photographs."
      fixedNote="The overlay stays inside the 32 rem stage so it does not cover Storybook controls. Upstream used position:fixed on the live page. Mini cells stay 25 px and open tiles stay 4.25 rem because those sizes are the iOS folder proportion. Replay opens the folder from a remount."
      onReplay={() => {
        setOrigin(null);
        setItemOffsets({});
        setIsOpen(false);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="ios-app-folder"
      running={!reduce}
      runId={runId}
    >
      <div className="ios-example__stage ios-example__stage--folder">
        <MotionConfig transition={layoutSpring}>
        <motion.div
          key={runId}
          className="ios-folder"
          id="example"
          data-open={isOpen ? 'true' : 'false'}
        >
          <AnimatePresence
            mode={presenceMode}
            initial={false}
            onExitComplete={() => {
              if (!isOpen) {
                setItemOffsets({});
                setOrigin(null);
              }
            }}
          >
            {!isOpen ? (
              <motion.button
                key="closed"
                type="button"
                className="ios-folder__closed"
                onClick={openFolder}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={layoutSpring}
                aria-label={`Open ${title} folder`}
              >
                <div className="ios-folder__preview">
                  <div className="ios-folder__grid">
                    {items
                      .filter((item) => !item.layoutId)
                      .slice(0, 3)
                      .map((item) => (
                        <AppTile
                          key={item.key}
                          iconSrc={item.iconSrc}
                          label={item.iconAlt}
                        />
                      ))}
                    <div className="ios-folder__mini" ref={miniGridRef}>
                      {items
                        .filter((item) => item.layoutId)
                        .slice(0, 4)
                        .map((item) => (
                          <div key={item.key} className="ios-folder__mini-cell">
                            <AppTile
                              layoutId={item.layoutId}
                              iconSrc={item.iconSrc}
                              label={item.iconAlt}
                            />
                            <motion.div
                              layoutId={`label-${item.layoutId}`}
                              className="ios-folder__mini-label"
                              style={{ opacity: 0 }}
                              aria-hidden="true"
                            >
                              {item.name}
                            </motion.div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="ios-folder__name">{title}</div>
              </motion.button>
            ) : (
              <motion.div
                key="open"
                className="ios-folder__overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { delay: 0.025 } }}
              >
                <button
                  type="button"
                  className="ios-folder__backdrop"
                  onClick={closeFolder}
                  aria-label="Close folder"
                />
                <motion.div
                  className="ios-folder__open"
                  role="dialog"
                  aria-modal="true"
                  aria-label={title}
                >
                  <motion.div
                    className="ios-folder__open-title"
                    initial={{ y: 30, x: 10, scale: 0.8 }}
                    animate={{ y: 0, x: 0, scale: 1 }}
                    exit={{
                      y: 30,
                      x: 10,
                      scale: 0.8,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping,
                      },
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: titleStiffness,
                      damping: titleDamping,
                    }}
                  >
                    {title}
                  </motion.div>
                  <div className="ios-folder__open-grid">
                    {items.map((item, idx) => (
                      <OpenGridItem
                        key={
                          item.layoutId
                            ? item.key
                            : `${item.key}-${offsetsReady ? 'ready' : 'wait'}`
                        }
                        item={item}
                        idx={idx}
                        items={items}
                        itemOffsets={itemOffsets}
                        offsetsReady={offsetsReady}
                        stiffness={stiffness}
                        damping={damping}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        </MotionConfig>
      </div>
    </IosFrame>
  );
}
