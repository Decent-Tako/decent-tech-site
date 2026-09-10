// About Ben page cursor: ribbons over the whole page. The host sits over
// the copy with pointer-events none, so the pointer is read from document.
import Ribbons from '../../react-bits/vendor/animations/ribbons/Ribbons';
import type { SceneProps } from '../scenes';
import { list, number, useSceneState } from '../sceneSupport';

const DEFAULT_COLORS = ['#ffcb73', '#5b8fa3', '#f2f1e8'];

export default function RibbonsScene({ host, dataset, onReady }: SceneProps) {
  const { paused } = useSceneState(host);
  return (
    <Ribbons
      colors={list(dataset.colors, DEFAULT_COLORS)}
      baseThickness={number(dataset.thickness, 24)}
      baseSpring={0.03}
      baseFriction={0.9}
      maxAge={500}
      pointCount={50}
      speedMultiplier={0.6}
      enableFade
      enableShaderEffect
      effectAmplitude={2}
      trackDocument
      paused={paused}
      onReady={onReady}
    />
  );
}
