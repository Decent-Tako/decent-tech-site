// Get in touch page: a gold shine sweeps the email link text. The link text
// was already in the HTML; the scene renders the same text in a span.
import { useEffect } from 'react';

import ShinyText from '../../react-bits/vendor/text-animations/shiny-text/ShinyText';
import type { SceneProps } from '../scenes';
import { number, useReducedMotion } from '../sceneSupport';

export default function ShinyTextScene({ text, dataset, onReady }: SceneProps) {
  const reduce = useReducedMotion();
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    <ShinyText
      text={text}
      color={dataset.color ?? '#f2f1e8'}
      shineColor={dataset.shine ?? '#ffcb73'}
      speed={number(dataset.speed, 2.5)}
      delay={0.5}
      disabled={reduce}
    />
  );
}
