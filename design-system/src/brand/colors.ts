export const BRAND_COLORS = [
  {
    name: '--ink',
    hex: '#212121',
    role: 'Ink',
    usage: 'Rest state. Body text on paper. Inverse surface.',
  },
  {
    name: '--paper',
    hex: '#FFFFFF',
    role: 'Paper',
    usage: 'Rest state. Default surface. White type on blue.',
  },
  {
    name: '--soft',
    hex: '#F2F2F2',
    role: 'Soft',
    usage: 'Rest state. Quiet surface. Muted type on ink.',
  },
  {
    name: '--line',
    hex: '#D9D9D9',
    role: 'Line',
    usage: 'Rest state. Hairline on paper. Not body text.',
  },
  {
    name: '--quiet',
    hex: '#A6A6A6',
    role: 'Quiet',
    usage: 'Rest state. Hairlines and disabled marks only. Never body text.',
  },
  {
    name: '--charcoal',
    hex: '#4A4A4A',
    role: 'Charcoal',
    usage: 'Rest state. Lowest body text allowed on paper.',
  },
  {
    name: '--accent-blue',
    hex: '#0035B1',
    role: 'Blue',
    usage: 'Hover and :focus-visible fill. White type on it.',
  },
  {
    name: '--accent-yellow',
    hex: '#DEF54F',
    role: 'Yellow',
    usage: 'Press :active and confirmed success fill. Ink type on it.',
  },
] as const;

export const CONTRAST_PAIRS = [
  {
    foreground: '--ink',
    foregroundHex: '#212121',
    background: '--paper',
    backgroundHex: '#FFFFFF',
    role: 'Body text on paper at rest',
    bodyText: true,
  },
  {
    foreground: '--charcoal',
    foregroundHex: '#4A4A4A',
    background: '--paper',
    backgroundHex: '#FFFFFF',
    role: 'Muted body text on paper at rest',
    bodyText: true,
  },
  {
    foreground: '--paper',
    foregroundHex: '#FFFFFF',
    background: '--ink',
    backgroundHex: '#212121',
    role: 'Inverse body text on ink at rest',
    bodyText: true,
  },
  {
    foreground: '--soft',
    foregroundHex: '#F2F2F2',
    background: '--ink',
    backgroundHex: '#212121',
    role: 'Muted inverse text on ink at rest',
    bodyText: true,
  },
  {
    foreground: '--paper',
    foregroundHex: '#FFFFFF',
    background: '--accent-blue',
    backgroundHex: '#0035B1',
    role: 'White type on blue hover and focus',
    bodyText: true,
  },
  {
    foreground: '--ink',
    foregroundHex: '#212121',
    background: '--accent-yellow',
    backgroundHex: '#DEF54F',
    role: 'Ink type on yellow press and success',
    bodyText: true,
  },
  {
    foreground: '--quiet',
    foregroundHex: '#A6A6A6',
    background: '--paper',
    backgroundHex: '#FFFFFF',
    role: 'Disabled mark on paper. Not body text.',
    bodyText: false,
  },
  {
    foreground: '--line',
    foregroundHex: '#D9D9D9',
    background: '--paper',
    backgroundHex: '#FFFFFF',
    role: 'Hairline on paper. Not body text.',
    bodyText: false,
  },
] as const;

export const REJECTED_COLORS = [
  { hex: '#0170B9', reason: 'Astra global color 0. Not the kit blue.' },
  { hex: '#6EC1E4', reason: 'Kit primary cyan. Not the accent pair.' },
  { hex: '#2A6FFB', reason: 'Kit link blue. Not the accent pair.' },
  { hex: '#FCB900', reason: 'WordPress preset gold. Not the kit yellow.' },
] as const;
