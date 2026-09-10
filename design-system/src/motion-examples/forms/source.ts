export const MOTION_RUNTIME = {
  package: 'motion',
  version: '13.2.0',
  licence: 'MIT',
  repository: 'https://github.com/motiondivision/motion',
  docsResize: 'https://motion.dev/docs/resize',
  docsPresence: 'https://motion.dev/docs/react-animate-presence',
  docsVariants: 'https://motion.dev/docs/react-animation#variants',
  docsLayout: 'https://motion.dev/docs/react-layout-animations',
  docsGestures: 'https://motion.dev/docs/react-gestures',
  docsMotionValue: 'https://motion.dev/docs/react-use-motion-value',
  docsTransform: 'https://motion.dev/docs/react-use-transform',
  docsAnimate: 'https://motion.dev/docs/react-animate',
} as const;

export const EXAMPLES = {
  clerkSignIn: {
    page: 'https://motion.dev/examples/react-clerk-sign-in',
    live: 'https://examples.motion.dev/react/clerk-sign-in',
  },
  clerkConditionalField: {
    page: 'https://motion.dev/examples/react-clerk-conditional-field',
    live: 'https://examples.motion.dev/react/clerk-conditional-field',
  },
  clerkUserButton: {
    page: 'https://motion.dev/examples/react-clerk-user-button',
    live: 'https://examples.motion.dev/react/clerk-user-button',
  },
  holdToConfirm: {
    page: 'https://motion.dev/examples/react-hold-to-confirm',
    live: 'https://examples.motion.dev/react/hold-to-confirm',
    sourceChunk: 'https://examples.motion.dev/assets/index-DTAfmC1D.js',
  },
  tabSelect: {
    page: 'https://motion.dev/examples/react-tab-select',
    live: 'https://examples.motion.dev/react/tab-select',
    sourceChunk: 'https://examples.motion.dev/assets/index-iBmF1DB8.js',
  },
} as const;

export type ReducedMotionMode = 'user' | 'always' | 'never';
export const REDUCED_MOTION_OPTIONS = ['user', 'always', 'never'] as const;

export function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

export const CLERK_CONDITIONAL_DEFAULTS = {
  bounce: 0.3,
  visualDuration: 0.4,
  yFrom: -8,
  heading: 'Join Uncomfortable Academy',
  description: 'Enter your email. A Circle password field opens if you are new.',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  submitLabel: 'Submit',
  doneLabel: 'Page is live',
  emailPlaceholder: 'you@wearemobilise.org',
  passwordPlaceholder: 'Create a Circle password',
  initialOpen: false,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const CLERK_SIGN_IN_DEFAULTS = {
  bounce: 0.3,
  visualDuration: 0.4,
  yFrom: -8,
  verifyDelayMs: 650,
  resendSeconds: 30,
  otpLength: 6,
  welcomeTitle: 'Join Uncomfortable Academy',
  createTitle: 'Create your Circle account',
  verifyTitle: 'Check your Circle inbox',
  description: 'Enter your details to continue',
  verifyDescription: 'Enter the code sent to your Circle email',
  emailLabel: 'Email address',
  passwordLabel: 'Password',
  continueLabel: 'Continue',
  verifyLabel: 'Verify',
  startOverLabel: 'Start over',
  emailPlaceholder: 'you@wearemobilise.org',
  passwordPlaceholder: 'Create a Circle password',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const CLERK_USER_BUTTON_DEFAULTS = {
  bounce: 0.15,
  visualDuration: 0.25,
  contentDelay: 0.15,
  fullName: 'Alex, Week 0',
  email: 'alex@wearemobilise.org',
  initials: 'AX',
  manageLabel: 'Publish page',
  signOutLabel: 'Sign out',
  signInLabel: 'Sign in',
  signedInHint: 'Open the account menu. Publish the page from here.',
  signedOutHint: 'Signed out. Select sign in to return.',
  initialOpen: false,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const HOLD_TO_CONFIRM_DEFAULTS = {
  holdDuration: 2,
  releaseDuration: 0.3,
  holdScale: 0.85,
  strokeWidthTo: 20,
  label: 'Hold to publish the page',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const TAB_SELECT_DEFAULTS = {
  tapScale: 0.9,
  tabs: ['Start', 'Learn', 'Tools', 'Challenge'] as string[],
  initialIndex: 0,
  reducedMotion: 'user' as ReducedMotionMode,
};
