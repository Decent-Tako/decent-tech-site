import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'TextPressure',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/text-pressure',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TextPressure/TextPressure.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// `text` uses the Week 0 title; upstream default is Compressa. fontUrl is
// not a control: the repository cannot load a remote face. className,
// paused, reduced, and onPressure are not controls. fontFamily is Brand
// Sans; upstream default Roboto Flex. textColor is ink; upstream default
// #FFFFFF. strokeColor is accent blue; upstream default #FF0000.
export const TEXT_PRESSURE_DEFAULTS = {
  text: FEATURES[0].title,
  fontFamily: 'Brand Sans',
  width: true,
  weight: true,
  italic: true,
  alpha: false,
  flex: true,
  stroke: false,
  scale: false,
  textColor: '#212121',
  strokeColor: '#0035B1',
  minFontSize: 24,
  reducedMotion: 'never' as ReducedMotionMode,
};
