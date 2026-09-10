// About page heading: the letters rise in one by one. The heading text was
// already in the HTML; the scene renders the same text in a span.
import { useEffect } from 'react';

import SplitText from '../../react-bits/vendor/text-animations/split-text/SplitText';
import type { SceneProps } from '../scenes';
import { number, useReducedMotion } from '../sceneSupport';

export default function SplitTextScene({ text, dataset, onReady }: SceneProps) {
  const reduce = useReducedMotion();
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    <SplitText
      text={text}
      tag="span"
      textAlign="left"
      splitType="chars"
      delay={reduce ? 0 : number(dataset.delay, 40)}
      duration={reduce ? 0 : number(dataset.duration, 1)}
      ease="power3.out"
      threshold={0}
      rootMargin="0px"
    />
  );
}
