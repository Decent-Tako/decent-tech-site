import { useState } from 'react';

import { DESTINATIONS, FEATURES, HERO, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamProfileCard from '../../vendor/components/profile-card/ProfileCard';
import { PROFILE_CARD_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './profile-card.css';

export type ProfileCardProps = {
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  showUserInfo?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];
const ACTION = DESTINATIONS[0];

export function ProfileCard({
  innerGradient = PROFILE_CARD_DEFAULTS.innerGradient,
  behindGlowEnabled = PROFILE_CARD_DEFAULTS.behindGlowEnabled,
  behindGlowColor = PROFILE_CARD_DEFAULTS.behindGlowColor,
  behindGlowSize = PROFILE_CARD_DEFAULTS.behindGlowSize,
  enableTilt = PROFILE_CARD_DEFAULTS.enableTilt,
  enableMobileTilt = PROFILE_CARD_DEFAULTS.enableMobileTilt,
  mobileTiltSensitivity = PROFILE_CARD_DEFAULTS.mobileTiltSensitivity,
  showUserInfo = PROFILE_CARD_DEFAULTS.showUserInfo,
  reducedMotion = PROFILE_CARD_DEFAULTS.reducedMotion,
}: ProfileCardProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [contacted, setContacted] = useState(false);
  const reduce = useReduce(reducedMotion);
  const tilt = enableTilt && !reduce;

  return (
    <ReactBitsFrame
      title="Profile Card"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Pointer motion on the shell drives CSS rotate and shine. Tilt
              eases toward the pointer with sensitivity{' '}
              <code>{mobileTiltSensitivity}</code>. Behind-glow colour is{' '}
              <code>{behindGlowColor}</code>.
            </>
          }
          controls="Pause cancels the tilt engine and holds the shine animation. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="avatarUrl, miniAvatarUrl, iconUrl, grainUrl, name, title, handle, status, contactText, className, and onContactClick are not controls. Photograph is PHOTOS.hero. Copy is FEATURES[0] and DESTINATIONS[0]. behindGlowColor is accent blue. Upstream glow was rgba(125, 190, 255, 0.67). Device orientation stays off in the stories."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setContacted(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="profile-card-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-contacted': contacted ? 'true' : 'false',
        'data-tilt': tilt ? 'true' : 'false',
        'data-info': showUserInfo ? 'true' : 'false',
      }}
    >
      <div className="profile-card-stage">
        <UpstreamProfileCard
          key={run}
          avatarUrl={PHOTOS.hero.src}
          miniAvatarUrl={PHOTOS.hero.src}
          iconUrl=""
          grainUrl=""
          innerGradient={innerGradient}
          behindGlowEnabled={behindGlowEnabled}
          behindGlowColor={behindGlowColor}
          behindGlowSize={behindGlowSize}
          enableTilt={tilt}
          enableMobileTilt={enableMobileTilt && !reduce}
          mobileTiltSensitivity={mobileTiltSensitivity}
          name={CARD.title}
          title={CARD.kicker}
          handle={CARD.id}
          status={`${HERO.facts[0].label} ${HERO.facts[0].value}`}
          contactText={ACTION.cta}
          showUserInfo={showUserInfo}
          onContactClick={() => setContacted(true)}
          paused={paused}
        />
      </div>
    </ReactBitsFrame>
  );
}
