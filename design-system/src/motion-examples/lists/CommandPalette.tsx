import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from 'motion/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { ListsFrame } from './Frame';
import {
  ACADEMY_COMMANDS,
  EXAMPLES,
  MOTION_RUNTIME,
  COMMAND_PALETTE_DEFAULTS,
  shouldReduce,
  type CommandIconName,
  type CommandItemData,
  type ReducedMotionMode,
} from './source';

export type CommandPaletteProps = {
  dialogOffsetY?: number;
  backdropDuration?: number;
  dialogStiffness?: number;
  dialogDamping?: number;
  itemStiffness?: number;
  itemDamping?: number;
  placeholder?: string;
  triggerLabel?: string;
  reducedMotion?: ReducedMotionMode;
};

const svgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function CommandIcon({ name }: { name: CommandIconName }) {
  switch (name) {
    case 'profile':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      );
    case 'lounge':
      return (
        <svg {...svgProps}>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      );
    case 'buddy':
      return (
        <svg {...svgProps}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
        </svg>
      );
    case 'team':
      return (
        <svg {...svgProps}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="8" r="3" />
          <path d="M2 20c0-3 3-5 6-5" />
          <path d="M16 15c3 0 6 2 6 5" />
        </svg>
      );
    case 'goal':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case 'rsvp':
      return (
        <svg {...svgProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case 'learn':
      return (
        <svg {...svgProps}>
          <path d="M4 19V6l8-3 8 3v13l-8 3-8-3z" />
          <path d="M12 3v16" />
        </svg>
      );
    case 'tracker':
      return (
        <svg {...svgProps}>
          <path d="M4 19V9M12 19V5M20 19v-7" />
        </svg>
      );
    case 'plan':
      return (
        <svg {...svgProps}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case 'publish':
      return (
        <svg {...svgProps}>
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      );
    case 'events':
      return (
        <svg {...svgProps}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case 'challenge':
      return (
        <svg {...svgProps}>
          <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" />
        </svg>
      );
    default:
      return null;
  }
}

function CommandItem({
  item,
  isSelected,
  itemTransition,
  onSelect,
  onHover,
}: {
  item: CommandItemData;
  isSelected: boolean;
  itemTransition: Transition;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={isSelected}
      data-selected={isSelected}
      className="lists-palette__item"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={itemTransition}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      <span aria-hidden="true">
        <CommandIcon name={item.icon} />
      </span>
      <span className="lists-palette__item-label">{item.label}</span>
      {item.shortcut ? (
        <span>
          {item.shortcut.map((key) => (
            <kbd key={key} className="lists-palette__kbd">
              {key}
            </kbd>
          ))}
        </span>
      ) : null}
    </motion.button>
  );
}

function FooterHint({ keys, children }: { keys: string; children: ReactNode }) {
  return (
    <span>
      <kbd className="lists-palette__kbd">{keys}</kbd> {children}
    </span>
  );
}

export function CommandPalette({
  dialogOffsetY = COMMAND_PALETTE_DEFAULTS.dialogOffsetY,
  backdropDuration = COMMAND_PALETTE_DEFAULTS.backdropDuration,
  dialogStiffness = COMMAND_PALETTE_DEFAULTS.dialogStiffness,
  dialogDamping = COMMAND_PALETTE_DEFAULTS.dialogDamping,
  itemStiffness = COMMAND_PALETTE_DEFAULTS.itemStiffness,
  itemDamping = COMMAND_PALETTE_DEFAULTS.itemDamping,
  placeholder = COMMAND_PALETTE_DEFAULTS.placeholder,
  triggerLabel = COMMAND_PALETTE_DEFAULTS.triggerLabel,
  reducedMotion = COMMAND_PALETTE_DEFAULTS.reducedMotion,
}: CommandPaletteProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const dialogTransition: Transition = reduce
    ? { duration: 0 }
    : { type: 'spring', stiffness: dialogStiffness, damping: dialogDamping };
  const itemTransition: Transition = reduce
    ? { duration: 0 }
    : { type: 'spring', stiffness: itemStiffness, damping: itemDamping };

  const filtered = useMemo(() => {
    if (!query.trim()) return ACADEMY_COMMANDS;
    const needle = query.toLowerCase();
    return ACADEMY_COMMANDS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(needle) ||
          item.keywords?.some((keyword) => keyword.includes(needle)),
      ),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const flatItems = useMemo(
    () => filtered.flatMap((group) => group.items),
    [filtered],
  );

  const handleOpen = () => {
    setOpen(true);
    setQuery('');
    setSelectedIndex(0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((index) =>
        index < flatItems.length - 1 ? index + 1 : 0,
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((index) =>
        index > 0 ? index - 1 : flatItems.length - 1,
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleClose();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  let runningIndex = 0;

  return (
    <ListsFrame
      title="Command palette"
      mechanism={
        <>
          Outer <code>AnimatePresence</code> mounts a backdrop opacity tween
          and a dialog spring on <code>opacity</code>, <code>y</code>, and{' '}
          <code>scale</code>. Inner <code>AnimatePresence mode=&quot;popLayout&quot;</code>{' '}
          plus <code>layout</code> filters the list. <code>⌘K</code> toggles
          open. UI primitives/Command uses <code>cmdk</code> with no Motion
          presence.
        </>
      }
      docs={MOTION_RUNTIME.docsPresence}
      example={EXAMPLES.commandPalette.page}
      live={EXAMPLES.commandPalette.live}
      chunk={EXAMPLES.commandPalette.chunk}
      priorNote="UI primitives/Command already ships cmdk. This example is Motion AnimatePresence, not cmdk."
      fixedNote="The overlay is absolute inside the stage so Replay stays reachable. Upstream used position:fixed for the sandbox. Dialog height stays 19 rem so the filtered list can scroll. Replay closes the palette."
      controlKind="replay"
      onReplay={() => {
        setOpen(false);
        setQuery('');
        setSelectedIndex(0);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="command-palette"
      running={open}
      runId={runId}
      extraData={{ 'data-open': open ? 'true' : 'false' }}
    >
      <div className="lists-example__stage lists-example__stage--palette">
        <div className="lists-palette">
          <button
            type="button"
            className="lists-palette__trigger"
            onClick={handleOpen}
          >
            <CommandIcon name="profile" />
            <span className="lists-palette__trigger-label">{triggerLabel}</span>
            <kbd className="lists-palette__kbd">{'\u2318K'}</kbd>
          </button>
          <AnimatePresence>
            {open ? (
              <div className="lists-palette__overlay">
                <motion.button
                  type="button"
                  key="backdrop"
                  className="lists-palette__backdrop"
                  aria-label="Close command palette"
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : backdropDuration }}
                  onClick={handleClose}
                />
                <motion.div
                  key="dialog"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Academy commands"
                  className="lists-palette__dialog"
                  initial={
                    reduce
                      ? false
                      : { opacity: 0, y: dialogOffsetY, scale: 0.96 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: dialogOffsetY / 2,
                          scale: 0.98,
                          transition: { duration: 0.12 },
                        }
                  }
                  transition={dialogTransition}
                  onKeyDown={handleKeyDown}
                >
                  <div className="lists-palette__input-row">
                    <CommandIcon name="profile" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setSelectedIndex(0);
                      }}
                      placeholder={placeholder}
                      aria-label={placeholder}
                      className="lists-palette__input"
                    />
                    {query ? (
                      <button
                        type="button"
                        className="lists-palette__clear"
                        aria-label="Clear search"
                        onClick={() => {
                          setQuery('');
                          setSelectedIndex(0);
                        }}
                      >
                        ×
                      </button>
                    ) : null}
                  </div>
                  <div
                    ref={listRef}
                    role="listbox"
                    aria-label="Matching commands"
                    className="lists-palette__list"
                  >
                    <AnimatePresence mode="popLayout">
                      {filtered.length > 0 ? (
                        filtered.map((group) => {
                          const groupItems = group.items.map((item) => {
                            const index = runningIndex;
                            runningIndex += 1;
                            return { item, index };
                          });
                          return (
                            <motion.div
                              key={group.label}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={itemTransition}
                            >
                              <p className="lists-palette__group-label">
                                {group.label}
                              </p>
                              {groupItems.map(({ item, index }) => (
                                <CommandItem
                                  key={item.label}
                                  item={item}
                                  isSelected={index === selectedIndex}
                                  itemTransition={itemTransition}
                                  onSelect={handleClose}
                                  onHover={() => setSelectedIndex(index)}
                                />
                              ))}
                            </motion.div>
                          );
                        })
                      ) : (
                        <motion.div
                          key="empty"
                          className="lists-palette__empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={itemTransition}
                        >
                          No results for “{query}”
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="lists-palette__footer">
                    <FooterHint keys={'\u2191\u2193'}>navigate</FooterHint>
                    <FooterHint keys={'\u21B5'}>select</FooterHint>
                    <FooterHint keys="esc">close</FooterHint>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </ListsFrame>
  );
}
