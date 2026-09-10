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
  CLERK_CONDITIONAL_DEFAULTS,
  EXAMPLES,
  MOTION_RUNTIME,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type ClerkConditionalFieldProps = {
  bounce?: number;
  visualDuration?: number;
  yFrom?: number;
  heading?: string;
  description?: string;
  emailLabel?: string;
  passwordLabel?: string;
  submitLabel?: string;
  doneLabel?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  initialOpen?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function ConditionalField({
  open,
  label,
  error,
  yFrom,
  reduce,
  skipEnter,
  ...props
}: ComponentProps<'input'> & {
  open: boolean;
  label: string;
  error?: string | null;
  yFrom: number;
  reduce: boolean;
  skipEnter: boolean;
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
      data-height={height}
    >
      <div ref={measureRef} style={{ position: 'relative' }}>
        <AnimatePresence mode="popLayout">
          {open && (
            <motion.div
              key="password-field"
              className="forms-auth__field"
              initial={reduce || skipEnter ? false : { opacity: 0, y: yFrom }}
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

export function ClerkConditionalField({
  bounce = CLERK_CONDITIONAL_DEFAULTS.bounce,
  visualDuration = CLERK_CONDITIONAL_DEFAULTS.visualDuration,
  yFrom = CLERK_CONDITIONAL_DEFAULTS.yFrom,
  heading = CLERK_CONDITIONAL_DEFAULTS.heading,
  description = CLERK_CONDITIONAL_DEFAULTS.description,
  emailLabel = CLERK_CONDITIONAL_DEFAULTS.emailLabel,
  passwordLabel = CLERK_CONDITIONAL_DEFAULTS.passwordLabel,
  submitLabel = CLERK_CONDITIONAL_DEFAULTS.submitLabel,
  doneLabel = CLERK_CONDITIONAL_DEFAULTS.doneLabel,
  emailPlaceholder = CLERK_CONDITIONAL_DEFAULTS.emailPlaceholder,
  passwordPlaceholder = CLERK_CONDITIONAL_DEFAULTS.passwordPlaceholder,
  initialOpen = CLERK_CONDITIONAL_DEFAULTS.initialOpen,
  reducedMotion = CLERK_CONDITIONAL_DEFAULTS.reducedMotion,
}: ClerkConditionalFieldProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const ids = useId();

  return (
    <FormsFrame
      title="Clerk conditional field"
      mechanism={
        <>
          <code>resize()</code> writes the measured field height.{' '}
          <code>animate=&#123;&#123; height &#125;&#125;</code> opens the box.
          Inner presence fades the password field.
        </>
      }
      docs={MOTION_RUNTIME.docsResize}
      extraDocs={MOTION_RUNTIME.docsPresence}
      example={EXAMPLES.clerkConditionalField.page}
      live={EXAMPLES.clerkConditionalField.live}
      fixedNote="Card width stays 25 rem so the email and password fields stay readable. willChange height and the relative measure node stay fixed because that is the resize() loop. Replay remounts the form. This animation is one-shot per reveal."
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="clerk-conditional-field"
      running={!reduce}
      runId={runId}
    >
      <div className="forms-stage">
        <ClerkConditionalFieldRun
          key={`${runId}-${initialOpen}`}
          bounce={bounce}
          visualDuration={visualDuration}
          yFrom={yFrom}
          heading={heading}
          description={description}
          emailLabel={emailLabel}
          passwordLabel={passwordLabel}
          submitLabel={submitLabel}
          doneLabel={doneLabel}
          emailPlaceholder={emailPlaceholder}
          passwordPlaceholder={passwordPlaceholder}
          initialOpen={initialOpen}
          reduce={reduce}
          ids={ids}
        />
      </div>
    </FormsFrame>
  );
}

function ClerkConditionalFieldRun({
  bounce,
  visualDuration,
  yFrom,
  heading,
  description,
  emailLabel,
  passwordLabel,
  submitLabel,
  doneLabel,
  emailPlaceholder,
  passwordPlaceholder,
  initialOpen,
  reduce,
  ids,
}: {
  bounce: number;
  visualDuration: number;
  yFrom: number;
  heading: string;
  description: string;
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
  doneLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  initialOpen: boolean;
  reduce: boolean;
  ids: string;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(initialOpen);
  const [done, setDone] = useState(false);
  const emailId = `${ids}-email`;
  const passwordId = `${ids}-password`;

  useEffect(() => {
    if (!showPassword) return;
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowPassword(false);
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [showPassword]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (email && !password) {
      setShowPassword(true);
    } else {
      setDone(true);
    }
  };

  return (
    <MotionConfig
      transition={
        reduce
          ? { duration: 0 }
          : { type: 'spring', bounce, visualDuration }
      }
    >
      <div className="forms-auth__root">
        <div className="forms-auth__card-container">
          <div className="forms-auth__card">
            <h3 className="forms-auth__card-title">{heading}</h3>
            <p className="forms-auth__card-description">{description}</p>
            <form onSubmit={handleSubmit}>
              <div className="forms-auth__field">
                <label htmlFor={emailId}>{emailLabel}</label>
                <input
                  required
                  placeholder={emailPlaceholder}
                  type="email"
                  name="email"
                  id={emailId}
                  autoComplete="username"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
              </div>
              <ConditionalField
                label={passwordLabel}
                name="password"
                id={passwordId}
                open={showPassword}
                type="password"
                autoComplete="new-password"
                placeholder={passwordPlaceholder}
                yFrom={yFrom}
                reduce={reduce}
                skipEnter={initialOpen}
                onBlur={({ target }) => {
                  setShowPassword(target.value.length > 0);
                }}
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                required
              />
              <button className="forms-btn" type="submit">
                {done ? doneLabel : submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
