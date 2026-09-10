import { resize } from 'motion';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from 'motion/react';
import {
  useCallback,
  useEffect,
  useId,
  useState,
  type ComponentProps,
  type FormEvent,
} from 'react';

import { FormsFrame } from './Frame';
import {
  CLERK_SIGN_IN_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type ClerkSignInProps = {
  bounce?: number;
  visualDuration?: number;
  yFrom?: number;
  verifyDelayMs?: number;
  resendSeconds?: number;
  otpLength?: number;
  welcomeTitle?: string;
  createTitle?: string;
  verifyTitle?: string;
  description?: string;
  verifyDescription?: string;
  emailLabel?: string;
  passwordLabel?: string;
  continueLabel?: string;
  verifyLabel?: string;
  startOverLabel?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  reducedMotion?: ReducedMotionMode;
};

const SIGN_IN_VARIANTS = {
  default: { opacity: 1, scale: 1, y: 0, x: '-50%' },
  verifying: { opacity: 0.6, scale: 0.95, y: -10, x: '-50%' },
};

const VERIFY_VARIANTS = {
  default: { opacity: 0, y: 100, x: '-50%' },
  verifying: { opacity: 1, y: 0, x: '-50%' },
};

const TEXT_VARIANTS = {
  initial: { opacity: 0, filter: 'blur(10px)', y: -10 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
  exit: { opacity: 0, filter: 'blur(10px)', y: 10 },
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function Spinner({ size = 12 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} aria-hidden="true">
      <div className="forms-spinner" style={{ width: size, height: size }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="forms-spinner__bar"
            style={{
              transform: `rotate(${index * 30}deg) translate(146%)`,
              animationDelay: `-${1.2 - index * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ConditionalField({
  open,
  label,
  error,
  yFrom,
  reduce,
  ...props
}: ComponentProps<'input'> & {
  open: boolean;
  label: string;
  error?: string | null;
  yFrom: number;
  reduce: boolean;
}) {
  const [height, setHeight] = useState(0);
  const internalId = useId();
  const id = props.id || internalId;

  const measureRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    setHeight(el.getBoundingClientRect().height);
    return resize(el, (_, { height: next }) => setHeight(next));
  }, []);

  return (
    <motion.div
      className="forms-auth__reveal"
      animate={{ height: open ? height : 0 }}
      style={{ willChange: 'height' }}
      data-open={open ? 'true' : 'false'}
    >
      <div ref={measureRef} style={{ position: 'relative' }}>
        <AnimatePresence mode="popLayout">
          {open && (
            <motion.div
              key="password-field"
              className="forms-auth__field"
              initial={reduce ? false : { opacity: 0, y: yFrom }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 0 }}
            >
              <label htmlFor={id}>{label}</label>
              <input autoFocus {...props} id={id} />
              {error ? <p className="forms-auth__field-error">{error}</p> : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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
    <div className="forms-otp">
      <input
        className="forms-otp__input"
        value={code}
        onChange={(event) =>
          setCode(event.target.value.replace(/\D/g, '').slice(0, length))
        }
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="Verification code"
        autoFocus={autoFocus}
      />
      <div className="forms-otp__slots" aria-hidden="true">
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className="forms-otp__slot"
            data-active={index === activeIndex}
          >
            {code[index] ?? ''}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResendButton({
  seconds,
  ...props
}: ComponentProps<'button'> & { seconds: number }) {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => (prev <= 0 ? prev : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      {...props}
      type="button"
      className="forms-resend"
      disabled={countdown > 0}
    >
      Did not receive a code? Resend {countdown > 0 ? `(${countdown})` : ''}
    </button>
  );
}

export function ClerkSignIn({
  bounce = CLERK_SIGN_IN_DEFAULTS.bounce,
  visualDuration = CLERK_SIGN_IN_DEFAULTS.visualDuration,
  yFrom = CLERK_SIGN_IN_DEFAULTS.yFrom,
  verifyDelayMs = CLERK_SIGN_IN_DEFAULTS.verifyDelayMs,
  resendSeconds = CLERK_SIGN_IN_DEFAULTS.resendSeconds,
  otpLength = CLERK_SIGN_IN_DEFAULTS.otpLength,
  welcomeTitle = CLERK_SIGN_IN_DEFAULTS.welcomeTitle,
  createTitle = CLERK_SIGN_IN_DEFAULTS.createTitle,
  verifyTitle = CLERK_SIGN_IN_DEFAULTS.verifyTitle,
  description = CLERK_SIGN_IN_DEFAULTS.description,
  verifyDescription = CLERK_SIGN_IN_DEFAULTS.verifyDescription,
  emailLabel = CLERK_SIGN_IN_DEFAULTS.emailLabel,
  passwordLabel = CLERK_SIGN_IN_DEFAULTS.passwordLabel,
  continueLabel = CLERK_SIGN_IN_DEFAULTS.continueLabel,
  verifyLabel = CLERK_SIGN_IN_DEFAULTS.verifyLabel,
  startOverLabel = CLERK_SIGN_IN_DEFAULTS.startOverLabel,
  emailPlaceholder = CLERK_SIGN_IN_DEFAULTS.emailPlaceholder,
  passwordPlaceholder = CLERK_SIGN_IN_DEFAULTS.passwordPlaceholder,
  reducedMotion = CLERK_SIGN_IN_DEFAULTS.reducedMotion,
}: ClerkSignInProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);

  return (
    <FormsFrame
      title="Clerk sign-in"
      mechanism={
        <>
          Parent <code>animate</code> sets the variant name. The sign-in card
          scales with inherited variants. <code>resize()</code> opens the
          password field. The OTP card stacks with <code>AnimatePresence</code>.
        </>
      }
      docs={MOTION_RUNTIME.docsVariants}
      extraDocs={MOTION_RUNTIME.docsResize}
      example={EXAMPLES.clerkSignIn.page}
      live={EXAMPLES.clerkSignIn.live}
      fixedNote="Card width stays 25 rem and x stays -50% because the card is left 50%. OTP length default is 6. Replay remounts the flow. This animation is one-shot per step."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="clerk-sign-in"
      running={!reduce}
      runId={runId}
    >
      <div className="forms-stage">
        <ClerkSignInRun
          key={runId}
          bounce={bounce}
          visualDuration={visualDuration}
          yFrom={yFrom}
          verifyDelayMs={verifyDelayMs}
          resendSeconds={resendSeconds}
          otpLength={otpLength}
          welcomeTitle={welcomeTitle}
          createTitle={createTitle}
          verifyTitle={verifyTitle}
          description={description}
          verifyDescription={verifyDescription}
          emailLabel={emailLabel}
          passwordLabel={passwordLabel}
          continueLabel={continueLabel}
          verifyLabel={verifyLabel}
          startOverLabel={startOverLabel}
          emailPlaceholder={emailPlaceholder}
          passwordPlaceholder={passwordPlaceholder}
          reduce={reduce}
        />
      </div>
    </FormsFrame>
  );
}

function ClerkSignInRun({
  bounce,
  visualDuration,
  yFrom,
  verifyDelayMs,
  resendSeconds,
  otpLength,
  welcomeTitle,
  createTitle,
  verifyTitle,
  description,
  verifyDescription,
  emailLabel,
  passwordLabel,
  continueLabel,
  verifyLabel,
  startOverLabel,
  emailPlaceholder,
  passwordPlaceholder,
  reduce,
}: {
  bounce: number;
  visualDuration: number;
  yFrom: number;
  verifyDelayMs: number;
  resendSeconds: number;
  otpLength: number;
  welcomeTitle: string;
  createTitle: string;
  verifyTitle: string;
  description: string;
  verifyDescription: string;
  emailLabel: string;
  passwordLabel: string;
  continueLabel: string;
  verifyLabel: string;
  startOverLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  reduce: boolean;
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const ids = useId();

  const reset = () => {
    setIsVerifying(false);
    setResetKey((value) => value + 1);
  };

  const spring = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, bounce, visualDuration };

  return (
    <MotionConfig transition={spring}>
      <motion.div
        animate={isVerifying ? 'verifying' : 'default'}
        className="forms-auth__root"
        data-step={isVerifying ? 'verify' : 'form'}
      >
        <div className="forms-auth__card-container">
          <SignIn
            key={resetKey}
            yFrom={yFrom}
            verifyDelayMs={verifyDelayMs}
            welcomeTitle={welcomeTitle}
            createTitle={createTitle}
            description={description}
            emailLabel={emailLabel}
            passwordLabel={passwordLabel}
            continueLabel={continueLabel}
            emailPlaceholder={emailPlaceholder}
            passwordPlaceholder={passwordPlaceholder}
            reduce={reduce}
            ids={ids}
            onVerify={() => setIsVerifying(true)}
          />
          <AnimatePresence mode="popLayout">
            {isVerifying && (
              <Verify
                verifyDelayMs={verifyDelayMs}
                resendSeconds={resendSeconds}
                otpLength={otpLength}
                verifyTitle={verifyTitle}
                verifyDescription={verifyDescription}
                verifyLabel={verifyLabel}
                startOverLabel={startOverLabel}
                onCancel={reset}
                onComplete={reset}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  );
}

function SignIn({
  yFrom,
  verifyDelayMs,
  welcomeTitle,
  createTitle,
  description,
  emailLabel,
  passwordLabel,
  continueLabel,
  emailPlaceholder,
  passwordPlaceholder,
  reduce,
  ids,
  onVerify,
}: {
  yFrom: number;
  verifyDelayMs: number;
  welcomeTitle: string;
  createTitle: string;
  description: string;
  emailLabel: string;
  passwordLabel: string;
  continueLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  reduce: boolean;
  ids: string;
  onVerify: () => void;
}) {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailId = `${ids}-email`;
  const passwordId = `${ids}-password`;

  useEffect(() => {
    if (!showPassword) return;
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setPassword('');
        setShowPassword(false);
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [showPassword]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await wait(verifyDelayMs);
    setLoading(false);
    if (!showPassword) {
      setShowPassword(true);
    } else {
      onVerify();
    }
  };

  return (
    <motion.div
      variants={SIGN_IN_VARIANTS}
      className="forms-auth__card"
      initial="default"
      data-password={showPassword ? 'true' : 'false'}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {!showPassword ? (
          <motion.h3
            key="sign-in-title"
            className="forms-auth__card-title"
            variants={reduce ? undefined : TEXT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {welcomeTitle}
          </motion.h3>
        ) : (
          <motion.h3
            key="sign-up-title"
            className="forms-auth__card-title"
            variants={reduce ? undefined : TEXT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {createTitle}
          </motion.h3>
        )}
      </AnimatePresence>
      <p className="forms-auth__card-description">{description}</p>
      <form onSubmit={handleSubmit}>
        <div className="forms-auth__field">
          <label htmlFor={emailId}>{emailLabel}</label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder={emailPlaceholder}
            value={emailAddress}
            onChange={(event) => setEmailAddress(event.target.value)}
          />
        </div>
        <ConditionalField
          label={passwordLabel}
          name="password"
          id={passwordId}
          type="password"
          autoComplete="new-password"
          placeholder={passwordPlaceholder}
          required
          yFrom={yFrom}
          reduce={reduce}
          onBlur={({ target }) => setShowPassword(target.value.length > 0)}
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          open={showPassword}
        />
        <button
          className="forms-btn"
          type="submit"
          disabled={loading}
          aria-label={continueLabel}
        >
          {loading ? <Spinner size={12} /> : <span>{continueLabel}</span>}
        </button>
      </form>
    </motion.div>
  );
}

function Verify({
  verifyDelayMs,
  resendSeconds,
  otpLength,
  verifyTitle,
  verifyDescription,
  verifyLabel,
  startOverLabel,
  onCancel,
  onComplete,
}: {
  verifyDelayMs: number;
  resendSeconds: number;
  otpLength: number;
  verifyTitle: string;
  verifyDescription: string;
  verifyLabel: string;
  startOverLabel: string;
  onCancel: () => void;
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await wait(verifyDelayMs);
    setLoading(false);
    onComplete();
  };

  return (
    <motion.div
      className="forms-auth__card forms-auth__card--overlay"
      variants={VERIFY_VARIANTS}
      initial="default"
      animate="verifying"
      exit="default"
    >
      <h3 className="forms-auth__card-title">{verifyTitle}</h3>
      <p className="forms-auth__card-description">{verifyDescription}</p>
      <form onSubmit={handleSubmit}>
        <div className="forms-auth__field">
          <OTPInput autoFocus length={otpLength} />
        </div>
        <ResendButton seconds={resendSeconds} />
        <button
          className="forms-btn"
          type="submit"
          disabled={loading}
          aria-label={verifyLabel}
        >
          {loading ? <Spinner size={12} /> : <span>{verifyLabel}</span>}
        </button>
      </form>
      <button
        className="forms-btn forms-btn--ghost"
        onClick={onCancel}
        type="button"
      >
        {startOverLabel}
      </button>
    </motion.div>
  );
}
