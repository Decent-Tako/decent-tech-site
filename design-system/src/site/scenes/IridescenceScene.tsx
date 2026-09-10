// About Ben page background, the aurora. About Ben is the inside of the
// steel dot, so the field is steel and the aurora is gold and cream over it.
// Calm: a low speed and a small amplitude.
//
// The pointer does nothing here: Ben asked for no cursor features on
// 2026-09-10. The scene keeps its own motion.
import Iridescence from '../../react-bits/vendor/backgrounds/iridescence/Iridescence';
import type { SceneProps } from '../scenes';
import { number, rgb, useSceneState } from '../sceneSupport';

export default function IridescenceScene({ host, dataset, onReady }: SceneProps) {
  const { paused, rate } = useSceneState(host);
  return (
    <Iridescence
      color={rgb(dataset.color, rgb('#ffcb73', [1, 1, 1]))}
      speed={number(dataset.speed, 0.5) * rate}
      amplitude={number(dataset.amplitude, 0.1)}
      mouseReact={false}
      paused={paused}
      onReady={onReady}
    />
  );
}
