// Portfolio page background, the starfield. Portfolio is the inside of the
// vermilion dot, so the field behind the canvas is vermilion and the stars
// are cream and gold. The canvas is transparent, so the field shows through;
// a hue shift to the gold angle with a part saturation spreads the star hues
// between cream and gold.
//
// The pointer does nothing here: Ben asked for no cursor features on
// 2026-09-10. The scene keeps its own motion.
import Galaxy from '../../react-bits/vendor/backgrounds/galaxy/Galaxy';
import type { SceneProps } from '../scenes';
import { number, useSceneState } from '../sceneSupport';

export default function GalaxyScene({ host, dataset, onReady }: SceneProps) {
  const { paused, rate } = useSceneState(host);
  return (
    <Galaxy
      density={number(dataset.density, 1.4)}
      hueShift={number(dataset.hue, 40)}
      saturation={number(dataset.saturation, 0.55)}
      glowIntensity={number(dataset.glow, 0.5)}
      starSpeed={number(dataset.speed, 0.8) * rate}
      rotationSpeed={0.15 * rate}
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
