import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { FEATURES, HERO, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFadeContent from '../../vendor/animations/fade-content/FadeContent';
import { FADE_CONTENT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './fade-content.css';

export type FadeContentProps = {
  blur?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  reducedMotion?: ReducedMotionMode;
};

export type FadeState = 'pending' | 'visible' | 'gone';

const CARD = FEATURES[0];

export function FadeContent({
  blur = FADE_CONTENT_DEFAULTS.blur,
  duration = FADE_CONTENT_DEFAULTS.duration,
  ease = FADE_CONTENT_DEFAULTS.ease,
  delay = FADE_CONTENT_DEFAULTS.delay,
  threshold = FADE_CONTENT_DEFAULTS.threshold,
  initialOpacity = FADE_CONTENT_DEFAULTS.initialOpacity,
  disappearAfter = FADE_CONTENT_DEFAULTS.disappearAfter,
  disappearDuration = FADE_CONTENT_DEFAULTS.disappearDuration,
  disappearEase = FADE_CONTENT_DEFAULTS.disappearEase,
  reducedMotion = FADE_CONTENT_DEFAULTS.reducedMotion,
}: FadeContentProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [state, setState] = useState<FadeState>('pending');
  const reduce = useReduce(reducedMotion);

  // The upstream file keeps its timeline private. Pause holds the gsap
  // global timeline instead; one story renders at a time. Unmount resumes it.
  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  // Reduced motion: no blur, no delay, and a zero duration, so the final
  // state shows at once. Disappearance keeps its timing.
  const fade = reduce
    ? { blur: false, duration: 0, delay: 0 }
    : { blur, duration, delay };

  return (
    <ReactBitsFrame
      title="Fade Content"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              <code>gsap.set</code> hides the wrapper with <code>autoAlpha</code>{' '}
              <code>{initialOpacity}</code> and optional <code>blur(10px)</code>. A{' '}
              <code>ScrollTrigger</code> at <code>top {Math.round((1 - threshold) * 100)}%</code>{' '}
              plays a timeline once to <code>autoAlpha 1</code> over <code>{duration}</code>{' '}
              ms with ease <code>{ease}</code>. With <code>disappearAfter</code> above 0 a
              second tween fades it back.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the wrapper, so the trigger fires again."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The scroller is the window, so the container prop is not a control. The callbacks write the state onto the stage. The content is the Week 0 card from src/pages/content.ts with the placeholder photograph. Values above 10 are milliseconds and values of 10 or less are seconds, as upstream."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setState('pending');
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="fade-content-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': state,
      }}
    >
      <UpstreamFadeContent
        key={run}
        className="fade-content__card"
        blur={fade.blur}
        duration={fade.duration}
        ease={ease}
        delay={fade.delay}
        threshold={threshold}
        initialOpacity={initialOpacity}
        disappearAfter={disappearAfter}
        disappearDuration={disappearDuration}
        disappearEase={disappearEase}
        onComplete={() => setState('visible')}
        onDisappearanceComplete={() => setState('gone')}
        data-testid="fade-content-card"
      >
        <img
          className="fade-content__photo"
          src={CARD.photo.src}
          alt={CARD.photo.alt}
          width={640}
          height={400}
        />
        <p className="fade-content__kicker">{CARD.kicker}</p>
        <p className="fade-content__title">{CARD.title}</p>
        <p className="fade-content__copy">{CARD.copy}</p>
        <p className="fade-content__goal">
          {HERO.facts[0].label} {HERO.facts[0].value}. {PHOTOS.hero.caption}.
        </p>
      </UpstreamFadeContent>
    </ReactBitsFrame>
  );
}
