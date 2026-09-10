// Blog page heading: letters near the pointer scramble and settle. The
// heading text was already in the HTML; the scene renders it in spans.
import { useEffect } from 'react';

import ScrambledText from '../../react-bits/vendor/text-animations/scrambled-text/ScrambledText';
import type { SceneProps } from '../scenes';
import { number, useReducedMotion } from '../sceneSupport';

export default function ScrambledTextScene({ text, dataset, onReady }: SceneProps) {
  const reduce = useReducedMotion();
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    <ScrambledText
      inline
      radius={number(dataset.radius, 120)}
      duration={number(dataset.duration, 1.2)}
      speed={0.5}
      scrambleChars={dataset.chars ?? '.:'}
      paused={reduce}
    >
      {text}
    </ScrambledText>
  );
}
