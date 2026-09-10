import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from 'motion/react';
import { useEffect, useId, useState } from 'react';

import { CardsFrame } from './Frame';
import {
  CLERK_CARD_STACK_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  shouldReduce,
  type PresenceMode,
  type ReducedMotionMode,
} from './source';

export type ClerkCardStackProps = {
  bounce?: number;
  visualDuration?: number;
  overlayY?: number;
  recedeY?: number;
  recedeScale?: number;
  dimOpacity?: number;
  otpLength?: number;
  presenceMode?: PresenceMode;
  heading?: string;
  description?: string;
  verifyHeading?: string;
  verifyDescription?: string;
  submitLabel?: string;
  verifyLabel?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function ClerkCardStack({
  bounce = CLERK_CARD_STACK_DEFAULTS.bounce,
  visualDuration = CLERK_CARD_STACK_DEFAULTS.visualDuration,
  overlayY = CLERK_CARD_STACK_DEFAULTS.overlayY,
  recedeY = CLERK_CARD_STACK_DEFAULTS.recedeY,
  recedeScale = CLERK_CARD_STACK_DEFAULTS.recedeScale,
  dimOpacity = CLERK_CARD_STACK_DEFAULTS.dimOpacity,
  otpLength = CLERK_CARD_STACK_DEFAULTS.otpLength,
  presenceMode = CLERK_CARD_STACK_DEFAULTS.presenceMode,
  heading = CLERK_CARD_STACK_DEFAULTS.heading,
  description = CLERK_CARD_STACK_DEFAULTS.description,
  verifyHeading = CLERK_CARD_STACK_DEFAULTS.verifyHeading,
  verifyDescription = CLERK_CARD_STACK_DEFAULTS.verifyDescription,
  submitLabel = CLERK_CARD_STACK_DEFAULTS.submitLabel,
  verifyLabel = CLERK_CARD_STACK_DEFAULTS.verifyLabel,
  reducedMotion = CLERK_CARD_STACK_DEFAULTS.reducedMotion,
  replayNonce = CLERK_CARD_STACK_DEFAULTS.replayNonce,
}: ClerkCardStackProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const runKey = runId + replayNonce;

  return (
    <CardsFrame
      title="Clerk card stack"
      mechanism={
        <>
          <code>MotionConfig</code> sets a shared spring. The parent animates
          variant <code>verifying</code>. Sign-in uses{' '}
          <code>SIGN_IN_VARIANTS</code>. <code>AnimatePresence</code>{' '}
          <code>popLayout</code> mounts the OTP card with{' '}
          <code>VERIFY_VARIANTS</code>. The OTP field is an inline stand-in.
        </>
      }
      docs={MOTION_RUNTIME.docsPresence}
      example={EXAMPLES.clerkCardStack.page}
      live={EXAMPLES.clerkCardStack.live}
      source={EXAMPLES.clerkCardStack.source}
      extraRuntime="The guide names input-otp. This example stays dependency-free, as upstream."
      priorNote="No earlier Academy experiment used this example. It is not a Clerk SDK."
      fixedNote="Cards stay 25rem and centred with x -50% because the overlay is position absolute. transform-origin stays top centre so the lower card recedes from the masthead. Replay returns to the email card. This animation is one-shot on submit, so Replay is the control."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="clerk-card-stack"
      running={!reduce}
      runId={runKey}
    >
      <ClerkRun
        key={runKey}
        bounce={bounce}
        visualDuration={visualDuration}
        overlayY={overlayY}
        recedeY={recedeY}
        recedeScale={recedeScale}
        dimOpacity={dimOpacity}
        otpLength={otpLength}
        presenceMode={presenceMode}
        heading={heading}
        description={description}
        verifyHeading={verifyHeading}
        verifyDescription={verifyDescription}
        submitLabel={submitLabel}
        verifyLabel={verifyLabel}
        reduce={reduce}
      />
    </CardsFrame>
  );
}

function ClerkRun({
  bounce,
  visualDuration,
  overlayY,
  recedeY,
  recedeScale,
  dimOpacity,
  otpLength,
  presenceMode,
  heading,
  description,
  verifyHeading,
  verifyDescription,
  submitLabel,
  verifyLabel,
  reduce,
}: {
  bounce: number;
  visualDuration: number;
  overlayY: number;
  recedeY: number;
  recedeScale: number;
  dimOpacity: number;
  otpLength: number;
  presenceMode: PresenceMode;
  heading: string;
  description: string;
  verifyHeading: string;
  verifyDescription: string;
  submitLabel: string;
  verifyLabel: string;
  reduce: boolean;
}) {
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const emailId = useId();
  const transition: Transition = reduce
    ? { duration: 0 }
    : { type: 'spring', bounce, visualDuration };

  const signInVariants = {
    default: { opacity: 1, scale: 1, y: 0, x: '-50%' },
    verifying: {
      opacity: dimOpacity,
      scale: recedeScale,
      y: recedeY,
      x: '-50%',
    },
  };

  const verifyVariants = {
    default: { opacity: 0, y: overlayY, x: '-50%' },
    verifying: { opacity: 1, y: 0, x: '-50%' },
  };

  return (
    <div className="cards-example__stage cards-example__stage--clerk">
      <motion.div
        className="clerk-root"
        animate={isVerifying ? 'verifying' : 'default'}
        transition={transition}
        data-verifying={isVerifying ? 'true' : 'false'}
      >
        <motion.div
          variants={signInVariants}
          initial="default"
          className="clerk-card"
        >
          <h3>{heading}</h3>
          <p>{description}</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setIsVerifying(true);
            }}
          >
            <div className="clerk-field">
              <label htmlFor={emailId}>Email</label>
              <input
                required
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button className="clerk-btn" type="submit">
              {submitLabel}
            </button>
          </form>
        </motion.div>

        <AnimatePresence mode={presenceMode}>
          {isVerifying ? (
            <motion.div
              className="clerk-card clerk-card--overlay"
              variants={verifyVariants}
              initial="default"
              animate="verifying"
              exit="default"
              transition={transition}
            >
              <h3>{verifyHeading}</h3>
              <p>{verifyDescription}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setIsVerifying(false);
                  setEmail('');
                }}
              >
                <OTPInput autoFocus length={otpLength} />
                <ResendButton />
                <button className="clerk-btn" type="submit">
                  {verifyLabel}
                </button>
              </form>
              <button
                className="clerk-btn clerk-btn--ghost"
                type="button"
                onClick={() => {
                  setIsVerifying(false);
                  setEmail('');
                }}
                style={{ marginTop: '0.5rem', width: '100%' }}
              >
                Start over
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function OTPInput({
  length = 6,
  autoFocus,
}: {
  length?: number;
  autoFocus?: boolean;
}) {
  const [code, setCode] = useState('');
  const activeIndex = Math.min(code.length, length - 1);
  return (
    <div className="clerk-otp">
      <input
        className="clerk-otp__input"
        value={code}
        onChange={(event) =>
          setCode(event.target.value.replace(/\D/g, '').slice(0, length))
        }
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="Verification code"
        autoFocus={autoFocus}
      />
      <div className="clerk-otp__slots" aria-hidden="true">
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className="clerk-otp__slot"
            data-active={index === activeIndex}
          >
            {code[index] ?? ''}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResendButton() {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => (prev <= 0 ? prev : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      type="button"
      className="clerk-resend"
      disabled={countdown > 0}
    >
      Did not get a code? Resend{countdown > 0 ? ` (${countdown})` : ''}
    </button>
  );
}
