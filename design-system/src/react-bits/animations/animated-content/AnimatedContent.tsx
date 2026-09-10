import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { FEATURES, HERO, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamAnimatedContent from '../../vendor/animations/animated-content/AnimatedContent';
import { ANIMATED_CONTENT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './animated-content.css';

export type AnimatedContentProps = {
  distance?: (typeof ANIMATED_CONTENT_DEFAULTS)['distance'];
  direction?: (typeof ANIMATED_CONTENT_DEFAULTS)['direction'];
  reverse?: (typeof ANIMATED_CONTENT_DEFAULTS)['reverse'];
  duration?: (typeof ANIMATED_CONTENT_DEFAULTS)['duration'];
  ease?: (typeof ANIMATED_CONTENT_DEFAULTS)['ease'];
  initialOpacity?: (typeof ANIMATED_CONTENT_DEFAULTS)['initialOpacity'];
  animateOpacity?: (typeof ANIMATED_CONTENT_DEFAULTS)['animateOpacity'];
  scale?: (typeof ANIMATED_CONTENT_DEFAULTS)['scale'];
  threshold?: (typeof ANIMATED_CONTENT_DEFAULTS)['threshold'];
  delay?: (typeof ANIMATED_CONTENT_DEFAULTS)['delay'];
  disappearAfter?: (typeof ANIMATED_CONTENT_DEFAULTS)['disappearAfter'];
  disappearDuration?: (typeof ANIMATED_CONTENT_DEFAULTS)['disappearDuration'];
  disappearEase?: (typeof ANIMATED_CONTENT_DEFAULTS)['disappearEase'];
  reducedMotion?: ReducedMotionMode;
};

export type AnimatedState = 'pending' | 'visible' | 'gone';

const CARD = FEATURES[0];

export function AnimatedContent({
  distance = ANIMATED_CONTENT_DEFAULTS.distance,
  direction = ANIMATED_CONTENT_DEFAULTS.direction,
  reverse = ANIMATED_CONTENT_DEFAULTS.reverse,
  duration = ANIMATED_CONTENT_DEFAULTS.duration,
  ease = ANIMATED_CONTENT_DEFAULTS.ease,
  initialOpacity = ANIMATED_CONTENT_DEFAULTS.initialOpacity,
  animateOpacity = ANIMATED_CONTENT_DEFAULTS.animateOpacity,
  scale = ANIMATED_CONTENT_DEFAULTS.scale,
  threshold = ANIMATED_CONTENT_DEFAULTS.threshold,
  delay = ANIMATED_CONTENT_DEFAULTS.delay,
  disappearAfter = ANIMATED_CONTENT_DEFAULTS.disappearAfter,
  disappearDuration = ANIMATED_CONTENT_DEFAULTS.disappearDuration,
  disappearEase = ANIMATED_CONTENT_DEFAULTS.disappearEase,
  reducedMotion = ANIMATED_CONTENT_DEFAULTS.reducedMotion,
}: AnimatedContentProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [state, setState] = useState<AnimatedState>('pending');
  const reduce = useReduce(reducedMotion);

  // The upstream file keeps its timeline private. Pause holds the gsap
  // global timeline instead; one story renders at a time. Unmount resumes it.
  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  // Reduced motion: no travel, no delay, and a zero duration, so the final
  // state shows at once. Disappearance keeps its timing.
  const motion = reduce
    ? { distance: 0, duration: 0, delay: 0, scale: 1 }
    : { distance, duration, delay, scale };

  return (
    <ReactBitsFrame
      title="Animated Content"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              <code>gsap.set</code> offsets the wrapper by <code>{distance}</code> px on
              the {direction} axis, at scale <code>{scale}</code>
              {animateOpacity ? (
                <>
                  {' '}
                  and opacity <code>{initialOpacity}</code>
                </>
              ) : null}
              . A <code>ScrollTrigger</code> at{' '}
              <code>top {Math.round((1 - threshold) * 100)}%</code> plays a timeline
              once to the rest pose over <code>{duration}</code> s with ease{' '}
              <code>{ease}</code>. With <code>disappearAfter</code> above 0 a second
              tween sends it off again.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the wrapper, so the trigger fires again."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The scroller is the window, so the container prop is not a control. The callbacks write the state onto the stage. The content is the Week 0 card from src/pages/content.ts with the placeholder photograph."
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
      stageTestId="animated-content-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': state,
        'data-direction': direction,
      }}
    >
      <UpstreamAnimatedContent
        key={run}
        className="animated-content__card"
        distance={motion.distance}
        direction={direction}
        reverse={reverse}
        duration={motion.duration}
        ease={ease}
        initialOpacity={initialOpacity}
        animateOpacity={animateOpacity}
        scale={motion.scale}
        threshold={threshold}
        delay={motion.delay}
        disappearAfter={disappearAfter}
        disappearDuration={disappearDuration}
        disappearEase={disappearEase}
        onComplete={() => setState('visible')}
        onDisappearanceComplete={() => setState('gone')}
        data-testid="animated-content-card"
      >
        <img
          className="animated-content__photo"
          src={CARD.photo.src}
          alt={CARD.photo.alt}
          width={640}
          height={400}
        />
        <p className="animated-content__kicker">{CARD.kicker}</p>
        <p className="animated-content__title">{CARD.title}</p>
        <p className="animated-content__copy">{CARD.copy}</p>
        <p className="animated-content__goal">
          {HERO.facts[0].label} {HERO.facts[0].value}. {PHOTOS.hero.caption}.
        </p>
      </UpstreamAnimatedContent>
    </ReactBitsFrame>
  );
}
