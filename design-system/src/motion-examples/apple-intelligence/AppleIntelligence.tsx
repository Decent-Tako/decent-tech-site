import { animate, MotionConfig, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import {
  APPLE_INTELLIGENCE_DEFAULTS,
  HOME_APPS,
  SCALE_X_EASE,
  type AcademyApp,
  type MixBlendMode,
  type TransformOrigin,
} from './appleIntelligenceData';
import './apple-intelligence.css';

export type AppleIntelligenceProps = {
  duration?: number;
  scaleXFrom?: number;
  scaleXTo?: number;
  scaleXDurationRatio?: number;
  mixBlendMode?: MixBlendMode;
  contrast?: number;
  brightness?: number;
  hueRotate?: number;
  transformOrigin?: TransformOrigin;
  maskFrom?: string;
  maskTo?: string;
  wallpaperSrc?: string;
  wallpaperAlt?: string;
  apps?: AcademyApp[];
  heading?: string;
  kicker?: string;
  reducedMotion?: 'user' | 'always' | 'never';
  replayNonce?: number;
};

export function AppleIntelligence({
  duration = APPLE_INTELLIGENCE_DEFAULTS.duration,
  scaleXFrom = APPLE_INTELLIGENCE_DEFAULTS.scaleXFrom,
  scaleXTo = APPLE_INTELLIGENCE_DEFAULTS.scaleXTo,
  scaleXDurationRatio = APPLE_INTELLIGENCE_DEFAULTS.scaleXDurationRatio,
  mixBlendMode = APPLE_INTELLIGENCE_DEFAULTS.mixBlendMode,
  contrast = APPLE_INTELLIGENCE_DEFAULTS.contrast,
  brightness = APPLE_INTELLIGENCE_DEFAULTS.brightness,
  hueRotate = APPLE_INTELLIGENCE_DEFAULTS.hueRotate,
  transformOrigin = APPLE_INTELLIGENCE_DEFAULTS.transformOrigin,
  maskFrom = APPLE_INTELLIGENCE_DEFAULTS.maskFrom,
  maskTo = APPLE_INTELLIGENCE_DEFAULTS.maskTo,
  wallpaperSrc = APPLE_INTELLIGENCE_DEFAULTS.wallpaperSrc,
  wallpaperAlt = APPLE_INTELLIGENCE_DEFAULTS.wallpaperAlt,
  apps = HOME_APPS,
  heading = APPLE_INTELLIGENCE_DEFAULTS.heading,
  kicker = APPLE_INTELLIGENCE_DEFAULTS.kicker,
  reducedMotion = APPLE_INTELLIGENCE_DEFAULTS.reducedMotion,
  replayNonce = APPLE_INTELLIGENCE_DEFAULTS.replayNonce,
}: AppleIntelligenceProps) {
  const [runId, setRunId] = useState(0);

  return (
    <MotionConfig
      reducedMotion={
        reducedMotion === 'never'
          ? 'never'
          : reducedMotion === 'always'
            ? 'always'
            : 'user'
      }
    >
      <figure className="apple-intelligence">
        <div className="apple-intelligence__bar">
          <p className="apple-intelligence__intro">
            Package <code>motion</code> 13.2.0. Licence MIT. Mechanism:{' '}
            <code>animate()</code> on a <code>cloneNode(true)</code> layer, with{' '}
            <code>maskImage</code>, <code>scaleX</code>, and <code>opacity</code>
            . Docs{' '}
            <a href="https://motion.dev/docs/react-animate">
              https://motion.dev/docs/react-animate
            </a>
            . Example{' '}
            <a href="https://motion.dev/examples/react-apple-intelligence">
              https://motion.dev/examples/react-apple-intelligence
            </a>
            . Live{' '}
            <a href="https://examples.motion.dev/react/apple-intelligence">
              https://examples.motion.dev/react/apple-intelligence
            </a>
            . Source{' '}
            <a href="https://github.com/motiondivision/motion">
              https://github.com/motiondivision/motion
            </a>
            . No extra animation runtime. <code>lucide-react</code> 1.43.0 is
            already in this catalogue for icons. No earlier Academy experiment
            used this example.
          </p>
          <button
            type="button"
            className="apple-intelligence__replay"
            onClick={() => setRunId((value) => value + 1)}
          >
            Replay
          </button>
        </div>
        <p className="apple-intelligence__fixed">
          The device frame stays 375 by 812 pixels because the ripple mask is
          authored for an iPhone screen with the origin at the side button. The
          scaleX ease stays {SCALE_X_EASE.join(', ')} from the upstream example.
          That curve is the snap-back of the cloned sheet.
        </p>
        <div className="apple-intelligence__stage">
          <PhoneScreen
            duration={duration}
            scaleXFrom={scaleXFrom}
            scaleXTo={scaleXTo}
            scaleXDurationRatio={scaleXDurationRatio}
            mixBlendMode={mixBlendMode}
            contrast={contrast}
            brightness={brightness}
            hueRotate={hueRotate}
            transformOrigin={transformOrigin}
            maskFrom={maskFrom}
            maskTo={maskTo}
            wallpaperSrc={wallpaperSrc}
            wallpaperAlt={wallpaperAlt}
            apps={apps}
            heading={heading}
            kicker={kicker}
            reducedMotion={reducedMotion}
            replayNonce={replayNonce}
            runId={runId}
          />
        </div>
      </figure>
    </MotionConfig>
  );
}

function PhoneScreen({
  duration,
  scaleXFrom,
  scaleXTo,
  scaleXDurationRatio,
  mixBlendMode,
  contrast,
  brightness,
  hueRotate,
  transformOrigin,
  maskFrom,
  maskTo,
  wallpaperSrc,
  wallpaperAlt,
  apps,
  heading,
  kicker,
  reducedMotion,
  replayNonce,
  runId,
}: Required<
  Pick<
    AppleIntelligenceProps,
    | 'duration'
    | 'scaleXFrom'
    | 'scaleXTo'
    | 'scaleXDurationRatio'
    | 'mixBlendMode'
    | 'contrast'
    | 'brightness'
    | 'hueRotate'
    | 'transformOrigin'
    | 'maskFrom'
    | 'maskTo'
    | 'wallpaperSrc'
    | 'wallpaperAlt'
    | 'heading'
    | 'kicker'
    | 'reducedMotion'
    | 'replayNonce'
  >
> & {
  apps: AcademyApp[];
  runId: number;
}) {
  const appContent = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const prefersReduce = useReducedMotion();
  const skip =
    reducedMotion === 'always' ||
    (reducedMotion === 'user' && Boolean(prefersReduce));

  useEffect(() => {
    if (skip) return;
    const content = appContent.current;
    const host = screen.current;
    if (!content || !host) return;

    const cloned = content.cloneNode(true) as HTMLDivElement;
    cloned.dataset.rippleClone = '';
    cloned.setAttribute('aria-hidden', 'true');
    host.appendChild(cloned);
    cloned.style.transformOrigin = transformOrigin;
    cloned.style.filter = `contrast(${contrast}%) brightness(${brightness}%) hue-rotate(${hueRotate}deg)`;
    cloned.style.mixBlendMode = mixBlendMode;

    const controls = animate(
      cloned,
      {
        scaleX: [scaleXFrom, scaleXTo],
        maskImage: [maskFrom, maskTo],
        opacity: [1, 1, 0],
      },
      {
        ease: 'linear',
        duration,
        scaleX: {
          duration: duration * scaleXDurationRatio,
          ease: [...SCALE_X_EASE],
        },
      },
    );

    return () => {
      controls.stop();
      cloned.remove();
    };
  }, [
    skip,
    duration,
    scaleXFrom,
    scaleXTo,
    scaleXDurationRatio,
    mixBlendMode,
    contrast,
    brightness,
    hueRotate,
    transformOrigin,
    maskFrom,
    maskTo,
    replayNonce,
    runId,
  ]);

  return (
    <div className="apple-intelligence__phone">
      <div className="apple-intelligence__screen" ref={screen}>
        <div className="apple-intelligence__island" />
        <div className="apple-intelligence__content" ref={appContent}>
          <img
            data-photo=""
            className="apple-intelligence__wallpaper"
            src={wallpaperSrc}
            alt={wallpaperAlt}
          />
          <div className="apple-intelligence__scrim" />
          <div className="apple-intelligence__grid-wrap">
            <div className="apple-intelligence__lockup">
              <p className="apple-intelligence__kicker">{kicker}</p>
              <h1 className="apple-intelligence__heading">{heading}</h1>
            </div>
            <AppGrid apps={apps} />
          </div>
        </div>
        <div className="apple-intelligence__home" />
      </div>
    </div>
  );
}

function AppGrid({ apps }: { apps: AcademyApp[] }) {
  return (
    <div className="apple-intelligence__grid">
      {apps.map((app) => (
        <div className="apple-intelligence__icon" key={app.label}>
          <div
            className="apple-intelligence__icon-inner"
            style={{ backgroundColor: app.color }}
          >
            <app.icon
              size={32}
              color={app.inkIcon ? '#212121' : '#FFFFFF'}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <p className="apple-intelligence__label">{app.label}</p>
        </div>
      ))}
    </div>
  );
}
