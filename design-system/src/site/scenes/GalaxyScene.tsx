// Portfolio page background. The stars are white on a transparent canvas;
// the page token behind the scene gives the colour.
//
// The pointer does nothing here: Ben asked for no cursor features on
// 2026-09-10. The scene keeps its own motion.
import Galaxy from '../../react-bits/vendor/backgrounds/galaxy/Galaxy';
import type { SceneProps } from '../scenes';
import { number, useSceneState } from '../sceneSupport';

export default function GalaxyScene({ host, dataset, onReady }: SceneProps) {
  const { paused } = useSceneState(host);
  return (
    <Galaxy
      density={number(dataset.density, 1.4)}
      hueShift={number(dataset.hue, 0)}
      saturation={number(dataset.saturation, 0)}
      glowIntensity={number(dataset.glow, 0.5)}
      starSpeed={number(dataset.speed, 0.8)}
      rotationSpeed={0.15}
      twinkleIntensity={0.5}
      repulsionStrength={3}
      mouseInteraction={false}
      mouseRepulsion={false}
      transparent
      paused={paused}
      onReady={onReady}
    />
  );
}
