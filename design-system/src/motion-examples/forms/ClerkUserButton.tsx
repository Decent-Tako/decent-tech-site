import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { FormsFrame } from './Frame';
import {
  CLERK_USER_BUTTON_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type ClerkUserButtonProps = {
  bounce?: number;
  visualDuration?: number;
  contentDelay?: number;
  fullName?: string;
  email?: string;
  initials?: string;
  manageLabel?: string;
  signOutLabel?: string;
  signInLabel?: string;
  signedInHint?: string;
  signedOutHint?: string;
  initialOpen?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function Avatar({
  initials,
  large = false,
}: {
  initials: string;
  large?: boolean;
}) {
  return (
    <motion.div
      layoutId="clerk-avatar"
      className={large ? 'forms-user-avatar--large' : 'forms-user-avatar'}
    >
      {initials}
    </motion.div>
  );
}

export function ClerkUserButton({
  bounce = CLERK_USER_BUTTON_DEFAULTS.bounce,
  visualDuration = CLERK_USER_BUTTON_DEFAULTS.visualDuration,
  contentDelay = CLERK_USER_BUTTON_DEFAULTS.contentDelay,
  fullName = CLERK_USER_BUTTON_DEFAULTS.fullName,
  email = CLERK_USER_BUTTON_DEFAULTS.email,
  initials = CLERK_USER_BUTTON_DEFAULTS.initials,
  manageLabel = CLERK_USER_BUTTON_DEFAULTS.manageLabel,
  signOutLabel = CLERK_USER_BUTTON_DEFAULTS.signOutLabel,
  signInLabel = CLERK_USER_BUTTON_DEFAULTS.signInLabel,
  signedInHint = CLERK_USER_BUTTON_DEFAULTS.signedInHint,
  signedOutHint = CLERK_USER_BUTTON_DEFAULTS.signedOutHint,
  initialOpen = CLERK_USER_BUTTON_DEFAULTS.initialOpen,
  reducedMotion = CLERK_USER_BUTTON_DEFAULTS.reducedMotion,
}: ClerkUserButtonProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);

  return (
    <FormsFrame
      title="Clerk user button"
      mechanism={
        <>
          Closed button and open menu share <code>layoutId=&quot;clerk-userbtn&quot;</code>.
          The avatar shares <code>layoutId=&quot;clerk-avatar&quot;</code>. Menu copy
          fades with <code>AnimatePresence</code>.
        </>
      }
      docs={MOTION_RUNTIME.docsLayout}
      extraDocs={MOTION_RUNTIME.docsPresence}
      example={EXAMPLES.clerkUserButton.page}
      live={EXAMPLES.clerkUserButton.live}
      fixedNote="Closed size stays 2.5 rem. Open width stays 216 px. layoutId strings stay identity keys. Replay closes the menu and signs back in."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="clerk-user-button"
      running={!reduce}
      runId={runId}
    >
      <div className="forms-stage forms-stage--user">
        <ClerkUserButtonRun
          key={`${runId}-${initialOpen}`}
          bounce={bounce}
          visualDuration={visualDuration}
          contentDelay={contentDelay}
          fullName={fullName}
          email={email}
          initials={initials}
          manageLabel={manageLabel}
          signOutLabel={signOutLabel}
          signInLabel={signInLabel}
          signedInHint={signedInHint}
          signedOutHint={signedOutHint}
          initialOpen={initialOpen}
          reduce={reduce}
        />
      </div>
    </FormsFrame>
  );
}

function ClerkUserButtonRun({
  bounce,
  visualDuration,
  contentDelay,
  fullName,
  email,
  initials,
  manageLabel,
  signOutLabel,
  signInLabel,
  signedInHint,
  signedOutHint,
  initialOpen,
  reduce,
}: {
  bounce: number;
  visualDuration: number;
  contentDelay: number;
  fullName: string;
  email: string;
  initials: string;
  manageLabel: string;
  signOutLabel: string;
  signInLabel: string;
  signedInHint: string;
  signedOutHint: string;
  initialOpen: boolean;
  reduce: boolean;
}) {
  const [signedIn, setSignedIn] = useState(true);
  const spring = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, bounce, visualDuration };
  const contentAnimations = {
    initial: reduce ? (false as const) : { opacity: 0, filter: 'blur(8px)' },
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: reduce ? { duration: 0 } : { delay: contentDelay },
    },
    exit: reduce ? undefined : { opacity: 0, filter: 'blur(8px)' },
  };

  return (
    <>
      <header className="forms-user-header">
        <AnimatePresence mode="popLayout" initial={false}>
          {signedIn ? (
            <UserButton
              key="user-button"
              spring={spring}
              contentAnimations={contentAnimations}
              fullName={fullName}
              email={email}
              initials={initials}
              manageLabel={manageLabel}
              signOutLabel={signOutLabel}
              initialOpen={initialOpen}
              onSignOut={() => setSignedIn(false)}
            />
          ) : (
            <motion.button
              key="sign-in"
              type="button"
              className="forms-user-signin"
              onClick={() => setSignedIn(true)}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
              transition={spring}
            >
              {signInLabel}
            </motion.button>
          )}
        </AnimatePresence>
      </header>
      <div className="forms-user-body">
        <p className="forms-user-hint">
          {signedIn ? signedInHint : signedOutHint}
        </p>
      </div>
    </>
  );
}

function UserButton({
  spring,
  contentAnimations,
  fullName,
  email,
  initials,
  manageLabel,
  signOutLabel,
  initialOpen,
  onSignOut,
}: {
  spring: { duration: number } | { type: 'spring'; bounce: number; visualDuration: number };
  contentAnimations: {
    initial: false | { opacity: number; filter: string };
    animate: { opacity: number; filter: string; transition: { duration?: number; delay?: number } };
    exit: undefined | { opacity: number; filter: string };
  };
  fullName: string;
  email: string;
  initials: string;
  manageLabel: string;
  signOutLabel: string;
  initialOpen: boolean;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(initialOpen);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div
      className="forms-user-root"
      ref={rootRef}
      data-open={open ? 'true' : 'false'}
    >
      <AnimatePresence>
        {!open ? (
          <motion.button
            key="closed"
            type="button"
            layoutId="clerk-userbtn"
            className="forms-user-closed"
            style={{ borderRadius: 99 }}
            transition={spring}
            onClick={() => setOpen(true)}
            aria-label="Open account menu"
            aria-expanded="false"
            aria-haspopup="menu"
          >
            <Avatar initials={initials} />
          </motion.button>
        ) : (
          <motion.div
            key="open"
            layoutId="clerk-userbtn"
            className="forms-user-open"
            style={{ borderRadius: 16 }}
            transition={spring}
            role="menu"
            aria-label="Account menu"
          >
            <div className="forms-user-header-block">
              <div style={{ alignSelf: 'center' }}>
                <Avatar initials={initials} large />
              </div>
              <motion.div
                className="forms-user-header-copy"
                initial={contentAnimations.initial}
                animate={contentAnimations.animate}
                exit={contentAnimations.exit}
              >
                <p>{fullName}</p>
                <p>{email}</p>
              </motion.div>
            </div>
            <motion.div
              className="forms-user-menu"
              initial={contentAnimations.initial}
              animate={contentAnimations.animate}
              exit={contentAnimations.exit}
            >
              <button
                type="button"
                role="menuitem"
                className="forms-user-item"
                onClick={() => setOpen(false)}
              >
                {manageLabel}
              </button>
              <button
                type="button"
                role="menuitem"
                className="forms-user-item"
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
              >
                {signOutLabel}
              </button>
              <p className="forms-user-credit">Uncomfortable Academy</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
