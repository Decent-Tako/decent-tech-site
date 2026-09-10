// About Ben page background. Brand default: steel blue tint.
import Iridescence from '../../react-bits/vendor/backgrounds/iridescence/Iridescence';
import type { SceneProps } from '../scenes';
import { number, rgb, useSceneState } from '../sceneSupport';

export default function IridescenceScene({ host, dataset, onReady }: SceneProps) {
  const { paused } = useSceneState(host);
  return (
    <Iridescence
      color={rgb(dataset.color, rgb('#5b8fa3', [1, 1, 1]))}
      speed={number(dataset.speed, 1.2)}
      amplitude={number(dataset.amplitude, 0.2)}
      mouseReact
      paused={paused}
      onReady={onReady}
    />
  );
}
